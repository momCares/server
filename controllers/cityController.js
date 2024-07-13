const cityService = require("../services/cityService");

const getAllCities = async (req, res, next) => {
  try {
    const cities = await cityService.findAll();
    res.json(cities);
  } catch (error) {
    next(error);
  }
};

const getCityById = async (req, res, next) => {
  try {
    const city = await cityService.findOne(req.params.id);
    res.json(city);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCities, getCityById };
