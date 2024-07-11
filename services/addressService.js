const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async (userId) => {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        user_id: userId,
      },
    });
    return addresses;
  } catch (error) {
    throw new { name: "AddressNotFound" }(
      `Error while fetching addresses for user ${userId}`
    );
  }
};

const findOne = async (addressId, userId) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });
    return address;
  } catch (error) {
    throw new new { name: "AddressNotFound" }(
      `Error while fetching addresses for user ${userId}`
    )();
  }
};

const create = async (newAddress) => {
  try {
    const createdAddress = await prisma.address.create({
      data: newAddress,
    });
    return createdAddress;
  } catch (error) {
    throw { name: "AddressError" };
  }
};

const update = async (addressId, updatedFields, userId) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });
    if (!address) {
      throw new { name: "AddressError" }();
    }
    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: updatedFields,
    });
    return updatedAddress;
  } catch (error) {
    throw new { name: "AddressError" }();
  }
};

const destroy = async (addressId, userId) => {
  try {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });
    if (!address) {
      throw new { name: "AddressError" }();
    }
    const deletedAddress = await prisma.address.delete({
      where: {
        id: addressId,
      },
    });
    return deletedAddress;
  } catch (error) {
    throw { name: "AddressError" };
  }
};

module.exports = { findAll, findOne, create, update, destroy };
