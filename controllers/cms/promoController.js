const promoService = require('../../services/promoService')

const findAll = async (req, res, next) => {
    try {
        const promo = await promoService.findAll(req.body);
        res.status(201).json({message: "Promo", data: promo})
    } catch (err) {
        next(err)
    }
};

const findOne = async (req, res, next) => {};

const create = async (req, res, next) => {
    try {
        const promo = await promoService.create(req.body);
        res.status(201).json({message: "Promo Created", data: promo})
    } catch (err) {
        next(err)
    }
};

const update = async (req, res, next) => {};

const destroy = async (req, res, next) => {};

module.exports = { findAll, findOne, create, update, destroy };
