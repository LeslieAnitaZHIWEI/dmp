<template>
  <div class="rule-item-cell">
    <el-form-item
      label-width="0"
      :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.startEndTime'"
      :rules="[
          { required: true, message: '请选择开始和结束时间', trigger: ['blur','change'] },
          { validator: checkDataRange, message: '时间跨度不能超过一年', trigger: 'blur' },
        ]"
    >
      <!-- <el-date-picker
        :value="rule.startEndTime"
        type="daterange"
        :disabled="!(rule.latest)"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :unlink-panels="true"
        @input="onStartEndTimeChange"
      ></el-date-picker>-->
      <div
        class="supernatant"
        :style="{ 'background': rule.latest?'#ffffff':'#F5F7FA' }"
        v-show="textJudge"
      >{{ zuijinyizhou}}</div>
      <el-date-picker
        :value="rule.startEndTime"
        style="width:240px"
        @input="onStartEndTimeChange"
        type="datetimerange"
        @change="dateRangeChange"
        :clearable="false"
        :disabled="!(rule.latest)"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
    </el-form-item>

    <el-form-item
      label-width="0"
      :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.existed'"
      :rules="[
          { required: true, message: '请选择', trigger: ['blur','change'] }
        ]"
    >
      <el-select
        class="operate-select"
        :disabled="!(rule.latest)"
        :value="rule.existed"
        placeholder="请选择"
        @change="onExistedChange"
      >
        <el-option
          v-for="item in tagRuleHasDone"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label-width="0"
      :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.metaEventId'"
      :rules="[
          { required: true, message: '请选择', trigger: ['blur','change'] }
        ]"
    >
      <el-select
        :disabled="!(rule.latest)"
        :value="rule.metaEventId"
        placeholder="请选择"
        @change="onEventChange"
      >
        <el-option v-for="item in eventList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="rule.hasProperty&&rule.existed"
      label-width="0"
      :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.metaEventPropertyId'"
      :rules="[
          { required: true, message: '请选择', trigger: ['blur','change'] }
        ]"
    >
      <!-- <el-select
        :disabled="!(rule.latest)"
        :value="rule.metaEventPropertyId"
        placeholder="请选择"
        @change="onEventPropertyChange"
      >-->
      <!-- <el-option
          v-for="item in rule.eventPropertyList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>-->
      <el-cascader
        :value="rule.metaEventPropertyId"
        :disabled="!(rule.latest)"
        :options="eventPropertyList"
        @change="cascaderChange"
      ></el-cascader>
    </el-form-item>
    <br />
    <el-form-item
      v-if="rule.hasProperty&&rule.existed"
      label-width="0"
      :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.operateDict'"
      :rules="[
          { required: true, message: '请选择', trigger: ['blur','change'] }
        ]"
    >
      <el-select
        class="operate-select"
        :disabled="!(rule.latest)"
        :value="rule.operateDict"
        placeholder="请选择"
        @change="onOperateChange"
      >
        <el-option
          v-for="item in rule.operateList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <span
      v-if="rule.hasProperty&&rule.existed && rule.operateDict !== rulesMap.NOT_EXISTED.value && rule.propertyTypeName !== 'BOOLEAN'"
    >
      <span v-if="rule.operateDict === rulesMap.RANGE.value">
        <el-form-item
          v-if="rule.propertyTypeName === 'DATE'"
          label-width="0"
          :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rangeDate'"
          :rules="[
              { required: true, message: '请选择开始和结束时间', trigger: ['blur','change'] },
              { validator: checkDataRange, message: '时间跨度不能超过一年', trigger: 'blur' },
            ]"
        >
          <el-date-picker
            :value="rule.rangeDate"
            type="daterange"
            :disabled="!(rule.latest)"
            :default-time="defaultDateRange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :unlink-panels="true"
            @input="onRangeDateChange"
          ></el-date-picker>
        </el-form-item>

        <span v-else>
          <el-form-item
            label-width="0"
            :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rangeNumber1'"
            :rules="[
                { required: true, message: '请输入较小值', trigger: ['blur','change'] }
              ]"
          >
            <el-input
              style="width:130px"
              type="number"
              :disabled="!(rule.latest)"
              :value="rule.rangeNumber1"
              placeholder="请输入较小值"
              @input="rangeNumber1Change"
            ></el-input>
          </el-form-item>
          <span style="margin:0 7px">到</span>
          <el-form-item
            label-width="0"
            :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rangeNumber2'"
            :rules="[
                { required: true, message: '请输入较大值', trigger: ['blur','change'] },
                { validator: checkMinMaxNumber, message: '不能小于前面的值', trigger: 'blur' }
              ]"
          >
            <el-input
              style="width:130px"
              type="number"
              :disabled="!(rule.latest)"
              :value="rule.rangeNumber2"
              placeholder="请输入较大值"
              @input="rangeNumber2Change"
            ></el-input>
          </el-form-item>
        </span>
      </span>
      <span v-else-if="rule.operateDict === rulesMap.RANKING.value">
        <el-form-item
          label-width="0"
          :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rankqian'"
          :rules="[
                { required: true, message: '请选择', trigger: ['blur','change'] }
              ]"
        >
          <el-select
            :value="rule.rankqian"
            placeholder="请选择"
            :disabled="!(rule.latest)"
            @change="onQianChange"
            style="width:100px"
          >
            <el-option label="前" value="qian"></el-option>
            <el-option label="后" value="hou"></el-option>
            <el-option label="区间" value="qujian"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="0"
          v-if="rule.rankqian!='qujian'"
          :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rankValue'"
        >
          <el-input :value="rule.rankValue" @input="rankValueChange" style="width:80px"></el-input>
        </el-form-item>
        <span v-else>
          <el-form-item
            label-width="0"
            :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rankrangeNumber1'"
            :rules="[
                { required: true, message: '请输入较小值', trigger: ['blur','change'] }
              ]"
          >
            <el-input
              style="width:130px"
              type="number"
              :disabled="!(rule.latest)"
              :value="rule.rankrangeNumber1"
              placeholder="请输入较小值"
              @input="rankrangeNumber1Change"
            ></el-input>
          </el-form-item>
          <span style="margin:0 7px">到</span>
          <el-form-item
            label-width="0"
            :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.rankrangeNumber2'"
            :rules="[
                { required: true, message: '请输入较大值', trigger: ['blur','change'] },
                { validator: rankcheckMinMaxNumber, message: '不能小于前面的值', trigger: 'blur' }
              ]"
          >
            <el-input
              style="width:130px"
              type="number"
              :value="rule.rankrangeNumber2"
              placeholder="请输入较大值"
              :disabled="!(rule.latest)"
              @input="rankrangeNumber2Change"
            ></el-input>
          </el-form-item>
        </span>
        <el-form-item
          label-width="0"
          :rules="[
          { required: true, message: '请选择', trigger: ['blur','change'] }
        ]"
        >
          <el-select
            :value="rule.rankhou"
            placeholder="请选择"
            @change="onHouChange"
            :disabled="!(rule.latest)"
            style="width:100px"
          >
            <el-option label="名" value="ming"></el-option>
            <el-option label="百分比" value="percent"></el-option>
          </el-select>
        </el-form-item>
      </span>
      <span v-else>
        <el-date-picker
          v-if="rule.propertyTypeName === 'DATE'"
          :value="rule.propertyValue"
          type="date"
          :disabled="!(rule.latest)"
          :default-time="defaultDate"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @input="onEventPropertyValueChange"
          :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.propertyValue'"
          :rules="[
              { type: 'date', required: true, message: '请选择时间', trigger: 'blur' },
            ]"
        />

        <el-form-item
          v-else
          label-width="0"
          :prop="'layers.' + layerIndex + '.rules.' + ruleIndex + '.propertyValue'"
          :rules="[
            { required: true, message: '请输入内容', trigger: ['blur','change'] }
          ]"
        >
          <el-input
            style="width:180px"
            :type="rule.propertyTypeName === 'NUMBER' ? 'number': 'text'"
            :value="rule.propertyValue"
            placeholder="请输入内容"
            :disabled="!(rule.latest)"
            @input="onEventPropertyValueChange"
          ></el-input>
        </el-form-item>
      </span>
    </span>
  </div>
</template>

<script>
import {
  eventRules,
  rulesMap,
  tagRuleHasDone,
  operateTypeDict,
  userTagLayerRule
} from '@/const/project/user-tag'
import { getDayEnd, getDayStart, getLastYearTime } from '@/util/date'
import { mapState } from 'vuex'

export default {
  name: 'OperatorSelect',
  props: {
    rule: Object,
    ruleIndex: Number,
    layerIndex: Number
  },

  data() {
    const endTime = new Date()

    const startTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    //console.log(getDayStart(nowTime - 7 * 24 * 60 * 60 * 1000));
    var clickDate = payload => {
      this.zuijinyizhou = payload
      console.log('哪个先')
      this.textJudge = true
      var value
      if (payload == '近7天') {
        value = 7
      } else if (payload == '近30天') {
        value = 30
      } else if (payload == '近60天') {
        value = 60
      } else if (payload == '昨日') {
        value = 0
      } else if (payload == '本周') {
        value = -1
      } else if (payload == '上周') {
        value = -2
      } else if (payload == '本月') {
        value = -3
      } else if (payload == '上月') {
        value = -4
      } else if (payload == '本年') {
        value = -5
      } else if (payload == '去年') {
        value = -6
      }
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'inDays',
        value
      })
      // setTimeout(() => {
      // this.focusEl.$el.innerHTML=this.focusEl.$el.innerHTML+'<input autocomplete="off" placeholder="结束日期" name="" class="el-range-input">'

      // }, 200);
    }
    return {
      tagRuleHasDone: tagRuleHasDone,

      rulesMap,
      zuijinyizhou: '',
      defaultDateRange: [getDayStart(startTime), getDayEnd(endTime)],
      defaultDate: getDayEnd(endTime),
      pickerOptions: {
        shortcuts: [
          {
            text: '近7天',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '近30天',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '近60天',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '至今自定义',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '昨日',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '本周',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '上周',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const start = new Date()
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const end = new Date()
              // const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [end, end])
              console.log(picker)
              clickDate(this.text)
            }
          },
          {
            text: '本年',
            onClick(picker) {
              // const end = new Date();
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          },
          {
            text: '去年',
            onClick(picker) {
              // const end = new Date();
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, start])
              clickDate(this.text)
            }
          }
        ]
      },
      textJudge: false,
      eventPropertyList: []
    }
  },

  computed: {
    ...mapState({
      //editTagData: state => state.userTag.editTagData,
      eventList: state => state.userTag.eventList
    })
  },

  created() {
    console.log(this.rule, '规则')
    /** 如果是修改的，要提前查  */
    if (this.rule.id !== 0) {
      /** 事件属性 */
      this.getPropList().then(() => {
        /** 操作 */
        const list = this.getOperateList(this.rule.metaEventPropertyId)

        if (list) {
          this.updateOperateList(list)
        }

        /** 如果是区间 */
        if (this.rule.operateDict === rulesMap.RANGE.value) {
          const vals = this.rule.propertyValue.split(',')

          if (this.rule.propertyTypeName === 'DATE') {
            this.$store.dispatch('userTag/userTagRuleChange', {
              ruleIndex: this.ruleIndex,
              layerIndex: this.layerIndex,

              name: 'rangeDate',
              value: vals
            })
          } else {
            this.$store.dispatch('userTag/userTagRuleChange', {
              ruleIndex: this.ruleIndex,
              layerIndex: this.layerIndex,

              name: 'rangeNumber1',
              value: vals[0]
            })

            this.$store.dispatch('userTag/userTagRuleChange', {
              ruleIndex: this.ruleIndex,
              layerIndex: this.layerIndex,

              name: 'rangeNumber2',
              value: vals[1]
            })
          }
        }
      })
    }
  },

  updated() {},

  watch: {
    // ruleDate: function() {
    //   this.$store.dispatch('userTag/userTagRuleChange', {
    //     ruleIndex: this.ruleIndex,
    //     layerIndex: this.layerIndex,
    //     name: 'startTime',
    //     value: this.ruleDate[0
    //   });
    //   this.$store.dispatch('userTag/userTagRuleChange', {
    //     ruleIndex: this.ruleIndex,
    //     layerIndex: this.layerIndex,
    //     name: 'endTime',
    //     value: this.ruleDate[1]
    //   });
    // },
    // date: function(){
    //   this.onEventPropertyValueChange(this.date);
    // },
    // dateRange: function(){
    //   this.onEventPropertyValueChange(this.dateRange.join(','));
    // }
    rule: {
      handler(val) {
        if (val.eventPropertyList) {
          console.log('zoulema', val.eventPropertyList)
          this.eventPropertyList = JSON.parse(
            JSON.stringify(val.eventPropertyList)
          )
          this.eventPropertyList = this.eventPropertyList.map(item => {
            if (item.propertyType == '2') {
              return {
                value: item.id,
                label: item.name,
                children: [
                  {
                    value: 1,
                    label: '总和'
                  },
                  {
                    value: 2,
                    label: '均值'
                  },
                  {
                    value: 3,
                    label: '最大值'
                  },
                  {
                    value: 4,
                    label: '最小值'
                  }
                ]
              }
            } else {
              return {
                value: item.id,
                label: item.name
              }
            }
          })
          if (this.eventPropertyList.length !== 0) {
            this.eventPropertyList.unshift({
              value: 0,
              label: '总次数'
            })
          }
          console.log('bbbbb', this.eventPropertyList)

          // if(val.eventPropertyList.propertyType=="2"){
          //   console.log("zoulema")
          //     this.eventPropertyList=this.eventPropertyList.map(item=>({
          //       value:item.id,
          //       label:item.name,
          //       children: [{
          //     value: 'yizhi',
          //     label: '一致'
          //   }, {
          //     value: 'fankui',
          //     label: '反馈'
          //   }, {
          //     value: 'xiaolv',
          //     label: '效率'
          //   }, {
          //     value: 'kekong',
          //     label: '可控'
          //   }]
          //     }))
          // }
        }

        if (val.startEndTime[0] == val.startEndTime[1]) {
          this.textJudge = true
        } else if (val.inDays != null) {
          this.textJudge = true
        } else {
          this.textJudge = false
          this.$store.dispatch('userTag/userTagRuleChange', {
            ruleIndex: this.ruleIndex,
            layerIndex: this.layerIndex,

            name: 'inDays',
            value: null
          })
        }
        switch (val.inDays) {
          case 7:
            this.zuijinyizhou = '近7天'
            break
          case 30:
            this.zuijinyizhou = '近30天'
            break
          case 60:
            this.zuijinyizhou = '近60天'
            break
          case 0:
            this.zuijinyizhou = '昨日'
            break
          case -1:
            this.zuijinyizhou = '本周'
            break
          case -2:
            this.zuijinyizhou = '上周'
            break
          case -3:
            this.zuijinyizhou = '本月'
            break
          case -4:
            this.zuijinyizhou = '上月'
            break
          case -5:
            this.zuijinyizhou = '本年'
            break
          case -6:
            this.zuijinyizhou = '去年'
            break
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    onStartEndTimeChange(date) {
      console.log(date)
      if (date[0] != date[1]) {
        this.$store.dispatch('userTag/userTagRuleChange', {
          ruleIndex: this.ruleIndex,
          layerIndex: this.layerIndex,

          name: 'inDays',
          value: null
        })
      }
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'startEndTime',
        value: date
      })
    },
    dateRangeChange() {
      // console.log('时间改变', this.rule.startEndTime)
      // if (this.rule.startEndTime[0] == this.rule.startEndTime[1]) {
      //   this.textJudge = true
      // } else {
      //   this.textJudge = false
      //   this.$store.dispatch('userTag/userTagRuleChange', {
      //     ruleIndex: this.ruleIndex,
      //     layerIndex: this.layerIndex,
      //     name: 'inDays',
      //     value: ''
      //   })
      // }
    },
    onExistedChange(isExisted) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'existed',
        value: isExisted
      })
    },

    onEventChange(eventId) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'metaEventId',
        value: eventId
      })

      this.getPropList()
    },

    /**
     * @returns { Promise } 用于下一步操作
     */
    getPropList() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('userTag/getMetaEventPropByEventId', {
            layerIndex: this.layerIndex,
            ruleIndex: this.ruleIndex,
            eventId: this.rule.metaEventId
          })
          .then(() => {
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },

    onEventPropertyChange(propId) {
      this.$store
        .dispatch('userTag/userTagRuleChange', {
          ruleIndex: this.ruleIndex,
          layerIndex: this.layerIndex,

          name: 'metaEventPropertyId',
          value: propId
        })
        .then(() => {
          const list = this.getOperateList(propId)

          if (list) {
            this.updateOperateList(list)
          }

          /** 清空操作值 */
          this.$store.dispatch('userTag/userTagRuleChange', {
            ruleIndex: this.ruleIndex,
            layerIndex: this.layerIndex,

            name: 'operateDict',
            value: ''
          })

          this.cleanPropertyValue()
        })
    },
    onQianChange(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rankqian',
        value
      })
    },
    onHouChange(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rankhou',
        value
      })
    },
    updateOperateList(list) {
      /** 更新操作列表 */
      this.$store.dispatch('userTag/setOperateList', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,
        list: list
      })
    },

    getOperateList(propId) {
      /** 看看事件的类型 */
      console.log(propId, 'pppppppp')
      if (propId instanceof Array) {
        propId = propId[0]
      }

      console.log(this.$store.state.userTag.editTagData)
      const event = this.getItemByKeyVal(
        {
          key: 'id',
          value: propId
        },
        this.rule.eventPropertyList
      )

      if (event) {
        const operateType = this.getItemByKeyVal(
          {
            key: 'value',
            value: event.propertyType
          },
          operateTypeDict
        )

        if (operateType) {
          const name = operateType.name

          /** 设置当前的 typeName 值，有 NUMBER,DATE,BOOLEAN,TEXT */
          this.$store.dispatch('userTag/setPropertyTypeName', {
            ruleIndex: this.ruleIndex,
            layerIndex: this.layerIndex,
            name
          })

          return userTagLayerRule[name]
        }
      }

      return null
    },

    onOperateChange(dictId) {
      //先清空 rankqianhou
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rangeNumber1',
        value: ''
      })
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rangeNumber2',
        value: ''
      })
      console.log(this.$store.state.userTag.editTagData, 'ddd')

      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'operateDict',
        value: dictId
      })

      // 如果是没有值
      if (dictId === this.rulesMap.NOT_EXISTED.value) {
        this.onEventPropertyValueChange('')
      }
    },

    onEventPropertyValueChange(propVal) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'propertyValue',
        value: propVal
      })
    },

    rangeNumber1Change(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rangeNumber1',
        value
      })
    },
    rankrangeNumber1Change(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rankrangeNumber1',
        value
      })
    },
    rangeNumber2Change(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rangeNumber2',
        value
      })
    },
    rankrangeNumber2Change(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rankrangeNumber2',
        value
      })
    },
    rankValueChange(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rankValue',
        value
      })
    },
    onRangeDateChange(value) {
      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex: this.ruleIndex,
        layerIndex: this.layerIndex,

        name: 'rangeDate',
        value
      })
    },

    getItemByKeyVal(params, arr) {
      const key = params.key
      const val = params.value
      console.log(arr, 'arrarrarr')
      console.log(val, 'arrarrarr')
      const list = arr.filter(item => {
        return item[key] === val
      })
      if (val == 0) {
        return arr[0]
      }
      return list.length !== 0 ? list[0] : null
    },

    cleanPropertyValue() {
      const ruleIndex = this.ruleIndex
      const layerIndex = this.layerIndex

      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex,
        layerIndex,

        name: 'propertyValue',
        value: ''
      })

      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex,
        layerIndex,

        name: 'rangeDate',
        value: ''
      })

      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex,
        layerIndex,

        name: 'rangeNumber1',
        value: ''
      })

      this.$store.dispatch('userTag/userTagRuleChange', {
        ruleIndex,
        layerIndex,

        name: 'rangeNumber2',
        value: ''
      })
    },

    checkDataRange(rule, value, callback) {
      /** 最小值 */
      const minTime = getLastYearTime(value[1])
      const liteTime = new Date(value[0])

      if (liteTime < minTime) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },

    checkMinMaxNumber(rule, value, callback) {
      const max = parseFloat(value)
      const min = parseFloat(this.rule.rangeNumber1)

      if (max < min) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    rankcheckMinMaxNumber(rule, value, callback) {
      const max = parseFloat(value)
      const min = parseFloat(this.rule.rankrangeNumber1)

      if (max < min) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    },
    cascaderChange(value) {
      console.log(value)
      this.$store
        .dispatch('userTag/userTagRuleChange', {
          ruleIndex: this.ruleIndex,
          layerIndex: this.layerIndex,

          name: 'metaEventPropertyId',
          value: value
        })
        .then(() => {
          const list = this.getOperateList(value)

          if (list) {
            this.updateOperateList(list)
          }

          /** 清空操作值 */
          this.$store.dispatch('userTag/userTagRuleChange', {
            ruleIndex: this.ruleIndex,
            layerIndex: this.layerIndex,

            name: 'operateDict',
            value: ''
          })
          if (value[0] == 0) {
            this.$store.dispatch('userTag/userTagRuleChange', {
              ruleIndex: this.ruleIndex,
              layerIndex: this.layerIndex,

              name: 'operateDict',
              value: 'more_than_or_equal'
            })
          }
          this.cleanPropertyValue()
        })
    }
  }
}
</script>

<style lang="scss">
.rule-item-cell {
  .el-range-editor {
    width: 280px;
  }

  .el-form-item {
    display: inline-block;

    /** 为了垂直居中显示 */
    padding-top: 20px;
  }
}
.supernatant {
  position: absolute;
  pointer-events: none;
  width: 200px;
  height: 30px;
  left: 30px;
  top: 1px;
  z-index: 999999;
  background: #ffffff;
}
</style>
