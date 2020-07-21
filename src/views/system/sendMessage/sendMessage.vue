<template>
  <div style="background:white;padding:15px 0;height:100%">
    <div>
      <div style="height:10px"></div>
      <el-row type="flex" justify="center">
        <el-col :xl="20" :sm="20">
          <messageContent
            @numberchange="numberchange"
            @showA="showA"
            :fileUrl="fileUrl"
            @getUrl="getUrl"
            :totalNumber="totalNumber"
            :checkChoose="dialogVisible"
            class="messageContent"
        @getFileUrl="getFileUrl"

            @clearFilter="clearFilter"
          />
        </el-col>
      </el-row>
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
              :filter-method="whatDisplay"
              :props="{ multiple: true, emitPath: false }"
              @change="changeCondition"
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
              <el-option label="移动" value="1"> </el-option>

              <el-option label="电信" value="2"> </el-option>
              <el-option label="联通" value="3"> </el-option>
              <el-option label="其他" value="0"> </el-option>
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
          <el-button @click="numberFilter" :loading="loading" type="primary"
            >确定</el-button
          >
          <el-button @click="returnNumber">返回</el-button>
        </div>
      </avue-drawer>
    </div>
  </div>
</template>
<script>
import messageContent from './messageContent'
import area from '@/util/area'
import * as sendMessageApi from '@/api/project/sendMessage'
import { mapGetters } from 'vuex'

export default {
  components: {
    messageContent
  },
  data() {
    return {
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
  computed: {
    ...mapGetters(['testPhoneList', 'textPhone'])
  },
  created() {},
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
    getFileUrl(value){
          this.fileUrl = value

    },
    numberFilter() {
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
            this.zhongzhuanTotal = '-'
          }

          // this.dialogVisible=false
        })
        .catch(res => {
          this.loading = false
        })
    },
    numberchange(value) {
      this.totalNumber = value
    },
    returnNumber() {
      this.dialogVisible = false
    },
    clearFilter() {
      this.yys = []
      this.areaValue = []
      this.filterJudge = false
      this.areaHave = 1
      this.yysHave = 1
      this.fileUrl = null
    },
    changeCondition() {
      this.getPhoneFillterQuery()
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
    },
    clearCondition() {
      this.areaValue = []
      this.changeCondition()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.messageContent {
  // width: 980px;
  margin: 0 auto;
}
</style>
