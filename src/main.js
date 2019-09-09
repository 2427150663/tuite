// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import './assets/icon/iconfont.css';
//图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.prototype.$axios = axios;
Vue.use(VueLazyload, {
  preLoad: 1.3,
  //加载失败
  error: "http://jwp.yuqing.pro:89/default/default.png",
  //加载中
  loading: "http://jwp.yuqing.pro:89/default/default.png",
  attempt: 1
})
Vue.config.productionTip = false;
import qs from 'qs'
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
axios.defaults.baseURL = "http://jwp.yuqing.pro:89/";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
Vue.config.productionTip = false
// import {getCookie} from 'util'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
Vue.prototype.openLoading = function () {
  const loading = this.$loading({           // 声明一个loading对象
    lock: true,                             // 是否锁屏
    text: '加载中',                     // 加载动画的文字
    spinner: '',             // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
    target: '.sub-main',                    // 需要遮罩的区域
    body: true,
    customClass: 'mask'                     // 遮罩层新增类名
  })
  // setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
  //   loading.close();                        // 关闭遮罩层
  // }, 10000)
  return loading;
}