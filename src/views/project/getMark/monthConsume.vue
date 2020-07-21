<template>
  <div>
    <avue-crud
      ref="recordTable"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="consumeDetailOption"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    >
      <template slot="userGrade" slot-scope="scope">{{ userRank(scope.row.userGrade) }}</template>
    </avue-crud>
  </div>
</template>
    
<script>
import { consumeDetailOption } from '@/const/crud/admin/packageReport'
import * as packageReportApi from '@/api/admin/packageReport'

export default {
  props: {
    id: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      consumeDetailOption: {
        ...consumeDetailOption
      }
    }
  },

  computed: {
    userRank: function() {
      return function(value) {
        // return '贷评级'
        console.log(value)
        switch (value) {
          case 0:
            return '待评级'

          case 1:
            return '十元户'

          case 2:
            return '百元户'

          case 3:
            return '千元户'

          case 4:
            return '万元户'
        }
      }
    }
  },
  watch: {
    id: {
      handler(val) {
        this.handleList()
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    // this.handleList()
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
    handleList(searchPayload) {
      this.tableLoading = true

      packageReportApi
        .getMonthlyConsumeInfo({
          gid: this.id.id,
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          this.tableData = data.data.records
          this.tableLoading = false
          this.page.total = data.data.total
        })
    }
  }
}
</script>
    
    <style>
</style>
