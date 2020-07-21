import { validateCode,validateHan } from '@/util/validate'
export const tableOption = {
  menuAlign: 'center',
  refreshBtn: false,
  columnBtn: false,
  addBtn:false,
  delBtn:false,
  editBtn:false,
  column: [
    {
      label: '项目名称',
      prop: 'name',
      rules: [
        {
          required: true,
          message: '请输入项目名称',
          trigger: 'change'
        },
        {
          validator:validateHan,
          required: true,
          trigger: 'change'
          
        }
      ],
      search: true
    },
    {
      label: '项目编号',
      prop: 'code',
      rules: [
        {
          required: true,
          message: '请输入项目编号',
          trigger: 'blur'
        },
        {
          validator:validateCode,
          required: true,
          trigger: 'change'
          
        }
      ]
    },
    {
        label: '行业',
        prop: 'id',
        rules: [
          {
            required: true,
            message: '请输入行业',
            trigger: 'blur'
          }
        ],
        slot:true
      },
      {
        label: '创建人',
        prop: 'creatorName',
        rules: [
          {
            required: true,
            message: '请输入创建人',
            trigger: 'blur'
          }
        ]
      }
  ]
}

