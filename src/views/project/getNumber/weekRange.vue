<template>
  <div style="display:inline-block;">
    <el-form :rules="rules" ref="form" :model="form" class="form">
      <el-form-item prop="weekOne">
        <el-date-picker v-model="form.weekOne" :clearable="false" type="week" :picker-options="{firstDayOfWeek:1}"   format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
      </el-form-item>
      <span style="margin: 0 8px">至</span>

      <el-form-item prop="weekTwo">
        <el-date-picker v-model="form.weekTwo" :clearable="false" type="week" :picker-options="{firstDayOfWeek:1}" format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
var week1 = false
var week1Value = ''
var week2Value = ''
var weekOne = (rule, value, callback) => {
  week1 = true
  week1Value = value
  if (week2Value != '') {
    if (value > week2Value) {
      callback(new Error('请选择后一周前面的周'))
    }else{
    callback()

    }
  } else {
    callback()
  }
}
var weekTwo = (rule, value, callback) => {
  if (week1) {
    if (week1Value > value) {
      callback(new Error('请选择前一周后面的周'))
    } else {
      week2Value = value
      var xcWeek=(value.valueOf()-week1Value.valueOf())/3600/24/1000/7
      if(xcWeek>12){
      callback(new Error('请选择不超过12周'))

      }else{
      callback()

      }
    }
  } else {
    callback(new Error('请先选择前一周'))
  }
}
export default {
  data() {
    return {
      form: {
        weekOne: '',
        weekTwo: ''
      },
      rules: {
        weekOne: [
          { required: true, message: '请选择第一周', trigger: 'change' },
          { validator: weekOne, trigger: ['change', 'blur'] }
        ],
        weekTwo: [
          { required: true, message: '请选择第二周', trigger: 'change' },
          { validator: weekTwo, trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  watch: {
    weekOne(value) {
      console.log(value)
      //         var startTime = value

      // startTime.setDate(startTime.getDate() - 1)
      // console.log(startTime)
    }
  },
  methods:{
    checkValue(){
      this.$refs['form'].validate(valid=>{
        if(valid){
      this.$emit('getWeek',this.form)
        }else{
          return false
        }
      })
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
}
.form /deep/.el-form-item__content{
      width: 160px;
      input{
      width: 160px;

      }
}
.form /deep/.el-form-item__error {
  margin-left: 0px;
}
</style>
