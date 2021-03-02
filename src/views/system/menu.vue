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
                    <el-button type="primary" size="mini"  v-permission="['menu:add']"  @click="showAddDialog()" >+添加菜单</el-button>
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
                        <el-button size="mini" type="primary" icon="el-icon-edit"  v-permission="['menu:edit']"  @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete"  v-permission="['menu:delete']"  @click="removeMenu(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
         <!-- 添加菜单的对话框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" @close="dialogClosed">
            <el-form
                :model="menuForm"
                ref="addFormRef"
                label-width="80px"
                size="mini"
                >
                <el-form-item label="菜单名称" prop="name">
                    <el-input  v-model="menuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path">
                    <el-input v-model="menuForm.path"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="permission">
                    <el-input v-model="menuForm.permission"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="iconCls">
                    <el-input v-model="menuForm.iconCls"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="menuForm.title"></el-input>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                    <el-input v-model="menuForm.component"></el-input>
                </el-form-item>
                 <el-form-item label="排序" prop="sort" >
                    <el-input v-model="menuForm.sort"></el-input>
                </el-form-item>
                 <el-form-item label="菜单类型" prop="type" style="width: 500px">
                    <el-select   @change="change()" style="width: 500px"  v-model="menuForm.type" placeholder="输入菜单类型">
                        <el-option style="width: 500px" label="目录" value="1"></el-option>
                        <el-option style="width: 500px" label="菜单" value="2"></el-option>
                        <el-option style="width: 500px" label="按钮" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父节点" prop="parentId">
                    <tree childrenName="children" parentId="parentId" nodeId="id" nodeName="title" :treeData="menuTree" :fromData="menuForm" ></tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import tree from '@/components/tree'
export default {
    data(){
        return {
            MenuList:[],
            dialogVisible: false,
            menuForm: {},
            title:'',
            menuTree:[],

        }
    },
    components:{
        tree
    },
    created(){
        this.getMenuList();
    },methods:{
        // 菜单树列表
        async getMenuList(){
            const {data: res} = await this.$api.menu.getMenuTree()
            this.MenuList = res.data
            let arr = [{"id":-1, "title":"顶级类目", "children":this.MenuList}]
            this.menuTree = arr
        },
        change(){
            // 重新render
            this.$forceUpdate()
        },
        async submit(){
            if(this.menuForm.id){
                 const { data: res } = await this.$api.menu.editMenu(this.menuForm.id, this.menuForm)
            }else{
                const {data: res} = await this.$api.menu.addMenu(this.menuForm)
            }
            this.dialogVisible = false
            this.getMenuList()
        },
        dialogClosed(){
            this.menuForm = {}  
        },
        showAddDialog(){
            this.title = '添加菜单'
            this.dialogVisible = true
        },
        // 显示编辑信息
        async showEditDialog (data) {
            this.menuForm = data
            // 将父节点转为对应的中文
            this.getParentTitle(this.menuTree,this.menuForm.parentId)
            this.title = '修改菜单'
            this.dialogVisible = true
        },
        // 递归节点
        getParentTitle(data, parentId) {
            data.forEach(element => {
                if(element.id == parentId){
                    this.menuForm.parentName = element.title
                }else {
                    this.getParentTitle(element.children,parentId)
                }
            });
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
    }
}
</script>