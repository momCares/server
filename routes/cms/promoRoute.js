const express = require("express");
const router = express.Router();
const promoController = require("../../controllers/cms/promoController");
const { authorization } = require("../../middlewares/auth");

router.get("/", authorization(["admin"]), promoController.findAll);
router.get("/:id", authorization(["admin"]), promoController.findOne);
router.post("/", authorization(["admin"]), promoController.create);
router.put("/:id", authorization(["admin"]), promoController.update);
router.delete("/:id", authorization(["admin"]), promoController.destroy);
router.post("/restore/:id", authorization(["admin"]), promoController.restore);

module.exports = router;
