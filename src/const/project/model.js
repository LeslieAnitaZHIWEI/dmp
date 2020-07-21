import { validateVersion } from '@/util/validate';
import { validateCode,validateHan } from '@/util/validate'


export const tableOption = {

  title: '模型管理',
  align: 'center',
  refreshBtn: false,
  columnBtn: false,
  delBtn: false,
  editBtn: false,
  dialogWidth: '450px',
  dialogHeight: '450px',
  column: [
    {
      label: '模型名称',
      span: 24,
      prop: 'name',
      rules: [
        {
          required: true,
          message: '请输入模型名称',
          trigger: 'blur'
        },

        {
          validator:validateHan,
          required: true,

          trigger: 'change'

        }
      ]
    },
    {
      label: '模型编号',
      span: 24,
      prop: 'code',
      rules: [
        {
          required: true,
          message: '请输入模型编号',
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
      label: '类型',
      span: 24,
      prop: 'modelDictId',
      type: 'select',
      slot: true,

      dicData: [],
      rules: [
        {
          required: true,
          message: '请选择模型类型',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '更新日期',
      span: 24,
      prop: 'updateTime',
      type: 'date',
      format: 'yyyy-MM-dd hh:mm:ss',
      valueFormat: 'yyyy-MM-dd hh:mm:ss',
      display: false
    },

    {
      label: '版本号',
      span: 24,
      prop: 'version',
      slot: true,
      display: false,
      viewDisplay: true,
      rules: [
        {
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        },
        {
          validator: function(rule, value, callback) {
            if (validateVersion(value)) {
              callback();
            } else {
              callback(new Error(rule.message));
            }
          },
          message: '请输入正确格式的版本号',
          trigger: 'blur'
        }
      ]
    }
  ]

};
