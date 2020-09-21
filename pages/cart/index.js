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
         const cart = wx.getStorageSync("cart") || [];
         this.setData({
             address
         })
         this.setCart(cart);


     },

     // 点击收货地址按钮
     async handleChooseAddress() {
         try {
             const res1 = await getSetting();
             const scopeAddress = res1.authSetting["scope.address"];
             if (scopeAddress === false) {
                 await openSetting();
             }
             let address = await chooseAddress();
             address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
             wx.setStorageSync("address", address);
             console.log(address);
         } catch (error) {
             console.log(error);
         }
     },

     //  商品的选中
     handleItemChange(e) {
         // 获取被修改的商品的id
         const goods_id = e.currentTarget.dataset.id;
         // 获取购物车数组
         let {
             cart
         } = this.data;
         // 找到被修改的商品
         let index = cart.findIndex(v => v.goods_id === goods_id);
         // 取反
         cart[index].checked = !cart[index].checked;
         this.setCart(cart);

     },

     //  设置购物车状态重新计算底部数据
     setCart(cart) {
         let allChecked = true;
         let totalPrice = 0;
         let totalNum = 0;
         cart.forEach(v => {
             if (v.checked) {
                 totalPrice += v.num * v.goods_price;
                 totalNum += v.num;
             } else {
                 allChecked = false;
             }
         })
         allChecked = cart.length != 0 ? allChecked : false;
         this.setData({
             cart,
             totalPrice,
             totalNum,
             allChecked
         })
         wx.setStorageSync("cart", cart)
     },
     // 商品全选功能
     handleItemAllCheck() {
         //  获取data中的数据
         let {
             cart,
             allChecked
         } = this.data;
         // 修改值
         allChecked = !allChecked;
         //  遍历商品选中状态
         cart.forEach(v => v.checked = allChecked);
         this.setCart(cart)

     },

     //  商品数量编辑
     async handleItemNumEdit(e) {
         //  获取参数
         const {
             operation,
             id
         } = e.currentTarget.dataset;
         // 获取购物车数组
         let {
             cart
         } = this.data;
         const index = cart.findIndex(v => v.goods_id === id);
         if (cart[index].num === 1 && operation === -1) {
             const res = await showModal({
                 content: '您是否要删除？'
             });
             if (res.confirm) {
                 cart.splice(index, 1);
                 this.setCart(cart);
             }
         } else {
             cart[index].num += operation;
             this.setCart(cart)
         }
     },

     //  点击结算功能
     async handlePay() {
         const {
             address,
             totalNum
         } = this.data;
         if (!address.userName) {
             await showToast({title: '您还没选择收货地址'});
             return;
         }
         if(totalNum === 0){
            await showToast({title: '您还没选购商品'});
             return;
         }
         wx.navigateTo({
             url: '/pages/pay/index'
         });
           
     }
 })