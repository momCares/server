const express = require("express");
const router = express.Router();
const promoController = require("../../controllers/cms/promoController");

router.get("/", promoController.findAll);
router.get("/:id", promoController.findOne);
router.post("/", promoController.create);
router.put("/:id", promoController.update);
router.delete("/:id", promoController.destroy);
router.post("/restore/:id", promoController.restore);

module.exports = router;
