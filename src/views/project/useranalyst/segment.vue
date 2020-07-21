<template>
  <div class="project">
    <basic-container>
      <avue-crud
        class="segment-table"
        :data="tableData"
        :page="page"
        :option="tableOption"
        :table-loading="isLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @search-change="onSearch"
      >
        <template slot="menuLeft">
          <el-button type="primary" size="small" @click="onClickAdd">
            <i class="el-icon-plus" /> 新建分群
          </el-button>
        </template>

        <template slot="tagList" slot-scope="scope">
          <div class="segment-tag-list">
            <el-tag v-for="item in scope.row.tagList" :key="item.id">{{item.name}}</el-tag>
          </div>
        </template>

        <template slot="version" slot-scope="scope">V {{scope.row.version}}</template>

        <template slot="exportBtn" slot-scope="scope">
          <el-button
            size="small"
            round
            @click="exportUserBag(scope.row.$index)"
            :loading="scope.row.isExporting"
          >导出人群包</el-button>
        </template>

        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="small" @click="editRow(scope.row)">
            <i class="el-icon-edit" /> 编辑
          </el-button>
          <el-button type="text" size="small" @click="deleteRow(scope.row)">
            <i class="el-icon-delete" />删除
          </el-button>
        </template>
      </avue-crud>
    </basic-container>

    <avue-drawer title="用户分群" show-close v-model="showEditDrawer" width="1000">
      <div v-loading="isLoadingEdit">
        <segment-edit v-if="editData" v-bind:editData="editData" v-on:close-drawer="closeDrawer"></segment-edit>
      </div>
    </avue-drawer>
  </div>
</template>

<script>
import { pageOptionDefault } from '@/const/website'
import { tableOption } from '@/const/project/user-segment'
import {
  getList,
  exportUserBag,
  getPersonProfile,
  deletePersonProfile
} from '@/api/project/person-profile'
import { getTagLayerName } from '@/api/project/user-tag'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import { mapGetters } from 'vuex'

import SegmentEdit from './segment-edit'

export default {
  name: 'UserAnalystSegment',
  components: {
    'segment-edit': SegmentEdit
  },
  data() {
    return {
      isLoading: false,
      tableData: [],
      page: { ...pageOptionDefault },
      tableOption: tableOption,

      showEditDrawer: false,
      isLoadingEdit: false,
      editData: null
    }
  },

  created() {
    this.getList()

    // /personprofile/page 分页查询

    // /usertaglayer/tagLayerName 通过name查询
  },

  computed: {
    ...mapGetters(['projectId', 'projectInfo'])
  },

  methods: {
    getList(params = { name: '' }) {
      this.isLoading = true
      this.page.total = 0
      this.tableData = []

      getList({
        current: this.page.currentPage,
        size: this.page.pageSize,
        name: params.name,
        projectId: this.projectId
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            const tableData = data.data.map(item => {
              const map = item.tagLayerIdAndTagLayerNameMap
              const list = []

              for (let tag in map) {
                /** 最多显示 3 个 */
                if (list.length >= 3) {
                  list.push({
                    id: tag,
                    name: '...'
                  })

                  break
                }

                list.push({
                  id: tag,
                  name: map[tag]
                })
              }

              item.tagList = list

              return item
            })

            this.page.total = tableData.length
            this.tableData = tableData
          }

          this.isLoading = false
        })
        .catch(e => {
          this.isLoading = false
          this.page.total = 0
        })
    },

    sizeChange(size) {
      this.page.size = size

      this.getList()
    },

    currentChange(page) {
      this.page.pageSize = page

      this.getList()
    },

    onSearch(params) {
      this.page.currentPage = 1

      this.getList(params)
    },

    exportUserBag(index) {
      const data = this.tableData[index]

      this.tableData[index].isExporting = true

      exportUserBag({
        id: data.id,
        code: data.code,
        projectCode: this.projectInfo.code,
        projectId: data.projectId
      })
        .then(res => {
          downloadBlob(res.data, getFileInfoFromHeader(res.headers))

          this.tableData[index].isExporting = false

          index = null
        })
        .catch(e => {
          this.tableData[index].isExporting = false

          index = null
        })
    },

    onClickAdd() {
      this.showEditDrawer = true

      this.editData = {}
    },

    editRow(row) {
      this.showEditDrawer = true
      this.isLoadingEdit = true
      this.editData = null

      this.getPersonProfile({
        id: row.id
      })
    },

    closeDrawer() {
      this.showEditDrawer = false
      this.isLoadingEdit = false
      this.editData = null
    },

    getPersonProfile(params) {
      getPersonProfile(params)
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.editData = data.data
          }

          this.isLoadingEdit = false
        })
        .catch(e => {
          this.isLoadingEdit = false
        })
    },

    deleteRow(row) {
      this.$confirm('您确认删除群名称为' + row.name + '的记录吗？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePersonProfile({
          id: row.id
        }).then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

            const rowId = row.id

            /** 重新请求 */
            this.tableData = this.tableData
              .filter(item => {
                return item.id !== rowId
              })
              .map(item => {
                return {
                  isExporting: false,
                  ...item
                }
              })

            this.page.total = this.page.total - 1
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.segment-tag-list {
  .el-tag {
    margin: 2px 5px 2px 0;
  }
}

.segment-table {
  .el-button.el-link {
    display: inline-block;

    padding: 10px 5px;

    color: #fff;

    font-size: 12px;

    &:hover {
      text-decoration: none;
      color: #fff;
    }
  }
}
</style>

