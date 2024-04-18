const axios = require("axios");
require("dotenv").config();
const getProductHome = async (req, res) => {
    try {

        //console.log("ssss:", process.env.BASE_URL + `products`)
        let currentPage = req.params.currentPage;
        let dataProducts = await axios.get(process.env.BASE_URL + `prodouct/limit/${currentPage}`);
        let countProducts = await axios.get(process.env.BASE_URL + `prodouct/count`);
        //console.log("Data:", countProducts.data.data);
        let products = dataProducts.data.products;

        return res.render("admin/productAdmin.ejs", {
            products: products,
            countProducts: countProducts.data.data,
        });
    } catch (error) {
        console.log(error);
    }
};
const getProductHome2 = async (req, res) => {
    try {
        //console.log("ssss:", process.env.BASE_URL + `products`)
        let dataProducts = await axios.get(
            process.env.BASE_URL + `prodouct/limit/1`
        );
        let countProducts = await axios.get(
            process.env.BASE_URL + `prodouct/count`
        );
        //console.log("Data:", countProducts.data.data);
        let products = dataProducts.data.products;
        //console.log("Data:", dataProducts.data.products);
        return res.render("admin/productAdmin.ejs", {
            products: products,
            countProducts: countProducts.data.data,
        });
    } catch (error) {
        console.log(error);
    }
};
const getProductDetail = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await axios.get(process.env.BASE_URL + `product/${id}`);
        let data2 = await axios.get(process.env.BASE_URL + `getAllCategories`);
        let product = data.data.product;
        let categories = data2.data.categories;
        //console.log(categories)
        console.log(product.category_id)
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
            req.body.image = '/images/products/' + req.file.originalname;
            console.log(req.file);
        } else {
            req.body.image = req.body.img
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
                process.env.BASE_URL + `productByNamePage/${name}/page/1`
            );
            let len = await axios.get(
                process.env.BASE_URL + `productByName/${name}`
            );
            if (data.data.success !== false) {
                let products = data.data.product;

                console.log("a", name); 
                console.log("a", products.length);
                return res.render("admin/productAdmin.ejs", {
                    products: products,
                    nameSearch: name,
                    countProducts: len.data.product.length,
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
        console.log(name)

        let data = await axios.get(
            process.env.BASE_URL + `productByNamePage/${name}/page/${currentPage}`
        );
        let data2 = await axios.get(
            process.env.BASE_URL + `productByName/${name}`
        );
        console.log('len', data2.data.product.length)
        if (data.data.success !== false) {
            let products = data.data.product;

            console.log("a", name);
            console.log("a", products.length);
            return res.render("admin/productAdmin.ejs", {
                products: products,
                nameSearch: name,
                countProducts: data2.data.product.length,
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
        let data = await axios.delete(process.env.BASE_URL + `deleteProduct/${id}`);
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
        let data2 = await axios.get(process.env.BASE_URL + `getAllCategories`);
        let categories = data2.data.categories;
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
        if (req.file != null) {
            req.body.image = '/images/products/' + req.file.originalname;
            console.log(req.file);
        } else {
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
        if (req.body.date_of_manufacture == null) {
            req.flash("err", `Vui lòng nhập ngày sản xuất`);
            res.redirect("/admin/product/create");
        }
        if (req.body.expiration_date == null) {
            req.flash("err", `Vui lòng nhập ngày hết hạn`);
            res.redirect("/admin/product/create");
        }
        let dataProducts = await axios.post(
            process.env.BASE_URL + `addProduct`,
            req.body
        );
        //console.log("Data create:", datasend);
        if (dataProducts.data.success !== false) {
            req.flash("success", `${dataProducts.data.message}`);
            res.redirect("/admin/product/create");
        } else {
            req.flash("err", `${dataProducts.data.message}`);
            res.redirect("/admin/product/create");
        }
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
    createProduct
};