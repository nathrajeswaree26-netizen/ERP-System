const express = require("express");

const {
    getInventory,
    getInventoryByProduct,
    updateInventory
} = require("../controllers/inventoryController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// GET ALL INVENTORY
// ADMIN + SALES USER
// =====================================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "SALES_USER"),
    getInventory
);


// =====================================================
// GET INVENTORY BY PRODUCT
// ADMIN + SALES USER
// =====================================================

router.get(
    "/product/:productId",
    authenticateToken,
    authorizeRoles("ADMIN", "SALES_USER"),
    getInventoryByProduct
);


// =====================================================
// UPDATE INVENTORY
// ADMIN ONLY
// =====================================================

router.patch(
    "/product/:productId",
    authenticateToken,
    authorizeRoles("ADMIN"),
    updateInventory
);


module.exports = router;