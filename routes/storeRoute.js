const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");

router.get("/", storeController.findAll);
router.get("/:id", storeController.findOne);

module.exports = router;
