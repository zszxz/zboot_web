import apis from '@/http/apis'

const service = Vue => {
  Object.defineProperties(Vue.prototype, {
    $api: {
      get () {
        return apis
      }
    }
  })
}

export default service
