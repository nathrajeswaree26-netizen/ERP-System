const express = require("express");

const {
    createDispatch,
    getDispatches,
    getDispatchById
} = require("../controllers/dispatchController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Create Dispatch
// ADMIN ONLY
router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createDispatch
);


// Get All Dispatches
router.get(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "SALES_USER"),
    getDispatches
);


// Get Dispatch By ID
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "SALES_USER"),
    getDispatchById
);


module.exports = router;