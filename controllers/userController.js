const {
  getUserById: getUserByIdService,
  updateUser: updateUserService,
} = require("../services/userService");

const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const loggedUserId = req.loggedUser.id;
    const updateData = req.body;

    const user = await updateUserService({ userId, loggedUserId, updateData });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const loggedUserId = req.loggedUser.id;

    const user = await getUserByIdService({ userId, loggedUserId });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, updateUser };
