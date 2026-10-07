const pool = require("../config/db");

// Create customer
const createCustomer = async (req, res) => {
    try {
        const {
            company_name,
            contact_person,
            email,
            phone,
            address
        } = req.body;

        if (!company_name || !contact_person) {
            return res.status(400).json({
                message: "Company name and contact person are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO customers
            (company_name, contact_person, email, phone, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                company_name,
                contact_person,
                email,
                phone,
                address
            ]
        );

        res.status(201).json({
            message: "Customer created successfully",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get all customers
const getCustomers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM customers
             ORDER BY id DESC`
        );

        res.json({
            customers: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM customers
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            customer: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById
};