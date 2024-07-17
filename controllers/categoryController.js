const categoryService = require("../services/categoryService");

const findAll = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      role: "user",
    };
    const category = await categoryService.findAll(params);
    res
      .status(200)
      .json({ message: "Success Get All Categories", data: category });
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
    const category = await categoryService.findOne(params);
    res
      .status(200)
      .json({ message: "Category Data By ID Found", data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne };
