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
  const { page = 1, limit = 10, role = "admin", showDeleted = true } = params;

  const offset = (page - 1) * limit;

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
    take: limit,
    skip: offset,
    where: whereCondition,
    include: {
      product_promos: {
        where: whereCondition,
      },
    },
    orderBy: {
      start_date: "asc",
    },
  });

  const totalPages = Math.ceil(totalPromo / limit);

  return {
    promo,
    meta: {
      totalPromo,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
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
      start_date: startDate,
      end_date: endDate,
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

  console.log(role, "ROLEEE");

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }

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

const apply = async (params) => {
  const { id } = params;

  const promoId = parseInt(id);

  console.log(params, "AAAAAAA");

  // Cari promo berdasarkan ID dan validasi tanggal
  const promo = await prisma.promo.findFirst({
    where: {
      id: promoId,
      start_date: { lte: new Date() },
      end_date: { gte: new Date() },
      deleted_at: null,
    },
    include: {
      product_promos: {
        where: {
          deleted_at: null,
        },
      },
    },
  });

  if (!promo) {
    throw {
      name: "ErrorNotFound",
      message: "Promo code is invalid or expired",
    };
  }

  if (promo.quantity <= 0) {
    throw {
      name: "ErrorNotFound",
      message: "Promo is out of stock",
    };
  }

  // Kurangi quantity promo
  await prisma.promo.update({
    where: {
      id: promoId,
    },
    data: {
      quantity: {
        decrement: 1,
      },
    },
  });

  return {
    promo: promo,
    discount: promo.deduction,
  };
};

module.exports = { findAll, findOne, create, update, destroy, restore, apply };
