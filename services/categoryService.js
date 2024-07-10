const prisma = require("../lib/prisma");
const productService = require("./productService");

const findAll = async (params) => {
  try {
    const {
      page = 1,
      perPage = 10,
      role = "User",
      searchTerm = "",
      status = "",
      sortBy = "",
    } = params;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    let where = { deleted_at: null };
    if (role === "User") {
      where.status = true;
    } else {
      if (status) {
        where.status = status === "Active";
      }
    }
    if (searchTerm) {
      where.OR = [{ name: { contains: searchTerm, mode: "insensitive" } }];
    }

    const totalCount = await prisma.category.count({ where });
    const orderBy = sortBy ? { [sortBy]: "asc" } : undefined;
    const categories = await prisma.category.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
      include: {
        product_categories: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!categories || categories.length === 0) {
      throw { name: "ErrorNotFound", message: "Categories Not Found" };
    }

    const totalPages = Math.ceil(totalCount / perPage);
    return { categories, totalPages };
  } catch (error) {
    throw error;
  }
};

const findOne = async (params) => {
  try {
    const { id, role } = params;
    const categoryId = parseInt(id);

    let where = { id: categoryId, deleted_at: null };
    if (role === "User") {
      where.status = true;
    }

    const category = await prisma.category.findUnique({
      where,
      include: {
        product_categories: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!category) {
      throw { name: "ErrorNotFound", message: "Category Not Found" };
    }

    return category;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorFetch", message: "Error Fetching Category" };
    }
  }
};

const create = async (params) => {
  try {
    const { name } = params;
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
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorCreate", message: "Failed to Create Category" };
    }
  }
};

const update = async (params) => {
  try {
    const { id, name } = params;

    const category = await prisma.category.update({
      where: { id },
      data: { name, updated_at: new Date() },
    });

    if (!category)
      throw { name: "ErrorUpdate", message: "Failed to Update Category" };

    return category;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorUpdate", message: "Failed to Update Category" };
    }
  }
};

const destroy = async (params) => {
  try {
    const categoryId = parseInt(params.id);

    const result = await prisma.$transaction(async (prisma) => {
      // Soft delete products
      await prisma.product.updateMany({
        where: {
          product_categories: {
            some: { category_id: categoryId },
          },
        },
        data: { deleted_at: new Date() },
      });

      // Soft delete category
      const category = await prisma.category.update({
        where: { id: categoryId },
        data: { deleted_at: new Date() },
      });

      return category;
    });

    return result;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorDelete", message: "Failed to Delete Category" };
    }
  }
};

module.exports = { findAll, findOne, create, update, destroy };
