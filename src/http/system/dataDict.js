import request from '@/http/request'

// 获取数据字典列表
export const getDataDict = (params) => {
  return request({
    url: 'system/data/dict/page',
    method: 'get',
    params: params
  })
}

// 通过编号获取数据字典
export const getDataDictById = (id) => {
  return request({
    url: `system/data/dict/${id}`,
    method: 'get'
  })
}

// 添加数据字典
export const addDataDict = (params) => {
  return request({
    url: 'system/data/dict',
    method: 'post',
    data: params
  })
}

// 修改数据字典
export const editDataDict = (id, params) => {
  return request({
    url: `system/data/dict/${id}`,
    method: 'put',
    data: params
  })
}

// 删除数据字典
export const deleteDataDict = (id) => {
  return request({
    url: `system/data/dict/${id}`,
    method: 'delete'
  })
}

export default {
  getDataDict,
  getDataDictById,
  addDataDict,
  editDataDict,
  deleteDataDict
}
