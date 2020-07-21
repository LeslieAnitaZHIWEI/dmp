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
    ></avue-crud>
  </div>
</template>
    
<script>
import { tableDetailOption } from '@/const/project/user-analyst'
import { doSample } from '@/api/project/meta-event'
import { mapGetters } from 'vuex'

export default {
  props: {
    date: {
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
      tableDetailOption: {
        ...tableDetailOption
      }
    }
  },

  computed: {
    ...mapGetters(['projectId', 'meteEventTypes', 'projectInfo', 'userInfo'])
  },
  watch: {
    date: {
      handler(val) {
        console.log(val)
        this.page.currentPage = 1
        this.handleList()
      },
      deep: true,
      immediate: true
    }
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
      console.log()

      doSample({
        current: this.page.currentPage,
        eventDate: this.date.date,
        metaEventCode: this.date.metaEventCode,

        projectCode: this.projectInfo.code,
        signName: this.date.signName,
        simpleAnalysis: this.date.simpleAnalysis,
        size: this.page.pageSize,
        userId: this.userInfo.userId
      }).then(({ data }) => {
        this.tableLoading = false
        this.tableData = data.data.records || []
        this.page.total = data.data.total
      })
    }
  }
}
</script>
    
<style lang="scss" scoped>
/deep/.avue-crud__menu {
  display: none;
}
</style>
