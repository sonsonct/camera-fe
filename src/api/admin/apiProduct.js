const axios = require("axios");

require("dotenv").config();
const getProductHome = async (req, res) => {
  try {
    console.log(req.params.currentPage);
    let dataProducts = await axios.get(
      process.env.BASE_URL +
        `products?pageSize=5&page=${req.params.currentPage}`
    );
    //console.log("Data:", dataProducts.data.data.data);
    //console.log("total page:", dataProducts.data.data.totalPage);
    return res.render("admin/productAdmin.ejs", {
      products: dataProducts.data.data.data,
      totalPage: dataProducts.data.data.totalPage,
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductHome2 = async (req, res) => {
  try {
    let dataProducts = await axios.get(
      process.env.BASE_URL + `products?pageSize=5`
    );
    // console.log("Data:", dataProducts.data.data.data);
    // console.log("total page:", dataProducts.data.data.totalPage);
    return res.render("admin/productAdmin.ejs", {
      products: dataProducts.data.data.data,
      totalPage: dataProducts.data.data.totalPage,
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await axios.get(process.env.BASE_URL + `products/${id}`);
    let data2 = await axios.get(process.env.BASE_URL + `public/categories/all`);
    let product = data.data.data;
    console.log(product);
    let categories = data2.data.data;
    console.log(product.category_id);
    if (data.data.success !== false) {
      return res.render("admin/editProduct.ejs", { product, categories });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const updateProduct = async (req, res) => {
  try {
    //console.log("ssss:", process.env.BASE_URL + `products`)

    // datasend = {
    //     body: req.body,
    //     //file: req.file,
    // };

    if (req.file != null) {
      req.body.image = "/images/products/" + req.file.originalname;
      console.log(req.file);
    } else {
      req.body.image = req.body.img;
    }

    //console.log("Data:", req.body);
    let dataProducts = await axios.put(
      process.env.BASE_URL + `updateProduct/${req.body.id}`,
      req.body
    );
    //console.log("Data:", req.body);
    //console.log(dataProducts.data.product.id)

    if (dataProducts.data.success !== false) {
      return res.render("success.ejs", {
        message: "sửa sản phẩm thành công",
        url: `/admin/product/edit/${dataProducts.data.product.id}`,
      });
    } else {
      return res.render("success.ejs", {
        message: "sửa sản phẩm thất bại",
        url: `/admin/product/edit/${dataProducts.data.product.id}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getProductByName = async (req, res) => {
  try {
    let name = req.body.name;
    if (name == "") {
      return res.render("success.ejs", {
        message: "vui lòng nhập tên sản phẩm",
        url: "/admin/product/",
      });
    } else {
      let data = await axios.get(
        process.env.BASE_URL +
          `products?page=1&pageSize=5&searchKey=${name}/page/1`
      );
      console.log(data.data.data);

      if (data.data.data.data.length > 0) {
        return res.render("admin/productAdmin.ejs", {
          products: data.data.data.data,
          nameSearch: name,
          totalPage: data.data.data.totalPage,
        });
      } else {
        return res.render("admin/productAdmin.ejs", {
          message: `không tìm thấy sản phẩm nào có tên: ${name}`,
          nameSearch: name,
        });
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const getProductByNamePage = async (req, res) => {
  try {
    let name = req.params.name;
    let currentPage = req.params.currentPage;
    console.log(name);

    let dataProducts = await axios.get(
      process.env.BASE_URL +
        `products?page=${currentPage}&pageSize=5&searchKey=${name}`
    );

    if (dataProducts.data.data.data.length > 0) {
      // console.log("a", name);
      // console.log("a", products.length);
      return res.render("admin/productAdmin.ejs", {
        products: dataProducts.data.data.data,
        totalPage: dataProducts.data.data.totalPage,
        nameSearch: name,
      });
    } else {
      return res.render("admin/productAdmin.ejs", {
        message: `không tìm thấy sản phẩm nào có tên: ${name}`,
        nameSearch: name,
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    let data = await axios.delete(process.env.BASE_URL + `products/${id}`);
    if (data.data.success !== false) {
      return res.render("success.ejs", {
        message: "xóa sản phẩm thành công",
        url: "/admin/product/",
      });
    } else {
      return res.render("success.ejs", {
        message: "xóa sản phẩm thất bại",
        url: "/admin/product/",
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const getCreateProduct = async (req, res) => {
  try {
    let data2 = await axios.get(process.env.BASE_URL + `public/categories/all`);
    let categories = data2.data.data;
    // console.log(categories);
    if (data2.data.success !== false) {
      let err = req.flash("err");
      let success = req.flash("success");
      return res.render("admin/createProduct.ejs", {
        success,
        err,
        categories,
      });
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
const createProduct = async (req, res) => {
  try {
    console.log("db create prd", req.file);
    //console.log("db create prd", req.body);

    if (req.file == null) {
      req.flash("err", `Vui lòng nhập ảnh sản phẩm`);
      res.redirect("/admin/product/create");
    }
    if (req.body.name == null) {
      req.flash("err", `Vui lòng nhập tên sản phẩm`);
      res.redirect("/admin/product/create");
    }
    if (req.body.price == null) {
      req.flash("err", `Vui lòng nhập giá sản phẩm`);
      res.redirect("/admin/product/create");
    }
    if (req.body.quantity == null) {
      req.flash("err", `Vui lòng nhập số lượng sản phẩm`);
      res.redirect("/admin/product/create");
    }
    if (isNaN(req.body.price)) {
      req.flash("err", `Giá sản phẩm phải là số`);
      res.redirect("/admin/product/create");
    }
    if (isNaN(req.body.quantity)) {
      req.flash("err", `Số lượng sản phẩm phải là số`);
      res.redirect("/admin/product/create");
    }

    if (req.body.category_id == "chọn danh mục sản phẩm") {
      req.flash("err", `Vui lòng nhập danh mục sản phẩm`);
      res.redirect("/admin/product/create");
    }

    //var formData = new FormData();

    // Thêm các trường dữ liệu vào formData
    // formData.append("image", blob, "Screenshot 2024-03-10 171732.png");
    // // let formData = new FormData();

    // formData.append("image", req.file);
    // formData.append("categoryId", req.body.category_id);
    // formData.append("productName", req.body.name);
    // formData.append("content", req.body.description);
    // formData.append("count", req.body.quantity);
    // formData.append("price", req.body.price);

    let dataProducts = await axios.post(
      process.env.BASE_URL + `products`,
      // image: req.file,
      // categoryId: req.body.category_id,
      // productName: req.body.name,
      // content: req.body.description,
      // count: req.body.quantity,
      // price: req.body.price,
      formData
    );
    console.log("Data create:", dataProducts.data.data);
    // if (dataProducts.data.success !== false) {
    //   req.flash("success", `${dataProducts.data.message}`);
    //   res.redirect("/admin/product/create");
    // } else {
    //   req.flash("err", `${dataProducts.data.message}`);
    //   res.redirect("/admin/product/create");
    // }
  } catch (error) {
    console.log("loi tao san pham moi", error);
  }
};
module.exports = {
  getProductHome2,

  getProductByName,
  getProductHome,

  getProductDetail,
  updateProduct,
  deleteProduct,
  getProductByNamePage,
  getCreateProduct,
  createProduct,
};
