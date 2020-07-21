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
          <el-col :xl="6" :sm="14">
            <el-form :model="form">
              <el-form-item label="渠道ID">
                <el-input
                  v-model="form.channelIdWhere"
                  clearable
                  placeholder="请输入渠道ID查询"
                  style="float:left"
                ></el-input>
              </el-form-item>
              <el-form-item label="渠道名称">
                <el-input
                  v-model="form.channelNameWhere"
                  clearable
                  placeholder="请输入渠道名称查询"
                  style="float:left"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :xl="4" :sm="6">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
            <el-button @click="exportChannel">导出</el-button>
          </el-col>
        </el-row>
      </template>
      <template slot="searchMenu"></template>
    </avue-crud>
  </basic-container>
</template>
<script>
import * as channelApi from '@/api/project/channel'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import { tableOption } from '@/const/crud/admin/channel'

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
        channelIdWhere: '',
        channelNameWhere: ''
      }
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
    exportChannel() {
      channelApi
        .exportChannel({
          ...this.form
        })
        .then(res => {
          console.log(res)
          downloadBlob(res.data, getFileInfoFromHeader(res.headers))
        })
        .catch(() => {})
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