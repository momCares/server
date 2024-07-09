const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");

// generate code
const generateAffiliateCode = (name) => {
  const uniqueSuffix = Date.now().toString(36);
  return `${name.slice(0, 3).toUpperCase()}${uniqueSuffix}`;
};
const register = async (params) => {
  const { name, email, password, role = "user" } = params;

  // validasi jumlah password
  if (password.length <= 6) {
    throw { name: "invalidPassword" };
  }
  // Hash password
  const hashedPassword = await hashPassword(password);
  const affiliateCode = generateAffiliateCode(name);
  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      cart: {
        create: {},
      },
      affiliate: {
        create: {
          code: affiliateCode,
          deduction: 0,
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      },
    },
    include: {
      affiliate: true,
      cart: true,
    },
  });

  return user;
};

const login = async (params) => {
  const { email, password } = params;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { name: "InvalidCredentials" };

  const isValid = await comparePassword(password, user.password);

  if (!isValid) throw { name: "InvalidCredentials" };
  const token = generateToken({ id: user.id, role: user.role });
  return { user, token };
};

module.exports = { login, register };
