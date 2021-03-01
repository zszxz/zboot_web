<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card  style="margin: 10px 0px">
            <el-row :gutter="20" >
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入名称" v-model="queryInfo.roleName" clearable></el-input> 
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                    v-model="queryInfo.createTime"
                    type="datetimerange"
                    align="right"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="small"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    prefix-icon="el-input__icon el-icon-date"
                    :default-time="['00:00:00', '00:00:00']">
                    >
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-search"  size="mini"  @click="getRoleList" >搜索</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="mini"  v-permission="['role:add']"   @click="showaddDialog" >+添加角色</el-button>
                </el-col>
            </el-row> 
            <el-table size="mini" :data="roleList" border style="margin-top: 10px">
                <!-- 添加展开列 -->
                <!-- <el-table-column type="expand"></el-table-column> -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="description"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope"> 
                        <el-button size="mini" type="primary"  v-permission="['role:edit']" icon="el-icon-edit"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger"  v-permission="['role:delete']" icon="el-icon-delete"  @click="removeRole(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning"  v-permission="['role:menu']" icon="el-icon-setting" @click="showSetMenu(scope.row)" >分配权限</el-button>
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
         <!-- 添加角色的对话框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="dialogClosed">
            <el-form
                :model="roleForm"
                ref="formRef"
                size="mini"
                label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                <el-input v-model="roleForm.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
           <!-- 分配权限 -->
            <el-dialog
            title="分配权限"
            :visible.sync="setMenuDialogVisible"
            width="50%"
            @close="setMenuDialogClosed">
            <el-tree
                :data="menuList"
                :props="defaultProps"
                ref="treeRef"
                show-checkbox
                node-key="id"
                default-expand-all
                check-strictly
                :default-checked-keys="checkKeyList">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setMenuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            queryInfo: {
                pageNum: 1,
                pageSize: 10
            },
            total: 0,
            roleList:[],
            dialogVisible: false, // 添加菜单对话框
            roleForm: {},
            setMenuDialogVisible: false, // 分配权限对话框
            menuList: [],   // 菜单列表
            defaultProps: { // 树节点
                children: 'children',
                label: 'title'
            },
            checkKeyList:[], // 默认选中的节点
            roleId: 0
        }
    },created(){
        this.getRoleList();
    },methods:{
        // 显示树形菜单
        async showSetMenu(role){
            // 获取菜单树列表
            const {data: res} = await this.$api.role.getMenuTree()
            this.menuList = res.data
            // 获取角色的菜单列表
            const {data: resRoleMenu} = await this.$api.role.getRoleMenu(role.id)
            this.getRoleMenusId(resRoleMenu.data,this.checkKeyList)
            // 数据变化后执行
            this.$nextTick(() => {
                this.$refs.treeRef.setCheckedKeys(this.checkKeyList);
            });
            this.roleId = role.id
            this.setMenuDialogVisible = true
            

        },
        // 菜单对话框关闭事件
        setMenuDialogClosed(){
            this.menuList = []
            this.checkKeyList = []
        },
        // 递归节点
        getRoleMenusId(data, checkKeyList) {
            data.forEach(element => {
                checkKeyList.push(element.id)
                this.getRoleMenusId(element.children,checkKeyList)
               
            });
        },
        // 分配角色菜单
        async saveRoleMenu(){
            // 获得当前选中和半选中的Id
            const selectKeys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const menuIds = selectKeys.join(',')
            let params = new URLSearchParams();
            params.append('menuIds', menuIds);
            const {data: res} = await this.$api.role.setRoleMenu(this.roleId,params)
            this.setMenuDialogVisible = false
            this.getRoleList()
        },
        // 角色列表
        async getRoleList(){
             let query = {}
            if(this.queryInfo.createTime){
                query.beginCreateTime =  this.queryInfo.createTime[0]
                query.endCreateTime =  this.queryInfo.createTime[1]
            }
            query.pageNum = this.queryInfo.pageNum
            query.pageSize = this.queryInfo.pageSize
            query.roleName = this.queryInfo.roleName
            query.orderBy = this.queryInfo.orderBy
            const {data: res} = await this.$api.role.getRoleList(query)
            this.roleList = res.data.records
            this.total = res.data.total
        },
              // 分页
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getRoleList();  
        },
        handleCurrentChange( current ) {
            this.queryInfo.pageNum = current
            this.getRoleList()
        },
        async submit(){
            if(this.roleForm.id){
                const { data: res } = await this.$api.role.editRole( this.roleForm.id, this.roleForm)
            }else{
                 const {data: res} = await this.$api.role.addRole(this.roleForm)
            }
            this.dialogVisible = false
            this.getRoleList()
        },
        dialogClosed(){
        //对话框关闭之后，重置表单
        //this.$refs.formRef.resetFields();
        this.roleForm = {}
        },
        // 显示编辑角色信息
        showaddDialog (id) {
            this.title = '添加角色'
            this.dialogVisible = true
        },
        // 显示编辑角色信息
        async showEditDialog (id) {
            const { data: res } = await this.$api.role.getRoleById(id)
            this.roleForm = res.data
            this.title = '修改角色'
            this.dialogVisible = true
        },
        // 删除角色
        async removeRole(id){
            const result = await this.$confirm(
                '是否删除该角色?',
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
            const { data: res } = await this.$api.role.deleteRole(id)
            this.getRoleList()
        }
    }
}
</script>