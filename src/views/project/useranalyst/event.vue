<template>
  <div class="project">
    <basic-container>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-row>
          <el-col :xl="20" :md="17" class="top-form">
            <el-form-item label="签名" prop="signName" label-width="70px">
              <el-select
                v-model="form.signName"
                :remote-method="getSignName"
                :loading="isGettingSign"
                style="width:160px;margin-right:10px;"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入签名"
                prop="getSignName"
              >
                <el-option
                  v-for="item in signNameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label prop="simpleAnalysis" label-width="0">
              <el-checkbox v-model="form.simpleAnalysis" @change="onSimpleAnaChange">简单分析</el-checkbox>
            </el-form-item>

            <el-form-item label="事件发生时间" prop="date">
              <el-date-picker
                v-model="form.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                unlink-panels
                end-placeholder="结束日期"
                style="width:240px"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="事件类型" prop="metaEventTypeId" label-width="110px">
              <el-select
                v-model="form.metaEventTypeId"
                :disabled="form.simpleAnalysis"
                class="event-select"
                clearable
                @change="onEventTypeChange"
              >
                <el-option
                  v-for="item in meteEventTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label prop="metaEventId" label-width="0px">
              <el-select
                v-model="form.metaEventId"
                :disabled="form.simpleAnalysis"
                class="event-select"
                clearable
              >
                <el-option
                  v-for="item in eventNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="统计口径" prop="statisticalCaliber" label-width="100px">
              <el-select
                v-model="form.statisticalCaliber"
                :disabled="form.simpleAnalysis"
                clearable
              >
                <el-option
                  v-for="item in caliberOption"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xl="4" :md="7" style="text-align:right">
            <el-button type="primary" icon="el-icon-search" @click.stop="onSearch">查询</el-button>
            <el-button :loading="isExporting" icon="el-icon-download" @click.stop="onExport">导出</el-button>
          </el-col>
        </el-row>
      </el-form>

      <avue-crud
        :data="tableData"
        :page="page"
        :option="tableOption"
        :table-loading="tableLoading"
        class="analysis-table"
        @current-change="onPageChange"
        @size-change="onPageSizeChange"
      >
        <template slot="operate" slot-scope="scope">
          <el-button type="text" @click="sample(scope.row.date)">抽样查看</el-button>
        </template>
      </avue-crud>
      <el-dialog :visible.sync="sampleWatch" title="抽样查看" center width="950px">
        <sampleDetails :date="sampleDate"></sampleDetails>
      </el-dialog>
    </basic-container>
  </div>
</template>


<script>
import {
  getUserAnalysis,
  exportUserAnalysis,
  getEventListByTypeId
} from '@/api/project/meta-event'
import { getSignSearch } from '@/api/project/industry-sign'
import { userEventTableOption as tableOption } from '@/const/project/user-analyst'
import { pageOptionDefault } from '@/const/website'
import { FormRuleMap } from '@/const/formValid'
import { validatenull } from '@/util/validate'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import { getDayStart, getDayEnd } from '@/util/date'
import request from '@/router/axios'
import { mapGetters } from 'vuex'
import sampleDetails from './sampleDetails'

export default {
  name: 'UserAnalystEvent',
  components: {
    sampleDetails
  },
  data() {
    return {
      form: {
        /**
         * 签名，接口在 /industrysign/sign/page
         **/
        signName: '',

        simpleAnalysis: false,
        date: [],

        metaEventTypeId: '',
        metaEventId: '',

        statisticalCaliber: ''
      },

      isGettingSign: false,
      signNameList: [],
      signNameCancel: null,
      sampleWatch: false,

      rules: {
        signName: [
          /** 当勾选简单分析后，就是必选的 */
          { required: false, message: '请选择签名', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择事件发生时间', trigger: 'change' },
          { ...FormRuleMap.maxOneYearRange }
        ],
        metaEventTypeId: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        metaEventId: [
          { required: true, message: '请选择元事件', trigger: 'change' }
        ],
        statisticalCaliber: [
          { required: true, message: '请选择统计口径', trigger: 'change' }
        ]
      },

      /**
       * 用于存储交易总金额中的显示数据
       * 只有用户查询之后才有用
       **/
      searchedData: {
        tag: '',
        event: '',
        caliber: ''
      },

      /** 事件类型列表 */
      eventTypes: [],

      /** 事件名称列表 */
      eventNames: [],

      caliberOption: [
        {
          name: '总次数',
          value: 'total_amount'
        },
        {
          name: '用户数',
          value: 'user_amount'
        },
        {
          name: '人均次数',
          value: 'average_amount'
        }
      ],

      tableData: [],
      page: {
        ...pageOptionDefault
      },
      tableLoading: false,
      tableOption: {
        ...tableOption
      },

      tableCancelToken: null,

      isExporting: false,
      sampleDate: ''
    }
  },

  computed: {
    ...mapGetters(['projectId', 'meteEventTypes', 'projectInfo', 'userInfo'])
  },

  watch: {
    projectId() {
      if (this.projectId) {
        this.$store.dispatch('getProjectInfo', {
          id: this.projectId
        })

        /** 获得元事件类型 */
        this.$store.dispatch('getMetaEventTypes', {
          projectId: this.projectId
        })
      }
    }
  },
  created() {
    // /** 默认从8天前到昨天 */
    // const endTime = new Date(Date.now() - 3600 * 1000 * 24 * 1)
    // const startTime = new Date(Date.now() - 3600 * 1000 * 24 * 8)

    // this.form.date = [startTime, endTime];
    this.form.date = []

    /** 获得签名 */
    if (this.projectInfo.industryCodes) {
      this.getEventTypeList()

      this.getUserAnalysis()
    }

    /** 获得元事件信息 */
    if (this.projectId) {
      this.$store.dispatch('getProjectInfo', {
        id: this.projectId
      })

      /** 获得元事件类型 */
      this.$store.dispatch('getMetaEventTypes', {
        projectId: this.projectId
      })
    }

    this.tableOption.column[1].label = '次数'
  },

  methods: {
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

    getList() {
      this.tableLoading = false
    },

    onEventTypeChange() {
      const typeId = this.form.metaEventTypeId

      /** 清空事件名称选择栏数据 */
      this.form.metaEventId = ''
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

    /**
     * 当简单分析改变时
     */
    onSimpleAnaChange() {
      this.$refs['form'].clearValidate()
      this.rules.signName[0].required = this.form.simpleAnalysis
    },

    onSearch() {
      if (this.validateSearchForm()) {
        this.tableLoading = true

        /** 从第一页开始 */

        this.searchedData = {
          tag: '',
          event: '',
          caliber: ''
        }

        /** 改变当前页序号，会触发 this.getUserAnalysis */
        if (this.page.currentPage !== 1) {
          this.page.currentPage = 1
        } else {
          this.getUserAnalysis()
        }
      }
    },

    getSearchedData() {
      const eventId = this.form.metaEventId
      const caliber = this.form.statisticalCaliber

      const events = this.eventNames.filter(item => {
        return eventId === item.id
      })

      const calibers = this.caliberOption.filter(item => {
        return caliber === item.id
      })

      return {
        event: events.length !== 0 ? events[0].name : '',
        caliber: calibers.length !== 0 ? calibers[0].name : ''
      }
    },

    onExport() {
      if (this.validateSearchForm()) {
        /** 过滤掉 current 与 size */
        var formData = this.getFormData()
        delete formData.current
        delete formData.size
        this.isExporting = true

        exportUserAnalysis(formData)
          .then(({ data, headers }) => {
            downloadBlob(data, getFileInfoFromHeader(headers))

            this.isExporting = false
          })
          .catch(e => {
            this.isExporting = false
          })
      }
    },

    validateSearchForm() {
      let validLst = ['signName', 'date']

      if (this.form.simpleAnalysis !== true) {
        validLst = validLst.concat(['metaEventId', 'statisticalCaliber'])
      }

      let isOk = true

      this.$refs['form'].validateField(validLst, valid => {
        if (!validatenull(valid)) {
          isOk = false
        }
      })

      return isOk
    },

    getUserAnalysis() {
      if (this.tableCancelToken) {
        this.tableCancelToken.cancel()
      }

      const CancelToken = request.CancelToken
      this.tableCancelToken = CancelToken.source()

      /** 设置表格头部标题 */
      this.updateTableTitle()

      getUserAnalysis(this.getFormData(), {
        cancelToken: this.tableCancelToken.token
      })
        .then(res => {
          const { data } = res

          /** 都显示 10 页 */

          if (data.code === 0) {
            this.tableData = data.data

            if (this.tableData.length < this.page.pageSize) {
              this.page.total =
                this.page.pageSize * (this.page.currentPage - 1) +
                this.tableData.length
            } else {
              this.page.total = this.page.pageSize * (this.page.currentPage + 1)
            }
          } else {
            this.page.total = 0
          }

          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = true
        })
    },

    getFormData() {
      const formData = this.form
      var signName = formData.signName

      if (signName.indexOf('-') != -1) {
        signName = signName.split('-')[1]
      }
      const data = {
        projectCode: this.projectInfo.code,
        projectId: this.projectId,
        signName: signName,
        simpleAnalysis: formData.simpleAnalysis,
        current: this.page.currentPage,
        size: this.page.pageSize,
        startTime: getDayStart(formData.date[0]),
        endTime: getDayEnd(formData.date[1]),
        userId: this.userInfo.userId
      }

      /** 如果不是简单分析，要加入其它数据 */
      let eventName = ''
      let eventCode = ''
      const eventId = formData.metaEventId

      const events = this.eventNames.filter(item => {
        return eventId === item.id
      })

      if (events.length !== 0) {
        eventName = events[0].name
        eventCode = events[0].code
      }

      if (data.simpleAnalysis === false) {
        data.metaEventName = eventName
        data.metaEventCode = eventCode
        data.statisticalCaliber = formData.statisticalCaliber
      }

      return data
    },

    /**
     * 格式化代码
     */
    updateTableTitle(data) {
      let title = ''
      const { metaEventId, statisticalCaliber } = this.form

      const oSignName = this.form.signName

      let signName = oSignName === '' ? '' : '' + oSignName + ''

      /**
       * 如果是简单分析，没有事件名称与统计口径，但签名是一定要的
       * 如果不是简单分析，签名可以没有
       *  */
      if (this.form.simpleAnalysis) {
        title = signName
      } else {
        const eventId = parseInt(metaEventId, 10)

        const names = this.eventNames.filter(item => {
          return item.id === eventId
        })

        let eventName = ''

        if (names.length !== 0) {
          eventName = names[0].name
        }

        let caliberName = ''

        const calibers = this.caliberOption.filter(item => {
          return item.value === statisticalCaliber
        })

        if (calibers.length !== 0) {
          caliberName = calibers[0].name
        }

        title =
          (signName === '' ? '' : signName + '-') +
          eventName +
          '-' +
          caliberName
      }

      this.tableOption.column[1].label = title
    },

    onPageChange(page) {
      this.page.currentPage = page

      this.getUserAnalysis()
    },

    onPageSizeChange(size) {
      this.page.pageSize = size

      this.getUserAnalysis()
    },
    sample(date) {
      this.sampleWatch = true
      var metaEventCode
      this.eventNames.forEach(element => {
        console.log(element)
        if (element.id == this.form.metaEventId) {
          metaEventCode = element.code
        }
      })
      this.sampleDate = {
        ...this.form,
        metaEventCode: metaEventCode,
        date: date
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-select {
  width: 120px;
  margin-right: 10px;
}

.analysis-table {
  .el-pagination {
    .el-pagination__total {
      display: none;
    }
  }
}

.top-form {
  .el-form-item {
    display: inline-block;
  }
}
/deep/.el-dialog__title {
  font-weight: 700;
}
</style>

