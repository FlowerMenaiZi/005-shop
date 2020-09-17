import {
    request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/goos_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:{}
    },
    // 商品对象
    goodsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {goods_id} = options;
        this.getGoodsDetail(goods_id);
    },

    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
        this.goodsInfo=goodsObj;
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                // iPhone部分手机不识别webp图片格式
                // 最好找后台让他修改
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics
            }
        })
    },

    handlePrevewImage(e){
        const urls=this.goodsInfo.pics.map(v=>v.pics_mid)
        const current=e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        });
          
    },

    handleCartAdd(){
        
        let cart=wx.getStorageSync("cart")||[];
        let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
        if (index === -1){
            // 不存在 添加
            this.goodsInfo.num=1;
            this.goodsInfo.checked=true;
            console.log(this.goodsInfo);
            cart.push(this.goodsInfo);
            
        }else{
            // 已经存在 
            cart[index].num++;
        }
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon:'success',
            mask: true
            
        });
    },
})