const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { authentication } = require("../middlewares/auth");

// Apply authentication middleware to all routes
router.use(authentication);

// Routes for address operations, all requiring user to be logged in
router.get("/", addressController.findAll);
router.get("/:addressId", addressController.findOne);
router.post("/", addressController.create);
router.put("/:addressId", addressController.update);
router.delete("/:addressId", addressController.destroy);

module.exports = router;
