const promoService = require("../../services/promoService");

const findAll = async (req, res, next) => {
  try {
    const promo = await promoService.findAll(req);
    res.status(201).json({ message: "Success Get All Promo", data: promo });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const promo = await promoService.findOne(req.params);
    res.status(201).json({ message: "Promo Data By ID Found", data: promo });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const promo = await promoService.create(req.body);
    res.status(201).json({ message: "Promo Created", data: promo });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const promo = await promoService.update({
      params: req.params,
      body: req.body,
    });
    res.status(201).json({ message: "Promo Updated", data: promo });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const promo = await promoService.destroy(req.params);
    res.status(200).json({ message: "Promo Deleted", data: promo });
  } catch (err) {
    next(err);
  }
};

const restore = async (req, res, next) => {
  try {
    const promo = await promoService.restore(req.params);
    res.status(200).json({ message: "Promo Restored", data: promo });
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, findOne, create, update, destroy, restore };
