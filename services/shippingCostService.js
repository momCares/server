require("dotenv").config();
const axios = require("axios");

const getShippingCostAll = async (params) => {

  const { city_id, courier_name, total_weight=0 } = params.body;
  const store_city_id=444;
  console.log(params.body,store_city_id)
  const response = await axios.post(
    "https://api.rajaongkir.com/starter/cost",
    {
      origin: store_city_id,
      destination: city_id,
      weight: total_weight,
      courier: courier_name,
    },
    {
      headers: {
        key: process.env.RAJAONGKIR_SECRET_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log(response.data.rajaongkir.results[0].costs)

  return response.data.rajaongkir.results[0].costs;
};

const getShippingCost = async (params) => {
  try {
    const {
      city_id,
      total_weight,
      courier_name,
      shipping_method,
      store_city_id,
    } = params;
    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: store_city_id,
        destination: city_id,
        weight: total_weight,
        courier: courier_name,
      },
      {
        headers: {
          key: process.env.RAJAONGKIR_SECRET_KEY,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data.rajaongkir.results[0]);
    // Get all shipping method
    const courier_shipping_methods =
      response.data.rajaongkir.results[0].costs.map((cost) => cost.service);
    // Check if shipping method is available
    if (!courier_shipping_methods.includes(shipping_method)) {
      throw { name: "ErrorNotFound" };
    } else {
      // Get shipping cost based on shipping method
      const shipping_cost = response.data.rajaongkir.results[0].costs.find(
        (cost) => cost.service == shipping_method
      );
      return shipping_cost.cost[0].value;
    }
  } catch (error) {
    if (error.name && error.message) {
      throw error;
    } else {
      throw { name: "ErrorFetch", message: "Error Fetching Shipping Cost" };
    }
  }
};
module.exports = { getShippingCost,getShippingCostAll };
