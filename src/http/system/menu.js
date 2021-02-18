import request from '@/http/request'

// 获取菜单树
export const getMenuTree = (params) => {
  return request({
    url: 'system/menus/tree',
    method: 'get',
    params: params
  })
}

// 添加菜单
export const addMenu = (params) => {
  return request({
    url: 'system/menus',
    method: 'post',
    data: params
  })
}

// 根据id获取菜单
export const getMenuById = (id, params) => {
  return request({
    url: `system/menus/${id}`,
    method: 'get',
    params: params
  })
}

// 修改菜单
export const editMenu = (id, params) => {
  return request({
    url: `system/menus/${id}`,
    method: 'put',
    data: params
  })
}

// 删除菜单
export const deleteMenu = (id) => {
  return request({
    url: `system/menus/${id}`,
    method: 'delete'
  })
}

export default {
  getMenuTree,
  addMenu,
  getMenuById,
  editMenu,
  deleteMenu
}
