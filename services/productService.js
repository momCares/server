const prisma = require("../lib/prisma");

const findAll = async (params) => {
  try {
    const {
      page = 1,
      perPage = 10,
      role = "User",
      searchTerm = "",
      categoryId = "",
      status = "",
      sortBy = "",
      showDeleted = false,
    } = params;

    const offset = (page - 1) * perPage;
    const limit = perPage;

    let where = {};
    if (!showDeleted) {
      where.deleted_at = null;
    }
    if (role === "User") {
      where.status = true;
    }
    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.category_id = parseInt(categoryId);
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { sku: { contains: searchTerm, mode: "insensitive" } },
        { slug: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const totalCount = await prisma.product.count({ where });
    const orderBy = sortBy ? { [sortBy]: "asc" } : undefined;
    const products = await prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
      include: {
        category: true,
        product_images: true,
      },
    });

    if (!products || products.length === 0) {
      throw { name: "ProductNotFound", message: "Products Not Found" };
    }

    const totalPages = Math.ceil(totalCount / perPage);
    return { products, totalPages };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findOne = async (params) => {
  try {
    const { slug, role, showDeleted = false } = params;

    let where = { slug };
    if (!showDeleted) {
      where.deleted_at = null;
    }

    if (role === "User") {
      where.status = true;
    }

    const product = await prisma.product.findFirst({
      where,
      include: {
        category: true,
        product_images: true,
      },
    });

    if (!product) {
      throw { name: "ProductNotFound", message: "Product not found" };
    }

    return product;
  } catch (error) {
    console.error(error);
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorFetch", message: "Error Fetching Product" };
    }
  }
};

const generateSlug = (name) => {
  const slugifiedName = name.toLowerCase().replace(/\s+/g, "-");
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const slug = `${slugifiedName}-${randomNumber}`;
  return slug;
};

const create = async (params) => {
  try {
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

    if (stock < 0 || price < 0 || weight < 0) {
      throw {
        name: "MustPositive",
        message: "Stock, price, and weight cannot be negative",
      };
    }

    const slug = generateSlug(name);

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(category_id),
      },
    });

    if (!category) {
      throw { name: "CategoryNotFound", message: "Invalid category_id" };
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
        category_id,
        updated_at: new Date(),
      },
    });

    if (!product)
      throw { name: "ErrorCreate", message: "Failed to Create Product" };

    return product;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorCreate", message: "Failed to Create Product" };
    }
  }
};

const uploadImage = async (params) => {
  const { productId, filePath } = params;

  if (!filePath) {
    throw {
      name: "ErrorMissingFile",
      message: "No file provided to upload",
    };
  }

  if (!productId) {
    throw {
      name: "ErrorMissingId",
      message: "No product ID provided",
    };
  }

  const productImage = await prisma.product_Image.create({
    data: {
      product_id: parseInt(productId),
      url: filePath,
    },
  });

  if (!productImage) {
    throw { name: "ErrorUpload", message: "Failed to Upload Image" };
  }

  const product = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      updated_at: new Date(),
    },
  });

  if (!product) {
    throw { name: "ErrorUpload", message: "Failed to Update Product" };
  }

  return product;
};

const update = async (params) => {
  try {
    const {
      id,
      name,
      description,
      price,
      weight,
      category_id,
      stock,
      sku,
      keywords,
    } = params;

    const cekProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!cekProduct) {
      throw {
        name: "ErrorNotFound",
        message: "product Not Found or Inactive",
      };
    }

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(category_id),
      },
    });

    if (!category) {
      throw {
        name: "CategoryNotFound",
        message: "Category Not Found or Inactive",
      };
    }

    const slug = generateSlug(name);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        slug,
        price: parseInt(price),
        stock: parseInt(stock),
        weight: parseFloat(weight),
        description,
        keywords,
        category_id: parseInt(category_id),
        updated_at: new Date(),
      },
    });

    if (!product)
      throw { name: "ErrorUpdate", message: "Failed to Update Product" };

    return product;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorUpdate", message: "Failed to Update Product" };
    }
  }
};

const destroy = async (params) => {
  try {
    const productId = parseInt(params.id);

    // Soft delete products
    const product = await prisma.product.update({
      where: { id: productId },
      data: { deleted_at: new Date() },
    });

    return product;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorDelete", message: "Failed to Delete Product" };
    }
  }
};

const restore = async (params) => {
  try {
    const productId = parseInt(params.id);

    // Restore product
    const product = await prisma.product.update({
      where: { id: productId },
      data: { deleted_at: null },
    });

    return product;
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorRestore", message: "Failed to Restore Product" };
    }
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  uploadImage,
  update,
  destroy,
  restore,
};
