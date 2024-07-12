const express = require("express");
const { getAllCities, getCityById } = require("../controllers/cityController");
const router = express.Router();

router.get("/", getAllCities);
router.get("/:id", getCityById);

module.exports = router;
