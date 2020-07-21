<template>
  <div class="messcontent">
    <el-form :model="messageForm" ref="messageForm" :rules="rules">
      <el-row>
        <el-col :md="3">
          <h2>号码包选择:</h2>
        </el-col>
        <el-col :xl="8" :sm="8">
          <el-form-item prop="numberPackage">
            <el-select
              :remote-method="getNumber"
              filterable
              :loading="isGettingNumber"
              multiple
              style="width:100%"
              @change="numberPackageChange"
              :disabled="isFilter || textPhone"
              remote
              v-model="messageForm.numberPackage"
              placeholder="请选择"
            >
              <el-option
                v-for="item in numberPackage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-tabs type="border-card" :value="editId != '' && projectId == '' ? 'second' : 'first'">
  <el-tab-pane label="人群包选择" name="first">
    <el-select v-model="projectId" placeholder="请选择项目" @change="getAllAudiencePackage" :disabled="loading" style="width: 150px">
    <el-option
      v-for="item in projectList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  <el-select v-model="audiencePackageId" placeholder="请选择人群包" @change="getAudiencePackageNumber" :disabled="loading" style="margin-left:5px;width: 150px">
    <el-option
      v-for="item in audiencePackageList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
  </el-tab-pane>
  <el-tab-pane label="自定义上传" name="second"> <el-upload
            class="upload-demo"
            action="#"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :disabled="loading"
          >
            {{ executeFileName }}
            <el-button slot="trigger" size="middle" type="primary" :disabled="loading">点击上传</el-button>
            <div slot="tip" style="width:">只能上传单个 txt或csv 格式文件，且不超过3m</div>
          </el-upload></el-tab-pane>
</el-tabs> -->

          <!-- <el-row style="margin:8px 0">
            <el-col>
          <span>
            已上传
            <span style="color:red" v-bind:class="{ 'el-icon-loading': loading }">{{receiveNumber}}</span> 个号码
          </span>
            </el-col>
          </el-row> -->
        </el-col>
        <el-col
          :span="12"
          style="height:54px;line-height:34px;margin-left:20px"
        >
          已选择
          <span
            style="color:red"
            v-bind:class="{ 'el-icon-loading': loading }"
            >{{ loading ? '' : totalNumber }}</span
          >
          个号码
          <el-checkbox
            style=";margin-left:20px;margin-right:5px"
            :disabled="messageForm.numberPackage.length == 0||loading"
            v-model="isFilter"
          ></el-checkbox>
          <el-button
            type="text"
            style="paddingLeft:0"
            :disabled="!isFilter"
            @click="dialogVisible = !dialogVisible"
            >号码过滤</el-button
          >
          <el-checkbox
            style=";margin-left:20px;margin-right:5px"
            v-model="textPhone"
            :disabled="messageForm.numberPackage.length == 0||loading"
          ></el-checkbox>
          <el-button
            type="text"
            style="paddingLeft:0"
            :disabled="!textPhone"
            @click="openTest"
            >同时发送验证号码</el-button
          >
        </el-col>
        <!-- <el-col :md="3" :offset="3">
          <h2>短信通道:</h2>
        </el-col>
        <el-col :md="5">
          <el-form-item prop="messagePipe">
            <el-select v-model="messageForm.messagePipe" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :md="3">
          <h2>短信通道:</h2>
        </el-col>
        <el-col :md="5">
          <el-form-item prop="messagePipe">
            <el-select v-model="messageForm.messagePipe" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="3">
          <h2>发送文本:</h2>
        </el-col>
        <el-col :md="16">
          <el-form-item prop="messageContent">
            <el-input
              type="textarea"
              v-model="messageForm.messageContent"
              :rows="8"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row> </el-row>
      <el-row>
        <el-col :md="3">
          <h2>发送方式:</h2>
        </el-col>
        <el-col :md="17">
          <el-form-item
            prop="checkedList"
            style="float:left;margin-right:20px;margin-bottom: -10px"
          >
            <el-checkbox-group
              v-model="messageForm.checkedList"
              @change="checkchange"
            >
              <el-checkbox label="immediate">立即发送</el-checkbox>
              <el-checkbox label="timing">定时发送</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="timingDate" class="timingDate">
            <el-date-picker
              v-model="messageForm.timingDate"
              v-if="timingDateJudge"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align:center">
        <el-button type="primary" @click="submitPhone">提交</el-button>
        <el-button @click="returnRecord">返回</el-button>
      </el-row>
    </el-form>
    <avue-drawer width="470" title="　" show-close v-model="dialogVisible2">
      <el-form :model="valiForm" :rules="valiRules" ref="valiForm">
        <el-form-item
          label="验证号码："
          label-width="125px"
          prop="testPhoneList"
        >
          <el-input
            type="textarea"
            :rows="30"
            v-model="valiForm.testPhoneList"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="changeTestPhoneList" type="primary">确定</el-button>
        <el-button @click="returnTestPhone">关闭</el-button>
      </div>
    </avue-drawer>
    <el-dialog
      title="确认"
      :visible.sync="confirmVis"
      width="30%"
      append-to-body
    >
      <span
        >确认内容准确无误吗？立即发送的将立即提交发送记录，定时发送的将暂存，可在短信发送记录中修改，是否确认？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVis = false">取 消</el-button>
        <el-button type="primary" @click="tttttt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import request from '@/router/axios'
import * as sendMessageApi from '@/api/project/sendMessage'
import project from '../../../store/modules/project'
import {
  getAllAudiencePackage,
  getAllProject
} from '../../../api/project/sendMessage'
var checkDATE = (rule, value, callback) => {
  if (new Date(value).valueOf() < new Date().valueOf()) {
    callback(new Error('时间不得小于当前时间'))
  } else {
    callback()
  }
}
var checkContent = (rule, value, callback) => {
  var reg = /【*】/g
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('必须附带签名 【XXX】'))
  }
}
export default {
  data() {
    var valiNumber = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        var judge = true
        value.split('\n').forEach(item => {
          console.log(item)

          if (item.length != 11 && item != '') {
            judge = false
            callback(new Error('请输入正确11位手机号码'))
          }
        })
        if (judge) {
          callback()
        }
      }
    }
    return {
      fileList: [],
      executeFileName: '',
      fileName: '',
      options: [],
      receiveNumber: 0,
      messageForm: {
        checkedList: ['immediate'],
        messageContent: '',
        messagePipe: '',
        timingDate: '',
        numberPackage: []
      },
      rules: {
        numberPackage: [
          { required: true, message: '请选择号码包', trigger: 'change' }
        ],
        messagePipe: [
          { required: true, message: '请选择短信通道', trigger: 'change' }
        ],
        messageContent: [
          {
            required: true,
            message: '不能为空   必须附带签名',
            trigger: 'change'
          },
          { max: 70, message: '长度不得超过70个字符', trigger: 'change' },
          { validator: checkContent, trigger: ['change', 'blur'] }
        ],
        checkedList: [{ required: true, message: '必选', trigger: 'change' }],
        timingDate: []
      },
      valiRules: {
        testPhoneList: [{ validator: valiNumber, trigger: 'blur' }]
      },
      smstaskFileName: '',
      timingDateJudge: false,
      editJudge: false,
      editId: '',
      token: '',
      projectList: [],
      audiencePackageList: [],
      projectId: '',
      audiencePackageId: '',
      loading: false,
      projectName: '',
      audiencePackageName: '',
      sourceType: 1,
      isGettingNumber: false,
      numberPackage: [],
      dialogVisible: false,
      dialogVisible2: false,
      fileUrlList: '',
      isFilter: false,
      textPhone: false,
      ppp: [],
      isOpenE: false,
      citysE: [],
      ispTypesE: [],
      confirmVis: false,
      valiForm: {
        testPhoneList: ''
      }
    }
  },

  created() {
    this.getMsgPipe()
    this.getAllProject()
    if (Object.keys(this.fromFather).length == 0) {
      this.$store.dispatch('changeIsOpen', {
        isOpen: false
      })
      this.$store.dispatch('changeCitys', {
        citys: []
      })
      this.$store.dispatch('changeIspTypes', {
        ispTypes: []
      })
      this.$store.dispatch('changeIsContainCity', {
        isContainCity: 1
      })
      this.$store.dispatch('changeisContainIspType', {
        isContainIspType: 1
      })
    }
  },
  mounted() {
    this.$refs['messageForm'].clearValidate()
  },
  computed: {
    checkedList() {
      return this.messageForm.checkedList
    },
    ...mapGetters([
      'citys',
      'isOpen',
      'ispTypes',
      'isContainCity',
      'isContainIspType'
    ])
  },
  methods: {
    getNumber(query) {
      if (query.length > 0) {
        this.isGettingNumber = true
        this.numberPackage = []

        if (this.numberCancel) {
          this.numberCancel.cancel()
        }

        const CancelToken = request.CancelToken
        this.numberCancel = CancelToken.source()

        sendMessageApi
          .getNumberPacage(
            {
              name: query
            },
            {
              cancelToken: this.numberCancel.token
            }
          )
          .then(res => {
            const { data } = res
            console.log(data, '号码包')
            if (data.code === 0) {
              this.numberPackage = data.data.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  fileUrl: item.fileUrl
                }
              })
              console.log(this.numberPackage)
              this.ppp = [...this.ppp, ...this.numberPackage]
              const obj = {}
              this.ppp = this.ppp.reduce((prev, curr) => {
                obj[curr.fileUrl]
                  ? true
                  : (obj[curr.fileUrl] = true && prev.push(curr))
                return prev
              }, [])
            }

            this.isGettingNumber = false
          })
          .catch(e => {
            this.isGettingNumber = false
          })
      } else {
        if (this.numberCancel) {
          this.numberCancel.cancel()
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    saveJsmodal() {
      if (this.fileName == '') {
        this.$message.warning('请选择要上传的文件！')
        return false
      }

      this.receiveNumber = 0
      this.loading = true
      this.sourceType = 0
      this.audiencePackageId = ''
      this.projectId = ''
      let fileFormData = new FormData()
      fileFormData.append('file', this.files)

      sendMessageApi
        .uploadphones({
          file: fileFormData
        })
        .then(({ data }) => {
          console.log(data)
          if (data.code === 0) {
            this.jsOuterVisible = false
            if (data.data.msg !== 'true') {
              this.$message({
                message: data.data.msg,
                type: 'success',
                duration: 5000
              })
            } else {
              this.$message({
                message: '上传成功',
                type: 'success'
              })
            }
            this.executeFileName = this.fileName
            this.receiveNumber = data.data.receiveNumber
            this.smstaskFileName = data.data.fileName
            this.token = data.data.token
          }
        })
        .catch(({ data }) => {
          this.executeFileName = ''
          this.receiveNumber = 0
          this.files = ''
        })
        .finally(() => {
          this.loading = false
        })
    },
    beforeUpload(file) {
      this.files = file
      var filename = file.name
      var index1 = filename.lastIndexOf('.')
      var index2 = filename.length
      var extension = filename.substring(index1, index2) === '.txt' || '.csv'
      const isLt1M = file.size / 1024 / 1024 < 3

      if (!extension) {
        this.$message.warning('上传文件只能是 txt 格式!')
        this.files = ''
        return false
      }
      if (!isLt1M) {
        this.$message.warning('上传文件大小不能超过 3MB!')
        this.files = ''

        return false
      }
      this.fileName = file.name
      this.saveJsmodal()
      return false
    },
    getMsgPipe() {
      sendMessageApi.getSmschannel().then(({ data }) => {
        console.log(data)
        this.options = data.data.map(item => ({
          label: item.name,
          value: item.id
        }))
        if (this.messageForm.messagePipe == '') {
          this.messageForm.messagePipe = this.options[0].value
        }
      })
    },
    returnRecord() {
      this.$emit('closeDialog')
    },
    submitPhone() {
      this.$refs['messageForm'].validate(valid => {
        if (valid) {
          if (this.totalNumber === 0 || this.totalNumber == '') {
            this.$message({
              message: '本次发送无可用号码',
              type: 'warning'
            })
            return false
          }
          this.confirmVis = true
          // this.$confirm(
          //   '确认内容准确无误吗？立即发送的将立即提交发送记录，定时发送的将暂存，可在短信发送记录中修改，是否确认？',
          //   '确认',
          //   {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }
          // )
          //   .then(() => {

          //   })
          //   .catch(() => {
          //     this.$message({
          //       type: 'info',
          //       message: '已取消确认'
          //     })
          //   })
        } else {
          return false
        }
      })
    },
    tttttt() {
      var planExecuteTime
      if (this.timingDateJudge == true) {
        planExecuteTime = this.messageForm.timingDate
      } else {
        planExecuteTime = null
      }

      if (this.editJudge) {
        console.log(
          this.citys,
          'this.citysE',
          this.textPhone,
          this.isContainIspType
        )
        sendMessageApi
          .putSmstask({
            id: this.editId,
            channelId: this.messageForm.messagePipe,
            fileName: this.fileUrl || '',
            fileUrls: this.dialogVisible ? '' : this.fileUrlList,
            smsTaskFilterId: this.fromFather.smsTaskFilterId,
            numberPackageList: JSON.parse(
              JSON.stringify(this.messageForm.numberPackage)
            ).join(),
            receiveNumber: this.totalNumber,
            smsContent: this.messageForm.messageContent,
            taskType: this.timingDateJudge ? 2 : 1,
            planExecuteTime: planExecuteTime,
            // token: this.token,
            // projectId: this.projectId,
            // audiencePackageId: this.audiencePackageId,
            sourceType: this.sourceType,
            isFilter: this.isFilter ? '1' : '0',
            isExistTest: this.textPhone ? '1' : '0',
            testPhoneList: this.valiForm.testPhoneList
              .split('\n')
              .filter(function(s) {
                return s && s.trim()
              })
              .join(','),
            citys: this.citys ? this.citys.toString() : '',
            ispTypes: this.ispTypes ? this.ispTypes.toString() : '',
            isOpen: this.isOpen ? this.isOpen : false,
            isContainCity: this.isContainCity,
            isContainIspType: this.isContainIspType
          })
          .then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$emit('closeDialog')

              this.fileName = ''
              this.files = ''
              this.executeFileName = ''
              this.$refs['messageForm'].resetFields()
              this.isFilter = false
              this.receiveNumber = 0
              this.fileUrlList = []
              this.confirmVis = false
              this.textPhone = false
              this.valiForm.testPhoneList = ''
              this.$emit('clearFilter')
            }
          })
      } else {
        sendMessageApi
          .addSmstask({
            channelId: this.messageForm.messagePipe,
            fileName: this.fileUrl || '',
            fileUrls: this.dialogVisible ? '' : this.fileUrlList,
            isExistTest: this.textPhone ? '1' : '0',
            testPhoneList: this.valiForm.testPhoneList
              .split('\n')
              .filter(function(s) {
                return s && s.trim()
              })
              .join(','),
            numberPackageList: JSON.parse(
              JSON.stringify(this.messageForm.numberPackage)
            ).join(),
            receiveNumber: this.totalNumber,
            smsContent: this.messageForm.messageContent,
            taskType: this.timingDateJudge ? 2 : 1,
            planExecuteTime: planExecuteTime,
            // token: this.token,
            // projectId: this.projectId,
            // audiencePackageId: this.audiencePackageId,
            sourceType: this.sourceType,
            isFilter: this.isFilter ? '1' : '0',
            citys: this.citys ? this.citys.toString() : '',
            ispTypes: this.ispTypes ? this.ispTypes.toString() : '',
            isOpen: this.isOpen ? this.isOpen : false,
            isContainCity: this.isContainCity,
            isContainIspType: this.isContainIspType
          })
          .then(({ data }) => {
            console.log(data)
            if (data.code == 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$emit('closeDialog')
              this.$emit('numberchange', 0)
              this.dialogVisible = false
              this.fileName = ''
              this.files = ''
              this.executeFileName = ''
              this.$refs['messageForm'].resetFields()
              this.messageForm.messagePipe = this.options[0].value
              this.isFilter = false
              this.receiveNumber = 0
              this.fileUrlList = []
              this.confirmVis = false
              this.textPhone = false
              this.valiForm.testPhoneList = ''
              this.$emit('clearFilter')
            }
          })
      }
    },
    checkchange(value) {
      if (this.checkedList.length > 1) {
        this.checkedList.shift()
      }
    },
    getAllProject() {
      sendMessageApi.getAllProject().then(({ data }) => {
        console.log('projectList -> ', data)
        if (data.code == 0) {
          this.projectList = data.data
        }
      })
    },
    getAllAudiencePackage() {
      this.audiencePackageId = ''
      this.audiencePackageList = []
      sendMessageApi
        .getAllAudiencePackage({
          projectId: this.projectId
        })
        .then(({ data }) => {
          console.log('audiencePackageList -> ', data)
          if (data.code == 0) {
            this.audiencePackageList = data.data
          }
        })
    },
    getAudiencePackageNumber() {
      this.receiveNumber = ''
      this.loading = true
      this.sourceType = 1
      this.executeFileName = ''
      sendMessageApi
        .uploadAudiencePackagePhones({
          projectId: this.projectId,
          audiencePackageId: this.audiencePackageId
        })
        .then(({ data }) => {
          console.log('uploadAudiencePackagePhones -> ', data)
          if (data.code == 0) {
            const obj = data.data
            this.receiveNumber = obj.receiveNumber
            this.smstaskFileName = obj.fileName
            this.token = obj.token
          }
        })
        .catch(() => {
          this.loading = false
          this.receiveNumber = 0
          this.smstaskFileName = ''
          this.token = ''
        })
        .finally(() => {
          this.loading = false
        })
    },
    numberPackageChange(value) {
      var arr = []
      console.log(this.ppp, 'ppppppppppp')
      value.forEach(ele => {
        this.ppp.map(item => {
          if (item.value == ele) {
            arr.push(item.fileUrl)
          }
        })
      })
      this.fileUrlList = arr.toString()

      if (Object.keys(this.fromFather).length !== 0) {
        if (this.isFilter) {
          console.log('11111111111')
          this.loading=true
          sendMessageApi
            .numberFilter(this.getNumberFilterData(this.fileUrlList.toString().split(',')) )

            
            .then(({ data }) => {
            
          this.loading=false

              // this.filterNumber=data.data.otherNumberTotal
              this.$emit('numberchange', data.data.total)
              this.$emit('getFileUrl',data.data.fileUrl)
            })
        } else {
          console.log('22222222222')
          this.loading=true

          sendMessageApi
            .getNumber({
              fileUrlList: arr.toString(),
              testPhoneList: this.textPhone
                ? this.valiForm.testPhoneList
                    .split('\n')
                    .filter(function(s) {
                      return s && s.trim()
                    })
                    .join(',')
                : '',
              fileUrl: this.isFilter ? this.fileUrl : ''
            })
            .then(({ data }) => {
              console.log(data, '人数2')
              this.$emit('numberchange', data.data)
          this.loading=false

            })
          this.$emit('getUrl', arr)
        }
      } else {
          this.loading=true

        if (this.isFilter) {
          sendMessageApi
            .numberFilter(this.getNumberFilterData(this.fileUrlList.toString().split(',')) )
            .then(({ data }) => {
              
          this.loading=false

              // this.filterNumber=data.data.otherNumberTotal
              this.$emit('numberchange', data.data.total)
              this.$emit('getFileUrl',data.data.fileUrl)

            })
        } else {
          sendMessageApi
            .getNumber({
              fileUrlList: this.fileUrlList,
              testPhoneList: this.textPhone
                ? this.valiForm.testPhoneList
                    .split('\n')
                    .filter(function(s) {
                      return s && s.trim()
                    })
                    .join(',')
                : '',
              fileUrl: this.isFilter ? this.fileUrl : ''
            })
            .then(({ data }) => {
              console.log(data, '人数1')
          this.loading=false

              this.$emit('numberchange', data.data)
            })
          this.$emit('getUrl', arr)
        }
      }
    },
    changeTestPhoneList() {
      this.$refs['valiForm'].validate(valid => {
        if (valid) {
         this.loading=true
          if (Object.keys(this.fromFather).length !== 0) {
            //发送记录
            let list = []

            if (this.fileUrlList.length != 0) {
              list = this.fileUrlList
            } else {
              this.fromFather.numberPackages.forEach(ele => {
                list.push(ele.fileUrl)
              })
            }
            this.sendNumber(list.toString())


            this.dialogVisible2 = false
          } else {
            this.sendNumber(this.fileUrlList)
            // sendMessageApi
            //   .getNumber({
            //     fileUrlList: this.fileUrlList,
            //     testPhoneList: testPhoneList.join(','),
            //     fileUrl: this.isFilter ? this.fileUrl : ''
            //   })
            //   .then(({ data }) => {
            //     console.log(data, '人数1')
            //     this.$emit('numberchange', data.data)
            //   })

            this.dialogVisible2 = false
          }
        }
      })
    },
    returnTestPhone() {
      this.dialogVisible2 = false
    },
    openTest() {
      this.dialogVisible2 = true
     
    },
    sendNumber(fileUrlList){
      sendMessageApi
              .getNumber({
                fileUrlList:fileUrlList,
                testPhoneList: this.valiForm.testPhoneList
                  .split('\n')
                  .filter(function(s) {
                    return s && s.trim()
                  })
                  .join(','),
                fileUrl: this.isFilter ? this.fileUrl : ''
              })
              .then(({ data }) => {
                this.loading = false
                
                this.$emit('numberchange', data.data)
              })
    },
     getNumberFilterData(fileUrlList){
       var obj={
         citys: this.citys || [],
              ispTypes: this.ispTypes || [],
              numberPackageFileUrls:fileUrlList  || [],
              open: this.isOpen || false,
              isContainCity: this.isContainCity,
              isContainIspType: this.isContainIspType
       
     }
     return obj
     }
  },
  props: {
    fromFather: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: () => ({})
    },
    checkChoose: Boolean,
    testPhone: Boolean,
    totalNumber: {
      type: Number,
      default: -1
    },
    fileUrl: String
    // citys:String,
    // ispTypes:String,
    // isOpen:Boolean
  },
  watch: {
    checkedList(value) {
      if (value.length > 0) {
        if (value[0] == 'timing') {
          console.log('timing')
          this.timingDateJudge = true

          if (this.rules['timingDate'].length === 0) {
            console.log('走这里过了吗')

            this.rules = {
              ...this.rules,
              timingDate: [
                {
                  required: true,
                  message: '请选择定时发送时间',
                  trigger: 'change'
                },
                { validator: checkDATE, trigger: 'blur' }
              ]
            }
          }
        } else {
          this.$refs['messageForm'].clearValidate(['timingDate'])
          this.rules['timingDate'] = []
          this.timingDateJudge = false
        }
      } else {
        if (this.$refs['messageForm']) {
          this.$refs['messageForm'].clearValidate(['timingDate'])
        }
        this.timingDateJudge = false
      }
    },
    fromFather: {
      handler(newVal) {
        if (Object.keys(this.fromFather).length !== 0) {
          this.editJudge = true
          console.log(this.fromFather, 'fromFather')
          this.ppp = this.fromFather.numberPackages.map((ele, index) => {
            return {
              label: ele.name,
              value: ele.id,
              fileUrl: ele.fileUrl
            }
          })
          this.executeFileName = ''
          //手动制造号码包列表
          this.numberPackage = this.fromFather.numberPackages.map(
            (ele, index) => {
              return {
                label: ele.name,
                value: ele.id,
                fileUrl: ele.fileUrl
              }
            }
          )
          // this.chosedNumber=this.fromFather.receiveNumber
          this.$emit('numberchange', this.fromFather.receiveNumber)

          console.log(this.numberPackage, 'numberPackage')
          this.messageForm.numberPackage = []
          this.numberPackage.forEach(item => {
            this.messageForm.numberPackage.push(item.value)
          })
          let list = []
          this.fromFather.numberPackages.forEach(ele => {
            list.push(ele.fileUrl)
          })
          this.$emit('getUrl', list)
          this.isFilter = this.fromFather.isFilter == 1 ? true : false
          this.textPhone = this.fromFather.isExistTest == 1 ? true : false
          // this.dispatch('changeisContainIspType', {
          //   isContainIspType: this.fromFather.isContainIspType,
          // })
          // this.dispatch('changeIsContainCity', {
          //   isContainCity: this.fromFather.isContainCity,
          // })
          this.$emit('changeisContainIspType', this.fromFather.isContainIspType)
          this.$emit('changeIsContainCity', this.fromFather.isContainCity)
          this.valiForm.testPhoneList = this.fromFather.testPhoneList
            .split(',')
            .join('\n')
          this.$store.dispatch('changeTestPhoneList', {
            testPhoneList: this.valiForm.testPhoneList,
            textPhone: this.textPhone
          })
          this.isOpenE = this.fromFather.isOpen || this.isOpen || ''
          console.log('>>>>>>>>>', this.citys)
          // this.citysE=this.citys||[]
          // this.ispTypesE=this.ispTypes||[]
          //     this.$store.dispatch('changeCitys', {
          //   citys: this.fromFather.citys
          // })
          //     this.$store.dispatch('changeIsOpen', {
          //   isOpen: this.fromFather.isOpen
          // })
          //     this.$store.dispatch('changeIspTypes', {
          //   ispTypes: this.fromFather.ispTypes
          // })
          // this.$emit('initFilter',{
          //     isOpenE:this.fromFather.isOpenE,
          //     citysE:this.fromFather.citysE,
          //     ispTypesE:this.fromFather.ispTypesE,

          // })
          console.log(this.citysE)

          // this.messageForm.numberPackage=[this.fromFather.numberPackageList]
          this.messageForm.messageContent = this.fromFather.smsContent
          this.messageForm.messagePipe = this.fromFather.channelId
          this.messageForm.checkedList = []
          this.smstaskFileName = this.fromFather.fileName
          this.messageForm.checkedList.push('timing'),
            (this.messageForm.timingDate = this.fromFather.planExecuteTime)
          // this.executeFileName = this.fromFather.fileName
          this.receiveNumber = this.fromFather.receiveNumber
          this.editId = this.fromFather.id
          this.projectId = ''
          this.audiencePackageId = ''
          this.audiencePackageList = []
          if (this.fromFather.projectId != null) {
            this.getAllProject()
            this.projectId = this.fromFather.projectId
            this.getAllAudiencePackage()
            this.audiencePackageId = this.fromFather.audiencePackageId
          }

          console.log(this.messageForm)
        }
      },
      deep: true,
      immediate: true
    },
    checkChoose(value) {
      console.log(value, 'checkChoose')
      this.dialogVisible = value
    },
    dialogVisible(value) {
      this.$emit('showA', value)
    },

    // totalNumber:{
    //   handler(value) {
    //     console.log(value,'totalNumbertotalNumbertotalNumber')
    //   this.chosedNumber=value

    //   },
    //   deep: true,
    //   immediate: true
    // },
    isFilter(value) {
      console.log(this.isContainCity, 'totalNumberLIssdfsdf')
      if (value == false) {
        //不勾选
        if (Object.keys(this.fromFather).length !== 0) {
          //发送记录
            this.loading = true
          let list = []
          console.log('去哪儿了', this.fileUrlList)
          if (this.fileUrlList.length != 0) {
            list = this.fileUrlList
          } else {
            this.fromFather.numberPackages.forEach(ele => {
              list.push(ele.fileUrl)
            })
          }
          if (this.textPhone) {
            this.sendNumber(list.toString())
            
          } else {
            sendMessageApi
              .getNumber({
                fileUrlList: list.toString()
              })
              .then(({ data }) => {
                this.$emit('numberchange', data.data)
                this.loading = false
              })
          }
        } else {
          //短信发送新增
          this.$emit('numberchange', 0)
          this.loading = true
          if (this.textPhone) {
            this.sendNumber(this.fileUrlList.toString())
            
            
          } else {
            sendMessageApi
              .getNumber({
                fileUrlList: this.fileUrlList.toString()
              })
              .then(({ data }) => {
                this.$emit('numberchange', data.data)
                this.loading = false
              })
          }
        }
      } else {
        //勾选
        if (Object.keys(this.fromFather).length !== 0) {
          //短信发送记录
            this.loading = true
          let list = []
          console.log(this.fileUrlList, 'this.fileUrlList奇怪啊 ')
          if (this.fileUrlList.length != 0) {
            list = this.fileUrlList.split(',')
          } else {

            this.fromFather.numberPackages.forEach(ele => {
              list.push(ele.fileUrl)
            })
          }
          this.$emit('getUrl', list)

          sendMessageApi
            .numberFilter({
              citys: this.fromFather.citys || this.citys,
              ispTypes: this.fromFather.ispTypes || this.ispTypes,
              numberPackageFileUrls: list,
              open: this.isOpen,
              isContainCity: this.isContainCity,
              isContainIspType: this.isContainIspType
            })
            .then(({ data }) => {
              console.log(data, '人数3333')
              if(data.data){
              this.$emit('getFileUrl',data.data.fileUrl)
              

              }
              if (data.code != 0) {
                // this.$message({
                //   type: 'warning',
                //   message: data.msg
                // })
              }
              if (this.textPhone) {
                if (data.data == null) {
                  
                  sendMessageApi
                    .getNumber({
                      fileUrlList: list.toString(),
                      testPhoneList: this.valiForm.testPhoneList
                        .split('\n')
                        .filter(function(s) {
                          return s && s.trim()
                        })
                        .join(','),
                      fileUrl: ''
                    })
                    .then(({ data }) => {
                      this.$emit('numberchange', data.data)
                      this.loading = false
                    })
                } else {
                  sendMessageApi
                    .getNumber({
                      fileUrlList: list.toString(),
                      testPhoneList: this.valiForm.testPhoneList
                        .split('\n')
                        .filter(function(s) {
                          return s && s.trim()
                        })
                        .join(','),
                      fileUrl: data.data.fileUrl || ''
                    })
                    .then(({ data }) => {
                      this.$emit('numberchange', data.data)
                      this.loading = false
                    })
                }
              } else {
                this.loading = false
                this.$emit('numberchange', data.data.total)
              }
              // this.fileUrl=data.data.fileUrl
            })
        }
        // console.log(this.citys.length,'this.citys.length',Object.keys(this.fromFather).length,'Object.keys(this.fromFather).length')
        if (
          // this.citys.length != 0 &&
          Object.keys(this.fromFather).length == 0
        ) {
          // else{
          //短信新增
          this.loading = true

          sendMessageApi
            .numberFilter(this.getNumberFilterData(this.fileUrlList.toString().split(',')) )

            

            .then(({ data }) => {
              console.log(data, '人数4444zzzzzzz')
              this.$emit('getFileUrl',data.data.fileUrl)
              
              // this.filterNumber=data.data.otherNumberTotal
              if (this.textPhone) {
                sendMessageApi
                  .getNumber({
                    fileUrlList: this.fileUrlList.toString(),
                    testPhoneList: this.valiForm.testPhoneList
                      .split('\n')
                      .filter(function(s) {
                        return s && s.trim()
                      })
                      .join(','),
                    fileUrl: data.data.fileUrl
                  })
                  .then(({ data }) => {
                    this.$emit('numberchange', data.data)
                    this.loading = false
                  })
              } else {
                this.loading = false
                this.$emit('numberchange', data.data.total)
              }

              // this.fileUrl=data.data.fileUrl
              // this.dialogVisible=false
            })
            .catch(res => {
              this.loading = false
            })
        }
      }
    },
    textPhone(value) {
      if (value) {
        this.loading = true
        console.log(this.fileUrl, '??propsfirl')

        if (Object.keys(this.fromFather).length !== 0) {
          //发送记录
          let list = []

          if (this.fileUrlList.length != 0) {
            list = this.fileUrlList
          } else {
            this.loading = true
            this.fromFather.numberPackages.forEach(ele => {
              list.push(ele.fileUrl)
            })
          }
          if (this.fromFather.testPhoneList == null) {
            sendMessageApi.getTestPhone().then(({ data }) => {
              console.log(data)
              this.valiForm.testPhoneList = data.data.toString() || ''
            this.sendNumber(list.toString())

             
            })
          } else {
            this.sendNumber(list.toString())

            
          }
        } else {
          if (this.valiForm.testPhoneList == '') {
            sendMessageApi.getTestPhone().then(({ data }) => {
              console.log(data)
              if(data.data!=null){
              this.valiForm.testPhoneList = data.data.join('\n') 

              }else{
                 this.valiForm.testPhoneList=[]
              }
              if( this.valiForm.testPhoneList.length==0){
                sendMessageApi
                .getNumber({
                  fileUrlList: this.fileUrlList.toString(),
                  testPhoneList: null,
                  fileUrl: this.isFilter ? this.fileUrl : ''
                })
                .then(({ data }) => {
                  this.loading = false

                  this.$emit('numberchange', data.data)
                })
              }else{
            this.sendNumber(this.fileUrlList.toString())

              
              }
              
            })
          } else {
            this.sendNumber(this.fileUrlList.toString())
            
           
          }
        }
      } else {
        //重新走isfilter的规则接口
        if (this.isFilter == false) {
          //不勾选
          if (Object.keys(this.fromFather).length !== 0) {
            //发送记录
            let list = []
              this.loading = true

            if (this.fileUrlList.length != 0) {
              list = this.fileUrlList
            } else {
              this.fromFather.numberPackages.forEach(ele => {
                list.push(ele.fileUrl)
              })
            }

            sendMessageApi
              .getNumber({
                fileUrlList: list.toString()
              })
              .then(({ data }) => {
                console.log(data, '人数111')
                // this.chosedNumber=data.data
                this.$emit('numberchange', data.data)
                this.loading = false
              })
          } else {
            //短信发送新增
            this.$emit('numberchange', 0)
            this.loading = true
            sendMessageApi
              .getNumber({
                fileUrlList: this.fileUrlList.toString()
              })
              .then(({ data }) => {
                console.log(data, '人数222')
                // this.chosedNumber=data.data
                this.$emit('numberchange', data.data)
                this.loading = false
              })
          }
        } else {
          //勾选
          if (Object.keys(this.fromFather).length !== 0) {
            //短信发送记录
              this.loading = true
            let list = []
            if (this.fileUrlList.length != 0) {
              list = this.fileUrlList.split(',')
            } else {

              this.fromFather.numberPackages.forEach(ele => {
                list.push(ele.fileUrl)
              })
            }
            this.$emit('getUrl', list)

            sendMessageApi
            .numberFilter(this.getNumberFilterData(list) )

              .then(({ data }) => {
                console.log(data, '人数3333')
                this.loading = false
                if (data.code != 0) {
                  // this.$message({
                  //   type: 'warning',
                  //   message: data.msg
                  // })
                }
                // this.filterNumber=data.data.otherNumberTotal
                this.$emit('numberchange', data.data.total)
                // this.fileUrl=data.data.fileUrl
              })
          }
          // console.log(this.citys.length,'this.citys.length',Object.keys(this.fromFather).length,'Object.keys(this.fromFather).length')
          if (
            // this.citys.length != 0 &&
            Object.keys(this.fromFather).length == 0
          ) {
            // else{
            //短信新增
            this.loading = true

            sendMessageApi
            .numberFilter(this.getNumberFilterData(this.fileUrlList.toString().split(',')) )
              

              .then(({ data }) => {
                console.log(data, '人数4444')
                if (data.code != 0) {
                  // this.$message({
                  //   type: 'warning',
                  //   message: data.msg
                  // })
                }
                // this.filterNumber=data.data.otherNumberTotal
                this.$emit('numberchange', data.data.total)
                this.loading = false

                // this.fileUrl=data.data.fileUrl
                // this.dialogVisible=false
              })
              .catch(res => {
                this.loading = false
              })
          }
        }
      }

      this.$store.dispatch('changeTestPhoneList', {
        textPhone: value,
        testPhoneList: this.valiForm.testPhoneList
      })
    },
    'valiForm.testPhoneList': {
      handler(value) {
        this.$store.dispatch('changeTestPhoneList', {
          testPhoneList: value,
          textPhone: this.textPhone
        })
        console.log(value)
      },
      deep: true,
      immediate: true
    }
    // 'messageForm.numberPackage':{
    //   handler(value) {
    //       var arr=[]
    //   value.forEach(ele=>{
    //     this.ppp.map(item=>{
    //       if(item.value==ele){
    //         arr.push(item.fileUrl)
    //       }
    //     })
    //   })
    //   this.fileUrlList=arr.toString()
    //   sendMessageApi.getNumber({
    //     fileUrlList:arr.toString()
    //   }).then(({data})=>{
    //     console.log(data,'人数')
    //     this.chosedNumber=data.data
    //   })
    //   this.$emit('getUrl',arr)
    //   console.log('这样可以吗')

    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
}
</script>
<style lang="scss" scoped>
/deep/.timingDate {
  .el-form-item__error {
    margin-left: 220px;
    margin-top: 0px;
  }
}
</style>
