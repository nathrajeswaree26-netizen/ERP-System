const pool = require("../config/db");


// =====================================================
// CREATE QUOTATION FROM AN ENQUIRY
// =====================================================
const createQuotation = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            enquiry_id,
            items
        } = req.body;

        // Validate request
        if (!enquiry_id || !items || items.length === 0) {
            return res.status(400).json({
                message: "Enquiry and quotation items are required"
            });
        }

        await client.query("BEGIN");

        // -------------------------------------------------
        // Check enquiry
        // -------------------------------------------------
        const enquiryResult = await client.query(
            `SELECT
                id,
                customer_id,
                status
             FROM enquiries
             WHERE id = $1`,
            [enquiry_id]
        );

        if (enquiryResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Enquiry not found"
            });
        }

        const enquiry = enquiryResult.rows[0];

        // -------------------------------------------------
        // Create quotation
        // -------------------------------------------------
        const quotationResult = await client.query(
            `INSERT INTO quotations
            (
                enquiry_id,
                customer_id,
                status,
                total_amount,
                created_by
            )
            VALUES
            (
                $1,
                $2,
                'DRAFT',
                0,
                $3
            )
            RETURNING *`,
            [
                enquiry.id,
                enquiry.customer_id,
                req.user.id
            ]
        );

        const quotation = quotationResult.rows[0];

        let totalAmount = 0;

        // -------------------------------------------------
        // Add quotation items
        // -------------------------------------------------
        for (const item of items) {

            if (
                !item.product_id ||
                !item.quantity ||
                item.quantity <= 0
            ) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message: "Invalid quotation item"
                });
            }

            // Get product and price
            const productResult = await client.query(
                `SELECT
                    id,
                    price
                 FROM products
                 WHERE id = $1`,
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    message:
                        `Product ${item.product_id} not found`
                });
            }

            const unitPrice =
                Number(productResult.rows[0].price);

            const quantity =
                Number(item.quantity);

            const totalPrice =
                unitPrice * quantity;

            totalAmount += totalPrice;

            // Insert quotation item
            await client.query(
                `INSERT INTO quotation_items
                (
                    quotation_id,
                    product_id,
                    quantity,
                    unit_price,
                    total_price
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5
                )`,
                [
                    quotation.id,
                    item.product_id,
                    quantity,
                    unitPrice,
                    totalPrice
                ]
            );
        }

        // -------------------------------------------------
        // Update quotation total
        // -------------------------------------------------
        await client.query(
            `UPDATE quotations
             SET total_amount = $1
             WHERE id = $2`,
            [
                totalAmount,
                quotation.id
            ]
        );

        // Commit transaction
        await client.query("COMMIT");

        res.status(201).json({
            message: "Quotation created successfully",
            quotation_id: quotation.id,
            total_amount: totalAmount
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
// GET ALL QUOTATIONS
// =====================================================
const getQuotations = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                q.id,
                q.enquiry_id,
                q.customer_id,
                c.company_name,
                q.status,
                q.total_amount,
                q.created_by,
                q.created_at
             FROM quotations q
             JOIN customers c
             ON q.customer_id = c.id
             ORDER BY q.id DESC`
        );

        res.json({
            quotations: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =====================================================
// GET QUOTATION BY ID
// =====================================================
const getQuotationById = async (req, res) => {
    try {

        const { id } = req.params;

        // Get quotation
        const quotationResult = await pool.query(
            `SELECT
                q.*,
                c.company_name
             FROM quotations q
             JOIN customers c
             ON q.customer_id = c.id
             WHERE q.id = $1`,
            [id]
        );

        if (quotationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        // Get quotation items
        const itemsResult = await pool.query(
            `SELECT
                qi.id,
                qi.product_id,
                p.name AS product_name,
                qi.quantity,
                qi.unit_price,
                qi.total_price
             FROM quotation_items qi
             JOIN products p
             ON qi.product_id = p.id
             WHERE qi.quotation_id = $1
             ORDER BY qi.id`,
            [id]
        );

        res.json({
            quotation: quotationResult.rows[0],
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
// UPDATE QUOTATION STATUS
// =====================================================
const updateQuotationStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        // Allowed quotation statuses
        const allowedStatuses = [
            "DRAFT",
            "SENT",
            "ACCEPTED",
            "REJECTED"
        ];

        // Validate status
        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Invalid status. Allowed values: DRAFT, SENT, ACCEPTED, REJECTED"
            });
        }

        // Check quotation exists
        const quotationResult = await pool.query(
            `SELECT
                id,
                status
             FROM quotations
             WHERE id = $1`,
            [id]
        );

        if (quotationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        // Update status
        const result = await pool.query(
            `UPDATE quotations
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [
                status,
                id
            ]
        );

        res.json({
            message:
                "Quotation status updated successfully",
            quotation: result.rows[0]
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
    createQuotation,
    getQuotations,
    getQuotationById,
    updateQuotationStatus
};