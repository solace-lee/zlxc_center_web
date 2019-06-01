import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import 'event-source-polyfill'
import apis from './api/apis'
import axios from "axios"
import {
    Loading
} from 'element-ui' //单独使用elementui loading

// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.snow.css'
// Vue.use(VueQuillEditor)
//axios请求处理 June
import {
    axiosReq
} from './config/http'
Vue.prototype.axiosReq = axiosReq
Vue.prototype.apis = apis
Vue.prototype.responseOk = 200 //响应状态常量

Vue.prototype.LOCAL = 'http://192.168.1.182:8888/admin'
// Vue.prototype.LOCAL = 'https://new.zhulixc.com/admin'

Vue.prototype.api = axios
//路由守卫  
router.beforeEach((to, from, next) => {
    // store.state.token = sessionStorage.getItem('token');
    // const token = store.state.token
    const token = window.localStorage.getItem('token')
    let needAuth = to.matched.some(item => item.meta.requireAuth);
    if (!token && needAuth) {
        next({ path: "/login" })
    } else {
        next()
    }
})

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})
