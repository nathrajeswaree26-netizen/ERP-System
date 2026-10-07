const express = require("express");

const {
    createQuotation,
    getQuotations,
    getQuotationById,
    updateQuotationStatus
} = require("../controllers/quotationController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// CREATE QUOTATION
// =====================================================
router.post(
    "/",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    createQuotation
);


// =====================================================
// GET ALL QUOTATIONS
// =====================================================
router.get(
    "/",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    getQuotations
);


// =====================================================
// GET QUOTATION BY ID
// =====================================================
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    getQuotationById
);


// =====================================================
// UPDATE QUOTATION STATUS
// =====================================================
router.patch(
    "/:id/status",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    updateQuotationStatus
);


module.exports = router;