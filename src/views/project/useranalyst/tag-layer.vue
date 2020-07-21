<template>
  <div>
    <div style="text-align:right;padding-bottom:5px;">
      <el-button type="primary" size="small" @click="addRule">
        <i class="el-icon-plus" />添加事件规则
      </el-button>
    </div>

    <el-row type="flex" align="middle">
      <el-col :span="4" style="text-align:center">
        <el-select
          v-show="rules.length > 1"
          :value="relationDictId"
          style="width:70px;"
          placeholder="请选择"
          @change="onrelationDictIdChange"
        >
          <el-option
            v-for="item in relationDict"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="20">
        <el-table :data="rules" :show-header="false" :stripe="true" class="layer-rule-table" empty-text="请添加事件规则">
          <el-table-column width="50">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <operator-select :rule="scope.row" :rule-index="scope.$index" :layer-index="layerIndex"></operator-select>
            </template>
          </el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click.stop="() => { deleteRule(scope.$index) }"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <div style="padding-top:20px;text-align: center;">
      <el-button
        :disabled="rules.length==0?true:false"
        :loading="isPredicting"
        type="warning"
        @click="onForecast()"
      >预估 {{ layerName }} 人数</el-button>
    </div>
  </div>
</template>

<script>
import { relationDict } from '@/const/project/user-tag'
import { getDayStart, getDayEnd } from '@/util/date'
import OperatorSelect from './operator-select'

export default {
  name: 'TagLayer',
  components: {
    'operator-select': OperatorSelect
  },
  props: {
    relationDictId: Number,
    rules: Array,
    layerIndex: Number,
    layerId: Number,
    layerName: String,
    isPredicting: Boolean
  },
  data() {
    return {
      relationDict: relationDict
    }
  },
  watch: {
    operateDictVal: function() {
      this.$store.dispatch('userTag/setUserTagLayer', {
        layerIndex: this.layerIndex,
        name: 'relationDictId',
        value: this.operateDictVal ? 0 : 1
      })
    }
  },
  created() {
    console.log(this.rules, 'rule')
  },

  methods: {
    addRule() {
      const startTime = getDayStart(new Date(Date.now() - 7 * 24 * 60 * 60000))
      const endTime = getDayEnd(new Date())

      const ruleModel = {
        id: 0,
        userTagLayerId: this.layerId,

        existed: '',
        latest: true,
        metaEventId: '',
        metaEventName: '',
        metaEventPropertyId: '',
        metaEventPropertyName: '',
        operateDict: '',
        propertyValue: '',
        sortNumber: '',

        /** 另加的，用于判断是否显示属性以后的输入栏 */
        hasProperty: true,

        /** 另加的，用于选择事件属性 */
        eventPropertyList: [],

        /** 另加的 */
        propertyTypeName: '',

        /** 另加的，用于选择操作值 */
        operateList: [],

        /** 以下是在 UI 中真实使用的值 */
        startEndTime: [startTime, endTime],
        rangeNumber1: '',
        rangeNumber2: '',
        rankqian: 'qian',
        rankhou: 'ming',
        rankrangeNumber1: '',
        rankrangeNumber2: '',
        rankValue: '',
        inDays: null,
        rangeDate: [startTime, endTime]
      }

      this.$store
        .dispatch('userTag/addTagRule', {
          layerIndex: this.layerIndex,
          rule: ruleModel
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

    deleteRule(index) {
      this.$store.dispatch('userTag/deleteTagRule', {
        layerIndex: this.layerIndex,
        ruleIndex: index
      })
    },

    onrelationDictIdChange(value) {
      this.$store.dispatch('userTag/setUserTagLayer', {
        layerIndex: this.layerIndex,
        name: 'relationDictId',
        value
      })
    },

    onForecast() {
      this.$emit('on-forecast', this.layerIndex)
    }
  }
}
</script>

<style lang="scss">
.user-tag-layer {
  background: #eee;
}
.layer-rule-table {
  .el-select {
    width: 120px;
    margin: 0 5px;
  }
  .operate-select {
    width: 100px;
  }
}
</style>
