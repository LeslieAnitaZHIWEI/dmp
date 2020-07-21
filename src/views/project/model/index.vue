<template>
  <div class="project">
    <basic-container>
      <avue-crud
        ref="crud"
        stripe
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @row-save="handleSave"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <template slot="version" slot-scope="scope">V {{scope.row.version}}</template>
        <template slot="modelDictId" slot-scope="scope">{{ typeDisplay(scope.row.modelDictId) }}</template>
        <template slot-scope="scope" slot="menu">
          <el-button icon="el-icon-edit" type="text" size="small" @click="onEditRow(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="text" size="small" @click="handleDel(scope.row)">刪除</el-button>
        </template>
      </avue-crud>

      <avue-drawer title="ETL模型" show-close v-model="etlOuterVisible" width="800">
        <div style="font-size:16px;line-height:2;padding: 5px 0 10px 0">

        <strong>抽取设置：</strong><span>第一次全量 每1天增量</span>

        </div>
        <strong style="font-size:16px;">数据源</strong>
        <el-table :data="etlData" style="width: 100%" v-loading="etltableloading" :stripe="true">
          <el-table-column label="表名" prop="tableName" align="center"></el-table-column>
          <el-table-column label="是否设置" prop="setUp" align="center">
            <template slot-scope="scope">{{ scope.row.setUp?'是':'否' }}</template>
          </el-table-column>
          <el-table-column label="操作" prop="operation" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" type="text" size="mini" @click="handleEdit(scope)">点击设置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          width="795px"
          title="设置"
          :visible.sync="innerVisible"
          append-to-body
          :close-on-click-modal="false"
        >
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
            <el-form-item
              label="目标表名"
              prop="targetTableName"
              :rules="[
              { required: true, message: '请输入目标表名', trigger: 'blur' },
              { ...formRuleMap.enNumUnder },
            ]"
            >
              <el-input v-model="ruleForm.targetTableName"></el-input>
            </el-form-item>
            <el-form-item label="抽取规则">
              <el-button icon="el-icon-plus" @click="addRuleRow"></el-button>
            </el-form-item>
            <el-row class="addRuleRow">
              <rule-row
                v-for="(item,index) in ruleForm.rules"
                :tableName="ruleForm.tableName"
                :rule="item"
                :ruleIndex="index"
                :key="index"
                :fieldList="ruleForm.fieldList"
                v-on:rule-value-change="onRuleValueChange"
                v-on:delete-rule-row="deleteRuleRow"
                v-on:show-convert="showConvertDialog"
              ></rule-row>
            </el-row>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmitRule">确定修改规则</el-button>
            <el-button @click="innerVisible = false">关闭</el-button>
          </div>
        </el-dialog>

        <div style="padding:40px 0 20px 0;text-align:center;">
          <el-button type="primary" @click="onSubmitTable" :loading="isEditingTable">保存至模型</el-button>
          <el-button @click="etlOuterVisible = false" icon="el-icon-right">返回</el-button>
        </div>
      </avue-drawer>

      <el-dialog title="计算模型" :visible.sync="jsOuterVisible" width="500px" style="text-align:center">

        <el-upload
          class="upload-demo"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <el-button slot="trigger" type="success" icon="el-icon-upload">上传算法文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传单个py格式文件，且不超过1m</div>
          <section>{{ executeFileName }}</section>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="saveJsmodal" type="primary">保存</el-button>
          <el-button @click="jsOuterVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <text-separator
        v-bind:show="textSeparatorDialog"
        v-on:hide="()=>{textSeparatorDialog = false}"
        v-on:get-convert-words="getConvertWords"
      ></text-separator>
    </basic-container>
  </div>
</template>


<script>
import * as modelApi from '@/api/project/model'
import { getSourcePermissionList } from '@/api/project/project'
import { editModelEtl } from '@/api/project/model-etl'
import { getModelDict } from '@/api/admin/dict'
import { tableOption } from '@/const/project/model'
import { pageOptionDefault } from '@/const/website'
import { rulesMap, eventPropOperateMap } from '@/const/project/user-tag'
import { dateFormat, getDayEnd, getDayStart } from '@/util/date'
import { FormRuleMap } from '@/const/formValid'
import request from '@/router/axios'

import { mapGetters } from 'vuex'
import ruleRow from './ruleRow'
import textSeparator from '@/components/text-separator';

export default {
  name: 'projectModelManage',
  components: {
    'rule-row': ruleRow,
    'text-separator': textSeparator
  },
  data() {
    return {
      tableData: [],
      etlData: [],
      etlModelId: null,
      searchForm: {},
      page: {
        ...pageOptionDefault
      },
      tableLoading: false,
      tableOption: tableOption,
      modelData: [],
      etlOuterVisible: false,
      innerVisible: false,
      etltableloading: false,
      ruleForm: {
        tableName: '',
        targetTableName: '',
        tableIndex: -1,
        rules: [],
        fieldList: []
      },
      rules: {},
      options: [],
      tableName: '',
      ruleList: [],
      jsOuterVisible: false,
      fileList: [],
      files: '',
      fileName: '',
      modelId: '',
      executeFileName: '',
      uploadJudge: false,
      isEditingTable: false,
      formRuleMap: FormRuleMap,

      textSeparatorDialog: false,

      textSeparatorIndex: null
    }
  },

  created() {
    if (this.projectId) {
      this.getList()
    }

    this.tableOption.column[2].dicData = [];

    /** 获得模型字典 */
    getModelDict().then(data => {
      this.modelData = data;

      this.tableOption.column[2].dicData = data.map(item => ({
        label: item.label,
        value: item.id
      }));

      /** 转成 ID */
      getSourcePermissionList({projectId: this.projectId}).then(({data}) => {

        if(data && data.code === 0) {
          const map = data.data;
          const list = this.modelData.filter((item) => {
            return map[item.value];
          }).map((item) => {
            return {
              label: item.label,
              value: item.id
            }
          });

          this.tableOption.column[2].dicData = list;
        }
      });

    });

  },

  watch: {
    projectId() {
      this.getList()
    }
  },

  mounted() {},

  computed: {
    ...mapGetters(['projectId']),
    typeDisplay: function() {
      return function(payload) {
        var type = ''
        this.modelData.forEach(item => {
          if (item.id == payload) {
            type = item.label
          }
        })
        return type
      }
    }
  },

  methods: {
    getList() {
      this.tableLoading = true
      this.tableData = []

      modelApi
        .getModelList({
          projectId: this.projectId,
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.tableData = data.data.map(item => {
              return {
                code: item.code,
                name: item.name,
                modelDictId: item.modelDictId,
                updateTime: item.updateTime,
                version: item.projectModelInstence
                  ? item.projectModelInstence.version
                  : '',
                id: item.id
              }
            })

            this.page.total = data.data.length
          }

          this.tableLoading = false
        })
        .catch(e => {
          this.tableLoading = false
        })
    },

    handleSave(row, done) {

      const {$modelDictId, ...other} = row;

      modelApi
        .addModel({
          ...other,
          projectId: this.projectId
        })
        .then(({ data }) => {
          this.getList()
          done()
        })
    },
    handleDel(rowData) {
      this.$confirm(
        '您确认删除名称为<strong>' + rowData.name + '</strong>的模型吗？',
        '提示',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        modelApi
          .deleteById({
            id: rowData.id
          })
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              this.getList()
            }
          })
          .catch(e => {})
      })
    },

    onEditRow(row) {

      const list = this.modelData;
      const map = {};

      for(let i = 0, l = list.length; i < l; i++ ){
        const item = list[i];
        map[item.value] = item.id;
      }

      switch (row.modelDictId) {
        case map['ETL']:
          this.etlOuterVisible = true
          this.etltableloading = true
          modelApi
            .getProjectmodeletl({
              id: row.id
            })
            .then(({ data }) => {
              this.etltableloading = false

              this.etlData = data.data.projectModelInstence.tables.map(item => {
                return {
                  ...item,
                  targetTableName:
                    item.targetTableName === null
                      ? item.tableName
                      : item.targetTableName
                }
              })
              this.etlModelId = data.data.projectModelInstence.modelId
            })
          break
        case map['CAL']:
          this.jsOuterVisible = true
          this.modelId = row.id
          this.executeFileName = ''
          modelApi
            .queryById({
              id: row.id
            })
            .then(({ data }) => {
              var executeFileName =
                data.data.projectModelInstence.executeFileName
              if (executeFileName != null) {
                this.executeFileName = executeFileName
              }
            })
          break
      }
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.page.currentPage = 1

      this.getList()
    },

    currentChange(val) {
      this.page.currentPage = val

      this.getList()
    },

    handleEdit(rowData) {
      this.innerVisible = true
      const rowIndex = rowData.$index
      const row = this.etlData[rowIndex]
      this.ruleForm.tableName = row.tableName
      this.ruleForm.targetTableName = row.targetTableName
      this.ruleForm.tableIndex = rowIndex

      /**
       * 深复制
       * 当值为undefined、function、symbol 会在转换过程中被忽略
       **/
      const rules =
        row.rules === null ? [] : JSON.parse(JSON.stringify(row.rules))
      this.ruleForm.rules = rules.map(item => {
        return {
          ...item,
          propertyValue: item.value,

          propertyValues:
            item.field === 'sign_name' &&
            (item.operator !== rulesMap.EXISTED.value &&
              item.operator !== rulesMap.NOT_EXISTED.value)
              ? item.value.split(',')
              : [],
          rangeDate: '',
          rangeNumber1: '',
          rangeNumber2: '',

          isGettingSign: false,
          signNameCancel: null,
          signNameList: [],
          fileList: [],
          operatorList: []
        }
      })

      this.getTableRules({
        tableName: this.ruleForm.tableName
      })
    },

    getTableRules(params) {
      this.ruleForm.fieldList = []

      if (this.tableRulesCancel) {
        this.tableRulesCancel.cancel()
      }

      const CancelToken = request.CancelToken
      this.tableRulesCancel = CancelToken.source()

      modelApi
        .getTableRules(
          {
            tableName: this.ruleForm.tableName
          },
          {
            cancelToken: this.tableRulesCancel.token
          }
        )
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            const map = data.data
            const list = []

            for (let i in map) {
              list.push({
                id: i,
                name: i,
                type: eventPropOperateMap[map[i]]
              })
            }

            this.ruleForm.fieldList = list
          }
        })
        .catch(e => {})
    },

    addRuleRow() {
      if (this.ruleForm.fieldList.length !== 0) {
        this.ruleForm.rules.push(this.createRuleData())
      }
    },

    createRuleData() {
      return {
        field: '',
        operator: '',
        operatorList: [],

        /** 真正的值 */
        propertyValue: '',

        /** 都是 propertyValue 衍生出来的值 */
        propertyValues: [],
        rangeDate: '',
        rangeNumber1: '',
        rangeNumber2: '',

        isGettingSign: false,
        signNameCancel: null,
        signNameList: []
      }
    },

    deleteRuleRow(params) {
      this.ruleForm.rules.splice(params.index, 1)
    },

    onRuleValueChange(params) {
      this.ruleForm.rules[params.ruleIndex][params.name] = params.value
    },

    handleRemove(file, fileList) {
      //console.log(file, fileList);
    },

    handlePreview(file) {
      //console.log(file);
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`)
    },
    saveJsmodal() {
      if (this.executeFileName == '') {
        this.uploadJudge = true
      } else {
        this.uploadJudge = false
      }

      if (this.uploadJudge) {
        if (this.fileName == '') {
          this.$message.warning('请选择要上传的文件！')
          return false
        }

        let fileFormData = new FormData()
        fileFormData.append('file', this.files)

        modelApi
          .editModal({
            file: fileFormData,
            modelId: this.modelId,
            projectId: this.projectId
          })
          .then(({ data }) => {
            if (data.code === 0) {
              this.jsOuterVisible = false
              this.$message({
                message: '上传成功',
                type: 'success'
              })
            }
            this.resetFilename()
          })
      } else if (this.uploadJudge === false && this.fileName === '') {
        this.jsOuterVisible = false
      } else if (this.uploadJudge === false && this.fileName !== '') {
        let fileFormData = new FormData()
        fileFormData.append('file', this.files)

        modelApi
          .editModal({
            file: fileFormData,
            modelId: this.modelId,
            projectId: this.projectId
          })
          .then(({ data }) => {
            if (data.code === 0) {
              this.jsOuterVisible = false
              this.$message({
                message: '上传成功',
                type: 'success'
              })
              this.resetFilename()
            }
          })
      }
     
    },
    resetFilename(){
 this.files = ''
      this.fileName = ''
      this.executeFileName = ''
    },
    beforeUpload(file) {
      this.files = file
      const extension = file.name.split('.')[1] === 'py'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!extension) {
        this.$message.warning('上传文件只能是 py 格式!')
        this.files = ''
        return false
      }
      if (!isLt1M) {
        this.$message.warning('上传模板大小不能超过 1MB!')
        this.files = ''

        return false
      }
      this.fileName = file.name
      this.executeFileName = file.name
      return false
    },

    /** 当确定修改规则时 */
    onSubmitRule() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.innerVisible = false

          /** 暂时存起来 */
          this.etlData[
            this.ruleForm.tableIndex
          ].targetTableName = this.ruleForm.targetTableName
          this.etlData[this.ruleForm.tableIndex].rules = JSON.parse(
            JSON.stringify(this.ruleForm.rules)
          )
          this.etlData[this.ruleForm.tableIndex].setUp =
            this.ruleForm.rules.length !== 0
        }
      })
    },

    /** 当确定修改表时 */
    onSubmitTable() {
      this.isEditingTable = true

      editModelEtl(this.getFormData())
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.etlOuterVisible = false

            this.$message({
              message: '修改成功',
              type: 'success'
            })

            this.getList()
          }

          this.isEditingTable = false
        })
        .catch(e => {
          this.isEditingTable = false
        })
    },

    /** 当确定修改表时 */
    getFormData() {
      const submitData = []

      const eData = this.etlData
      const eLen = eData.length

      for (let i = 0; i < eLen; i++) {
        const item = eData[i]

        if (item.setUp) {
          const data = {
            tableName: item.tableName,
            targetTableName: item.targetTableName,
            setUp: item.setUp,
            rules:
              item.rules === null
                ? []
                : item.rules.map(rule => {
                    /** 如果有修改，那么 rule 中会有 propertyValues 这个值 */
                    if (rule.propertyValues) {
                      let val = ''

                      /** 如果是区间 */
                      if (rule.operator === rulesMap.RANGE.value) {
                        if (rule.propertyTypeName === 'DATE') {
                          const startTime = new Date(rule.rangeDate[0])
                          const endTime = new Date(rule.rangeDate[1])

                          val = [
                            getDayStart(startTime),
                            getDayEnd(endTime)
                          ].join(',')
                        } else {
                          val = rule.rangeNumber1 + ',' + rule.rangeNumber2
                        }
                      } else {
                        if (
                          rule.field === 'sign_name' &&
                          (rule.operator !== rulesMap.EXISTED.value &&
                            rule.operator !== rulesMap.NOT_EXISTED.value)
                        ) {
                          val = rule.propertyValues.join(',')
                        } else {
                          val = rule.propertyValue
                        }
                      }

                      return {
                        field: rule.field,
                        operator: rule.operator,
                        value: val
                      }
                    } else {
                      return {
                        field: rule.field,
                        operator: rule.operator,
                        value: rule.value
                      }
                    }
                  })
          }

          submitData.push(data)
        }
      }

      return {
        modelId: this.etlModelId,
        projectId: this.projectId,
        tables: submitData
      }
    },
    showConvertDialog(data) {
      this.textSeparatorDialog = true
      this.textSeparatorIndex = data.index
    },

    getConvertWords(data) {
      if (data && data.words) {
        const words = data.words

        if (words.length !== 0) {
          const vals = this.ruleForm.rules[
            this.textSeparatorIndex
          ].propertyValues.concat(words)

          this.ruleForm.rules[this.textSeparatorIndex].propertyValues = [
            ...new Set(vals)
          ]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.marginEr {
  margin: 10px 0;
}
.dialog-footer {
  text-align: center;
}
.addRuleRow {
  padding-left: 100px;
}
.inlineB {
  width: 200px;
}
</style>
