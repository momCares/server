const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const update = async (req, res, next) => {
  const { id } = req.params; // Ambil ID dari parameter URL
  const { data } = req.body; // Ambil data yang akan diupdate dari body request

  try {
    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error); // Lewatkan error ke middleware error handling (next(err))
  }
};

const findOne = async (req, res, next) => {
  const { id } = req.params; // Ambil ID dari parameter URL

  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    next(error); // Lewatkan error ke middleware error handling (next(err))
  }
};

module.exports = { update, findOne };
