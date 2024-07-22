const categoryService = require("../../services/categoryService");

const findAll = async (req, res, next) => {
  try {
    const category = await categoryService.findAll(req.query);
    res
      .status(200)
      .json({ message: "Success Get All Categories", data: category });
  } catch (error) {
    console.error(error);
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
    const category = await categoryService.destroy(req.params);
    res.status(200).json({ message: "Category Deleted", data: category });
  } catch (err) {
    next(err);
  }
};

const restore = async (req, res, next) => {
  try {
    const category = await categoryService.restore(req.params);
    res.status(200).json({ message: "Success Restore", data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, create, update, destroy, restore };
