const pool = require("../config/db");


// =====================================================
// GET ALL INVENTORY
// =====================================================

const getInventory = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                i.id,
                i.product_id,
                p.name AS product_name,
                p.description,
                p.price,
                i.available_quantity,
                i.reserved_quantity,
                (i.available_quantity + i.reserved_quantity) AS total_quantity,
                i.updated_at
             FROM inventory i
             JOIN products p
             ON i.product_id = p.id
             ORDER BY i.product_id`
        );

        res.json({
            inventory: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// GET INVENTORY FOR A PRODUCT
// =====================================================

const getInventoryByProduct = async (req, res) => {
    try {

        const { productId } = req.params;

        const result = await pool.query(
            `SELECT
                i.id,
                i.product_id,
                p.name AS product_name,
                i.available_quantity,
                i.reserved_quantity,
                (i.available_quantity + i.reserved_quantity) AS total_quantity,
                i.updated_at
             FROM inventory i
             JOIN products p
             ON i.product_id = p.id
             WHERE i.product_id = $1`,
            [productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Inventory record not found"
            });
        }

        res.json({
            inventory: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// UPDATE INVENTORY
// ADMIN ONLY
// =====================================================

const updateInventory = async (req, res) => {
    try {

        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({
                message: "Valid quantity is required"
            });
        }

        // Check inventory record
        const inventoryResult = await pool.query(
            `SELECT *
             FROM inventory
             WHERE product_id = $1`,
            [productId]
        );

        if (inventoryResult.rows.length === 0) {
            return res.status(404).json({
                message: "Inventory record not found"
            });
        }

        const inventory = inventoryResult.rows[0];

        // Do not allow available quantity to become
        // less than already reserved quantity.
        if (quantity < inventory.reserved_quantity) {
            return res.status(400).json({
                message:
                    "Available quantity cannot be less than reserved quantity"
            });
        }

        const result = await pool.query(
            `UPDATE inventory
             SET available_quantity = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE product_id = $2
             RETURNING *`,
            [quantity, productId]
        );

        res.json({
            message: "Inventory updated successfully",
            inventory: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// CONFIRM SALES ORDER + RESERVE INVENTORY
// ADMIN ONLY
// =====================================================

const confirmSalesOrder = async (req, res) => {

    const client = await pool.connect();

    try {

        const { id } = req.params;

        // Start transaction
        await client.query("BEGIN");


        // -------------------------------------------------
        // 1. Lock the Sales Order
        // -------------------------------------------------

        const orderResult = await client.query(
            `SELECT
                id,
                quotation_id,
                customer_id,
                status,
                total_amount
             FROM sales_orders
             WHERE id = $1
             FOR UPDATE`,
            [id]
        );

        if (orderResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        const order = orderResult.rows[0];


        // -------------------------------------------------
        // 2. Check Sales Order status
        // -------------------------------------------------

        if (order.status !== "PENDING_CONFIRMATION") {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "Only pending Sales Orders can be confirmed"
            });
        }


        // -------------------------------------------------
        // 3. Get Sales Order Items
        // -------------------------------------------------

        const itemsResult = await client.query(
            `SELECT
                id,
                product_id,
                quantity
             FROM sales_order_items
             WHERE sales_order_id = $1`,
            [id]
        );

        if (itemsResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Sales Order has no items"
            });
        }


        // -------------------------------------------------
        // 4. Check inventory for every item
        // -------------------------------------------------

        for (const item of itemsResult.rows) {

            const inventoryResult = await client.query(
                `SELECT
                    id,
                    product_id,
                    available_quantity,
                    reserved_quantity
                 FROM inventory
                 WHERE product_id = $1
                 FOR UPDATE`,
                [item.product_id]
            );


            if (inventoryResult.rows.length === 0) {

                await client.query("ROLLBACK");

                return res.status(400).json({
                    message:
                        `Inventory not found for product ${item.product_id}`
                });
            }


            const inventory = inventoryResult.rows[0];


            // -------------------------------------------------
            // 5. Check available stock
            // -------------------------------------------------

            if (inventory.available_quantity < item.quantity) {

                await client.query("ROLLBACK");

                return res.status(400).json({
                    message:
                        `Insufficient inventory for product ${item.product_id}`,
                    available:
                        inventory.available_quantity,
                    requested:
                        item.quantity
                });
            }
        }


        // -------------------------------------------------
        // 6. Reserve inventory
        // -------------------------------------------------

        for (const item of itemsResult.rows) {

            // Update inventory
            await client.query(
                `UPDATE inventory
                 SET
                    available_quantity =
                        available_quantity - $1,
                    reserved_quantity =
                        reserved_quantity + $1,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE product_id = $2`,
                [
                    item.quantity,
                    item.product_id
                ]
            );


            // Create reservation record
            await client.query(
                `INSERT INTO inventory_reservations
                (sales_order_id, product_id, quantity)
                VALUES ($1, $2, $3)`,
                [
                    id,
                    item.product_id,
                    item.quantity
                ]
            );
        }


        // -------------------------------------------------
        // 7. Confirm Sales Order
        // -------------------------------------------------

        await client.query(
            `UPDATE sales_orders
             SET status = 'CONFIRMED'
             WHERE id = $1`,
            [id]
        );


        // -------------------------------------------------
        // 8. Commit transaction
        // -------------------------------------------------

        await client.query("COMMIT");


        res.json({
            message:
                "Sales Order confirmed and inventory reserved successfully",
            sales_order_id: Number(id),
            status: "CONFIRMED"
        });


    } catch (error) {

        // Rollback if anything fails
        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    } finally {

        client.release();

    }
};


module.exports = {
    getInventory,
    getInventoryByProduct,
    updateInventory,
    confirmSalesOrder
};