const cartService = require('../services/cartService')

const findOne = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id};
        const cart = await cartService.findOne(params);
        res.status(200).json({ message: "Cart : ", data: cart });

    } catch (error) {
        next (error);
    }
};

const reset = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id};
        const reset_cart = await cartService.reset(params);
        res.status(200).json({ message: reset_cart })

    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id};
        const cart = await cartService.update(params);
        res.status(200).json({ message: "Cart Updated", data: cart });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {};

module.exports = { findOne, reset, update, deleteProduct };
