<template>
  <basic-container>
    <el-row style="text-align:right">
      <el-button type="primary" @click="addDialog">新增号码包</el-button>
      <el-dropdown trigger="click">
        <span style="color:black;margin-left:5px">
          <el-button>.....</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            ><span @click="filterNumberM">管理过滤号码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @size-change="handleSizeChange"
      @current-change="currentChange"
      @search-change="handleSearchChange"
    >
      <template slot="name" slot-scope="scope">
        <span :title="scope.row.name">{{
          scope.row.name.length > 10
            ? scope.row.name.substring(0, 10) + '...'
            : scope.row.name
        }}</span>
      </template>

      <template slot="id" slot-scope="scope">
        <el-button type="text" @click="update(scope.row)">更新</el-button>
        <el-button type="text" @click="deleteN(scope.row.id)">删除</el-button>
      </template>
    </avue-crud>
    <avue-drawer
      width="530"
      :close-on-click-modal="false"
      @close="closeDra"
      :title="drawerTitle"
      show-close
      v-model="dialogVisible"
    >
      <el-form :model="form" :inline="true" :rules="rules">
        <el-form-item prop="name" label="号码包名称：" label-width="100px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="类型：" label-width="100px">
          <div style="width:350px">
            <el-radio v-model="radio" label="1">自定义上传</el-radio>
            <el-radio v-model="radio" label="2">人群包选择</el-radio>

            <div v-show="radio == '2'">
              <el-select
                v-model="projectId"
                placeholder="请选择项目"
                @change="getAllAudiencePackage"
                :disabled="loading"
                style="width: 200px;margin-top:5px"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <br />
              <el-select
                v-model="audiencePackageId"
                placeholder="请选择人群包"
                @change="getAudiencePackageNumber"
                :disabled="loading"
                style="width: 200px;margin-top:5px"
              >
                <el-option
                  v-for="item in audiencePackageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div v-show="radio == '1'">
              <el-upload
                class="upload-demo"
                action="#"
                drag
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :disabled="loading"
                :http-request="saveJsmodal"
                :file-list="fileList"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <!-- {{ executeFileName }} -->

                <div slot="tip" style="width:">
                  只能上传单个 txt,csv,xls,xlsx 格式文件，且不超过3m
                </div>
              </el-upload>
            </div>

            <el-row style="margin:8px 0">
              <el-col> </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="号码数量：" label-width="100px">
          <span
            style="color:red"
            v-bind:class="{ 'el-icon-loading': loading }"
            >{{ loading ? '' : receiveNumber }}</span
          >
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" :disabled="receiveNumber == 0" @click="save"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">返回</el-button>
      </div>
    </avue-drawer>
    <avue-drawer
      width="530"
      :close-on-click-modal="false"
      @close="closeDra"
      title="管理过滤号码"
      show-close
      v-model="dialogVisibleMin"
    >
      <el-form v-model="form" :inline="true">
        <el-form-item label="过滤号码数量：">
          <span style="color:red">{{ filterNum }}</span>
        </el-form-item>

        <el-form-item label="上传文件：">
          <div style="width:400px">
            <div>
              <el-upload
                class="upload-demo"
                action="#"
                drag
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :disabled="loading"
                :http-request="uploadFilter"
                :file-list="fileList"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <!-- {{ executeFileName }} -->

                <div slot="tip" style="width:">
                  只能上传单个 txt,csv,xls,xlsx 格式文件，且不超过3m
                </div>
              </el-upload>
            </div>

            <el-row style="margin:8px 0">
              <el-col> </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button
          type="primary"
          @click="nuberUpdate"
          :disabled="filterNum == 0"
          >更新</el-button
        >
        <el-button @click="dialogVisibleMin = false">关闭</el-button>
      </div>
    </avue-drawer>
  </basic-container>
</template>
<script>
import * as sendMessageApi from '@/api/project/sendMessage'
import { tableOption } from '@/const/crud/admin/numberManage'

// import { tableOption } from "@/const/crud/admin/project";
// import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption,
      dialogVisible: false,
      form: {
        name: ''
      },
      projectList: [],
      audiencePackageList: [],
      loading: false,
      executeFileName: '',
      receiveNumber: 0,
      projectId: '',
      audiencePackageId: '',
      radio: '1',
      fileList: [],
      numberTotal: '',
      fileName: '',
      token: '',
      editId: '',
      dialogVisibleMin: false,
      filterNum: 0,
      drawerTitle: '新增号码包',
      rawFileName: '',
      rules: {
        name: [
          //   { required: true, message: '请输入通道', trigger: 'change' },
          { max: 50, message: '长度在 50 个字符以内', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.handleList()
    this.getAllProject()
  },
  watch: {
    radio(value) {
      console.log('radio变0')
      if (value == '1') {
        this.projectId = ''
        this.audiencePackageId = ''
        this.receiveNumber = 0
      } else {
        this.fileList = []
        this.receiveNumber = 0
      }
    }
    // fileList(value){
    //     console.log('fileList变0',value)

    //     if(value.length==0){
    //         this.receiveNumber=0
    //     }
    // }
  },
  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleSearchChange(payload) {
      this.tableLoading = true
      var obj = {}
      if (payload !== undefined) {
        obj = {
          projectName: payload.name
        }
      }
      sendMessage
        .getProject({
          current: this.page.currentPage,
          size: this.page.pageSize,
          ...obj
        })
        .then(({ data }) => {
          const payload = data.data.projectInfoPage
          this.tableData = payload.records
          this.page.total = payload.total
          this.tableLoading = false
        })
    },

    handleList() {
      this.tableLoading = true

      sendMessageApi
        .getSmsPackagePage({
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          console.log(data)
          this.tableLoading = false
          this.page.total = data.data.total
          this.tableData = data.data.records
        })
    },
    addDialog() {
      this.drawerTitle = '新增号码包'

      this.dialogVisible = true
      this.editId = ''
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
      console.log('>>>????')
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
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    getAudiencePackageNumber() {
      this.receiveNumber = 0
      this.loading = true
      //   this.sourceType = 1
      //   this.executeFileName = ''
      sendMessageApi
        .uploadPeoplePackage({
          audiencePackageId: this.audiencePackageId,
          projectId: this.projectId
        })
        .then(({ data }) => {
          if (data.code === 0) {
            this.loading = false
            this.receiveNumber = data.data.receiveNumber
            this.token = data.data.token
            this.fileName = data.data.fileName
            if (!this.form.name) {
              this.form.name = data.data.rawName
            }
            console.log(data)
          } else {
            this.loading = false
          }
        })
      //   sendMessageApi.uploadAudiencePackagePhones({
      //     projectId: this.projectId,
      //     audiencePackageId: this.audiencePackageId
      //   }).then(({ data }) => {
      //     console.log('uploadAudiencePackagePhones -> ', data)
      //     if (data.code == 0) {
      //       const obj = data.data
      //       this.receiveNumber = obj.receiveNumber
      //       this.smstaskFileName = obj.fileName
      //       this.token = obj.token
      //     }
      //   }).catch(() => {
      //     this.loading = false
      //     this.receiveNumber = 0
      //     this.smstaskFileName = ''
      //     this.token = ''
      //   }).finally(() => {
      //     this.loading = false
      //   })
    },
    beforeUpload(file) {
      this.files = file
      var filename = file.name
      var index1 = filename.lastIndexOf('.')
      var index2 = filename.length
      var extension =
        filename.substring(index1, index2) === '.txt' ||
        '.csv' ||
        '.xls' ||
        'xlsx'
      const isLt1M = file.size / 1024 / 1024 < 3

      if (!extension) {
        this.$message.warning('上传文件只能是 txt,csv,xls,xlsx 格式!')
        this.files = ''
        return false
      }
      if (!isLt1M) {
        this.$message.warning('上传文件大小不能超过 3MB!')
        this.files = ''

        return false
      }
      this.rawFileName = file.name
      //   this.saveJsmodal()
      return true
    },
    saveJsmodal(params) {
      //   if (this.fileName == '') {
      //     this.$message.warning('请选择要上传的文件！')
      //     return false
      //   }
      console.log('cccc')
      this.receiveNumber = 0
      this.loading = true
      this.sourceType = 0
      this.audiencePackageId = ''
      this.projectId = ''
      let fileFormData = new FormData()
      fileFormData.append('file', this.files)
      sendMessageApi
        .uploadNumberPackage({
          file: fileFormData
        })
        .then(({ data }) => {
          console.log(data, '???')
          if (data.code === 0) {
            params.onSuccess(data.data)

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
            // this.executeFileName = this.fileName
            this.receiveNumber = data.data.receiveNumber
            this.token = data.data.token
            this.fileName = data.data.fileName
            if (!this.form.name) {
              this.form.name = data.data.rawName
            }
          } else {
          }
        })
        .catch(res => {
          console.log(res)
          params.onError()
          this.executeFileName = ''
          this.receiveNumber = 0
          this.files = ''
        })
        .finally(() => {
          this.loading = false
        })
    },
    uploadFilter(params) {
      let fileFormData = new FormData()
      fileFormData.append('file', this.files)
      console.log(this.files)
      sendMessageApi
        .uploadFilterPackage({
          file: fileFormData
        })
        .then(({ data }) => {
          console.log(data)
          if (data.code === 0) {
            params.onSuccess(data.data)

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
            this.filterNum = data.data.receiveNumber
            this.fileName = data.data.fileName
            this.token = data.data.token
          }
        })
        .catch(res => {
          console.log(res, 'ddd')
          if (/Error/.test(res)) {
            this.filterNum = 0
          }
        })
    },
    save() {
      if (!this.editId) {
        if (this.radio == '1') {
          sendMessageApi
            .addSmsPackage({
              name: this.form.name,
              numberTotal: this.receiveNumber,
              type: 1,
              token: this.token,
              fileUrl: this.fileName,
              audienceId: this.audiencePackageId,
              projectId: this.projectId,
              rawFileName: this.rawFileName
            })
            .then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.handleList()
              }
            })
        } else {
          sendMessageApi
            .addSmsPackage({
              name: this.form.name,
              numberTotal: this.receiveNumber,
              type: 2,
              token: this.token,
              fileUrl: this.fileName,
              audienceId: this.audiencePackageId,
              projectId: this.projectId
            })
            .then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.handleList()
              }
            })
        }
      } else {
        if (this.radio == '1') {
          sendMessageApi
            .updateSmsPackage({
              name: this.form.name,
              numberTotal: this.receiveNumber,
              type: 1,
              token: this.token,
              fileUrl: this.fileName,
              audienceId: this.audiencePackageId,
              projectId: this.projectId,
              id: this.editId,
              rawFileName: this.rawFileName
            })
            .then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.handleList()
              }
            })
        } else {
          sendMessageApi
            .updateSmsPackage({
              name: this.form.name,
              numberTotal: this.receiveNumber,
              type: 2,
              token: this.token,
              fileUrl: this.fileName,
              audienceId: this.audiencePackageId,
              projectId: this.projectId,
              id: this.editId
            })
            .then(({ data }) => {
              console.log(data)
              if (data.code == 0) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogVisible = false
                this.handleList()
              }
            })
        }
      }
    },
    deleteN(id) {
      var that = this
      this.$confirm('是否确认删除?')
        .then(_ => {
          console.log('>>>>dddd')

          sendMessageApi
            .deletePackage({
              id
            })
            .then(({ data }) => {
              console.log(data, 'lll')
              if ((data.code = 0)) {
                console.log(data, 'lll')

                that.$message({
                  message: '删除成功',
                  type: 'success'
                })
                that.handleList()
              } else {
                that.handleList()
              }
            })
          done()
        })
        .catch(_ => {
          console.log('>>>>')
        })
    },
    update(row) {
      this.drawerTitle = '号码包管理'
      this.editId = row.id
      this.rawFileName=row.rawFileName
      sendMessageApi
        .initSmsPackage({
          id:row.id
        })
        .then(({ data }) => {
          console.log(data, 'zzz')
          this.dialogVisible = true
          this.form.name = data.data.name
          this.fileName = data.data.fileUrl

          if (data.data.type == 1) {
            this.projectId = data.data.projectId == 0 ? '' : data.data.projectId
            this.audiencePackageId =
              data.data.audienceId == 0 ? '' : data.data.audienceId
            this.fileList = []
            this.fileList.push({
              name: data.data.rawFileName
            })
            this.receiveNumber = data.data.numberTotal
          } else {
            this.radio = '2'
            this.projectId = data.data.projectId
            console.log('bian', this.receiveNumber)
            sendMessageApi
              .getAllAudiencePackage({
                projectId: this.projectId
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.receiveNumber = data.data.numberTotal
                  console.log(res, 'rrrr')
                  this.audiencePackageList = res.data.data
                  this.audiencePackageId = data.data.audienceId
                }
              })
          }
        })
    },
    closeDra() {
      this.form.name = ''
      this.radio = '1'
      this.projectId = ''
      this.audiencePackageId = ''
      this.receiveNumber = 0
      this.fileList = []
    },
    nuberUpdate() {
      sendMessageApi
        .addFilterPackage({
          id: this.id,
          fileUrl: this.fileName,
          rawFileName: this.rawFileName,
          type: 3,
          token: this.token,
          numberTotal: this.filterNum
        })
        .then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            this.$message.success('更新成功')
            this.dialogVisibleMin = false
            this.handleList()
          }
        })
    },
    filterNumberM() {
      this.filterNum = 0
      this.dialogVisibleMin = true
      sendMessageApi.initFilterPackagePage({}).then(({ data }) => {
        console.log(data)
        this.filterNum = data.data.numberTotal
        this.id = data.data.id
        this.fileList.push({
          name: data.data.rawFileName
        })
      })
    }
  }
}
</script>
