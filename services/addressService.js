const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async (params) => {
  const { userId } = params;
  const addresses = await prisma.address.findMany({
    where: {
      user_id: userId,
    },
  });
  return addresses;
};

const findOne = async (params) => {
  const { addressId, userId } = params;
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      user_id: userId,
    },
  });
  if (!address) {
    throw {
      name: "AddressNotFound",
      message: `Address with ID ${addressId} not found or unauthorized.`,
    };
  }
  return address;
};

const create = async (params) => {
  const { newAddress } = params;
  const createdAddress = await prisma.address.create({
    data: {
      title: newAddress.title,
      description: newAddress.description,
      zip_code: newAddress.zip_code,
      city_id: newAddress.city_id,
      province_id: newAddress.province_id,
      user_id: newAddress.user_id,
    },
  });
  return createdAddress;
};

const update = async (params) => {
  const { addressId, updatedFields, userId } = params;
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      user_id: userId,
    },
  });
  if (!address) {
    throw {
      name: "AddressNotFound",
      message: `Address with ID ${addressId} not found or unauthorized`,
    };
  }
  const updatedAddress = await prisma.address.update({
    where: {
      id: addressId,
    },
    data: updatedFields,
  });
  return updatedAddress;
};

const destroy = async (params) => {
  const { addressId, userId } = params;
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      user_id: userId,
    },
  });
  if (!address) {
    throw {
      name: "AddressNotFound",
      message: `Address with ID ${addressId} not found or unauthorized`,
    };
  }
  const deletedAddress = await prisma.address.delete({
    where: {
      id: addressId,
    },
  });
  return deletedAddress;
};

module.exports = { findAll, findOne, create, update, destroy };
