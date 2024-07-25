const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async () => {
  return prisma.province.findMany();
};

const findOne = async (id) => {
    const provinceId = parseInt(id, 10);
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
    });

    if (!province) {
      throw { name: "ProvinceNotFound" };
    }

    return province;
};

module.exports = { findAll, findOne };
