import axios from 'axios';
//要在vue实例中才能重定向
import router from './router/index'
//
import Vue from 'vue'
const http = axios.create({
    baseURL: "http://112.74.99.5:3000/web/api"
})

//在所有请求前面都加上请求头
http.interceptors.request.use(config => {
    if(localStorage.getItem('token') && localStorage.getItem('id')){
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    }
    return config;
}, err => {
    console.log(err);
})

http.interceptors.response.use(config => {
    return config
},err => {
    if(err.response.status == 401 || err.response.status == 402){
        router.push('/login');
        Vue.prototype.$errMsg.fail(err.response.data.message);
        console.dir(err);
    }
})


export default http