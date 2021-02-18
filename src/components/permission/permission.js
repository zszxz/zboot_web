import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const value = binding.value
    let permission = store.state.permission.perm
    let hasPermission = permission.some(val => {
      return value.indexOf(val) >= 0 ? true : false
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
