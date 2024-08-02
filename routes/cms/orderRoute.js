const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/cms/orderController");
const { authorization } = require("../../middlewares/auth");

router.post("/", authorization(["admin"]),orderController.create);
router.get("/", authorization(["admin"]), orderController.findAll);
router.get("/:id", authorization(["admin"]), orderController.findOne);
router.put("/:id/status", authorization(["admin"]), orderController.update);
// router.put("/:id/payment-receipt", authorization(["admin"]), orderController.payment);



module.exports = router;