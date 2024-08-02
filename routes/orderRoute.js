const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const upload = require("../middlewares/multerPayment");

router.post("/", orderController.create);
router.get("/", orderController.findAll);
router.get("/:id", orderController.findOne);
// router.patch("/:id", orderController.updateStatus);
router.post("/payment/:id", upload.single("image"), orderController.payment);

module.exports = router;
