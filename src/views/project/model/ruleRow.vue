<template>
  <div>
    <el-form-item class="item-input-wrapper" label-width="0"
        :prop="'rules.' + ruleIndex + '.field'"
        :rules="[
          { required: true, message: '请选择', trigger: 'blur' }
        ]">
        <el-select
        :value="rule.field"
        placeholder="请选择"
        @change="onFieldChange"
        style="width:150px;"
        >
          <el-option
            v-for="item in fieldList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="item-input-wrapper" label-width="0"
        :prop="'rules.' + ruleIndex + '.operator'"
        :rules="[
          { required: true, message: '请选择', trigger: 'blur' }
        ]">
        <el-select
        class="operate-select"
        :value="rule.operator"
        placeholder="请选择"
        @change="onOperatorChange"
        style="width:150px;">
          <el-option
            v-for="item in rule.operatorList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <span class="item-input-wrapper" v-if="rule.operator !== rulesMap.NOT_EXISTED.value && rule.propertyTypeName !== 'BOOLEAN'">

        <span v-if="rule.operator === rulesMap.RANGE.value">

          <el-form-item v-if="rule.propertyTypeName === 'DATE'" label-width="0"
          :prop="'rules.' + ruleIndex + '.rangeDate'"
            :rules="[
              { required: true, message: '请选择开始和结束时间', trigger: 'blur' },
              { validator: checkDataRange, message: '时间跨度不能超过一年', trigger: 'blur' },
            ]">
            <el-date-picker
              :value="rule.rangeDate"
              type="daterange"
              :default-time="defaultDateRange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
              @input="onRangeDateChange">
            </el-date-picker>
          </el-form-item>

          <span v-else>
            <el-form-item label-width="0"
              :prop="'rules.' + ruleIndex + '.rangeNumber1'"
              :rules="[
                { required: true, message: '请输入较小值', trigger: 'blur' }
              ]">
              <el-input class="prop-val-range" type="number" :value="rule.rangeNumber1" placeholder="请输入较小值" @input="rangeNumber1Change"></el-input>
            </el-form-item>
            到
            <el-form-item label-width="0"
              :prop="'rules.' + ruleIndex + '.rangeNumber2'"
              :rules="[
                { required: true, message: '请输入较大值', trigger: 'blur' },
                { validator: checkMinMaxNumber, message: '不能小于前面的值', trigger: 'blur' }
              ]">
              <el-input class="prop-val-range" type="number" :value="rule.rangeNumber2" placeholder="请输入较大值" @input="rangeNumber2Change"></el-input>
            </el-form-item>
          </span>

        </span>

        <span v-else>

          <el-date-picker
            v-if="rule.propertyTypeName === 'DATE'"
            :value="rule.propertyValue"
            type="date"
            :default-time="defaultDate"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @input="onPropertyValueChange"
            :prop="'rules.' + ruleIndex + '.propertyValue'"
            :rules="[
              { type: 'date', required: true, message: '请选择时间', trigger: 'blur' },
            ]" />


          <el-form-item v-else-if="rule.field === 'sign_name'" label-width="0"
          :prop="'rules.' + ruleIndex + '.propertyValues'"
          :rules="[
            { required: true, message: '请输入查询内容', trigger: 'blur' }
          ]">

          <span v-if="rule.operator !== rulesMap.EXISTED.value && rule.operator !== rulesMap.NOT_EXISTED.value">
            <el-select class="prop-vals"
              :value="rule.propertyValues"
              filterable
              multiple
              remote
              reserve-keyword
              placeholder="请输入查询内容"
              :remote-method="getSignName"
              :loading="rule.isGettingSign"
              @input="onPropertyValuesChange"
              style="width:265px">
              <el-option
                v-for="item in rule.signNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-button class="row-btn" type="primary" icon="el-icon-edit" size="mini" circle @click="showConvert(ruleIndex)"></el-button>

            </span>

            <el-select v-else class="prop-val"
              :value="rule.propertyValue"
              filterable
              remote
              reserve-keyword
              placeholder="请输入查询内容"
              :remote-method="getSignName"
              :loading="rule.isGettingSign"
              @input="onPropertyValueChange">
              <el-option
                v-for="item in rule.signNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>

          <el-form-item v-else-if="rule.propertyTypeName === 'NUMBER'" label-width="0"
          :prop="'rules.' + ruleIndex + '.propertyValue'"
          :rules="[
            { required: true, message: '请输入内容', trigger: 'blur' },
            { pattern:/^\d{1,3}$/, message: '请输入 1 到 999 的数字', trigger: 'blur' }
          ]">
            <el-input  class="prop-val"
            type="number"
            :value="rule.propertyValue"
            placeholder="请输入数字"
            @input="onPropertyValueChange"
            ></el-input>
          </el-form-item>

          <el-form-item v-else label-width="0"
          :prop="'rules.' + ruleIndex + '.propertyValue'"
          :rules="[
            { required: true, message: '请输入内容', trigger: 'blur' },
            { ...formRuleMap.maxLen50 },
          ]">
            <el-input  class="prop-val"
            type="text"
            :value="rule.propertyValue"
            placeholder="请输入内容"
            @input="onPropertyValueChange"
            ></el-input>
          </el-form-item>

        </span>

      </span>

      <el-button class="row-btn" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRule" style="float:right;margin-top:4px;"></el-button>
  </div>
</template>

<script>
import * as modelApi from '@/api/project/model';
import { eventRules, rulesMap, tagRuleHasDone, operateTypeDict, userTagLayerRule } from '@/const/project/user-tag';
import { getDayEnd,  getDayStart , getLastYearTime} from '@/util/date';
import { getSignList } from '@/api/project/industry-sign';
import { FormRuleMap } from '@/const/formValid';
import request from '@/router/axios';

export default {
  name: 'modelRule',
  data() {

    const endTime = new Date();

    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return {
      rulesMap,
      defaultDateRange: [getDayStart(startTime), getDayEnd(endTime)],
      defaultDate: getDayEnd(endTime),
      formRuleMap: FormRuleMap
    }
  },
  props: {
    tableName: {
      type: String,
      default: () => ''
    },
    rule:{
        type:Object,
        default:()=>{}
    },
    ruleIndex: {
      type: Number
    },
    fieldList: {
      type: Array
    }
  },
  created() {
    //console.log(this.rule.field);
    //this.autoConvertValue();
  },
  watch:{

    rule(){
      /** 如果是 sign_name,并且不是有值无值,那么 propertyValue 为 数组 */
      //this.autoConvertValue();

    },

    fieldList(){
      if(this.rule.field){
        this.updateOperatorList();

        /** 根据 type 算值 */
        const typeName = this.rule.propertyTypeName;

        /** 如果是区间 */
        if(this.rule.operator === this.rulesMap.RANGE.value){

           const arr = this.rule.value.split(',');

          if(this.rule.propertyTypeName === 'DATE'){

            this.rule.rangeDate = arr;

          }else {
            this.rule.rangeNumber1 = arr[0];
            this.rule.rangeNumber2 = arr[1];
          }

        }

      }

    }
  },

  methods: {

    onFieldChange(value){
      this.emitToParent( {
        name: 'field',
        value
      });

      this.emitToParent( {
        name: 'operator',
        value: ''
      });

      this.emitToParent( {
        name: 'propertyValue',
        value: ''
      });

      this.updateOperatorList();

      /** 如果是日期类型 */
      if(this.rule.propertyTypeName === 'DATE' && this.rule.operateDict !== this.rulesMap.RANGE.value && !(/^([1-2][0-9]{3})\-([0-9]{2})\-[0-9{2}]/.test(this.rule.propertyValue))) {
        /** 设置时间为空 */
        this.emitToParent( {
          name: 'propertyValue',
          value: ''
        });
      }

    },

    updateOperatorList(){

      const fieldVal = this.rule.field;
      const mapList = this.fieldList.filter((item) => {
        return item.name === fieldVal;
      });

      if(mapList.length !== 0){

        const type = mapList[0].type;

        this.emitToParent( {
          name: 'operatorList',
          value: userTagLayerRule[type]
        });

        this.emitToParent( {
          name: 'propertyTypeName',
          value: type
        });

      }

    },

    onOperatorChange(value){
      this.emitToParent( {
        name: 'operator',
        value
      });

      this.emitToParent( {
        name: 'propertyValue',
        value: ''
      });
    },

    onPropertyValueChange(value){
      this.emitToParent( {
        name: 'propertyValue',
        value
      });
    },

    onPropertyValuesChange(value){
      this.emitToParent( {
        name: 'propertyValues',
        value
      });
    },

    onRangeDateChange(value){
      this.emitToParent( {
        name: 'rangeDate',
        value
      });
    },

    rangeNumber1Change(value){
     this.emitToParent( {
        name: 'rangeNumber1',
        value
      });
    },

    rangeNumber2Change(value){
      this.emitToParent( {
        name: 'rangeNumber2',
        value
      });
    },

    emitToParent(params){
      this.$emit('rule-value-change', {
        ruleIndex: this.ruleIndex,
        name: params.name,
        value: params.value
      });
    },

    checkDataRange(rule, value, callback){

      /** 最小值 */
      const minTime = getLastYearTime(value[1]);
      const liteTime = new Date(value[0]);

      if(liteTime < minTime){
        callback(new Error(rule.message));
      }else{
        callback();
      }

    },

    checkMinMaxNumber(rule, value, callback){
      const max = parseFloat(value);
      const min = parseFloat(this.rule.rangeNumber1);

      if(max < min){
        callback(new Error(rule.message));
      }else{
        callback();
      }

    },

    getSignName(query){

      /** 至少两个字才可以搜索 */
      if(query.length > 1){

        this.emitToParent({
          name: 'isGettingSign',
          value: true
        });

        this.emitToParent({
          name: 'signNameList',
          value: []
        });

        if(this.rule.signNameCancel){
          this.rule.signNameCancel.cancel();
        }

        const CancelToken = request.CancelToken;
        this.rule.signNameCancel = CancelToken.source();

        this.emitToParent({
          name: 'signNameCancel',
          value: CancelToken.source()
        });

        getSignList({
          signName: query,
          current: 1,
          size: 100
        }, {
          cancelToken: this.rule.signNameCancel.token
        }).then((res) => {

          const { data } = res;

          if (data.code === 0) {

            this.emitToParent({
              name: 'signNameList',
              value: data.data.records.map(item => {
                  return {
                    value: item.rawSignName,
                    label: item.rawSignName
                  };
                })
             });

          }

          this.emitToParent({
            name: 'isGettingSign',
            value: false
          });

        }).catch(e => {
          this.emitToParent({
            name: 'isGettingSign',
            value: false
          });
        });
      }else{
        if(this.rule.signNameCancel){
          this.rule.signNameCancel.cancel();
        }
      }

    },

    deleteRule(){
        this.$emit('delete-rule-row', {
          index: this.ruleIndex
        });
    },

    showConvert(index){
      this.$emit('show-convert', {
        index
      });
    }

  },
};
</script>

<style scoped>
.el-form-item--medium{
  display: inline-block;
  margin-right: 5px;
}
.prop-val{
  width: 310px;
}
.prop-vals{
  width: 290px;
  margin-right:10px;
}

.prop-val-range{
  width:155px;
}
.item-input-wrapper {
  display: inline-block;
  vertical-align: top;
}
.row-btn{
  vertical-align: top;
  margin-top:3px;
}
</style>
