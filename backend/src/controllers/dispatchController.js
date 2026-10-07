const pool = require("../config/db");


// =====================================================
// CREATE DISPATCH
// =====================================================
const createDispatch = async (req, res) => {
    const client = await pool.connect();

    try {
        const { sales_order_id, tracking_number } = req.body;

        if (!sales_order_id) {
            return res.status(400).json({
                message: "Sales Order ID is required"
            });
        }

        await client.query("BEGIN");

        // -------------------------------------------------
        // Check Sales Order
        // -------------------------------------------------
        const orderResult = await client.query(
            `SELECT
                id,
                customer_id,
                status,
                total_amount
             FROM sales_orders
             WHERE id = $1
             FOR UPDATE`,
            [sales_order_id]
        );

        if (orderResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        const order = orderResult.rows[0];

        // -------------------------------------------------
        // Only CONFIRMED orders can be dispatched
        // -------------------------------------------------
        if (order.status !== "CONFIRMED") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "Only CONFIRMED Sales Orders can be dispatched"
            });
        }

        // -------------------------------------------------
        // Check whether already dispatched
        // -------------------------------------------------
        const existingDispatch = await client.query(
            `SELECT id
             FROM dispatches
             WHERE sales_order_id = $1`,
            [sales_order_id]
        );

        if (existingDispatch.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "Sales Order has already been dispatched"
            });
        }

        // -------------------------------------------------
        // Get inventory reservations
        // -------------------------------------------------
        const reservationResult = await client.query(
            `SELECT
                product_id,
                quantity
             FROM inventory_reservations
             WHERE sales_order_id = $1
             FOR UPDATE`,
            [sales_order_id]
        );

        if (reservationResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "No inventory reservation found for this Sales Order"
            });
        }

        // -------------------------------------------------
        // Release reserved inventory
        // -------------------------------------------------
        for (const reservation of reservationResult.rows) {

            const inventoryResult = await client.query(
                `SELECT
                    id,
                    product_id,
                    available_quantity,
                    reserved_quantity
                 FROM inventory
                 WHERE product_id = $1
                 FOR UPDATE`,
                [reservation.product_id]
            );

            if (inventoryResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message:
                        `Inventory not found for product ${reservation.product_id}`
                });
            }

            const inventory = inventoryResult.rows[0];

            if (
                inventory.reserved_quantity <
                reservation.quantity
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message:
                        `Reserved quantity is insufficient for product ${reservation.product_id}`
                });
            }

            await client.query(
                `UPDATE inventory
                 SET
                    reserved_quantity =
                        reserved_quantity - $1,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE product_id = $2`,
                [
                    reservation.quantity,
                    reservation.product_id
                ]
            );
        }

        // -------------------------------------------------
        // Create Dispatch
        // -------------------------------------------------
        const dispatchResult = await client.query(
            `INSERT INTO dispatches
            (
                sales_order_id,
                dispatch_date,
                tracking_number,
                status
            )
            VALUES
            (
                $1,
                CURRENT_TIMESTAMP,
                $2,
                'DISPATCHED'
            )
            RETURNING *`,
            [
                sales_order_id,
                tracking_number || null
            ]
        );

        // -------------------------------------------------
        // Update Sales Order
        // -------------------------------------------------
        await client.query(
            `UPDATE sales_orders
             SET status = 'DISPATCHED'
             WHERE id = $1`,
            [sales_order_id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            message: "Sales Order dispatched successfully",
            dispatch: dispatchResult.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    } finally {
        client.release();
    }
};


// =====================================================
// GET ALL DISPATCHES
// =====================================================
const getDispatches = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                d.id,
                d.sales_order_id,
                d.dispatch_date,
                d.tracking_number,
                d.status,
                d.created_at,
                c.company_name
             FROM dispatches d
             JOIN sales_orders so
             ON d.sales_order_id = so.id
             JOIN customers c
             ON so.customer_id = c.id
             ORDER BY d.id DESC`
        );

        res.json({
            dispatches: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// GET DISPATCH BY ID
// =====================================================
const getDispatchById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                d.id,
                d.sales_order_id,
                d.dispatch_date,
                d.tracking_number,
                d.status,
                d.created_at,
                c.company_name
             FROM dispatches d
             JOIN sales_orders so
             ON d.sales_order_id = so.id
             JOIN customers c
             ON so.customer_id = c.id
             WHERE d.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Dispatch not found"
            });
        }

        res.json({
            dispatch: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createDispatch,
    getDispatches,
    getDispatchById
};