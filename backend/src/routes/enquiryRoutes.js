const express = require("express");

const {
    createEnquiry,
    getEnquiries
} = require("../controllers/enquiryController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createEnquiry
);

router.get(
    "/",
    authenticateToken,
    getEnquiries
);

module.exports = router;