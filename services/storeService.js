const prisma = require('../lib/prisma');

const createStore = async (params) => {
  const { name, address, contact_number } = params;
  const store = await prisma.store.create({
    data: { name, address, contact_number },
  });
  return store;
};

const findAllStores = async () => {
  const stores = await prisma.store.findMany();
  return stores;
};

const findStoreById = async (storeId) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });
  return store;
};

const updateStore = async (storeId, params) => {
  const store = await prisma.store.update({
    where: { id: storeId },
    data: params,
  });
  return store;
};

const deleteStore = async (storeId) => {
  await prisma.store.delete({
    where: { id: storeId },
  });
  return { message: 'Store deleted successfully' };
};

module.exports = { createStore, findAllStores, findStoreById, updateStore, deleteStore };
