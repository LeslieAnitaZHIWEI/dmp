<template>
  <basic-container>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      style="width:700px;margin:0 auto"
    >
      <el-form-item prop="type" label="加密方式:" label-width="100px">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option label="MD5" :value="1"> </el-option>
          <el-option label="SHA256" :value="2"> </el-option>
          <el-option label="DES" :value="3"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="fileList"
        class="is-required"
        label="原始文件:"
        label-width="100px"
      >
        <el-upload
          class="upload-demo"
          action="#"
          drag
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :http-request="saveJsmodal"
          :file-list="fileList"
          :on-success="uploadSucess"
          :on-remove="uploadRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__text">只能上传 txt文件，且不超过 10m</div>
          <!-- {{ executeFileName }} -->

          
        </el-upload>
        <div style="font-size:12px;">
            文件格式要求：txt格式，每一行为一个加密源文本，不允许中间存在空行
          </div>
      </el-form-item>
      <div style="margin-left:100px">
        <el-button type="primary" @click="encryption">确认加密</el-button>
        <el-button @click="clear">清空</el-button>
      </div>
    </el-form>
  </basic-container>
</template>
<script>
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
import { encryption } from '@/api/system/encryption'
export default {
  data() {
    var validateList = (rule, value, callback) => {
      console.log(this.fileList, 'callback')
      console.log(value)
      if (this.fileList.length == 0) {
        callback(new Error('请上传文件'))
      } else {
        console.log(callback, 'callback')
        callback()
      }
    }
    return {
      form: {},
      rules: {
        type: [
          { required: true, message: '请选择加密方式', trigger: 'change' }
        ],
        fileList: [{ validator: validateList, trigger: ['blur', 'change'] }]
      },
      fileList: []
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    beforeUpload(file) {
      this.files = file
      var filename = file.name
      var index1 = filename.lastIndexOf('.')
      var index2 = filename.length
      var extension = filename.substring(index1, index2) === '.txt'

      const isLt1M = file.size / 1024 / 1024 < 10

      if (!extension) {
        this.$message.warning('上传文件只能是 txt格式!')
        this.files = ''
        return false
      }
      if (!isLt1M) {
        this.$message.warning('上传文件大小不能超过 10MB!')
        this.files = ''

        return false
      }
      this.rawFileName = file.name

      //   this.saveJsmodal()
      return true
    },
    saveJsmodal(params) {
      console.log(params, 'aaaa')
      params.onSuccess()
    },
    encryption() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        let fileFormData = new FormData()
        fileFormData.append('file', this.files)
        encryption({
          file: fileFormData,
          type: this.form.type
        }).then(res => {
          downloadBlob(res.data, getFileInfoFromHeader(res.headers))
        })
      })
    },
    clear() {
      this.fileList = []
      this.form.type = ''
    },
    uploadSucess(response, file, fileList) {
      console.log(response, file, fileList)
      this.fileList = fileList
      this.$refs.form.validateField('fileList')
    },
    uploadRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    }
  }
}
</script>
