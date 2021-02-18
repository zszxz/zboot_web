import request from '@/http/request'

// 获取部门树
export const getDepTree = (params) => {
  return request({
    url: 'system/dep/tree',
    method: 'get',
    params: params
  })
}

// 根据id获取部门
export const getDepById = (id) => {
  return request({
    url: `system/dep/${id}`,
    method: 'get'
  })
}

// 根据id获取部门用户
export const getUserByDepId = (id) => {
  return request({
    url: `system/dep/user/${id}`,
    method: 'get'
  })
}

// 添加部门
export const addDep = (params) => {
  return request({
    url: 'system/dep',
    method: 'post',
    data: params
  })
}

// 修改部门
export const editDep = (id, params) => {
  return request({
    url: `system/dep/${id}`,
    method: 'put',
    data: params
  })
}

// 删除部门
export const deleteDep = (id) => {
  return request({
    url: `system/dep/${id}`,
    method: 'delete'
  })
}

// 删除部门
export const deleteDepUser = (depId, userId) => {
  return request({
    url: `system/dep/${depId}/${userId}`,
    method: 'delete'
  })
}

// 获取用户
export const getUserList = (params) => {
  return request({
    url: 'system/user/list',
    method: 'get',
    params: params
  })
}

// 添加部门
export const addDepUser = (params) => {
  return request({
    url: 'system/dep/user',
    method: 'post',
    data: params
  })
}

export default {
  getDepTree,
  getDepById,
  getUserByDepId,
  addDep,
  editDep,
  deleteDep,
  deleteDepUser,
  getUserList,
  addDepUser
}
