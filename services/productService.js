const prisma = require("../lib/prisma");
const generateSlug = require("../lib/slug");

const findAll = async (params) => {
  const { page = 1, limit = 10, role = "admin", showDeleted = true } = params;

  const offset = (page - 1) * limit;

  let whereCondition;
  if (role === "admin" && showDeleted) {
    whereCondition = { status: true };
  } else {
    whereCondition = { deleted_at: null, status: true };
  }

  const totalProducts = await prisma.product.count({
    where: whereCondition,
  });

  const products = await prisma.product.findMany({
    take: limit,
    skip: offset,
    where: whereCondition,
    include: {
      category: true,
      product_images: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!products.length) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    meta: {
      totalProducts,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
};

const findOne = async (params) => {
  const {
    page = 1,
    limit = 10,
    id,
    role = "admin",
    showDeleted = true,
  } = params;

  if (!id) {
    throw { name: "ErrorNotFound", message: "Id is required" };
  }

  const productId = parseInt(id);

  const offset = (page - 1) * limit;

  let whereCondition = {};

  if (role === "admin" && showDeleted) {
    whereCondition = {
      id: productId,
      status: true,
    };
  } else {
    whereCondition = {
      id: productId,
      deleted_at: null,
      status: true,
    };
  }

  const product = await prisma.product.findFirst({
    take: limit,
    skip: offset,
    where: whereCondition,
    include: {
      category: true,
      product_images: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!product) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  return product;
};

const findSlug = async (params) => {
  const {
    page = 1,
    limit = 10,
    slug,
    role = "admin",
    showDeleted = true,
  } = params;

  if (!slug) {
    throw { name: "ErrorNotFound", message: "Id is required" };
  }

  const offset = (page - 1) * limit;

  let whereCondition = {};

  if (role === "admin" && showDeleted) {
    whereCondition = {
      slug,
      status: true,
    };
  } else {
    whereCondition = {
      slug,
      deleted_at: null,
      status: true,
    };
  }

  const product = await prisma.product.findFirst({
    take: limit,
    skip: offset,
    where: whereCondition,
    include: {
      category: true,
      product_images: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!product) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  return product;
};

const create = async (params) => {
  const {
    name,
    sku,
    price,
    stock,
    weight,
    description,
    keywords,
    category_id,
  } = params;

  const categoryId = parseInt(category_id);

  const slug = generateSlug(name);

  const category = await prisma.category.findFirst({
    where: { id: categoryId },
  });

  if (!category) {
    throw { name: "CategoryNotFound", message: "Invalid category id" };
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      slug,
      price,
      stock,
      weight,
      description,
      keywords,
      category_id: categoryId,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  if (!product) {
    throw { name: "ErrorCreate", message: "Failed to Create Product" };
  }

  return product;
};

const uploadImage = async (params) => {
  const { id, filePath } = params;

  if (!id) {
    throw {
      name: "ErrorMissingId",
      message: "No product ID provided",
    };
  }

  if (!filePath) {
    throw {
      name: "ErrorMissingFile",
      message: "No file provided to upload",
    };
  }

  const product = await prisma.product.findFirst({
    where: { id: parseInt(id) },
  });

  if (!product) {
    throw {
      name: "ErrorNotFound",
      message: "Product not found",
    };
  }

  const productImage = await prisma.product_Image.create({
    data: {
      product_id: parseInt(id),
      url: filePath,
    },
  });

  if (!productImage) {
    throw { name: "ErrorUpload", message: "Failed to upload image" };
  }

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      updated_at: new Date(),
    },
  });

  if (!updatedProduct) {
    throw { name: "ErrorUpload", message: "Failed to update product" };
  }

  return updatedProduct;
};

const update = async (params) => {
  const {
    id,
    name,
    sku,
    price,
    stock,
    weight,
    description,
    keywords,
    category_id,
  } = params;

  const product = await prisma.product.findFirst({
    where: { id: parseInt(id) },
  });

  if (!product) {
    throw { name: "ProductNotFound", message: "Product not found" };
  }

  if (category_id) {
    const category = await prisma.category.findFirst({
      where: { id: parseInt(category_id) },
    });

    if (!category) {
      throw { name: "CategoryNotFound", message: "Invalid category id" };
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      sku,
      price,
      stock,
      weight,
      description,
      keywords,
      category_id: category_id ? parseInt(category_id) : undefined,
      updated_at: new Date(),
    },
  });

  if (!updatedProduct) {
    throw { name: "ErrorUpdate", message: "Failed to update product" };
  }

  return updatedProduct;
};

const destroy = async (params) => {
  const productId = parseInt(params.id);

  const cekProduct = await prisma.product.findFirst({
    where: { id: parseInt(productId) },
  });

  if (!cekProduct) {
    throw { name: "ProductNotFound", message: "Product not found" };
  }

  // Soft delete products
  const product = await prisma.product.update({
    where: { id: productId },
    data: { deleted_at: new Date() },
  });

  return product;
};

const restore = async (params) => {
  const productId = parseInt(params.id);

  const cekProduct = await prisma.product.findFirst({
    where: { id: parseInt(productId) },
  });

  if (!cekProduct) {
    throw { name: "ProductNotFound", message: "Product not found" };
  }

  // Restore product
  const product = await prisma.product.update({
    where: { id: productId },
    data: { deleted_at: null },
  });

  return product;
};

module.exports = {
  findAll,
  findOne,
  findSlug,
  create,
  uploadImage,
  update,
  destroy,
  restore,
};
