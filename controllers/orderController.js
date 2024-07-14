const orderService = require('../services/orderService');

//creating new order
const create = async (req, res, next) => {
  try {
    const orderData = req.body;
    const userId = req.userId; // From authMiddleware

    const order = await orderService.createOrder(userId, orderData);

    res.status(201).json(order);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

//fetching all order
const findAll = async (req, res, next) => {
  try {
    const userId = req.userId;

    const orders = await orderService.findAllOrders(userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

//fetching by user ID
const findOne = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await orderService.findOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

//update order status
const updateStatus = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

//payment order
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

module.exports = {create,findAll,findOne,updateStatus,payment};