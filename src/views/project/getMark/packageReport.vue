<template>
  <div>
    <basic-container>
      <el-row :gutter="30">
        <el-col :xl="10" :sm="10">
          <div style="padding-left:20px">
            <h3>总体投放效果</h3>
          </div>

          <div class="el-row" span="24">
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>总人数</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption1.data[0].count }}</span>
                  </div>
                </a>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>加好友人数</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption1.data[1].count }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="el-row" span="24">
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>开户人数</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption2.data[0].count }}</span>
                  </div>
                </a>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>首次充值人数</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption2.data[1].count }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="el-row" span="24">
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>首次消费人数</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption3.data[0].count }}</span>
                  </div>
                </a>
              </div>
            </div>
            <div class="el-col el-col-24 el-col-xs-12 el-col-sm-6 el-col-md-12">
              <div class="item">
                <a href="javascript:void(0);">
                  <div class="item-icon" style="color: rgb(63, 161, 255);">
                    <i></i>
                  </div>
                  <div class="item-info">
                    <span>累计消费金额</span>
                    <span
                      class="count"
                      style="color: rgb(63, 161, 255);"
                    >{{ dataTabOption3.data[1].count }}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xl="13" :offset="1" :sm="12">
          <div style="margin:0 auto;width:400px">
            <div style="padding-left:110px">基本信息更新时间：{{ basicInfoUpdateTime?basicInfoUpdateTime:'--' }}</div>
            <div style="margin-left:110px">月度消费更新时间：{{ monthlyConsumeUpdateTime?monthlyConsumeUpdateTime:'--' }}</div>
          </div>
          <v-chart :options="chartOption" style="margin:0 auto;height:300px;width:600px" />
        </el-col>
      </el-row>
      <hr />
      <el-row>
        <h3>人群包数据</h3>

        <avue-crud
          ref="recordTable"
          :page="page"
          :data="tableData"
          :table-loading="tableLoading"
          :option="tableOption"
          @current-change="currentChange"
          @size-change="handleSizeChange"
          @search-change="searchChange"
          @search-reset="searchReset"
        >
          <template slot="search">
            <el-col :xl="16" :sm="20">
              <el-form-item label="人群包名称">
                <el-input v-model="searchForm.name" placeholder="输入人群包名称模糊查询" size="small" />
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker
                  v-model="searchForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:250px!important"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="包类型">
                <el-select v-model="searchForm.packageType" placeholder="请选择">
                  <el-option label="全部" value></el-option>
                  <el-option label="普通" value="1"></el-option>
                  <el-option label="升级" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <template slot="packageName" slot-scope="scope">
            <div>
              <el-button type="text" @click="doPackageWatch(scope.row.id)">
                <span :title="scope.row.packageName">{{ scope.row.packageName }}</span>
              </el-button>
            </div>
          </template>
          <template
            slot="packageType"
            slot-scope="scope"
          >{{ packageTypeMap[scope.row.packageType] }}</template>
          <template slot="remark" slot-scope="scope">
            <div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">
              <span :title="scope.row.remark">{{ scope.row.remark }}</span>
            </div>
          </template>
          <template
            slot="totalAddFriend"
            slot-scope="scope"
          >{{ scope.row.totalAddFriend+'('+scope.row.addFriendRate+')' }}</template>
          <template
            slot="totalImportSuccess"
            slot-scope="scope"
          >{{ scope.row.totalImportSuccess+'('+scope.row.importSuccessRate+')' }}</template>

          <template
            slot="totalAccountOpen"
            slot-scope="scope"
          >{{ scope.row.totalAccountOpen+'('+scope.row.accountOpenRate+')' }}</template>
          <template
            slot="totalFirstRecharge"
            slot-scope="scope"
          >{{ scope.row.totalFirstRecharge+'('+scope.row.firstRechargedRate+')' }}</template>
          <template
            slot="totalFirstConsume"
            slot-scope="scope"
          >{{ scope.row.totalFirstConsume+'('+scope.row.firstConsumeRate+')' }}</template>
        </avue-crud>
      </el-row>
      <el-dialog title="人群包数据详情" :visible.sync="packageWatch" center width="950px">
        <packageDetail :id="packageId"></packageDetail>
        <template slot="footer">
          <div>
            <el-button @click="packageWatch = false">
              <i class="el-icon-back">返 回</i>
            </el-button>
          </div>
        </template>
      </el-dialog>
    </basic-container>
  </div>
</template>
<script>
import {
  dataTabOption1,
  dataTabOption2,
  dataTabOption3,
  tableOption,
  packageTypeMap
} from '@/const/crud/admin/packageReport'
import * as packageReportApi from '@/api/admin/packageReport'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/funnel' //折线
import 'echarts/lib/chart/bar' //柱状
import 'echarts/lib/component/legend' //图例
import 'echarts/lib/component/title' //标题
import 'echarts/lib/component/tooltip' //信息提示
import 'echarts/lib/component/polar'
import 'echarts/lib/component/markLine'
import packageDetail from './packageDetail'
import { mapGetters } from 'vuex'
export default {
  components: {
    'v-chart': ECharts,
    packageDetail
  },
  data() {
    return {
      dataTabOption1,
      dataTabOption2,
      dataTabOption3,
      packageTypeMap,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: {
        ...tableOption
      },
      searchForm: {
        packageType: '',
        dateRange: ['', ''],
        name: ''
      },
      packageWatch: false,
      packageId: '',
      basicInfoUpdateTime: '',
      monthlyConsumeUpdateTime: '',
      chartOption: {
        tooltip: {
          trigger: 'item',
          show: false,
          formatter: function(params) {
            console.log(params, '的点点滴滴')
            if (params.name) {
              return params.marker + params.name + ': ' + params.value + '%'
            }
            // return '{a} <br/>{b} : {c}%'
          }
        },
        grid: {
          x: 30,
          y: 50,
          x2: 0,
          y2: 30
        },
        // legend: {
        //   data: ['加好友率', '开户率', '首次充值率','首次消费率']
        // },
        calculable: true,
        color: [
          'rgb(194,53,49)',
          'rgb(47,69,84)',
          'rgb(97,160,168)',
          'rgb(212,130,101)'
        ],
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: '30%',
            top: '2%',
            //x2: 80,
            bottom: '10%',
            width: '50%',
            // height: {totalHeight} - y - y2,
            height: '90%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '300%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            // labelLine: {
            //   length: 10,
            //   lineStyle: {
            //     width: 1,
            //     type: 'solid'
            //   }
            // },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            // emphasis: {
            //   label: {
            //     fontSize: 20
            //   }
            // },
            markLine: {
              symbol: 'none',
              slient: true,
              label: {},
              emphasis: {
                label: {
                  show: false
                }
              },
              lineStyle: { type: 'solid' },
              data: [
                [
                  { x: '50%', y: '13%' },
                  {
                    x: '10%',
                    y: '13%',
                    value: '100%',
                    lineStyle: { color: '#999' }
                  }
                ],
                [
                  { x: '50%', y: '35%' },
                  {
                    x: '10%',
                    y: '35%',
                    value: '100%',
                    lineStyle: { color: '#999' }
                  }
                ],
                [
                  { x: '50%', y: '58%' },
                  {
                    x: '10%',
                    y: '58%',
                    value: '100%',
                    lineStyle: { color: '#999' }
                  }
                ],
                //红
                [
                  { x: '50%', y: '81%' },
                  {
                    x: '10%',
                    y: '81%',
                    value: '100%',
                    lineStyle: { color: '#999' }
                  }
                ]
              ]
            },
            data: [
              //红
              { value: 35, name: '' },
              { value: 30, name: '' },
              { value: 25, name: '' },
              { value: 20, name: '' }
            ]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  created() {
    this.getOverallDeliveryEffect()
    this.handleList()
  },
  
  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    searchChange() {
      this.handleList()
      this.getOverallDeliveryEffect()
    },
    searchReset() {
      this.searchForm = {
        packageType: '',
        dateRange: ['', ''],
        name: ''
      }
    },
    doPackageWatch(params) {
      var count = 0
      count++
      this.packageId = {
        id: params,
        count: count
      }
      this.packageWatch = true
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleList(searchPayload) {
      this.tableLoading = true
      var obj
      if (this.searchForm.dateRange !== null) {
        obj = {
          startTime: this.searchForm.dateRange[0],
          endTime: this.searchForm.dateRange[1]
        }
      } else {
        obj = {}
      }
      packageReportApi
        .getAudiencePackageData({
          current: this.page.currentPage,
          size: this.page.pageSize,

          name: this.searchForm.name || '',
          packageType: this.searchForm.packageType || '',
          projectId: this.projectId,
          ...obj
        })
        .then(({ data }) => {
          this.tableData = data.data.records
          this.tableLoading = false
          this.page.total = data.data.total
        })
    },
    getOverallDeliveryEffect() {
      packageReportApi
        .getOverallDeliveryEffect({ projectId: this.projectId })
        .then(({ data }) => {
          var reportData = data.data
          console.log(reportData,'reportData')
          this.dataTabOption1.data[0].count = reportData.totalMember
          this.dataTabOption1.data[1].count = reportData.totalAddFriend
          this.dataTabOption2.data[0].count = reportData.totalAccountOpen
          this.dataTabOption2.data[1].count = reportData.totalFirstRecharge
          this.dataTabOption3.data[0].count = reportData.totalFirstConsume
          this.dataTabOption3.data[1].count =
            reportData.totalConsumeAmount +0.0

          var array = []
          // array.push(
          //   Number(
          //     reportData.addFriendRate.substring(
          //       0,
          //       reportData.addFriendRate.length - 1
          //     )
          //   )
          // )
          // array.push(
          //   Number(
          //     reportData.accountOpenRate.substring(
          //       0,
          //       reportData.accountOpenRate.length - 1
          //     )
          //   )
          // )
          // array.push(
          //   Number(
          //     reportData.firstRechargedRate.substring(
          //       0,
          //       reportData.firstRechargedRate.length - 1
          //     )
          //   )
          // )
          // array.push(
          //   Number(
          //     reportData.firstConsumeRate.substring(
          //       0,
          //       reportData.firstConsumeRate.length - 1
          //     )
          //   )
          // )
          array.push({
            key:'addFriendRate',
            value:Number(
              reportData.addFriendRate.substring(
                0,
                reportData.addFriendRate.length - 1
              )
            )
          }
            
          )
          array.push({
            key:'accountOpenRate',
            value:Number(
              reportData.accountOpenRate.substring(
                0,
                reportData.accountOpenRate.length - 1
              )
            )
          }
            
          )
          array.push({
            key:'firstRechargedRate',
            value:Number(
              reportData.firstRechargedRate.substring(
                0,
                reportData.firstRechargedRate.length - 1
              )
            )
          }
            
          )
          array.push({
            key:'firstConsumeRate',
            value:  Number(
              reportData.firstConsumeRate.substring(
                0,
                reportData.firstConsumeRate.length - 1
              )
            )

          }
          )
          console.log(array, '排序前的array')
          for (var j = 0; j < array.length - 1; j++) {
            //两两比较，如果前一个比后一个大，则交换位置。
            for (var i = 0; i < array.length - 1 - j; i++) {
              if (array[i].value < array[i + 1].value) {
                var temp = array[i]
                array[i] = array[i + 1]
                array[i + 1] = temp
              }
            }
          }
          console.log(array, '排序后的array')
          // array = array.map(item => {
          //   return item.toFixed(2) + '%'
          // })
          console.log(array, '排序后的array')

          //加好友率
          // this.chartOption.series[0].markLine.data[0][1].value = array[0]
          this.chartOption.series[0].markLine.data[0][1].value = array[0].value.toFixed(2) + '%'
         

          //开户率
          this.chartOption.series[0].markLine.data[1][1].value = array[1].value.toFixed(2) + '%'
          // this.chartOption.series[0].markLine.data[1][1].value = array[1]
         
          //首次充值率
          this.chartOption.series[0].markLine.data[2][1].value = array[2].value.toFixed(2) + '%'
          // this.chartOption.series[0].markLine.data[2][1].value = array[2]
          
          //首次消费率
          this.chartOption.series[0].markLine.data[3][1].value = array[3].value.toFixed(2) + '%'
          // this.chartOption.series[0].markLine.data[3][1].value = array[3]
          
          var engCh = {
            addFriendRate: '加好友率',
            accountOpenRate: '开户率',
            firstConsumeRate: '首次消费率',
            firstRechargedRate: '首次充值率'
          }
          this.chartOption.series[0].data[0].name=engCh[array[0].key]
          this.chartOption.series[0].data[1].name=engCh[array[1].key]
          this.chartOption.series[0].data[2].name=engCh[array[2].key]
          this.chartOption.series[0].data[3].name=engCh[array[3].key]
          // for (let x in reportData) {
          //   console.log(reportData[x],array[0])
          //   if (reportData[x] == array[0]) {
          //     this.chartOption.series[0].data[0].name = engCh[x]
          //   }
          //   if (reportData[x] == array[1]) {
          //     this.chartOption.series[0].data[1].name = engCh[x]
          //   }
          //   if (reportData[x] == array[2]) {
          //     this.chartOption.series[0].data[2].name = engCh[x]
          //   }
          //   if (reportData[x] == array[3]) {
          //     this.chartOption.series[0].data[3].name = engCh[x]
          //   }
          // }
          console.log(this.chartOption.series[0],'this.chartOption.series[0]')
          this.monthlyConsumeUpdateTime = reportData.monthlyConsumeUpdateTime
          this.basicInfoUpdateTime = reportData.basicInfoUpdateTime
        })
    }
  }
}
</script>
 <style lang="scss" scoped>
//  .data-icons .item-info>span{
//      border:1px solid black;
//      padding:30px
//  }
/deep/.avue-crud__menu {
  display: none;
}
/deep/.item a {
  color: white;
}
/deep/.item {
  border: 1px solid #999;
  border-radius: 4px;
  height: 75px;
  display: flex;

  align-items: center;
  justify-content: center;
  width: 90%;
  margin: 10px 15px;
  /deep/.item-info > span {
    display: block;
    padding: 5px 0;
    color: #999;
    font-size: 16px;
  }
  /deep/.count {
    text-align: center;
  }
}
/deep/.el-dialog__title {
  font-weight: 700;
}
</style>
