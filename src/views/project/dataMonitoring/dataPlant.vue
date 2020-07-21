<template>
  <div>
    <basic-container>
      <div class="header">当前数据统计时间 <b> {{ updateTime }}</b></div>
      <h2>数据工厂概览：</h2>
      <el-tabs type="border-card"  v-model="activeName" style="margin-top:10px;min-height:300px" v-loading="tabLoading">
         <el-tab-pane lazy v-for="(item, index) in list" :key="index" :label="item.projectName" :name="index.toString()" >
          <dataPlantItem :viewData="item" :activeName="activeName"></dataPlantItem>
        </el-tab-pane>
        
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
import dataPlantItem from './dataPlantItem'
import { mapGetters } from 'vuex'
import * as dataOverViewApi from '@/api/project/dataOverView'

export default {
  components: {
    dataPlantItem
  },
  created() {
    
    this.tabLoading=true
     dataOverViewApi.getDataFactory().then(({data})=>{
          console.log(data)
          this.tabLoading=false
          this.list=data.data.list
          this.updateTime=data.data.updateTime
        })
  },
  mounted(){
    document.getElementsByClassName('avue-view')[0].scrollTop=0
    console.log(document.getElementsByClassName('el-scrollbar')[0]['wrap'],'avue-view')


  },
  data() {
    return {
      updateTime: 'loading...',
      list:[],
      activeName:0,
      tabLoading:false
    }
  }
}
</script>
<style lang="scss">
.header {
  text-align: right;
}
</style>
