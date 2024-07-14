const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.findOne);
router.delete("/", cartController.reset);
router.patch("/", cartController.update);
router.delete("/:product_id", cartController.deleteProduct);

module.exports = router;