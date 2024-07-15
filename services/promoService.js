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
  const promo = await prisma.promo.findMany({
    where: {},
    include: {
      product_promos: true,
    },
    orderBy: {
      start_date: "asc",
    },
  });
  return promo;
};

const findOne = async (params) => {
  const { id } = params;
  const promo = await prisma.promo.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      product_promos: true,
    },
  });
  return promo;
};

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

  if (all_products == false && products.length > 0) {
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
  } = params.body;

  console.log(params, "AAAAAAAAAAA");

  const { id } = params.params;
  console.log(id, "INIII IDD");
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

  if (all_products == false && products.length > 0) {
    // Loop through the provided products
    for (const product of products) {
      const { product_id, remove } = product;
      const productPromo = promo.product_promos.find(
        (pp) => pp.product_id === product_id
      );

      if (productPromo) {
        if (remove) {
          // Soft delete the product from the promo
          await prisma.product_Promo.update({
            where: {
              id: productPromo.id,
            },
            data: {
              deleted_at: new Date(),
            },
          });
        } else {
          // Update the existing product promo entry
          await prisma.product_Promo.update({
            where: {
              id: productPromo.id,
            },
            data: {
              promo_id: promo.id,
              product_id: product_id,
              deleted_at: null,
            },
          });
        }
      }
    }
  }

  return promo;
};

const destroy = async (params) => {
  const { id } = params;

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
  const { id } = params;
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

module.exports = { findAll, findOne, create, update, destroy, restore };
