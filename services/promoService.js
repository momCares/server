const prisma = require("../lib/prisma");
// convert date
const convertDate = (params) => {
    // returns the difference between UTC time and local time.
    // returns the difference in minutes.
  const offset = new Date().getTimezoneOffset();
  const myDate = Date.parse(params) - offset * 60 * 100;
  const isodateString = new Date(myDate).toISOString();
  return isodateString;
};
const findAll = async (params) => {
    const promo = await prisma.promo.findMany();
    return promo;
};

const findOne = async (params) => {
  const {id} = params;
  const promo = await prisma.promo.findUnique({
    where :{
      id: parseInt(id)
    }
  });
  return promo;
};

const create = async (params) => {
  const {
    name,
    code,
    all_products,
    deduction,
    quantity,
    start_date,
    end_date,
  } = params;
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const promo = await prisma.promo.create({
    data: {
      name,
      code,
      all_products,
      deduction,
      quantity,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return promo;
};

const update = async (params) => {
  const {
    name,
    code,
    all_products,
    deduction,
    quantity,
    start_date,
    end_date,
  } = params.body;  
  const {id}= params.params
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const promo = await prisma.promo.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      code,
      all_products,
      deduction,
      quantity,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return promo;
};

const destroy = async (params) => {};

module.exports = { findAll, findOne, create, update, destroy };
