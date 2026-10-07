const express = require("express");

const {
    createCustomer,
    getCustomers,
    getCustomerById
} = require("../controllers/customerController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create customer
router.post(
    "/",
    authenticateToken,
    createCustomer
);

// Get all customers
router.get(
    "/",
    authenticateToken,
    getCustomers
);

// Get customer by ID
router.get(
    "/:id",
    authenticateToken,
    getCustomerById
);

module.exports = router;