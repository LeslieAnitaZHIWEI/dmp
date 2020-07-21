export const dataTabOption1 = {
  span: 12,
  data: [
    {
      title: '总人数',
      count: 0
    },
    {
      title: '加好友人数',
      count: 0
    }
  ]
}
export const dataTabOption2 = {
  span: 12,
  data: [
    {
      title: '开户人数',
      count: 0
    },
    {
      title: '首次充值人数',
      count: 0
    }
  ]
}
export const dataTabOption3 = {
  span: 12,
  data: [
    {
      title: '首次消费人数',
      count: 0
    },
    {
      title: '累计消费金额',
      count: 0
    }
  ]
}
export const tableOption = {
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: '包名称',
      prop: 'packageName',
      type: 'String',
      slot: true
    },
    {
      label: '包类型',
      prop: 'packageType',
      type: 'String',
      slot: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'String'
    },
    {
      label: '人数',
      prop: 'number',
      type: 'String'
    },
    {
      label: '导入成功',
      prop: 'totalImportSuccess',
      type: 'String',
      slot: true
    },
    {
      label: '加好友',
      prop: 'totalAddFriend',
      type: 'String',
      slot: true
    },
    {
      label: '开户',
      prop: 'totalAccountOpen',
      type: 'String',
      slot: true
    },
    {
      label: '首次充值',
      prop: 'totalFirstRecharge',
      type: 'String',
      slot: true
    },
    {
      label: '首次消费',
      prop: 'totalFirstConsume',
      type: 'String',
      slot: true
    },
    {
      label: '累计消费(元)',
      prop: 'totalConsumeAmount',
      type: 'String'
    },
    {
      label: '推送时间',
      prop: 'pushTime',
      type: 'String'
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'String',
      slot: true,
      width: '140px'
    }
  ]
}
export const tableDetailOption = {
  align: 'center',

  editBtn: false,
  delBtn: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: 'gid',
      prop: 'gid',
      type: 'String'
    },
    {
      label: '导入成功',
      prop: 'importSuccessTime',
      type: 'String'
    },
    {
      label: '加好友',
      prop: 'addFriendTime',
      type: 'String'
    },
    {
      label: '开户',
      prop: 'accountOpenTime',
      type: 'String'
    },
    {
      label: '首次充值',
      prop: 'firstRechargeTime',
      type: 'String'
    },
    {
      label: '首次消费',
      prop: 'firstConsumeTime',
      type: 'String'
    },
    {
      label: '用户评级',
      prop: 'userGrade',
      type: 'String',
      slot: true
    },
    {
      label: '累计消费(元)',
      prop: 'totalConsumeAmount',
      type: 'String',
      slot: true
    }
  ]
}
export const consumeDetailOption = {
  align: 'center',

  editBtn: false,
  delBtn: false,
  addBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,

  column: [
    {
      label: '消费时间',
      prop: 'consumeTime',
      type: 'String'
    },

    {
      label: '月消费总金额',
      prop: 'monthlyConsumeAmountTotal',
      type: 'Number'
    },
    {
      label: '月消费笔数',
      prop: 'monthlyConsumeTotal',
      type: 'String'
    },
    {
      label: '最大一笔金额',
      prop: 'consumeAmountMax',
      type: 'String'
    },

    {
      label: '用户评级',
      prop: 'userGrade',
      type: 'String',
      slot: true
    },
    {
      label: '更新时间',
      prop: 'updateTime',
      type: 'String'
    }
  ]
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
