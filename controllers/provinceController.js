const provinceService = require("../services/provinceService");

const getAllProvinces = async (req, res, next) => {
  try {
    const provinces = await provinceService.findAll();
    res.json(provinces);
  } catch (error) {
    next(error);
  }
};

const getProvinceById = async (req, res, next) => {
  try {
    const province = await provinceService.findOne(req.params.id);
    res.json(province);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProvinces, getProvinceById };
