export const tableOption = {
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  editBtn: false,
  delBtn: false,
  stripe: true,
  column: [
    {
      label: '短信发送内容',
      prop: 'smsContent'
    },
    {
      label: '号码包名称',
      prop: 'numberPackageName'
    },
    
    {
      label: '接收人(人数)',
      prop: 'receiveNumber',
      slot: true
    },
    {
      label: '实际发送时间',
      prop: 'executeTime'
    },
    {
      label: '定时时间',
      prop: 'planExecuteTime'
    },
    {
      label: '创建人',
      prop: 'creatorName'
    }
  ]
}
export const tableDetailOption = {
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menu: false,
  stripe: true,
  column: [
    {
      label: 'gid',
      prop: 'gid'
    },
    {
      label: '手机号码',
      prop: 'mobilePhone',
      slot: true
    },
    {
      label: '实际发送时间',
      prop: 'sendTime',
      slot: true
    },
    {
      label: '状态',
      prop: 'sendState',
      slot: true
    }
  ]
}
