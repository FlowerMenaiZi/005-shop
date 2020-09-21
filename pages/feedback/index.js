// pages/feedback/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            },
        ],
        chooseImgs: [],
        textVal: "",
    },
    upLoadImgs: [],
    handleTabsItemChange(e) {
        const {
            index
        } = e.detail;
        let {
            tabs
        } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },

    // 点击+选择图片

    handleChooseImg() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (result) => {
                this.setData({
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
                })
            },

        });
    },

    // 点击自定义组件
    handleRemoveImg(e) {
        const {
            index
        } = e.currentTarget.dataset
        let {
            chooseImgs
        } = this.data;
        chooseImgs.splice(index, 1)
        this.setData({
            chooseImgs
        })
    },

    // 文本域的输入事件
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },

    // 提交按钮的单击事件
    handleFormSubmit() {
        const {
            textVal,
            chooseImgs
        } = this.data;
        // 检测合法性
        if (!textVal.trim()) {
            wx.showToast({
                title: '请输入您的问题内容',
                icon: "none",
                mask: true,
            });
            return
            // 不合法
        }
        wx.showLoading({
            title: "正在提交中",
            mask: true,
        });
        if (chooseImgs.length != 0) {
            chooseImgs.forEach((v, i) => {
                // wx.uploadFile({
                //     url: '',
                //     filePath: v,
                //     name: "file",
                //     formData: {},
                //     success: (result) => {
                //        let url=JSON.parse(result.data).url;
                //        this.upLoadImgs.push(url);

                //        if(i===chooseImgs.length-1){
                //            wx.hideLoading();
                //            this.setData({
                //             textVal:"",
                //             chooseImgs:[],
                //            });
                //            wx.showToast({
                //                title: '提交成功',
                //                mask: true,
                //            });

                //            wx.navigateBack({
                //                delta: 1
                //            });

                //        }
                //     },
                // });
                if (i === chooseImgs.length - 1) {
                    wx.hideLoading();
                    this.setData({
                        textVal: "",
                        chooseImgs: [],
                    });
                    wx.showToast({
                        title: '提交成功',
                        mask: true,
                    });

                    wx.navigateBack({
                        delta: 1
                    });
                }

            })
        } else {
            wx.hideLoading();
            this.setData({
                textVal: "",
                chooseImgs: [],
            });
            wx.showToast({
                title: '提交成功',
                mask: true,
            });

            wx.navigateBack({
                delta: 1
            });
        }



    }
})