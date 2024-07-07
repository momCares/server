const express = require("express");
const router = express.Router();
const productController = require("../../controllers/cms/productController");

router.get("/", productController.findAll);
router.get("/:id", productController.findOne);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.destroy);

module.exports = router;
