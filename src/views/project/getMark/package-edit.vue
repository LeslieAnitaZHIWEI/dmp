<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="package-form"
      label-width="100px"
    >
      <el-form-item
        label="人群包名称"
        class="firstLine"
        style="width:500px;margin-right:20px"
        prop="name"
        :rules="nameRules"
      >
        <el-input
          placeholder="请输入人群包名称,同一项目下不允许重复"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否撞库去重" class="firstLine">
        <el-checkbox v-model="form.packageType">去重</el-checkbox>
      </el-form-item>
      <el-form-item label="人群包说明">
        <el-input
          type="textarea"
          placeholder="非必填"
          :rows="4"
          v-model="form.remark"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-checkbox v-model="form.checked">上传自定义人群包</el-checkbox>
      </el-form-item>
      <el-form-item
        label="请选择时间"
        v-if="!form.checked"
        class="timeChoose is-required"
      >
        <div
          v-for="(item, index) in form.partitionDayList"
          :key="item.id"
          style="margin-bottom:2px"
        >
          <el-form-item
            :prop="'partitionDayList.' + index + '.operator'"
            :rules="[
              {
                required: true,
                message: '请选择操作类型',
                trigger: ['blur', 'change']
              }
            ]"
            label-width="0"
            style="margin-right:10px;"
          >
            <el-select
              v-model="item.operator"
              style="width:140px"
              placeholder="请选择"
            >
              <el-option
                v-for="opt in operatorList"
                :key="opt.value"
                :label="opt.name"
                :value="opt.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="item.operator === rulesMap.RANGE.value"
            :prop="'partitionDayList.' + index + '.values'"
            :rules="[
              {
                validator: validateDateRangeInput,
                trigger: 'blur',
                operator: item.operator
              }
            ]"
            label-width="0"
          >
            <el-date-picker
              v-model="item.values"
              :default-time="defaultDateRange"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item
            v-show="item.operator !== rulesMap.RANGE.value"
            :prop="'partitionDayList.' + index + '.value'"
            :rules="[
              {
                validator: validateDateInput,
                message: '请选择时间',
                trigger: 'blur',
                operator: item.operator
              }
            ]"
            label-width="0"
          >
            <el-date-picker
              v-model="item.value"
              :default-time="defaultDate"
              :prop="'dates.' + index + '.value'"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>

          <el-button
            style="margin-left:10px;"
            type="danger"
            icon="el-icon-delete"
            v-if="index != 0"
            circle
            @click="deleteDateRow(index)"
          ></el-button>
          <el-button
            type="primary"
            style="margin-left:10px;"
            icon="el-icon-plus"
            v-if="index == 0"
            circle
            @click="addDateRow"
          ></el-button>
        </div>
      </el-form-item>
      <el-row class="timeChoose" v-if="!form.checked">
        <el-form-item label="签名查询" class="is-required">
          <el-select v-model="form.queryType" style="width:118px;">
            <el-option label="按签名名称" value="1"></el-option>
            <el-option label="按签名级别" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="signCategorysJudge"
          prop="signName"
          style="vertical-align:top"
          label-width="0"
        >
          <el-select
            v-model="form.signName"
            :loading="isGettingSign"
            :remote-method="getSignName"
            style="width:240px;"
            clearable
            filterable
            remote
            multiple
            placeholder="请输入签名"
            class="signNameInput"
            @change="signNameChange"
          >
            <!-- <el-select style="width:130px;"
                v-model="form.signName"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入签名"
                :remote-method="getSignName"
                @change="signNameChange"
            :loading="isGettingSign">-->

            <el-option
              v-for="item in signNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!signCategorysJudge"
          prop="signCategorys"
          label-width="0"
        >
          <el-select
            v-model="form.signCategorys"
            style="width:240px;"
            multiple
            filterable
            default-first-option
            placeholder="请选择签名级别"
          >
            <el-option
              v-for="item in signCategorysList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-form-item label="人数限制" prop="numberLimit" v-if="!form.checked">
        <el-input
          v-model="form.numberLimit"
          placeholder="请输入人数限制"
          style="width:190px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          v-if="form.checked"
          class="upload-demo"
          ref="uploadDemo"
          drag
          action="/dmp/audiencepackage/upload"
          :before-upload="beforeUpload"
          :http-request="uploadTxt"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :multiple="true"
          :on-remove="uploadRemove"
          :on-change="uploadProgress"
          style="float:left"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
            <br />只能上传txt文件，且不超过50m
          </div>
        </el-upload>
        <i class="el-icon-delete" @click="removeAll" style="float:left;margin-top:165px;margin-left:10px;cursor:pointer" v-if="form.checked"></i>
      </el-form-item>
      <el-form-item label="覆盖人数">
        <b>
          {{ form.numberLimit ? form.numberLimit + '/' : '' }}
          {{ custom.total === '' ? '--人' : custom.total + '人' }}</b
        ></el-form-item
      >
    </el-form>

    <div style="padding-top:20px;text-align:center;">
      <el-button @click="getList" v-loading="searchPackageWaiting"
      :disabled="searchPackageWaiting||uploadJudge"
        >查询</el-button
      >

      <el-button
        :disabled="custom.total == ''"
        :loading="isGetingName"
        type="primary"
        @click="createPackageName"
        >保存人群包</el-button
      >
      <el-button icon="el-icon-right" @click="closeThis">返回</el-button>
    </div>
  </div>
</template>

<script>
import {
  getUserIdList,
  createPackageName,
  createPackage,
  getSignRank,
  uploadTxt
} from '@/api/admin/audience-package'
import { getEventListByTypeId } from '@/api/project/meta-event'
import { getTypeListByProjectId } from '@/api/project/meta-event'
import { getSignSearch } from '@/api/project/industry-sign'
import { userTagLayerRule, rulesMap } from '@/const/project/user-tag'
import {
  viewTableOption as tableOption,
  viewPageOption as pageOption,
  packageType,
  packageTypeList
} from '@/const/crud/admin/audience-package'

import { validatenull } from '@/util/validate'
import { getDayEnd, getDayStart, getLastYearTime } from '@/util/date'
import request from '@/router/axios'
import { mapGetters } from 'vuex'

export default {
  name: 'PackageEdit',
  props: {
    parentData: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    'close-me': {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const endTime = new Date(Date.now() - 3600 * 1000 * 24 * 1)
    const startTime = new Date(Date.now() - 3600 * 1000 * 24 * 8)
    const valideSignName = (rule, value, callback) => {
      /** 如果是普通模式，必须选 */

      if (value === '') {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }

    const valideNumberLimit = (rule, value, callback) => {
      if (value !== '' && !/^[1-9]\d*$/.test(value)) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const valideNumberLimit2 = (rule, value, callback) => {
      if (this.custom.total) {
        if (value > this.custom.total) {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        signCategorys: []
      },
      defaultDateRange: [getDayStart(startTime), getDayEnd(endTime)],
      defaultDate: getDayEnd(endTime),
      rules: {
        signName: [
          /** 当为普通类型时，就是必选的 */
          { validator: valideSignName, message: '请输入签名', trigger: 'blur' }
        ],
        signCategorys: [
          {
            required: true,
            type: 'array',
            message: '请选择签名级别',
            trigger: ['blur']
          }
        ],

        numberLimit: [
          {
            validator: valideNumberLimit,
            message: '人数限制必须为整数',
            trigger: 'blur'
          },
          {
            validator: valideNumberLimit2,
            message: '人数不得大于覆盖人数',
            trigger: 'blur'
          }
        ]
      },
      signCategorysJudge: true,
      signCategorysList: [],
      isSearched: false,
      isGetingName: false,
      operatorList: userTagLayerRule.DATE.filter(item => {
        return item.value !== 'not_equal'
      }),
      rulesMap,
      signNameList: [],
      isGettingSign: false,
      custom: {
        fileUrl: [],
        total: ''
      },
      searchPackageWaiting: false,
      nameRules: [],
      nameList:[],
      uploadJudge:false,
      urlList:[],
      failList:[],
      cishu:0,
      successcishu:0,
      errorcishu:0
    }
  },

  computed: {
    ...mapGetters(['projectId', 'projectInfo'])
  },
  watch: {
    form: {
      handler(val) {
        if (val.queryType == '1') {
          this.$refs['form'].clearValidate('signCategorys')
          this.signCategorysJudge = true
        } else {
          this.$refs['form'].clearValidate('signName')

          this.signCategorysJudge = false
        }
        if (val.queryType == '2' && this.signCategorysList.length == 0) {
          console.log(val, 'form')
          console.log(this.form.signCategorys, 'signCategorys')
          getSignRank({
            projectId: this.projectId
          })
            .then(({ data }) => {
              this.signCategorysList = data.data.map(item => ({
                label: item,
                value: item
              }))
            })
            .then(() => {
              this.signCategorysList.forEach(item => {
                if (item.label == -1) {
                  item.label = '未定级'
                }
              })
            })
        }
      },
      deep: true
    },
    'form.packageType': {
      handler(val,oldvalue) {
        console.log(val,oldvalue,'旧的和新的')
        // if (val == false&&val!=oldvalue) {
        //   this.$confirm('是否确定不去重?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   })
        //     .then(() => {})
        //     .catch(() => {
        //       this.form.packageType = true
        //     })
        // }
      },
      deep: true
    },
    'form.partitionDayList': {
      handler(val) {
        this.form.queryType = '2'
        this.form.signName = ''
        this.form.signCategorys = ''
        this.form.numberLimit = ''
        this.custom.total = ''
        this.$refs['form'].clearValidate('numberLimit')
      },
      deep: true
    },
    'form.queryType': {
      handler(val) {
        this.form.signName = ''
        this.form.signCategorys = ''
        this.form.numberLimit = ''
        this.custom.total = ''
        this.$refs['form'].clearValidate('numberLimit')
      },
      deep: true
    },
    'form.signCategorys': {
      handler(val) {
        this.form.numberLimit = ''
        this.custom.total = ''
        this.$refs['form'].clearValidate('numberLimit')
      },
      deep: true
    },
    'form.signName': {
      handler(val) {
        this.form.numberLimit = ''
        this.custom.total = ''
        this.$refs['form'].clearValidate('numberLimit')
      },
      deep: true
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.parentData))
    console.log(this.form, 'this.form')
    if (this.form.partitionDayList.length === 0) {
      this.addDateRow()
    }
  },

  methods: {
    addDateRow() {
      this.form.partitionDayList.push({
        operator: '',
        values: '',
        value: ''
      })
    },
    deleteDateRow(index) {
      if (this.form.partitionDayList.length > 1) {
        this.form.partitionDayList.splice(index, 1)
      } else {
        this.$message({
          message: '时间至少有一组条件',
          type: 'warning'
        })
      }
    },
    createPackageName() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.isGetingName = true

          var formData = this.getFormData()
          
          formData.name = this.form.name

          
          createPackage(formData)
            .then(res => {
              const { data } = res

              if (data.code === 0) {
                this.$message({
                  message: '创建人群包成功',
                  type: 'success'
                })
                this.closeThis()

                this.$emit('refresh-table')
              }

              this.isGetingName = false
            })
            .catch(e => {
              this.isGetingName = false
            })
        }
      })
    },
    closeThis() {
      if (this.userIdCancel) {
        this.userIdCancel.cancel('一次只能有一个请求')
      }
      this.$emit('close-me')
    },
    getSignName(query) {
      /** 至少两个字才可以搜索 */
      if (query.length > 1) {
        this.isGettingSign = true
        this.signNameList = []

        if (this.signNameCancel) {
          this.signNameCancel.cancel()
        }

        const CancelToken = request.CancelToken
        this.signNameCancel = CancelToken.source()

        getSignSearch(
          {
            signName: query,
            current: 1,
            size: 100,
            projectId: this.projectId
          },
          {
            cancelToken: this.signNameCancel.token
          }
        )
          .then(res => {
            const { data } = res
            console.log(data, '签名名称')
            if (data.code === 0) {
              this.signNameList = data.data.map(item => {
                return {
                  value: item,
                  label: item
                }
              })
            }

            this.isGettingSign = false
          })
          .catch(e => {
            this.isGettingSign = false
          })
      } else {
        if (this.signNameCancel) {
          this.signNameCancel.cancel()
        }
      }
    },
    signNameChange(value) {
      /** 如果有值，则移除操作的错误提示 */
      if (value !== '') {
        this.$refs['form'].clearValidate('eventId')
      }
    },
    validateDateRangeInput(rule, value, callback) {
      /** 如果是时间范围 */
      if (rule.operator === this.rulesMap.RANGE.value) {
        /** 验证时间范围 */
        if (value === '') {
          callback(new Error('请选择时间范围'))
        } else {
          /** 最小值 */
          const minTime = getLastYearTime(value[1])
          const liteTime = new Date(value[0])

          if (liteTime < minTime) {
            callback(new Error('时间跨度不能大于1年'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },
    validateDateInput(rule, value, callback) {
      /** 如果是时间范围 */
      if (rule.operator !== this.rulesMap.RANGE.value) {
        if (value === '') {
          callback(new Error(rule.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    getFormData() {
      var data = {
        projectId: this.form.projectId,
        packageType: this.form.packageType == true ? '1' : '2',
        signName: this.form.signName,
        partitionDayList: this.form.partitionDayList.map(item => {
          if (item.operator === rulesMap.RANGE.value) {
            return {
              operator: item.operator,
              value: item.values.join(',')
            }
          } else {
            return {
              operator: item.operator,
              value: item.value
            }
          }
        }),
        queryType: this.form.queryType,
        signCategorys: this.form.signCategorys,
        numberLimit:
          this.form.numberLimit === ''
            ? ''
            : parseInt(this.form.numberLimit, 10),
        current: 1,
        size: 20,
        eventId: this.form.eventId,
        remark: this.form.remark,
        fileUrls: this.custom.fileUrl,
        total: this.custom.total
      }
      if (data.eventId != '') {
        data.queryType = 3
      }
      /** 如果是升级 */
      if (this.form.packageType === packageType.UPGRADE.value) {
        data.eventId = this.form.eventId
      }

      if (this.signCategorysJudge) {
        data = {
          ...data,
          signCategorys: []
        }
      } else {
        data = {
          ...data,
          signName: []
        }
      }
      if (this.form.checked) {
        data = {
          ...data,
          signCategorys: [],
          queryType: ''
        }
      }
      return data
    },
    getList() {
      if (this.form.checked) {
        console.log(this.urlList,'p')
        // if(this.custom.fileUrl[0].name){
        //   let arr=[]
        //   this.custom.fileUrl.forEach(item=>{
        //     arr.push(item.response.urls[0])
        //   })
        //   this.custom.fileUrl=arr
        // }
        var arr=this.urlList.map(ele=>{
          return ele.urls[0]
        })
        let formData = {
          fileUrls: arr,
          packageType: this.form.packageType == true ? '1' : '2',
          projectId: this.projectId
        }
        this.searchPackageWaiting = true

        getUserIdList(formData)
          .then(({ data }) => {
            console.log('?????', data)
            if (data.code === 0) {
              this.custom.total = parseInt(data.data.totalAmount, 10)
              this.isSearched = true
              this.custom.fileUrl=data.data.fileUrls
              this.searchPackageWaiting = false
            }
          })
          .catch(e => {
            this.searchPackageWaiting = false
          })
      } else {
        this.nameRules = []

        this.$nextTick(() => {
          this.$refs['form'].validate(valid => {
            if (valid) {
              this.searchPackageWaiting = true
              if (this.userIdCancel) {
                this.userIdCancel.cancel('一次只能有一个请求')
              }

              const CancelToken = request.CancelToken
              const source = CancelToken.source()

              this.userIdCancel = source

              /** 如果有 name 值 */
              const formDate = this.getFormData()
              delete formDate.numberLimit
              if (this.form.name !== '') {
                formDate.name = this.form.name
              }

              this.tableData = []

              getUserIdList(formDate, {
                cancelToken: source.token
              })
                .then(({ data }) => {
                  console.log('?????', data)
                  if (data.code === 0) {
                    this.custom.total = parseInt(data.data.totalAmount, 10)
                    this.isSearched = true
                    this.searchPackageWaiting = false
                  }
                  this.nameRules = [
                    {
                      required: true,
                      message: '请填写人群包名称',
                      trigger: 'blur'
                    },
                    {
                      max: 50,
                      message: '长度在 50 个字符以内',
                      trigger: ['blur', 'change']
                    }
                  ]
                })
                .catch(e => {
                  this.searchPackageWaiting = false
                })
            }
          })
        })
      }
    },
    beforeUpload(file) {
      this.files = file
      var filename = file.name
      if(this.nameList.includes(filename)){
        this.$message.warning('存在相同文件名')
        return false
      }
      var index1 = filename.lastIndexOf('.')
      var index2 = filename.length
      var extension = filename.substring(index1, index2) === '.txt'
      console.log(filename, index1, index2, filename.substring(index1, index2))
      const isLt50M = file.size / 1024 / 1024 < 50

      if (!extension) {
        this.$message.warning('上传文件只能是 txt 格式!')
        return false
      }
      if (!isLt50M) {
        this.$message.warning('上传模板大小不能超过 50MB!')

        return false
      }
      this.form.name = filename.substring(0, index1)
      this.cishu++

    },
    uploadTxt(params) {
      console.log(params, 'paramstext')
      let fileFormData = new FormData()
      fileFormData.append('files', params.file)
      this.uploadJudge=true
      uploadTxt({
        files: fileFormData,
        modelId: this.modelId,
        projectId: this.projectId
      })
        .then(({ data }) => {
          if (data.code === 0) {
        // this.custom.total=data.data.total
            params.onSuccess(data.data)
          }
          if(data.code==2){
            params.onError(data.msg)

          }

        })
        .catch(res => {
      this.$refs['uploadDemo'].clearFiles()
          
          
        })
    },
    uploadSuccess(params,file,filelist) {
      // console.log(filelist,file, 'success')
      // setTimeout(()=>{
      // this.$nextTick(()=>{
      this.successcishu++

      // })

      // },1000)
     

      this.nameList=[]
      var temp= JSON.parse(JSON.stringify(filelist))
      filelist.forEach(ele=>{
        this.nameList.push(ele.name)

      })
     var m=[]
      temp.forEach(item=>{
        m.push(item.response)
      })
      this.urlList=m
      this.nameRules = [
        {
          required: true,
          message: '请填写人群包名称',
          trigger: 'blur'
        },
        {
          max: 50,
          message: '长度在 50 个字符以内',
          trigger: ['blur', 'change']
        }
      ]
    },
    uploadError(params,file,filelist){
      // console.log('失败',file,filelist)
      this.failList.push(file.name+' '+';')
      
      // setTimeout(()=>{
      //  this.$nextTick(()=>{
      this.errorcishu++

      // })

      // },1000)


      

    },
    uploadProgress(file, fileList){
      
      if(this.cishu==this.successcishu+this.errorcishu&&this.cishu!=0){

      console.log(fileList,'eveent')
      if(this.failList.length>0&&this.cishu!=0){
        this.$message({
              message: this.failList.join('\n')+'<br>'+'数量不能低于5',
              type: 'error',
              duration:0,
              showClose:true,
              offset:100,
              dangerouslyUseHTMLString: true,
            })
           
      }
       if(fileList.length>0&&this.successcishu>0&&this.cishu!=0){
         this.$message({
              message: '上传成功',
              type: 'success'
            })
            
       }
         this.cishu=0
            this.successcishu=0
            this.errorcishu=0
      this.uploadJudge=false
      this.failList=[]
      
        
      }
    },
    clearParm() {
      this.custom = {
        fileUrl: [],
        total: ''
      }
    },
    uploadRemove(file, fileList){
      this.nameList=[]
       fileList.forEach(ele=>{
        this.nameList.push(ele.name)
      })
      if(file.response){
      this.urlList=this.urlList.filter(item=>item.urls[0]!=file.response.urls[0])

      }
      console.log(this.urlList,'移除')

    },
    removeAll(){
      this.$refs['uploadDemo'].clearFiles()
      this.nameList=[]
this.urlList=[]
    }
  }
}
</script>
<style lang="scss">
.timeChoose {
  /deep/.el-form-item {
    vertical-align: top;
    display: inline-block;
  }
}
.firstLine {
  display: inline-block;
}
.upload-demo {
  width: 360px;
}
</style>
