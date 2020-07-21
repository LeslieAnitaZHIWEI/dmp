import { validateVersion } from '@/util/validate';

export const tableOption = {

  title: '元事件管理',
  align: 'center',
  column: [
    {
      label: '事件名称',
      prop: 'code',
      rules: [
        {
          required: true,
          message: '请输入事件名称',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '显示名',
      prop: 'name',
      rules: [
        {
          required: true,
          message: '请输入显示名',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '事件类型',
      prop: 'typeName',
      type: 'select',
      dicData: [
        {
          label: '拉新',
          value: 0
        }
      ]
    },
    {
      label: '版本',
      prop: 'version',
      slot: true,
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
    },
    {
      label: '发布时间',
      prop: 'updateTime',
      type: 'date',
      format: 'yyyy-MM-dd hh:mm:ss',
      valueFormat: 'yyyy-MM-dd hh:mm:ss'
    }
  ]

};
