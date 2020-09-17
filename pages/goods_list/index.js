// pages/goods_list/index.js
import {
    request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            }
        ],
        goodsList:[],
    },
    QueryParams:{
        query:"",
        cid:"",
        pagenum:1,
        pagesize:10
    },

    // 总页数
    totalPages:1,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid = options.cid
        this.getCoodsList();
    },

    async getCoodsList(){
        
        const res=await request({url:"/goods/search",data:this.QueryParams});
        // 获取总条数
        const total=res.total;
        // 计算总页数
        this.totalPages=Math.ceil(total / this.QueryParams.pagesize);
        this.setData({
            // 拼接数组
            goodsList:[...this.data.goodsList,...res.goods]
        })
        // 关闭下拉刷新窗口
        wx.stopPullDownRefresh();
        
    },

    handleTabsItemChange(e) {
        const {
            index
        } = e.detail;
        let {tabs} = this.data;
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
        this.setData({
            tabs
        })
    },

    // 滚动条触底事件
    onReachBottom(){
        // 判断还有没有下一页
        if (this.QueryParams.pagenum >= this.totalPages){
            // 没有下一页
            wx.showToast({
                title: '没有下一页数据'
            });
              
        }else{
            // 还有下一页
            this.QueryParams.pagenum++;
            this.getCoodsList();
        }
    },

    // 用户下拉刷新页面数据
    onPullDownRefresh(){
        // 1.重置数组
        this.setData({
            goodsList:[]
        })
        // 2.重置页码
        this.QueryParams.pagenum=1;
        // 3.重新发送请求
        this.getCoodsList();
    }


})