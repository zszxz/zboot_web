<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card style="margin: 10px 0px" >
        <!-- 搜索与添加区域 -->
        <el-row :gutter="24">
            <el-col :span="4">
                <el-input size="small" placeholder="请输入名称" v-model="queryInfo.name" clearable></el-input> 
            </el-col>
            <el-col :span="6">
                <el-date-picker
                  v-model="queryInfo.createTime"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  unlink-panels
                  value-format="yyyy-MM-dd HH:mm:ss"
                  prefix-icon="el-input__icon el-icon-date"
                  :default-time="['00:00:00', '00:00:00']">
                  >
                </el-date-picker>
            </el-col>
            <el-col :span="3">
                <el-select v-model="queryInfo.enable" clearable placeholder="请选择用户状态" size="small">
                  <el-option key="1" label="激活" value="true"></el-option>
                  <el-option key="2" label="冻结" value="false"></el-option>
                </el-select>
            </el-col> 
            <el-col :span="2">
                <el-button type="primary"  icon="el-icon-search" size="small"  @click="getUserList" >搜索</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="primary"  size="small" v-permission="['user:add']"  @click="showAddDialog()" >+添加用户</el-button>
            </el-col>
        </el-row> 
        <!-- 用户列表(表格)区域 -->
        <el-table size="mini" style="margin-top: 10px" :data="userList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="telephone"></el-table-column>
            <el-table-column label="创建日期" prop="createTime"></el-table-column>
            <el-table-column label="用户状态" prop="enable">
                <template slot-scope="scope">
                    <el-switch v-permission="['user:edit']" 
                    inactive-color="#ff4949" 
                    active-color="#13ce66" 
                    active-text="激活"
                    inactive-text="冻结"
                    v-model="scope.row.enable" 
                    @change="editUserStatus(scope.row)" >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button type="primary" icon="el-icon-edit" v-permission="['user:edit']" size='mini' @click="showEditDialog(scope.row)">编辑</el-button>
                    <!-- 删除 -->
                    <el-button type="danger" icon="el-icon-delete" v-permission="['user:delete']" size='mini'  @click="removeUser(scope.row.id)">删除</el-button>
                    <!-- 分配角色 -->
                    <el-tooltip class="item" effect="dark"  v-permission="['user:role']" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size='mini'  @click="showSetRole(scope.row)" >分配角色</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
    </el-card>

    <!-- 添加修改用户的对话框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="dialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="userForm"
        ref="formRef"
        size="small"
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!userForm.id" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="telephone">
          <el-input v-model="userForm.telephone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
       <span style="margin:10px"> 当前用户:</span>
      <el-input placeholder="用户名" v-model="userInfo.name" :disabled="true" style="margin:10px"></el-input>
       <!-- 标签用于显示用户 -->
      <span style="margin:10px"> 当前角色:</span>
      <el-tag
        v-for="role in userRoleList"
        :key="role.id"
        type="success"
        style="margin:10px">{{role.description}}
        </el-tag>
        <div style="margin:10px">
        <!-- 下拉框 -->
        <el-select  v-model="roleIds" multiple clearable placeholder="重新分配角色">
            <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.description"
            :value="item.id"
            clearable>
            </el-option>
        </el-select>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole()">确 定</el-button>
      </span>
    </el-dialog>

</div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        beginCreateTime:'',
        endCreateTime:'',
        name:'',
        enable:'',
        orderBy:'createTime*desc'
      },
      userList:[],
      total:0,
      title:'',
      dialogVisible: false,
      userForm:{},
      userInfo: {},
      setRoleDialogVisible: false,
      userRoleList: [],
      roleList: [],
      roleIds: []
    }
  },
  created() {
    this.getUserList(),
    this.getRoles()
  },
  methods: {
      // 用户列表
    async getUserList() {
      let query = Object.assign({}, this.queryInfo);
      if(query.createTime){
        query.beginCreateTime =  query.createTime[0]
        query.endCreateTime =  query.createTime[1]
        query.createTime = []
      }
      if(query.name){
        query.name = `*${this.queryInfo.name}*`
      }
      const { data: res } = await this.$api.user.getUserList(query)
      this.userList = res.data.records
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(newSize) {
    this.queryInfo.pageSize = newSize;
    this.getUserList();  
    },
    handleCurrentChange( current ) {
    this.queryInfo.pageNum = current
    this.getUserList()
    },
    dialogClosed(){
      //对话框关闭之后，重置表单
      // this.$refs.formRef.resetFields();
      this.userForm = {}
  },
  showAddDialog(){
    this.title = '添加用户信息'
    this.dialogVisible = true
  },
  // 显示编辑用户信息
    async showEditDialog (data) {
      this.userForm = data
      this.title = '修改用户信息'
      this.dialogVisible = true
    },
    // 修改或者添加用户信息
    async submit(){
      if(this.userForm.id!==undefined){
        // 修改用户信息
        const { data: res } = await this.$api.user.editUser(this.userForm.id, this.userForm)
      }else{
        const { data: res } = await this.$api.user.addrUser(this.userForm)
      }
      this.dialogVisible = false
      this.getUserList()
    },
  async editUserStatus(user){
    let newUser = {enable:user.enable}
    const { data: res } = await this.$api.user.editUser(user.id, newUser)
  },
  // 删除用户
  async removeUser(id){
      const result = await this.$confirm(
        '是否删除该用户?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.user.deleteUser(id)
      this.getUserList()
  },
  // 显示分配角色对话框
    async showSetRole (user) {
      this.userInfo = user
      const { data: res } = await this.$api.user.getUserRole(user.id)
      this.userRoleList = res.data
      this.setRoleDialogVisible = true
    },
    async getRoles(){
      const { data: res } = await this.$api.user.getRoles()
      this.roleList = res.data
    },
    async saveUserRole(){
        var params = new URLSearchParams();
        params.append('roleIds', this.roleIds.join(','));
        const {data: resp} = await this.$api.user.setUserRoles(this.userInfo.id,params)
        this.setRoleDialogVisible = false
    },
    setRoleDialogClosed(){
      this.roleIds = []
      this.userInfo = {}
    }
  }
}
</script>