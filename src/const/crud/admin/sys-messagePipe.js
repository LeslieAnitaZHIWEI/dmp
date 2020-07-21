export const tableOption = {
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  column: [
    {
      label: '短信通道名称',
      prop: 'name'
    },
    {
      label: '短信通道编码',
      prop: 'code'
    },
    {
      label: '剩余条数',
      prop: 'surplusNumber'
    },
    {
      label: '单次发送最大条数',
      prop: 'maxEachtimeNumber'
    },
    {
      label: '是否默认',
      prop: 'isDefault',
      slot: true
    },
    {
      label: '是否禁用',
      prop: 'isDisable',
      slot: true
    }
  ]
}
