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
    let deduction =0;
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate affiliate code
    const affiliateCode = generateAffiliateCode(name);
    // Validasi affiliate_code jika tidak null
    if (affiliate_code) {
      const validate = await validateAffiliate(affiliate_code);      
      deduction =validate;
    }
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
            deduction: deduction,
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
  })
};
const validateAffiliate = async(params)=>{
  let check_affiliate = await prisma.affiliate.findFirst({
    where: {
      code: params,
    },
  });

  if (!check_affiliate) {
    throw { name: "ErrorNotFound", message: "Affiliate code not found" };
  } else {
    return deduction=50;
  }
}
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
