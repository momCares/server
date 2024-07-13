const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async () => {
  return prisma.city.findMany();
};

const findOne = async (id) => {
  try {
    const cityId = parseInt(id, 10);

    const city = await prisma.city.findUnique({ where: { id: cityId } });

    if (!city) {
      throw { name: "CityNotFound" };
    }

    return city;
  } catch (error) {
    throw error;
  }
};

module.exports = { findAll, findOne };
