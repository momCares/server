const prisma = require("../lib/prisma");
const { hashPassword, comparePassword } = require("../lib/bcrypt");
const { generateToken } = require("../lib/jwt");

// generate code
const generateAffiliateCode = (name) => {
  const uniqueSuffix = Date.now().toString(36);
  return `${name.slice(0, 3).toUpperCase()}${uniqueSuffix}`;
};

const register = async (params) => {
  await prisma.$transaction(async (prisma) => {
    // tambah $transaction
    const { name, email, password, role = "user", affiliate_code = null } = params;

    // Validasi password
    if (password.length <= 6) {
      throw { name: "invalidPassword" };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate affiliate code
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

    // Validasi affiliate_code jika tidak null
    if (affiliate_code) {
      let check_affiliate = await prisma.affiliate.findFirst({
        where: {
          code: affiliate_code,
        },
      });

      if (!check_affiliate) {
        throw { name: "ErrorNotFound", message: "Affiliate code not found" };
      } else {
        await prisma.affiliate.update({
          where: {
            id: user.affiliate.id,
          },
          data: {
            deduction: 50,
          },
        });
      }
    }
    return user;
  })
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
