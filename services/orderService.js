const prisma = require("../lib/prisma");
const shippingCostService = require("../services/shippingCostService");

const createOrder = async (params) => {
  await prisma.$transaction(async (prisma) => {
    let shipping_cost =
      (total_weight =
      shiping_cost =
      total_cost =
      net_price =
      deduction_cost =
      deduction_percent =
        0);
    const { quantity, addres_id, courier_name, shipping_method, promo_code } =
      params.req;
    let promo_id = null;

    // check use affiliate or not
    const affiliate = await prisma.affiliate.findUnique({
      where: { user_id: Number(params.user_id), status: true },
    });
    if(affiliate!=null){
      await prisma.affiliate.update({
        where: { user_id: Number(params.user_id), status: true },
        data: {
          status: false,
          updated_at: new Date(),
        },
      });
    }
    // check user use promo code or not
    if (promo_code != null) {
      let promo = await prisma.promo.findUnique({
        where: {
          code: promo_code,
        },
      });
      if (promo == null) {
        throw { name: "ErrorNotFound", message: "Promo Not Found" };
      } else {
        if (promo.start_date != null && promo.end_date != null) {
          if (
            !(promo.start_date <= new Date() && promo.end_date >= new Date())
          ) {
            throw { name: "ErrorNotFound", message: "Promo Expired" };
          }
        } else if (promo.start_date != null) {
          if (!(promo.start_date <= new Date())) {
            throw { name: "ErrorNotFound", message: "Cant Use this Promo" };
          }
        }
        if (promo.quantity == 0) {
          throw { name: "ErrorNotFound", message: "Cant Use this Promo" };
        }
        promo_id = promo.id;

        const update_promo = await prisma.promo.update({
          where: { id: promo.id },
          data: {
            quantity: promo.quantity - 1,
            updated_at: new Date(),
          },
        });
      }
    }
    const address = await prisma.address.findUnique({
      where: {
        id: addres_id,
      },
    });

    const order = await prisma.order.create({
      data: {
        user_id: params.user_id,
        courier: courier_name,
        promo_id: promo_id,
        status: "waiting_payment",
        address_id: addres_id,
        shipping_cost: 0,
        total_cost: 0,
        deduction_cost: 0,
        net_price: 0,
      },
    });
    const products = params.req.products.map(
      (product_id) => product_id.product_id
    );
    const all_quantity = params.req.products.map(
      (quantity) => quantity.quantity
    );

    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        // const element = array[index];
        let get_product = await prisma.product.findUnique({
          where: { id: products[i] },
          select: {
            weight: true,
            price: true,
            stock: true,
          },
        });
        const create_order_details = await prisma.order_Detail.create({
          data: {
            order_id: order.id,
            product_id: products[i],
            quantity: all_quantity[i],
            price: get_product.price,
          },
        });
        const update_product = await prisma.product.update({
          where: { id: products[i] },
          data: {
            stock: get_product.stock - all_quantity[i],
            updated_at: new Date(),
          },
        });
        total_weight += all_quantity[i] * get_product.weight;
        total_cost += all_quantity[i] * get_product.price;
      }
    }
    // for params rajaongkir
    const shipping_cost_params = {
      city_id: address.city_id,
      total_weight,
      courier_name,
      shipping_method,
      store_city_id: 444,
    };
    if (total_weight > 0) {
      shipping_cost = await shippingCostService.getShippingCost(
        shipping_cost_params
      );
    }
    // deductioncost from total_cost * (affiliate+promo)/100
    // 50% + 10%
    if(affiliate==null){
      deduction_cost =
      (total_cost * ( deduction_percent)) / 100;
    }else{
      deduction_cost =
      (total_cost * (affiliate.deduction + deduction_percent)) / 100;
    }
    
    // Calculate net price = total cost + shipping cost -deduction_cost
    net_price = total_cost + shipping_cost - deduction_cost;
    const update_order = await prisma.order.update({
      where: { id: order.id },
      data: {
        shipping_cost: shipping_cost,
        total_cost: total_cost,
        deduction_cost: deduction_cost,
        net_price: net_price,
      },
    });
    
    return update_order;
  });
};

const findAllOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
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
    data: { paymentReceipt, status: "payment_verified" },
  });
  return order;
};

module.exports = {
  createOrder,
  findAllOrders,
  findOrderById,
  updateOrderStatus,
  updatePaymentReceipt,
};
