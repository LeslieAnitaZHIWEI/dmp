export const tableOption = {
    align: 'center',
    refreshBtn: false,
    columnBtn: false,
    menuAlign: 'center',
    stripe: true,
    delBtn: false,
    editBtn: false,
    addBtn: false,
    menu: false,
   
    column: [
      {
        label: '签名',
        prop: 'rawSignName'
      },
      {
        label: '扩展签名',
        prop: 'signName'
      },
      {
        label: '最后编辑时间',
        prop: 'updateTime'
      },
      {
        label: '关键词内容',
        prop: 'keyWordStr'
      },
      {
        label: '关键词个数',
        prop: 'keyWordNumber',
        slot:true
        
      },
      {
        label: '操作',
        prop: 'id',
        slot:true
      }
    ]
  }
  