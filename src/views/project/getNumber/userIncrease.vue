<template>
  <div class="contain">
    <!-- <basic-container style="height:100%"> -->
    <el-card style="margin-left:10px;margin-right:10px">
      <h3>新用户增长</h3>

      <el-row>
        <el-form
          ref="form"
          :rules="rules"
          :model="searchForm"
          label-width="100px"
          size="medium"
        >
          <el-col :xl="3" :xs="24">
            <el-form-item label="统计口径">
              <el-select
                v-model="searchForm.type"
                clearable
                placeholder="请选择"
              >
                <el-option label="按月" value="1"></el-option>
                <el-option label="按周" value="2"></el-option>
                <el-option label="按日" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="8" :xs="24">
            <el-form-item label="请选择时间" prop="date">
              <el-date-picker
                v-if="!weekJudge"
                v-model="searchForm.date"
                :type="dateType"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:300px"
              ></el-date-picker>
              <weekRange
                v-if="weekJudge"
                ref="weekR"
                @getWeek="getWeek"
              ></weekRange>
            </el-form-item>

            <el-button
              type="primary"
              size="medium"
              style="margin-left:10px;"
              @click="handleSearchChange"
              >查询</el-button
            >
          </el-col>

          <div class="historypeo">
            <div>
              取号历史人数/总用户数(万人) &nbsp;&nbsp;
              <b v-show="condition">加载中...</b>
              <b v-show="!condition">{{ historypeo }}/{{ totalpeo }}</b>
            </div>
          </div>
        </el-form>
      </el-row>

      <v-chart :options="chartOption" ref="echart" style="min-height:500px" />
      <!-- </basic-container> -->
    </el-card>
  </div>
</template>
<script>
Array.prototype.max = function() {
  return Math.max.apply({}, this)
}
import * as getNumbersApi from '@/api/project/getNumbers'
import { FormRuleMap } from '@/const/formValid'
import weekRange from './weekRange'
import ECharts from 'vue-echarts'
import { getDayStart, getDayEnd } from '@/util/date'
import 'echarts/lib/chart/line' //折线
import 'echarts/lib/chart/bar' //柱状
import 'echarts/lib/component/legend' //图例
import 'echarts/lib/component/title' //标题
import 'echarts/lib/component/tooltip' //信息提示
import 'echarts/lib/component/polar'
import { mapGetters } from 'vuex'
export default {
  components: {
    'v-chart': ECharts,
    weekRange
  },
  data() {
    return {
      searchForm: {
        type: '3',
        date: []
      },
      condition: true,
      options: [],
      rules: {
        date: [{ ...FormRuleMap.max29DayRange, trigger: 'change' }]
      },
      dateType: 'daterange',
      weekJudge: false,
      weekDate: [],
      monthJudge: false,
      historypeo: '',
      totalpeo: '',

      //折线图
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          },
          formatter: function(params) {
            console.log(params)
            if (params.length == 0) {
              return
            } else if (params.length == 1) {
              if (params[0].seriesType == 'line') {
                return (
                  params[0].name +
                  '<br>' +
                  params[0].marker +
                  params[0].seriesName +
                  ' ' +
                  params[0].data +
                  '%'
                )
              } else {
                return (
                  params[0].name +
                  '<br>' +
                  params[0].marker +
                  params[0].seriesName +
                  ' ' +
                  params[0].data +
                  '人'
                )
              }
            } else if (params.length == 2) {
              return (
                params[0].name +
                '<br>' +
                params[0].marker +
                params[0].seriesName +
                ' ' +
                params[0].data +
                '人<br>' +
                params[1].marker +
                params[1].seriesName +
                ' ' +
                params[1].data +
                '%'
              )
            }
          }
          // formatter: '{a0}:{c0}人<br />{a1}:{c1}%'
        },
        legend: {
          data: ['新用户增长数', '环比增长率']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          },
          {
            type: 'category',
            boundaryGap: true,
            data: (function() {
              var res = []

              return res
            })()
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '新用户增长数',
            nameTextStyle: {
              fontSize: 14,
              fontWeight: 700
            },
            max: 5,
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLabel: {
              formatter: '{value}人'
            }
          },
          {
            type: 'value',
            scale: true,
            name: '环比增长率',
            nameTextStyle: {
              fontSize: 14,
              fontWeight: 700
            },
            max: 5,
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '新用户增长数',
            type: 'bar',
            // xAxisIndex: 1,
            yAxisIndex: 0,
            data: [],
            barWidth: 30,
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: 'gba(194,53,49)',
                    fontSize: 16
                  }
                }
              }
            }
          },
          {
            name: '环比增长率',
            type: 'line',
            yAxisIndex: 1,

            data: [],
            itemStyle: {
              normal: {
                color: '#386db3', //折线点的颜色
                lineStyle: {
                  color: '#386db3' //折线的颜色
                }
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['projectId','controlDate'])
  },
  watch: {
    searchForm: {
      handler(newValue) {
        console.log(newValue)

        switch (newValue.type) {
          case '1':
            this.$refs['form'].clearValidate()
            this.dateType = 'monthrange'
            this.weekJudge = false
            this.monthJudge = true
            this.rules.date.pop()
            this.rules.date.push({
              ...FormRuleMap.maxOneYearRange,
              trigger: 'change'
            })
            break
          case '2':
            this.weekJudge = true
            this.monthJudge = false
            this.rules.date.pop()
            this.$refs['form'].clearValidate()

            // this.rules.date.push({
            //   ...FormRuleMap.maxOneMonthRange,
            //   trigger: 'change'
            // })
            break
          case '3':
            this.$refs['form'].clearValidate()

            this.dateType = 'daterange'
            this.weekJudge = false
            this.monthJudge = false
            this.rules.date.pop()
            this.rules.date.push({
              ...FormRuleMap.maxOneMonthRange,
              trigger: 'change'
            })
        }
      },
      deep: true
    }
  },
  mounted() {
    var startTime
    var endTime 
    if(this.controlDate.judge){
      startTime=new Date(this.controlDate.date+'-01')
      endTime=new Date(this.controlDate.date+'-30')
    }else{
     startTime = new Date()
     endTime = new Date()

    startTime.setDate(startTime.getDate() - 10)
    // endTime.setDate(endTime.getDate() -3);
    endTime.setDate(endTime.getDate())
    }
    this.searchForm.date.push(startTime)
    this.searchForm.date.push(endTime)
    this.handleList(getDayStart(startTime), getDayEnd(endTime))
     this.$store.dispatch('sign/controlDate',{
      judge:false,
      date:''
    })
  },

  created() {
    // axios.get('http://mockjs.com/api/gets', {}).then(({ data }) => {
    //   console.log(data.List)
    //   this.tableData = data.List
    // })
    this.getUser()
  },
  methods: {
    handleSearchChange() {
      if (this.weekJudge) {
        if (this.$refs['weekR'].checkValue()) {
          console.log('验证成功')
          var startTime
          var endTime
          if (this.weekDate) {
            console.log('searchForm')
            startTime = this.weekDate.weekOne
            endTime = this.weekDate.weekTwo
            startTime.setDate(startTime.getDate() - 1)
            endTime.setDate(endTime.getDate() + 5)
            startTime = getDayStart(startTime)
            endTime = getDayEnd(endTime)
          }

          this.handleList(startTime, endTime)
        }
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            var startTime
            var endTime
            if (this.searchForm.date) {
              console.log('searchForm')
              if (this.monthJudge) {
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
                startTime = getDayStart(new Date(this.searchForm.date[0]))
                endTime = this.searchForm.date[1]
                endTime = new Date(
                  endTime.match(reg)[1],
                  endTime.match(reg)[2],
                  0
                )
                endTime = getDayEnd(endTime)
              } else {
                startTime = getDayStart(new Date(this.searchForm.date[0]))
                endTime = getDayEnd(new Date(this.searchForm.date[1]))
              }
            }

            this.handleList(startTime, endTime)
          }
        })
      }
    },
    handleList(startTime, endTime) {
      getNumbersApi
        .getReportnewuser({
          endTime: endTime,
          projectId: this.projectId,
          startTime: startTime,
          type: this.searchForm.type || 3
        })
        .then(({ data }) => {
          console.log(data)
          if (data.data == null) {
            this.chartOption.xAxis[0].data = []
            this.chartOption.series[0].data = []
            this.chartOption.series[1].data = []
            this.chartOption.yAxis[0].max = 5
            this.chartOption.yAxis[1].max = 5
            this.chartOption.yAxis[0].name = '新用户增长数'
          } else {
            var total = 0
            this.chartOption.xAxis[0].data = data.data.map(item => {
              return item.timeScale
            })
            this.chartOption.series[0].data = data.data.map(item => {
              total += item.growthNumber

              return item.growthNumber
            })
            this.chartOption.series[1].data = data.data.map(item => {
              return item.ringGrowthRate
            })
            var $0 = this.chartOption.series[0].data.max()

            this.chartOption.yAxis[0].max = this.getMax($0)
            this.chartOption.yAxis[1].max = this.getMax(
              this.chartOption.series[1].data.max()
            )
            this.chartOption.yAxis[1].min = Math.min.apply(
              Math,
              this.chartOption.series[1].data
            )
            this.chartOption.yAxis[0].name =
              '新用户增长数 / 合计 ' + total + ' 人'
            console.log(
              this.$refs['echart'].$el.clientWidth / data.data.length / 3,
              'echartechartechart'
            )
            var barWidth =
              this.$refs['echart'].$el.clientWidth / data.data.length / 3
            this.chartOption.series[0].barWidth = barWidth
            if (this.$refs['echart'].$el.clientWidth < 1200) {
              this.chartOption.series[0].itemStyle.normal.label.textStyle.fontSize = 10
            }
          }

          console.log(this.chartOption)
        })
    },
    getMax(payload) {
      if (payload / 10000 > 1) {
        payload = Math.ceil(payload / 10000) * 10000
      } else if (payload / 1000 > 1) {
        payload = Math.ceil(payload / 1000) * 1000
      } else if (payload / 100 > 1) {
        payload = Math.ceil(payload / 100) * 100
      } else if (payload / 10 > 1) {
        payload = Math.ceil(payload / 10) * 10
      }
      return payload
    },
    getWeek(data) {
      this.weekDate = data
      console.log(this.weekDate)
    },
    getUser() {
      getNumbersApi
        .getTotalnewuser({
          projectId: this.projectId
        })
        .then(({ data }) => {
          console.log(data)
          this.condition = false
          this.historypeo = data.data.historyNum / 10000
          this.totalpeo = data.data.total / 10000
        })
    }
  }
}
</script>
<style lang="scss">
.contain {
  height: 100%;
  position: relative;
}
.echarts {
  height: 80%;
  width: 100%;
}
.el-card {
  height: 100%;
  .el-card__body {
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
/deep/.el-form-item__error {
  margin-left: 100px;
}
/deep/.el-form-item {
  display: inline-block;
  margin-bottom: 0;
}
.historypeo {
  font-size: 14px;
  position: absolute;
  right: 0;
  margin-right: 60px;
}
/deep/.el-date-editor {
  margin-right: 10px;
}
/deep/.el-range-input {
  width: 100px;
}
/deep/.el-select {
  width: 100px;
}
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: auto;
}
</style>
