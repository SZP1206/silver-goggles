import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import Axios from 'axios'

Vue.prototype.$http = Axios
// 配置请求的根路径
Axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
