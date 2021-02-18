import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const staticRoutes = [
  {
    path: '/',
    meta: { title: '登录' },
    component: (resolve) => require(['@/views/system/login'], resolve)
  },
  {
    path: '/login',
    meta: { title: '登录' },
    component: (resolve) => require(['@/views/system/login'], resolve)
  }
  // 在这里可以添加静态路由
]

const router = new Router({
  routes: staticRoutes,
  mode: 'hash'
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  } else {
    // 路由刷新的时候如果权限为空重新拉取
    if (store.state.permission.perm.length === 0) {
      store.dispatch('addPermission')
    }
    // 路由刷新的时候如果路由为空重新拉取添加
    if (store.state.permission.asyncRouter.length === 0) {
      store.dispatch('addRouter')
        .then(() => {
          router.addRoutes(store.state.permission.asyncRouter)
          next({ ...to, replace: true })
        }).catch((error) => {
          console.log('路由加载出错', error)
        })
    } else {
      next()
    }
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
