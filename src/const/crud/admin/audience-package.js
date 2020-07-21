import { pageOptionDefault } from '@/const/website'

export const tableOption = {
  title: '',
  selection: true,
  menuAlign: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,
  stripe: true,
  align: 'center',
  column: [
    {
      label: 'id',
      prop: 'id'
    },
    {
      label: '包名称',
      prop: 'name',
      slot: true
    },

    {
      label: '创建时间',
      prop: 'createTime'
    },
    {
      label: '人数',
      prop: 'number',
      width: '80px',
      slot: true
    },
    {
      label: '取号类型',
      prop: 'getNumberType',
      slot: true,
      width: '120px'
    },
    {
      label: '推送时间',
      prop: 'pushTime',
      width: '160px',
    },
    {
      label: '备注',
      prop: 'remark',
      slot: true,
      width: '200px'
    }
  ]
}

export const viewTableOption = {
  title: '',
  menuAlign: 'center',
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,
  stripe: true,
  column: [
    {
      label: 'userId',
      prop: 'userId',
      align: 'center'
    }
    // {
    //   label: '发生时间',
    //   prop: 'smsTime',
    //   align: 'center'
    // }
  ]
}

export const viewPageOption = {
  ...pageOptionDefault
}

export const packageType = {
  /** 普通包 */
  NORMAL: {
    name: '普通',
    value: '1',
    desc: '用户去重'
  },
  /** 升级包 */
  UPGRADE: {
    name: '升级',
    value: '2',
    desc: '用户不去重'
  }
}

export const packageTypeList = [
  {
    ...packageType.NORMAL
  }
  // {
  //   ...packageType.UPGRADE
  // }
]

export const packageTypeMap = {
  [packageType.NORMAL.value]: packageType.NORMAL.name,
  [packageType.UPGRADE.value]: packageType.UPGRADE.name
}

export const numberType = {
  MOBILE: {
    name: 'Number',
    value: '1'
  },
  IMEI: {
    name: 'IM-Android',
    value: '2'
  }
}

export const numberTypeList = [
  {
    ...numberType.MOBILE
  },
  {
    ...numberType.IMEI
  }
]

export const numberTypeMap = {
  [numberType.MOBILE.value]: numberType.MOBILE.name,
  [numberType.IMEI.value]: numberType.IMEI.name
}


export const statusMap={
  0:'未开始',
  1:'进行中',
  2:'已完成',
  3:'可运行',
  4:'用户暂停',
  5:'系统暂停',
  6:'已终止',
  7:'排队中',
  8:'AI到期',
  9:'线路欠费',
  10:'短信欠费'
}