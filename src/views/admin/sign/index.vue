<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @size-change="onSizeChange"
        @search-change="searchChange"
        @current-change="currentChange"
        @search-reset="searchQuery = {
          industryName:'',
          signName:'',
          categories:[]
        }"
      >
        <template slot="search">
          <!-- <el-form-item label="批次">
            <el-input
              v-model="searchQuery.batchNumber"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              size="small"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="签名">
            <el-input v-model="searchQuery.signName"></el-input>
          </el-form-item>
          <el-form-item label="行业">
            <el-select v-model="searchQuery.industryName" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签名级别">
            <el-select
              v-model="searchQuery.categories"
              multiple
              placeholder="请先选择行业"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="menuLeft">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click.stop="handleAdd()"
            >新增</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.stop="batchEdit()"
            >批量编辑</el-button
          >
        </template>
        <template slot="rawSignName" slot-scope="scope"
          >【{{ scope.row.rawSignName }}】</template
        >
        <template slot="categoryId" slot-scope="scope">{{
          scope.row.hasExtSignName
            ? ''
            : scope.row.categoryId && scope.row.categoryId == -1
            ? ''
            : scope.row.categoryId
        }}</template>
        <template slot="hasExtSignName" slot-scope="scope">{{
          scope.row.hasExtSignName == true ? '有' : ''
        }}</template>
        <template slot-scope="scope" slot="menu">
          <el-button
            icon="el-icon-edit"
            type="text"
            size="small"
            @click="editRow(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="text"
            size="small"
            @click="onDeleteRow(scope.row)"
            >刪除</el-button
          >
        </template>
        <template slot="batchNumber" slot-scope="scope"
          >{{ scope.row.year }}年{{ scope.row.industryName }}第{{
            scope.row.batchNumber
          }}批</template
        >
      </avue-crud>
       <el-dialog
      :visible.sync="dialogVisible"
      class="editForm"
      width="950px"
      title="编辑"
      @closed="handleClose"
    >
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="签名" prop="sign">
            <el-input
              :value="form.sign"
              @input="changeFormSignNames"
            ></el-input>
          </el-form-item>
          <el-form-item label="行业名称">
            <el-select
              :value="form.industryId"
              :disabled="extraJudge"
              placeholder="请选择"
              @input="changeFormIndustryId"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="级别" prop="categoryId">
            <el-input
              :disabled="extraJudge"
              :value="form.categoryId"
              @input="changeFormCategoryId"
            ></el-input>
          </el-form-item>
          <div style="width:100%">
            <el-form-item label="签名扩展" style="width:100%">
              <el-button @click="addExtend">+添加扩展</el-button>
              <div v-for="(item, index) in form.signListData" :key="index">
                <signItem
                  :extend-index="index"
                  :extend="item"
                  @deleteExtend="deleteExtend"
                ></signItem>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="buttonLoading" type="primary" @click="editSign"
          >保 存</el-button
        >

        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addDialogVisible"
      width="700px"
      title="新增签名"
      @closed="handleClose"
    >
      <el-form
        ref="addForm"
        :rules="addRules"
        :model="addForm"
        class="addForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="行业" prop="industry">
              <el-select
                v-model="addForm.industry"
                placeholder="请选择"
                @change="changeValue"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <i class="el-icon-date" />
            {{ nowYear }}年 <strong>{{ selection }}</strong> 第
            <el-form-item class="batchNumber" prop="batchNumber">
              <el-input v-model="addForm.batchNumber"></el-input> </el-form-item
            >批次
          </el-col>
        </el-row>

        <el-form-item label="签名信息" prop="signList" class="signList">
          <el-input
            v-model="addForm.signList"
            :rows="20"
            type="textarea"
            style="width:83%"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button v-loading="buttonLoading" type="primary" @click="saveSign"
          >保 存</el-button
        >

        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="batchEditVisable"
      class="batch"
      @closed="closeBatch"
      width="900px"
      :modal="true"
      :append-to-body="false"
      :close-on-click-modal="false"
    >
      <div
        v-show="checkList.length == 0"
        style="text-align:center;margin-top:30px;"
      >
        {{ batchNull }}
      </div>
      <el-row v-show="checkList.length != 0" style="min-height:40px">
        <el-checkbox-group v-model="checkedContent">
          <el-checkbox
            v-for="(item, index) in checkList"
            :label="item.id"
            :key="index"
            >{{ item.signName }}</el-checkbox
          >
        </el-checkbox-group>
      </el-row>
      <el-row v-show="checkList.length != 0">
        <el-checkbox style="margin-top:20px" v-model="allChecked">全选</el-checkbox>
        
        <el-col :span="24" style="min-height:20px;margin-top:18px"
          >当前已选择 <span style="margin:0 6px">{{ signNum }}</span> 个签名
          <span v-show="checkedContent.length != 0" style="margin-right:5px"
            >:</span
          >
          <span style="color:red">{{ signChecked }}</span>
        </el-col>
      </el-row>
      <el-row v-show="checkList.length != 0">
        <el-col :span="24" style="display:flex;height:40px;line-height:40px"
          ><div style="margin-right:5px">批量设置 :</div>
          行业
          <el-select
            v-model="setForm.industryName"
            size="mini"
            style="width:100px;margin:0 15px 0 5px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in batchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          级别
          <el-input
            v-model="setForm.category"
            size="mini"
            style="width:100px;margin:0 5px"
          ></el-input>
        </el-col>
      </el-row>
      <span slot="title">
        <el-form v-model="batchForm" :inline="true" :show-close="false">
          <el-form-item label="行业名称">
            <el-select v-model="batchForm.industryName" placeholder="请选择">
              <el-option
                v-for="item in batchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签名级别">
            <el-select v-model="batchForm.category" placeholder="请选择">
              <el-option
                v-for="item in batchLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="getBatchSign">查询</el-button>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer" v-show="checkList.length != 0">
        <el-button type="primary" @click="saveBatch">保存</el-button>
        <el-button @click="batchEditVisable = false">返回</el-button>
      </span>
    </el-dialog>
    </basic-container>
   
  </div>
</template>

<script>
import { tableOption } from '@/const/crud/admin/sign'
import * as signApi from '@/api/project/industry-sign'
import signItem from './signItem'
import { mapGetters } from 'vuex'

export default {
  name: 'Label',
  components: {
    signItem
  },
  data() {
    var validateList = (rule, value, callback) => {
      if (value.indexOf('^') != -1) {
        callback(new Error('不能输入带有^符号'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      dialogVisible: false,
      addDialogVisible: false,
      // form: {
      //   sign:'',
      //   categoryId:''
      // },
      batchNull: '请先选择行业',
      addForm: {
        batchNumber: '',
        industry: '',
        signList: ''
      },
      allChecked:false,
      buttonLoading: false,
      dialogData: {
        categoryId: ''
      },
      idList: [],
      idObj: {},
      rules: {
        sign: [{ required: true, message: '请输入签名', trigger: 'blur' }],
        categoryId: [
          // {
          //   pattern: /^(\-|\+?)\d+(\.\d+)?$/,
          //   message: '级别必须为数字',
          //   trigger: 'change'
          // }
        ]
      },
      addRules: {
        batchNumber: [
          { required: true, message: '请输入批次', trigger: 'change' },
          { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择行业', trigger: 'change' }
        ],
        signList: [
          { required: true, message: '请输入签名信息', trigger: 'change' },
          { validator: validateList, trigger: 'change' }
        ]
      },
      options: [],
      batchOptions: [],
      selection: '',
      searchQuery: {
        industryName: '',
        signName: '',
        categories: []
      },
      batchEditVisable: false,
      // extraJudge:false
      batchForm: {
        industryName: '',
        category: ''
      },
      setForm: {
        industryName: '',
        category: ''
      },

      levelOptions: [],
      batchLevelOptions: [],
      checkList: [],
      checkedContent: []
    }
  },
  computed: {
    nowYear: function() {
      return new Date().getFullYear()
    },

    ...mapGetters(['form', 'controlSign']),
    extraJudge: function() {
      if (this.form.signListData.length == 0) {
        return false
      } else {
        return true
      }
    },
    signNum: function() {
      return this.checkedContent.length
    },
    signChecked: function() {
      let arr = []
      this.checkedContent.forEach(item => {
        this.checkList.forEach(ele => {
          if (item == ele.id) {
            arr.push(ele.signName)
          }
        })
      })
      console.log(this.checkedContent, 'checkedContent')
      return arr.join(',')
    },
    industryNameLabel: function() {
      var j
      this.batchOptions.forEach(item => {
        if (this.setForm.industryName == item.value) {
          j = item.label
        }
      })
      return j
    }
  },

  created() {
    this.getSelectList()
    this.searchChange()
  },
  mounted() {
    if (this.controlSign.judge) {
          signApi.getSelectList().then(({ data }) => {
            var payload = data.data
            const pay = payload.map(item => ({
              label: item.name,
              value: item.id
            }))
            this.batchOptions = JSON.parse(JSON.stringify(pay))

            this.batchForm.industryName = this.controlSign.und
            
this.batchEditVisable = true
          })
          
          
        }
   
  },

  methods: {
    onSizeChange(val) {
      this.page.pageSize = val
      this.getSignList(this.searchQuery)
    },
    changeFormCategoryId(value) {
      this.$store.dispatch('sign/formChange', {
        name: 'categoryId',
        value: value
      })
    },
    changeFormIndustryId(value) {
      this.$store.dispatch('sign/formChange', {
        name: 'industryId',
        value: value
      })
    },
    changeFormSignNames(value) {
      this.$store.dispatch('sign/formChange', {
        name: 'sign',
        value: value
      })
    },
    addExtend() {
      const extend = {
        categoryId: '',
        industryId: '',
        signNames: ''
      }
      this.$store
        .dispatch('sign/addExtend', {
          ...extend
        })
        .catch(e => {
          if (typeof e === 'string') {
            this.$message({
              message: e,
              type: 'warning'
            })
          }
        })
    },
    deleteExtend(index) {
      this.$store
        .dispatch('sign/deleteExtend', {
          index
        })
        .catch(e => {
          if (typeof e === 'string') {
            this.$message({
              message: e,
              type: 'warning'
            })
          }
        })
    },
    getSelectList() {
      signApi.getSelectList().then(({ data }) => {
        var payload = data.data
        this.idList = payload
        const pay = payload.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.batchOptions = JSON.parse(JSON.stringify(pay))
        // pay.unshift({
        //   label: '全部',
        //   value: ''
        // })
        this.options = pay

        // for (var c of tableOption.column) {
        //   if (c.label === '行业名称') {
        //     c.dicData = pay
        //   }
        // }
      
      })
    },
    searchChange(params) {
      console.log(this.searchQuery)
      this.page.currentPage = 1
      this.getSignList(this.searchQuery)
    },
    onDeleteRow(row, index) {
      this.$msgbox({
        message: '确认删除吗?',
        title: '提示',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            signApi
              .deleteSign({
                id: row.id
              })
              .then(({ data }) => {
                if (data.code === 0) {
                  this.getSignList(this.searchQuery)
                  instance.confirmButtonLoading = false

                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                }
              })
              .finally(() => {
                done()
              })
          } else {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
            done()
          }
        }
      })
    },
    changeValue(value) {
      var obj = {}
      obj = this.idList.find(item => {
        return item.id === value
      })
      this.selection = obj.name
      console.log('changeValue', value)
      console.log(this.idList)
      this.idList.forEach(item => {
        if (item.id === value) {
          let batchNumber = item.batchNumber
          this.addForm.batchNumber = ++batchNumber
        }
      })
      console.log(this.addForm, '????')
    },
    getSignList(payload) {
      this.tableLoading = true
      const page = {
        current: this.page.currentPage,
        size: this.page.pageSize
      }

      var query
      console.log(this.idList, 'idlist', payload)
      var industryCode = this.idList.find(item => {
        return item.id == payload.industryName
      })

      if (payload.industryName === ''||payload.industryName ===undefined) {
        query = {
          categories: payload.categories,
          signName: payload.signName || '',
          industryCodes: []
        }
      } else {
        query = {
          categories: payload.categories,
          industryCodes: [industryCode.code],
          signName: payload.signName
        }
      }

      signApi
        .getSignList({
          ...page,
          ...query
        })
        .then(({ data }) => {
          const payload = data.data

          this.tableData = payload.records
          this.page.total = payload.total
          this.tableLoading = false
        })
    },
    editRow(payload) {
      console.log(payload, '编辑')
      console.log(this.form, '编辑')

      //       this.form={
      //         ...this.form,
      // sign:payload.rawSignName,
      // categoryId:payload.categoryId,
      // industryName:payload.industryName
      //       }
      this.dialogData = payload
      this.dialogVisible = true

      for (var p of this.idList) {
        console.log(p)
        if (p.name === payload.industryName) {
          this.idObj['industryId'] = p.id
        }
      }
      this.idObj['id'] = payload.id

      this.$store
        .dispatch('sign/getSignInit', {
          id: payload.id
        })
        .then(res => {
          // console.log('store ,sign 调试2',this.$store.state.sign.signListData)
          // console.log(this.signListData)
        })
    },
    saveSign() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          console.log(this.addForm, 'addFormaddFormaddForm')
          //     for (var p of this.idList) {
          //       if (p.code === this.addForm.industry) {
          //         var industryId = p.id
          //       }
          //     }
          //     console.log(industryId)
          //   //   const loading = this.$loading({
          //   //   lock: true,
          //   //   text: 'Loading',
          //   //   spinner: 'el-icon-loading',
          //   //   background: 'rgba(0, 0, 0, 0.7)'
          //   // });
          var signList = this.addForm.signList.split('\n').filter(item => {
            return item !== ''
          })
          signApi
            .addSign({
              batchNumber: parseInt(this.addForm.batchNumber, 10),
              industryId: this.addForm.industry,
              signList: signList
            })
            .then(({ data }) => {
              // loading.close();
              this.buttonLoading = false

              if (data.code === 0) {
                this.getSignList(this.searchQuery)

                this.$message({
                  message: data.msg,
                  type: 'success'
                })
              }
              this.addDialogVisible = false
            })
            .catch(() => {
              this.buttonLoading = false

              // this.addDialogVisible = false
            })
        } else {
          return false
        }
      })
    },
    handleClose() {
      if (this.$refs['addForm']) {
        this.$refs['addForm'].resetFields()
      }
      if (this.$refs['form']) {
        // this.$refs['form'].resetFields();
        this.$store.dispatch('sign/clearForm', {})
      }
    },
    editSign() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          var extSignNames = JSON.parse(JSON.stringify(this.form.signListData))
          extSignNames.forEach(item => {
            item.signNames = item.signNames.split('\n')
            item.signNames = item.signNames.filter(item => {
              return item !== ''
            })
          })
          console.log(extSignNames, 'extSignNames')
          var obj = {
            id: this.idObj.id,
            industryId: this.form.industryId,
            sign: this.form.sign,
            categoryId: extSignNames.length == 0 ? this.form.categoryId : '-1',
            extSignNames: extSignNames
          }
          if (this.extraJudge) {
            obj = {
              ...obj,
              industryId: this.form.industryId,
              categoryId: this.form.categoryId
            }
          } else {
            obj = {
              ...obj,
              extSignNames: []
            }
          }
          console.log(this.form.industryId, 'industryId')
          signApi
            .editList(obj)
            .then(({ data }) => {
              if (data.code === 0) {
                this.getSignList(this.searchQuery)

                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
              this.buttonLoading = false
              this.dialogVisible = false
            })
            .catch(() => {
              this.buttonLoading = false
              // this.dialogVisible = false
            })
        } else {
          return false
        }
      })
    },
    handleAdd() {
      this.addDialogVisible = true
    },
    currentChange(page) {
      this.page.currentPage = page

      this.getSignList(this.searchQuery)
    },
    batchEdit() {
      this.batchEditVisable = true
    },
    getAllcate(value, payload) {
      signApi
        .getAllcate({
          industryId: value
        })
        .then(({ data }) => {
          console.log(data, '行业')
          if (payload === 1) {
            this.searchQuery.categories = []
            this.levelOptions = data.data.map(ele => ({
              label: ele,
              value: ele
            }))
            this.levelOptions.forEach(item => {
              if (item.label == -1) {
                item.label = '未定级'
              }
            })
            console.log(this.levelOptions, '???')
          } else {
            this.batchForm.category = ''
            this.batchLevelOptions = data.data.map(ele => ({
              label: ele,
              value: ele
            }))
            this.batchLevelOptions.forEach(item => {
              if (item.label == -1) {
                item.label = '未定级'
              }
            })
             if (this.controlSign.judge) {
            this.batchForm.category = '-1'
            this.$store.dispatch('sign/controlSign', {
              judge: false
            })
            this.getBatchSign()
          }
          }
         
        })
    },
    getBatchSign() {
      signApi
        .getBatchSign({
          industryId: this.batchForm.industryName,
          categoryId: this.batchForm.category
        })
        .then(({ data }) => {
          console.log(data, 'fff')
          this.checkList = []
      this.checkedContent = []
      this.allChecked=false
          if (data.data.length == 0) {
            this.batchNull = '暂无签名'
            this.checkList = []
          } else {
            data.data.forEach(ele => {
              ele.checked = false
            })
            this.checkList = data.data
            console.log(this.checkList, 'checkList')
          }
        })
    },
    saveBatch() {
      signApi
        .editBatchSign({
          category: this.setForm.category,
          industryId: this.setForm.industryName,
          industryName: this.industryNameLabel,
          signIds: this.checkedContent
        })
        .then(({ data }) => {
          console.log(data, '修改批量')
          if (data.code == 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.batchEditVisable = false
            this.getSignList(this.searchQuery)
          }
        })
    },
    closeBatch() {
      this.batchForm.industryName = ''
      this.batchForm.category = ''
      this.checkList = []
      this.checkedContent = []
      this.setForm.industryName = ''
      this.setForm.category = ''
    }
  },
  watch: {
    'searchQuery.industryName': {
      handler(value) {
        if(value){
        this.getAllcate(value, 1)

        }
      },

      deep: true,
      immediate: true
    },
    'batchForm.industryName': {
      handler(value) {
        if (value) {
          this.getAllcate(value, 2)
        } else {
          this.batchLevelOptions = []
        }
      },
      deep: true,
      immediate: true
    },
    $route: {
      handler(value) {
        
      },
      deep: true
    },
    allChecked(value){
      if(value==true){
        console.log('对的')
        this.checkList.forEach(ele=>{
          ele.checked=true
        })
        this.checkedContent=[]
        this.checkList.forEach(ele => {
            this.checkedContent.push(ele.id)
          
        })
      }else{
        this.checkedContent=[]
      }
    }
  }
}
</script>
<style lang="scss">
.addForm {
  .el-form-item {
    display: inline-block;
  }
  .el-textarea {
    width: 400px;
  }
  .signList {
    margin-top: 10px;
    display: block;
  }
}
.editForm {
  /deep/.el-form-item {
    display: inline-block;
  }
}
.batchNumber {
  .el-form-item__content {
    margin-left: 2px !important;
  }
  .el-input {
    width: 70px;
  }
}
.el-dialog__footer {
  text-align: center !important;
}
.batch /deep/.el-dialog__body {
  padding-top: 0;
  padding-left: 40px;
  padding-right: 40px;
  min-height: 130px;
}
</style>
