<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>部门管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top: 10px;">
            <el-row>
                <el-col :span="4">
                    <el-button type="primary"  size="mini" v-permission="['dep:add']"  @click="showAddDep" >+添加部门</el-button>
                </el-col>
            </el-row>  
            <div id="box">
                <div id="left-box">
                    <el-tree
                    :data="depList"
                    :props="defaultProps"
                    ref="treeRef"
                    node-key="id"
                    @node-click="handleNodeClick"
                    >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                            <el-button
                                type="text"
                                size="mini"
                                v-permission="['dep:user']"
                                @click="() => showSetUser(data)">
                                分配成员
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                v-permission="['dep:edit']"
                                @click="() => showEditDep(data)">
                                修改部门
                            </el-button>
                            <el-button
                                style="color:red"
                                type="text"
                                size="mini"
                                v-permission="['dep:delete']"
                                @click="() => removeDep(data)">
                                删除部门
                            </el-button>
                        </span>
                    </span>
                    </el-tree>
                </div>
                <div id="right-box">
                    <el-table size="mini" style="margin-top: 10px" :data="userList" border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="用户名" prop="username"></el-table-column>
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="电话" prop="telephone"></el-table-column>
                        <el-table-column label="创建日期" prop="createTime"></el-table-column>
                        <el-table-column label="用户状态" prop="enable">
                            <template slot-scope="scope">
                                <el-tag v-show="scope.row.enable==true" type="success">激活</el-tag>
                                <el-tag v-show="scope.row.enable==false" type="danger">冻结</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-delete" @click="() => removeDepUser(scope.row)"  type="warning">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            </el-card>    
            <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="dialogClosed">
                <!-- 内容主体 -->
                <el-form
                    :model="depForm"
                    ref="editFormRef"
                    size="mini"
                    label-width="100px">
                    <el-form-item label="部门名称" prop="departmentName">
                    <el-input v-model="depForm.departmentName"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="sort">
                    <el-input v-model="depForm.sort"></el-input>
                    </el-form-item>
                     <el-form-item v-if="!depForm.id" label="父节点" prop="parentId">
                        <el-select v-model="depForm.parentId" placeholder="请选择父节点"  style="width: 200px" ref="topTreeRef">
                            <el-option :value="depForm.parentId" :label="depForm.parentName" style="width: 300px;height:200px;overflow: auto;background-color:#fff">
                                <el-tree
                                    :data="depTree"
                                    :props="defaultProps"
                                    @node-click="handleAddNodeClick">
                                </el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>
           
            <el-dialog title="分配用户" :visible.sync="setUserDialogVisible" width="30%" @close="setUserDialogClosed">
                <!-- 内容主体 -->
                <el-form
                    :model="setDepUserForm"
                    ref="setUserFormRef"
                    size="mini"
                    label-width="100px">
                    <el-form-item label="分配用户" prop="name">
                        <el-autocomplete
                        v-model="setDepUserForm.name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="handleSelect"
                        >
                        </el-autocomplete>
                    </el-form-item>
                    
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setUserDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setDepUser">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
export default {

  data() {
    return {
        depList: [],
        defaultProps:{
            children: 'children',
            label: 'departmentName'
        },
        userList:[],
        title:'',
        dialogVisible: false,
        depForm: {},
        depTree: [],
        removeDepId:'',
        setUserDialogVisible: false, // 分配用户
        setDepUserForm: {}

    }
    },
    created() {
        this.getDepTree()
    },
    methods: {
        async getDepTree() {
            const {data: res} = await this.$api.dep.getDepTree()
            this.depList = res.data
            let arr = [{"id":-1, "departmentName":"顶级类目", "children":res.data}]
            this.depTree = arr
        },
        async handleNodeClick(data){
            const {data: res} = await this.$api.dep.getUserByDepId(data.id)
            this.userList = res.data
            this.removeDepId = data.id
        },
        showAddDep(){
            this.title='添加部门'
            this.dialogVisible = true
        },
        // 修改部门
        showEditDep(data){
            this.title='修改部门'
            this.depForm = data
            this.dialogVisible = true
        },
        async submit(){
            if(this.depForm.id){
                 const { data: res } = await this.$api.dep.editDep(this.depForm.id,this.depForm)
            }else{
                 const { data: res } = await this.$api.dep.addDep(this.depForm)
            }
            this.dialogVisible = false
            this.getDepTree()
        },
        // 对话框关闭事件
        dialogClosed(){
            this.depForm = {}
        },
        // 删除部门
        async removeDep(data){
            const result = await this.$confirm(
            `是否删除部门${data.departmentName}?`,
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
            const { data: res } = await this.$api.dep.deleteDep(data.id)
            this.getDepTree()
        },
        handleAddNodeClick(node){
            this.$set(this.depForm, "parentId", node.id)
            this.$set(this.depForm, "parentName", node.departmentName)
            //this.$refs.topTreeRef.blur()
        },
        // 移除部门用户关联
        async removeDepUser(user){
            const result = await this.$confirm(
            `是否从部门中移除用户${user.name}?`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)
            if (result !== 'confirm') {
                return this.$message.info('已取消移除')
            }
            const { data: resDepUser } = await this.$api.dep.deleteDepUser(this.removeDepId,user.id)
            const {data: res} = await this.$api.dep.getUserByDepId(this.removeDepId)
            this.userList = res.data
        },
        // 分配用户
        showSetUser(data){
            this.setDepUserForm.depId = data.id
            this.setUserDialogVisible = true
        },
        async querySearchAsync(queryString, callback){
            let params = {}
            params.enable = true
            if(queryString){
                params.name = `*${queryString}*`
            }
            const {data: res} = await this.$api.dep.getUserList(params)
            let data = res.data.records
            // value 选项显示
            let result = data.map(arr => {
                arr.value = arr.name
                return arr
            })
            callback(result)
        },
        setUserDialogClosed(){
            this.setDepUserForm = {}
        },
        handleSelect(item){
            this.setDepUserForm.userId = item.id
        },
        async setDepUser(){
             const {data: res} = await this.$api.dep.addDepUser(this.setDepUserForm)
             this.setUserDialogVisible = false
        }

    }
}   
</script>

<style scoped>
    #box{
        margin-top: 10px;
        height:100%;
        zoom:1;
    }
    #box:after {
        content: '';
        display: block;
        clear: both;
        height: 0;
    }
    #left-box {
        float: left;
        width: 35%;
        height: 100%;
    }
    #right-box {
        float: left;
        width: 65%;
    }
     .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>