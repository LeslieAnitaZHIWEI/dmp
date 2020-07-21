<template>
  <div class="project" ref="project">
    <basic-container>
      <span class="shadow-line" ref="line"></span>
      <el-row :gutter="20">
        <el-col :xl="3" :md="4" ref="sidemenu" style="overflow:auto">
          <div style="text-align:right">
            <el-dropdown
              split-button
              type="primary"
              size="small"
              @click="onDoTypeMenu('add')"
              @command="onDoTypeMenu"
            >
              增加元事件类型
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="!hasSelectedTypeMenu"
                  icon="el-icon-edit"
                  command="edit"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  :disabled="!hasSelectedTypeMenu"
                  icon="el-icon-delete"
                  command="delete"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <div class="event-type-menu" v-if="meteEventTypes.length">
            <el-menu :default-active="typeMenuIndex" @select="onSelectTypeMenu">
              <el-menu-item
                v-for="(item) in meteEventTypes"
                :index="item.id + ''"
                :key="item.id"
              >{{item.name}}</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :xl="21" :md="20">
          <div>
            <el-form :model="searchForm" label-width="80px">
              <el-form-item label style="text-align:right">
                <el-input
                  v-model="searchForm.codeOrName"
                  placeholder="请输入事件名或显示名模糊搜索"
                  style="width:240px"
                  :disabled="!hasSelectedTypeMenu"
                ></el-input>

                <el-button
                  icon="el-icon-search"
                  size="small"
                  @click.stop="onSearchEvent"
                  style="margin: 0 10px"
                  :disabled="!hasSelectedTypeMenu"
                >搜索</el-button>

                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click.stop="handleAddEvent"
                  :disabled="!hasSelectedTypeMenu"
                >添加事件</el-button>
              </el-form-item>
            </el-form>

            <avue-crud
              ref="crud"
              :data="tableData"
              :table-loading="hasSelectedTypeMenu && tableLoading"
              :page="page"
              @size-change="pageSizeChange"
              @current-change="pageChange"
              :option="tableOption"
            >
              <template slot="version" slot-scope="scope">V {{scope.row.version}}</template>

              <template slot-scope="scope" slot="menu">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  size="small"
                  @click.stop="handleEditRow(scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  size="small"
                  @click.stop="handleDeleteRow(scope.row)"
                >删除</el-button>
              </template>
            </avue-crud>
          </div>
        </el-col>
      </el-row>
    </basic-container>

    <avue-drawer title="编辑元事件" show-close v-model="showEditDrawer" width="840">
      <event-edit
        v-if="editData.metaEvent"
        v-bind="editData"
        @closeDrawer="onCloseDrawer"
        :eventId="editEventId"
        :before-close="handleDrawerClose"
        @onDateUpdated="onEditDateUpdated"
      />
    </avue-drawer>

    <el-dialog :visible.sync="isShowTypeNameDialog" title="元事件类型" width="400px">
      <el-form :model="typeEditData" :rules="typeNameFormRules" label-width="80px">
        <el-form-item label="类型名称">
          <el-input v-model="typeEditData.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTypeNameDialog">取消</el-button>
        <el-button type="primary" @click="onEditTypeName">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  getEventInfo,
  deleteEvent,
  getEventList
} from '@/api/project/meta-event'
import { tableOption } from '@/const/project/meta-event'
import { deepClone } from '@/util/util'
import EventEdit from './event-edit'
import { mapGetters } from 'vuex'

export default {
  name: 'MeteEvent',
  components: {
    'event-edit': EventEdit
  },
  data() {
    return {
      isLoadingTypeMenu: true,

      typeMenu: [],

      typeMenuIndex: '',

      selectedEventType: null,

      isShowTypeNameDialog: false,

      typeNameFormRules: {
        label: [
          {
            type: 'string',
            required: true,
            message: '请输入类型名称',
            trigger: 'change'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },

      searchForm: {
        codeOrName: ''
      },

      editEventId: null,

      typeEditData: {
        id: '',
        name: ''
      },

      showEditDrawer: false,

      editData: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },

  watch: {
    meteEventTypes() {
      /** 默认取第一个 */
      if (this.meteEventTypes.length !== 0 && !this.selectedEventType) {
        let indexId = this.meteEventTypes[0].id

        /** 这个一定是要一个字符串 */
        this.typeMenuIndex = indexId + ''

        this.onSelectTypeMenu(indexId)
      }
    }
  },

  created() {
    /** 获得元事件类型 */
    if (this.projectId) {
      this.$store.dispatch('getMetaEventTypes', {
        projectId: this.projectId
      })
    }
  },

  mounted() {
    const dom = this.$refs['sidemenu'].$el
    const line = this.$refs['line']

    let pnode = dom.parentNode

    while (pnode.className.indexOf('el-card') === -1) {
      pnode = pnode.parentNode
    }

    pnode.classList.add('event-scrollbar-view')

    pnode.appendChild(line)

    line.style.left = dom.scrollWidth + 20 + 'px'

    window.addEventListener(
      'resize',
      function() {
        line.style.left = dom.scrollWidth + 20 + 'px'
      },
      false
    )
    console.log(dom.style.height, 'dom', dom)
    dom.style.height = this.$refs['project'].parentNode.offsetHeight - 80 + 'px'
  },

  computed: {
    ...mapGetters(['projectId', 'meteEventTypes']),

    hasSelectedTypeMenu() {
      return this.selectedEventType !== null
    }
  },

  methods: {
    onDoTypeMenu(action) {
      console.log(action)
      switch (action) {
        case 'add':
          this.isShowTypeNameDialog = true
          this.resetTypeName()
          this.typeEditData = {}
          break

        case 'edit':
          this.isShowTypeNameDialog = true
          const data = this.selectedEventType

          this.typeEditData.name = data.name
          this.typeEditData.id = data.id
          break

        case 'delete':
          this.deleteTypeName()
          break

        default:
          break
      }
    },

    /**
     * @params { string | number } index - 当前选中菜单的序号，可能为字符串
     */
    onSelectTypeMenu(index) {
      /** @types { number } */
      let intIndex = parseInt(index, 10)

      /** 设置当前选中的类型 */
      this.selectedEventType = this.meteEventTypes.filter(item => {
        return item.id === intIndex
      })[0]

      this.tableData = []

      /**
       * 清空事件名称的查询字段
       * 目前还没有找到方法
       */

      this.getList({
        current: 1
      })
    },

    resetTypeName() {
      this.typeEditData = {
        name: '',
        id: ''
      }
    },

    onEditTypeName() {
      console.log(this.typeEditData.name)
      /** 如果是新增 */
      if (this.typeEditData && this.typeEditData.id) {
        this.$store
          .dispatch('editMetaEventType', {
            projectId: this.projectId,
            ...this.typeEditData
          })
          .then(res => {
            this.closeTypeNameDialog()
          })
      } else {
        this.$store
          .dispatch('addMetaEventType', {
            projectId: this.projectId,
            name: this.typeEditData.name
          })
          .then(res => {
            this.closeTypeNameDialog()
          })
      }
    },

    closeTypeNameDialog() {
      this.isShowTypeNameDialog = false

      this.resetTypeName()
    },

    deleteTypeName() {
      const data = this.selectedEventType

      this.$confirm(`确认删除事件类型 ${data.name} 吗？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$store.dispatch('deleteMetaEventType', {
            id: this.selectedEventType.id
          })
        })
        .catch(action => {
          console.log('catch')
        })
    },

    /** 根据传入的 typeId ，查询元事件列表 */
    getList(params = {}) {
      this.tableLoading = true

      getEventList(
        Object.assign(
          {
            current: this.page.currentPage,
            size: this.page.pageSize,
            typeId: this.selectedEventType.id
          },
          params
        )
      )
        .then(res => {
          this.tableLoading = false

          const typeName = this.selectedEventType.name

          const { data } = res

          if (data.code === 0) {
            const resData = data.data
            const records = resData.records

            /** 生成 typeId 与 typeName 的映射表 */
            const types = this.meteEventTypes
            const typeMap = {}

            const l = types.length

            if (l !== 0) {
              for (let i = 0; i < l; i++) {
                const tp = types[i]

                typeMap[tp.id] = tp.name
              }
            }

            this.tableData = records.map(item => {
              return {
                id: item.id,
                code: item.code,
                name: item.name,
                typeName: typeMap[item.typeId] || '',
                version: item.version,
                updateTime: item.updateTime,
                createTime: item.createTime
              }
            })

            this.setPage({
              total: resData.total,
              currentPage: resData.current,
              pageSize: resData.size
            })
          }
        })
        .catch(e => {
          this.tableLoading = false

          this.tableData = []
        })
    },

    pageSizeChange(size) {
      this.setPage({
        currentPage: 1,
        pageSize: size
      })

      this.getList()
    },

    pageChange(page) {
      this.setPage({
        currentPage: page
      })

      this.getList()
    },

    setPage(params) {
      this.page = Object.assign({}, this.page, {
        ...params
      })
    },

    handleAddEvent() {
      this.editEventId = null

      this.editData = {
        metaEvent: {
          code: '',
          description: '',
          keywordRelation: 'or',
          name: '',
          projectId: this.projectId,
          typeId: this.selectedEventType.id,
          version: 1.0
        },
        metaEventKeywords: [],
        metaEventProperties: []
      }

      //this.editData = {};
      this.showEditDrawer = true
    },

    handleEditRow(rowData) {
      this.editEventId = rowData['id']

      const index = rowData.$index

      this.editData = {}

      /** 请求元事件的详细 */
      this.getEventInfo({ id: rowData['id'] })

      /** 要有加载动画 */

      this.showEditDrawer = true
    },

    /**
     * 获得元事件的详情
     * @param {Object} params
     * @param {number} params.id 查询的 ID 值
     */
    getEventInfo(params) {
      getEventInfo(params)
        .then(res => {
          const { data } = res

          if (data.data.metaEvent) {
            this.editData = data.data
          }

          /** 去除加载动画 */
        })
        .catch(e => {
          /** 去除加载动画 */
        })
    },

    handleDeleteRow(rowData) {
      this.$confirm(
        `确认删除事件名称为 ${rowData.code} 的数据吗？`,
        '确认信息',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(() => {
        deleteEvent({
          id: rowData.id
        })
          .then(res => {
            /** 刷新表格 */
            this.setPage({
              currentPage: 1
            })

            this.getList()
          })
          .catch(e => {})
      })
    },

    handleDrawerClose(hide) {
      this.$confirm(
        '检测到未保存的内容，是否在离开页面前保存修改？',
        '确认信息',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '关闭',
          cancelButtonText: '继续修改'
        }
      )
        .then(() => {
          console.log('ok')
        })
        .catch(action => {
          console.log('catch')
        })
    },

    onCloseDrawer() {
      this.showEditDrawer = false
    },

    /**
     * 当编辑或新增元事件后
     */
    onEditDateUpdated() {
      /** 关闭弹窗 */
      this.onCloseDrawer()

      /** 重新回到第一页 */
      this.setPage({
        currentPage: 1
      })

      /** 重新从第 1 页请求 */
      this.getList()
    },

    /** 搜索时 */
    onSearchEvent() {
      this.setPage({
        currentPage: 1
      })

      this.getList({
        codeOrName: this.searchForm.codeOrName
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.event-type-menu {
  padding: 10px;
}


.el-dialog__footer {
  text-align: center;
}
.avue-contail /deep/ .el-scrollbar__view {
  background: #000;
}
.shadow-line {
  position: absolute;
  top: 5px;
  bottom: 50px;
  left: 100px;
  width: 1px;
  pointer-events: none;
  overflow: hidden;

  background: #e9ebee;
}
</style>
