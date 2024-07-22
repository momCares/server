const promoService = require('../services/promoService')

const findAll = async (req, res, next) => {};

const findOne = async (req, res, next) => {};

const apply = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id, body: req.body};
        const promo = await promoService.findOneByCode(params);
        res.status(200).json({ message: "promo : ", data: promo });

    } catch (error) {
        next(error)
    }
};

module.exports = { findAll, findOne, apply };
