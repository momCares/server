const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Endpoint untuk mencari satu pengguna berdasarkan ID
router.get("/:id", userController.findOne);

// Endpoint untuk mengupdate pengguna berdasarkan ID
router.put("/:id", userController.update);

module.exports = router;
