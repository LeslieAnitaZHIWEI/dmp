<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    >  
      <template slot="search">
        <el-row>
          <el-col :xl="4" :sm="8">
            <el-form :model="form">
              <el-form-item label="用户属性名称">
                <el-input
                  v-model="form.property"
                  clearable
                  placeholder="请输入渠道ID查询"
                  style="float:left"
                ></el-input>
              </el-form-item>
              
            </el-form>
          </el-col>
          <el-col :xl="4" :sm="6">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
          <el-col :xl="12" :sm="5"></el-col>
          <el-col :xl="4" :sm="5" style="textAlign:right"><el-button @click="dialogVisible=true">新增用户属性</el-button></el-col>
        </el-row>
      </template>
      <template slot="searchMenu"></template>
      <template slot="id">
        <el-button type="text" @click="editSign">编辑</el-button>
        <el-button type="text" @click="editSign">删除</el-button>
      </template>

    </avue-crud>
    <avue-drawer title="用户属性" show-close v-model="dialogVisible">
      <el-form :model="propertyForm" label-width="100px">
   <el-form-item label="属性名">
    
  </el-form-item>
  <el-form-item label="属性显示名">
    
  </el-form-item>
  <el-form-item label="数据类型">
    
  </el-form-item>
  <el-form-item label="字典">
    
  </el-form-item>
  </el-form>
  <div style="text-align:center">
    <el-button>保存</el-button>
    <el-button @click="dialogVisible=false">关闭</el-button>
  </div>
</avue-drawer>

  </basic-container>
</template>
<script>
import * as channelApi from '@/api/project/channel'
import { tableOption } from '@/const/crud/admin/userProperty'

export default {
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption,
      form: {
        property: '',
      },
      dialogVisible:false,
      propertyForm:{}
    }
  },
  created() {
    this.handleList()
  },
  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleSearchChange(payload) {
      this.page.currentPage=1
      this.handleList()
    },

    handleList(payload) {
      this.tableLoading = true

      channelApi
        .getChannel({
          ...this.form,
          current: this.page.currentPage,
          limit: this.page.pageSize
        })
        .then(({ data }) => {
          console.log(data)
          this.tableLoading = false
          this.page.total = data.data.totalNumber
          this.tableData = data.data.list
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    editSign(){
      this.dialogVisible=true
    }
    
  }
}
</script>
<style lang="scss" scoped>
// /deep/.el-form-item{
//     display: inline-block
// }
/deep/.avue-crud-search__searchMenu {
  display: none;
}
/deep/.avue-crud__menu {
  display: none;
}
</style>