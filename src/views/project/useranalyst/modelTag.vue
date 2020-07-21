<template>
  <div class="project">
    <basic-container>
      <el-row :gutter="20">
        <el-col :span="6">
          <div style="text-align:right">
            <div style="text-align:left;padding-bottom:10px;display:flex">
              <el-input v-model="filterTagText" placeholder="输入关键字查询标签"></el-input>
              <el-button type="primary" size="small" @click="onAddTag">
              <i class="el-icon-plus" /> 新增标签
            </el-button>
            </div>

            <el-dropdown @command="onDoTypeMenu">
              <span class="el-dropdown-link" style="cursor:pointer">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" command="brother">添加同级</el-dropdown-item>
                <el-dropdown-item
                  :disabled="!selectedTagTypeData || selectedTagTypeData.level > 1"
                  icon="el-icon-edit"
                  command="child"
                >添加下级</el-dropdown-item>
                <el-dropdown-item
                  :disabled="!selectedTagTypeData"
                  icon="el-icon-edit"
                  command="edit"
                >编辑</el-dropdown-item>
                <el-dropdown-item
                  :disabled="!selectedTagTypeData"
                  icon="el-icon-delete"
                  command="delete"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <div class="tab-type-menu">
              <el-tree
                ref="typeTree"
                :data="typeTree"
                :props="treeProps"
                :filter-node-method="filterTreeNode"
                :render-content="renderTree"
                accordion
                highlight-current
                empty-text="请添加标签分类"
                node-key="id"
                @node-click="onSelectType"
                default-expand-all
              ></el-tree>
            </div>
          </div>
        </el-col>

        <el-col v-if="this.tableInfo.title === ''" :span="12" class="tag-table-title">
          <div style="padding: 20px;text-align:center;">
            <h4 style="display:inline;margin-right:10px;">请选择一个标签，或者添加标签</h4>
            <!-- <el-button type="primary" size="small" @click="onAddTag">
              <i class="el-icon-plus" /> 添加标签
            </el-button> -->
              
          </div>
        </el-col>

        <el-col v-else :span="18">
          <el-row :gutter="20">
            <el-col :span="8" class="tag-table-title">
              <h3>{{ tableInfo.title }}</h3>
              <span>V {{ tableInfo.version }}</span>

              <!-- <div class="select-days">
                <el-radio-group v-model="timeType" size="small" @change="timeTypeChange">
                  <el-radio label="ONE_WEEK" border>近7天</el-radio>
                  <el-radio label="ONE_MONTH" border>近30天</el-radio>
                </el-radio-group>
              </div>-->
            </el-col>

            <el-col :span="16" style="text-align:right">
              <!-- <el-button
                type="primary"
                :disabled="tableData.length==0?true:false"
                @click="getUserTagExcel"
                :loading="isExporting"
              >
                <i class="el-icon-download" v-show="!isExporting"></i> 导出人群包
              </el-button> -->
              <!-- <el-button type="primary" @click="onAddTag">
                <i class="el-icon-plus"></i> 创建标签
              </el-button> -->
              <!-- <el-button type="primary" @click="onEditTag">
                <i class="el-icon-edit"></i> 编辑标签
              </el-button> -->
              <!-- <el-button type="warning" @click="onDeleteTag" v-loading="deleteLoading">
                <i class="el-icon-delete"></i> 删除标签
              </el-button> -->
               <el-button @click="onViewTag">
                 查看
              </el-button>
            </el-col>
          </el-row>
          <el-row class="tag-table-title">
            <dl>
              <dt>
                <i class="el-icon-user" style="margin-right:4px"></i>
              </dt>
              <dd>{{ tableInfo.userCount }} 人</dd>
              <br />
              <dt>
                <i class="el-icon-time"></i>更新时间：
              </dt>
              <dd>{{ tableInfo.updateTime==undefined?'--':tableInfo.updateTime }}</dd>
              <span>
                <el-button
                  size="small"
                  type="primary"
                  @click="computeUpdate"
                  v-loading="computeUpdateJudge"
                >计算更新</el-button>
              </span>
            </dl>
          </el-row>
          <avue-crud
            ref="crud"
            :data="tableData"
            :table-loading="tableLoading"
            :option="tableOption"
            :page="page"
            @size-change="sizeChange"
            @current-change="currentChange"
          ></avue-crud>
        </el-col>
      </el-row>
    </basic-container>

    <!-- <avue-drawer :title="drawerTitle" show-close v-model="showEditDrawer" width="1160">
      <tag-edit
        v-loading="isLoadingUserTagInit"
        :projectId="projectId"
        @on-back="hideEditDrawer"
        @on-edit-ok="onEditTagOk"
      ></tag-edit>
    </avue-drawer> -->

    <el-dialog :title="typeFormTitle" :visible.sync="isShowEditTagType" width="560px">
      <el-form :model="editTypeForm" ref="editTypeForm">
        <el-form-item
          label="标签分类名称"
          label-width="120px"
          prop="name"
          :rules="[
            { required: true, message: '请输入标签分类名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="editTypeForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditTagType = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitTagType"
          :loading="isSubmitingTagType"
        >{{ isAddType ? '添加': '修改' }}</el-button>
      </div>
    </el-dialog>
     <el-dialog
      width="70%"
      title="查看标签"
      center
      :visible.sync="viewTagVis"
      >
      <el-form>
        <el-row  type="flex" justify="center">
          <el-col :span="7">
            <el-form-item label="标签名称"></el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="标签编码"></el-form-item>
          </el-col>
        </el-row>
         <el-row  type="flex" justify="center">
          <el-col :span="7">
            <el-form-item label="标签分类"></el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="计算方式"></el-form-item>
          </el-col>
        </el-row>
         <el-row  type="flex" justify="center">
          <el-col :span="14">
            <el-form-item label="标签类型"></el-form-item>
          </el-col>
        </el-row>
        <el-row  type="flex" justify="center">
          <el-col :span="14">
            <el-form-item label="标签说明"></el-form-item>
          </el-col>
        </el-row>
        <div style="textAlign:center">
        <el-button @click="viewTagVis = false">返回</el-button>

        </div>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserTagType,
  addUserTagType,
  editUserTagType,
  deleteUserTagType,
  getTagRecord,
  getUsertagInit,
  deleteUserTag,
  getUserTagExcelUrl,
  computeRecord
} from '@/api/project/user-tag'
import request from '@/router/axios'
import { tableOption } from '@/const/project/user-tag'
import { validatenull } from '@/util/validate'
import { dateFormat } from '@/util/date'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'

import { mapGetters } from 'vuex'

import TagEdit from './tag-edit'

export default {
  name: 'UserAnalystTag',
  components: {
    'tag-edit': TagEdit
  },
  data() {
    return {
      filterTagText: '',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      /** 当前选择了的 用户标签分类 */
      selectedTagTypeData: null,

      selectedTagData: null,
      drawerTitle: '创建标签',
      /** 是增加还是修改 用户标签分类 */
      isAddType: true,
      isShowEditTagType: false,

      editTypeForm: {
        name: ''
      },
      /** 添加分类时，表单头部的提示标题 */
      typeFormTitle: '',
      /** 用于标明当前创建分类的上级 ID */
      addTypeParentId: null,

      isSubmitingTagType: false,

      typeTree: [],
      treeProps: {
        children: 'children',
        label: 'label'
      },

      tableInfo: {
        title: '',
        userCount: '-',
        version: '',
        updateTime: ''
      },

      timeType: 'ONE_WEEK',
      tableOption: tableOption,
      tableData: [],
      tableLoading: false,
      showEditDrawer: false,
      isLoadingUserTagInit: false,

      cancelToken: null,

      isExporting: false,
      deleteLoading:false,
      computeUpdateJudge: false,
      viewTagVis:false,
    }
  },

  computed: {
    ...mapGetters(['projectId'])
  },

  watch: {
    projectId() {
      if (this.projectId) {
        this.getUserTagType()
      }
    },

    filterTagText(val) {
      this.$refs.typeTree.filter(val)
    }
  },

  created() {
    /** 获得分类 */
    if (this.projectId) {
      this.getUserTagType()
    }
  },

  methods: {
    sizeChange(val) {
      this.page.pageSize = val
            this.getTagRecord({
          id: this.$refs['typeTree'].getCurrentNode().id,
          timeType: this.timeType,
           current: this.page.currentPage,
          size: this.page.pageSize,
        })
    },

    currentChange(page) {
      this.page.currentPage = page
           this.getTagRecord({
          id: this.$refs['typeTree'].getCurrentNode().id,
          timeType: this.timeType,
           current: this.page.currentPage,
          size: this.page.pageSize,
        })
    },
    getUserTagType() {
      return new Promise((reslove, reject) => {
        this.typeTree = []

        getUserTagType({ id: this.projectId })
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              this.typeTree = this.formatTypeTree(data.data)
              reslove()
            }
          })
          .catch(e => {})
      })
    },

    /**
     * 格式化 tree 数据
     * @param { object } data 从后台获取的数据
     * @param { number } level 当前菜单的层级
     */
    formatTypeTree(data, level = 1) {
      return data.map(item => {
        const newData = {
          id: item.id,
          label: item.name,
          projectId: item.projectId,
          parentId: item.parentId,
          level
        }

        if (item.childList.length !== 0) {
          newData.children = this.formatTypeTree(item.childList, level + 1)
        } else {
          newData.children = []
        }

        if (item.userTagList.length !== 0) {
          newData.children = newData.children.concat(
            item.userTagList.map(tag => {
              return {
                id: tag.id,
                label: tag.name,
                projectId: tag.projectId,
                /** 这里的 isLeaf 是没有子 */
                isLeaf: true,
                version: tag.version
              }
            })
          )
        }

        return newData
      })
    },

    filterTreeNode(value, data, node) {
      return data.label.indexOf(value) !== -1
    },

    renderTree(h, { data }) {
      return (
        <span class="custom-tree-node">
          <span>
            <i
              class={data.isLeaf ? 'el-icon-collection-tag' : 'el-icon-folder'}
            ></i>{' '}
            {data.label}
          </span>
        </span>
      )
    },

    onSearchTag() {
      this.getUserTagType()
    },

    onDoTypeMenu(command) {
      switch (command) {
        case 'brother':
          this.onAddTagType()

          /** 添加同级，可以不用选择，直接添加到根下面 */
          if (!this.selectedTagTypeData && command === 'brother') {
            this.addTypeParentId = 0
            this.typeFormTitle = '添加分类'
          } else {
            this.addTypeParentId = this.selectedTagTypeData.parentId
            this.typeFormTitle =
              '添加 ' + this.selectedTagTypeData.label + ' 同级分类'
          }

          this.isAddType = true
          break

        case 'child':
          this.onAddTagType()
          this.addTypeParentId = this.selectedTagTypeData.id
          this.typeFormTitle =
            '添加 ' + this.selectedTagTypeData.label + ' 下级分类'
          this.isAddType = true
          break

        case 'edit':
          this.onEditTagType()
          this.addTypeParentId = this.selectedTagTypeData.id
          this.typeFormTitle =
            '修改 ' + this.selectedTagTypeData.label + ' 分类名称'
          this.isAddType = false
          break

        case 'delete':
          this.addTypeParentId = this.selectedTagTypeData.id
          this.typeFormTitle =
            '您确认要删除<strong>' +
            this.selectedTagTypeData.label +
            '</strong>分类吗？'
          this.onDeleteTagType()
          break
      }
    },

    onAddTagType() {
      this.isShowEditTagType = true
      this.editTypeForm.name = ''
    },

    onEditTagType() {
      this.isShowEditTagType = true
      this.editTypeForm.name = this.selectedTagTypeData.label
    },

    /** 删除标签分类 */
    onDeleteTagType() {
      this.$confirm(this.typeFormTitle, {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteUserTagType({
          id: this.addTypeParentId
        }).then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message({
              message: '删除用户标签分类成功',
              type: 'success'
            })

            this.getUserTagType()
          }
        }).catch(res => {
          const { data } = res

            this.$message({
              message: res.msg,
              type: 'warning'
            })

            this.getUserTagType()
          
      })
      })
    },

    onSubmitTagType() {
      this.$refs['editTypeForm'].validate(valid => {
        if (valid) {
          this.editTagType()

          this.isSubmitingTagType = true
        }
      })
    },

    editTagType() {
      if (this.isAddType) {
        addUserTagType(this.getEditTagTypeData())
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              this.$message({
                message: '新增用户标签分类成功',
                type: 'success'
              })

              this.isShowEditTagType = false

              this.getUserTagType()
            }

            this.isSubmitingTagType = false
          })
          .catch(e => {
            this.isSubmitingTagType = false
          })
      } else {
        editUserTagType(this.getEditTagTypeData())
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              this.$message({
                message: '修改用户标签分类成功',
                type: 'success'
              })

              this.isShowEditTagType = false
            }

            this.isSubmitingTagType = false
            this.getUserTagType()
          })
          .catch(e => {
            this.isSubmitingTagType = false
          })
      }
    },

    /**
     * 当点击侧边栏时，
     * 可能选择的是标签分类，也可能是标签
     */
    onSelectType(data) {
      /** 如果是标签 */
      console.log(data, '传入的id')
      if (data.isLeaf) {
        this.updateTableInfo({
          title: data.label,
          version: data.version,
          userCount: '--',
          updateTime: '--'
        })
        this.page={
          total: 0, 
        currentPage: 1, 
        pageSize: 10 
        }
        this.tableOption.column[0].label = data.label

        /** 只留第一例，其它列根据数据返回动态设置 */
        this.tableOption.column = this.tableOption.column.slice(0, 1)

        this.selectedTagData = data
        this.selectedTagTypeData = null

       
          /** 获取数据 */
        this.getTagRecord({
          id: data.id,
          timeType: this.timeType,
           current: this.page.currentPage,
          size: this.page.pageSize,
        })
        
      } else {
        /** 如果是标签分类 */
        this.selectedTagTypeData = data
        this.selectedTagData = null
      }
    },

    updateTableInfo(data) {
      for (let i in data) {
        this.tableInfo[i] = data[i]
      }
    },

    /**
     * 获得新增修改标签分类的表单数据
     */
    getEditTagTypeData() {
      const selData = this.selectedTagTypeData

      const data = {
        name: this.editTypeForm.name,
        projectId: this.projectId,
        parentId: this.addTypeParentId,
        updateTime: dateFormat(new Date())
      }

      if (this.isAddType) {
        data.id = 0
        data.deleteFlag = 0
        data.createTime = dateFormat(new Date())
      } else {
        data.id = selData.id
        data.deleteFlag = selData.deleteFlag
        data.createTime = selData.createTime
      }

      return data
    },

    getTagRecord(params) {
      this.tableData = []
      //this.tableOption.column = [];

      if (this.cancelToken) {
        this.cancelToken.cancel('一次只能有一个请求')
      }

      const CancelToken = request.CancelToken
      const source = CancelToken.source()

      this.cancelToken = source

      /**
       * 这里会有个问题，当请求被 cancel 时，
       * catch 里面的代码会延迟执行
       * 也就是说虽然在这里被设置为 true
       * 但马上又会变为 false
       */
      this.tableLoading = true

      getTagRecord(params, {
        cancelToken: source.token
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            const { data } = res

            this.updateTableInfo({
              userCount: data.data.userCount,
              updateTime: data.data.maxModifiedTime
            })

            this.updateTableData(data.data)
            this.page.total = data.data.total
          }

          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
        })
    },

    updateTableData(data) {
      /** 如果有数据 */
      if (data.recordCounts && data.returnLayerNames) {
        const layerLen = data.returnLayerNames.length
        const toption = []
        const tdata = []
        this.tableOption.column = []

        /** 创建表格设置项 */
        for (let i = 0; i < layerLen; i++) {
          const idx = i + 1
          toption.push({
            label: data.returnLayerNames[i],
            prop: 'layer' + idx,
            type: 'String'
          })
        }

        const dataLen = data.recordCounts.length
        for (let i = 0; i < dataLen; i++) {
          const item = data.recordCounts[i]

          const len = item.length
          const itemData = {
            tagName: data.rmEqualEventTimeList[i]
          }

          for (let j = 0; j < len; j++) {
            itemData['layer' + (j + 1)] = item[j]
          }

          tdata.push(itemData)
        }
        console.log(tdata, 'tdata')
        this.tableData = tdata
        this.tableOption.column = this.tableOption.column.concat(toption)
      }
    },

    onAddTag() {
      this.showEditDrawer = true
      this.drawerTitle = '创建标签'
      this.$store.dispatch('userTag/setEidtUserTag', {
        editTagData: {
          id: 0,
          name: '',
          code: '',
          projectId: this.projectId,
          userTagTypeId: '',
          computeType: 1,
          code: '',
          version: '',
          layers: [],
          incident:true,
          content:''
        }
      })
    },

    onEditTag() {
      this.drawerTitle = '编辑标签'
      if (this.selectedTagData) {
        this.showEditDrawer = true
        this.isLoadingUserTagInit = true

        this.$store
          .dispatch('userTag/getUserTagInit', {
            id: this.selectedTagData.id
          })
          .then(res => {
            this.isLoadingUserTagInit = false
          })
          .catch(e => {
            this.isLoadingUserTagInit = false
          })
      } else {
        this.$message({
          message: '请先选择一个标签',
          type: 'warning'
        })
      }
    },

    /** 当添加和修改标签成功后 */
    onEditTagOk(id) {
      this.getUserTagType().then(() => {
        console.log(id,'id')
        this.$refs['typeTree'].setCurrentKey(id)
        var data=this.$refs['typeTree'].getCurrentNode()
        console.log(data,'ddddddddd')
        this.selectedTagData = data

        if (data.isLeaf) {
        this.updateTableInfo({
          title: data.label,
          version: data.version,
        
        })
        }
        
      })

      this.hideEditDrawer()
    },

    /** 隐藏添加和修改的 drawer */
    hideEditDrawer() {
      this.showEditDrawer = false
      this.isLoadingUserTagInit = false
    },

    onDeleteTag() {
      if (this.selectedTagData) {
        this.$confirm(
          '您确认要删除 ' + this.selectedTagData.label + ' 标签吗？',
          '提示',
          {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.deleteLoading=true
          deleteUserTag({
            id: this.selectedTagData.id
          }).then(res => {
            const { data } = res
            this.deleteLoading=false
            if (data.code === 0) {
              this.$message({
                message: '删除标签成功',
                type: 'success'
              })
              this.tableInfo.title = ''
              this.getUserTagType()
            }
          }).catch(()=>{
            this.deleteLoading=false
          })
        })
      } else {
        this.$message({
          message: '请先选择一个标签',
          type: 'warning'
        })
      }
    },

    getUserTagExcel() {
      if (this.selectedTagData) {
        this.isExporting = true

        getUserTagExcelUrl({
          id: this.selectedTagData.id,
          timeType: this.timeType
        })
          .then(res => {
            downloadBlob(res.data, getFileInfoFromHeader(res.headers))

            this.isExporting = false
          })
          .catch(e => {
            this.isExporting = false
          })
      } else {
        this.$message({
          message: '请先选择一个标签',
          type: 'warning'
        })
      }
    },

    timeTypeChange() {
      const data = this.selectedTagData
      if (data) {
        /** 获取数据 */
        this.getTagRecord({
          id: data.id,
          timeType: this.timeType
        })
      }
    },
    computeUpdate() {
      if (this.cancelToken) {
        this.cancelToken.cancel('一次只能有一个请求')
      }

      const CancelToken = request.CancelToken
      const source = CancelToken.source()

      this.cancelToken = source

      /**
       * 这里会有个问题，当请求被 cancel 时，
       * catch 里面的代码会延迟执行
       * 也就是说虽然在这里被设置为 true
       * 但马上又会变为 false
       */
      this.computeUpdateJudge = true

      computeRecord(
        {
          id: this.selectedTagData.id,
          projectId: this.projectId
        },
        {
          cancelToken: source.token
        }
      )
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            const { data } = res

            this.onSelectType(this.$refs['typeTree'].getCurrentNode())
          }

          this.computeUpdateJudge = false
        })
        .catch(e => {
          this.computeUpdateJudge = false
        })
    },
    onViewTag(){
      this.viewTagVis=true
    }
  }
}
</script>


<style lang="scss">
.tab-type-menu {
  text-align: left;
}

.theme-white {
  .project {
    .el-dropdown {
      color: #333;
    }
  }
}

.tag-table-title {
  h3 {
    display: inline;
    margin-right: 10px;
    font-size: 20px;
  }

  p {
    padding: 10px 0;
  }

  dl {
    padding: 10px 0 0 0;
    margin: 0;
  }
  dt,
  dd {
    display: inline;
  }

  dt {
    color: #999;
  }

  dd {
    margin-right: 10px;
  }

  .select-days {
    padding-top: 10px;
  }
}
</style>
<style lang="scss" scoped>
/deep/.el-loading-mask {
  z-index: 200;
}
.el-col{
  margin-bottom: 0
}
</style>