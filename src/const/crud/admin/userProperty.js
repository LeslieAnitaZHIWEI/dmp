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
        label: '用户属性显示名称',
        prop: 'ROW_KEY'
      },
      {
        label: '数据类型',
        prop: 'NAME'
      },
      {
        label: '字典',
        prop: 'NAME'
      },
      
      {
        label: '操作',
        prop: 'id',
        slot:true
      }
    ]
  }
  