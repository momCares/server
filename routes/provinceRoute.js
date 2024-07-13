const express = require("express");
const {
  getAllProvinces,
  getProvinceById,
} = require("../controllers/provinceController");
const router = express.Router();

router.get("/", getAllProvinces);
router.get("/:id", getProvinceById);

module.exports = router;
