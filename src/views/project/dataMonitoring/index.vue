<template>
  <div>
    <basic-container>
      <div class="header">当前数据统计时间：<b>{{ currentTime }}</b></div>
      <div style="height:33px">
        <h2 style="float:left">数据港概览：</h2>
        <router-link to="/project/dataMonitoring/dataPort">
          <a class="littleH">查看更多</a>
        </router-link>
      </div>
      <el-card class="card">
        <h3>加工数据：</h3>
        <el-form label-position="right" label-width="auto">
          <el-row>
            <el-col :span="6">
              <el-form-item label="文件数：">
                {{dataPort.fileNumber}}个
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="记录数：">
                                {{dataPort.total}}

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签名数：">
                 {{dataPort.signNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="本月新到签名数：">
                 {{dataPort.currentMonthNewSignNumber}}
                
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <h3>加工数据：</h3>
          <el-row>
            <el-col :span="6">
              <el-form-item label="文件数：">
                {{dataPort.fileNumber}}个
                
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="记录数：">
                                {{dataPort.total}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签名数：">
                 {{dataPort.signNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="本月新到签名数：">
                 {{dataPort.currentMonthNewSignNumber}}
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </el-card>
      <div style="height:33px">
        <h2 style="float:left">数据工厂概览：</h2>
        <router-link to="/project/dataMonitoring/dataPlant">
          <a class="littleH">查看更多</a>
        </router-link>
      </div>
      <el-card class="card picFlex">
        <el-row style="width:100%;height:400px">
          <el-col :span="12" style="height:400px">
            <v-chart
              ref="pancakePlant"
              :options="pancakePlant"
              @click="clickChart"
              @legendselected="legendselected"
              @legendselectchanged="legendselectchanged"
            />
          </el-col>
          <el-col :span="12" style="height:350px">
            <v-chart :options="linePlant" />
          </el-col>
        </el-row>
      </el-card>
      <div style="height:33px">
        <h2 style="float:left">数据成果概览：</h2>
        <router-link to="/project/dataMonitoring/dataaChievement">
          <a class="littleH">查看更多</a>
        </router-link>
      </div>
      <el-card class="card picFlex">
        <el-row style="width:100%;height:500px">
          <el-col :span="8" style="height:500px">
            <v-chart :options="pancakeAchievement"> </v-chart>
          </el-col>
          <el-col :span="16" style="height:500px">
            <v-chart :options="barAchievement"></v-chart>
          </el-col>
        </el-row>
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
import { mapGetters } from 'vuex'
import { parse } from 'path'
import * as dataOverViewApi from '@/api/project/dataOverView'
export default {
  components: {
    'v-chart': ECharts
  },
  computed: {
    ...mapGetters(['projectId']),
  },
  data() {
    return {
      currentTime: 'loading...',
      pancakePlant: {
        title: {
          text: '项目数据：',
          left: 'left'
        },
        
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 60,
          top: 60,
          bottom: 50,
         
          data: [
           
          ],
          // selectedMode:false,
          selected: {
           
          }
        },
        series: [
          {
            name: '项目',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            labelLine: {
                normal: {
                    show: false
                }
            },
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                
            },
            data: [
             
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      linePlant: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (a)=>{
          return a[0].marker+a[0].name+': '+this.changeUnit(a[0].value)
          }
        },
        // legend: {
        //   data: ['2011年', '2012年']
        // },
        grid: {
          left: '-1',
          right: '16%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['记录数', '人数']
        },
        series: [
          {
            // name: '2011年',
            type: 'bar',
            data: [0, 0],
            barWidth: 50,
            itemStyle: {
              normal: {
                
              color: '#83bff6',
                label: {
                  show: true, //开启显示
                  position: 'right', //在上方显示
                  textStyle: {
                    //数值样式
                    color: 'gba(194,53,49)',
                    fontSize: 14
                  },
                   formatter: (a)=>{
                     console.log(a)
          return this.changeUnit(a.value)
          }
                }
              }
            }
          }
        ]
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
          text: '数据成果-已查询：',
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
        title: {
          text: '   数据成果-查询趋势图：'
        },
        legend: {
          data: ['Imei', 'Number'],
          type: 'scroll',
          right: 0,
          top: 30,
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
          z: 40
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
            // data: [
              
            // ],
            // animation: false
            name: 'Imei',
            type: 'bar',
            stack: '总量',
            data: []
          },
          {
            // type: 'bar',
            // itemStyle: {
            //   normal: {
            //   color: '#83bff6',
            //     label: {
            //       show: false, //开启显示
            //       position: 'top', //在上方显示
            //       textStyle: {
            //         //数值样式
            //         color: '#83bff6',
            //         fontSize: 14
            //       },
                   
            //     }
            //   }
            // },
            
            // emphasis: {
            //   itemStyle: {
            //     color: '#2378f7'
            //   }
            // },
            // data: [10000, 10000, 20000, 30000, 41000, 50000, 60000, 81000]
             name: 'Number',
            type: 'bar',
            stack: '总量',
            data:[]
          }
        ]
      },
      dataPort:{
        currentMonthNewSignNumber: 0,
fileNumber: 0,
signNumber: 0,
total: 0
      },
      factoryDic:[]
    }
  },
  methods: {
    legendselectchanged(params, b) {
      console.log(params)
      params.selected[params.name] = true
      console.log('legendselectchanged', this.$refs['pancakePlant'])
      this.pancakePlant.legend.data.forEach(ele => {
        ele.textStyle.color = 'black'
        if (ele.name == params.name) {
          ele.textStyle.color = 'red'
        }
      })
      if (this.pancakePlant.legend.selected[params.name] == true) {
        this.$refs['pancakePlant'].dispatchAction({
          type: 'legendSelect',
          // 图例名称
          name: params.name
        })
      }
      this.factoryDic.forEach(item=>{
        if(item.projectName==params.name){
          console.log(item)
          this.changeBar(item)
        }
      })
    },
    legendselected() {
      console.log('legendselected')
    },
    clickChart(params) {
      console.log('????', params)
    },
    changeBar(obj){
      this.linePlant.title.text=obj.projectName

      this.linePlant.series[0].data[1]=obj.newUserNumber
      this.linePlant.series[0].data[0]=obj.sourceNumber
    },
    changeUnit(value){
      if(value>100000000){
        return (value/100000000).toFixed(1)+'亿+'
      }else if(value>10000){
        return (value/10000).toFixed(1)+'万+'
      }else if(value>1000){
        return (value/1000).toFixed(1)+'k+'
      }else{
        return value
      }
    }
    
  },
  created() {
    dataOverViewApi.getDataOverview({

    }).then(({data})=>{
      console.log(data)
      this.dataPort=data.data.dataPort
      this.currentTime=data.data.updateTime
      this.factoryDic=data.data.dataFactory.list
      this.pancakePlant.legend.data=data.data.dataFactory.list.map(item=>{
        this.pancakePlant.legend.selected[item.projectName]=true
        return {
        name:item.projectName,
        textStyle: {
                color: 'black'
              }
      }})
      console.log(this.projectId,'projectId')
      // this.changeBar(data.data.dataFactory.list.filter(item=>item.projectId==this.projectId)[0])
      this.changeBar(data.data.dataFactory.list[0])

      
      this.pancakePlant.series[0].data=data.data.dataFactory.list.map(item=>({
        name:item.projectName,
        value:item.sourceNumber
      }))
      
      this.pancakeAchievement.series[0].data[0].name='IMEI '+this.changeUnit(data.data.dataResult.fullImeiTotal)
      this.pancakeAchievement.series[0].data[0].value=data.data.dataResult.fullImeiTotal
       this.pancakeAchievement.series[0].data[1].name='NUMBER '+this.changeUnit(data.data.dataResult.fullNumberTotal)
      this.pancakeAchievement.series[0].data[1].value=data.data.dataResult.fullNumberTotal
      if(data.data.dataResult.fullImeiTotal/data.data.dataResult.fullNumberTotal>1000){
        this.pancakeAchievement.series[0].data[1].value=data.data.dataResult.fullImeiTotal/10
      }
      if(data.data.dataResult.fullNumberTotal/data.data.dataResult.fullImeiTotal>1000){
        this.pancakeAchievement.series[0].data[0].value=data.data.dataResult.fullNumberTotal/10
      }

      this.barAchievement.xAxis.data=[]
       this.barAchievement.series[0].data = []
        this.barAchievement.series[1].data = []
      data.data.dataResult.monthList.forEach((item,index)=>{
      this.barAchievement.xAxis.data.push(item.recordDay)
          this.barAchievement.series[0].data.push(item.itemList[0].imeiTotal)
          this.barAchievement.series[1].data.push(item.itemList[0].mobileTotal)
      })
    })
  },
}
</script>
<style lang="scss" scoped>
.header {
  text-align: right;
}
.card {
  margin: 10px 0 15px 0;
}
.picFlex /deep/.el-card__body {
  display: flex;
}
.el-col {
  margin-bottom: 0;
}
.el-form-item {
  margin-bottom: 0;
  text-align: center;
}
.echarts {
  width: 100%;
  height: 100%;
}
.littleH {
  float: right;
  line-height: 33px;
  color: blue
}
/deep/.el-form-item__label{
  font-weight: 700
}
/deep/.el-form-item__content{
  text-align: left
}
</style>
