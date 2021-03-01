import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// 创建axios实例
const https = axios.create({
    baseURL: 'http://localhost:9000/api/zboot',
    timeout: 5000
})

https.interceptors.request.use(
    config => {
        if (sessionStorage.token) {
            // 将token设置成请求头
            config.headers.token = sessionStorage.token
        }
        return config
    },
    err => {
        console.log(err)
        return Promise.reject(err)
    }
)

https.interceptors.response.use(function(response) {
    if (response.data.code === 401) {
        Message.error(response.data.msg)
        router.replace({
            path: '/login'
        })
    } else if (response.data.code !== 200 && response.data.code !== 401) {
        Message.error(response.data.msg)
    } else if (response.data.code === 200 && (response.config.method !== 'get')) {
        Message.success('操作成功')
    }
    return response
}, function(error) {
    console.log(error)
    return Promise.reject(error)
})

export default https