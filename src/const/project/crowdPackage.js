export const tableOption = {
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  editBtn: false,
  delBtn: false,
  menu: false,
  stripe: true,
  column: [
    {
      label: '包名称',
      prop: 'title',
      align: 'left'
    },
    {
      label: '包类型',
      prop: 'name'
    },
    {
      label: '创建时间',
      prop: 'date',
      width: '180px'
    },
    {
      label: '人数',
      prop: 'natural'
    },
    {
      label: '取号',
      prop: 'number',
      slot: true,
      width: '80px'
    },
    {
      label: '是否已推送集团',
      prop: 'minboolean',
      width: '100px'
    },
    {
      label: '备注',
      prop: 'firstName'
    }
  ]
}
