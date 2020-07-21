const webTitle = '天机镜';

export default {
  title: webTitle,
  logo: '天机镜',
  key: 'mysteryLens', //配置主键,目前用于存储
  indexTitle: webTitle,
  whiteList: ['/login', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
  whiteTagList: ['/login', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  lockPage: '/lock',
  tokenTime: 6000,
  infoTitle: webTitle,
  statusWhiteList: [428],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  }
}

/** 用于给后台提交数据 */
export const pageQueryDefault = {
  current: 1, // 当前页数，后台使用 current 字段
  size: 20 // 每页显示多少条，后台使用 size 字段
};

/** 用于 avue 分页控制 */
export const pageOptionDefault = {
  total: 0, // 总页数
  currentPage: 1,
  pageSize: 20
};

/** 用户角色 ID 对应表 */
export const userRolesMap = {
  /** 管理员 */
  admin: 1
};
