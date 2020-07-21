<template>
  <div>
    <el-dialog
      title="选择项目"
      :visible.sync="isShowSelectProject"
      append-to-body
      :show-close="showCloseBtn"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px">

      请先选择一个您所在的项目才可进行后续操作<span v-if="isAdmin">，管理员请 <el-button type="primary" @click="onCloseDialog"><router-link to="/system/project/index" style="color:#fff;cursor: pointer">点击此进入管理后台</router-link></el-button></span>

      <avue-crud v-bind:class="{ 'hide-page': hidePage }" :data="tableData" :option="option" :page="page" :table-loading="isLoading" stripe
      @current-change="onPageChange" @size-change="onPageSizeChange">
        <template slot="description" slot-scope="scope" >
          <el-radio v-model="selectedProjectId" :label="scope.row.id" @change="selectProject(scope.row)" border>选择</el-radio>
        </template>
      </avue-crud>

    </el-dialog>

    <span style="color:#fff;cursor:pointer" @click="open">
      {{projectInfo.name}} <i class="el-icon-arrow-down" />
    </span>
  </div>
</template>

<script>
import { checkInThisProject } from '@/api/project/project';
import { setTheme } from '@/util/util';
import { validatenull } from '@/util/validate';
import { userRolesMap } from '@/const/website';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isLoading: false,
      tableData: [],
      selectedProjectId: '',
      isAdmin: false,
      showCloseBtn: false,
      option: {
        align:'center',
        menuAlign:'center',
        menu:false,
        refreshBtn: false,
        columnBtn: false,
        addBtn: false,
        stripe: true,
        index: true,
        column: [
          {
            label: '项目名称',
            prop: 'name'
          },
          {
            label: '项目编号',
            prop: 'code'
          },
          {
            label: '操作',
            prop: 'description',
            slot: true
          }
        ]
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      hidePage: true
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'projectId', 'projectInfo', 'projectPage', 'themeName', 'roles']),
    isShowSelectProject: {
      get() {
        return this.$store.state.project.isShowSelectProject;
      },
      set(value) {
        this.$store.dispatch('showSelectProject', value);
      }
    }
  },
  watch: {
    projectId() {

      if(validatenull(this.projectId)){
        this.selectedProjectId = '';
        this.showCloseBtn = false;

        this.$store.dispatch('showSelectProject', true);

        this.getProjectList();

      }else{
        this.selectedProjectId = this.projectId;
        this.showCloseBtn = true;
      }
    },
    projectPage() {
      this.page = { ...this.projectPage };
    },
    roles() {
      this.isAdmin = this.roles.indexOf(userRolesMap.admin) !== -1;
    },
    page() {
      /** 小于 5 个，不显示分页导航 */
      this.hidePage = this.page.total < 5 ? true : false;
    }
  },
  mounted() {
    this.isAdmin = this.roles.indexOf(userRolesMap.admin) !== -1;
  },
  created(){

    /** 如果没有 projectId */
    if(validatenull(this.projectId)){

      this.$store.dispatch('showSelectProject', true);

      this.getProjectList();

      this.showCloseBtn = false;

    }else{
      this.selectedProjectId = this.projectId;
      this.showCloseBtn = true;

      /** 验证 projectId */
      checkInThisProject({

        projectId: this.selectedProjectId

      }).then(({ data }) => {

        if(data.code === 0) {

          if(data.data !== true){
            // 清空 projectId
            this.$store.dispatch('clearProjectInfo');
          }
        }

      }).catch(e=> {
        this.$store.dispatch('clearProjectInfo');
      });

    }
  },
  inject: ['reload'],
  methods: {
    open() {

      this.$store.dispatch('showSelectProject', true);

      /** 重新获取 */
      this.getProjectList();

    },

    getProjectList(){

      this.isLoading = true;

      this.$store.dispatch('getProjectList', {
        size: this.page.pageSize,
        current: this.page.currentPage
      }).then((res) => {

        this.isLoading = false;

        if(res){
          this.tableData = res;

          /** 如果没有项目，并且不是管理，退出登录 */
          if(this.tableData.length === 0 && !(this.isAdmin)) {
            this.$store.dispatch('LogOut').then(() => {
              this.$router.push({ path: '/login' })
            });
          }

        }

      }).catch((e) => {
        this.isLoading = false;
      });
    },

    selectProject(row){

      this.$store.dispatch('setProjectInfo', {
        projectInfo: row
      });

      this.$store.dispatch('showSelectProject', false);

      /** 关闭目前的所有标签 */
      this.$store.commit('DEL_ALL_TAG');

      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })

      this.reload()
    },

    onCloseDialog(){

      this.$store.dispatch('showSelectProject', false);
    },

    onPageChange(val){
      this.page.currentPage = val;
      this.getProjectList();
    },

    onPageSizeChange(val){
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getProjectList();
    }
  }
}
</script>

<style lang="scss" scoped>
.hide-page /deep/ .avue-crud__pagination{
  display: none;
}
</style>

