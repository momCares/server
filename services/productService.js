const prisma = require("../lib/prisma");
const generateSlug = require("../lib/slug");

const findAll = async (params) => {
  const {
    page = 1,
    limit = 10,
    role = "admin",
    showDeleted = true,
    sortBy = "id",
    sortOrder = "asc",
    searchTerms = "",
    categoryId,
  } = params;

  const validSortFields = [
    "id",
    "name",
    "price",
    "weight",
    "category_id",
    "stock",
    "sku",
    "slug",
  ];
  const validSortOrders = ["asc", "desc"];

  if (!validSortFields.includes(sortBy)) {
    throw new Error(`Invalid sortBy field: ${sortBy}`);
  }

  if (!validSortOrders.includes(sortOrder)) {
    throw new Error(`Invalid sortOrder value: ${sortOrder}`);
  }

  const limitInt = parseInt(limit, 10) || 10;
  const pageInt = parseInt(page, 10) || 1;
  const offset = (pageInt - 1) * limitInt;

  let whereCondition = {
    status: true, // Default to active products
  };

  // Adjust the whereCondition based on the role and showDeleted flag
  if (role === "admin") {
    if (!showDeleted) {
      whereCondition.deleted_at = null;
    }
  } else {
    whereCondition.deleted_at = null;
  }

  // Add search terms condition if provided
  if (searchTerms) {
    whereCondition.name = {
      contains: searchTerms,
      mode: "insensitive",
    };
  }

  // Add category filter if categoryId is provided
  if (categoryId) {
    whereCondition.category_id = parseInt(categoryId, 10);
  }

  // Fetch the total count of products matching the conditions
  const totalProducts = await prisma.product.count({
    where: whereCondition,
  });

  // Fetch the products matching the conditions with pagination and sorting
  const products = await prisma.product.findMany({
    take: limitInt,
    skip: offset,
    where: whereCondition,
    include: {
      category: true,
      product_images: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // Throw an error if no products are found
  if (products.length === 0) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProducts / limitInt);

  // Return the products and meta information
  return {
    products,
    meta: {
      totalProducts,
      totalPages,
      currentPage: pageInt,
      pageSize: limitInt,
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
