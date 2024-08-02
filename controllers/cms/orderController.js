const orderService = require('../../services/orderService');

const create = async (req, res, next) => {
  try {
    const params = { user_id: req.loggedUser.id, req: req.body };
    const order = await orderService.createOrder(params);
    res.status(200).json({ message: "Order Success", data: order });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const userId = req.loggedUser.id;
    const orders = await orderService.findAllOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await orderService.findOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const params = {id: parseInt(req.params.id),body: req.body};
    const order = await orderService.updateOrderStatus(params);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const payment = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentReceipt } = req.body;
    const order = await orderService.updatePaymentReceipt(orderId, paymentReceipt);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, findAll, findOne, update, payment };
