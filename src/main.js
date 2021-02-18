// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import permission from './components/permission'
import api from '@/http'
import { borderBox11, borderBox12 } from '@jiaminghi/data-view'

Vue.use(borderBox11)
Vue.use(borderBox12)
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(permission)
Vue.use(api)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
