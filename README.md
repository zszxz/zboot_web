![](https://img.shields.io/badge/zszxz-springboot-orange)![](https://img.shields.io/badge/-mybatisPlus-blue)![](https://img.shields.io/badge/-minio-yellowgreen)![](https://img.shields.io/badge/-shiro-lightgrey)![](https://img.shields.io/badge/-vue-green)![](https://img.shields.io/badge/-elementUI-red)![](https://img.shields.io/badge/-echarts-brightgreen)

# zboot_web

zboot 是一款基于 springboot2.1.1，shiro+jwt, elementUI,Vue 架构的轻量级权限后台管理系统；

**账号密码**： `admin/123456`

**接口文档，SQL监控默认账号密码**：zboot/zboot

**后端源码地址**：https://github.com/zszxz/zboot

**前端源码地址**：https://github.com/zszxz/zboot_web

# 构建步骤

``` bash
# 安装依赖
npm install

# 运行项目
npm run serve

# 项目打包
npm run build
```

运行项目后地址：http://localhost:18080/#/login

默认登陆页面

![](https://gitee.com/lsc180/images/raw/master/img/20201125093312.png)



# Nginx部署示例



```
server {
        listen       12000;
        server_name  localhost;
    
        location / {
            root   C:\mydata\generator\web\dist;
            index  index.html index.htm;
        }
    }
```

