
  export const tableOption = {
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
        label: '号码包名称',
        prop: 'name',
        slot:true
      },
      {
        label: '类型',
        prop: 'typeStr',
      },
      {
        label: '号码数量',
        prop: 'numberTotal',
      },
      {
        label: '创建人',
        prop: 'creator',
      },
      {
        label: '最后一次编辑时间',
        prop: 'updateTime',
      },
      {
        label: '操作',
        prop: 'id',
        slot:true
      }
    ]
  }
  