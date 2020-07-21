<template>
  <div>
    <UserIncrease></UserIncrease>

    <basic-container>
      <h3>源数据统计</h3>

      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        :summary-method="getSummaries"
        @search-change="handleSearchChange"
        @search-reset="searchReset"
      >
        <template slot="search">
          <el-form ref="searchForm" :rules="rules" :model="searchForm">
            <el-col :xl="10" :sm="20">
              <!-- <el-form-item label="签名">
                <el-select
                  style="width:160px;margin-right:10px;"
                  v-model="searchForm.signName"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入签名"
                  :remote-method="getSignName"
                  :loading="isGettingSign"
                  prop="getSignName"
                >
                  <el-option
                    v-for="item in signNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>-->

              <el-form-item label="统计类型">
                <el-select
                  v-model="searchForm.queryType"
                  style="width:118px!important;"
                >
                  <el-option label="按签名名称" value="1"></el-option>
                  <el-option label="按签名级别" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="signCategorysJudge" label-width="0">
                <el-select
                  v-model="searchForm.signName"
                  :loading="isGettingSign"
                  :remote-method="getSignName"
                  style="width:160px;margin-right:10px;"
                  clearable
                  filterable
                  remote
                  multiple
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
              <el-form-item
                v-if="!signCategorysJudge"
                prop="signCategorys"
                label-width="0"
              >
                <el-select
                  v-model="searchForm.signCategorys"
                  prop="signCategorys"
                  style="width:150px;"
                  multiple
                  filterable
                  allow-create
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

              <!-- <el-form-item label="原签名" prop="date">
                <el-select
                  style="width:160px;margin-right:10px;"
                  v-model="searchForm.rawSignName"
                  clearable
                  filterable
                  remote
                  multiple
                  placeholder="请输入原签名"
                  :remote-method="getOriSignName"
                  :loading="isGettingSign"
                  prop="getSignName"
                >
                  <el-option
                    v-for="item in signNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="请选择时间" prop="date">
                <el-date-picker
                  v-model="searchForm.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:300px!important"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="small" @click="sampling(scope.row)"
            >取样</el-button
          >
          <el-button type="text" size="small" @click="exportS(scope.row)"
            >导出</el-button
          >
        </template>
        <template slot-scope="scope" slot="signNumber">
             <el-button type="text" v-if="scope.row.signNumber!=0" @click="downE(scope.row.partitionDay)">{{
              scope.row.signNumber
            }}</el-button>
            <span v-else>{{
              scope.row.signNumber
            }}</span>
        </template>
        <template slot-scope="scope" slot="partitionDay">{{
          scope.row.partitionDay.substring(5)
        }}</template>
        <template slot-scope="scope" slot="count">
          <span v-show="scope.row.count == 0" style="color:red">{{
            scope.row.count
          }}</span>
          <span v-show="scope.row.count != 0">{{ scope.row.count }}</span>
        </template>
      </avue-crud>
      <el-dialog
        :visible.sync="dialogFormVisible"
        title="数据取样"
        width="360px"
      >
        <el-form
          ref="sample"
          :model="form"
          :rules="getSampleRules"
          class="form"
        >
          <el-form-item label="取样方式">
            <el-select v-model="form.sampleType" placeholder="请选择取样方式">
              <el-option label="特征随机" value="1"></el-option>
              <el-option label="按时间最晚" value="2"></el-option>
              <el-option label="按时间最早" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="取样数量" prop="sampleCount">
            <el-input
              v-model.number="form.sampleCount"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="sampleLoading" type="primary" @click="getSample"
            >确 定</el-button
          >

          <el-button @click="dialogFormVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import * as getNumbersApi from '@/api/project/getNumbers'
import { getSignSearch } from '@/api/project/industry-sign'
// import { tableOption } from '@/const/project/dataStatistic'
import { FormRuleMap } from '@/const/formValid'
import { getDayStart, getDayEnd } from '@/util/date'
import request from '@/router/axios'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import { mapGetters } from 'vuex'
import { getSignRank } from '@/api/admin/audience-package'
import UserIncrease from './userIncrease'
export default {
  data() {
    var sampleCount = (rule, value, callback) => {
      if (value == '') {
        callback()
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 5000) {
            callback(new Error('取样数量不得超过5000'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: {
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        searchBtn: false,
        editBtn: false,
        delBtn: false,
        showSummary: true,
        menu: false,
        column: [
          {
            label: '日期',
            prop: 'partitionDay',
            slot: true
          },
          {
            label: '全部',
            prop: 'count',
            slot: true
          },
          {
            label:'签名个数',
            prop:'signNumber',
            slot: true

          },
          {
            label: '操作',
            prop: 'menu',
            slot: true
          }
        ]
      },
      searchForm: {
        date: [],
        queryType: '1',
        signCategorys: [],
        rawSignName: [],
        signName: []
      },
      signCategorysList: [],
      dialogFormVisible: false,
      form: {
        sampleCount: 2000,
        sampleType: '1'
      },
      isGettingSign: false,
      signNameCancel: null,
      signNameList: [],
      rules: {
        date: [
          // { required: true, message: '请选择事件发生时间', trigger: 'change' },
          { ...FormRuleMap.max29DayRange, trigger: 'change' }
        ]
      },
      getSampleRules: {
        sampleCount: [
          // { required: true, message: '请选择事件发生时间', trigger: 'change' },
          { validator: sampleCount, trigger: ['blur', 'change'] }
        ]
      },
      signName: '',
      sampleLoading: false,
      signCategorysJudge: true,
      total: '',
      projectTotal: ''
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userInfo','controlDate'])
  },
  components: {
    UserIncrease
  },
  watch: {
    searchForm: {
      handler(val) {
        if (val.queryType == '1') {
          console.log('???')
          this.$refs['searchForm'].clearValidate('signCategorys')
          this.signCategorysJudge = true
        } else {
          this.$refs['searchForm'].clearValidate('signName')

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
    // axios.get('http://mockjs.com/api/gets', {}).then(({ data }) => {
    //   console.log(data.List)
    //   this.tableData = data.List

    // })
    console.log(this.controlDate,'controlDate')
    var startTime
    var endTime
    if(this.controlDate.judge){
      startTime=new Date(this.controlDate.date+'-01')
      endTime=new Date(this.controlDate.date+'-30')
    
      if(this.controlDate.date.substring(5,7)-1==new Date().getMonth()){
        endTime=new Date()
      }
    }else{
       startTime = new Date()
     endTime = new Date()

    startTime.setDate(startTime.getDate() - 10)
    endTime.setDate(endTime.getDate() - 3)
    }
    
    this.searchForm.date.push(startTime)
    this.searchForm.date.push(endTime)
    this.handleList(getDayStart(startTime), getDayEnd(endTime))
   
  },

  methods: {
    handleSearchChange(payload) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          console.log('dfsfas', this.searchForm.signName)

          this.handleList(
            getDayStart(new Date(this.searchForm.date[0])),
            getDayEnd(new Date(this.searchForm.date[1]))
          )
          if (this.signCategorysJudge) {
            if (
              this.searchForm.signName.length == 0 &&
              this.searchForm.signCategorys.length == 0
            ) {
              this.tableOption.column[1].label = '全部'
              console.log('走这里了吗')
            } else {
              if (this.searchForm.signName.length > 3) {
                this.tableOption.column[1].label =
                  this.searchForm.signName.slice(0, 3).toString() + '...'
              } else {
                this.tableOption.column[1].label = this.searchForm.signName.toString()
              }
            }
          } else {
            if (
              this.searchForm.signName.length == 0 &&
              this.searchForm.signCategorys.length == 0
            ) {
              this.tableOption.column[1].label = '全部'
              console.log('走这里了吗123')
            } else {
              let signCategorys = this.searchForm.signCategorys
              signCategorys = signCategorys.map(item =>
                item == -1 ? '未定级' : item
              )

              this.tableOption.column[1].label =
                '签名级别' + signCategorys.toString()
            }
          }
        } else {
          return false
        }
      })
      //  startTime: getDayStart(formData.date[0]),
      //         endTime: getDayEnd(formData.date[1]),

      // this.tableLoading = true
      // var obj = {}
      // if (payload !== undefined) {
      //   obj = {
      //     projectName: payload.name
      //   }
      // }
      // projectApi
      //   .getProject({
      //     current: this.page.currentPage,
      //     size: this.page.pageSize,
      //     ...obj
      //   })
      //   .then(({ data }) => {
      //     const payload = data.data.projectInfoPage
      //     this.tableData = payload.records
      //     this.page.total = payload.total
      //     this.tableLoading = false
      //   })
    },
    searchReset() {
      this.searchForm = {}
    },
    sampling(payload) {
      this.dialogFormVisible = true
      console.log(payload)
      this.form['partitionDay'] = payload.partitionDay
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
            type: 1,
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
            console.log(data, 'dfadfsa')
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
    getOriSignName(query) {
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
            type: 2,
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
            console.log(data, 'dfadfsa')
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
    handleList(startTime, endTime) {
      console.log(
        this.searchForm.signCategorys,
        'this.searchForm.signCategorys'
      )
      this.tableLoading = true
      var data = {
        endTime: endTime,
        startTime: startTime,
        projectId: this.projectId,
        signName: this.searchForm.signName.toString(),
        rawSignName: this.searchForm.rawSignName.toString(),
        signCategory: this.searchForm.signCategorys.toString()
      }
      if (this.signCategorysJudge) {
        data = {
          ...data,
          signCategory: ''
        }
      } else {
        data = {
          ...data,
          signName: ''
        }
      }
      getNumbersApi.getReportsourcet(data).then(({ data }) => {
        console.log(data)
        if (data.data == null) {
          this.tableData = []
          this.signNames = ''
          this.total = ''
          this.projectTotal = ''
        } else {
          this.tableData = data.data.list
          this.signNames = data.data.signNames
          this.page.total = data.data.total
          this.total = data.data.total
          this.projectTotal = data.data.projectTotal
        }
        this.tableLoading = false
      })
    },
    exportS(payload) {
      let data = {
        operateId: this.userInfo.userId,
        projectId: this.projectId,
        partitionDay: payload.partitionDay + ' 00:00:00',
        sampleCount: 200000,
        sampleType: '2',
        signNames: this.signNames,
        rawSignName: this.searchForm.rawSignName,
        signCategory: this.searchForm.signCategorys
      }
      if (this.signCategorysJudge) {
        data = {
          ...data,
          signCategory: []
        }
      }
      getNumbersApi
        .getSample(data)
        .then(res => {
          if (res.status == 200) {
            console.log(res, 'blob流')
            downloadBlob(res.data, getFileInfoFromHeader(res.headers))
            this.sampleLoading = false
            this.$message({
              message: '导出成功',
              type: 'success'
            })

            this.dialogFormVisible = false
          }
        })
        .catch(() => {
          // loadingInstance1.close()
          this.sampleLoading = false

          this.dialogFormVisible = false
        })

      this.form = {
        sampleCount: 2000,
        sampleType: '1'
      }
    },
    getSample() {
      this.$refs['sample'].validate(valid => {
        if (valid) {
          this.sampleLoading = true
          console.log('验证取样', this.signNames)
          let data = {
            operateId: this.userInfo.userId,
            projectId: this.projectId,
            partitionDay: this.form.partitionDay + ' 00:00:00',
            sampleCount: this.form.sampleCount || '',
            sampleType: this.form.sampleType,
            signNames: this.signNames,
            rawSignName: this.searchForm.rawSignName,
            signCategory: this.searchForm.signCategorys
          }
          if (this.signCategorysJudge) {
            data = {
              ...data,
              signCategory: []
            }
          }
          getNumbersApi
            .getSample(data)
            .then(res => {
              if (res.status == 200) {
                console.log(res, 'blob流')
                downloadBlob(res.data, getFileInfoFromHeader(res.headers))
                this.sampleLoading = false
                this.$message({
                  message: '取样成功',
                  type: 'success'
                })

                this.dialogFormVisible = false
              }
            })
            .catch(() => {
              // loadingInstance1.close()
              this.sampleLoading = false

              this.dialogFormVisible = false
            })
        } else {
          return false
        }
      })
    },
    downE(day) {
      getNumbersApi.exportSign({
        partitionDay: day,

        projectId: this.projectId
      }).then(res => {
        console.log(res)
        downloadBlob(res.data, getFileInfoFromHeader(res.headers))
      })
    },
    getSummaries(param) {
      console.log(param)
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当前项目新用户数'
          return
        }
        if (index === 1) {
          // const values = data.map(item => Number(item[column.property]))

          // sums[index] = values.reduce((prev, curr) => {
          //   const value = Number(curr)
          //   if (!isNaN(value)) {
          //     return prev + curr
          //   } else {
          //     return prev
          //   }
          // }, 0)
          sums[index] = this.total / 10000 + '  (万)'
        }
        if (index === 3) {
          sums[index] =
            '项目库合计  ' + this.projectTotal / 10000 + '  (万)记录'
        }
      })

      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
.form /deep/.el-input {
  width: 200px;
}
/deep/.avue-crud__pagination {
  display: none;
}

/deep/.el-dialog__footer {
  text-align: center;
}
// /deep/.el-date-editor {
//   width: 100px !important;
//   input {
//     width: 100px !important;
//   }
// }
/deep/.el-table__footer-wrapper {
  font-weight: 700;
}
</style>
