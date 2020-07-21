<template>
  <div>
    <basic-container>
      <el-form
        class="search-form"
        :model="searchForm"
        ref="searchForm"
        :rules="searchRules"
        label-width="100px"
      >
        <el-row :gutter="10">
          <el-col :xl="20" :md="16">
            <el-form-item label="创建时间">
              <el-date-picker
                style="width:260px"
                v-model="searchForm.dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="取号类型">
              <el-select
                v-model="searchForm.getNumberType"
                placeholder="请选择取号类型"
                clearable
              >
                <el-option label="全部" value></el-option>
                <el-option label="未取号" value="-1"></el-option>
                <el-option
                  v-for="item in numberTypeList"
                  :key="item.value"
                  :label="item.name + '已取'"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="包名称">
              <el-input
                style="width:260px"
                placeholder="包名称模糊查询"
                v-model="searchForm.name"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xl="4" :md="8">
            <el-button type="primary" icon="el-icon-search" @click="onSearch"
              >查询</el-button
            >

            <el-button icon="el-icon-plus" @click="onAddPackage"
              >添加人群包</el-button
            >
             <el-button icon="el-icon-d-arrow-right" @click="pushData"
              >推送</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <avue-crud
        ref="crud"
        :page="page"
         @selection-change="selectionChange"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="name" slot-scope="scope">
          <el-button
            :title="scope.row.name"
            type="text"
            @click="showPackageDetail(scope.row)"
            >{{ scope.row.name }}</el-button
          >
        </template>
        <template slot="packageType" slot-scope="scope">{{
          packageTypeMap[scope.row.packageType]
        }}</template>
        <template slot="getNumberType" slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.number == '-1' || scope.row.number == '-2'"
          >
            {{ '' }}
          </el-button>
          <el-button
            v-else-if="scope.row.getNumberType == '-1'"
            size="small"
            @click="onGetNumber(scope.row)"
            >取号</el-button
          >
          <span v-else-if="scope.row.getNumberType == '-3'">取号失败</span>

          <el-progress
            v-else-if="scope.row.getNumberType == '-2'"
            :text-inside="true"
            :stroke-width="26"
            :percentage="
              Number(
                (
                  (scope.row.finishNumber / scope.row.totalNumber) *
                  100
                ).toFixed(2)
              )
            "
          ></el-progress>
          <!-- <span v-else-if="scope.row.getNumberType == '-2'">已取{{(scope.row.finishNumber/scope.row.totalNumber*100).toFixed(2)+'%'}}</span> -->
          <span v-else>{{ numberTypeMap[scope.row.getNumberType] }}已取</span>
        </template>
        <template slot="updateTime" slot-scope="scope">
          {{
            scope.row.getNumberType !== '-1' && scope.row.getNumberType !== '-2'
              ? scope.row.updateTime
              : ''
          }}
        </template>
        <template slot="remark" slot-scope="scope">
          <span
            :title="scope.row.remark"
            style=" white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;"
            >{{ scope.row.remark }}</span
          >
        </template>
        <template slot="number" slot-scope="scope">
          {{ numberChange(scope.row.number) }}
        </template>
      </avue-crud>

      <el-dialog title="数据取号" :visible.sync="takeFormDialog" width="460px">
        <el-form :model="tackForm" class="form">
          <el-form-item label="包名称" label-width="100px">
            <strong>{{ tackForm.name }}</strong>
          </el-form-item>
          <el-form-item label="取号方式" label-width="100px">
            <el-select
              v-model="tackForm.getNumberType"
              placeholder="请选择取样方式"
            >
              <el-option
                v-for="item in numberTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="取号个数" label-width="100px">
            <strong>{{ tackForm.number }}</strong>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="onSureGetNumber"
            :loading="isGetingNumber"
            >确 定</el-button
          >

          <el-button @click="takeFormDialog = false">关 闭</el-button>
        </div>
      </el-dialog>

      <avue-drawer
        title="人群包"
        v-model="showEditDrawer"
        @close="closeDrawer"
        show-close
        :close-on-click-modal="false"
        width="750"
      >
        <package-edit
          ref="packageEdit"
          v-on:close-me="closePackageEdit"
          v-on:refresh-table="onSearch"
          v-bind:parentData="editData"
        ></package-edit>
      </avue-drawer>

      <avue-drawer
        title="查看人群包"
        v-model="showViewDrawer"
        show-close
        width="750"
      >
        <span v-if="showViewDrawer && isLoadingDetail"></span>
        <package-view
          v-if="showViewDrawer && !isLoadingDetail"
          v-on:close-me="closePackageView"
          v-on:refresh-table="searchList"
          v-bind:packageData="packageDataDetail"
        ></package-view>
      </avue-drawer>
     <el-dialog title="任务列表" width="68%" :visible.sync="dialogTableVisible">
  <el-table max-height="370" :data="gridData.slice((gridPagin.currentPage-1)*gridPagin.pagesize,gridPagin.currentPage*gridPagin.pagesize)">
    <el-table-column property="jobName" label="任务名称"></el-table-column>
    <el-table-column property="jobType" label="任务类型">
      <template slot-scope="scope">
        {{scope.row.jobType==1?'定时':'手动'}}
      </template>
    </el-table-column>
    <el-table-column property="startDate" label="任务开始时间"></el-table-column>
  <el-table-column property="callJobStatus" label="任务状态">
      <template slot-scope="scope">
        {{
          statusMap[scope.row.callJobStatus]
        }}
      </template>
    </el-table-column>
    <el-table-column property="remark" label="任务描述"></el-table-column>
    <el-table-column property="totalCount" label="任务拨打的号码总数"></el-table-column>
    <el-table-column property="doneCount" label="任务已完成拨打的号码总数"></el-table-column>
    <el-table-column property="calledCount" label="任务已完成呼通的号码总数"></el-table-column>
    <el-table-column property="rejectedCount" label="任务呼叫但被拒接的号码总数"></el-table-column>
    <el-table-column property="unavailableCount" label="任务呼叫无法接通的号码总数"></el-table-column>
    <el-table-column property="fromUnavailableCount" label="任务主叫号码不可用的号码总数"></el-table-column>
    <el-table-column property="callJobStatusDesc" label="任务状态描述">
      <!-- <template slot-scope="scope">
        {{
          statusMap[scope.row.callJobStatusDesc.toString()]
        }}
      </template> -->
    </el-table-column>
    <el-table-column property="oper" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="pushTask(scope.row)">推送</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  layout="prev, pager, next,sizes"
  :total="gridPagin.total"
  :page-sizes="[10, 15,50, 100]"
:page-size="gridPagin.pageSize"
  style="text-align:right;margin-top:15px"
  @current-change="handleCurrentChange"
   @size-change="handleSizeChange">
</el-pagination>
</el-dialog>
    </basic-container>
  </div>
</template>
<script>
import { getList,pushTask, getDetail, getNumberById,getTaskList } from '@/api/admin/audience-package'
import {
  tableOption,
  viewPageOption as pageOption,
  packageType,
  // packageTypeList,
  numberTypeList,
  packageTypeMap,
  numberTypeMap,
  statusMap
} from '@/const/crud/admin/audience-package'
import { nearly7DayRange } from '@/util/date'
import { validatenull } from '@/util/validate'
import PackageEdit from './package-edit.vue'
import PackageView from './package-view.vue'
import { mapGetters } from 'vuex'
import { clearInterval } from 'timers'

export default {
  name: 'AudiencePackage',
  components: {
    'package-edit': PackageEdit,
    'package-view': PackageView
  },
  data() {
    // 日期默认为近 7 天
    // const rangeDate = nearly7DayRange().map(item => {
    //   return item.substring(0, 10)
    // })

    return {
      tableData: [],

      tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1,
        pageSize: 10
      },
      tableLoading: false,
      searchForm: {
        packageType: '',
        getNumberType: '',
        name: '',
        dateRange: []
      },
      searchRules: {},
      packageType,
      numberTypeList,
      packageTypeMap,
      numberTypeMap,
      statusMap,
      takeFormDialog: false,
      tackForm: {
        id: '',
        getNumberType: '',
        number: 0
      },
      isGetingNumber: false,

      editData: null,
      showEditDrawer: false,

      showViewDrawer: false,
      isLoadingDetail: false,
      packageDataDetail: {},
      inter: null,
      count: 0,
      dialogTableVisible:false,
      gridData:[],
        selectedData:[],
        gridPagin:{
          total:0,
          pagesize:10,
          currentPage:1
        }

    }
  },
  computed: {
    ...mapGetters(['projectId']),
    numberChange: function() {
      return function(param) {
        switch (param) {
          case -1:
            return '计算中'
          case -2:
            return '计算失败'
        }
        return param
      }
    }
  },
  mounted() {
    this.onSearch()
  },
  watch: {
    tableData: {
      handler: function(newVal, oldVal) {
        console.log(newVal)
        var judge = false
        newVal.forEach(item => {
          if (item.getNumberType == -2) {
            judge = true
          }
        })
        if (judge) {
          if (this.inter) {
          } else {
            this.inter = setInterval(() => {
              this.count++

              this.onSearch()

              console.log(this.$route)
            }, 3000)
          }
        } else {
          window.clearInterval(this.inter)
          this.inter = null
        }
        //         if(newVal === '/project/getMark/audiencePackage'){
        // window.clearInterval(this.inter);
        //           this.inter=setInterval(() => {
        //     this.onSearch();
        //       console.log(this.$route)
        //     }, 10000);
        //         } else{
        // window.clearInterval(this.inter);
        //     this.inter = null;
        //         }
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {
    clearInterval(this.inter)
  },
  methods: {
    
    sizeChange(val) {
      this.page.pageSize = val
      this.searchList()
    },

    currentChange(page) {
      this.page.currentPage = page
      this.searchList()
    },

    onSearch() {
      // this.page.currentPage = 1
      this.searchList()
    },

    searchList() {
      // this.$refs['searchForm'].validate((valid) => {
      //   if(valid){
      this.getList(this.getSearchFormData())
      //   }
      // });
    },

    getList(params) {
      // this.tableLoading = true;
      // if(this.count<1){

      // this.page.total = 0
      //       }
      // this.tableData = [];

      getList(params)
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.tableData = data.data.records
            // if(this.count<1){
            this.page.total = data.data.total
            this.page.currentPage = data.data.current
            // }

            // if (data.data.length === 0 && this.page.currentPage === 1) {
            //   this.page.total = 0
            // } else {
            //   /** 如果有多的 */
            //   if (data.data.length >= this.page.pageSize) {
            //     this.page.total =
            //       this.page.pageSize * (this.page.currentPage + 1)
            //   } else {
            //     this.page.total =
            //       this.page.pageSize * (this.page.currentPage - 1) +
            //       data.data.length
            //   }
            // }
          }

          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
        })
    },

    getSearchFormData() {
      let dates = this.searchForm.dateRange

      if (validatenull(dates)) {
        dates = []
      }

      return {
        projectId: this.projectId,
        name: this.searchForm.name,
        getNumberType: this.searchForm.getNumberType,
        packageType: this.searchForm.packageType,
        startTime: dates[0],
        endTime: dates[1],
        current: this.page.currentPage,
        size: this.page.pageSize
      }
    },

    /** 当点击添加人群包时 */
    onAddPackage() {
      this.showEditDrawer = true

      this.editData = {
        eventTypeId: '',
        eventId: '',
        name: '',
        numberLimit: '',
        packageType: false /** 默认普通 */,
        partitionDayList: [
          {
            operator: '',
            value: '',
            values: ''
          }
        ],
        projectId: this.projectId,
        remark: '',
        signName: '',
        signCategorys: '',
        queryType: '2',
      }
    },
    pushData(){
       if(this.selectedData.length==0){
        this.$message.error('至少勾选一个进行推送');
        return;
       }
       if(this.selectedData.length>1){
          this.$message.error('只能勾选一个进行推送');
        return;
       }
       this.getTaskList()
      this.dialogTableVisible = true
    },
    getTaskList(){
      getTaskList({

      }).then(({data})=>{
          this.gridData=data.data.list
          this.gridPagin.total=data.data.total
       })
    },
    pushTask(arg){
      let obj={
        id:this.selectedData[0].id,
        jobId:arg.callJobId,
        jobName:arg.jobName
      }
      pushTask({
        ...obj
      }).then(({data})=>{
        if(data.code!=0){
          this.$message.warning(data.msg)
        }else{
          this.$message.success(data.msg)
        }
      })
    },
    handleCurrentChange(cur){
        console.log(cur)
        this.gridPagin.currentPage=cur
      //   getTaskList({
      //     pageNum:cur
      // }).then(({data})=>{
      //     this.gridData=data.data.list
      //     this.gridPagin.total=data.data.total
      //  })
    },
    handleSizeChange(cur){
        this.gridPagin.pagesize=cur

    },

    closePackageEdit() {
      this.showEditDrawer = false
    },

    closePackageView() {
      this.showViewDrawer = false
      this.searchList()
    },

    showPackageDetail(row) {
      this.showViewDrawer = true

      this.isLoadingDetail = true
      console.log(row)
      getDetail({
        id: row.id
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.packageDataDetail = data.data

            const partitionDayJson = this.packageDataDetail.partitionDayJson

            if (
              partitionDayJson !== '' &&
              typeof this.packageDataDetail.partitionDayJson === 'string'
            ) {
              this.packageDataDetail.partitionDayList = JSON.parse(
                partitionDayJson
              )
            }

            this.packageDataDetail.partitionDayJson = null
          }
          this.packageDataDetail.signCategoryArray = row.signCategoryArray
          this.isLoadingDetail = false
        })
        .catch(err => {
          this.isLoadingDetail = false
        })
    },

    onGetNumber(row) {
      this.takeFormDialog = true

      this.tackForm.id = row.id
      this.tackForm.name = row.name
      this.tackForm.getNumberType = this.numberTypeList[0].value
      this.tackForm.number = row.number
    },

    onSureGetNumber() {
      this.isGetingNumber = true

      setTimeout(() => {
        this.takeFormDialog = false
        this.isGetingNumber = false
        this.searchList()
      }, 1000)
      getNumberById({
        id: this.tackForm.id,
        getNumberType: this.tackForm.getNumberType
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            // this.$message({
            //   message: '取号成功',
            //   type: 'success'
            // })

            // this.takeFormDialog = false

            /** 刷新表格 */
            this.searchList()
          }

          // this.isGetingNumber = false
        })
        .catch(e => {
          // this.isGetingNumber = false
        })
    },
    closeDrawer() {
      console.log(this.$refs['packageEdit'], '999')
      this.$refs['packageEdit'].closeThis()
      this.$refs['packageEdit'].clearParm()
    },
     selectionChange(list){
      
        this.selectedData=list
      },
  }
}
</script>
<style lang="scss" scoped>
.form /deep/.el-input {
  width: 200px;
}
.search-form {
  /deep/ .el-form-item {
    display: inline-block;
  }
}
/deep/.avue-crud__tip{
  display: none;
}
// .ellipsisSpan {
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   width: 160px;
//   display: inline-block;
//   overflow: hidden;
// }
</style>
