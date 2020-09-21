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
        goodsObj:{},
        isCollect:false
    },
    // 商品对象
    goodsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let pages =  getCurrentPages();
        let currentPage=pages[pages.length-1]
        let options = currentPage.options;
        const {goods_id}=options;
        this.getGoodsDetail(goods_id);
          
    },

    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
        this.goodsInfo=goodsObj;
        
        // 获取缓存中的商品收藏的数组
        let collect=wx.getStorageSync("collect")||[];
        // 判断
        let isCollect=collect.some(v=>v.goods_id===this.goodsInfo.goods_id);
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                // iPhone部分手机不识别webp图片格式
                // 最好找后台让他修改
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics
            },
            isCollect
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

    // 点击商品收藏图标
    handleCollect(){
        let isCollect=false;
        let collect=wx.getStorageSync("collect")||[];
        let index=collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
        if (index !== -1){
            // 已经收藏，再数组中删除该商品
            collect.splice(index,1);
            isCollect=false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });
              
        }else{
            collect.push(this.goodsInfo);
            isCollect=true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }
        wx.setStorageSync("collect", collect);
        this.setData({
            isCollect
        })
    }
})