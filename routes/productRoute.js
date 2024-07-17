const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.findAll);
router.get("/:id", productController.findOne);
router.get("/slug/:slug", productController.findSlug);

module.exports = router;
