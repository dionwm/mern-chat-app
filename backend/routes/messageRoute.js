const express = require("express");
const router = express.Router();

const { verifyAuthorization } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

router.post("/send", verifyAuthorization, sendMessage);
router.get("/:chat_id", verifyAuthorization, getMessages);

module.exports = router;
