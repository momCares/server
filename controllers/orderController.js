const orderService = require('../services/orderService');

//creating new order
const create = async (req, res, next) => {
  try {
    const params = { user_id: req.loggedUser.id, req: req.body};

    const order = await orderService.createOrder(params);
    res.status(200).json({ message: "Order Success", data: order });
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

//fetching all order
const findAll = async (req, res, next) => {
  try {
    const userId =  req.loggedUser.id;

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
    const params = { id: parseInt(req.params.id),  filePath : req.file.path, user_id:req.loggedUser.id};
    const order = await orderService.updatePaymentReceipt(params);

    res.status(200).json("Payment Success");
  } catch (error) {
    next(error); 
  }
};

module.exports = {create,findAll,findOne,updateStatus,payment};