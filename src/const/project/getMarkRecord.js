import { pageOptionDefault } from '@/const/website';

export const tableOption = {
  align: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  searchBtn: false,
  editBtn: false,
  delBtn: false,
  menu: false,
  stripe: true,
  column: [
    {
      label: '取号名称',
      prop: 'packageName'
    },
    {
      label: '取号方式',
      prop: 'getNumberType'
    },
    {
      label: '响应编号',
      prop: 'responseCode'
    },
    {
      label: '状态',
      prop: 'responseStatus',
      slot: true,
      width: 80
    },
    {
      label: '取号种类',
      prop: 'kind',
      type: 'select'
    },
    {
      label: '请求时间',
      prop: 'requestTime',
      type: 'date',
      width: 180
    },
    {
      label: '人数',
      prop: 'number'
    },
    {
      label: '空值数',
      prop: 'emptyNumber'
    }
  ]
}

export const pageOption = {
  ...pageOptionDefault
};


export const getNumberTypes = {
  'ALL': {
    'name': '全部',
    'value': ''
  },
  'MOBILE': {
    'name': 'oneid--mobile',
    'value': 'oneid--mobile'
  },
  'IMEI': {
    'name': 'oneid--imei',
    'value': 'oneid--imei'
  },
  'IMEI_MOBILE': {
    'name': 'imei-mobile',
    'value': 'imei-mobile'
  }
};

export const getNumberTypeList = [
  { ...getNumberTypes.ALL },
  { ...getNumberTypes.MOBILE },
  { ...getNumberTypes.IMEI },
  { ...getNumberTypes.IMEI_MOBILE }
];

export const getNumberTypeMap = {
  [ getNumberTypes.MOBILE.value ]: getNumberTypes.MOBILE.name,
  [ getNumberTypes.IMEI.value ]: getNumberTypes.IMEI.name,
  [ getNumberTypes.IMEI_MOBILE.value ]: getNumberTypes.IMEI_MOBILE.name
};
