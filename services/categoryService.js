const prisma = require("../lib/prisma");

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

  const totalCategories = await prisma.category.count({
    where: whereCondition,
  });

  const categories = await prisma.category.findMany({
    take: limit,
    skip: offset,
    where: whereCondition,
    include: {
      products: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!categories.length) {
    throw { name: "CategoryNotFound", message: "Categories Not Found" };
  }

  const totalPages = Math.ceil(totalCategories / limit);

  return {
    categories,
    meta: {
      totalCategories,
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

  const categoryId = parseInt(id);

  if (!categoryId) {
    throw { name: "ErrorNotFound", message: "Id is required" };
  }

  const offset = (page - 1) * limit;

  let whereCondition = {};
  if (role === "admin" && showDeleted) {
    whereCondition = {
      id: categoryId,
      OR: [{ deleted_at: null }, { deleted_at: { not: null } }],
    };
  } else {
    whereCondition = {
      id: categoryId,
      deleted_at: null,
    };
  }

  const category = await prisma.category.findFirst({
    take: limit,
    skip: offset,
    where: whereCondition,

    include: {
      products: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (!category) {
    throw { name: "CategoryNotFound", message: "Category Not Found" };
  }

  return category;
};

const create = async (params) => {
  const { name, role = "admin" } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can create a category" };
  }

  const category = await prisma.category.create({
    data: {
      name,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  if (!category)
    throw { name: "ErrorCreate", message: "Failed to Create Category" };

  return category;
};

const update = async (params) => {
  const { id, name, role = "admin" } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can update a category" };
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name, updated_at: new Date() },
  });

  if (!category)
    throw { name: "ErrorUpdate", message: "Failed to Update Category" };

  return category;
};

const destroy = async (params) => {
  const { id, role = "admin" } = params;

  if (role !== "admin") {
    throw { name: "Unauthorized", message: "Only admin can update a category" };
  }

  const categoryId = parseInt(id);
  if (!categoryId) {
    throw { name: "ErrorNotFound", message: "Id is required" };
  }

  // Soft Delete Category
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { deleted_at: new Date() },
  });

  return category;
};

const restore = async (params) => {
  const { id, role = "admin" } = params;

  if (role !== "admin") {
    throw {
      name: "Unauthorized",
      message: "Only admin can restore a category",
    };
  }

  const categoryId = parseInt(id);
  if (!categoryId) {
    throw { name: "ErrorNotFound", message: "Id is required" };
  }

  // Restore category
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { deleted_at: null },
  });

  return category;
};

module.exports = { findAll, findOne, create, update, destroy, restore };
