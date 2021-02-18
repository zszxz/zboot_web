import request from '@/http/request'

// 获取系统日志信息
export const getLogList = (params) => {
  return request({
    url: 'system/log/page',
    method: 'get',
    params: params
  })
}

export default {
  getLogList
}
