const addressService = require("../services/addressService");

const findAll = async (req, res, next) => {
  const userId = req.loggedUser.id;
  try {
    const addresses = await addressService.findAll(userId);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.loggedUser.id;
  try {
    const address = await addressService.findOne({
      addressId: parseInt(addressId, 10),
      userId,
    });
    res.json(address);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const newAddress = req.body;
  newAddress.user_id = req.loggedUser.id;
  try {
    const createdAddress = await addressService.create({ newAddress });
    res.status(201).json(createdAddress);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { addressId } = req.params;
  const updatedFields = req.body;
  const userId = req.loggedUser.id;
  try {
    const updatedAddress = await addressService.update({
      addressId: parseInt(addressId, 10),
      updatedFields,
      userId,
    });
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  const { addressId } = req.params;
  const userId = req.loggedUser.id;
  try {
    const deletedAddress = await addressService.destroy({
      addressId: parseInt(addressId, 10),
      userId,
    });
    res.json(deletedAddress);
  } catch (error) {
    next(error);
  }
};

module.exports = { findAll, findOne, create, update, destroy };
