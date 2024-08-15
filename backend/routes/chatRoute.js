const express = require("express");
const router = express.Router();

// Middleware Imports
const { verifyAuthorization } = require("../middleware/authMiddleware");
const { fetchChat } = require("../controllers/chatController");

// // GET
router.post("/", verifyAuthorization, fetchChat);

// // POST
// router.post("/", verifyAuthorization, createChat);
// router.post("/group", verifyAuthorization, createGroupChat);

// // PUT
// router.put("/group/rename", verifyAuthorization, renameGroupChat);
// router.put("/group/add-user", verifyAuthorization, addUserToGroupChat);
// router.put("/group/remove-user", verifyAuthorization, removeUserFromGroupChat);

module.exports = router;
