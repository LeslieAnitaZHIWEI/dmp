<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :page="page"
        :data="tableData"
        :table-loading="tableLoading"
        :option="tableOption"
        @size-change="onSizeChange"
        @search-change="searchChange"
      >
        <template slot="menuLeft">
          <el-button type="primary" icon="el-icon-plus" size="small" @click.stop="handleAdd()">新增</el-button>
        </template>
        <template slot="id" slot-scope="scope">{{ hangye(scope.row.industryGroup) }}</template>
        <template slot-scope="scope" slot="menu">
          <el-button icon="el-icon-edit" type="text" size="small" @click="onEditRow(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="text" size="small" @click="handleDel(scope.row)">刪除</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="项目创建"
        :visible.sync="bigDialogVisible"
        width="1280px"
        :center="true"
        @closed="dialogClose"
      >
        <template slot="title">
          <div style="fontSize:20px;fontWeight:700">项目创建</div>
        </template>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <h3>项目基本信息</h3>
          <el-form-item label="项目名称" prop="name" style="margin-top:10px">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="项目编号" prop="code" style="margin-left:15px">
            <el-input v-model="form.code" :disabled="editJudge"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="行业" prop="industryGroup">
            <el-checkbox-group v-model="form.industryGroup">
              <el-checkbox
                :label="item.name"
                name="industryGroup"
                v-for="(item,index) in industryList"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div style="overflow:hidden">
            <h3 class="floatL">项目权限</h3>
            <el-button
              type="primary"
              @click="projectPower"
              size="mini"
              class="floatL"
              style="margin-left:10px"
            >项目组管理</el-button>
          </div>
          <h3 style="margin:15px 0">项目描述</h3>
          <el-form-item prop="description" class="textA">
            <el-input v-model="form.description" :rows="10" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createProject" v-loading="loadingInstance1">保 存</el-button>

          <el-button @click="bigDialogVisible = false">取 消</el-button>
        </span>
        <el-dialog width="1075px" :visible.sync="innerVisible" append-to-body>
          <template slot="title">
            <el-button type="primary" @click="addJudge=!addJudge">添加成员</el-button>
          </template>
          <div class="card">
            <el-card class="box-card one" v-show="addJudge">
              <el-input v-model="userInput" placeholder="请输入员工姓名" style="width:180px"></el-input>
              <i class="el-icon-search searchIc" @click="searchUser"></i>
              <div style="height:400px;overflow:auto">
                <el-table
                  ref="multipleTable"
                  :data="userData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column prop="realname" label="姓名"></el-table-column>
                  <el-table-column prop="deptName" label="部门"></el-table-column>
                </el-table>
              </div>

              <div style="margin-top:20px;text-align:center">
                <el-button type="primary" @click="createUser">确认添加</el-button>
                <el-button @click="addJudge=false">关闭</el-button>
              </div>
            </el-card>
            <el-card class="box-card one" v-show="!addJudge">
              <ul ref="user" style="height:500px;overflow:auto">
                <li class="memberList" @click="magic(-1)">{{ addFlag?'当前用户':'' }}{{ owner }}(所有者)</li>
                <li
                  class="memberList"
                  v-for="(item,i) in userList"
                  :key="i"
                  @click="magic(item.userId)"
                >
                  {{ item.name }}
                  <i class="el-icon-close" @click.stop="deleteUser(item.userId)"></i>
                </li>
              </ul>
            </el-card>

            <el-card class="box-card four" ref="cards" v-show="cardJudge">
              <table border="1" class="power">
                <tr v-for="(item,index) in powerList" :key="index">
                  <td class="tdOne">{{ item.type[Object.keys(item.type)[0]] }}</td>
                  <td>
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox
                        :label="aitem"
                        v-for="(aitem,aindex) in item.enumMap"
                        :key="aindex"
                        disabled
                      ></el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px;text-align:center">
                <el-button type="primary" @click="innerVisible=false">保存</el-button>
                <el-button @click="innerVisible=false">关闭</el-button>
              </div>
            </el-card>

            <el-card class="box-card four" ref="cards" v-show="!cardJudge">
              <table border="1" class="power">
                <tr v-for="(item,index) in powerList" :key="index">
                  <td class="tdOne">{{ item.type[Object.keys(item.type)[0]] }}</td>
                  <td>
                    <el-checkbox-group v-model="nocheckList">
                      <el-checkbox
                        v-for="(aitem,aindex) in item.enumMap"

                        :label="aitem"
                        :key="aindex"
                      ></el-checkbox>
                    </el-checkbox-group>
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px;text-align:center">
                <el-button type="primary" @click="savePower">保存</el-button>
                <el-button @click="innerVisible=false">关闭</el-button>
              </div>
            </el-card>
          </div>
        </el-dialog>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import * as projectApi from '@/api/project/project'
import { tableOption } from '@/const/crud/admin/project'
var validateName = (rule, value, callback) => {
  var code = /^[a-zA-Z_\u4e00-\u9fa5]+$/
  if (value === '') {
    callback(new Error('请输入项目名称'))
  } else if (value.length > 50) {
    callback(new Error('长度请控制在 50 个字符以内'))
  } else if (!value.match(code)) {
    callback(new Error('只支持中文,英文,下划线'))
  } else {
    callback()
  }
}
var validateCode = (rule, value, callback) => {
  var code = /^[a-zA-Z_]{1,}$/
  if (value === '') {
    callback(new Error('请输入项目编号'))
  } else if (value.length > 50) {
    callback(new Error('长度请控制在 50 个字符以内'))
  } else if (!value.match(code)) {
    callback(new Error('只支持英文,下划线'))
  } else {
    callback()
  }
}
var validateIndustryGroup = (rule, value, callback) => {
  if (value.length > 10) {
    callback(new Error('请选择 10 个以内'))
  } else {
    callback()
  }
}
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
      bigDialogVisible: false,
      innerVisible: false,
      form: {
        name: '',
        code: '',
        description: '',
        industryGroup: []
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        code: [{ required: true, validator: validateCode, trigger: 'change' }],
        industryGroup: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个行业',
            trigger: 'change'
          },
          { type: 'array', validator: validateIndustryGroup, trigger: 'change' }
        ]
      },
      powerList: [],
      checkList: [],
      nocheckList: [],

      userData: [],
      userTemp: [],
      userInput: '',
      addJudge: true,
      userList: [],
      industryList: [],
      owner: '',
      multipleSelection: [],
      cardJudge: true,
      projectResourcePermission: [],
      userId: '',
      ownerId: '',
      editJudge: false,
      editId: '',
      addFlag: false,
      nowUser: '',
      loadingInstance1: false
    }
  },
  computed: {
    hangye(val) {
      return function(index) {
        var array = []
        var threeJudge = false
        if (index.toString().indexOf(',') !== -1) {
          var arr = []
          if (index.split(',').length > 3) {
            arr.push(
              index.split(',')[0],
              index.split(',')[1],
              index.split(',')[2]
            )
            threeJudge = true
          } else {
            arr = index.split(',')
          }
          arr.forEach(item => {
            this.industryList.forEach(aitem => {
              if (aitem.id == item) {
                array.push(aitem.name)
              }
            })
          })
        } else {
          this.industryList.forEach(aitem => {
            if (aitem.id == index) {
              array.push(aitem.name)
            }
          })
        }
        if (threeJudge) {
          return array.toString() + '...'
        } else {
          return array.toString()
        }
      }
    }
  },
  created() {
    this.handleList()
    this.testApi()
  },

  methods: {
    testApi() {
      projectApi
        .getUserInfo()
        .then(({ data }) => {
          this.nowUser = data.data.sysUser.userId
          console.log(this.nowUser, 'nowuser')
        })
        .then(() => {
          projectApi.getUser().then(({ data }) => {
            this.userTemp = data.data
            this.userData = data.data.filter(item => {
              return item.userId != this.nowUser
            })

            console.log(this.userData, '用户列表')
          })
        })

      projectApi.getIndustry().then(({ data }) => {
        this.industryList = data.data
      })
      projectApi.getProjectResourcePermission().then(({ data }) => {
        this.powerList = data.data
        this.checkList = []
        this.powerList.forEach(item => {
          for (var a in item.enumMap) {
            this.checkList.push(item.enumMap[a])
          }
        })
      })
    },
    handleList(payload) {
      this.tableLoading = true
      var obj = {}
      if (payload !== undefined) {
        obj = {
          projectName: payload.name
        }
      }
      projectApi
        .getProject({
          current: this.page.currentPage,
          size: this.page.pageSize,
          ...obj
        })
        .then(({ data }) => {
          const payload = data.data.projectInfoPage
          this.tableData = payload.records
          this.page.total = payload.total
          this.tableLoading = false
        })
    },
    searchChange(params) {
      this.handleList(params)
    },
    handleDel(row) {
      this.$confirm(
        '项目信息中存在模型及任务的都不允许删除,您确认删除项目信息吗',
        '确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          projectApi
            .deleteProjectInfo({
              id: row.id
            })
            .then(({ data }) => {
              if (data.code === 0) {
                this.handleList()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onEditRow(row) {
      this.editJudge = true
      this.editId = row.id
      this.bigDialogVisible = true
      projectApi
        .getProjectInfo({
          id: row.id
        })
        .then(({ data }) => {
          this.form = {
            ...data.data
          }
          this.ownerId = data.data.creatorId
          this.userTemp.forEach(item => {
            if (item.userId == this.ownerId) {
              this.owner = item.realname
            }
            console.log(item, 'sdfasdfasdfsdsssssss')
          })
          if (data.data.creatorId == this.nowUser) {
            this.userData = this.userTemp.filter(item => {
              return item.userId != this.nowUser
            })
          } else {
            this.userData = this.userTemp.filter(item => {
              return item.userId != this.ownerId
            })
          }

          console.log(this.ownerId, this.owner, 'this.owner')
          var arr = this.form.industryGroup

          this.form.industryGroup = []
          if (arr.indexOf(',') !== -1) {
            arr.split(',').forEach(item => [
              this.industryList.forEach(aitem => {
                if (item == aitem.id) {
                  this.form.industryGroup.push(aitem.name)
                }
              })
            ])
          } else {
            this.industryList.forEach(aitem => {
              if (arr == aitem.id) {
                this.form.industryGroup.push(aitem.name)
              }
            })
          }
          this.addJudge = false
        })
        .then(() => {
          projectApi
            .getOnepermission({
              projectId: row.id
            })
            .then(({ data }) => {
              console.log(data, '项目权限')

              this.userList = data.data.map(item => ({
                name: item.realName,
                userId: item.userId
              }))
              this.userList = this.userList.filter(item => {
                return item.userId != this.ownerId
              })
              // this.userList = this.userList.filter(item => {
              //   return item.userId != this.nowUser
              // })
              console.log(this.userList, 'this.userList')
              this.projectResourcePermission = data.data.map(item => ({
                userId: item.userId,
                ruleCode: item.ruleCode,
                id: item.id || ''
              }))
              this.projectResourcePermission = this.projectResourcePermission.filter(
                item => {
                  return item.userId != this.ownerId
                }
              )
              console.log(
                this.projectResourcePermission,
                'this.projectResourcePermission'
              )
            })
        })
    },
    onSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },

    handleAdd() {
      this.addFlag = true
      this.bigDialogVisible = true
      this.editJudge = false
    },
    createProject() {
      var industryGroup = []
      this.industryList.forEach((item, index) => {
        if (this.form.industryGroup.indexOf(item.name) !== -1) {
          industryGroup.push(item.id)
        }
      })
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loadingInstance1 = true
          if (!this.editJudge) {
            projectApi
              .addProject({
                code: this.form.code,
                description: this.form.description,
                industryGroup: industryGroup.toString(),
                name: this.form.name,
                projectResourcePermission: this.projectResourcePermission
              })
              .then(({ data }) => {
                if (data.code === 0) {
                  this.loadingInstance1 = false
                  this.handleList()
                  this.bigDialogVisible = false
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  })
                }
              }).catch(()=>{
                  this.loadingInstance1 = false

              })
          } else {
            projectApi
              .editProject({
                code: this.form.code,
                description: this.form.description,
                industryGroup: industryGroup.toString(),
                name: this.form.name,
                id: this.editId,
                projectResourcePermission: this.projectResourcePermission
              })
              .then(({ data }) => {
                if (data.code === 0) {
                  this.handleList()
                  this.loadingInstance1 = false
                  this.bigDialogVisible = false
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                }
              }).catch(()=>{
                  this.loadingInstance1 = false

              })
          }
        } else {
          return false
        }
      })
    },
    projectPower() {
      this.innerVisible = true
      this.cardJudge = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchUser() {
      projectApi
        .getUser({
          name: this.userInput
        })
        .then(({ data }) => {
          this.userData = data.data
        })
    },
    createUser() {
      this.multipleSelection
        .map(item => ({
          name: item.realname,
          userId: item.userId
        }))
        .forEach(item => {
          this.userList.unshift(item)
        })
      var newarr = []
      this.userList.forEach((element, i) => {
        var flag = true
        newarr.forEach((item, j) => {
          if (element.userId == newarr[j].userId) {
            flag = false
          }
        })
        if (flag) {
          newarr.push(this.userList[i])
        }
      })
      this.userList = newarr
      console.log('表示很无奈', this.userList)

      this.userList = this.userList.filter(item => {
        return item.name !== this.owner
      })
      this.$refs.multipleTable.clearSelection()
      this.addJudge = false
    },
    magic(payload) {
      if (payload === -1) {
        this.cardJudge = true
      } else {
        this.cardJudge = false
      }
      this.userId = payload
      this.nocheckList = []

      if (this.projectResourcePermission.length != 0) {
        this.projectResourcePermission.forEach((c, i) => {
          if (c.userId == this.userId) {
            //把英文转化成中文
            var temporary = {}
            this.powerList.forEach(item => {
              for (var a in item.enumMap) {
                temporary[a] = item.enumMap[a]
              }
            })
            c.ruleCode.split(',').forEach(item => {
              for (var d in temporary) {
                if (item == d) {
                  this.nocheckList.push(temporary[d])
                }
              }
            })
          }
        })
      }
    },
    savePower() {
      var temporary = {}
      var arr = []
      //把勾选的权限转化成英文
      this.powerList.forEach(item => {
        for (var a in item.enumMap) {
          temporary[a] = item.enumMap[a]
        }
      })
      this.nocheckList.forEach(item => {
        for (var b in temporary) {
          if (item == temporary[b]) {
            arr.push(b)
          }
        }
      })
      //如果权限存在  则不增加
      var num = ''
      this.projectResourcePermission.forEach((c, i) => {
        if (c.userId == this.userId) {
          num = i
        }
      })
      if (num !== '') {
        this.projectResourcePermission[num] = {
          userId: this.userId,
          ruleCode: arr.toString()
        }
      } else {
        this.projectResourcePermission.push({
          userId: this.userId,
          ruleCode: arr.toString()
        })
      }
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
    },
    deleteUser(payload) {
      this.userList = this.userList.filter(item => {
        return item.userId != payload
      })
      this.projectResourcePermission = this.projectResourcePermission.filter(
        item => {
          return item.userId != payload
        }
      )
      this.cardJudge = true
    },
    dialogClose() {
      this.addFlag = false
      this.form = {
        name: '',
        code: '',
        description: '',
        industryGroup: []
      }
      this.userList = []
      this.projectResourcePermission = []
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  display: inline-block;
}
.floatL {
  float: left;
}
.textA {
  /deep/.el-form-item__content {
    margin-left: 0 !important;
    width: 100%;
  }
  width: 100%;
}

.card {
  height: 500px;
  padding: 10px 0;
  .one {
    width: 32%;
    float: left;
    height: 500px;
    /deep/.el-card__body {
      padding: 0;
    }
  }
  .four {
    width: 65%;
    float: left;
    height: 500px;
    margin-left: 10px;
  }
  .power {
    width: 100%;
  }
  .tdOne {
    width: 25%;
    text-align: center;
  }
  td {
    padding: 30px 8px;
  }
  .searchIc {
    font-size: 32px;
    vertical-align: middle;
    padding: 0 13px;
    margin-bottom: 3px;
    cursor: pointer;
  }
  .memberList {
    padding: 18px 4px;
    &:hover {
      background-color: #f5f7fa;
      cursor: pointer;
    }
    position: relative;
    i {
      position: absolute;
      right: 0;
      font-size: 18px;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
