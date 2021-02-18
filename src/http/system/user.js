import request from '@/http/request'

// 用户列表
export const getUserList = (params) => {
  return request({
    url: 'system/user/page',
    method: 'get',
    params: params
  })
}

// 用户注册
export const addrUser = (params) => {
  return request({
    url: 'system/register',
    method: 'post',
    data: params
  })
}

// 根据用户编号获取用户信息
export const getUserById = (id, params) => {
  return request({
    url: `system/user/${id}`,
    method: 'get',
    params: params
  })
}

// 根据用户编号获取用户信息
export const editUser = (id, params) => {
  return request({
    url: `system/user/${id}`,
    method: 'put',
    data: params
  })
}

// 根据用户编号获取用户信息
export const deleteUser = (id) => {
  return request({
    url: `system/user/${id}`,
    method: 'delete'
  })
}

// 获取用户拥有的角色
export const getUserRole = (id) => {
  return request({
    url: `system/user/role/${id}`,
    method: 'get'
  })
}

// 获取角色
export const getRoles = () => {
  return request({
    url: 'system/roles',
    method: 'get'
  })
}

// 分配角色
export const setUserRoles = (id, params) => {
  return request({
    url: `system/user/role/${id}`,
    method: 'put',
    data: params
  })
}

export default {
  getUserList,
  addrUser,
  getUserById,
  editUser,
  deleteUser,
  getUserRole,
  getRoles,
  setUserRoles
}
