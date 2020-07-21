
export const tableOption = {
  title: '用户分群',
  align: 'center',

  addBtn: false,
  columnBtn: false,
  refreshBtn: false,
  updateBtn: false,
  editBtn: false,
  delBtn: false,
  searchBtn: false,

  column: [
    {
      label: '用户群名称',
      prop: 'name',
      search: true,
      width: 280
    },
    {
      label: '标签内容',
      prop: 'tagList',
      slot: true,
      align: 'left'
    },
    {
      label: '版本',
      prop: 'version',
      slot: true,
      width: 100
    },
    {
      label: '导出人群包',
      prop: 'exportBtn',
      slot: true,
      width: 140
    }
  ]
};
