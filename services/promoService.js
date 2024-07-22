const prisma = require("../lib/prisma");
// convert date
const convertDate = (params) => {
    // returns the difference between UTC time and local time.
    // returns the difference in minutes.
  const offset = new Date().getTimezoneOffset();
  const myDate = Date.parse(params) - offset * 60 * 100;
  const isodateString = new Date(myDate).toISOString();
  return isodateString;
};
const findAll = async (params) => {
    const promo = await prisma.promo.findMany();
    return promo;
};

const findOne = async (params) => {
  const {id} = params;
  const promo = await prisma.promo.findUnique({
    where :{
      id: parseInt(id)
    }
  });
  return promo;
};
const findOneByCode = async (params) => {
  const {promo_code} = params.body;
  const promo = await prisma.promo.findUnique({
    where :{
      code: promo_code
    }
  });
  if (!promo) {
    throw { name: "ErrorNotFound", message: "Promo Not Found" };
  }
  let cart = await prisma.cart.findUnique({
    where: { user_id: Number(params.user_id) },
  });
  
  
  const params_promo = {
    promo:promo,
    cart_id:cart.id
  };
  const validate = await validatePromo(params_promo);
  const cart_update = await prisma.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      promo_id: promo.id,
      promo_code:promo_code
    },
  });
  return cart_update;
};
const validatePromo = async(params)=>{
  const {promo,cart_id} = params;
  let cart_Details = await prisma.cart_Detail.findMany({
    where:{cart_id:cart_id}
  });
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
    if (cart_Details.length > 0) {
      for (let i = 0; i < cart_Details.length; i++) {
        const check_promo_product = await prisma.product_Promo.findFirst({
          where: {
            promo_id:promo.id,
            product_id:cart_Details[i].product_id
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

const create = async (params) => {
  const {
    name,
    code,
    all_products,
    deduction,
    quantity,
    start_date,
    end_date,
  } = params;
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const promo = await prisma.promo.create({
    data: {
      name,
      code,
      all_products,
      deduction,
      quantity,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return promo;
};

const update = async (params) => {
  const {
    name,
    code,
    all_products,
    deduction,
    quantity,
    start_date,
    end_date,
  } = params.body;  
  const {id}= params.params
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const promo = await prisma.promo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      code,
      all_products,
      deduction,
      quantity,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return promo;
};

const destroy = async (params) => {};

module.exports = { findAll, findOne, create, update, findOneByCode, destroy };
