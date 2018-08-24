import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import './components/components'
import 'video.js/dist/video-js.css'
import VueVideoPlayer from 'vue-video-player';
import echarts from 'echarts';

Vue.use(VueVideoPlayer, {
  options: {
    width: 800,
    height: 600,
    controls: true,
    muted: false,
    autoplay: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0]
  }
})
Vue.use(ElementUI)
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (token !== null && typeof token !== 'undefined' && token.toString().trim() !== '') {
      next()
    } else {
      // token无效, 重新登录!
      next({
        path: '/login',
        query: {
          code: 401,
          returnUrl: from.path
        }
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
