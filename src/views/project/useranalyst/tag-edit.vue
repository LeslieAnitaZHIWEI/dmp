<template>
  <div>
    <el-form :model="form" :rules="rules" ref="editForm" label-width="100px">
      <el-row v-show="unNextStep">
        <el-col :span="12">
          <el-form-item
            label="标签名称"
            prop="name"
            :rules="[
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            {  max: 10, message: '长度在 10 个字符以内', trigger: 'blur' }
          ]"
          >
            <el-input :value="form.name" @input="onTagNameChange"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="标签code" prop="code" :rules="codeRule">
            <el-input :value="form.code" @input="onTagCodeChange" :disabled="form.id==0?false:true"></el-input>
          </el-form-item>
        </el-col>
     

        <el-col :span="12">
          <el-form-item
            label="标签分类"
            prop="userTagTypeId"
            :rules="[
            { required: true, message: '请输入标签分类', trigger: 'change' }
          ]"
          >
            <el-select
              :value="form.userTagTypeId"
              placeholder="请输入标签分类"
              @change="onTagTypeIdChange"
            >
              <el-option
                v-for="item in editTagTypeList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计算方式" prop="computeType">
            <el-radio :value="form.computeType" @input="computeTypeChange" :label="1">手动</el-radio>
            <el-radio :value="form.computeType" @input="computeTypeChange" :label="0">例行</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标签类型">
            <el-checkbox :value="form.incident" @change="incidentChange" :label="1">事件</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标签说明">
            <el-input type="textarea" :value="form.content" :rows="12" @input="contentChange"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row  v-show="!unNextStep">
        <el-col :span="12">
          <el-form-item label="标签规则" prop="name">
            <el-button type="primary" @click="addLayer">
              <i class="el-icon-plus" />添加分层
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tabs
       v-show="!unNextStep"
        v-if="form.layers.length !== 0"
        type="border-card"
        class="tag-edit-layers"
        v-model="layerTabsValue"
      >
        <el-tab-pane v-for="(item, index) in form.layers" :key="index" :label="item.name">
          <span slot="label">
            <i class="el-icon-copy-document" />
            {{item.name}}
            <el-dropdown @command="(command) => {editLayer(command, index)}">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" command="edit">更名</el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>

          <tag-layer
            v-bind:relationDictId="item.relationDictId"
            v-bind:rules="item.rules"
            v-bind:layerIndex="index"
            v-bind:layerId="item.id"
            v-bind:layerName="item.name"
            v-bind:isPredicting="item.isPredicting"
            v-on:on-forecast="onForecast"
          ></tag-layer>
        </el-tab-pane>
      </el-tabs>

      <el-form-item size="large" style="padding-top:30px;text-align:center">
        <el-button type="primary" v-show="unNextStep" @click="goNextStep">下一步</el-button>
        <el-button type="primary" v-show="!unNextStep" @click="onSubmit('editForm')">保存</el-button>
        <el-button v-show="unNextStep" @click="onBack">
          取消
        </el-button>
        <el-button v-show="!unNextStep" @click="unNextStep=true">
          返回
          <i class="el-icon-arrow-right" />
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addUserTag,
  editUserTag,
  getUserTagLayerPredict
} from '@/api/project/user-tag'
import { rulesMap } from '@/const/project/user-tag'
import { dateFormat, getDayEnd, getDayStart } from '@/util/date'
import { validatenull } from '@/util/validate'
import { mapState, mapGetters } from 'vuex'
import TagLayer from './tag-layer'

export default {
  name: 'TagEdit',
  components: {
    'tag-layer': TagLayer
  },
  props: {
    formData: Object,
    projectId: Number
  },
  data() {
    var validateCode = (rule, value, callback) => {
      var code = /^[a-zA-Z_0-9]+$/
      if (value.length > 20) {
        callback(new Error('长度请控制在 20 个字符以内'))
      } else if (!value.match(code)) {
        callback(new Error('只支持字母,数字,下划线'))
      } else {
        callback()
      }
    }
    return {
      rules: {},
      codeRule: [
        { required: true, message: '请输入标签code', trigger: 'blur' },
        { validator: validateCode, trigger: 'blur' }
      ],
      layerTabsValue: '0',
      unNextStep:true
    }
  },

  computed: {
    ...mapState({
      form: state => state.userTag.editTagData,
      editTagTypeList: state => state.userTag.editTagTypeList
    })
    //...mapGetters(['projectId'])
  },

  created() {
    if (this.projectId) {
      /** 标签分类 */
      this.$store.dispatch('userTag/getUserTagTypeLis', {
        projectId: this.projectId
      })

      /** 规则中的事件类型下拉数据 */
      this.$store.dispatch('userTag/getUserTagEventList', {
        projectId: this.projectId
      })
    }
    console.log(this.form, '初始的tag')
  },

  watch: {},

  methods: {
    onTagNameChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'name',
        value: e
      })
    },

    onTagCodeChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'code',
        value: e
      })
    },

    onTagTypeIdChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'userTagTypeId',
        value: e
      })
    },
    computeTypeChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'computeType',
        value: e
      })
    },
    incidentChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'incident',
        value: e
      })
    },
    contentChange(e) {
      this.$store.dispatch('userTag/setEditUserTagData', {
        name: 'content',
        value: e
      })
    },

    addLayer() {
      const form = this.form

      /** 最多建 10 个分层 */
      if (this.form.layers.length < 10) {
        const title = '分层' + (form.layers.length + 1)

        const layerDate = {
          id: 0,
          name: '分层' + (form.layers.length + 1),
          relationDictId: 1, // 默认为 1
          userTagId: form.id,
          rules: [],

          /** 另加的，用于判断是否在预估 */
          isPredicting: false
        }

        this.$store.dispatch('userTag/addUserTagLayer', {
          layer: layerDate
        })
      } else {
        this.$alert('最多只能建10个分层', '提示', {
          confirmButtonText: '确定'
        })
      }
    },

    editLayer(command, index) {
      switch (command) {
        case 'edit':
          this.editLayerTitle(index)
          break
        case 'delete':
          this.deleteLayer(index)
          break
        default:
          break
      }
    },

    editLayerTitle(index) {
      this.$prompt('请输入层名', '更改层名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        inputValue: this.form.layers[index].name,

        inputValidator: function(value) {
          let val = value.trim()
          const len = val.length

          if (len < 1) {
            return '最少1个字'
          } else if (len > 10) {
            return '最多10个字'
          } else {
            return true
          }
        }
      })
        .then(({ value }) => {
          this.$store.dispatch('userTag/setUserTagLayer', {
            layerIndex: index,
            name: 'name',
            value: value.trim()
          })
        })
        .catch(e => {})
      console.log('bianji')
    },

    deleteLayer(index) {
      this.$confirm(
        '确认删除' + this.form.layers[index].name + '分层信息吗？',
        '删除层',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$store.dispatch('userTag/deleteUserTagLayer', {
          layerIndex: index
        })

        /** 如果还有其他层，自动设焦 */
        if (this.form.layers.length !== 0) {
          /** 要转为字符串 */
          this.layerTabsValue = (index >= 1 ? index - 1 : index) + ''
        }
      })
    },

    /** 预估人数 */
    onForecast(layerIndex) {
      /** 只有这一个 editForm，所以可以直接使用 */
      const rules = this.form.layers[layerIndex].rules
      let isOk = true
      let msg = ''

      if (rules.length === 0) {
        isOk = false
        msg = '请先加入规则'
      }

      if (isOk) {
        const validates = []
        const layerText = 'layers.' + layerIndex + '.rules.'

        rules.forEach((item, index) => {
          const ruleText = layerText + index

          validates.push(ruleText + '.startEndTime')
          validates.push(ruleText + '.existed')
          validates.push(ruleText + '.metaEventId')
          validates.push(ruleText + '.metaEventPropertyId')
          validates.push(ruleText + '.operateDict')
          validates.push(ruleText + '.rangeNumber1')
          validates.push(ruleText + '.rangeNumber2')
          validates.push(ruleText + '.propertyValue')
        })

        /** 验证 */
        let isOk = true
        this.$refs['editForm'].validateField(validates, errorMsg => {
          if (!validatenull(errorMsg)) {
            isOk = false
          }
        })

        if (isOk) {
          const fData = this.getFormData()
          const layerData = fData.userTagLayerComplete[layerIndex]

          const submitData = {
            projectId: this.projectId,
            relationDictId: layerData.userTagLayer.relationDictId
            // userTagLayerRuleDTO: []
          }

          const dictIds = []
          console.log(
            layerData.userTagLayerRule,
            'layerData.userTagLayerRule',
            this.form
          )
          layerData.userTagLayerRule.forEach(item => {
            dictIds.push({
              existed: item.existed,
              metaEventId: item.metaEventId,
              metaEventPropertyId: item.metaEventPropertyId,
              operateDict: item.operateDict,
              propertyValue: item.propertyValue,
              aggregateType: item.aggregateType,
              startTime: item.startTime,
              endTime: item.endTime,
              inDays: item.inDays
            })
          })

          submitData.userTagLayerRuleDTO = dictIds

          this.getUserTagLayerPredict(submitData, layerIndex)

          this.$store.dispatch('userTag/setUserTagLayer', {
            layerIndex,
            name: 'isPredicting',
            value: true
          })
        }
      }
    },

    /** 保存人数 */
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        let isDataOk = valid

        if (isDataOk) {
          const data = this.getFormData()

          if (data.userTagLayerComplete.length !== 0) {
            /** 验证数据 */
            var ruleComplete = ''
            var ruleCompleteJudge = true
            data.userTagLayerComplete.forEach(item => {
              if (item.userTagLayerRule.length === 0) {
                isDataOk = false
                ruleComplete += item.userTagLayer.name
                ruleCompleteJudge = false
                return false
              }
            })
            if (!ruleCompleteJudge) {
              this.$message({
                message: ruleComplete + '没有任何规则',
                type: 'warning',
                showClose: true
              })
              ruleCompleteJudge = true
            }

            console.log(data.userTagLayerComplete, 'data.userTagLayerComplete')
            var latestJudge = true
            data.userTagLayerComplete.forEach(item => {
              item.userTagLayerRule.forEach(ele => {
                if (ele.latest == false) {
                  latestJudge = false
                  isDataOk = false
                }
              })
            })
            if (!latestJudge) {
              this.$message({
                message: '标签包含已禁用的事件,请删除后再保存',
                type: 'warning',
                showClose: true
              })
              latestJudge = true
            }
          } else {
            isDataOk = false

            this.$message({
              message: '请先添加分层',
              type: 'warning',
              showClose: true
            })
          }
        } else {
          this.$message({
            message: '标签信息请填写完成',
            type: 'warning',
            showClose: true
          })
        }

        if (isDataOk) {
          const data = this.getFormData()

          if (this.form.id !== 0) {
            editUserTag(data).then(res => {
              this.$message({
                type: 'success',
                message: '编辑标签成功'
              })

              this.onEditOk(res.data.data)
            })
          } else {
            addUserTag(data).then(() => {
              this.$message({
                type: 'success',
                message: '添加标签成功'
              })

              this.onEditOk()
            })
          }
        }
      })
    },

    /**
     * 获得表单数据，可以提交给后台
     * @params { Object }
     **/
    getFormData() {
      var form = this.form
      form.incident=form.incident==true?1:0
      const submitData = {}

      // 如果是新增的
      const isAdd = form.id === 0

      const { layers, ...fdata } = form
      
      submitData.userTag = fdata

      submitData.userTagLayerComplete = []

      const layersLen = layers.length
      for (let i = 0; i < layersLen; i++) {
        const layer = layers[i]

        const layerData = {
          name: layer.name,
          relationDictId: layer.relationDictId
        }

        if (layer.id !== 0) {
          layerData.id = layer.id
        }

        const userTagLayerRule = layer.rules.map(item => {
          var db
          if (item.metaEventPropertyId.length == 1) {
            db = {
              existed: item.existed,
              metaEventPropertyId: item.metaEventPropertyId[0],
              metaEventId: item.metaEventId,
              operateDict: item.operateDict,
              propertyValue: item.propertyValue,
              startTime: getDayStart(new Date(item.startEndTime[0])),
              endTime: getDayEnd(new Date(item.startEndTime[1])),
              aggregateType: '',
              inDays: item.inDays,
              latest: item.latest
            }
          } else {
            db = {
              existed: item.existed,
              metaEventPropertyId: item.metaEventPropertyId[0],
              metaEventId: item.metaEventId,
              operateDict: item.operateDict,
              propertyValue: item.propertyValue,
              startTime: getDayStart(new Date(item.startEndTime[0])),
              endTime: getDayEnd(new Date(item.startEndTime[1])),
              aggregateType: item.metaEventPropertyId[1],
              inDays: item.inDays,
              latest: item.latest
            }
          }
          // var db = {
          //   existed: item.existed,
          //   metaEventPropertyId: item.metaEventPropertyId,
          //   metaEventId: item.metaEventId,
          //   operateDict: item.operateDict,
          //   propertyValue: item.propertyValue,
          //   startTime: getDayStart(new Date(item.startEndTime[0])),
          //   endTime: getDayEnd(new Date(item.startEndTime[1]))
          // };

          /** 如果是编辑，加上 id */
          if (item.id !== 0) {
            db.id = item.id
          }

          /** 如果是区间 */
          if (item.operateDict === rulesMap.RANGE.value) {
            /** 如果是日期 */
            if (item.propertyTypeName === 'DATE') {
              const startTime = new Date(item.rangeDate[0])
              const endTime = new Date(item.rangeDate[1])

              db.propertyValue = [
                getDayStart(startTime),
                getDayEnd(endTime)
              ].join(',')
            } else {
              db.propertyValue = item.rangeNumber1 + ',' + item.rangeNumber2
            }
          } else if (item.propertyTypeName === 'BOOLEAN') {
            /** 布尔值不需要传 */
            db.propertyValue = ''
          }
          /**
           * 如果是排名
           */
          console.log(item)
          if (item.operateDict == rulesMap.RANKING.value) {
            // 共有6种可能
            if (item.rankqian == 'qian' && item.rankhou == 'ming') {
              db.operateDict = 'asc_rank'
              db.propertyValue = item.rankValue
            } else if (item.rankqian == 'qian' && item.rankhou == 'percent') {
              db.operateDict = 'asc_percent_rank'
              db.propertyValue = item.rankValue
            } else if (item.rankqian == 'hou' && item.rankhou == 'ming') {
              db.operateDict = 'desc_rank'
              db.propertyValue = item.rankValue
            } else if (item.rankqian == 'hou' && item.rankhou == 'percent') {
              db.operateDict = 'desc_percent_rank'
              db.propertyValue = item.rankValue
            } else if (item.rankqian == 'qujian' && item.rankhou == 'ming') {
              db.operateDict = 'interval_rank'
              db.propertyValue =
                item.rankrangeNumber1 + ',' + item.rankrangeNumber2
            } else if (item.rankqian == 'qujian' && item.rankhou == 'percent') {
              db.operateDict = 'interval_percent_rank'
              db.propertyValue =
                item.rankrangeNumber1 + ',' + item.rankrangeNumber2
            }
          }
          console.log('????????', db)

          return db
        })

        submitData.userTagLayerComplete.push({
          userTagLayer: layerData,
          userTagLayerRule
        })
      }

      return submitData
    },

    /**
     * 当编辑，包括新增后的回调
     */
    onEditOk(id) {
      this.$emit('on-edit-ok', id)
    },

    /**
     * 点击返回
     */
    onBack() {
      this.$emit('on-back')
    },

    getUserTagLayerPredict(params, layerIndex) {
      getUserTagLayerPredict(params)
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message({
              message:
                this.form.layers[layerIndex].name + '的预估人数为' + data.data,
              type: 'success',
              showClose: true
            })
          }

          this.$store.dispatch('userTag/setUserTagLayer', {
            layerIndex,
            name: 'isPredicting',
            value: false
          })
        })
        .catch(e => {
          this.$store.dispatch('userTag/setUserTagLayer', {
            layerIndex,
            name: 'isPredicting',
            value: false
          })
        })
    },
    goNextStep(){
      this.$refs['editForm'].validate(valid => {
        if(valid){
      this.unNextStep=false

        }

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-edit-layers {
  .el-dropdown {
    color: #409eff;
  }
}
/deep/.el-table__empty-block {
  margin-left: -100px;
}
</style>


