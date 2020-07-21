<template>
  <div>
    <el-row>
      <el-col :span="8">
        <span>
          总计
          <b>{{ recordsData.totalNumber }}</b>条记录,达到率
          <b>{{ recordsData.successRatio }}</b>
        </span>
        <br />
        <span>
          其中成功
          <b>{{ recordsData.successNumber }}</b>条,失败
          <b>{{ recordsData.defeatedNumber }}</b>条,未知
          <b>{{ recordsData.unknownNumber }}</b>条
        </span>
      </el-col>
      <el-col :span="16">
        <el-form :model="searchForm" label-width="76px" class="detail-form">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="searchForm.phone" placeholder="精确搜索" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="接受状态" prop="statu">
            <el-select v-model="searchForm.statu" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-button
            icon="el-icon-search"
            type="primary"
            style="float:right"
            @click="handleSearchChange"
          >查询</el-button>
        </el-form>
      </el-col>
    </el-row>

    <avue-crud
      id="sms_send_record_table"
      ref="recordTable"
      :page="page"
      :data="tableData"
      :table-loading="tableLoading"
      :option="tableDetailOption"
      @current-change="currentChange"
      @size-change="handleSizeChange"
    >
      <template slot="mobilePhone" slot-scope="scope">
        <i class="el-icon-mobile-phone"></i>
        {{ scope.row.mobilePhone }}
      </template>
      <template slot="sendTime" slot-scope="scope">
        <span v-if="scope.row.sendTime !== null">
          <i class="el-icon-time"></i>
          {{ scope.row.sendTime }}
        </span>
        <span v-else>-</span>
      </template>
      <template slot="sendState" slot-scope="scope">
        <span v-if="scope.row.sendState === options[1].value">
          <i class="el-icon-success" style="color:#67C23A"></i> {{ options[1].label }}
        </span>
        <span v-else-if="scope.row.sendState === options[0].value">
          <i class="el-icon-error" style="color:#C0C4CC"></i> {{ options[0].label }}
        </span>
        <span v-else>
          <i class="el-icon-question" style="color:#F56C6C"></i> {{ options[2].label }}
        </span>
      </template>
    </avue-crud>
  </div>
</template>
<script>
import { tableDetailOption } from '@/const/crud/admin/sys-messageRecord'
import * as sendMessageApi from '@/api/project/sendMessage'

export default {
  props: {
    id: {
      type: Number,
      default: () => ''
    },
    clearForm: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      searchForm: {
        phone: '',
        statu: ''
      },
      options: [
        {
          value: 0,
          label: '失败'
        },
        {
          value: 1,
          label: '成功'
        },
        {
          value: 2,
          label: '未知'
        }
      ],
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableDetailOption: {
        ...tableDetailOption
      },
      recordsData: {}
    }
  },

  computed: {},
  watch: {
    id: {
      handler(value) {
        if (value) {
          this.handleList()
          this.getSmsrecordStatistics()
        } else {
          this.tableData = []
        }
      },
      deep: true,
      immediate: true
    },
    clearForm: {
      handler(value) {
        this.searchForm = {
          ...this.searchForm,
          phone: '',
          statu: ''
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    currentChange(page) {
      this.page.currentPage = page

      this.handleList()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.handleList()
    },
    handleSearchChange() {
      this.handleList(this.searchForm)
    },
    handleList(searchPayload) {
      this.tableLoading = true

      sendMessageApi
        .getSmsrecord({
          taskId: this.id,
          current: this.page.currentPage,
          size: this.page.pageSize,
          ...this.searchForm
        })
        .then(({ data }) => {
          this.tableData = data.data.records
          this.tableLoading = false
          this.page.total = data.data.total

          this.$nextTick(this.adjustTableScroll)
        })
    },
    getSmsrecordStatistics() {
      sendMessageApi
        .getSmsrecordStatistics({
          taskId: this.id
        })
        .then(({ data }) => {
          this.recordsData = {
            ...data.data
          }
        })
    },

    /**
     * 根据表格内容的行数，调整滑动条是否可见
     */
    adjustTableScroll() {
      const table = document.querySelectorAll(
        '#sms_send_record_table div.el-table'
      )[0]
      const scroller = document.querySelectorAll(
        '#sms_send_record_table .el-table__body-wrapper'
      )[0]
      const rows = document.querySelectorAll(
        '#sms_send_record_table table.el-table__body tr'
      )

      // 重新设为不滚动

      let len = rows.length

      if (len > 10) {
        const scrollHeight = scroller.scrollHeight

        const row10 = rows[9]
        const lastRow = rows[len - 1]
        const height =
          lastRow.offsetTop +
          lastRow.scrollHeight -
          row10.offsetTop -
          row10.scrollHeight

        table.classList.add('el-table--scrollable-y')

        scroller.style.height = scrollHeight - height + 'px'

        scroller.scrollTop = 0
      } else {
        table.classList.remove('el-table--scrollable-y')
        scroller.style.height = 'auto'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 200px;
  margin: 0 10px;
}
b {
  padding: 0 3px;
}
.detail-form /deep/ .el-form-item {
  display: inline-block;
}
/deep/ .el-icon-mobile-phone,
/deep/ .el-icon-time {
  color: #c0c4cc;
}
</style>
