const productService = require("../services/productService");

const findAll = async (req, res, next) => {
  try {
    const params = {
      role: "user",
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
      slug: req.params.slug,
      role: "user",
    };
    console.log(params);
    const product = await productService.findOne(params);
    res
      .status(200)
      .json({ message: "Product Data By ID Found", data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne };
