<template>
  <div>
    <basic-container
    >
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @row-update="onEditRow"
        @size-change="onSizeChange"
        @row-save="onAddRow"
        @row-del="onDeleteRow"
        @current-change="currentChange"
      >
        <template slot="code" slot-scope="scope">{{ scope.row.code.toString() }}</template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import * as industryApi from '@/api/project/industry-sign'
import { tableOption } from '@/const/crud/admin/industry'

export default {
  name: 'AdminIndustry',

  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },

  created() {
    this.handleList()
  },

  methods: {
    handleList() {
      this.tableLoading = true
      industryApi
        .getIndustryList({
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          console.log(data)
          const payload = data.data
          this.tableData = payload.records
          this.page.total = payload.total
          this.tableLoading = false
        })
    },

    onEditRow(row, index, done, loading) {
      loading()
      industryApi
        .editIndustry({
          code: row.code,
          name: row.name,
          id: row.id
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.handleList()
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
          done()
        })
        .catch(() => {
          done()
        })
    },
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    onDeleteRow(row, index) {
      this.$confirm('确认删除吗?只允许删除当日及行业下签名记录的行业', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          industryApi
            .deleteIndustry({
              id: row.id
            })
            .then(({ data }) => {
              if (data.code === 0) {
                this.handleList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    onAddRow(row, done, loading) {
      industryApi
        .addIndustry({
          code: row.code,
          name: row.name
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.handleList()
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            done()
          }
        })
        .catch(() => {
          loading()
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.el-scrollbar__bar.is-vertical{
    display: none
  }
</style>
