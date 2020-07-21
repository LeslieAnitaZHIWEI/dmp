import Layout from '@/page/index/'
export default [
  {
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [
      {
        path: 'index',
        name: '首页',
        component: () => import('@/page/wel')
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '个人信息',
        component: () => import('@/views/admin/user/info')
      }
    ]
    //}, {
    //   path: '/activti',
    //   component: Layout,
    //   redirect: '/activti/detail',
    //   children: [{
    //     path: 'detail/:id',
    //     component: () =>
    //             import(/* webpackChunkname: 'views' */ '@/views/activiti/detail')
    //   }]
  },

  {
    path: '/project',
    component: Layout,
    children: [

      {
        path: 'task/index',
        name: '任务管理',
        component: () => import('@/views/project/task/index')
      },

      {
        path: 'model/index',
        name: '模型管理',
        component: () => import('@/views/project/model/index')
      },

      {
        path: 'metadata/event',
        name: '元事件管理',
        component: () => import('@/views/project/metadata/event')
      },

      {
        path: 'metadata/keyword',
        name: '关键字查询',
        component: () => import('@/views/project/metadata/keyword')
      },

      {
        path: 'useranalyst/event',
        name: '用户事件分析',
        component: () => import('@/views/project/useranalyst/event')
      },
      {
        path: 'useranalyst/tag',
        name: '用户标签',
        component: () => import('@/views/project/useranalyst/tag')
      },
      {
        path: 'useranalyst/segment',
        name: '用户分群',
        component: () => import('@/views/project/useranalyst/segment')
      },
      {
        path: 'getNumber/dataStatistic',
        name: '源数据统计',
        component: () => import('@/views/project/getNumber/dataStatistic')
      },
      {
        path: 'getNumber/userIncrease',
        name: '新用户增长',
        component: () => import('@/views/project/getNumber/userIncrease')
      },
      {
        path: 'library/index',
        name: '库管理',
        component: () => import('@/views/project/library/index')
      },
      {
        path: 'getMark/audiencePackage',
        name: '人群包管理',
        component: () => import('@/views/project/getMark/audiencePackage')
      },
      {
        path: 'getMark/getMarkRecord',
        name: '取号记录',
        component: () => import('@/views/project/getMark/getMarkRecord')
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: 'sendMessage/sendMessage',
        name: '短信发送',
        component: () => import('@/views/system/sendMessage/sendMessage')
      },
      {
        path: 'sendMessage/messageRecord',
        name: '短信发送记录',
        component: () => import('@/views/system/sendMessage/messageRecord')
      },
      {
        path: 'messagePipe/index',
        name: '短信通道管理',
        component: () => import('@/views/system/messagePipe/index')
      }
    ]
  }
]
