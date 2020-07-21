export const tableOption = {
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  delBtn: false,
  editBtn: false,
  addBtn: false,
  searchBtn: false,
  menu: false,

  column: [
    {
      label: '投放标题',

      prop: 'title'
    },
    {
      label: '投放负责人',

      prop: 'name'
    },
    {
      label: '投放日期',

      prop: 'putTime',
      type: 'date',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd hh:mm:ss'
    },
    {
      label: '包所属行业',

      prop: 'industryId',
      slot: true
    },
    {
      label: '包名称',
      prop: 'packageName',
      minWidth: 140
    },
    {
      label: '包ID记录',

      prop: 'packageId'
    },
    {
      label: '投放渠道',

      prop: 'putChannel'
    },
    {
      label: '投放数量',

      prop: 'putNumber'
    },
    {
      label: '备注说明',

      prop: 'remark',
      slot: true
    },
    {
      label: '操作',

      prop: 'id',
      slot: true
    }
  ]
}
