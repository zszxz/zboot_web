import request from '@/http/request'

// 获取菜单树
export const getMenuTree = (params) => {
  return request({
    url: 'system/menus/tree',
    method: 'get',
    params: params
  })
}

// 获取角色拥有的菜单
export const getRoleMenu = (id, params) => {
  return request({
    url: `system/menus/role/${id}`,
    method: 'get',
    params: params
  })
}

// 获取角色列表
export const getRoleList = (params) => {
  return request({
    url: 'system/role/page',
    method: 'get',
    params: params
  })
}

// 添加角色
export const addRole = (params) => {
  return request({
    url: 'system/role',
    method: 'post',
    data: params
  })
}

// 分配角色权限菜单
export const setRoleMenu = (id, params) => {
  return request({
    url: `system/menus/role/${id}`,
    method: 'put',
    data: params
  })
}

// 通过编号获取角色
export const getRoleById = (id) => {
  return request({
    url: `system/role/${id}`,
    method: 'get'
  })
}

// 修改角色信息
export const editRole = (id, params) => {
  return request({
    url: `system/role/${id}`,
    method: 'put',
    data: params
  })
}

// 删除角色
export const deleteRole = (id) => {
  return request({
    url: `system/role/${id}`,
    method: 'delete'
  })
}

export default {
  getMenuTree,
  getRoleMenu,
  getRoleList,
  addRole,
  setRoleMenu,
  getRoleById,
  editRole,
  deleteRole
}
