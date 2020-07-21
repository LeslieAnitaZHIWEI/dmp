<template>
  <div>
    <avue-crud
      ref="recordTable"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableDetailOption"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    >
      <template slot-scope="scope" slot="totalConsumeAmount">
        <el-button
          type="text"
          @click="watchConsume(scope.row.gid)"
        >{{ scope.row.totalConsumeAmount }}</el-button>
      </template>

      <template slot="userGrade" slot-scope="scope">{{ userRank(scope.row.userGrade) }}</template>
    </avue-crud>
    <el-dialog :visible.sync="consumeVisible" title="月消费明细" center append-to-body width="850px">
      <monthConsume :id="gid"></monthConsume>
      <template slot="footer">
        <div>
          <el-button @click="consumeVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
    
<script>
import { tableDetailOption } from '@/const/crud/admin/packageReport'
import * as packageReportApi from '@/api/admin/packageReport'
import monthConsume from './monthConsume'

export default {
  components: {
    monthConsume
  },
  props: {
    id: {
      type: Object,
      default: () => ''
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
      tableDetailOption: {
        ...tableDetailOption
      },
      consumeVisible: false,
      gid: ''
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
    handleList() {
      this.tableLoading = true

      packageReportApi
        .getAudiencePackageDataInfo({
          audienceId: this.id.id,
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          this.tableData = data.data.records
          this.tableLoading = false
          this.page.total = data.data.total
        })
    },
    watchConsume(id) {
      var count = 0
      count++
      this.gid = {
        id: id,
        count: count
      }
      this.consumeVisible = true
    }
  }
}
</script>
    
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-weight: 700;
}
/deep/.avue-crud__menu {
  display: none;
}
</style>
