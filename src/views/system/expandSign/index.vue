<template>
  <basic-container>
    <avue-crud
      ref="crud"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableOption"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    >  
      <template slot="search">
        <el-row>
          <el-col :xl="4" :sm="8">
            <el-form :model="form">
              <el-form-item label="签名">
                <el-input
                  v-model="form.sign"
                  clearable
                  placeholder="请输入签名或扩展签名模糊查询"
                  style="float:left;width:250px"
                ></el-input>
              </el-form-item>
              
            </el-form>
          </el-col>
          <el-col :xl="4" :sm="6">
            <el-button type="primary" @click="handleSearchChange">查询</el-button>
          </el-col>
        </el-row>
      </template>
      <template slot="searchMenu"></template>
      <template slot="id" slot-scope="scope">
        <el-button type="text" @click="editSign(scope.row)">编辑</el-button>
      </template>
      <template slot="keyWordNumber" slot-scope="scope">
        <el-button type="text" @click="editSign(scope.row)">{{
          scope.row.keyWordNumber
          }}</el-button>
      </template>
      

    </avue-crud>
    <avue-drawer title="编辑" width="600" show-close v-model="dialogVisible">
      <el-form  label-width="100px" style="padding-right:30px">
   <el-form-item label="关键词列表" style="font-weight:700">
    <el-input type="textarea" :rows="16" v-model="keword"></el-input>
  </el-form-item>
   <el-form-item label="">

  <span style="color:red">{{signNUm}}</span>个关键词
  <span style="float:right;color:red">*保存后次日生效</span>
  </el-form-item>
  </el-form>
  <div style="text-align:center">
    <el-button @click="editTest" type="primary">保存</el-button>
    <el-button @click="dialogVisible=false">关闭</el-button>
  </div>
</avue-drawer>

  </basic-container>
</template>
<script>
import * as signApi from '@/api/project/industry-sign'
import { tableOption } from '@/const/crud/admin/expandSign'

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
        sign: '',
      },
      dialogVisible:false,
      keword:' ',
      signNUm:0,
      industrySignId:''
    }
  },
  created() {
    this.handleList()
  },
  watch:{
    keword(value){
      
  this.signNUm=value.split('\n').filter(item => {
            return item !== ''
          }).length
          console.log('dd',value.trim()== "")
          if(value.trim()== ""){
            this.signNUm=0
          }
    }
  },
  // computed:{
  //   signNUm(){
  //           return  this.form.sign.split('\n').filter(item => {
  //           return item !== ''
  //         }).length
         
      
  //   }
  // },
  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleSearchChange(payload) {
      this.page.currentPage=1
      this.handleList()
    },

    handleList(payload) {
      this.tableLoading = true

      signApi
        .getExpandSignList({
          nameLike:this.form.sign,
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        .then(({ data }) => {
          console.log(data)
          this.tableLoading = false
          this.page.total = data.data.total
          this.tableData = data.data.records
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    editSign(row){
      console.log(row)
      this.id=row.id
      this.industrySignId=row.industrySignId
      this.dialogVisible=true
   if(row.keyWordStr==null){
     this.keword=''
   }else{
        this.keword=row.keyWord.split(',').join('\n')

   }
      
    },
    editTest(){
      var keyword=this.keword.split('\n')
      keyword=keyword.filter(function (s) {
   return s && s.trim();
});
      signApi.editExpandSign({
        id:this.id,
        keyWord:keyword.join(','),
        industrySignId:this.id==null?this.industrySignId:''
      }).then(({data})=>{
        if (data.code === 0) {
      this.dialogVisible=false

                this.$message({
                  message: '修改关键词成功',
                  type: 'success'
                })
                this.handleList()
        }else{
          this.$message({
                  message: data.msg,
                  type: 'warning'
                })
        }
      })
      
    }
    
  }
}
</script>
<style lang="scss" scoped>
// /deep/.el-form-item{
//     display: inline-block
// }
/deep/.avue-crud-search__searchMenu {
  display: none;
}
/deep/.avue-crud__menu {
  display: none;
}
</style>