// services/userService.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const updateUser = async (params) => {
  const { userId, loggedUserId, updateData } = params;

  if (userId !== loggedUserId) {
    throw {
      name: "InvalidUser",
    };
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return user;
};

const getUserById = async (params) => {
  const { userId, loggedUserId } = params;

  if (userId !== loggedUserId) {
    throw { name: "InvalidUser" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw { name: "UserNotFound" };
  }

  return user;
};

module.exports = { updateUser, getUserById };
