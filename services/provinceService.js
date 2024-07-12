const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async () => {
  return prisma.province.findMany();
};

const findOne = async (id) => {
  try {
    const provinceId = parseInt(id, 10);
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
    });

    if (!province) {
      throw { name: "ProvinceNotFound" };
    }

    return province;
  } catch (error) {
    throw error;
  }
};

module.exports = { findAll, findOne };
