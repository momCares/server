const productService = require("../../services/productService");

const limit = 10;

const findAll = async (req, res, next) => {
  try {
    const params = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      perPage: limit,
      role: "admin",
      searchTerm: req.query.searchTerm,
      status: req.query.status,
      sortBy: req.query.sortBy,
      showDeleted: true,
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
      role: "admin",
      showDeleted: true,
    };
    const product = await productService.findOne(params);
    res
      .status(200)
      .json({ message: "Product Data By ID Found", data: product });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ message: "Product Created", data: product });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const productId = req.body.id;
    console.log(productId);
    const product = await productService.uploadImage({ productId, filePath });
    res.status(200).json({ message: "Product Image Uploaded", data: product });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = parseInt(id);
    const product = await productService.update(req.body);
    res.status(200).json({ message: "Product Updated", data: product });
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: "admin",
    };
    await productService.destroy(params);
    res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    next(error);
  }
};

const restore = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: "admin",
    };
    await productService.restore(params);
    res.status(200).json({ message: "Product Restored" });
  } catch (error) {
    next(error);
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
