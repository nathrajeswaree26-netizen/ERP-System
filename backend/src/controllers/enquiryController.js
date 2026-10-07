const pool = require("../config/db");

// Create enquiry
const createEnquiry = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            customer_id,
            items
        } = req.body;

        if (!customer_id || !items || items.length === 0) {
            return res.status(400).json({
                message: "Customer and enquiry items are required"
            });
        }

        await client.query("BEGIN");

        // Check customer exists
        const customerResult = await client.query(
            "SELECT id FROM customers WHERE id = $1",
            [customer_id]
        );

        if (customerResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Create enquiry
        const enquiryResult = await client.query(
            `INSERT INTO enquiries
            (customer_id, status, created_by)
            VALUES ($1, 'NEW', $2)
            RETURNING *`,
            [customer_id, req.user.id]
        );

        const enquiry = enquiryResult.rows[0];

        // Add enquiry items
        for (const item of items) {

            if (!item.product_id || !item.quantity || item.quantity <= 0) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message: "Invalid enquiry item"
                });
            }

            // Check product exists
            const productResult = await client.query(
                "SELECT id FROM products WHERE id = $1",
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    message: `Product ${item.product_id} not found`
                });
            }

            await client.query(
                `INSERT INTO enquiry_items
                (enquiry_id, product_id, quantity)
                VALUES ($1, $2, $3)`,
                [
                    enquiry.id,
                    item.product_id,
                    item.quantity
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Enquiry created successfully",
            enquiry_id: enquiry.id
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


// Get all enquiries
const getEnquiries = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                e.id,
                e.customer_id,
                c.company_name,
                e.status,
                e.created_by,
                e.created_at
             FROM enquiries e
             JOIN customers c
             ON e.customer_id = c.id
             ORDER BY e.id DESC`
        );

        res.json({
            enquiries: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createEnquiry,
    getEnquiries
};