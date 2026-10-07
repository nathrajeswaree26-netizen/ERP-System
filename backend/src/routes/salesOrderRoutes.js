const express = require("express");

const {
    createSalesOrder,
    getSalesOrders,
    getSalesOrderById
} = require("../controllers/salesOrderController");

const {
    confirmSalesOrder
} = require("../controllers/inventoryController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    createSalesOrder
);

router.get(
    "/",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    getSalesOrders
);

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("SALES_USER", "ADMIN"),
    getSalesOrderById
);

router.patch(
    "/:id/confirm",
    authenticateToken,
    authorizeRoles("ADMIN"),
    confirmSalesOrder
);

module.exports = router;