<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @size-change="handleSizeChange"
      @search-change="handleSearchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
    >
      <template slot="search">
        <el-form-item label="投放日期">
          <el-date-picker
            v-model="searchForm.putTime"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            style="width:250px!important"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="投放负责人">
          <el-input
            v-model="searchForm.likeName"
            placeholder="负责人模糊查询"
            size="small"
          />
        </el-form-item>
        <el-button style="float:right" @click="addR" type="primary"
          >新增投放记录</el-button
        >
      </template>
      <template slot="id" slot-scope="scope">
        <el-button type="text" @click="deleteR(scope.row.id)">删除</el-button>
      </template>
      <template slot="remark" slot-scope="scope">
        <span :title="scope.row.remark">{{
          scope.row.remark.length > 10
            ? scope.row.remark.substring(0, 10) + '...'
            : scope.row.remark
        }}</span>
      </template>
      <template slot="industryId" slot-scope="scope">
        {{ computedInd(scope.row.industryId) }}
      </template>
    </avue-crud>
    <avue-drawer
      title="新增投放记录"
      width="600"
      show-close
      v-model="dialogVisible"
    >
      <el-form :model="form" :rules="rules" ref="form" size="small">
        <h3>基本信息:</h3>
        <el-form-item prop="title" label="投放标题：" label-width="110px">
          <el-input v-model="form.title" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="投放负责人：" label-width="110px">
          <el-input v-model="form.name" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item prop="putTime" label="投放日期：" label-width="110px">
          <el-date-picker
            v-model="form.putTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width:200px"
          >
          </el-date-picker>
        </el-form-item>
        <h3>数据部分:</h3>
        <el-form-item
          prop="industryId"
          label="包所属行业："
          label-width="110px"
        >
          <el-select v-model="form.industryId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="packageName" label="包名称：" label-width="110px">
          <el-input v-model="form.packageName" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item prop="packageId" label="包ID：" label-width="110px">
          <el-input v-model="form.packageId" class="inputWidth"></el-input>
        </el-form-item>
        <h3>投放信息:</h3>
        <el-form-item prop="putChannel" label="投放渠道：" label-width="110px">
          <el-input v-model="form.putChannel" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item prop="putNumber" label="投放数量：" label-width="110px">
          <el-input v-model="form.putNumber" class="inputWidth"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注说明：" label-width="110px">
          <el-input
            v-model="form.remark"
            type="textarea"
            rows="6"
            style="width:410px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="primary" @click="addRecord">保存</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </avue-drawer>
  </basic-container>
</template>
<script>
// import * as projectApi from "@/api/project/project";
import { tableOption } from '@/const/project/putRecord'
import * as putRecordApi from '@/api/system/putRecord'
import { getSelectList } from '@/api/project/industry-sign'

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
      form: {
        title: '',
        name: '',
        putTime: '',
        industryId: '',
        packageName: '',
        packageId: '',
        putChannel: '',
        putNumber: '',
        remark: ''
      },
      searchForm: {
        putTime: [],
        likeName: ''
      },
      dialogVisible: false,
      rules: {
        title: [
          { required: true, message: '请填写投放标题', trigger: 'change' },
          { max: 50, message: '长度在50个字符以内', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写投放负责人', trigger: 'change' },
          { max: 50, message: '长度在50个字符以内', trigger: 'change' }
        ],
        putTime: [
          { required: true, message: '请选择投放日期', trigger: 'change' }
        ],
        industryId: [
          { required: true, message: '请选择包所属行业', trigger: 'change' }
        ],
        packageName: [
          { required: true, message: '请填写包名称', trigger: 'change' },
          { max: 50, message: '长度在50个字符以内', trigger: 'change' }
        ],
        packageId: [
          { required: true, message: '请填写包ID', trigger: 'change' },
          { max: 50, message: '长度在50个字符以内', trigger: 'change' }
        ],
        putChannel: [
          { required: true, message: '请填写投放渠道', trigger: 'change' },
          { max: 50, message: '长度在50个字符以内', trigger: 'change' }
        ],
        putNumber: [
          { required: true, message: '请填写投放数量', trigger: 'change' },
          {
            pattern: /^[+]{0,1}(\d+)$/,
            message: '数量必须为正整数',
            trigger: 'change'
          }
        ]
      },

      options: []
    }
  },
  created() {
    this.getOptions()
  },
  mounted() {
    this.handleSearchChange()
  },
  computed: {
    computedInd() {
      return function(value) {
        return this.options.find(ele => ele.value == value).label
      }
    }
  },

  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList(this.searchForm)
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList(this.searchForm)
    },
    handleSearchChange(payload) {
      this.page.currentPage = 1
      this.handleList(this.searchForm)
    },

    handleList(payload) {
      this.tableLoading = true
      console.log('payload.putTime.', payload)
      if (payload.putTime && payload.putTime.length != 0) {
        payload.putStartTime = payload.putTime[0]
        payload.putEndTime = payload.putTime[1]
      } else {
        payload.putStartTime = null
        payload.putEndTime = null
      }

      //   delete payload.putTime
      putRecordApi
        .getList({
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
    },
    searchReset() {
      this.searchForm = {}
    },
    deleteR(id) {
      this.$confirm('是否确认删除?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          putRecordApi
            .deleteRecord({
              id
            })
            .then(({ data }) => {
              if (data.code != 0) {
                this.$message({
                  type: 'warning',
                  message: data.msg
                })
              } else {
                this.handleSearchChange()
                this.$message({
                  type: 'success',
                  message: '删除成功'
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
    addR() {
      this.dialogVisible = true
    },
    getOptions() {
      getSelectList().then(({ data }) => {
        var payload = data.data
        const pay = payload.map(item => ({
          label: item.name,
          value: item.id
        }))

        this.options = pay
      })
    },
    addRecord() {
      const {
        title,
        name,
        putTime,
        industryId,
        packageName,
        packageId,
        putChannel,
        putNumber,
        remark
      } = this.form
      this.$refs.form.validate(valid => {
        if (!valid) return
        putRecordApi
          .addRecord({
            title,
            name,
            putTime,
            industryId,
            packageName,
            packageId,
            putChannel,
            putNumber,
            remark
          })
          .then(({ data }) => {
            if (data.code == 0) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.dialogVisible = false
              this.$refs.form.resetFields()
              this.handleSearchChange()
            } else {
              this.$message({
                type: 'warning',
                message: data.msg
              })
            }
          })
      })
    }
  }
}
</script>
<style lang="scss">
.inputWidth {
  width: 300px;
}
</style>
