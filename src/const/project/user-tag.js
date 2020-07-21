export const tableOption = {
  title: '',
  align: 'center',

  addBtn: false,
  editBtn: false,
  delBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: '',
      prop: 'tagName',
      type: 'String'
    }
  ]
}

export const tagRuleHasDone = [
  {
    value: 0,
    name: '没做过'
  },
  {
    value: 1,
    name: '做过'
  }
]

export const tagRuleHasDoneMap = {
  /** 没做过 */
  notdo: tagRuleHasDone[0].value,
  /** 做过 */
  done: tagRuleHasDone[1].value
}

export const relationDict = [
  {
    value: 0,
    name: '且'
  },
  {
    value: 1,
    name: '或'
  }
]

export const relationDictMap = {
  /** 且 */
  and: relationDict[0].value,
  /** 或 */
  or: relationDict[1].value
}

export const operateTypeDict = [
  {
    label: '文本',
    name: 'TEXT',
    value: '1'
  },
  {
    label: '数字',
    name: 'NUMBER',
    value: '2'
  },
  {
    label: '逻辑',
    name: 'BOOLEAN',
    value: '3'
  },
  {
    label: '时间',
    name: 'DATE',
    value: '4'
  }
]

export const operateTypeDictMap = {
  TEXT: operateTypeDict[0].value,
  NUMBER: operateTypeDict[1].value,
  BOOLEAN: operateTypeDict[2].value,
  DATE: operateTypeDict[3].value
}

/**
 * 事件规则
 * 在 http://pamir-gateway:8080/#/admin/dict/index 可以查看详情
 **/
export const rulesMap = {
  EQUAL: { value: 'equal', name: '等于' },
  NOT_EQUAL: { value: 'not_equal', name: '不等于' },
  CONTAIN: { value: 'contain', name: '包含' },
  NOT_CONTAIN: { value: 'not_contain', name: '不包含' },
  EXISTED: { value: 'have_value', name: '有值' },
  NOT_EXISTED: { value: 'no_value', name: '没值' },
  REGULAR_MATCH: { value: 'reqex', name: '正则匹配' },
  REGULAR_NOT_MATCH: { value: 'not_regex', name: '正则不匹配' },
  RANGE: { value: 'interval', name: '区间' },
  GREATER_THAN: { value: 'more_than', name: '大于' },
  LESSER_THAN: { value: 'less_than', name: '小于' },
  GREATER_THAN_OR_EQUAL: { value: 'more_than_or_equal', name: '大于等于' },
  LESSER_THAN_OR_EQUAL: { value: 'less_than_or_equal', name: '小于等于' },
  IS_FALSE: { value: 'false', name: '否' },
  IS_TRUE: { value: 'true', name: '是' },
  RANKING: { value: 'ranking', name: '排名' }
}

export const userTagLayerRule = {
  NUMBER: [
    { ...rulesMap.EQUAL },
    { ...rulesMap.NOT_EQUAL },
    { ...rulesMap.GREATER_THAN },
    { ...rulesMap.LESSER_THAN },
    { ...rulesMap.GREATER_THAN_OR_EQUAL },
    { ...rulesMap.LESSER_THAN_OR_EQUAL },
    { ...rulesMap.RANGE },
    { ...rulesMap.RANKING }
  ],

  TEXT: [
    { ...rulesMap.EQUAL },
    { ...rulesMap.NOT_EQUAL },
    { ...rulesMap.CONTAIN },
    { ...rulesMap.NOT_CONTAIN },
    { ...rulesMap.EXISTED },
    { ...rulesMap.NOT_EXISTED },
    { ...rulesMap.REGULAR_MATCH },
    { ...rulesMap.REGULAR_NOT_MATCH }
  ],
  BOOLEAN: [{ ...rulesMap.IS_FALSE }, { ...rulesMap.IS_TRUE }],
  DATE: [
    { ...rulesMap.EQUAL },
    { ...rulesMap.NOT_EQUAL },
    { ...rulesMap.GREATER_THAN },
    { ...rulesMap.LESSER_THAN },
    { ...rulesMap.GREATER_THAN_OR_EQUAL },
    { ...rulesMap.LESSER_THAN_OR_EQUAL },
    { ...rulesMap.RANGE }
  ]
}

/**
 * 后台的类型设置
 */
export const eventPropOperateMap = {
  string: 'TEXT',
  bigint: 'NUMBER',
  timestamp: 'DATE'
}
