const express = require("express");
const router = express.Router();
const storeController = require("../../controllers/cms/storeController");

router.get("/", storeController.findAll);
router.get("/:id", storeController.findOne);
router.post("/", storeController.create);
router.put("/:id", storeController.update);
router.delete("/:id", storeController.destroy);

module.exports = router;