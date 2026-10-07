const pool = require("../config/db");


// =====================================================
// CREATE SALES ORDER FROM ACCEPTED QUOTATION
// =====================================================
const createSalesOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const { quotation_id } = req.body;

        if (!quotation_id) {
            return res.status(400).json({
                message: "Quotation ID is required"
            });
        }

        await client.query("BEGIN");

        // Check quotation
        const quotationResult = await client.query(
            `SELECT id, customer_id, status, total_amount
             FROM quotations
             WHERE id = $1`,
            [quotation_id]
        );

        if (quotationResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        const quotation = quotationResult.rows[0];

        // Only ACCEPTED quotations can become Sales Orders
        if (quotation.status !== "ACCEPTED") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "Only ACCEPTED quotations can be converted to Sales Order"
            });
        }

        // Check whether Sales Order already exists
        const existingOrder = await client.query(
            `SELECT id
             FROM sales_orders
             WHERE quotation_id = $1`,
            [quotation_id]
        );

        if (existingOrder.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "Sales Order already exists for this quotation"
            });
        }

        // Create Sales Order
        const orderResult = await client.query(
            `INSERT INTO sales_orders
            (quotation_id, customer_id, status, total_amount)
            VALUES ($1, $2, 'PENDING_CONFIRMATION', $3)
            RETURNING *`,
            [
                quotation.id,
                quotation.customer_id,
                quotation.total_amount
            ]
        );

        const order = orderResult.rows[0];

        // Get quotation items
        const quotationItems = await client.query(
            `SELECT
                product_id,
                quantity,
                unit_price,
                total_price
             FROM quotation_items
             WHERE quotation_id = $1`,
            [quotation_id]
        );

        // Copy quotation items into Sales Order items
        for (const item of quotationItems.rows) {

            await client.query(
                `INSERT INTO sales_order_items
                (
                    sales_order_id,
                    product_id,
                    quantity,
                    unit_price,
                    total_price
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    order.id,
                    item.product_id,
                    item.quantity,
                    item.unit_price,
                    item.total_price
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Sales Order created successfully",
            sales_order_id: order.id,
            status: order.status,
            total_amount: order.total_amount
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
// GET ALL SALES ORDERS
// =====================================================
const getSalesOrders = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                so.id,
                so.quotation_id,
                so.customer_id,
                c.company_name,
                so.status,
                so.total_amount
             FROM sales_orders so
             JOIN customers c
             ON so.customer_id = c.id
             ORDER BY so.id DESC`
        );

        res.json({
            sales_orders: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// GET SALES ORDER BY ID
// =====================================================
const getSalesOrderById = async (req, res) => {
    try {

        const { id } = req.params;

        const orderResult = await pool.query(
            `SELECT
                so.*,
                c.company_name
             FROM sales_orders so
             JOIN customers c
             ON so.customer_id = c.id
             WHERE so.id = $1`,
            [id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                message: "Sales Order not found"
            });
        }

        const itemsResult = await pool.query(
            `SELECT
                soi.id,
                soi.product_id,
                p.name AS product_name,
                soi.quantity,
                soi.unit_price,
                soi.total_price
             FROM sales_order_items soi
             JOIN products p
             ON soi.product_id = p.id
             WHERE soi.sales_order_id = $1
             ORDER BY soi.id`,
            [id]
        );

        res.json({
            sales_order: orderResult.rows[0],
            items: itemsResult.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById
};