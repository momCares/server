const prisma = require("../lib/prisma");
const shippingCostService = require("../services/shippingCostService");

const createOrder = async (params) => {
  await prisma.$transaction(async (prisma) => {
    let total_weight =
      shiping_cost =
      total_cost =
      net_price =
      deduction_cost =
      deduction_percent =0;
    const { quantity, addres_id, courier_name, shipping_method, promo_code } =
      params.req;
    let promo_id = null;
    const products = params.req.products.map(
      (product_id) => product_id.product_id
    );
    const all_quantity = params.req.products.map(
      (quantity) => quantity.quantity
    );
    // check user use promo code or not
    if (promo_code != null) {
      let promo = await prisma.promo.findUnique({
        where: {
          code: promo_code,
        },
      });
      const params_promo = {
        promo:promo,
        products:products
      };
      // validate promo
      const validate = await validatePromo(params_promo);      
      const update_promo = await prisma.promo.update({
        where: { id: promo.id },
        data: {
          quantity: promo.quantity - 1,
          updated_at: new Date(),
        },
      });
      promo_id = promo.id;
    }
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

    const address = await prisma.address.findUnique({
      where: {
        id: addres_id,
      },
    });
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
// validate promo
const validatePromo = async(params)=>{
  const {promo,products} = params;
  if(promo.start_date!=null && promo.end_date!=null){
    if(!(promo.start_date<= new Date() && promo.end_date>= new Date())){
      throw { name: "ErrorNotFound", message:"Promo Expired" };
    }
  }else if(promo.start_date!=null){
    if(!(promo.start_date<= new Date())){
      throw { name: "ErrorNotFound", message:"Cant Use this Promo" };
    }
  }
  if(promo.quantity==0){
    throw { name: "ErrorNotFound", message:"Cant Use this Promo" };
  }
  if(promo.all_products==false){
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const check_promo_product = await prisma.product_Promo.findFirst({
          where: {
            promo_id:promo.id,
            product_id:products[i]
          }
        })
        if(!check_promo_product){
          throw { name: "ErrorNotFound", message:"Cant Use this Promo" };
        }
      }
    }
  }
  return true;
}
const findAllOrders = async (userId, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [orders, totalOrders] = await prisma.$transaction([
    prisma.order.findMany({
      where: { user_id: userId },
      skip: skip,
      take: take,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        order_details: true,
      },
    }),
    prisma.order.count({
      where: { user_id: userId },
    }),
  ]);

  const totalPages = Math.ceil(totalOrders / pageSize);

  return {
    data: orders,
    pagination: {
      totalOrders,
      totalPages,
      currentPage: page,
      pageSize,
    },
  };
};

const findOrderById = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { order_details: true },
  });
  return order;
};

const updateOrderStatus = async (params) => {
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status :params.body.status},
    include:{promo:true}
  });
  if(params.body.status=='rejected'){
    await prisma.$transaction(async (prisma) => {
      let order_details = await prisma.order_Detail.findMany({
        where: {
          order_id: Number( params.id),
        },
        include: {
          product: true,
        },
      });
      if (order_details.length > 0) {
        for (let i = 0; i < order_details.length; i++) {
          await prisma.product.update({
            where: { id: order_details[i].product_id },
            data: {
              stock: (order_details[i].product.stock+order_details[i].quantity)
            },
          });
        }

      }
      if(order.promo_id){
        await prisma.promo.update({
          where: { id: order.promo_id },
          data: {
            quantity: (order.promo.quantity+1)
          },
        }); 
      }
      const affiliate= prisma.affiliate.findFirst({
        where:{
          user_id: Number( order.user_id),
          deduction:50,
        }
      });
      if(affiliate){
        // get first order
        const check_order =await prisma.order.findFirst({
          where: {
            user_id: ( order.user_id),
          },orderBy: {
            id: "asc",
          },
        });
        if(check_order.id==order.id){
          await prisma.affiliate.update({
            where: {user_id: Number( order.user_id)},
            data: {
              status: (true)
            },
          }); 
        }
      }
    })
  }
  return order;
};

const updatePaymentReceipt = async (params) => {
  const { id, filePath,user_id } = params;
  const check_order = await prisma.order.findFirst({
    where: {
      id: id,
      user_id: user_id,
    },
  })
  if (!check_order) throw {name: "ErrorNotFound"}
  if (!filePath) throw {name: "ErrorNotFound"}

  const order = await prisma.order.update({
    where: { id: id },
    data: { payment_receipt:filePath, status: "processed" },
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
