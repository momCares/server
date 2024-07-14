const prisma = require("../lib/prisma");
require("dotenv").config();
const axios = require('axios');

const findOne = async (params) => {
  const user_id = params.user_id;
  const cart = await prisma.cart.findFirst({
    where: { user_id: user_id },
    include: { cart_details: true },
  });
  return cart;
};

const reset = async (params) => {
  const user_id = params.user_id;
  let message = "";
  const cart = await prisma.cart.findFirst({
    where: { user_id: user_id },
  });
  const cart_detail = await prisma.cart_Detail.deleteMany({
    where: { cart_id: cart.id },
  });
  if (cart_detail.count == 0) {
    message = "All Shopping Cart Deleted";
  }
  return message;
};
const update = async (params)=>{
  await prisma.$transaction( async (prisma)=>{
    let shipping_cost=total_weight=shiping_cost=total_cost=net_price=deduction_cost=deduction_percent=0;

    const { product_id, quantity, addres_id, courier_name, shipping_method, promo_code } = params.req.body;
    let promo_id=null;
    let cart = await prisma.cart.findUnique({
      where: { user_id: Number(params.user_id) },
    });
    let affiliate = await prisma.affiliate.findUnique({
      where: { user_id: Number(params.user_id),status:true },
    });
    if(promo_code !=null){
      let promo = await prisma.promo.findUnique({
        where: { 
          code:promo_code,
        },
      });
      if(promo==null){
        throw { name: "ErrorNotFound",message:"Promo Not Found" };
      }else{
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
        deduction_percent=promo.deduction;
        promo_id = promo.id;
      }
    }
    // for checking this product already at cart or not
    const check_cart_product= await prisma.cart_Detail.findFirst({
      where: 
      { 
        cart_id: Number(cart.id),
        product_id:product_id
      },

    });
    // get product
    const product = await prisma.product.findUnique({
      where:{id: product_id}
    });
    // if not then create cart
    if(check_cart_product==null){
     
      if(product == null){
        throw { name: "ErrorNotFound" };
      }
      if(quantity>0){
        const cart_Detail = await prisma.cart_Detail.create({
          data: {
            cart_id:  Number(cart.id),
            product_id: product_id,
            quantity: quantity,
            price: product.price,
            updated_at: new Date(),
          },
        });
      }
    }else{
      if(quantity>0){
        const cart_Detail = await prisma.cart_Detail.update({
          where: {
            id: Number(check_cart_product.id),
          },
          data: {
            quantity: quantity,
            price: product.price,
            updated_at: new Date(),
            created_at:check_cart_product.created_at
          },
        });
      }else{
        const cart_detail = await prisma.cart_Detail.delete({
          where: { cart_id: cart.id },
        });
      }
      
    }
    let cart_details = await prisma.cart_Detail.findMany({
      where: 
      { 
        cart_id: Number(cart.id),
      },
      include: {
        product: true,
      },
    });
    if (cart_details.length > 0) {
      cart_details.forEach(function(row){
        total_weight += (row.quantity * row.product.weight);
        total_cost += (row.quantity * row.product.price);

      });
    }
    const address = await prisma.address.findUnique({
      where:{
        id:addres_id
      }
    });
    // for params rajaongkir
    const shipping_cost_params = {
      city_id:address.city_id,
      total_weight,
      courier_name,
      shipping_method,
      store_city_id: 444,
    };
    if (total_weight > 0) {
      shipping_cost = await getShippingCost(shipping_cost_params);
    }
    // deductioncost from total_cost * (affiliate+promo)/100
    // 50% + 10%
    deduction_cost = total_cost * (affiliate.deduction+deduction_percent)/100;
    // Calculate net price = total cost + shipping cost -deduction_cost
    net_price = total_cost + shipping_cost-deduction_cost;
    const update_cart = await prisma.cart.update({
      where: { user_id: Number(params.user_id) },
      data:{
        shipping_cost:shipping_cost,
        address_id: address.id,
        total_cost:total_cost,
        promo_code:(promo_code!=null?promo_code:null),
        promo_id:promo_id,
        deduction_cost:deduction_cost,
        net_price:net_price,
        created_at:cart.created_at,
        updated_at: new Date(),
      }
    })
    if (!update_cart) {
      throw { name: "ErrorUpdate", message: "Failed to Update Cart" };
    }

    return update_cart;
  })
}

const getShippingCost = async (params) => {
    try {
        const { city_id, total_weight, courier_name, shipping_method, store_city_id } = params;
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: store_city_id,
                destination: city_id,
                weight: total_weight,
                courier: courier_name
            },
            {
                headers: {
                    key: process.env.RAJAONGKIR_SECRET_KEY,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );
        // Get all shipping method
        const courier_shipping_methods = response.data.rajaongkir.results[0].costs.map(cost => cost.service);
        // Check if shipping method is available
        if (!courier_shipping_methods.includes(shipping_method)) {
            throw ({ name: "ErrorNotFound" })
        } else {
            // Get shipping cost based on shipping method
            const shipping_cost = response.data.rajaongkir.results[0].costs.find(cost => cost.service == shipping_method);
            return shipping_cost.cost[0].value;
        }
    } catch (error) {
        if (error.name && error.message) {
            throw error;
        } else {
            throw { name: "ErrorFetch", message: "Error Fetching Shipping Cost" };
        }
    }
};
const deleteProduct = async (params) => {};

module.exports = { findOne, reset, update, deleteProduct };
