var validateCode = (rule, value, callback) => {
  var code = /^[a-zA-Z0-9_]{1,}$/
  if (value === '') {
    callback(new Error('请输入行业编码'))
  } else if (value.length > 50) {
    callback(new Error('长度请控制在 50 个字符以内'))
  } else if (!value.match(code)) {
    callback(new Error('只支持英文,数字,下划线'))
  } else {
    callback()
  }
}
export const tableOption = {
  menuAlign: 'center',
  refreshBtn: false,
  columnBtn: false,
  dialogWidth: '400px',
  dialogHeight: 155,
  formWidth: '90%',
  dialogTop: '10%',
  column: [
    {
      label: '行业编码',
      prop: 'code',
      slot: true,
      rules: [
        {
          validator: validateCode,
          required: true,

          trigger: 'change'
        }
      ],
      span: 24
    },
    {
      label: '行业名称',
      prop: 'name',
      rules: [
        {
          required: true,
          message: '请输入行业名称',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 50,
          message: '长度请控制在 50 个字符以内',
          trigger: 'change'
        }
      ],
      span: 24
    }
  ]
}
