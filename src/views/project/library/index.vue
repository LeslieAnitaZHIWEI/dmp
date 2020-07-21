<template>
  <div>
    <basic-container class="flex">
      <el-aside width="300px">
        <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick" ref="nodeRef"></avue-tree>
      </el-aside>
      <el-main>
        <avue-crud :data="data" :option="option" v-model="obj" :table-loading="mainLoading"></avue-crud>
      </el-main>
    </basic-container>
  </div>
</template>
<script>
import * as libraryApi from '@/api/project/library'
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import request from '@/router/axios'

export default {
  data() {
    return {
      obj: {},
      treeData: [],
      treeOption: {
        nodeKey: 'id',
        addBtn: false,
        menu: false,
        size: 'small',
        formOption: {
          labelWidth: 100,
          column: [
            {
              label: '自定义项',
              prop: 'test'
            }
          ]
        },
        props: {
          labelText: '标题',
          label: 'label',
          value: 'value',
          children: 'children'
        }
      },
      data: [],

      option: {
        refreshBtn: false,
        columnBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menu: false,
        title: '',
        column: []
      },
      mainLoading: false,
      cancelToken: null
    }
  },
  created() {
    this.data = this.data0
    libraryApi
      .gettablesList({
        projectId: this.projectId
      })
      .then(({ data }) => {
        console.log(data)
        this.treeData = data.data.map(item => ({
          label: item,
          value: item
        }))
        console.log(this.treeData, 'treeData')
        if (this.treeData.length != 0) {
          this.$refs.nodeRef.nodeClick(this.treeData[0])
        }
      })
  },
  mounted() {
    console.log(this.$refs.nodeRef.$children, '输入表名模糊搜索')
    this.$refs.nodeRef.$children[0].$refs['input'].placeholder =
      '输入表名模糊搜索'
  },
  methods: {
    nodeClick(data) {
      console.log(data)
      this.option.title = data.value
      this.mainLoading = true
      this.data = []
      this.option.column = [{ label: '', prop: '' }]

      if (this.cancelToken) {
        this.cancelToken.cancel('一次只能有一个请求')
      }

      const CancelToken = request.CancelToken
      const source = CancelToken.source()

      this.cancelToken = source
      libraryApi
        .gettablerecord(
          {
            projectId: this.projectId,
            tableName: data.value
          },
          {
            cancelToken: source.token
          }
        )
        .then(({ data }) => {
          console.log(data, 'gettablerecord')

          this.option.column = data.data.columns.map(item => ({
            label: item,
            prop: item
          }))

          setTimeout(() => {
            console.log(
              JSON.stringify(this.option.column),
              'this.option.column'
            )
          }, 1000)

          var array = []
          // data.data.columns.forEach((item,index)=>{
          //     array.push({
          //       [item]:
          //     })
          // })
          data.data.tableList.forEach((item, index) => {
            var obj = {}
            var i = 0
            for (var aaa of data.data.columns) {
              obj[aaa] = data.data.tableList[index][i]
              i++
            }
            array.push(obj)
          })

          console.log(array, 'array')
          this.mainLoading = false
          this.data = array
        })
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-container {
  background-color: #fff;
  padding: 20px;
}
/deep/.avue-crud__menu {
  display: none;
}
/deep/ .avue-crud__empty {
  min-width: 500px;
}
/deep/.el-tree-node__content {
  padding: 5px 0;
}
/deep/.el-card__body {
  display: flex;
}
</style>
