const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");
const axios = require("axios");

const generateAffiliateCode = (name) => {
  const uniqueSuffix = Date.now().toString(36);
  return `${name.slice(0, 3).toUpperCase()}${uniqueSuffix}`;
};
async function main() {
  // Menghapus data lama (optional)
  await prisma.category.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.affiliate.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.promo.deleteMany({});

  await prisma.category.create({
    data: {
      name: "Pakaian bayi",
      products: {
        create: [
          {
            name: "Baju bayi putih",
            product_images: {
              create: { url: "https://rb.gy/w7mdfy" },
            },
            description: "Baju putih untuk bayi",
            price: 60000,
            weight: 100,
            stock: 40,
            sku: "pakaian_bayi_001",
            slug: generateSlug("baju bayi putih"),
            keywords: "baju, bayi, putih",
          },
          {
            name: "Celana bayi",
            product_images: {
              create: { url: "https://rb.gy/59nihg" },
            },
            description: "celana untuk bayi.",
            price: 40000,
            weight: 150,
            stock: 12,
            sku: "pakaian_bayi_002",
            slug: generateSlug("celana bayi"),
            keywords: "celana, bayi, pakaian",
          },
          {
            name: "Overall Bayi",
            product_images: {
              create: { url: "https://rb.gy/r91jel" },
            },
            description: "Baju overall bayi",
            price: 200000,
            weight: 150,
            stock: 20,
            sku: "pakaian_bayi_003",
            slug: generateSlug("overall bayi"),
            keywords: "baju, overall, bayi",
          },
          {
            name: "Set Baju one piece",
            product_images: {
              create: { url: "https://rb.gy/dzyqqo" },
            },
            description: "set baju one piece bayi",
            price: 250000,
            weight: 300,
            stock: 20,
            sku: "pakaian_bayi_004",
            slug: generateSlug("baju one piece"),
            keywords: "baju, one piece, bayi, pakaian",
          },
          {
            name: "Topi Bayi",
            product_images: {
              create: { url: "https://rb.gy/4g5yla" },
            },
            description: "Topi bayi",
            price: 100000,
            weight: 200,
            stock: 30,
            sku: "pakaian_bayi_005",
            slug: generateSlug("topi bayi"),
            keywords: "Topi, bayi, pakaian",
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Perlengkapan Makan",
      products: {
        create: [
          {
            name: "botol bayi",
            product_images: {
              create: { url: "https://rb.gy/flu4aq" },
            },
            description: "botol menyusu",
            price: 200000,
            weight: 400,
            stock: 11,
            sku: "Alat_Makan_001",
            slug: generateSlug("botol bayi"),
            keywords: "alat, botol, bayi",
          },
          {
            name: "Sendok Plastik",
            product_images: {
              create: { url: "https://rb.gy/67ez4a" },
            },
            description: "Sendok Plastik warna warni.",
            price: 20000,
            weight: 400,
            stock: 50,
            sku: "Alat_makan_002",
            slug: generateSlug("Sendok Warna"),
            keywords: "alat",
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Perlengkapan Mandi",
      products: {
        create: [
          {
            name: "Handuk",
            product_images: {
              create: { url: "https://rb.gy/95wvsn" },
            },
            description: "Handuk",
            price: 120000,
            weight: 700,
            stock: 8,
            sku: "Handuk_003",
            slug: generateSlug("handuk"),
            keywords: "mandi, handuk, bayi",
          },
          {
            name: "sabun Mandi bayi",
            product_images: {
              create: { url: "https://rb.gy/br4k2s" },
            },
            description: "Sabun Mandi bayi.",
            price: 200000,
            weight: 900,
            stock: 50,
            sku: "Alat_mandi_002",
            slug: generateSlug("sabun mandi"),
            keywords: "mandi, sabun, bayi",
          },
          {
            name: "tempat Sabun Kodok",
            product_images: {
              create: { url: "https://rb.gy/kdamv3" },
            },
            description: "Sendok Stainless Steel.",
            price: 120000,
            weight: 500,
            stock: 21,
            sku: "Alat_mandi_003",
            slug: generateSlug("Wadah sabun"),
            keywords: "alat, tempat, sabun",
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "untuk ibu",
      products: {
        create: [
          {
            name: "gendongan anak",
            product_images: {
              create: {
                url: "https://rb.gy/63td5g",
              },
            },
            description: "untuk membantu ibu mengendong anaknya dengan nyaman.",
            price: 50000,
            weight: 1000,
            stock: 10,
            sku: "untuk_ibu_001",
            slug: generateSlug("gendongan anak"),
            keywords: "gendongan, anak, ibu",
          },
          {
            name: "bantal menyusui",
            product_images: {
              create: {
                url: "https://i.pinimg.com/736x/cf/50/80/cf508069339b0b84167e7bcadd297be5.jpg",
              },
            },
            description: "bantal untuk menyusui.",
            price: 100000,
            weight: 1500,
            stock: 20,
            sku: "bantal_menyusui_003",
            slug: generateSlug("bantal menyusui"),
            keywords: "bantal, menyusui, ibu",
          },
        ],
      },
    },
  });

  let provinces = await axios.get(
    "https://api.rajaongkir.com/starter/province",
    {
      headers: {
        key: process.env.RAJAONGKIR_SECRET_KEY,
      },
    }
  );
  provinces = provinces.data.rajaongkir.results.map((province) => {
    return {
      id: +province.province_id,
      name: province.province,
    };
  });

  let cities = await axios.get("https://api.rajaongkir.com/starter/city", {
    headers: {
      key: process.env.RAJAONGKIR_SECRET_KEY,
    },
  });
  cities = cities.data.rajaongkir.results.map((city) => {
    return {
      id: +city.city_id,
      name: city.city_name,
      province_id: +city.province_id,
    };
  });

  await prisma.city.createMany({
    data: cities,
  });

  console.log("City Seeding Success");

  const promo1 = await prisma.promo.create({
    data: {
      name: "Promo Final Project",
      code: "FINPRO",
      all_products: true,
      deduction: 10,
      quantity: 10,
      start_date: new Date(),
      end_date: new Date(new Date().getTime() + 3600000 * 24 * 30), // Promo berlaku 30 hari
    },
  });

  const promo2 = await prisma.promo.create({
    data: {
      name: "Promo Tahunan",
      code: "TAHUNAN",
      all_products: false,
      deduction: 10,
      quantity: 10,
      start_date: new Date(),
      end_date: new Date(new Date().getTime() + 3600000 * 24 * 365), // Promo berlaku 1 tahun
    },
  });

  await prisma.product_Promo.createMany({
    data: [
      {
        product_id: 704,
        promo_id: promo2.id,
      },
      {
        product_id: 705,
        promo_id: promo2.id,
      },
      {
        product_id: 706,
        promo_id: promo2.id,
      },
    ],
  });

  const user1 = await prisma.user.create({
    data: {
      email: "user@gmail.com",
      name: "Dono",
      role: "user",
      password: bcrypt.hashPassword("rumpang"),
      affiliate: {
        create: {
          code: generateAffiliateCode(""),
          deduction: 10,
        },
      },
      addresses: {
        create: [
          {
            title: "Kos",
            description: "Kos",
            detail_address: "JL. Griya Kos no.123",
            city_id: 22,
            province_id: 9,
            zip_code: 89933,
          },
          {
            title: "Rumah",
            description: "Rumah",
            detail_address: "JL. Raya no.456",
            city_id: 22,
            province_id: 9,
            zip_code: 89933,
          },
        ],
      },
      cart: {
        create: {
          shipping_cost: 20000,
          address_id: 64,
          promo_id: promo1.id,
          total_cost: 300000,
          deduction_cost: 30000,
          net_price: 270000,
          cart_details: {
            create: [
              { product_id: 707, quantity: 2, price: 200000 },
              { product_id: 708, quantity: 1, price: 150000 },
              { product_id: 709, quantity: 3, price: 450000 },
            ],
          },
        },
      },
      orders: {
        create: [],
      },
    },
  });

  const affiliateCodeUser1 = await prisma.affiliate.findUnique({
    where: { user_id: user1.id },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@gmail.com",
      name: "jasson",
      role: "user",
      password: bcrypt.hashPassword("thecakeisalie"),
      affiliate: {
        create: {
          code: generateAffiliateCode(""),
          deduction: 10,
        },
      },
      addresses: {
        create: {
          title: "Kantor",
          description: "Kantor",
          detail_address: "JL.Satwamarga no.33",
          city_id: 22,
          province_id: 9,
          zip_code: 89933,
        },
      },
      cart: {
        create: {
          shipping_cost: 25000,
          address_id: 66,
          promo_code: affiliateCodeUser1.code,
          promo_id: promo2.id,
          total_cost: 400000,
          deduction_cost: 20000,
          net_price: 380000,
          cart_details: {
            create: [
              { product_id: 710, quantity: 1, price: 150000 },
              { product_id: 705, quantity: 2, price: 300000 },
              { product_id: 706, quantity: 1, price: 200000 },
            ],
          },
        },
      },
      orders: {
        create: [],
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "admin",
      role: "admin",
      password: bcrypt.hashPassword("admin"),
    },
  });

  const order1 = await prisma.order.create({
    data: {
      user_id: user1.id,
      courier: "JNE",
      status: "waiting_payment",
      payment_receipt: "123456789",
      shipping_cost: 5000,
      address_id: 64,
      total_cost: 100000,
      deduction_cost: 5000,
      net_price: 95000,
      promo_id: promo1.id,
      order_details: {
        create: [
          { product_id: 707, quantity: 2, price: 200000 },
          { product_id: 708, quantity: 1, price: 150000 },
          { product_id: 709, quantity: 3, price: 450000 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      user_id: user2.id,
      courier: "POS",
      status: "processed",
      payment_receipt: "987654321",
      shipping_cost: 10000,
      address_id: 66,
      total_cost: 200000,
      deduction_cost: 10000,
      net_price: 190000,
      promo_id: promo2.id,
      order_details: {
        create: [
          { product_id: 710, quantity: 1, price: 150000 },
          { product_id: 705, quantity: 2, price: 300000 },
          { product_id: 706, quantity: 1, price: 200000 },
        ],
      },
    },
  });

  process.exit();
}

main();
