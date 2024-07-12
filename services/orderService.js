const prisma = require('../lib/prisma')

const createOrder = async (userId, orderData) => {
  const { promoId, courier, addressId, shippingCost, totalCost, deductionCost, netPrice, orderDetails } = orderData;

  const order = await prisma.order.create({
    data: {
      userId,
      promoId,
      courier,
      addressId,
      shippingCost,
      totalCost,
      deductionCost,
      netPrice,
      orderDetails: {
        create: orderDetails
      }
    },
  });

  return order;
};

const findAllOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { orderDetails: true },
  });
  return orders;
};

const findOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderDetails: true },
  });
  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return order;
};

const updatePaymentReceipt = async (orderId, paymentReceipt) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { paymentReceipt, status: 'payment_verified' },
  });
  return order;
};

module.exports = {createOrder,findAllOrders,findOrderById,updateOrderStatus,updatePaymentReceipt};



