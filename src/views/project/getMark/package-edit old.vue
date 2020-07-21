<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" class="package-form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="9">
          <p style="padding-bottom:10px;">
            请选择时间
            <el-button type="primary" icon="el-icon-plus" circle @click="addDateRow"></el-button>
          </p>

          <div v-for="(item, index) in form.partitionDayList" :key="item.id">
            <el-form-item
              :prop="'partitionDayList.' + index + '.operator'"
              :rules="[
                { required: true, message: '请选择操作类型', trigger: 'blur' }
              ]"
              label-width="0"
              style="margin-right:10px;"
            >
              <el-select v-model="item.operator" style="width:140px" placeholder="请选择">
                <el-option
                  v-for="opt in operatorList"
                  :key="opt.value"
                  :label="opt.name"
                  :value="opt.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-show="item.operator === rulesMap.RANGE.value"
              :prop="'partitionDayList.' + index + '.values'"
              :rules="[
                { validator: validateDateRangeInput, trigger: 'blur', operator:item.operator },
              ]"
              label-width="0"
            >
              <el-date-picker
                v-model="item.values"
                :default-time="defaultDateRange"
                :unlink-panels="true"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item
              v-show="item.operator !== rulesMap.RANGE.value"
              :prop="'partitionDayList.' + index + '.value'"
              :rules="[
                { validator: validateDateInput, message: '请选择时间', trigger: 'blur', operator:item.operator }
              ]"
              label-width="0"
            >
              <el-date-picker
                v-model="item.value"
                :default-time="defaultDate"
                :prop="'dates.' + index + '.value'"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>

            <el-button
              style="margin-left:10px;"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteDateRow(index)"
            ></el-button>
          </div>
        </el-col>

        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="人群包类型" prop="name">
                <el-select
                  v-model="form.packageType"
                  :change="packageTypeChange"
                  placeholder="请选择人群包类型"
                >
                  <el-option
                    v-for="item in packageTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="签名查询">
                <el-select v-model="form.queryType" style="width:118px;">
                  <el-option label="按签名名称" value="1"></el-option>
                  <el-option label="按签名级别" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-form-item v-if="signCategorysJudge" prop="signName" label-width="0">
                <el-select
                  v-model="form.signName"
                  :loading="isGettingSign"
                  :remote-method="getSignName"
                  style="width:240px;"
                  clearable
                  filterable
                  remote
                  multiple
                  placeholder="请输入签名"
                  class="signNameInput"
                  @change="signNameChange"
                >
                  <!-- <el-select style="width:130px;"
                v-model="form.signName"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入签名"
                :remote-method="getSignName"
                @change="signNameChange"
                  :loading="isGettingSign">-->

                  <el-option
                    v-for="item in signNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="!signCategorysJudge" prop="signCategorys" label-width="0">
                <el-select
                  v-model="form.signCategorys"
                  prop="signCategorys"
                  style="width:240px;"
                  multiple
                  filterable
                  default-first-option
                  placeholder="请选择签名级别"
                >
                  <el-option
                    v-for="item in signCategorysList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="4">
              <el-form-item label="人数限制" prop="numberLimit">
                <el-input v-model="form.numberLimit" style="width:120px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <span>
                <el-form-item style="display:inline-block" label="事件类型" prop="eventTypeId">
                  <el-select
                    v-model="form.eventTypeId"
                    clearable
                    class="event-select"
                    @change="onEventTypeChange"
                  >
                    <el-option
                      v-for="item in eventTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item style="display:inline-block" label prop="eventId" label-width="0px">
                  <el-select
                    v-model="form.eventId"
                    class="event-select"
                    clearable
                    @change="eventIdChange"
                  >
                    <el-option
                      v-for="item in eventNames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </span>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="3">
          <el-button
            type="primary"
            v-loading="searchPackageWaiting"
            icon="el-icon-search"
            @click="onSearch"
          >查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <h2>{{tableOption.title}}</h2>
    <!-- <avue-crud
      :data="tableData"
      :option="tableOption"
      :table-loading="tableLoading"
      :page="page"
      class="package-table"
      @size-change="pageSizeChange"
      @current-change="pageChange"
    >
      <template slot="empty">
        <el-alert
          :title="isSearched ? '暂时没有数据' : '请选择人群包条件后生成人群包'"
          :closable="false"
          type="info"
          center
          show-icon
        ></el-alert>
      </template>
    </avue-crud>-->

    <div style="padding-top:20px;text-align:center;">
      <!-- <el-button
        :disabled="!isSearched || tableData.length === 0"
        :loading="isGetingName"
        type="primary"
        @click="createPackageName"
      >生成人群包</el-button>-->
      <el-button
        :disabled="!isSearched||totalAmountRenshu==0"
        :loading="isGetingName"
        type="primary"
        @click="createPackageName"
      >生成人群包</el-button>
      <el-button icon="el-icon-right" @click="closeThis">返回</el-button>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="createDialog"
      width="500px"
      title="生成人群包"
      append-to-body
    >
      <div v-loading="isGetingName" v-if="isGetingName" element-loading-text="正在获取包名"></div>
      <el-form v-else ref="createForm" :model="createForm" :rules="createFormRules">
        <el-form-item label="包名称" prop="name">
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="createForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="hideCreateDialog">取 消</el-button>
        <el-button :loading="isCreating" type="primary" @click="sureCreatePackage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserIdList,
  createPackageName,
  createPackage,
  getSignRank
} from '@/api/admin/audience-package'
import { getEventListByTypeId } from '@/api/project/meta-event'
import { getTypeListByProjectId } from '@/api/project/meta-event'
import { getSignSearch } from '@/api/project/industry-sign'
import { userTagLayerRule, rulesMap } from '@/const/project/user-tag'
import {
  viewTableOption as tableOption,
  viewPageOption as pageOption,
  packageType,
  packageTypeList
} from '@/const/crud/admin/audience-package'

import { validatenull } from '@/util/validate'
import { getDayEnd, getDayStart, getLastYearTime } from '@/util/date'
import request from '@/router/axios'
import { mapGetters } from 'vuex'

export default {
  name: 'PackageEdit',
  props: {
    parentData: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    'close-me': {
      type: Function,
      default: () => {}
    }
  },
  data() {
    /** 默认从8天前到昨天 */
    const endTime = new Date(Date.now() - 3600 * 1000 * 24 * 1)
    const startTime = new Date(Date.now() - 3600 * 1000 * 24 * 8)

    const valideSignName = (rule, value, callback) => {
      /** 如果是普通模式，必须选 */
      if (this.form.packageType === packageType.NORMAL.value) {
        if (value === '') {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const valideSignRank = (rule, value, callback) => {
      console.log('yanzzz')
      /** 如果是普通模式，必须选 */
      if (this.form.packageType === packageType.NORMAL.value) {
        console.log('没选签名级别吗?', this.form)
        if (value.length == 0) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        //   if(this.form.eventId === ''){
        //     callback(new Error('签名和事件至少选择一个'));
        //   }else{
        callback()
        //   }
      }
    }

    const valideEvent = (rule, value, callback) => {
      console.log(this.form)
      if (this.form.packageType === packageType.UPGRADE.value) {
        if (value == '') {
          callback(new Error('请选择事件'))
        } else {
          callback()
        }
      } else {
        // if (this.form.signName === '' && value === '') {
        //   if(this.form.signCategorys.length!=0){
        //     callback()
        //   }else{
        //   callback(new Error(rule.message));

        //   }
        // }else if(this.form.signCategorys.length==0&& value === '') {
        //   if(this.form.signName != ''){
        //     callback()
        //   }else{
        //   callback(new Error(rule.message));

        //   }

        // }

        callback()
      }
    }

    const valideNumberLimit = (rule, value, callback) => {
      if (value !== '' && !/^[1-9]\d*$/.test(value)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }

    return {
      rulesMap: rulesMap,
      defaultDateRange: [getDayStart(startTime), getDayEnd(endTime)],
      defaultDate: getDayEnd(endTime),

      /** 这里面写的都是没用的， created 中会重新赋值 */
      form: {},
      rules: {
        signName: [
          /** 当为普通类型时，就是必选的 */
          { validator: valideSignName, message: '请输入签名', trigger: 'blur' }
        ],
        signCategorys: [
          {
            validator: valideSignRank,
            message: '请选择签名级别',
            trigger: 'blur'
          }
        ],
        eventId: [
          { validator: valideEvent, message: '请选择事件', trigger: 'change' }
        ],
        numberLimit: [
          {
            validator: valideNumberLimit,
            message: '人数限制必须为整数',
            trigger: 'blur'
          }
        ]
      },

      packageType,
      packageTypeList,

      /** 去掉不等于 */
      operatorList: userTagLayerRule.DATE.filter(item => {
        return item.value !== 'not_equal'
      }),

      page: {
        ...pageOption
      },

      isGettingSign: false,
      signNameList: [],
      signCategorysList: [],
      eventTypes: [],
      eventNames: [],
      signCategorysJudge: true,

      /**
       * 是否已经查询过的
       * 因为也可能查询不到数据
       **/
      isSearched: false,

      tableOption: tableOption,
      tableData: [],
      tableLoading: false,
      userIdCancel: null,

      createDialog: false,

      isGetingName: false,

      createForm: {
        name: '',
        remark: ''
      },

      createFormRules: {
        name: [{ required: true, message: '请输入包名称', trigger: 'blur' }]
      },

      totalAmount: -1,
      isCreating: false,
      searchPackageWaiting: false,
      totalAmountRenshu: 0
    }
  },

  computed: {
    ...mapGetters(['projectId', 'projectInfo'])
  },
  watch: {
    form: {
      handler(val) {
        if (val.queryType == '1') {
          this.$refs['form'].clearValidate('signCategorys')
          this.signCategorysJudge = true
        } else {
          this.$refs['form'].clearValidate('signName')

          this.signCategorysJudge = false
        }
        if (val.queryType == '2' && this.signCategorysList.length == 0) {
          console.log(val, 'form')
          getSignRank({
            projectId: this.projectId
          })
            .then(({ data }) => {
              this.signCategorysList = data.data.map(item => ({
                label: item,
                value: item
              }))
            })
            .then(() => {
              this.signCategorysList.forEach(item => {
                if (item.label == -1) {
                  item.label = '未定级'
                }
              })
            })
        }
      },
      deep: true
    }
  },
  created() {
    /** 获得签名 */
    if (this.projectId) {
      this.getEventTypeList({
        projectId: this.projectId
      })
    }
    this.tableOption.title = ''
    this.form = JSON.parse(JSON.stringify(this.parentData))

    if (this.form.partitionDayList.length === 0) {
      this.addDateRow()
    }
    this.form = {
      ...this.form,
      queryType: '1',
      signCategorys: [],
      signName: []
    }
  },

  methods: {
    packageTypeChange(val) {
      /** 如果是普通，必选签名，不能选事件 */
      // if (val === packageType.NORMAL.value) {
      // } else {
      //   /** 如果是升级，必须要有事件 */
      // }
    },

    onRangeDateChange(value) {},

    getEventTypeList(payload) {
      getTypeListByProjectId({
        id: payload.projectId
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.eventTypes = data.data
          }
        })
        .catch(e => {})
    },

    getSignName(query) {
      /** 至少两个字才可以搜索 */
      if (query.length > 1) {
        this.isGettingSign = true
        this.signNameList = []

        if (this.signNameCancel) {
          this.signNameCancel.cancel()
        }

        const CancelToken = request.CancelToken
        this.signNameCancel = CancelToken.source()

        getSignSearch(
          {
            signName: query,
            current: 1,
            size: 100,
            projectId: this.projectId
          },
          {
            cancelToken: this.signNameCancel.token
          }
        )
          .then(res => {
            const { data } = res
            console.log(data, '签名名称')
            if (data.code === 0) {
              this.signNameList = data.data.map(item => {
                return {
                  value: item,
                  label: item
                }
              })
            }

            this.isGettingSign = false
          })
          .catch(e => {
            this.isGettingSign = false
          })
      } else {
        if (this.signNameCancel) {
          this.signNameCancel.cancel()
        }
      }
    },

    onEventTypeChange() {
      const typeId = this.form.eventTypeId

      /** 清空事件名称选择栏数据 */
      this.form.eventId = ''
      this.eventNames = []

      if (!validatenull(typeId)) {
        this.getEventNames({
          id: typeId
        })
      }
    },

    getEventNames(params) {
      getEventListByTypeId({
        ...params
      }).then(res => {
        const { data } = res

        if (data.code === 0) {
          this.eventNames = data.data.map(item => {
            return {
              id: item.id,
              name: item.name,
              code: item.code
            }
          })
        }
      })
    },

    validateDateInput(rule, value, callback) {
      /** 如果是时间范围 */
      if (rule.operator !== this.rulesMap.RANGE.value) {
        if (value === '') {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },

    validateDateRangeInput(rule, value, callback) {
      /** 如果是时间范围 */
      if (rule.operator === this.rulesMap.RANGE.value) {
        /** 验证时间范围 */
        if (value === '') {
          callback(new Error('请选择时间范围'))
        } else {
          /** 最小值 */
          const minTime = getLastYearTime(value[1])
          const liteTime = new Date(value[0])

          if (liteTime < minTime) {
            callback(new Error('时间跨度不能大于1年'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },

    addDateRow() {
      this.form.partitionDayList.push({
        operator: '',
        values: '',
        value: ''
      })
    },

    deleteDateRow(index) {
      if (this.form.partitionDayList.length > 1) {
        this.form.partitionDayList.splice(index, 1)
      } else {
        this.$message({
          message: '时间至少有一组条件',
          type: 'warning'
        })
      }
    },

    signNameChange(value) {
      /** 如果有值，则移除操作的错误提示 */
      if (value !== '') {
        this.$refs['form'].clearValidate('eventId')
      }
    },

    eventIdChange(value) {
      /** 如果有值，则移除签名的错误提示 */
      if (value !== '') {
        this.$refs['form'].clearValidate('signName')
      }
    },

    onSearch() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.totalAmount = -1
          this.page.total = 0

          this.tableOption.title = this.getTableTitle()

          this.getList()
        }
      })
    },

    pageSizeChange(size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.getList()
    },

    pageChange(page) {
      this.page.currentPage = page
      this.getList()
    },

    getList() {
      this.tableLoading = true
      this.isSearched = false
      this.searchPackageWaiting = true
      if (this.userIdCancel) {
        this.userIdCancel.cancel('一次只能有一个请求')
      }

      const CancelToken = request.CancelToken
      const source = CancelToken.source()

      this.userIdCancel = source

      /** 如果有 name 值 */
      const formDate = this.getFormData()

      if (this.form.name !== '') {
        formDate.name = this.form.name
      }

      this.tableData = []

      getUserIdList(formDate, {
        cancelToken: source.token
      })
        .then(({ data }) => {
          console.log('?????', data)
          if (data.code === 0) {
            this.tableData = data.data.userIds

            this.page.total = parseInt(data.data.totalAmount, 10)
            this.totalAmountRenshu = data.data.totalAmount
            this.tableOption.title =
              this.getTableTitle() + ' (' + data.data.totalAmount + '人)'

            this.isSearched = true
            this.searchPackageWaiting = false
          }

          this.tableLoading = false
        })
        .catch(e => {
          this.searchPackageWaiting = false
          if (new RegExp('Cancel').test(e)) {
            this.tableLoading = true
          } else {
            this.tableLoading = false
          }
        })
    },

    getFormData() {
      var data = {
        projectId: this.form.projectId,
        packageType: this.form.packageType,
        signName: this.form.signName,
        partitionDayList: this.form.partitionDayList.map(item => {
          if (item.operator === rulesMap.RANGE.value) {
            return {
              operator: item.operator,
              value: item.values.join(',')
            }
          } else {
            return {
              operator: item.operator,
              value: item.value
            }
          }
        }),
        queryType: this.form.queryType,
        signCategorys: this.form.signCategorys,
        numberLimit:
          this.form.numberLimit === ''
            ? ''
            : parseInt(this.form.numberLimit, 10),
        current: this.page.currentPage,
        size: this.page.pageSize,
        eventId: this.form.eventId
      }
      if(data.eventId!=''){
        data.queryType=3
      }
      /** 如果是升级 */
      if (this.form.packageType === packageType.UPGRADE.value) {
        data.eventId = this.form.eventId
      }

      if (this.signCategorysJudge) {
        data = {
          ...data,
          signCategorys: []
        }
      } else {
        data = {
          ...data,
          signName: []
        }
      }
      return data
    },

    getTableTitle() {
      console.log(this.form, 'this.form')

      const data = this.form
      let tableTitle
      if (data.signName.length > 5) {
        tableTitle = data.signName.slice(0, 5) + '等'
      } else {
        tableTitle = data.signName.toString()
      }
      console.log(data.signName)
      if (this.form.queryType == 2) {
        var arr = JSON.parse(JSON.stringify(this.form.signCategorys))
        arr.forEach((item, i) => {
          if (item == -1) {
            arr[i] = '未分级'
          }
        })
        tableTitle = '级别' + arr
        tableTitle = tableTitle.split(',').join('、')
      }
      /** 如果是升级的话 */
      if (
        // data.packageType === packageType.UPGRADE.value &&
        data.eventId !== ''
      ) {
        const list = this.eventNames.filter(item => {
          return item.id === data.eventId
        })

        if (list.length > 0) {
          tableTitle =
            (tableTitle !== '' ? tableTitle + ' - ' : '') + list[0].name
        }
      }

      return tableTitle
    },

    createPackageName() {
      /** 弹出窗口 */
      this.createDialog = true
      this.isGetingName = true
      this.createForm.name = ''
      this.createForm.remark = ''

      /** 请求包名称 */
      createPackageName(this.getFormData())
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.createForm.name = data.data
          }

          this.isGetingName = false
        })
        .catch(e => {
          this.isGetingName = false
        })
    },

    closeThis() {
      if (this.userIdCancel) {
        this.userIdCancel.cancel('一次只能有一个请求')
      }
      this.$emit('close-me')
    },

    hideCreateDialog() {
      this.createDialog = false
    },

    sureCreatePackage() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.isCreating = true

          const formData = this.getFormData()

          formData.name = this.createForm.name
          formData.remark = this.createForm.remark

          createPackage(formData)
            .then(res => {
              const { data } = res

              if (data.code === 0) {
                this.$message({
                  message: '创建人群包成功',
                  type: 'success'
                })

                this.createDialog = false
                this.closeThis()

                this.$emit('refresh-table')
              }

              this.isCreating = false
            })
            .catch(e => {
              this.isCreating = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.event-select {
  width: 120px;
  margin-right: 10px;
}
.package-table /deep/ .el-alert__title {
  font-size: 16px;
}
.package-table /deep/ .avue-crud__menu {
  display: none;
}

.package-form {
  /deep/ .el-form-item {
    display: inline-block;
  }
}
/deep/.signNameInput .el-select__input {
  height: 30px;
}
</style>
