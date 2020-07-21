<template>
  <div>
    <basic-container>
      <div class="header">当前数据统计时间 <b>{{ dataPort.updateTime }}</b></div>
      <h2 id="sj">数据港概览：</h2>
      <el-card class="card"  :style="cardStyle" v-loading="chartLoading" >
        <h3>加工数据：</h3>
        <el-form label-position="right" label-width="auto">
           <el-row >
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
                1387个
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="记录数：">
                1387个
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="签名数：">
                1387个
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="本月新到签名数：">
                1387个
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
        <h3>
          数据入库统计：
          <el-radio-group v-model="radio" @change="radioChange">
            <el-radio label="1">按月</el-radio>
            <el-radio label="2">按日</el-radio>
          </el-radio-group>
        </h3>
        <div  style="width:100%;height:500px">
          <v-chart
            :options="chartOption"
            ref="vChart"
            v-if="!chartLoading"
          />
        </div>
        <h3>
          签名入库统计：
          <span style="font-size:14px">
            签名数: <span style="font-weight:300">                {{ dataPort.signNumber }}个
</span>
          </span>
          <span style="font-size:14px;margin-left:30px"
            >本月新到签名数: <span style="font-weight:300">
                {{ dataPort.currentMonthNewSignNumber }}个
              
              </span></span
          >
        </h3>
        <div style="height:500px;width:600px">
        <v-chart ref="pancakePlant" :options="pancakePlant" v-if="!chartLoading"/>
          
        </div>
      </el-card>
    </basic-container>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/funnel' //折线
import 'echarts/lib/chart/line' //折线
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
         this.chartLoading=true

    dataOverViewApi.getDataPort().then(({ data }) => {
      console.log(data)

      this.dataPort = data.data
      this.changeLineMonth()
      this.pancakePlant.legend.data = data.data.industryDistribution.map(
        item => {
          return {
            name: item.industry_name,
           
          }
        }
      )
      this.pancakePlant.series[0].data=data.data.industryDistribution.map(
        item => {
          return {
            name: item.industry_name,
            value:item.number
          }
        }
      )
      console.log(this.pancakePlant.legend)
    this.chartLoading=false

      this.$nextTick(_ => {
        this.$refs[`vChart`].resize()
        this.$refs[`pancakePlant`].resize()
      })
    this.cardStyle={}

    })
  },
  mounted() {
    // document.getElementsByClassName("el-card__body")[0].scrollIntoView();
    this.$nextTick(_=>{
    document.getElementsByClassName("el-scrollbar__wrap")[3].scrollTo(0,0)
      
    })
    //  document.getElementsByClassName("el-card")[0].scrollIntoView();
     console.log(document.getElementsByClassName("el-scrollbar")[3],'getElementsByClassName')
    // document.getElementsByClassName("el-card")[0].scrollTo(0,0);
  },
  data() {
    return {
       cardStyle:{
        height:'400px'
      },
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          },
formatter: (a)=>{
  
             return a[0].name+'<br>'+a[0].marker+a[0].seriesName+': '+this.changeUnit(a[0].value)
           }
        },
        legend: {
          data: ['源数据']
          // data: ['源数据','加工数据']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['一月', '二月', '三月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '源数据',
            type: 'line',

            data: [0, 0, 0],
            itemStyle: {}
          }
          // {
          //   name: '加工数据',
          //   type: 'line',
          //   data: [90, 280, 360],

          //   itemStyle: {}
          // }
        ]
      },
      pancakePlant: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 100,
          bottom: 20,
          data: [
            
          ]
          // selectedMode:false,
        },
        series: [
          {
            name: '行业',
            type: 'pie',
            radius: '55%',
             label: {
               show:false,
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            center: ['40%', '50%'],
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
      radio: '1',
      chartLoading: false,
      dataPort: {
        currentMonthNewSignNumber: 0,
        fileNumber: 0,
        signNumber: 0,
        total: 0,
      updateTime: 'loading...',

      }
    }
  },
  methods: {
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
    radioChange(value) {
      if (value == '1') {
        this.changeLineMonth()
      } else {
        this.changeLineDay()
      }
      console.log(this.chartOption.series[0].data)
    },
    changeLineMonth() {
      this.chartOption.xAxis[0].data = []
      this.chartOption.series[0].data = []
      this.dataPort.monthList.forEach(item => {
        this.chartOption.xAxis[0].data.push(item.recordDay)
        this.chartOption.series[0].data.push(item.total)
      })
    },
    changeLineDay() {
      this.chartOption.xAxis[0].data = []
      this.chartOption.series[0].data = []
      this.dataPort.dayList.forEach(item => {
        this.chartOption.xAxis[0].data.push(item.recordDay)
        this.chartOption.series[0].data.push(item['total'])
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  text-align: right;
}
.card {
  margin: 10px 0 15px 0;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
