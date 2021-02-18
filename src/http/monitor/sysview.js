import request from '@/http/request'

// 获取系统内存信息
export const getMemoryInfo = (params) => {
  return request({
    url: 'system/memory/info',
    method: 'get',
    params: params
  })
}

// 获取系统cpu信息
export const getCpuInfo = (params) => {
  return request({
    url: 'system/cpu/info',
    method: 'get',
    params: params
  })
}

// 获取系统磁盘信息
export const getDiskInfo = (params) => {
  return request({
    url: 'system/disk/info',
    method: 'get',
    params: params
  })
} 

// 获取系统jvm信息
export const getJvmInfo = (params) => {
  return request({
    url: 'system/jvm/info',
    method: 'get',
    params: params
  })
}

// 获取系统j信息
export const getSysInfo = (params) => {
  return request({
    url: 'system/sys/info',
    method: 'get',
    params: params
  })
}

export default {
  getMemoryInfo,
  getCpuInfo,
  getDiskInfo,
  getJvmInfo,
  getSysInfo
}
