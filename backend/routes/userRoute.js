const express = require("express");
const router = express.Router();

// Controllers, Middleware
const {
  registerUser,
  loginUser,
  fetchUser,
} = require("../controllers/userController");
const { verifyAuthorization } = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/search", verifyAuthorization, fetchUser);

module.exports = router;
