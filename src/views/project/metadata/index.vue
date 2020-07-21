<template>
  <div class="project">
    <basic-container>
      <el-row>
        <el-col :span="8" style="margin-top:15px;">树</el-col>
        <el-col :span="16" style="margin-top:15px;">表格</el-col>
      </el-row>
    </basic-container>
  </div>
</template>


<script>
import { fetchList } from '@/api/project/metadata'
import { tableOption } from '@/const/project/metadata'
import { mapGetters } from 'vuex'

export default {
  name: 'metadataManage',
  data() {
    return {
      tableData: [
        {
          name: '元数据管理',
          no: 'exact_model',
          type: 'ETL',
          date: '2019/05/12 20:12:11',
          version: '1.0'
        }
      ],
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {},
  created() {},

  mounted() {},

  methods: {
    getList() {
      this.tableLoading = false
    },

    searchChange() {},

    refreshChange() {},

    handleDel() {}
  }
}
</script>
