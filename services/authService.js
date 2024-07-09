const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt")

const register = async (params) => {
  const { name, email, password, role = "user" } = params;

  // validasi jumlah password
  if (password.length <= 6) {
      throw createError(400, "Password must be longer than 6 characters");
  }

  console.log("Attempting to find existing user with ID:", userData.id);
  // buat Check user
  const existingUser = await prisma.user.findFirst({
      where: {
          OR: [{ email }, { name }]
      }
  });

  console.log("Existing user found:", existingUser);

  if (existingUser) {
      if (existingUser.email === email) {
          throw createError(409, "Email already taken");
      }
      if (existingUser.name === name) {
          throw createError(409, "Name already taken");
      }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
      data: {
          name,
          email,
          password: hashedPassword,
          role,
      },
  });
  return user
};

  

const login = async (params) => {
  const { email, password } = params;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('invalid Credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('invalid Credentials');

  const token = jwt.generateToken({ id: user.id, role: user.role });
  return { user, token };
};

module.exports = { login, register };
