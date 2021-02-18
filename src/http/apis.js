// 系统管理接口模块
import login from './system/login'
import home from './system/home'
import menu from './system/menu'
import role from './system/role'
import user from './system/user'
import dep from './system/dep'
import dataDict from './system/dataDict'

// 系统监控接口模块
import log from './monitor/log'
import sysview from './monitor/sysview'

export default {
  login,
  home,
  menu,
  role,
  user,
  dep,
  dataDict,
  log,
  sysview
}
