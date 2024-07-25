const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/cms/orderController");

router.post("/",orderController.create);
router.get("/", orderController.findAll);
router.get("/:id", orderController.findOne);
router.put("/:id/status", orderController.update);
router.put("/:id/payment-receipt", orderController.payment);



module.exports = router;