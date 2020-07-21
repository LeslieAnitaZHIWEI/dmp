<template>
  <div v-loading="isLoading">

    <h3 class="group-title">基本信息</h3>

    <avue-form ref="form" v-model="basicInfo" :option="formOption"></avue-form>

    <el-row>
      <el-col :span="12"><h3 class="group-title">关键词</h3></el-col>
      <el-col :span="12" style="text-align:right">
        <el-button type="primary" @click="addKeyword">新增</el-button>
      </el-col>
    </el-row>

    <el-card shadow="always" style="margin-bottom:10px;">

      <el-row type="flex" align="middle" :gutter="10">

        <el-col v-if="this.keywords.length > 1" :span="3">
          <el-select v-model="operateDictVal" placeholder="请选择" style="width:70px;">
            <el-option v-for="item in relationDict" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-col>

        <el-col :span="keywordSpan">
          <ul class="keyword-list" v-bind:class="classObject">
            <li v-if="this.keywords.length === 0" style="text-align: center;">
              请点击 <el-button type="primary" @click="addKeyword">新增</el-button> 添加关键字
            </li>
            <li v-for="(item, index) in this.keywords" :key="item.index" style="padding:10px 0">

              <el-select
              class="keyword-operate"
              placeholder="请选择"
              v-model="item.operateDictId">
                <el-option v-for="opt in KeywordRelationOptions" :key="opt.value"
                :label="opt.label"
                :value="opt.value">
                </el-option>
              </el-select>

              <el-select
              class="keyword-select"
              v-model="item.wordGroup"
              multiple
              filterable
              reserve-keyword
              allow-create
              placeholder="请输入关键词"
              remote
              :remote-method="getKeywords"
              :loading="isLoadingKeyword">
                <el-option v-for="item in keywordOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>

              <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="inputKeywordDiglog(index)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteKeyword(index)"></el-button>

            </li>
          </ul>
        </el-col>

      </el-row>


    </el-card>

    <h3 class="group-title">事件属性</h3>
    <avue-crud
    :data="tableData"
    :option="tableOption"
    @row-save="onRowSave"
    @row-del="onRowDel"
    @row-update="onRowUpdate">

    </avue-crud>

    <h3 class="group-title">事件描述</h3>

    <el-input type="textarea" v-model="basicInfo.description"></el-input>

    <div style="text-align: center;padding:10px;">
      <el-button type="primary" icon="el-icon-check" @click="onSave">保存</el-button>
      <el-button icon="el-icon-right" @click="onBack">返回</el-button>
    </div>

    <text-separator
    v-bind:show="keywordsDialog"
    v-on:hide="()=>{keywordsDialog = false}"
    v-on:get-convert-words="autoInputKeywords"></text-separator>

  </div>
</template>

<script>

import { formOption, tableOption } from '@/const/project/event-edit';
import { addEvent, updateEvent } from '@/api/project/meta-event';
import { getWordSimilarity } from '@/api/project/user-tag';
import { relationDict, relationDictMap } from '@/const/project/user-tag';
import request from '@/router/axios';
import { validatenull } from '@/util/validate';
import textSeparator from '@/components/text-separator';
import { setTimeout } from 'timers';
import { mapGetters } from 'vuex';


const CancelToken = axios.CancelToken;
let source;

export default {
  name: 'EventEdit',
  components: {
    'text-separator': textSeparator
  },
  props: {
    eventId: [Number, String , Object],
    isAdd: Boolean,

    /** 基本信息 */
    metaEvent: {
      type: Object,
      /* default: function () {
        return {
          projectId: '',
          code: '',
          name: '',
          description: '',
          typeId: 0,
          typeName: '',
          version: '1.0'
        };
      } */
    },
    /** 关键字 */
    metaEventKeywords: {
      type: Array,
      default: function () {
        return [];
      }
    },
    /** 事件属性 */
    metaEventProperties: {
      type: Array,
      default: function(){
        return [];
      }
    }
  },
  data() {
    return {
      isLoading: true,
      basicInfo: this.metaEvent,
      keywords: this.metaEventKeywords,
      operateDictVal: 0,
      KeywordRelationOptions: [
        {
          value: 0,
          label: '包含'
        },
        {
          value: 1,
          label: '不包含'
        }
      ],
      relationDict: relationDict,
      keyWordCancel: null,
      //properties: this.metaEventProperties,
      formData: {},
      tableOption,
      tableData: [],
      /** 是否在载入关键字 */
      isLoadingKeyword: false,
      keywordOptions: [],

      keywordsDialog: false,

      keywordsForm: {
        keywords: '',
        separator: ''
      },
      keywordsFormRules: {
        keywords: [
          {required: true, message: '请输入关键字', trigger: 'blur'}
        ],
        separator: [
          {required: true, message: '请输入分隔符', trigger: 'blur'}
        ]
      },
      //keywordSpan: 21
    };
  },

  created() {

    /** 如果是修改 */
    if(this.metaEvent && !(validatenull(this.metaEvent.projectId))){
      this.isLoading = false;

      this.operateDictVal = this.metaEvent.keywordRelation === 'or' ? relationDictMap.or : relationDictMap.and;

      this.tableData = this.metaEventProperties;

      /** 把 wordGroup 转成 Array */
      const keywords = this.metaEventKeywords;

      const l = keywords.length;
      if(l !== 0){
        for(let i = 0; i < l; i++){

          const wg = keywords[i].wordGroup;

          if(!validatenull(wg) && typeof(wg) === 'string'){
            keywords[i].wordGroup = wg.split(',');
          }
        }
      }

    }else{
      /** 请求 */
      this.isLoading = false;
      this.operateDictVal = 0;
    }

  },

  computed: {
    ...mapGetters(['meteEventTypes', 'projectId']),

    classObject : function (){
      return {
        'single-row': this.keywords.length < 2
      };
    },

    keywordSpan: function(){
      return this.keywords.length < 2 ? 24 : 21;
    },

    formOption(){
      formOption.column[2] = {
        label: '事件类型',
        prop: 'typeId',
        type: 'select',
        dicData: this.meteEventTypes.map((item) => {
          return {
            label: item.name,
            value: item.id
          };
        })
      };

      return formOption;
    }
  },

  watch: {},

  methods: {
    addKeyword: function () {
      this.keywords.push({
        operateDictId:0,
        wordGroup:[]
      })
    },

    inputKeywordDiglog(index) {
      this.keywordsDialog = true;
      this.editKeyWordsIndex = index;
    },

    autoInputKeywords(data) {

      if(data && data.words){
        const words = data.words;

        if(words.length !==0) {

          const vals = this.keywords[this.editKeyWordsIndex].wordGroup.concat(words);

          this.keywords[this.editKeyWordsIndex].wordGroup = [...new Set(vals)];

        }

      }

    },

    deleteKeyword(index) {
      this.keywords.splice(index, 1);
    },

    /**
     * @param {string} 传入的查询字符
    */
    getKeywords: function(query){

      if (query !== '') {

        /** 暂时改了不查询后台 */

        this.keywordOptions = [];
        // this.isLoadingKeyword = true;

        // if(this.keyWordCancel){
        //   this.keyWordCancel.cancel();
        // }

        // const CancelToken = request.CancelToken;
        // this.keyWordCancel = CancelToken.source();

        // getWordSimilarity({
        //   keyWord: query,
        //   projectId: this.projectId,
        // }, {cancelToken: this.keyWordCancel.token}).then((res) => {
        //   const { data } = res;

        //   if(data.code === 0){
        //     this.keywordOptions = data.data.map((item) => {
        //       return {
        //         value: item,
        //         label: item
        //       };
        //     });
        //   }

        //   this.isLoadingKeyword = false;
        // }).catch((e) => {

        //   if (axios.isCancel(e)){
        //     console.log('Request canceled', e.message);
        //   }

        //   this.isLoadingKeyword = false;
        // });

      }else{
        this.keywordOptions = [];
      }

    },

    onRowSave(row,done,loading) {

      const {code, name, propertyType} = row;

      this.tableData.push({
        code,
        name,
        propertyType
      });

      done();
    },

    onRowUpdate(row,index,done,loading) {

      const {code, name, propertyType} = row;

      /** 更新数据 */
      this.$set(this.tableData, index, {
        code,
        name,
        propertyType
      });

      done();

    },

    onRowDel(	row,index){

      this.$confirm('是否确认删除属性名为"' + row.code + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        /** 删除 */
        this.tableData.splice(index, 1);

        /** 重视获得数据 */
        // this.getList(this.page);

        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        });

      }).catch(function() { })

    },

    onSave(){

      let isOk = true;

      this.$refs.form.validate((vaild) => {
        isOk = vaild;
      });

      if(!isOk){
        return;
      }

      const {$typeId, $typeName, ...cleanMeteEvent} = this.basicInfo;

      // const keywords = this.keywords;

      // /** 把 wordGroup 从 Array 类型 转为 string 类型 */
      // const l = keywords.length;

      // if(l !== 0){
      //   for(let i = 0 ; i < l; i++){

      //     const wg = keywords[i].wordGroup;

      //     if(typeof(wg) !== 'string'){
      //       keywords[i].wordGroup = wg.join(',');
      //     }

      //   }
      // }

      cleanMeteEvent.keywordRelation = this.operateDictVal === relationDictMap.or ? 'or' : 'and';

      const submitData = {
        metaEvent: cleanMeteEvent,
        metaEventKeywords: this.keywords.map((item) => {
          return {
            ...item,
            wordGroup: item.wordGroup.join(',')
          };
        }),

        /** 过滤 $index $propertyType */
        metaEventProperties: this.tableData.map((item, index) => {
          const { $index, $propertyType, ...cleanData } = item;

          /** 排序列表 */
          cleanData.sortNumber = index + 1;

          return cleanData;
        })
      };

      /** 如果是新增 */
      if(validatenull(this.eventId)) {
        addEvent(submitData).then(this.onEditDone).catch((e) => {

        });
      } else {

        updateEvent(submitData).then(this.onEditDone).catch((e) => {

        });
      }

    },

    onEditDone(res){
      this.$emit('onDateUpdated');
    },

    onBack(){
      this.$emit('closeDrawer');
    }
  }
}
</script>


<style lang="scss" scoped>

.group-title{
  padding: 20px 0 10px 0;
}

.keyword-list{
  padding-left: 20px;
  border-left: 1px solid #eee;
  > li{
    padding: 10px 0;
  }

  /deep/ .el-select,
  /deep/ .el-button{
    vertical-align: middle;
  }
}
.keyword-operate{
  width:100px;
}
.keyword-select{
  width:435px;
  margin:0 10px;
}

.single-row{
  border-left: none;
  .keyword-select{
    width: 530px;
  }
}
</style>
