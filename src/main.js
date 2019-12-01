import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './utils/errorLog' // error log

import * as filters from './filters' // global filters

import API from './api'
Vue.prototype.$API = API // 全局API接口引用

// 可拖拽蒙层
import elDragDialog from '@/directive/el-dragDialog'
Vue.use(elDragDialog)

// 三级级联地区
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)


// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(Element, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})