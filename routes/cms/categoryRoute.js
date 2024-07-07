const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/cms/categoryController");

router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findOne)
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.destroy);

module.exports = router;