<template>
  <div>
    <el-form ref="form" :model="form" class="package-form" label-width="100px">
      <el-row>
        <el-col :span="14" style="height:40px"
          ><el-form-item
            label="人群包名称"
            class="firstLine"
            style="width:500px;margin-right:20px"
          >
            {{ packageData.name }}
          </el-form-item></el-col
        >
        <el-col :span="10" style="height:40px"
          ><el-form-item label="是否撞库去重" class="firstLine">
            {{ packageData.packageType == '1' ? '是' : '否' }}
          </el-form-item></el-col
        >
      </el-row>

      <el-form-item label="人群包说明">
        <div
          v-html="remarkDisplay"
          style="word-break: break-all;word-wrap: break-word"
        ></div>
      </el-form-item>
      <el-form-item label="时间">
        {{ times }}
      </el-form-item>
      <el-form-item label="签名" class="timeChoose">
        {{ signs }}
        <br v-if="packageData.signCategory" />
        <span v-if="packageData.signCategory == null ? true : false">{{
          signs2
        }}</span>
      </el-form-item>

      <el-form-item label="上传信息" prop="numberLimit">
        <div>
          {{ packageData.fileUrls == null ? '--' : '' }}
          <div v-for="(item, index) in packageData.fileUrls" :key="index">
            {{ item }}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="覆盖人数" :style="'fontWeight:700'">{{
        packageData.number == -1 ? '计算中' : packageData.number + '人'
      }}</el-form-item>

      <el-form-item label="取号结果"
        >{{ packageData.number == -1 ? '--' : getNumberType }}
        <span
          v-if="packageData.getNumberType > 0"
          style="margin-left:10px;font-weight:700"
          v-bind:class="{ 'el-icon-loading': filterLoading }"
          >{{ filterLoading ? '' : getNumbertTotal }}</span
        ><span v-if="packageData.getNumberType > 0">个</span>
        <el-checkbox
          v-if="packageData.getNumberType == 1"
          style="margin-left:15px"
          v-model="resultFilter"
          >结果中筛选</el-checkbox
        ></el-form-item
      >

      <el-form-item
        label="省份/城市："
        label-width="125px"
        v-show="resultFilter"
      >
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
      <el-form-item label="运营商：" label-width="125px" v-show="resultFilter">
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
    </el-form>

    <div
      style="padding-top:20px;text-align:center;"
      v-show="packageData.getNumberType == 1 || packageData.getNumberType == 2"
    >
    <el-button
        @click="exportSecretConfirm(4)"
        type="primary"
        v-loading="secretfour"
        v-show="packageData.getNumberType != '2'"
        :disabled="
          packageData.getNumberType == '-1' || packageData.getNumberType == '-2'
        "
        >计算</el-button
      >
      <el-button
        @click="exportSecretConfirm(1)"
        type="primary"
        v-loading="secretone"
        v-show="packageData.getNumberType != '2'"
        :disabled="
          packageData.getNumberType == '-1' || packageData.getNumberType == '-2'
        "
        >导出加密json</el-button
      >
      <el-button
        @click="exportSecretConfirm(2)"
        type="primary"
        v-loading="secrettwo"
        :disabled="
          packageData.getNumberType == '-1' || packageData.getNumberType == '-2'
        "
        >导出SHA256</el-button
      >
      <el-button
        @click="exportSecretConfirm(3)"
        type="primary"
        v-loading="secretthr"
        :disabled="
          packageData.getNumberType == '-1' || packageData.getNumberType == '-2'
        "
        >导出MD5</el-button
      >
      <el-button icon="el-icon-right" @click="closeThis">关闭</el-button>
    </div>

    <div
      style="padding-top:20px;text-align:center;"
      v-show="
        packageData.getNumberType == -1 || packageData.getNumberType == -3
      "
    >
      <el-button icon="el-icon-right" @click="closeThis">关闭</el-button>
      <el-button
        type="primary"
        @click="deleteThis"
        :disabled="packageData.number == -1"
        v-loading="deletePackage"
        >删除</el-button
      >
    </div>

    <el-dialog
      title="确认"
      :visible.sync="filterDialog"
      width="30%"
      append-to-body
    >
      <span>是否确认导出结果筛选后的 {{ getNumbertTotal }} 个 ？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="filterDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportSecret">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEvent } from '@/api/project/meta-event'
import area from '@/util/area'

import {
  getUserIdByPackage,
  exportPackage,
  deleteById,
  filteraudiencepackage
} from '@/api/admin/audience-package'
import {
  viewTableOption as tableOption,
  viewPageOption as pageOption
} from '@/const/crud/admin/audience-package'
import { userTagLayerRule } from '@/const/project/user-tag'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import request from '@/router/axios'
import { mapGetters } from 'vuex'

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
      form: {},
      secretone: false,
      secrettwo: false,
      secretfour:false,
      secretthr: false,
      deletePackage: false,

      area: area.options,
      areaHave: 1,
      yysHave: 1,
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
      areaValue: [],
      yys: [],
      resultFilter: false,
      uid: null,
      getNumbertTotal: '',
      filterDialog: false,
      editType: null
    }
  },

  computed: {
    ...mapGetters(['projectId']),

    times() {
      var array = []
      if (this.packageData.partitionDayList) {
        if (this.packageData.partitionDayList[0].value) {
          this.packageData.partitionDayList.forEach(ele => {
            userTagLayerRule.DATE.forEach(item => {
              if (ele.operator == item.value) {
                if (ele.operator == 'interval') {
                  array.push(item.name + '【' + ele.value + '】' + ' ')
                } else {
                  array.push(item.name + ele.value)
                }
              }
            })
          })
          return array.join('，')
        } else {
          return '--'
        }
      } else {
        return '--'
      }
    },
    signs() {
      var arr = JSON.parse(JSON.stringify(this.packageData.signCategoryArray))
      if (arr) {
        arr.forEach((item, i) => {
          if (item == -1) {
            arr[i] = '未分级'
          }
        })
        return '级别' + arr
      } else {
        return ''
      }
    },
    signs2() {
      if (this.packageData.signName) {
        return this.packageData.signName.split(',').join('，')
      } else {
        return '--'
      }
    },
    getNumberType() {
      if (this.packageData.getNumberType == '1') {
        return 'Number'
      } else if (this.packageData.getNumberType == '2') {
        return 'IM-Android'
      } else if (this.packageData.getNumberType == '-1') {
        return '未取号'
      } else if (this.packageData.getNumberType == '-2') {
        return '取号中'
      } else if (this.packageData.getNumberType == '-3') {
        return '取号失败'
      }
    },
    remarkDisplay: function() {
      if (!this.packageData.remark) {
        return '--'
      } else {
        return this.packageData.remark.replace(/\n/g, '<br/>')
      }
    }
  },

  created() {
    console.log(this.packageData, 'packageData')
    this.getNumbertTotal = this.packageData.getNumbertTotal
  },

  methods: {
    closeThis() {
      this.$emit('close-me')
    },
    deleteThis() {
      this.$confirm('确定删除人群包?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deletePackage = true
          deleteById({
            id: this.packageData.id
          }).then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.closeThis()
              this.deletePackage = false
            }
          })
        })
        .catch(() => {})
    },
    secretLoding(type) {
      switch (type) {
        case 1:
          this.secretone = true
          break
        case 2:
          this.secrettwo = true
          break
        case 3:
          this.secretthr = true
          break
        case 4:
          this.secretfour = true
          break
          
      }
    },
    exportSecretConfirm(type) {
      this.editType = type
      if (this.resultFilter && this.uid != null) {
        this.filterDialog = true
      } else {
        this.exportSecret()
      }
    },
    exportSecret() {
      this.secretLoding(this.editType)
      if (this.cancelToken) {
        this.cancelToken.cancel('一次只能有一个请求')
      }

      const CancelToken = request.CancelToken
      const source = CancelToken.source()

      this.cancelToken = source

      exportPackage(
        {
          type: this.editType,
          id: this.packageData.id,
          uid: this.uid && this.resultFilter ? this.uid : ''
        },
        {
          cancelToken: source.token
        }
      ).then(res => {
        downloadBlob(res.data, getFileInfoFromHeader(res.headers))
        this.secretone = false
        this.secrettwo = false
        this.secretthr = false
        this.secretfour=false
        this.filterDialog = false
      }).catch(res=>{
        this.secretone = false
        this.secrettwo = false
        this.secretthr = false
        this.secretfour=false
      })
    },
    changeCondition() {
      this.filterLoading = true
      filteraudiencepackage({
        citys: this.areaValue,
        ispTypes: this.yys,

        open: true,
        isContainCity: this.areaHave,
        isContainIspType: this.yysHave,
        id: this.packageData.id,
        proId: this.projectId
      })
        .then(({ data }) => {
          this.filterLoading = false
          console.log(data)
          this.uid = data.data.uid
          this.getNumbertTotal = data.data.total
        })
        .catch(res => {
          this.filterLoading = false
        })
    },
    clearCondition() {
      this.areaValue = []
      this.changeCondition()
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label {
  font-weight: 700;
}
.package-view-form .el-form-item__label {
  font-weight: bold;
  color: #999;
}
</style>
