 // pages/cart/index.js

 import {
    getSetting,
    chooseAddress,
    openSetting,
    showModal,
    showToast
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        const address = wx.getStorageSync("address");
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车数组
        cart=cart.filter(v=>v.checked);   
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price;
            totalNum += v.num;
        })
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
    },
})