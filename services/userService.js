const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const update = async (params) => {
  const { id, data } = params;
  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data,
    });
    return updatedItem;
  } catch (error) {
    throw new Error(`Failed to update item with ID ${id}`);
  }
};

const findOne = async (params) => {
  const { id } = params;
  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });
    return item;
  } catch (error) {
    throw new Error(`Item with ID ${id} not found`);
  }
};

module.exports = { update, findOne };
