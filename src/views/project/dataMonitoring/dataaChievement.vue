<template>
  <div>
    <basic-container>
      <div class="header">
        当前数据统计时间 <b> {{ currentTime }}</b>
      </div>
      <h2>数据成果概览：</h2>

      <el-card v-loading="chartLoading" :style="cardStyle">
        <div class="card picFlex">
          <el-row style="width:100%;height:500px">
            <el-col :span="8" style="height:500px">
              <v-chart :options="pancakeAchievement"> </v-chart>
            </el-col>
            <el-col :span="16" style="height:500px">
              <el-radio-group v-model="radio" @change="radioChange">
                <el-radio label="1">按月</el-radio>
                <el-radio label="2">按日</el-radio>
              </el-radio-group>
              <div>
                <v-chart
                  :options="barAchievement"
                  style="height:400px"
                ></v-chart>
              </div>
            </el-col>
          </el-row>
          <el-row style="width:100%;height:600px">
            <el-col :span="10" style="height:600px">
              <h3>
                人群包记录
                <span style="font-size:14px;margin-left:20px;fontWeight:400">
                  人群包总数: {{ viewData.totalNumber }}个</span
                >
              </h3>
              <h4 style="fontWeight:400;margin-top:7px">人群包取号TOP10</h4>
              <div style="padding-right:10px">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column type="index" width="50"> </el-table-column>
                  <el-table-column prop="projectName" label="项目名称">
                  </el-table-column>
                  <el-table-column prop="packageNumber" label="人群包数量">
                  </el-table-column>
                  <el-table-column prop="userNumber" label="用户数">
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="14" style="height:600px">
              <h3>投放记录</h3>
              <el-radio-group v-model="radio2" @change="radioChange2">
                <el-radio label="1">按月</el-radio>
                <el-radio label="2">按日</el-radio>
              </el-radio-group>
              <v-chart :options="pileBar" ref="pileBar"> </v-chart>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </basic-container>
  </div>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/funnel' //折线
import 'echarts/lib/chart/bar' //柱状
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend' //图例
import 'echarts/lib/component/title' //标题
import 'echarts/lib/component/tooltip' //信息提示
import 'echarts/lib/component/polar'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legendScroll'
import * as dataOverViewApi from '@/api/project/dataOverView'

export default {
  components: {
    'v-chart': ECharts
  },
  created() {
    dataOverViewApi.getDataOverview({}).then(({ data }) => {
      console.log(data)
      this.currentTime = data.data.updateTime
    })
    this.chartLoading = true
    this.setData()
    this.$nextTick(_ => {
      document.getElementsByClassName('el-scrollbar__wrap')[3].scrollTo(0, 0)
    })
  },
  data() {
    return {
      currentTime: 'loading...',
      cardStyle: {
        height: '400px'
      },
      pancakeAchievement: {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b}: {c} ({d}%)'
        // },
        // legend: {
        //   orient: 'vertical',
        //   left: 10,
        //   data: [
        //     'IMEI 3134万+',
        //     'Number 1547万+',
        //     '搜索引擎'
        //   ]
        // },
        title: {
          text: '查询记录：',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: 'IMEI 3134万+', selected: true },
              { value: 679, name: 'Number 1547万+' }
            ]
          }
        ]
      },
      barAchievement: {
        legend: {
          data: ['Imei', 'Number'],
          type: 'scroll',
          right:-4,
          top: 10,
          orient: 'vertical'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: a => {
            var str = a[0].name + '<br>'
            a.forEach(ele => {
              str +=
                ele.marker +
                ele.seriesName +
                ': ' +
                this.changeUnit(ele.value) +
                '<br>'
            })
            return str
          }
        },
        xAxis: {
          data: [
            '2019-1',
            '2019-2',
            '2019-3',
            '2019-4',
            '2019-5',
            '2019-6',
            '2019-7',
            '2019-8'
          ],
          axisLabel: {
            textStyle: {
              color: '#000'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          type: 'category'
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            // For shadow
            // type: 'bar',
            // itemStyle: {
            //   color: 'rgba(0,0,0,0.05)'
            // },
            // barGap: '-100%',
            // barCategoryGap: '40%',
            // data: [],
            // animation: false
            name: 'Imei',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            name: 'Number',
            type: 'bar',
            stack: '总量',
            // itemStyle: {
            //   color: '#83bff6'
            // },
            // emphasis: {
            //   itemStyle: {
            //     color: '#2378f7'
            //   }
            // },
            data: [10000, 10000, 20000, 30000, 41000, 50000, 60000, 81000]
          }
        ]
      },
      radio: '1',
      radio2: '1',
      chartLoading: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      pileBar: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: a => {
            var str = a[0].name + '<br>'
            a.forEach(ele => {
              str +=
                ele.marker +
                ele.seriesName +
                ': ' +
                this.changeUnit(ele.value) +
                '<br>'
            })
            return str
          }
        },
        legend: {
          data: [],
          type: 'scroll',
          right: 0,
          top: 30,
          bottom:110,
          orient: 'vertical'
        },
        grid: {
          left: '3%',
          right: '20%',
          bottom: '20%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          z: 50,

          data: []
        },
        series: []
      },
      viewData: []
    }
  },
  methods: {
    radioChange(value) {
      if (value == '1') {
        this.barAchievement.xAxis.data = []
        this.barAchievement.series[0].data = []
        this.barAchievement.series[1].data = []
        this.viewData.dataResultMonthList.forEach((item, index) => {
          this.barAchievement.xAxis.data.push(item.recordDay)
          this.barAchievement.series[0].data.push(item.itemList[0].imeiTotal)
          this.barAchievement.series[1].data.push(item.itemList[0].mobileTotal)
        })
      } else {
        this.barAchievement.xAxis.data = []
        this.barAchievement.series[0].data = []
        this.barAchievement.series[1].data = []
        this.viewData.dataResultDayList.forEach((item, index) => {
          this.barAchievement.xAxis.data.push(item.recordDay)
          this.barAchievement.series[0].data.push(item.itemList[0].imeiTotal)
          this.barAchievement.series[1].data.push(item.itemList[0].mobileTotal)
        })
      }
    },
    radioChange2(value) {
      if (value == '1') {
        if (this.viewData.putRecordMonthList.length != 0) {
          this.pileBar.legend.data = []
          this.pileBar.xAxis.data = []
          this.viewData.putRecordMonthList.forEach(ccc => {
            this.pileBar.xAxis.data.push(ccc.putTime)
          })
          console.log(1)
          this.pileBar.series = this.viewData.industrySet
           .map(item => {
              this.pileBar.legend.data.push(item)

              return {
                name: item,
                type: 'bar',
                stack: '总量',
                label: {
                  show: false,
                  position: 'insideRight'
                },
                data: []
              }
            })
          console.log(2)
          console.log(this.pileBar.series)

          this.pileBar.series.forEach(aaa => {
            this.viewData.putRecordMonthList.forEach(item => {
              if (item.list) {
                item.list.forEach(bbb => {
                  if (aaa.name == bbb.industryName) {
                    aaa.data.push(bbb.number)
                  }
                })
              } else {
                aaa.data.push(0)
              }
            })
          })
          console.log(3)
          console.log('ddddd=====', this.pileBar.series)
        }
          this.$refs[`pileBar`].mergeOptions(this.pileBar, true)

      } else {
        if (this.viewData.putRecordDayList.length != 0) {
          this.pileBar.legend.data = []
          this.pileBar.xAxis.data = []
          this.pileBar.series = []
          this.viewData.putRecordDayList.forEach(ccc => {
            this.pileBar.xAxis.data.push(ccc.putTime)
          })

          this.pileBar.series = this.viewData.industrySet
            .map(item => {
              this.pileBar.legend.data.push(item)

              return {
                name: item,
                type: 'bar',
                stack: '总量',
                label: {
                  show: false,
                  position: 'insideRight'
                },
                data: []
              }
            })
          console.log('ddddd=====', this.pileBar.legend.data)
          this.pileBar.series.forEach(aaa => {
            this.viewData.putRecordDayList.forEach(item => {
              if (item.list) {
                item.list.forEach(bbb => {
                  if (aaa.name == bbb.industryName) {
                    aaa.data.push(bbb.number)
                  }
                })
              } else {
                aaa.data.push(0)
              }
            })
          })
          console.log('ddddd=====', this.pileBar.series)
          // this.$nextTick(_ => {
          this.$refs[`pileBar`].mergeOptions(this.pileBar, true)
          // })
        }
      }
    },
    changeUnit(value) {
      if (value > 100000000) {
        return (value / 100000000).toFixed(1) + '亿+'
      } else if (value > 10000) {
        return (value / 10000).toFixed(1) + '万+'
      } else if (value > 1000) {
        return (value / 1000).toFixed(1) + 'k+'
      } else {
        return value
      }
    },
    setData() {
      dataOverViewApi.getDataResult().then(({ data }) => {
        this.chartLoading = false
        this.cardStyle = {}

        console.log(data)
        this.viewData = data.data
        this.pancakeAchievement.series[0].data[0].name =
          'IMEI ' + this.changeUnit(this.viewData.fullImeiTotal)
        this.pancakeAchievement.series[0].data[0].value = this.viewData.fullImeiTotal
        this.pancakeAchievement.series[0].data[1].name =
          'NUMBER ' + this.changeUnit(this.viewData.fullNumberTotal)
        this.pancakeAchievement.series[0].data[1].value = this.viewData.fullNumberTotal
if(this.viewData.fullImeiTotal/this.viewData.fullNumberTotal>1000){
        this.pancakeAchievement.series[0].data[1].value=this.viewData.fullImeiTotal/10
      }
      if(this.viewData.fullNumberTotal/this.viewData.fullImeiTotal>1000){
        this.pancakeAchievement.series[0].data[0].value=this.viewData.fullNumberTotal/10
      }

        this.tableData = this.viewData.audiencePackageStatisticsList

        this.barAchievement.xAxis.data = []
        this.barAchievement.series[0].data = []
        this.barAchievement.series[1].data = []

        this.viewData.dataResultMonthList.forEach((item, index) => {
          this.barAchievement.xAxis.data.push(item.recordDay)
          this.barAchievement.series[0].data.push(item.itemList[0].imeiTotal)
          this.barAchievement.series[1].data.push(item.itemList[0].mobileTotal)

          
        })
        if (this.viewData.putRecordMonthList.length != 0) {
            this.pileBar.legend.data = []
            this.pileBar.xAxis.data = []
            this.viewData.putRecordMonthList.forEach(ccc => {
              this.pileBar.xAxis.data.push(ccc.putTime)
            })
            // this.pileBar.series = this.viewData.putRecordMonthList
            //   .filter(ant => ant.list != null)[0]
            //   .list.map(item => {
            //     this.pileBar.legend.data.push(item.industryName)

            //     return {
            //       name: item.industryName,
            //       type: 'bar',
            //       stack: '总量',
            //       label: {
            //         show: false,
            //         position: 'insideRight'
            //       },
            //       data: []
            //     }
            //   })
            console.log(this.viewData.industrySet)
            this.pileBar.series = this.viewData.industrySet.map(item => {
              this.pileBar.legend.data.push(item)

              return {
                name: item,
                type: 'bar',
                stack: '总量',
                label: {
                  show: false,
                  position: 'insideRight'
                },
                data: []
              }
            })
            console.log(this.pileBar.series)

            this.pileBar.series.forEach(aaa => {
              this.viewData.putRecordMonthList.forEach(item => {
                if (item.list) {
                
                  item.list.forEach(bbb => {
                    if (aaa.name == bbb.industryName) {
                      aaa.data.push(bbb.number)
                    }
                    
                  })
                 
                } else {
                  aaa.data.push(0)
                }
              })
            })
          }
      })
    }
  }
}
</script>
<style lang="scss">
.header {
  text-align: right;
}
.card {
  width: 100%;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
