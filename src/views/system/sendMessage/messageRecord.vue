<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @size-change="handleSizeChange"
      @current-change="currentChange"
      @search-change="handleSearchChange"
      @search-reset="clearForm"
    >
      <template slot="receiveNumber" slot-scope="scope">
        <el-button type="text" @click="queryDetails(scope.row.id)">{{
          scope.row.receiveNumber
        }}</el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="
            scope.row.taskType == 2 && scope.row.executeState != 1
              ? true
              : false
          "
          icon="el-icon-edit"
          type="text"
          size="small"
          @click="handleEdit(scope.row)"
          >编辑</el-button
        >
        <el-button
          icon="el-icon-delete"
          type="text"
          size="small"
          @click="handleDel(scope.row)"
          >刪除</el-button
        >
      </template>
      <template slot="search">
        <el-form ref="form" :model="searchForm">
          <el-col :md="14" :xl="7" :xs="24">
            <el-form-item label="发送类型">
              <el-select v-model="searchForm.taskType" clearable>
                <el-option label="立即发送" value="1"></el-option>
                <el-option label="定时发送" value="2"></el-option>
              </el-select> </el-form-item
            >&nbsp;&nbsp;
            <el-form-item label="发送时间" prop="date">
              <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </template>
    </avue-crud>
    <el-dialog
      :visible.sync="detailsVisible"
      title="短信发送详情"
      width="920px"
      @closed="closeDetail"
    >
      <messageDetails :id="taskId" :clear-form="clearForm"></messageDetails>
    </el-dialog>
    <el-dialog :visible.sync="editDetailsVisible" width="950px">
      <messageContent
        @clearFilter="clearFilter"
        @numberchange="numberchange"
        @initFilter="initFilter"
        :isOpen="filterJudge"
        @showA="showA"
        :ispTypes="yys ? yys.toString() : ''"
        :citys="areaValue ? areaValue.toString() : ''"
        :fileUrl="fileUrl"
        @getUrl="getUrl"
        @getFileUrl="getFileUrl"
        :totalNumber="totalNumber"
        :checkChoose="dialogVisible"
        :from-father="childObj"
        @closeDialog="closeDialog"
        class="messageContent"
        @changeisContainIspType="changeisContainIspType"
        @changeIsContainCity="changeIsContainCity"
      />
    </el-dialog>
    <avue-drawer
      width="570"
      title="号码筛选"
      show-close
      v-model="dialogVisible"
    >
      <el-form label-width="125px">
        <el-form-item label="省份/城市：" label-width="125px">
          <el-select
            v-model="areaHave"
            style="width:100px;vertical-align: top"
            @change="changeCondition"
            placeholder="请选择"
          >
            <el-option
              v-for="item in haveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-cascader
            placeholder="支持中文/拼音搜索"
            :options="area"
            @change="changeCondition"
            :filter-method="whatDisplay"
            :props="{ multiple: true, emitPath: false }"
            v-model="areaValue"
            filterable
          ></el-cascader>
          <el-button
            size="middle"
            style="vertical-align: top;margin-left:5px"
            @click="clearCondition"
            >清除条件</el-button
          >
        </el-form-item>
        <el-form-item label="运营商：" label-width="125px">
          <el-select
            v-model="yysHave"
            placeholder="请选择"
            @change="changeCondition"
            style="width:100px;vertical-align: top;"
          >
            <el-option
              v-for="item in haveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="yys"
            @change="changeCondition"
            multiple
            placeholder="请选择"
          >
            <el-option label="移动" :value="1"> </el-option>

            <el-option label="电信" :value="2"> </el-option>
            <el-option label="联通" :value="3"> </el-option>
            <el-option label="其他" :value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他号码设置：">
          <el-checkbox v-model="filterJudge" @change="changeCondition"
            >开启过滤</el-checkbox
          >
          <span v-show="numberShow" style="color:red"
            >{{ filterNumber }}个</span
          >
        </el-form-item>
        <el-form-item label="当前号码数：">
          <span
            v-bind:class="{ 'el-icon-loading': filterLoading }"
            style="color:red"
          >
            {{ filterLoading ? '' : zhongzhuanTotal }} </span
          >个</el-form-item
        >
      </el-form>
      <div style="text-align:center">
        <el-button :loading="loading" @click="numberFilter" type="primary"
          >确定</el-button
        >
        <el-button @click="returnNumber">返回</el-button>
      </div>
    </avue-drawer>
  </basic-container>
</template>
<script>
import * as sendMessageApi from '@/api/project/sendMessage'
import { tableOption } from '@/const/crud/admin/sys-messageRecord'
import messageDetails from './messageDetails'
import messageContent from './messageContent'
import { dateFormat, getDayStart, getDayEnd } from '@/util/date'
import area from '@/util/area'
import { mapGetters } from 'vuex'

export default {
  components: {
    messageDetails,
    messageContent
  },
  computed: {
    ...mapGetters(['citys', 'isOpen', 'ispTypes', 'testPhoneList', 'textPhone'])
  },
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      clearForm: true,
      tableLoading: false,
      tableOption,
      searchForm: {},
      detailsVisible: false,
      editDetailsVisible: false,
      childObj: {},
      emitQ: 1,
      taskId: '',
      area: area.options,
      dialogVisible: false,
      areaValue: [],
      yys: [],
      filterJudge: false,
      numberPackageFileUrls: [],
      filterNumber: 0,
      numberShow: false,
      totalNumber: 0,
      fileUrl: null,
      filterLoading: false,
      zhongzhuanTotal: '-',
      filterLoading: false,
      haveOptions: [
        {
          label: '包含',
          value: 1
        },
        {
          label: '不包含',
          value: 0
        }
      ],
      areaHave: 1,
      yysHave: 1,
      loading: false
    }
  },

  created() {
    var startTime = new Date()
    var endTime = new Date()

    startTime.setDate(startTime.getDate() - 7)
    endTime.setDate(endTime.getDate())
    // this.searchForm.date.push(startTime)
    // this.searchForm.date.push(endTime)
    // this.handleList({
    //   startTime:getDayStart(new Date(dateFormat(startTime).substring(0, 10))),
    //   endTime:getDayEnd(new Date(dateFormat(endTime).substring(0, 10)))
    // })
    this.handleList({
      startTime: '',
      endTime: ''
    })
  },
  methods: {
    whatDisplay(node, value) {
      console.log(node, 'node')
      console.log(value, 'value')
      return (
        node.data.pinyin.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        node.data.label.indexOf(value) > -1 ||
        node.parent.data.pinyin.toLowerCase().indexOf(value.toLowerCase()) >
          -1 ||
        node.parent.data.label.indexOf(value) > -1
      )
    },
    showA(value) {
      console.log(value, '父组件')
      this.dialogVisible = value
    },
    getUrl(value) {
      this.numberPackageFileUrls = value
      console.log(this.numberPackageFileUrls, 'numberPackageFileUrls')
    },
    getFileUrl(value) {
      this.fileUrl = value
    },
    numberFilter() {
      console.log(this.numberPackageFileUrls, 'childObj')
      // let list=[]
      //     this.childObj.numberPackages.forEach(ele=>{
      //       list.push(ele.fileUrl)
      //     })
      this.loading = true

      sendMessageApi
        .numberFilter({
          // numberFilter:{
          citys: this.areaValue,
          ispTypes: this.yys,
          numberPackageFileUrls: this.numberPackageFileUrls,
          open: this.filterJudge,
          isContainCity: this.areaHave,
          isContainIspType: this.yysHave
          // }
        })
        .then(({ data }) => {
          this.zhongzhuanTotal = data.data.total
          console.log(this.testPhoneList, '什么手机号码')
          this.fileUrl = data.data.fileUrl

          if (this.textPhone) {
            sendMessageApi
              .getNumber({
                fileUrlList: this.numberPackageFileUrls.toString(),
                testPhoneList: this.testPhoneList
                  .split('\n')
                  .filter(function(s) {
                    return s && s.trim()
                  })
                  .join(','),
                fileUrl: data.data.fileUrl
              })
              .then(({ data }) => {
                this.totalNumber = data.data
                this.loading = false
                this.dialogVisible = false
              })
          } else {
            this.totalNumber = this.zhongzhuanTotal
            this.loading = false
            this.dialogVisible = false
          }

          // this.dialogVisible=false
        })
        .catch(res => {
          this.loading = false
        })
    },
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleSearchChange() {
      this.tableLoading = true

      var obj
      if (this.searchForm.date) {
        obj = {
          startTime: getDayStart(new Date(this.searchForm.date[0])),
          endTime: getDayEnd(new Date(this.searchForm.date[1])),
          taskType: this.searchForm.taskType
        }
      } else {
        obj = {
          startTime: '',
          endTime: '',
          taskType: this.searchForm.taskType
        }
      }
      this.handleList(obj)
    },

    handleDel(payload) {
      this.$confirm('是否确认删除?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sendMessageApi
            .deleteSmstask({
              id: payload.id
            })
            .then(({ data }) => {
              if (data.code === 0) {
                this.handleSearchChange()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleEdit(payload) {
      this.emitQ++
      this.childObj = payload
      this.childObj = {
        ...this.childObj,
        emitQ: this.emitQ
      }
      this.editDetailsVisible = true
      //   this.$store.dispatch('changeCitys', {
      //   citys: payload.citys
      // })
      //     this.$store.dispatch('changeIsOpen', {
      //   isOpen: payload.isOpen
      // })
      //     this.$store.dispatch('changeIspTypes', {
      //   ispTypes: payload.ispTypes
      // })
      this.areaValue = payload.citys
      this.yys = payload.ispTypes
      this.filterJudge = payload.isOpen
      this.fileUrl = payload.fileName
    },
    handleList(payload) {
      this.tableLoading = true

      sendMessageApi
        .getSmstaskList({
          ...payload,
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          console.log(data)

          this.tableLoading = false
          this.page.total = data.data.total
          this.tableData = data.data.records
        })
        .catch(data => {
          this.tableData = []
        })
    },

    queryDetails(payload) {
      this.taskId = payload
      this.detailsVisible = true
    },
    closeDialog() {
      this.editDetailsVisible = false
      this.handleList()
    },
    closeDetail() {
      this.clearForm = !this.clearForm
      this.taskId = ''
    },
    initFilter(value) {
      console.log(value, 'initFilter')
      this.filterJudge = value.isOpenE
      this.areaValue = value.citysE
      this.yys = value.ispTypesE
    },
    numberchange(value) {
      console.log(value, '现在的值')
      this.totalNumber = value
    },
    clearFilter() {
      this.yys = []
      this.areaValue = []
      this.filterJudge = false
      this.areaHave = 1
      ;(this.yysHave = 1), (this.fileUrl = null)
    },
    returnNumber() {
      this.dialogVisible = false
    },
    changeIsContainCity(value) {
      this.areaHave = value
    },
    changeisContainIspType(value) {
      this.yysHave = value
    },
    changeCondition() {
      this.getPhoneFillterQuery()
    },
    clearCondition() {
      this.areaValue = []
      this.changeCondition()
    },
    getPhoneFillterQuery() {
      this.filterLoading = true
      sendMessageApi
        .getPhoneFillterQuery({
          citys: this.areaValue,
          ispTypes: this.yys,
          numberPackageFileUrls: this.numberPackageFileUrls,
          open: this.filterJudge,
          isContainCity: this.areaHave,
          isContainIspType: this.yysHave
        })
        .then(({ data }) => {
          this.filterLoading = false
          console.log(data)
          this.zhongzhuanTotal = data.data.total
        })
        .catch(res => {
          this.filterLoading = false
        })
    }
  },
  watch: {
    filterJudge(value) {
      if (value) {
        this.numberShow = true
      } else {
        this.numberShow = false
      }
      this.$store.dispatch('changeIsOpen', {
        isOpen: value
      })
      sendMessageApi.initFilterPackagePage({}).then(({ data }) => {
        console.log(data)
        this.filterNumber = data.data.numberTotal
      })
    },
    areaValue(value) {
      this.$store.dispatch('changeCitys', {
        citys: value
      })
    },

    yys(value) {
      this.$store.dispatch('changeIspTypes', {
        ispTypes: value
      })
    },
    areaHave(value) {
      this.$store.dispatch('changeIsContainCity', {
        isContainCity: value
      })
    },
    yysHave(value) {
      this.$store.dispatch('changeisContainIspType', {
        isContainIspType: value
      })
    },
    dialogVisible(value) {
      if (value) {
        this.getPhoneFillterQuery()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-range-input {
  width: 100px;
}
.el-select /deep/ .el-input__inner {
  width: 120px;
}
/deep/ .el-dialog__header .el-dialog__title {
  font-weight: bold;
}
/deep/.avue-drawer__wrapper {
  z-index: 3100;
}
/deep/.avue-mask {
  z-index: 3100;
}
</style>
<style>
.el-popper {
  z-index: 3100 !important;
}
</style>
