export const userEventTableOption = {
  title: '用户事件分析',
  align: 'center',

  editBtn: false,
  delBtn: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: '日期',
      prop: 'date',
      type: 'String'
    },
    {
      label: '次数',
      prop: 'analyticsResult',
      type: 'Number'
    },
    {
      label: '操作',
      prop: 'operate',
      slot: true
    }
  ]
}
export const tableDetailOption = {
  align: 'center',

  editBtn: false,
  delBtn: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: '时间',
      prop: 'eventTime',
      type: 'String',
      width: '270px'
    },
    {
      label: '文本',
      prop: 'content',
      type: 'String'
    }
  ]
}
