<template>
  <div>
    <basic-container>

      <el-form :model="form" :rules="rules" ref="form" label-width="96px" class="search-form">
        <el-row>

          <el-col :md="21" :lg="22">
            <el-form-item label="取号种类" prop="kind" label-width="80px">
              <el-select v-model="form.kind" placeholder="请选择取号种类">
                <el-option v-for="item in getNumberTypeList" :key="item.value"
                  :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="取号名称" prop="packageName" label-width="80px">
              <el-input v-model="form.packageName" placeholder="取号名称模糊搜索"></el-input>
            </el-form-item>

            <el-form-item
              prop="rangeDate" label="请选择日期">
              <el-date-picker
              style="width:250px"
                v-model="form.rangeDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="响应编号" prop="responseCode" label-width="80px">
              <el-input v-model="form.responseCode" placeholder="响应编号精确搜索"></el-input>
            </el-form-item>

            <el-form-item label="" prop="haveEmptyNumber" label-width="20px">
              <el-checkbox v-model="form.haveEmptyNumber">返回存在空号</el-checkbox>
            </el-form-item>

            <el-form-item label="" prop="responseStatus" label-width="20px">
              <el-checkbox v-model="form.responseStatus">请求失败记录</el-checkbox>
            </el-form-item>

          </el-col>

          <el-col :md="3" :lg="2">
            <el-button type="primary" icon="el-icon-search" @click="onSearch" :loading="tableLoading">查询</el-button>
          </el-col>

        </el-row>

      </el-form>

    <avue-crud
      class="pagination-total-hide"
        ref="crud"
        :page="pageOption"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @size-change="pageSizeChange" @current-change="pageChange"
        :row-style="rowStyle"
      >
        <template slot="responseStatus" slot-scope="scope">
          <span v-if="scope.row.responseStatus === '0'" style="color:#67C23A">
            <i class="el-icon-success"></i> 成功
          </span>
          <span v-else style="color:#F56C6C">
            <i class="el-icon-error"></i> 失败
          </span>
        </template>
      </avue-crud>

    </basic-container>
  </div>
</template>
<script>
import { getList } from "@/api/project/number-record";
import { tableOption, pageOption, getNumberTypeList } from "@/const/project/getMarkRecord";
import { nearly7DayRange } from "@/util/date";
import { mapGetters } from 'vuex';

export default {
  data() {

    // 日期默认为近 7 天
    // const rangeDate = nearly7DayRange().map((item) => {
    //   return item.substring(0, 10);
    // });
    const rangeDate = []

    return {
      tableData: [],
      pageOption: pageOption,
      tableLoading: false,
      tableOption,
      form:{
        kind: getNumberTypeList[0].value,
        rangeDate,
        packageName: '',
        responseCode: '',
        haveEmptyNumber: false,
        responseStatus: false,
      },
      rules: {

      },
      getNumberTypeList,
      dialogFormVisible:false
    };
  },

  computed: {
    ...mapGetters(['projectId']),
  },

  mounted() {
    this.onSearch();
  },
  methods: {

    onSearch(){
      this.pageOption.currentPage = 1;

      this.getList();
    },

    pageSizeChange(size){
      this.pageOption.pageSize = size;
      this.pageOption.currentPage = 1;
      this.getList();
    },

    pageChange(page) {
      this.pageOption.currentPage = page;
      this.getList();
    },

    getList() {

      this.$refs['form'].validate((valid) => {

        if(valid){
          this.tableLoading = true;

          getList(this.getFormData()).then(( {data} ) => {

            if(data.code === 0) {
              this.tableData = data.data;

              const len = data.data.length;

              if(len < this.pageOption.pageSize){
                this.pageOption.total = this.pageOption.pageSize * (this.pageOption.currentPage - 1) + len;
              }else{
                this.pageOption.total = this.pageOption.pageSize * (this.pageOption.currentPage + 1);
              }

            }

            this.tableLoading = false;

          }).catch(e => {
            this.tableLoading = false;
          });

        }

      })


    },

    getFormData(){

      const rangeDate = this.form.rangeDate ? this.form.rangeDate : ['', ''];

      const formData = {
        projectId: this.projectId,
        haveEmptyNumber: this.form.haveEmptyNumber,
        kind: this.form.kind,
        packageName: this.form.packageName,
        startTime: rangeDate[0],
        endTime: rangeDate[1],
        responseCode: this.form.responseCode,
        responseStatus: this.form.responseStatus,
        current: this.pageOption.currentPage,
        size: this.pageOption.pageSize,
      };

      return formData;
    },

    rowStyle({row,column,rowIndex}){
      if(row.responseStatus !== '0') {
        return {
          color: '#F56C6C'
        };
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.search-form {
  .el-form-item {
    display: inline-block;
  }
}
</style>
