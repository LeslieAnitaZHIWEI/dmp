<template>
  <el-form :model="formData" label-width="140px" ref="segmentForm" :rules="rules">
    <el-row>
      <el-col :span="12">
        <el-form-item label="用户分群名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="用户分群code" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <h3>选择标签</h3>
    <el-row>
      <el-col :span="12">
        <el-form-item label="搜索标签">
          <el-input v-model="formData.search" style="width:200px;margin-right:10px"></el-input>
          <el-button type="primary" @click="onSearchTag">
            <i class="el-icon-search" /> 搜索
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-transfer
        v-model="transferVal"
        :data="transferList"
        :titles="['可选', '己选']"
        :button-texts="['删除', '选择']"
      ></el-transfer>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="isSubmiting" @click="onSubmit">保存</el-button>

      <el-button>返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { dateFormat } from '@/util/date'
import { FormRuleMap } from '@/const/formValid'
import { getUserTagLayerByName } from '@/api/project/user-tag'
import {
  addPersonProfile,
  editPersonProfile
} from '@/api/project/person-profile'
import { mapGetters } from 'vuex'
export default {
  name: 'SegmentEdit',
  props: {
    editData: Object
  },
  data() {
    return {
      isAdd: true,
      formData: {
        name: '',
        code: '',
        search: ''
      },
      transferVal: [],
      transferList: [],
      isSubmiting: false,

      rules: {
        name: [
          { required: true, message: '请输入用户分群名称', trigger: 'blur' },
          { ...FormRuleMap.maxLen50 }
        ],

        code: [
          { required: true, message: '请输入用户分群code', trigger: 'blur' },
          { ...FormRuleMap.enNumUnder }
        ]
      }
    }
  },

  computed: {
    ...mapGetters(['projectId', 'meteEventTypes'])
  },

  created() {
    const data = this.editData

    if (data && data.id) {
      this.formData.name = data.name
      this.formData.code = data.code

      this.transferList = this.getListFromMap(data.tagLayerIdAndTagLayerNameMap)

      this.transferVal = this.transferList.map(item => {
        return item.key
      })

      this.isAdd = false
    } else {
      this.formData.name = ''
      this.formData.code = ''
      this.transferList = []
      this.transferVal = []
    }
  },

  methods: {
    onSearchTag() {
      this.getUserTagLayerByName()
    },

    getUserTagLayerByName() {
      getUserTagLayerByName({
        projectId: this.projectId,
        tagName: this.formData.search
      }).then(res => {
        const { data } = res

        //const data = {"code":0,"msg":null,"data":[{"id":17,"userTagId":670,"name":"金额大于660","relationDictId":1,"sortNumber":0,"tagName":"金额"}]};

        if (data && data.code === 0 && data.data) {
          const records = data.data.map(item => {
            return {
              key: item.id,
              label: item.tagName + '-' + item.name
            }
          })

          /** 要过滤下 */
          const filterMap = {}
          this.transferList.forEach(item => {
            filterMap[item.key] = true
          })

          this.transferList = this.transferList.concat(
            records.filter(item => {
              return !filterMap[item.key]
            })
          )
        }
      })
    },

    getListFromMap(tagMap) {
      const tagList = []

      for (let tag in tagMap) {
        tagList.push({
          key: tag,
          label: tagMap[tag]
        })
      }

      return tagList
    },

    onSubmit() {
      this.$refs['segmentForm'].validate(valid => {
        if (valid) {
          /** 标签集上限20 */
          if (this.transferVal.length > 20) {
            this.$alert('标签最多 20 个', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          } else {
            if (this.isAdd) {
              this.addPersonProfile()
            } else {
              this.editPersonProfile()
            }
          }
        }
      })
    },

    addPersonProfile() {
      addPersonProfile(this.getFormData())
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message.success('新增成功')
            this.onClose()
          }

          this.isSubmiting = false
        })
        .catch(e => {
          this.isSubmiting = false
        })
    },

    editPersonProfile() {
      this.isSubmiting = true

      editPersonProfile(this.getFormData())
        .then(res => {
          const { data } = res

          if (data.code === 0) {
            this.$message.success('修改成功')
            this.onClose()
          }

          this.isSubmiting = false
        })
        .catch(e => {
          this.isSubmiting = false
        })
    },

    getFormData() {
      const editData = this.editData
      const formData = this.formData

      const data = {
        name: formData.name,
        code: formData.code,
        updateTime: dateFormat(new Date()),
        tagLayerId: this.transferVal.join(',')
      }

      if (this.isAdd) {
        data.deleteFlag = 0
        data.id = 0
        data.projectId = this.projectId
        data.version = 1.0
        data.createTime = dateFormat(new Date())
      } else {
        data.deleteFlag = editData.deleteFlag
        data.id = editData.id
        data.projectId = editData.projectId
        data.version = editData.version
        data.createTime = editData.createTime
      }

      return data
    },

    onClose() {
      this.$emit('close-drawer')
    }
  }
}
</script>
