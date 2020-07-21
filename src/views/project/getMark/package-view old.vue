<template>
  <div>
    <div style="padding:10px 0;text-align:center">
      <h2>{{ packageData.name }}</h2>
      <p style="font-size:18px;">
        <i class="el-icon-s-custom"></i>
        ({{ userNumber }}人）
      </p>
    </div>

    <el-form :model="packageData" class="package-view-form" label-width="100px">
      <el-row :gutter="5">
        <el-col :span="7">
          <el-form-item label="时间：">
            <el-tooltip v-for="item in times" :content="item.title" :key="item.value">
              <span style="margin-right:8px">
                <el-tag v-if="item.operator" size="mini">{{ item.operator }}</el-tag>
                {{ item.value }}
              </span>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="备注：" label-width="80px">{{ packageData.remark }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="事件：" label-width="80px">{{ eventName }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="是否已推送：">
            <!-- <span v-if="packageData.pushTime" style="color:#67c23a">
              <i class="el-icon-success"></i> 已推送
            </span>
            <span v-else>未推送</span>-->
            <span v-if="packageData.getNumberType !== '-1'">
              <i class="el-icon-success" style="color:#67c23a"></i> 已推送
            </span>
            <span v-else>未推送</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item
            label="签名级别："
            label-width="100px"
          >{{ packageData.signCategory?signCategoryArray:'-' }}</el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="人数限制："
          >{{ packageData.numberLimit === '' || packageData.numberLimit === null? '-' : packageData.numberLimit }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="取号状态：">
            <span v-if="packageData.getNumberType !== '-1'">
              <i class="el-icon-success" style="color:#67c23a"></i> 已取
            </span>
            <span v-else>未取</span>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="创建时间：">{{ packageData.createTime }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="签名：">{{ packageData.signName?packageData.signName:'-' }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h2>{{ tableOption.title }}</h2>

    <!-- <avue-crud
      :data="tableData"
      :option="tableOption"
      :table-loading="tableLoading"
      :page="page"
      class="package-table"
      @size-change="pageSizeChange"
      @current-change="pageChange"
    ></avue-crud> -->

    <div style="text-align:center;padding:20px 0 10px 0;">
      <el-button
        :loading="isExporting"
        type="primary"
        icon="el-icon-download"
        @click="getPackage"
      >导出</el-button>
      <el-button :loading="isDeleting" type="danger" icon="el-icon-delete" @click="deletePackage">删除</el-button>
      <el-button icon="el-icon-right" @click="closeThis">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getEvent } from '@/api/project/meta-event'
import {
  getUserIdByPackage,
  exportPackage,
  deleteById
} from '@/api/admin/audience-package'
import {
  viewTableOption as tableOption,
  viewPageOption as pageOption
} from '@/const/crud/admin/audience-package'
import { userTagLayerRule } from '@/const/project/user-tag'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import request from '@/router/axios'

export default {
  name: 'PackageView',
  props: {
    packageData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      tableOption,
      page: {
        ...pageOption
      },
      tableLoading: false,

      isExporting: false,

      isDeleting: false,

      times: [],

      eventName: '',

      cancelToken: null,

      userNumber: ''
    }
  },

  computed: {
    signCategoryArray() {
      if (this.packageData.signCategoryArray !== null) {
        var signCategoryArray = JSON.parse(
          JSON.stringify(this.packageData.signCategoryArray)
        )
        signCategoryArray.forEach((item, i) => {
          if (item == -1) {
            signCategoryArray[i] = '未定级'
          }
        })
        return signCategoryArray.toString()
      }
    }
  },

  created() {
    this.page.total = this.packageData.number
    this.page.currentPage = 1
    this.userNumber = this.packageData.number + ''

    let times = []
    const operatorMap = {
      equal: '=',
      more_than: '>',
      less_than: '<',

      more_than_or_equal: '>=',
      less_than_or_equal: '<=',
      interval: '['
    }
    const names = userTagLayerRule.DATE
    const namesMap = {}
    for (let i = 0, l = names.length; i < l; i++) {
      const item = names[i]

      namesMap[item.value] = item.name
    }

    if (
      this.packageData.partitionDayList &&
      this.packageData.partitionDayList.length
    ) {
      times = this.packageData.partitionDayList.map(item => {
        const operatorName = item.operator

        const time = {
          ...item,
          operatorName: operatorName,
          title: namesMap[operatorName] + ' ' + item.value
        }

        // 如果不是区间
        if (operatorName !== 'interval') {
          time.operator = operatorMap[operatorName]
        } else {
          // 区间是包裹内容的，不需要前面加个标识
          time.operator = null
          time.value = '[' + item.value + ']'
        }

        return time
      })
    }

    this.times = times

    this.getList()
    this.tableOption.title =
      this.getTableTitle() + ' (' + this.packageData.number + '人)'
    /** 获得事件名称 */
    this.eventName = ''

    this.getEventName()
  },

  methods: {
    pageSizeChange(size) {
      this.page.pageSize = size
      this.page.currentPage = 1
      this.getList()
    },

    pageChange(page) {
      this.page.currentPage = page
      this.getList()
    },

    getList() {
      if (this.cancelToken) {
        this.cancelToken.cancel()
      }

      this.cancelToken = request.CancelToken.source()

      this.tableLoading = true

      getUserIdByPackage(this.getQueryData(), {
        cancelToken: this.cancelToken.token
      })
        .then(({ data }) => {
          if (data.code === 0) {
            this.tableData = data.data.userIds
            this.page.total = parseInt(data.data.totalAmount, 10)
            this.userNumber = this.page.total + ''
          }

          this.tableLoading = false
        })
        .catch(e => {
          if (e.toString().indexOf('Error: Cancel') === -1) {
            this.tableLoading = false
          }
        })
    },

    getQueryData() {
      return {
        id: this.packageData.id,
        current: this.page.currentPage,
        eventId: this.packageData.eventId,
        numberLimit: this.packageData.numberLimit,
        packageType: this.packageData.packageType,
        partitionDayList: this.packageData.partitionDayList,
        projectId: this.packageData.projectId,
        signName: this.packageData.signName.split(','),
        size: this.page.pageSize
      }
    },

    getPackage() {
      this.isExporting = true

      exportPackage({
        id: this.packageData.id
      })
        .then(res => {
          downloadBlob(res.data, getFileInfoFromHeader(res.headers))

          this.isExporting = false
        })
        .catch(e => {
          this.isExporting = false
        })
    },

    deletePackage() {
      this.$confirm('是否确认删除此人群包？（已取号的包不允许删除）', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureDeletePackage()
      })
    },

    sureDeletePackage() {
      this.isDeleting = false

      deleteById({
        id: this.packageData.id
      })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })

            /** 关闭窗口 */
            this.closeThis()
            this.$emit('refresh-table')
          }

          this.isDeleting = false
        })
        .catch(e => {
          this.isDeleting = false
        })
    },

    closeThis() {
      this.$emit('close-me')
    },

    getEventName() {
      if (this.packageData.eventId) {
        getEvent({
          id: this.packageData.eventId
        }).then(({ data }) => {
          if (data.code === 0) {
            this.eventName = data.data.name
          }
        })
      } else {
        this.eventName = '-'
      }
    },
    getTableTitle() {
      const data = this.packageData
      let tableTitle
      if (data.signCategory == null || data.signCategory == '') {
        if (data.signName.split(',').length > 5) {
          tableTitle = data.signName.split(',').slice(0, 5) + '等'
        } else {
          tableTitle = data.signName
        }
      } else {
        var arr = JSON.parse(JSON.stringify(data.signCategoryArray))
        arr.forEach((item, i) => {
          if (item == -1) {
            arr[i] = '未分级'
          }
        })
        tableTitle = '级别' + arr
        tableTitle = tableTitle.split(',').join('、')
      }
      if(data.eventName!=null){
        if(!tableTitle){
        tableTitle=data.eventName

        }else{
        tableTitle=tableTitle+'-'+data.eventName

        }
      }

      return tableTitle
    }
  }
}
</script>

<style type="scss">
.package-view-form .el-form-item__label {
  font-weight: bold;
  color: #999;
}
</style>
