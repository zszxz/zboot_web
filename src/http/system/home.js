import request from '@/http/request'

// 获取用户菜单
export const getMenuUser = (params) => {
  return request({
    url: '/system/menus/user',
    method: 'get',
    params: params
  })
}

// 修改密码
export const editPassword = (params) => {
  return request({
    url: 'system/password',
    method: 'put',
    data: params
  })
}

export default {
  getMenuUser,
  editPassword
}
