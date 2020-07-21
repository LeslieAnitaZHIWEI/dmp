export const tableOption = {
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  menuAlign: 'center',
  stripe: true,
  delBtn: false,
  editBtn: false,
  addBtn: false,
  column: [
    {
      label: '签名',
      // search: true,
      prop: 'rawSignName',
      slot: true,
      // rules: [
      //   {
      //     required: true,
      //     message: '请输入签名',
      //     trigger: 'change'
      //   }
      // ]
    },
    // {
    //   label: '签名',

    //   prop: 'rawSignName',
    //   // display: false

    // },
    {
      label: '行业名称',
      prop: 'industryName',
      type: 'select',
      // search: true,
      // dicData: [],
      // rules: [
      //   {
      //     required: true,
      //     message: '请输入行业名称',
      //     trigger: 'change'
      //   }
      // ]
    },
    {
      label: '批次',
      prop: 'batchNumber',
      addDisplay: false,
      // search: true,

      slot: true,
      minRows: 1
    },
    {
      label: '扩展签名',
      prop: 'hasExtSignName',
      disabled: true,
      addDisplay: false,
      slot: true,

      width: 180
    },
    {
      label: '级别',
      prop: 'categoryId',
      disabled: true,
      addDisplay: false,
      slot: true,

      width: 180
    },
    {
      label: '创建时间',
      prop: 'createTime',
      disabled: true,
      addDisplay: false,

      type: 'date',
      width: 180
    }
  ]
}
