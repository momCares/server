const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async (params) => {
  const { userId } = params;
  try {
    const addresses = await prisma.address.findMany({
      where: {
        user_id: userId,
      },
    });
    return addresses;
  } catch (error) {
    throw {
      name: "AddressError",
      message: `Error while fetching addresses for user ${userId}`,
    };
  }
};

const findOne = async (params) => {
  const { addressId, userId } = params;
  try {
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
  } catch (error) {
    if (error.name !== "AddressNotFound") {
      throw {
        name: "AddressError",
        message: `Error while fetching address with ID ${addressId} for user ${userId}`,
      };
    }
    throw error;
  }
};

const create = async (params) => {
  const { newAddress } = params;
  try {
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
  } catch (error) {
    throw { name: "AddressError", message: "Error while creating address" };
  }
};

const update = async (params) => {
  const { addressId, updatedFields, userId } = params;
  try {
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
  } catch (error) {
    if (error.name !== "AddressNotFound") {
      throw { name: "AddressError", message: "Error while updating address" };
    }
    throw error;
  }
};

const destroy = async (params) => {
  const { addressId, userId } = params;
  try {
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
  } catch (error) {
    if (error.name !== "AddressNotFound") {
      throw { name: "AddressError", message: "Error while deleting address" };
    }
    throw error;
  }
};

module.exports = { findAll, findOne, create, update, destroy };
