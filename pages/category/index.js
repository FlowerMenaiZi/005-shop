// pages/category/index.js
import {
    request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的内容数据
        rightContent: [],
        // 被点击的左侧的菜单
        currentIndex: 0,
        scrollTop: 0
    },
    // 接口的返回数据
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            // 不存在 发送请求
            this.getCates();

        } else {
            // 有旧的数据
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates();
            } else {
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }

    },
    async getCates() {
        // 使用es7的async await
        const res = await request({
            url: "/categories"
        });
        this.Cates = res;
        // 把接口的数据存入本地存储中
        wx.setStorageSync("cates", {
            time: Date.now(),
            data: this.Cates
        })
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })

    },
    handleItemTap(e) {
        // console.log(e);
        const {
            index
        } = e.currentTarget.dataset;
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0
        })
    }

})