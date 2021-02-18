<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统监控</el-breadcrumb-item>
        <el-breadcrumb-item>系统日志</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card style="margin: 10px 0px" >
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="4">
                <el-input size="small" placeholder="请输入用户名" v-model="queryInfo.username" clearable></el-input> 
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
                <el-button type="primary" icon="el-icon-search"  size="small"  @click="getLogList" >搜索</el-button>
            </el-col>
        </el-row> 
        <el-table style="margin-top:10px" size="mini" :data="logList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="ip地址" prop="ipaddress"></el-table-column>
            <el-table-column label="操作" prop="oprator"></el-table-column>
            <el-table-column label="耗时(毫秒)" prop="usageTime"></el-table-column>
            <el-table-column label="创建日期" prop="createTime"></el-table-column>
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

</div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        orderBy: 'createTime*desc',
        pageNum: 1,
        pageSize: 10
      },
      logList:[],
      total:0,
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
      // 日志列表
    async getLogList() {
       let query = {}
      if(this.queryInfo.createTime){
        query.beginCreateTime =  this.queryInfo.createTime[0]
        query.endCreateTime =  this.queryInfo.createTime[1]
      }
      query.username = this.queryInfo.username
      query.pageNum = this.queryInfo.pageNum
      query.pageSize = this.queryInfo.pageSize
      query.orderBy = this.queryInfo.orderBy
      const { data: res } = await this.$api.log.getLogList(query)
      this.logList = res.data.records
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(newSize) {
    this.queryInfo.pageSize = newSize;
    this.getLogList();  
    },
    handleCurrentChange( current ) {
    this.queryInfo.pageNum = current
    this.getLogList()
    },
  }
}
</script>