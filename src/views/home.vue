<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <el-button style="float:right;margin: 10px" size="mini" type="info" @click="logout">退出</el-button>
      <el-button
        style="float:right;margin: 10px"
        size="mini"
        type="primary"
        @click="editPassword"
      >修改密码</el-button>
      <p style="float:right;margin: 10px;font-family:微软雅黑; font-size:12px;">
        <i class="el-icon-user"></i>
        欢迎您：{{name}}
      </p>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu default-active="/index" class="el-menu-vertical-demo" unique-opened>
          <el-menu-item @click="toPage({title:'首页',path:'/index'})" index="/index">
            <i class="el-icon-house"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu
            :index="menu.path==null?menu.id.toString():menu.path"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="menu.iconCls"></i>
              <span>{{menu.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="item.path"
              v-for="item in menu.children"
              @click="toPage(item)"
              :key="item.id"
            >
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span>{{item.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- 主体结构 -->
        <div class="panel">
          <el-tag
            v-for="tag in tags"
            effect="plain"
            :key="tag.name"
            closable
            :type="tag.type"
            @close="handleClose(tag)"
            :class="[tag.path==path?'active':'']"
          >
            <router-link style="text-decoration:none" :to="{path:tag.path}">{{tag.name}}</router-link>
          </el-tag>
        </div>
        <div>
          <!-- 修改密码的对话框 -->
          <el-dialog
            title="修改密码"
            :visible.sync="editDialogVisible"
            width="30%"
            @close="editDialogClosed"
          >
            <!-- 内容主体 -->
            <el-form
              :model="editPasswordForm"
              ref="editPasswordFormRef"
              label-width="120px"
              :rules="passwordFormRule"
              size="mini"
            >
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="editPasswordForm.oldPassword"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="editPasswordForm.newPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="重新输入密码" prop="reNewPassword">
                <el-input v-model="editPasswordForm.reNewPassword" type="password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitEditPassword">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      name: sessionStorage.getItem("name"),
      menuList: {},
      editDialogVisible: false,
      editPasswordForm: {},
      // 表单校验
      passwordFormRule: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ],
        reNewPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ]
      },
      tags: [
        { name: "首页", type: "", path: "/index" },
        { name: "部门", type: "", path: "/system/dep" }
      ],
    };
  },
  mounted() {
    this.getMenus();
  },
  computed:{
    path(){
      return this.$route.path
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    editPassword() {
      this.editDialogVisible = true;
    },
    handleClose(tag) {
      let lastTag = this.tags[this.tags.indexOf(tag) - 1];
      this.tags.splice(this.tags.indexOf(tag), 1);
      if (lastTag) {
        this.$router.push({ path: lastTag.path });
      }
    },
    toPage(data) {
      let tag = { name: data.title, type: "", path: data.path };
      let contain = this.tags.some(t => {
        return t.path == data.path ? true : false;
      });
      if (!contain) {
        this.tags.push(tag);
      }
      this.$router.push({ path: data.path });
    },
    commitEditPassword() {
      this.$refs["editPasswordFormRef"].validate(async valid => {
        if (valid) {
          if (
            this.editPasswordForm.newPassword !=
            this.editPasswordForm.reNewPassword
          ) {
            this.$message.error("两次输入的密码不一致，请重新输入");
            return false;
          }
          const { data: res } = await this.$api.home.editPassword(
            this.editPasswordForm
          );
          window.sessionStorage.clear();
          this.$router.push("/login");
        } else {
          //this.$message.error("输入的密码不符合规则")
          return false;
        }
      });
    },
    editDialogClosed() {
      this.editPasswordForm = {};
    },
    async getMenus() {
      // 菜单
      const { data: menu } = await this.$api.home.getMenuUser({
        typeList: "1,2",
        buildTree: true
      });
      this.menuList = menu.data;
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
}
.el-aside {
  background-color: #ffffff;
}
.el-main {
  background-color: #eaedf1;
}
.panel {
  margin-bottom: 5px;
  width: 100%;
  overflow-x: auto;
  background-color: #fff;
}
.active{
  /* color: #409eff!important; */
  background-color:#409eff !important;
}
</style>