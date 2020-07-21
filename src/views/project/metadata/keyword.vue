<template>
  <div class="project">
    <basic-container>
      <avue-crud
        ref="crud"
        :page="pageOption"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="onSearch"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { getKeywords } from '@/api/project/keyword'
import { pageOption, tableOption } from '@/const/project/keyword'
import { mapGetters } from 'vuex'

export default {
  name: 'matedataKeyword',
  data() {
    return {
      tableData: [],
      pageOption,
      tableOption,
      tableLoading: false,

      searchKeyWord: '',
      searchWordType: ''
    }
  },

  computed: {
    ...mapGetters(['projectId'])
  },

  methods: {
    onSearch(params = {}) {
      this.tableLoading = true

      this.searchKeyWord = params.keyWord || ''
      this.searchWordType = params.wordType || ''

      getKeywords({
        projectId: this.projectId,
        current: this.pageOption.currentPage,
        size: this.pageOption.size,
        keyWord: this.searchKeyWord,
        wordType: this.searchWordType
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.tableData = data.data.records
            this.pageOption.total = data.data.total
          }

          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
        })
    },

    sizeChange(val) {
      this.pageOption.size = val
      this.pageOption.currentPage = 1
      this.onSearch()
    },

    currentChange(val) {
      this.pageOption.currentPage = val

      this.onSearch()
    }
  }
}
</script>

