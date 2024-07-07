const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/", addressController.findAll);
router.get("/:id", addressController.findOne);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.destroy);

module.exports = router;
