<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card  style="margin: 10px 0px">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="primary" size="mini"  v-permission="['menu:add']"  @click="addDialogVisible = true" >+添加菜单</el-button>
                </el-col>
            </el-row> 
            <el-table size="mini" style="margin-top: 10px" :data="MenuList" border row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="菜单名称" prop="name"></el-table-column>
                <el-table-column label="菜单路径" prop="path"></el-table-column>
                <el-table-column label="权限" prop="permission"></el-table-column>
                <el-table-column label="图标" prop="iconCls"></el-table-column>
                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column label="组件" prop="component" width="180px"></el-table-column>
                <el-table-column label="排序" prop="sort"></el-table-column>
                <el-table-column label="菜单类型" prop="type" width="100px">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag type="success" size="medium" v-show="scope.row.type==='1'">目录</el-tag>
                            <el-tag type="primary" size="medium" v-show="scope.row.type==='2'">菜单</el-tag>
                            <el-tag type="warning" size="medium" v-show="scope.row.type==='3'">按钮</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" width="180px"></el-table-column>
                <el-table-column label="操作" width="250px">
                    <template slot-scope="scope"> 
                        <el-button size="mini" type="primary" icon="el-icon-edit"  v-permission="['menu:edit']"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"  v-permission="['menu:delete']"  @click="removeMenu(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
         <!-- 添加菜单的对话框 -->
        <el-dialog title="添加菜单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form
                :model="addMenuForm"
                ref="addFormRef"
                label-width="80px"
                size="mini"
                >
                <el-form-item label="菜单名称" prop="name">
                    <el-input  v-model="addMenuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path">
                    <el-input v-model="addMenuForm.path"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-input v-model="addMenuForm.permission"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconCls">
                    <el-input v-model="addMenuForm.iconCls"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="addMenuForm.title"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="addMenuForm.component"></el-input>
                </el-form-item>
                 <el-form-item label="排序" prop="sort" >
                    <el-input v-model="addMenuForm.sort"></el-input>
                </el-form-item>
                 <el-form-item label="菜单类型" prop="type" style="width: 500px">
                    <el-select   @change="change()" style="width: 500px"  v-model="addMenuForm.type" placeholder="输入菜单类型">
                        <el-option style="width: 500px" label="目录" value="1"></el-option>
                        <el-option style="width: 500px" label="菜单" value="2"></el-option>
                        <el-option style="width: 500px" label="按钮" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父节点" prop="parentId">
                    <el-select  v-model="addMenuForm.parentId" placeholder="请选择父节点"  style="width: 500px" ref="selectParent">
                        <el-option :value="addMenuForm.parentId" :label="addMenuForm.parentTitle" style="width: 500px;height:200px;overflow: auto;background-color:#fff">
                            <el-tree
                                :data="editAddMenuTree"
                                :props="defaultProps"
                                @node-click="handleAddNodeClick">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMenu">确 定</el-button>
            </span>
        </el-dialog>
         <!-- 修改的对话框 -->
        <el-dialog
        title="修改菜单信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <!-- 内容主体 -->
            <el-form
                :model="editMenuForm"
                ref="editFormRef"
                label-width="70px"
                size="mini">
               <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editMenuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path">
                    <el-input v-model="editMenuForm.path"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-input v-model="editMenuForm.permission"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconCls">
                    <el-input v-model="editMenuForm.iconCls"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="editMenuForm.title"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="editMenuForm.component"></el-input>
                </el-form-item>
                 <el-form-item label="排序" prop="sort">
                    <el-input v-model="editMenuForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" prop="type">
                    <el-select v-model="editMenuForm.type" placeholder="输入菜单类型">
                        <el-option label="目录" value="1"></el-option>
                        <el-option label="菜单" value="2"></el-option>
                        <el-option label="按钮" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父节点" prop="parentId">
                    <el-select v-model="editMenuForm.parentId" placeholder="请选择父节点"  style="width: 560px" ref="selectEditParent">
                        <el-option :value="editMenuForm.parentId" :label="editMenuForm.parentTitle" style="width: 560px;height:200px;overflow: auto;background-color:#fff">
                            <el-tree
                                :data="editAddMenuTree"
                                :props="defaultProps"
                                @node-click="handleEditNodeClick">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editMenu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            MenuList:[],
            addDialogVisible: false,
            addMenuForm: {
                parentTitle:''
            },
            editDialogVisible: false,
            editMenuForm: {},
            defaultProps: { // 树节点
                children: 'children',
                label: 'title'
            },
            editAddMenuTree:[],

        }
    },created(){
        this.getMenuList();
    },methods:{
        // 菜单树列表
        async getMenuList(){
            const {data: res} = await this.$api.menu.getMenuTree()
            this.MenuList = res.data
            let arr = [{"id":-1, "title":"顶级类目", "children":this.MenuList}]
            this.editAddMenuTree = arr
        },
        // 添加菜单
        async addMenu(){
            this.addMenuForm.parentTitle= null
            const {data: res} = await this.$api.menu.addMenu(this.addMenuForm)
            this.addDialogVisible = false
            this.getMenuList()
        },
        change(){
            // 重新render
            this.$forceUpdate()
        },
        addDialogClosed(){
            //this.$refs.selectParent.resetFields()  
            // this.$refs.addFormRef.resetFields()
            this.addMenuForm = {}  
            this.addParentTitle =''
        },
        // 显示编辑信息
        async showEditDialog (id) {
            const { data: res } = await this.$api.menu.getMenuById(id)
            this.editMenuForm = res.data
            // 将父节点转为对应的中文
            this.getParentTitle(this.editAddMenuTree,this.editMenuForm.parentId)
            this.editDialogVisible = true
        },
        // 递归节点
        getParentTitle(data, parentId) {
            data.forEach(element => {
                if(element.id == parentId){
                    this.editMenuForm.parentTitle = element.title
                }else {
                    this.getParentTitle(element.children,parentId)
                }
            });
        },
        // 编辑菜单
        async editMenu(){
            console.log(this.editMenuForm.id)
            const { data: res } = await this.$api.menu.editMenu(this.editMenuForm.id, this.editMenuForm)
            // 隐藏添加对话框
            this.editDialogVisible = false
            this.getMenuList()
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        // 删除菜单
        async removeMenu(id){
            const result = await this.$confirm(
                '是否删除该菜单?',
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
            const { data: res } = await this.$api.menu.deleteMenu( id)
            this.getMenuList()
        },
        handleAddNodeClick(node){
            this.$set(this.addMenuForm, "parentId", node.id)
            this.$set(this.addMenuForm, "parentTitle", node.title)
            this.$refs.selectParent.blur()
        },
        handleEditNodeClick(node){
            this.$set(this.editMenuForm, "parentId", node.id)
            this.$set(this.editMenuForm, "parentTitle", node.title)
            this.$refs.selectEditParent.blur()
        }

    }
}
</script>