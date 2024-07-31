const productService = require("../services/productService");

const findAll = async (req, res, next) => {
  try {
    const params = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      role: req.query.role || "user",
      showDeleted: req.query.showDeleted === 'true',
      sortBy: req.query.sortBy || "id",
      sortOrder: req.query.sortOrder || "asc",
      searchTerms: req.query.searchTerms || "",
      categoryId: req.query.categoryId,
    };

    const products = await productService.findAll(params);
    res.status(200).json({ message: "Success Get All Products", data: products });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: "user",
    };
    const product = await productService.findOne(params);
    res
      .status(200)
      .json({ message: "Product Data By ID Found", data: product });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const findSlug = async (req, res, next) => {
  try {
    const params = {
      slug: req.params.slug,
      role: "user",
    };
    const product = await productService.findSlug(params);
    res
      .status(200)
      .json({ message: "Product Data By Slug Found", data: product });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { findAll, findOne, findSlug };
