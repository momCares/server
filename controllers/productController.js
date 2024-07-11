const productService = require("../services/productService");

limit = 50;

const findAll = async (req, res, next) => {
  try {
    const params = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      perPage: limit,
      role: "user",
      categoryId: req.query.categoryId,
      searchTerm: req.query.searchTerm,
      sortBy: req.query.sortBy,
      status: req.query.status,
    };
    const products = await productService.findAll(params);
    res
      .status(200)
      .json({ message: "Success Get All Products", data: products });
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
    next(error);
  }
};

module.exports = { findAll, findOne };
