<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card  style="margin: 10px 0px">
            <el-row :gutter="20" >
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入字典描述" v-model="queryInfo.description" clearable></el-input> 
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
                    <el-button type="primary" icon="el-icon-search"  size="mini"  @click="getDataDictList" >搜索</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" size="mini"  v-permission="['dict:add']"   @click="showAddDialog" >+添加数据字典</el-button>
                </el-col>
            </el-row> 
            <el-table size="mini" :data="roleList" border style="margin-top: 10px">
                <!-- 添加展开列 -->
                <!-- <el-table-column type="expand"></el-table-column> -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="字典名称" prop="dictName"></el-table-column>
                <el-table-column label="字典描述" prop="description"></el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope"> 
                        <el-button size="mini" type="primary"  v-permission="['dict:edit']" icon="el-icon-edit"  @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button size="mini" type="danger"  v-permission="['dict:delete']" icon="el-icon-delete"  @click="removeDataDict(scope.row.id)">删除</el-button>
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
         <!-- 添加数据字典的对话框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" @close="dialogClosed">
            <el-form
                :model="dictForm"
                ref="formRef"
                size="mini"
                label-width="100px">
                <el-form-item label="字典名称" prop="dictName">
                <el-input v-model="dictForm.dictName"></el-input>
                </el-form-item>
                <el-form-item label="字典描述" prop="description">
                <el-input v-model="dictForm.description"></el-input>
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
export default {
    data(){
        return {
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                description: '',
                orderBy:'createTime*desc'
            },
            total: 0,
            roleList:[],
            title:'',
            dialogVisible: false, // 添加对话框
            dictForm: {},
        }
    },created(){
        this.getDataDictList();
    },methods:{
        // 数据字典列表
        async getDataDictList(){
             let query = {}
            if(this.queryInfo.createTime){
                query.beginCreateTime =  this.queryInfo.createTime[0]
                query.endCreateTime =  this.queryInfo.createTime[1]
            }
            query.pageNum = this.queryInfo.pageNum
            query.pageSize = this.queryInfo.pageSize
            if(this.queryInfo.description){
                query.description = `*${this.queryInfo.description}*`
            }
            query.orderBy = this.queryInfo.orderBy
            const {data: res} = await this.$api.dataDict.getDataDict(query)
            this.roleList = res.data.records
            this.total = res.data.total
        },
            // 分页
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getDataDictList();  
        },
        handleCurrentChange( current ) {
            this.queryInfo.pageNum = current
            this.getDataDictList()
        },
        // 显示编辑角色信息
        showAddDialog (id) {
            this.title = '添加数据字典'
            this.dialogVisible = true
        },
        // 显示编辑角色信息
        async showEditDialog (id) {
            const { data: res } = await this.$api.dataDict.getDataDictById(id)
            this.dictForm = res.data
             this.title = '修改数据字典'
            this.dialogVisible = true
        },
        async submit(){
            if(this.dictForm.id){
                 const { data: res } = await this.$api.dataDict.editDataDict( this.dictForm.id, this.dictForm)
            }else{
                const {data: res} = await this.$api.dataDict.addDataDict(this.dictForm)
            }
             // 隐藏添加对话框
            this.dialogVisible = false
            this.getDataDictList()
        },
        dialogClosed(){
            //this.$refs.editFormRef.resetFields()
            this.dictForm = {}
        },
        // 删除数据字典
        async removeDataDict(id){
            const result = await this.$confirm(
                '是否删除该字典?',
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
            const { data: res } = await this.$api.dataDict.deleteDataDict(id)
            this.getDataDictList()
        }
    }
}
</script>