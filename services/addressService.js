const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async (params) => {
  const { userId } = params;
  const addresses = await prisma.address.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: true,
      city: true,
      province: true,
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
    include: {
      user: true,
      city: true,
      province: true,
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

  try {
    // Validate input data
    const requiredFields = [
      "title",
      "description",
      "detail_address",
      "zip_code",
      "city_id",
      "province_id",
      "user_id",
    ];
    for (const field of requiredFields) {
      if (!newAddress[field]) {
        throw {
          name: "ErrorCreate",
          message: `Missing required field: ${field}`,
        };
      }
    }

    // Create address
    const createdAddress = await prisma.address.create({
      data: {
        title: newAddress.title,
        description: newAddress.description,
        detail_address: newAddress.detail_address,
        zip_code: newAddress.zip_code,
        city_id: newAddress.city_id,
        province_id: newAddress.province_id,
        user_id: newAddress.user_id,
      },
    });

    return createdAddress;
  } catch (error) {
    throw { name: "ErrorCreate" };
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
      console.error(`Address with ID ${addressId} not found or unauthorized`);
      throw {
        name: "AddressNotFound",
        message: `Address with ID ${addressId} not found or unauthorized`,
      };
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        description: updatedFields.description,
        detail_address: updatedFields.detail_address,
        zip_code: updatedFields.zip_code,
        city: {
          connect: { id: updatedFields.city_id },
        },
        province: {
          connect: { id: updatedFields.province_id },
        },
        updated_at: new Date(),
      },
    });

    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);

    throw {
      name: "UpdateAddressError",
      message: "An error occurred while updating the address",
      details: error.message,
    };
  }
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
