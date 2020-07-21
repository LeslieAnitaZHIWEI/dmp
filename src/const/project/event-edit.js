// import { validateVersion } from '@/util/validate';
import { operateTypeDict } from './user-tag';
import { FormRuleMap } from '@/const/formValid';

export const formOption = {
  emptyBtn: false,
  submitBtn: false,
  labelWidth: 100,
  column: [
    {
      label: '元事件名称',
      prop: 'code',
      span: 12,
      tip: '同一项目下不允许重复',
      rules: [
        { required: true, message: '请输入元事件名称', trigger: 'blur' },
        { ...FormRuleMap.enNumUnder },
        { ...FormRuleMap.minLen2 },
        { ...FormRuleMap.maxLen20 }
      ]
    },
    {
      label: '显示名',
      prop: 'name',
      rules: [
        { required: true, message: '请输入元事件名称', trigger: 'blur' },
        { ...FormRuleMap.minLen2 },
        { ...FormRuleMap.maxLen20 }
      ]
    },
    /** 元事件类型 在 .vue 文件中设置 */
    {
      // label: '元事件类型',
      // prop: 'typeName',
      // type: 'select',
      // dicData: []
    },
    {
      label: '版本',
      prop: 'version',
      readonly: true,
      prepend: 'V',
      valueDefault: '1.0'
    }
  ]
}

export const tableOption = {
  align: 'center',
  refreshBtn: false,
  searchBtn: false,
  columnBtn: false,
  dialogWidth: '445px',
  dialogHeight: '500px',
  column: [
    {
      label: '属性名',
      span: 24,
      prop: 'code',
      cell: true,
      tip: '同一项目下不允许重复',
      rules: [
        { required: true, message: '请输入属性名', trigger: 'blur' },
        { ...FormRuleMap.enUnder },
        { ...FormRuleMap.minLen2 },
        { ...FormRuleMap.maxLen10 }
      ]
    },
    {
      label: '显示名',
      span: 24,
      prop: 'name',
      cell: true,
      rules: [
        { required: true, message: '请输入显示名', trigger: 'blur' },
        { ...FormRuleMap.minLen2 },
        { ...FormRuleMap.maxLen10 }
      ]
    },
    {
      label: '数据类型',
      span: 24,
      prop: 'propertyType',
      type: 'select',
      cell: true,
      dicData: operateTypeDict,
      rules: [
        { required: true, message: '请选择数据类型', trigger: 'blur' }
      ]
    }
  ]

};
