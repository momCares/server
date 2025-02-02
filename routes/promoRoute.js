const express = require("express");
const router = express.Router();
const promoController = require("../controllers/promoController");

router.get("/", promoController.findAll);
router.get("/:id", promoController.findOne);
router.post("/", promoController.apply);

module.exports = router;
