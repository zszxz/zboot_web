<template>
    <div class="login_container">
        <!-- 登录盒子  -->
        <div class="login_box">
            <span class="title">Z-Boot后台权限管理系统</span>
            <!-- 登录表单 -->
            <el-form :model="loginForm" ref="LoginFormRef"  class="login_form">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user" ></el-input>
                </el-form-item> 
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item> 
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item> 
            </el-form>
        </div>
    </div>
</template>
<script>
export default {

      data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            }
        }
      },
      methods: {
          // 重置
          resetLoginForm() {
            this.$refs.LoginFormRef.resetFields()
          },
          // 登陆
         async login(){
            const {data: res} = await this.$api.login.login(this.loginForm)
            window.sessionStorage.setItem('token', res.data.token)
            window.sessionStorage.setItem('name', res.data.name)
            this.$store.dispatch('addPermission')
            this.$router.push('/index')
        }
      }   
  
}
</script>

<style scoped>
.title {
  display: block;
  height: 140px;
  font-family:"Times New Roman";
  text-align: center;
  line-height: 160px;
  font-size:30px;
}
.login_container {
  /* background-color: #0D559D; */
  height: 100%;
  background-image: url('../../assets/background.jpg');
  background-position:center;
  background-size: cover;
  background-repeat:no-repeat;
}
.login_box {
  width: 450px;
  height:400px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}

</style>