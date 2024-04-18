const axios = require("axios");
require("dotenv").config();
const getOrderHome = async (req, res) => {
    try {
        let dataOrder = await axios.get(process.env.BASE_URL + `getOrder/page/1`);
        let dataOrderALL = await axios.get(process.env.BASE_URL + `getAllOrder`);
        //console.log("Data order:", dataOrder.data.data);
        return res.render("admin/orderAdmin.ejs", {
            dataOrder: dataOrder.data.order,
            countdataOrder: dataOrderALL.data.order.length
        });
    } catch (error) {
        console.log(error);
    }
};
const confirmOrder = async (req, res) => {
    try {
        orderId = req.params.orderId
        console.log(orderId)
        let dataOrder = await axios.put(process.env.BASE_URL + `confirmOrder/${orderId}`);
        console.log("Data order:", dataOrder);
        if (dataOrder.data.success !== false) {
            return res.render('success.ejs', { message: "Xác nhận đơn hàn thành công", url: '/admin/order/' })
        } else {
            return res.render('success.ejs', { message: "Xác nhận đơn hàn thất bại", url: '/admin/order/' })
        }
    } catch (error) {
        console.log(error);
    }
};
const deleteOrder = async (req, res) => {
    try {
        orderId = req.params.orderId
        console.log(orderId)
        let dataOrder = await axios.delete(process.env.BASE_URL + `deleteOrder/${orderId}`);
        //console.log("Data order:", dataOrder);
        if (dataOrder.data.success !== false) {
            return res.render('success.ejs', { message: "Xóa đơn hàn thành công", url: '/admin/order/' })
        } else {
            return res.render('success.ejs', { message: "Xóa đơn hàn thất bại", url: '/admin/order/' })
        }
    } catch (error) {
        console.log(error);
    }
};
const paginationOrder = async (req, res) => {
    try {
        let currentPage = req.params.currentPage;
        let dataOrderALL = await axios.get(process.env.BASE_URL + `getAllOrder`);
        let dataOrder = await axios.get(process.env.BASE_URL + `getOrder/page/${currentPage}`);
        console.log("Data order:", dataOrderALL.data.order.length);
        return res.render("admin/orderAdmin.ejs", {
            dataOrder: dataOrder.data.order,
            countdataOrder: dataOrderALL.data.order.length
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getOrderHome,
    confirmOrder,
    deleteOrder,
    paginationOrder
}