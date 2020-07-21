<template>
  <div>
    <basic-container>
      <el-card class="box-card">
        <!--  <div slot="header" class="clearfix">-->
        <!--    <span>快速入口 :   </span>-->
        <!--    <el-button @click="goNew">新增用户查看</el-button><el-button @click="goRen">人群包管理</el-button><el-button @click="goBiao">标签管理</el-button>-->
        <!--  </div>-->
        <h3 style="margin:20px 0 0 20px">数据统计</h3>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6"
            ><div>{{ projectName }} :</div></el-col
          >
          <el-col :span="6"
            ><div style="text-align:right">
              {{ totalNumber }} 记录 / {{ newUserTotalNumber }} 用户
            </div></el-col
          >
        </el-row>
        <el-row
          type="flex"
          v-if="category != null && category.length != 0"
          class="row-er"
          justify="space-between"
        >
          <el-col :span="6"
            ><div style="fontWeight:700">
              其中{{ category.toString() }}级合计 :
            </div></el-col
          >
          <el-col :span="6"
            ><div style="text-align:right;fontWeight:700">
              {{ leverSignTotalNumber }} 记录
              <!-- / <span style="color:red">{{leverSignNewUserTotalNumber}}</span> 用户 -->
            </div></el-col
          >
        </el-row>
        <avue-crud
          ref="crud"
          :data="tableData"
          :option="tableOption"
          style="margin-top: -30px"
        >
          <template slot="isNew" slot-scope="scope">
            <span style="color:red" v-if="scope.row.isNew == 'true'">New!</span>
          </template>
          <template slot="partitionDay" slot-scope="scope">
            <span :class="scope.row.isNew == 'true' ? 'bold' : ''">{{
              scope.row.partitionDay.substring(5)
            }}</span>
          </template>
          <template slot="totalNumber" slot-scope="scope">
            <span
              :style="scope.row.totalNumber == 0 ? 'color:red' : ''"
              :class="scope.row.isNew == 'true' ? 'bold' : ''"
              >{{ scope.row.totalNumber }}</span
            >
          </template>
          <!-- <template slot="signTotalNumber" slot-scope="scope">
        <span :style="scope.row.signTotalNumber == 0 ?'color:red':''" :class="scope.row.isNew == 'true'?'bold':''">{{scope.row.signTotalNumber}}</span>
      </template> -->
          <template slot="signNumber" slot-scope="scope">
            <el-button type="text" @click="downE(scope.row.partitionDay)">{{
              scope.row.signNumber
            }}</el-button>
          </template>
        </avue-crud>
        <div
          @click="goNew"
          align="center"
          style="margin: 5px 0;color: #2d8cf0;cursor: pointer;"
          v-if="tableData.length > 0"
        >
          查看全部...
        </div>
        <div style="display:flex;margin:20px 0 0 20px;position:relative">
          <h3>待处理签名</h3>
          <span style="line-height:26px;margin-left:10px;color:red">
            ({{ waitDeal }})</span
          >
          <el-button
            type="primary"
            @click="goDeal"
            style="position:absolute;right:0;margin-right:10px"
            >批量处理</el-button
          >
        </div>

        <avue-crud ref="crud" :data="bottomList" :option="tableOption2">
          <template slot="ind" slot-scope="scope">
            {{ scope.row.industryName }}
          </template>
          <template slot="lev">
            未分级
          </template>
        </avue-crud>
        <div
          @click="extend"
          align="center"
          style="margin: 5px 0;padding-bottom:15px;color: #2d8cf0;cursor: pointer;"
          v-if="bottomWatch"
        >
          查看全部...
        </div>
      </el-card>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getData, getDealSign, exportSign } from '@/api/project/getNumbers'
import project from '../store/modules/project'
import { downloadBlob, getFileInfoFromHeader } from '@/util/util'
export default {
  data() {
    return {
      tableOption: {
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        searchBtn: false,
        menu: false,
        column: [
          {
            label: '',
            prop: 'isNew',
            width: 100,
            slot: true,
            template: true
          },
          {
            label: '日期',
            prop: 'partitionDay',
            width: 250,
            slot: true,
            template: true
          },
          {
            label: '记录数',
            prop: 'totalNumber',
            slot: true,
            template: true
          },
          {
            prop: 'signNumber',
            label: '签名个数',
            slot: true
          }
          // {
          //   label: '新增用户',
          //   prop: 'signTotalNumber',
          //   slot:true,
          //   template:true

          // },
        ]
      },
      bottomWatch: false,
      tableOption2: {
        align: 'center',
        addBtn: false,
        refreshBtn: false,
        columnBtn: false,
        searchBtn: false,
        menu: false,
        column: [
          {
            label: '',
            prop: 'isNew',
            width: 100,
            slot: true,
            template: true
          },
          {
            label: '签名名称',
            prop: 'signName',
            width: 250
          },
          {
            label: '行业',
            prop: 'ind',
            slot: true
          },
          {
            label: '级别',
            prop: 'lev',
            slot: true
          }
        ]
      },
      newUserTotalNumber: '',
      totalNumber: '',
      tableData: [],
      tableData2: [],
      bottomList: [],
      category: [],
      leverSignTotalNumber: '',
      projectName: project.state.projectInfo.name,
      waitDeal: 0,
      undId: null
    }
  },
  created() {
    this.getData()
    this.getDealSign()
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  methods: {
    goNew() {
      this.$store.dispatch('sign/controlDate',{
        judge:true,
        date:this.tableData[0].partitionDay.substring(0,7)
      })
      this.$router.push({
        path: '/project/getNumber/dataStatistic'
      })
    },
    goQian() {
      this.$router.push({
        path: '/admin/sign/index'
      })
    },
    goBiao() {
      this.$router.push({
        path: '/project/useranalyst/tag'
      })
    },
    getData() {
      getData({
        projectId: this.projectId
      }).then(({ data }) => {
        console.log(data)
        this.category = data.data.category
        this.leverSignTotalNumber = data.data.leverSignTotalNumber
        this.leverSignNewUserTotalNumber = data.data.leverSignNewUserTotalNumber
        this.totalNumber = data.data.totalNumber
        this.newUserTotalNumber = data.data.newUserTotalNumber
        this.tableData = data.data.result.slice(0, 5)
      })
    },
    goDeal() {
      this.$store.dispatch('sign/controlSign', {
        judge: true,
        und: this.undId
      })
      this.$router.push({
        path: '/admin/sign/index'
      })
    },
    getDealSign() {
      getDealSign({}).then(({ data }) => {
        this.waitDeal = data.data.count
        this.tableData2 = data.data.list
        if (data.data.list.length != 0) {
          this.undId = data.data.list[0].industryId
        }
        if (this.tableData2.length > 5) {
          this.bottomWatch = true
          this.bottomList = this.tableData2.slice(0, 4)
        } else {
          this.bottomWatch = true

          this.bottomList = this.tableData2
        }
      })
    },
    extend() {
      this.goQian()
    },
    downE(day) {
      exportSign({
        partitionDay: day,

        projectId: this.projectId
      }).then(res => {
        console.log(res)
        downloadBlob(res.data, getFileInfoFromHeader(res.headers))
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
// .banner-text {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -250%);

//   font-size: 20px;
//   text-align: center;
//   color: #333;
// }
/deep/.el-card__body {
  height: 100%;
  padding: 0;
}
.row-bg {
  padding: 0px 20px 20px 20px;
}
.row-er {
  padding: 0 20px;
  margin-top: -15px;
}
.bold {
  font-weight: bold;
}
</style>
