const categoryService = require("../../services/categoryService");

const limit = 10;

const findAll = async (req, res, next) => {
  try {
    const params = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      perPage: limit,
      role: "Admin",
      searchTerms: req.query.searchTerms,
      status: req.query.status,
      sortBy: req.query.sortBy,
    };
    const category = await categoryService.findAll(params);
    res
      .status(200)
      .json({ message: "Success Get All Checkout", data: category });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const category = await categoryService.findOne(req.params);
    res
      .status(200)
      .json({ message: "Category Data By ID Found", data: category });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ message: "Category Created", data: category });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.body.id = parseInt(id);
    const category = await categoryService.update(req.body);
    res.status(200).json({ message: "Category Updated", data: category });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    params = {
      id: req.params.id,
      role: "Admin",
    };

    const category = await categoryService.destroy(params);
    res.status(200).json({ message: "Category Deleted", data: category });
  } catch (err) {
    next(err);
  }
};

module.exports = { findAll, findOne, create, update, destroy };
