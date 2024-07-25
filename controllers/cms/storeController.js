const storeService = require('../../services/storeService');


const create = async (req, res, next) => {
  try {
    const store = await storeService.createStore(req.body);
    res.status(201).json({ message: "Store created successfully", data: store });
  } catch (error) {
    next(error); 
  }
};


const findAll = async (req, res, next) => {
  try {
    const stores = await storeService.findAllStores();
    res.status(200).json(stores);
  } catch (error) {
    next(error); 
  }
};


const findOne = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id, 10);
    const store = await storeService.findStoreById(storeId);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    next(error); 
  }
};

const update = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id, 10);
    const updatedStore = await storeService.updateStore(storeId, req.body);

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(updatedStore);
  } catch (error) {
    next(error); 
  }
};


const destroy = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id, 10);
    const response = await storeService.deleteStore(storeId);
    res.status(200).json(response);
  } catch (error) {
    next(error); 
  }
};

module.exports = { create, findAll, findOne, update, destroy};
