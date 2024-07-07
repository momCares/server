const prisma = require("../lib/prisma");
const { verifyToken } = require("../lib/jwt");

const authentication = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (authorization) {
      const token = authorization.split(" ")[1];
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
        });
        if (user) {
          req.loggedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
          next();
        } else {
          throw { name: "InvalidCredentials" };
        }
      } else {
        throw { name: "JsonWebTokenError" };
      }
    } else {
      throw { name: "Unauthorized" };
    }
  } catch (error) {
    next(error);
  }
};

const authorization = (params) => {
  return async (req, res, next) => {
    try {
      if (params.includes(req.loggedUser.role)) {
        next();
      } else {
        throw { name: "Unauthorized" };
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authentication, authorization };
