<template>
  <div style="margin-top:10px">
    <el-form-item
      label="级别"
      label-width="60px"
      :prop="'signListData.'+extendIndex+'.categoryId'"
      :rules="[
          { required: true, message: '请填写级别', trigger: ['blur','change'] },
          

        ]"
    >
      <el-input :value="extend.categoryId" @input="changeFormCategoryId" @change="changeCategoryId"></el-input>
    </el-form-item>
    <el-form-item
      label="行业名称"
      label-width="100px"

      :prop="'signListData.'+extendIndex+'.industryId'"
      :rules="[
          { required: true, message: '请填写行业名称', trigger: ['blur','change'] }
        ]"
    >
      <el-select
        :value="extend.industryId"
        placeholder="请选择"
        @change="changeIndustry"
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
    <el-form-item style="margin-left:120px;">
     <span style="fontSize:12px;margin-right:10px;color:red">{{extendNum}}个扩展</span> 
      <button
        type="button"
        @click="deleteExtend"
        class="el-button el-button--danger el-button--medium is-circle"
      >
        <i class="el-icon-delete"></i>
      </button>
    </el-form-item>
    <div style="width:100%;margin-top:10px">
      <el-form-item
        label="内容"
        :prop="'signListData.'+extendIndex+'.signNames'"
        class="signList"
        label-width="60px"
        style="width:100%"
        :rules="[
          { required: true, message: '请填写签名', trigger: ['blur','change'] }
        ]"
      >
        <el-input
          :value="extend.signNames"
         
          :rows="5"
          type="textarea"
          @input="changeSignList"
          style="width:83%"
        ></el-input>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import * as signApi from '@/api/project/industry-sign'

export default {
  data() {
    return {
      options: [],
      extendNum:0
    }
  },
  created() {
    this.getSelectList()
  },
  watch:{
    'extend.signNames':{
      handler:function(value){
      console.log('bianlem')
      this.extendNum=value.split('\n').filter(item=>{
            return item!==''
          }).length
    },
    immediate:true
    }
  },
  props: {
    extend: Object,
    extendIndex: Number
  },
  methods: {
    getSelectList() {
      signApi.getSelectList().then(({ data }) => {
        var payload = data.data
        this.idList = payload

        const pay = payload.map(item => ({
          label: item.name,
          value: item.id
        }))
        this.options = pay
      })
    },
    changeSignList(value) {
      this.$store.dispatch('sign/signChange', {
        extendIndex: this.extendIndex,

        name: 'signNames',
        value: value
      })
    },
    changeIndustry(value) {
      this.$store.dispatch('sign/signChange', {
        extendIndex: this.extendIndex,

        name: 'industry',
        value: value
      })
    },
    changeCategoryId(value) {
      this.$store.dispatch('sign/signChange', {
        extendIndex: this.extendIndex,

        name: 'categoryId',
        value: value
      })
    },
    deleteExtend() {
      this.$emit('deleteExtend', this.extendIndex)
    },
    changeFormCategoryId(value) {
      this.$store.dispatch('sign/extendFormChange', {
        extendIndex: this.extendIndex,

        name: 'categoryId',
        value: value
      })
    },
    changeFormIndustryId(value) {
      this.$store.dispatch('sign/extendFormChange', {
        extendIndex: this.extendIndex,

        name: 'industryId',
        value: value
      })
    },
    changeFormSignNames(value) {
      this.$store.dispatch('sign/extendFormChange', {
        extendIndex: this.extendIndex,

        name: 'signNames',
        value: value
      })
    }
  }
}
</script>
<style lang="scss">
.signList {
  margin-top: 10px;
  display: block;
}
</style>