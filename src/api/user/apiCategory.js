const axios = require("axios");
require("dotenv").config();

const getCategory = async (req, res) => {
  try {
    let data_category = await axios.get(process.env.BASE_URL + `categories`);
    console.log("Data:", data_category.data.products);
    return res.render("user/category_skincare.ejs", {
      products: data_category.data.products,
      category_skincare: data_category.data.category_skincare,
      category_makeup: data_category.data.category_makeup,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCategorySkinCare = (req, res) => {};

module.exports = {
  getCategory,
  getCategorySkinCare,
};
