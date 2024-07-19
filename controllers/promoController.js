const promoService = require("../services/promoService");

const findAll = async (req, res, next) => {
  try {
    const params = {
      role: "user",
    };

    const promo = await promoService.findAll(params);
    res.status(200).json({ message: "Success Get All Promo", data: promo });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: "user",
    };
    const promo = await promoService.findOne(params);
    res.status(200).json({ message: "Promo Data By ID Found", data: promo });
  } catch (error) {
    next(error);
  }
};

const apply = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    };
    const promo = await promoService.apply(params);
    res.status(200).json({ message: "Promo Applied", data: promo });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { findAll, findOne, apply };
