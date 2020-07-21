<template>
  <basic-container>
    <el-row>
      <el-button type="primary" @click="addDialog">新增</el-button>
    </el-row>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @size-change="handleSizeChange"
      @current-change="currentChange"
    >
      <template slot="isDefault" slot-scope="scope">{{ scope.row.isDefault?'是':'' }}</template>
      <template slot="isDisable" slot-scope="scope">{{ scope.row.isDisable?'是':'' }}</template>
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-edit" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          icon="el-icon-delete"
          type="text"
          size="small"
          @click="handleDel(scope.row.id)"
        >刪除</el-button>
      </template>
    </avue-crud>

    <el-dialog title="通道" :visible.sync="addVisible" @closed="dialogClosed" width="650px">
      <el-form :model="addForm" ref="addForm" :rules="rules" class="pipe">
        <el-row>
          <el-form-item class="pipeSel" label="通道名" label-width="120px" prop="name">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="pipeSel" label="启用状态" label-width="120px" prop="isDisable">
            <el-checkbox v-model="addForm.isDisable">禁用</el-checkbox>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="pipeSel" label="通道编码" label-width="120px" prop="code">
            <el-input v-model="addForm.code" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="pipeSel" label="设为默认" label-width="120px" prop="isDefault">
            <el-checkbox v-model="addForm.isDefault">默认</el-checkbox>
          </el-form-item>
        </el-row>
        <el-form-item label="剩余条数" label-width="120px" prop="surplusNumber">
          <el-input v-model.number="addForm.surplusNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单次最大条数" label-width="120px" prop="maxEachtimeNumber">
          <el-input v-model.number="addForm.maxEachtimeNumber" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSmschannel">保 存</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>
<script>
import * as messagePipeApi from '@/api/project/messagePipe'
import { tableOption } from '@/const/crud/admin/sys-messagePipe'
import axios from 'axios'

export default {
  data() {
    var checkT = (rule, value, callback) => {
      if (value > this.addForm.surplusNumber) {
        callback(new Error('单次最大条数不得大于剩余条数'))
      } else {
        callback()
      }
    }
    var intT = (rule, value, callback) => {
      if (/^[0-9]+$/.test(value)) {
        if (value == 0) {
          callback(new Error('请填写正整数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请填写正整数'))
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
      tableOption,
      addVisible: false,
      addForm: {
        isDefault: false,
        isDisable: false,
        name: '',
        code: '',
        surplusNumber: '',
        maxEachtimeNumber: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入通道', trigger: 'change' },
          { max: 50, message: '长度在 50 个字符以内', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入通道编码', trigger: 'change' },
          { max: 50, message: '长度在 50 个字符以内', trigger: 'change' }
        ],
        surplusNumber: [
          { required: true, message: '请输入剩余条数', trigger: 'change' },
          { type: 'number', message: '必须为数字值', trigger: 'change' },
          { validator: intT, trigger: 'blur' }
        ],
        maxEachtimeNumber: [
          { required: true, message: '请输入单词最大条数', trigger: 'change' },
          { type: 'number', message: '必须为数字值', trigger: 'change' },
          { validator: checkT, trigger: 'blur' },
          { validator: intT, trigger: 'blur' }
        ]
      },
      editJudge: false
    }
  },
  created() {
    this.handleList()
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
    addDialog() {
      this.addVisible = true
      this.editJudge = false
    },
    handleEdit(payload) {
      // for (let m in this.addForm) {
      //   this.addForm[m] = payload[m]
      // }
      this.addForm={
        ...this.addForm,
        ...payload
      }
      this.addForm.id = payload.id
      this.addVisible = true
      if (this.addForm.isDefault == 1) {
        this.addForm.isDefault = true
      } else {
        this.addForm.isDefault = false
      }
      if (this.addForm.isDisable == 1) {
        this.addForm.isDisable = true
      } else {
        this.addForm.isDisable = false
      }
      console.log(this.addForm)
      this.editJudge = true

      //  this.$refs['addForm'].validate(valid=>{
      //   if(valid){
      //     if(this.addForm.isDefault){
      //       this.addForm.isDefault=1
      //     }else{
      //       this.addForm.isDefault=0
      //     }
      //     if(this.addForm.isDisable){
      //       this.addForm.isDisable=1
      //     }else{
      //       this.addForm.isDisable=0
      //     }
      //     messagePipeApi.putSmschannel({
      //       ...this.addForm,
      //       id:payload.id
      //     }).then(({data})=>{
      //       console.log(data)
      //        if (data.code === 0) {
      //         this.addVisible = false
      //         this.$message({
      //           message: '修改成功',
      //           type: 'success'
      //         })
      //         this.handleList()
      //       }
      //     })
      //   }else{
      //     return false

      //   }
      // })
    },
    handleDel(payload) {
      this.$confirm('您确认要删除这条短信通道吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          messagePipeApi
            .deleteSmschannel({
              id: payload
            })
            .then(({ data }) => {
              if (data.code === 0) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.handleList()
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
    handleList() {
      this.tableLoading = true

      messagePipeApi
        .getSmschannelList({
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
    saveSmschannel() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.addForm.isDefault) {
            this.addForm.isDefault = 1
          } else {
            this.addForm.isDefault = 0
          }
          if (this.addForm.isDisable) {
            this.addForm.isDisable = 1
          } else {
            this.addForm.isDisable = 0
          }
          if (this.editJudge) {
            messagePipeApi
              .putSmschannel({
                ...this.addForm
              })
              .then(({ data }) => {
                if (data.code === 0) {
                  this.addVisible = false
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.handleList()
                }
              })
          } else {
            messagePipeApi
              .postSmschannel({
                ...this.addForm
              })
              .then(({ data }) => {
                console.log(data)
                if (data.code === 0) {
                  this.addVisible = false
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.handleList()
                }
              })
          }
        } else {
          return false
        }
      })
    },
    dialogClosed() {
      this.addForm={
        isDefault: false,
        isDisable: false,
        name: '',
        code: '',
        surplusNumber: '',
        maxEachtimeNumber: ''
      },
      this.$refs['addForm'].resetFields()
      console.log('resetFields了吗')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.pipe .el-input {
  width: 200px;
}
.pipeSel {
  float: left;
}
/deep/.el-dialog__footer {
  text-align: center;
}
</style>