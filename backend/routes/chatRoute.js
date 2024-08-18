const express = require("express");
const router = express.Router();

// Middleware Imports
const { verifyAuthorization } = require("../middleware/authMiddleware");
const {
  fetchUserChat,
  fetchAllChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
} = require("../controllers/chatController");

// // GET
router.get("/", verifyAuthorization, fetchAllChats);

// // POST
router.post("/", verifyAuthorization, fetchUserChat);
router.post("/group", verifyAuthorization, createGroupChat);

// // PUT
router.put("/group/rename", verifyAuthorization, renameGroupChat);
router.put("/group/add-user", verifyAuthorization, addUserToGroupChat);
router.put("/group/remove-user", verifyAuthorization, removeUserFromGroupChat);

module.exports = router;
