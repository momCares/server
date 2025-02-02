const cartService = require('../services/cartService')
const shippingCostService = require('../services/shippingCostService')

const findOne = async (req, res, next) => {
    try {
        const params = { user_id: req.loggedUser.id,req:req.query};
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
        const params = { user_id: req.loggedUser.id, req: req};
        const cart = await cartService.update(params);
        res.status(200).json({ message: "Cart Updated", data: cart });
    } catch (error) {
        next(error);
    }
};

const getAllShipping = async (req, res, next) =>{
    try {
        const params  = {user_id: req.loggedUser.id, body: req.body};
        const shipping_all = await shippingCostService.getShippingCostAll(params);
        res.status(200).json({ message: "Shipping Cost", data: shipping_all });

    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const params = {product_id: +req.params.product_id, user_id: req.loggedUser.id}

        const data = await cartService.deleteProduct(params);
        res.status(200).json({message: "Success delete from cart"})
    } catch(err) {
        next(err);
    }
};

const addToCart = async (req, res, next) => {

    try {
        const params = {product_id: +req.params.product_id, user_id: req.loggedUser.id}

        const data = await cartService.addToCart(params);
        res.status(200).json({message: "Success add to cart"})
    } catch(err) {
        next(err);
    }
}

module.exports = { findOne, reset, update, getAllShipping, deleteProduct, addToCart };
