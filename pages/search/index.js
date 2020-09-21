// pages/search/index.js
import {
    request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods:[],
        // 按钮是否下显示
        isFocus:false,
        inpValue:'',
    },
    timeId:-1,
    handleInput(e){
        const {value}=e.detail
        if (!value.trim()){
            this.setData({isFocus:false,goods:[]})
            return;
        }
        clearTimeout(this.timeId);
        this.setData({isFocus:true})
        this.timeId=setTimeout(()=>{
            this.qsearch(value);
        },500)
        
    },
    async qsearch(query){
        const res=await request({url:"/goods/qsearch",data:{query}});
        console.log(res);
        this.setData({
            goods:res
        })
    },
    handleCancel(){
        this.setData({
            inpValue:"",
            isFocus:false,
            goods:[],
        })
    }
})