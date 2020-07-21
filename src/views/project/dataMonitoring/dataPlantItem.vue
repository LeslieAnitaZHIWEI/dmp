<template>
  <div>
    <div class="card picFlex">
      <el-row style="width:100%;height:300px;margin-bottom:15px">
        <v-chart ref="chart1" :options="linePlant" />
      </el-row>
      <el-row style="width:100%;height:300px">
        <el-col :span="7" style="height:300px">
          <div style="display:flex">
            <h3>事件数据：</h3>
            <div style="lineHeight:26px">
              (事件种类：{{ viewETData.eventNumber }})
            </div>
          </div>
          <v-chart  style="height:400px" ref="pancakePlant" :options="pancakePlant" />
        </el-col>
        <el-col :span="5">
          <h4>TOP10</h4>
          <ul>
            <li v-for="(item, index) in viewETData.eventData" :key="index">
              {{ index + 1 + '、' + item['EVENT_NAME'] + ' ' + item.TOTAL }}
            </li>
          </ul>
        </el-col>
        <el-col :span="7" style="height:500px">
          <div style="display:flex">
            <h3>标签数据：</h3>
            <div style="lineHeight:26px">
              (标签种类：{{ viewETData.tagNumber }})
            </div>
          </div>

          <v-chart style="height:400px" ref="pancakeTag" :options="pancakeTag" />
        </el-col>
        <el-col :span="5">
          <h4>TOP10</h4>
          <ul>
            <li v-for="(item, index) in viewETData.tagData" :key="index">
              {{ index + 1 + '、' + item['TAG_NAME'] + ' ' + item.TOTAL }}
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
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
  created() {
    console.log(this.viewData)
    this.linePlant.series[0].data = []
    this.linePlant.series[0].data.push(this.viewData.sourceNumber)
    this.linePlant.series[0].data.push(this.viewData.newUserNumber)
    this.linePlant.series[0].data.push(this.viewData.signNumber)
    dataOverViewApi
      .getEventDataAndTagData({
        projectId: this.viewData.projectId
      })
      .then(({ data }) => {
        console.log(data, 'd')
        this.viewETData = data.data

        this.pancakePlant.legend.data = this.viewETData.eventData.map(item => {
          console.log(item)
          return {
            name: item['EVENT_NAME'],
            textStyle: {
              color: 'black'
            }
          }
        })

        this.pancakePlant.series[0].data = this.viewETData.eventData.map(
          item => ({
            name: item['EVENT_NAME'],

            value: item.TOTAL
          })
        )
        this.pancakeTag.legend.data = this.viewETData.tagData.map(item => {
          console.log(item)
          return {
            name: item['TAG_NAME'],
            textStyle: {
              color: 'black'
            }
          }
        })

        this.pancakeTag.series[0].data = this.viewETData.tagData.map(
          item => ({
            name: item['TAG_NAME'],

            value: item.TOTAL
          })
        )
      })
  },
  methods:{
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
    },
  },
  props: {
    viewData: Object,
    activeName: String
  },
  watch: {
    activeName(v) {
      this.$nextTick(_ => {
        console.log('nextTick')
        this.$refs[`chart1`].resize()
        this.$refs[`pancakePlant`].resize()
        this.$refs[`pancakeTag`].resize()
      })
    }
  },
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      pancakePlant: {
        title: {
          left: 'left'
        },
        grid:{
               left: '20',
  top: '1',
  right: '20',
  bottom: '10'
                },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          type: 'plain',
          orient: 'horizontal',
          left: 20,
          top: 280,
          data: [
           
          ]
          // selectedMode:false,
        },
        series: [
          {
            name: '项目',
            type: 'pie',
            radius: '55%',
            center: ['40%', '30%'],
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
      pancakeTag: {
        title: {
          left: 'left'
        },
        grid:{
               x:25,
                    y:45,
                    x2:5,
                    y2:20,
                    borderWidth:1
                },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          type: 'plain',
          orient: 'horizontal',
          left: 20,
                    top: 280,

          data: [
            
          ],
          // selectedMode:false,
          selected: {
            
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['40%', '30%'],
          labelLine: {
                normal: {
                    show: false
                }
            },
            label: {
                normal: {
                    show: false,
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
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['记录数', '人数', '签名']
        },
        series: [
          {
            name: '',
            type: 'bar',
            data: [131744, 630230, 344567],
            barWidth: 30,
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
      viewETData: {
        eventData: [],
        tagData: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  width: 100%;
}
.echarts {
  width: 100%;
  height: 100%;
}
ul {
  padding: 25px 0px;
}
</style>
