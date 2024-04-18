const axios = require("axios");
require("dotenv").config();
const getHomeSale = async (req, res) => {
    try {
        let product = await axios.get(process.env.BASE_URL + `getSale/page/1`);
        let productCount = await axios.get(process.env.BASE_URL + `getSale`);
        console.log(productCount.data.product.length)
        return res.render("admin/saleAdmin.ejs",{
            productSale: product.data.product,
            productCount: productCount.data.product.length,
        });
    } catch (error) {
        console.log(error);
    }
};
const getSalePage = async (req, res) => {
    try {
        let page = req.params.currentPage
        let product = await axios.get(process.env.BASE_URL + `getSale/page/${page}`);
        let productCount = await axios.get(process.env.BASE_URL + `getSale`);
        console.log("count",productCount.data.product.length)
        return res.render("admin/saleAdmin.ejs", {
            productSale: product.data.product,
            productCount: productCount.data.product.length,
        });
    } catch (error) {
        console.log(error);
    }
};
const addProductSale = async (req, res) => {
    let prodouct_id = req.body.prodouct_id;
    let discount = req.body.discount;
    const referer = req.get('referer');
    if (prodouct_id == "") {
        return res.render("success.ejs", {
            message: "vui lòng chọn sản phẩm",
            url: referer,
        });
    }
    if (discount == "") {
        return res.render("success.ejs", {
            message: "vui lòng chọn giảm giá",
            url: referer,
        });
    }
    else{
        let dataProducts = await axios.post(
            process.env.BASE_URL + `addSale`,
            req.body
        );
        console.log(dataProducts.data)
        if (dataProducts.data.success !== false) {
            return res.render("success.ejs", {
                message: "Thêm sale thành công",
                url: referer,
            });
        } else {
            return res.render("success.ejs", {
                message: `Thêm sale thất bại ${dataProducts.data.err.detail}`,
                url: referer,
            });
        }
    }
}
const deleteProduct = async (req, res) => {
    try {
        let id = req.params.product_id;
        console.log(id);
        let data = await axios.delete(process.env.BASE_URL + `deleteSale/${id}`);
        if (data.data.success !== false) {
            return res.render("success.ejs", {
                message: "xóa sản phẩm thành công",
                url: "/admin/sale/",
            });
        } else {
            return res.render("success.ejs", {
                message: "xóa sản phẩm thất bại",
                url: "/admin/sale/",
            });
        }
    } catch (error) {
        console.log("Error:", error);
    }
};
const updateDiscount = async (req, res) => {
    try {
        console.log(req.body)
        let dataProducts = await axios.put(
            process.env.BASE_URL + `updateSale/${req.body.product_id}`,
            req.body
        );
        const referer = req.get('referer');
        if (dataProducts.data.success !== false) {
            return res.render("success.ejs", {
                message: "sửa discount thành công",
                url: referer,
            });
        } else {
            return res.render("success.ejs", {
                message: "sửa discount thất bại",
                url: referer,
            });
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports={
    getHomeSale,
    addProductSale,
    getSalePage,
    deleteProduct,
    updateDiscount
}