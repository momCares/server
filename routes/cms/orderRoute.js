const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/cms/orderController");

router.get("/", orderController.findAll);
router.get("/:id", orderController.findOne);
router.put("/:id", orderController.update);

module.exports = router;