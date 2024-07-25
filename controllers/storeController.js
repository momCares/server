const storeService = require('../services/storeService');

// Create a new store
const createStore = async (req, res, next) => {
  try {
    const { name, address, contact_number } = req.body;
    const store = await storeService.createStore({ name, address, contact_number });
    res.status(201).json({ message: 'Store created successfully', data: store });
  } catch (error) {
    next(error);
  }
};

// Get all stores
const findAllStores = async (req, res, next) => {
  try {
    const stores = await storeService.findAllStores();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};

// Get store by ID
const findStoreById = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    const store = await storeService.findStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};

// Update a store
const updateStore = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    const updatedData = req.body;
    const store = await storeService.updateStore(storeId, updatedData);
    res.status(200).json({ message: 'Store updated successfully', data: store });
  } catch (error) {
    next(error);
  }
};

// Delete a store
const deleteStore = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.id);
    await storeService.deleteStore(storeId);
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStore,
  findAllStores,
  findStoreById,
  updateStore,
  deleteStore,
};
