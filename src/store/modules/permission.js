import home from '@/http/system/home'

const permission = {
  state: {
    perm: [],
    asyncRouter: []
  },
  mutations: {
    addPermission (state, perm) {
      state.perm = perm
    },
    addRouter (state, router) {
      state.asyncRouter = router
    }
  },
  actions: {
    async addPermission (context) {
      const {data: res} = await home.getMenuUser({typeList: '3', buildTree: false})
      let perms = res.data.map(val => { return val.permission })
      context.commit('addPermission', perms)
    },
    async addRouter (context) {
      const {data: res} = await home.getMenuUser({typeList: '2', buildTree: false})
      // 路由组装
      const children = res.data.map(element => {
        let router = configRouter(element.path, element.title, element.component)
        return router
      })
      children.push(configRouter('/index', '首页', 'views/index'))
      let homeRouter = configRouter('/home', '主页', 'views/home', children, '/index')
      let routerArray = []
      routerArray.push(homeRouter)
      context.commit('addRouter', routerArray)
    }
  }
}
// 加载组件视图
const loadView = (view) => {
  return (resolve) => require([`@/${view}`], resolve)
}
// 配置路由选项
const configRouter = (path, title, view, children, redirect) => {
  let router = {}
  router.path = path
  router.meta = { title: title }
  router.component = loadView(view)
  router.children = children
  router.redirect = redirect
  return router
}

export default permission
