const prisma = require("../lib/prisma.js");
const bcrypt = require("../lib/bcrypt.js");
const generateSlug = require("../lib/slug.js");

const generateAffiliateCode = (name) => {
  const uniqueSuffix = Date.now().toString(36);
  return `${name.slice(0, 3).toUpperCase()}${uniqueSuffix}`;
};
async function main() {
  await prisma.category.create({
    data: {
      name: "Pakaian bayi",
      products: {
        create: [
          {
            name: "Baju bayi putih",
            photo: "https://placeholder.com/2131231.jpg",
            description: "Baju putih untuk bayi",
            price: 60000,
            weight: 100,
            stock: 40,
            sku: "pakaian_bayi_001",
            slug: { create: generateSlug("baju bayi putih") },
            keywords: ["baju", "bayi", "putih"],
          },
          {
            name: "Celana bayi",
            photo: "https://placeholder./2929292.jpg",
            description: "celana untuk bayi.",
            price: 40000,
            weight: 150,
            stock: 12,
            sku: "pakaian_bayi_002",
            slug: { create: generateSlug("celana bayi") },
            keywords: ["celana", "bayi", "pakaian"],
          },
          {
            name: "Overall Bayi",
            photo: "https://placeholder.come/overallbayi.jpg",
            description: "Baju overall bayi",
            price: 200000,
            weight: 150,
            stock: 20,
            sku: "pakaian_bayi_003",
            slug: { create: generateSlug("overall bayi") },
            keywords: ["baju", "overall", "bayi"],
          },
          {
            name: "Set Baju one piece",
            photo: "https://placeholder.com/setbaju/jpg",
            description: "set baju one piece bayi",
            price: 250000,
            weight: 300,
            stock: 20,
            sku: "pakaian_bayi_004",
            slug: { create: generateSlug("baju one piece") },
            keywords: ["baju", "one piece", "bayi", "pakaian"],
          },
          {
            name: "Topi Bayi",
            photo: "https://placeholder.com/topibayi.jpg",
            description: "Topi bayi",
            price: 100000,
            weight: 200,
            stock: 30,
            sku: "pakaian_bayi_005",
            slug: { create: generateSlug("topi bayi") },
            keywords: ["Topi", "bayi", "pakaian"],
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
            photo: "https://placeholder.com/1544655638.jpg",
            description: "botol menyusu",
            price: 200000,
            weight: 400,
            stock: 11,
            sku: "Alat_Makan_001",
            slug: { create: generateSlug("botol bayi") },
            keywords: ["alat", "botol", "bayi"],
          },
          {
            name: "Sendok Plastik",
            photo: "https://placeholder.com/31453356673.jpg",
            description: "Sendok Plastik warna warni.",
            price: 20000,
            weight: 400,
            stock: 50,
            sku: "Alat_makan_002",
            slug: { create: generateSlug("Sendok Warna") },
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
            photo: "https://placeholder.com/25745623453.jpg",
            description: "Handuk",
            price: 120000,
            weight: 700,
            stock: 8,
            sku: "Handuk_003",
            slug: { create: generateSlug("handuk") },
            keywords: ["mandi", "handuk", "bayi"],
          },
          {
            name: "sabun Mandi bayi",
            photo: "https://placeholder.com/2313123.jpg",
            description: "Sabun Mandi bayi.",
            price: 200000,
            weight: 900,
            stock: 50,
            sku: "Alat_mandi_002",
            slug: { create: generateSlug("sabun mandi") },
            keywords: ["mandi", "sabun", "bayi"],
          },
          {
            name: "tempat Sabun Kodok",
            photo: "https://placeholder.com/3413412.jpg",
            description: "Sendok Stainless Steel.",
            price: 120000,
            weight: 500,
            stock: 21,
            sku: "Alat_mandi_003",
            slug: { create: generateSlug("Wadah sabun") },
            keywords: ["alat", "tempat", "sabun"],
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
            photo:
              "https://i.pinimg.com/736x/5f/2b/5a/5f2b5ad142a741928e7dfc95bf69dc73.jpg",
            description: "untuk membantu ibu mengendong anaknya dengan nyaman.",
            price: 50000,
            weight: 1000,
            stock: 10,
            sku: "untuk_ibu_001",
            slug: { create: generateSlug("gendongan anak") },
            keywords: ["gendongan", "anak", "ibu"],
          },
          {
            name: "bantal menyusui",
            photo:
              "https://i.pinimg.com/736x/cf/50/80/cf508069339b0b84167e7bcadd297be5.jpg",
            description: "bantal untuk menyusui.",
            price: 100000,
            weight: 1500,
            stock: 20,
            sku: "bantal_menyusui_003",
            slug: { create: generateSlug("bantal menyusui") },
            keywords: ["bantal", "menyusui", "ibu"],
          },
        ],
      },
    },
  });

  let provinces = await axios.get(
    "https://api.rajaongkir.com/starter/province",
    {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
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
      key: process.env.RAJAONGKIR_API_KEY,
    },
  });
  cities = cities.data.rajaongkir.results.map((city) => {
    return {
      id: +city.city_id,
      name: city.city_name,
    };
  });

  await prisma.city.createMany({
    data: cities,
  });

  console.log("City Seeding Success");

  const users = await prisma.user.create({
    data: {
      email: "user@gmail.com",
      name: "Dono",
      role: "user",
      password: bcrypt.hashPassword("rumpang"),
      addresses: {
        create: [
          {
            rtitle: "kantor",
            description: "kantor",
            detail_address: "JL.Satwamarga no.33",
            city_id: 92,
            province: "Jawa Barat",
            postal_code: 89933,
          },
        ],
      },
      affiliate: { create: generateAffiliateCode },
    },
  });

  await prisma.user.create({
    data: {
      email: "user2@gmail.com",
      name: "jasson",
      role: "user",
      password: bcrypt.hashPassword("thecakeisalie"),
      addresses: {
        create: [
          {
            title: "rumah",
            description: "rumah",
            detail_address: "JL.Gatotwaluyo no.82",
            city_id: 182,
            province: "Sulawesi Tenggara",
            postal_code: 88002,
          },
        ],
      },
      affiliate: { create: generateAffiliateCode },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "jovanonahak@gmail.com",
      name: "jovano",
      role: "admin",
      password: bcrypt.hashPassword("adminpass2"),
    },
  });

  const couriers = await prisma.courier.createMany({
    data: [
      {
        name: "jne",
      },
      {
        name: "pos",
      },
      {
        name: "tiki",
      },
    ],
  });

  process.exit();
}

main();
