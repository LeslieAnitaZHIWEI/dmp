// import { validateVersion } from '@/util/validate';
import { pageOptionDefault } from '../website';

export const tableOption = {

  title: '关键字查询',
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  menu: false,

  column: [
    {
      label: '词',
      prop: 'keyWord',
      search: true,
      rules: [
        {
          required: true,
          message: '请输入您要查询的关键词',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '词性',
      prop: 'wordType',
      type: 'select',
      search: true,
      dicData: [
        {
          label: '名词',
          value: 'NOUN'
        },
        {
          label: '动词',
          value: 'VERB'
        }
      ],
      rules: [
        {
          required: true,
          message: '请输入显示名',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '频次',
      prop: 'frequency',
      type: 'number'
    }
  ]

};


export const pageOption = {
  ...pageOptionDefault
};
