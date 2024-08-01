const paginate = require("../lib/pagination");
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
  const { role = "admin", showDeleted = true } = params; // Correct destructuring
  const { page = 1, limit = 10 } = params.req; // Ensure req is correctly passed

  const offset = (page - 1) * Number(limit);
  let whereCondition = {};

  if (role === "admin" && showDeleted) {
    whereCondition = {
      OR: [{ deleted_at: null }, { deleted_at: { not: null } }],
    };
  } else {
    whereCondition = {
      deleted_at: null,
    };
  }

  const totalPromo = await prisma.promo.count({
    where: whereCondition,
  });

  const promo = await prisma.promo.findMany({
    take: Number(limit),
    skip: offset,
    where: whereCondition,
    include: {
      product_promos: true,
    },
    orderBy: {
      start_date: "asc",
    },
  });

  const totalPages = Math.ceil(totalPromo / limit);
  const pagination = {
    promo,
    totalPromo,
    totalPages,
    currentPage: page,
  };

  return pagination;
};


const findOne = async (params) => {
  const { id, role = "admin", showDeleted = true } = params;

  const promoId = parseInt(id);

  let whereCondition = {};
  if (role === "admin" && showDeleted) {
    whereCondition = {
      id: promoId,
      OR: [{ deleted_at: null }, { deleted_at: { not: null } }],
    };
  } else {
    whereCondition = {
      id: promoId,
      deleted_at: null,
    };
  }

  let productPromosConditon = {};
  if (role === "admin" && showDeleted) {
    productPromosConditon = {
      OR: [{ deleted_at: null }, { deleted_at: { not: null } }],
    };
  } else {
    productPromosConditon = {
      deleted_at: null,
    };
  }

  const promo = await prisma.promo.findUnique({
    where: whereCondition,
    include: {
      product_promos: {
        where: productPromosConditon,
      },
    },
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
// validate promo
const validatePromo = async(params)=>{
  const {promo,cart_id} = params;

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
    let cart_Details = await prisma.cart_Detail.findMany({
      where:{cart_id:cart_id}
    });
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
    products,
    start_date,
    end_date,
    role = "admin",
  } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }

  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const promo = await prisma.promo.create({
    data: {
      name,
      code,
      all_products,
      deduction,
      quantity,
    },
  });
  if (!all_products && products.length > 0) {
    for (const product of products) {
      await prisma.product_Promo.create({
        data: {
          promo_id: promo.id,
          product_id: product.product_id,
        },
      });
    }
  }

  return promo;
};

const update = async (params) => {
  const {
    name,
    code,
    all_products,
    deduction,
    quantity,
    products,
    start_date,
    end_date,
    role = "admin",
  } = params.body;


  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }


  const { id } = params.params;
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
    include: {
      product_promos: true,
    },
  });

  if (!all_products) {
    // Hapus semua relasi lama terlebih dahulu
    await prisma.product_Promo.deleteMany({
      where: {
        promo_id: promo.id,
      },
    });

    // Tambahkan produk baru
    if (products.length > 0) {
      for (const product of products) {
        await prisma.product_Promo.create({
          data: {
            promo_id: promo.id,
            product_id: product.product_id,
          },
        });
      }
    }
  } else {
    // Hapus semua relasi jika all_products bernilai true
    await prisma.product_Promo.deleteMany({
      where: {
        promo_id: promo.id,
      },
    });
  }

  return promo;
};

const destroy = async (params) => {
  const { id, role = "admin" } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }

  const promoId = await prisma.promo.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!promoId) {
    throw { name: "ErrorNotFound", message: "Promo not found" };
  }

  // Soft delete the promo
  const promo = await prisma.promo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return promo;
};

const restore = async (params) => {
  const { id, role = "admin" } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }

  const promoId = await prisma.promo.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  if (!promoId) {
    throw { name: "ErrorNotFound", message: "Promo not found" };
  }

  // Restore the promo
  const promo = await prisma.promo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      deleted_at: null,
    },
  });

  return promo;
};

module.exports = { findAll, findOne, create, update, restore,findOneByCode, destroy };
