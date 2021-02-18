import request from '@/http/request'

// 登陆
export const login = (params) => {
  return request({
    url: '/system/login',
    method: 'post',
    data: params
  })
}

export default {
  login
}
