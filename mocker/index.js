const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档
const noProxy = process.env.NO_PROXY === 'true';
const path = require('path');
const fs = require("fs");
const code = 200 // 返回的状态码

// 随机生成文章数据
const getData = req => {

  console.log(req) // 请求体，用于获取参数

  let List = [] // 用于存放文章数据的数组

  for (let i = 0; i < 10; i++) {
    let post = {
      title: Random.csentence(10, 25), // 随机生成长度为10-25的标题
      icon: Random.dataImage('250x250', '文章icon'), // 随机生成大小为250x250的图片链接
      author: Random.cname(), // 随机生成名字
      date: Random.date() + ' ' + Random.time(), // 随机生成年月日 + 时间
      number:Random.integer(),
      boolean:Random.boolean(),
      minboolean:Random.boolean(1, 9, true),
      natural:Random.natural(1,10),
      firstName:Random.first(),
      name:Random.cname()
    }

    List.push(post)
  }

  // 返回状态码和文章数据posts
  return {
    code,
    List
  }
}

// 定义请求链接，类型，还有返回数据
Mock.mock(`http://mockjs.com/api/gets`, 'get', getData);

const commonRes = {
  code: 0,
  data: {},
  message: ''
};

let proxy = {

  // 'GET /dmp-ml/metaeventtype/byprojectid/:projectId': (req, res) => {

  //   const { projectId } = req.params;

  //   return res.json({
  //     'code': 0,
  //     'msg': null,
  //     'data': [
  //       {
  //         'id': 11,
  //         'projectId': projectId,
  //         'name': '类型1',
  //         'createTime': '2019-07-27 09:14:52',
  //         'updateTime': null,
  //         'deleteFlag': 1
  //       },
  //       {
  //         'id': 32,
  //         'projectId': projectId,
  //         'name': '类型2',
  //         'createTime': '2019-07-27 09:14:52',
  //         'updateTime': null,
  //         'deleteFlag': 1
  //       },
  //       {
  //         'id': 36,
  //         'projectId': projectId,
  //         'name': '类型3',
  //         'createTime': '2019-07-27 09:14:52',
  //         'updateTime': null,
  //         'deleteFlag': 0
  //       },
  //       {
  //         'id': 37,
  //         'projectId': projectId,
  //         'name': '类型4',
  //         'createTime': '2019-07-27 09:14:52',
  //         'updateTime': null,
  //         'deleteFlag': 0
  //       }
  //     ]
  //   });
  // },


  // 'GET /dmp-ml/metaeventtype/page': (req, res) => {

  //   const { typeId } = req.query;

  //   return res.json({
  //     'code': 0,
  //     'msg': null,
  //     'data': {
  //       'records': [
  //         {
  //           'id': 1,
  //           'projectId': 7,
  //           'code': 'shijain1',
  //           'name': '事件1',
  //           'typeId': 11,
  //           'keywordRelation': 'and',
  //           'version': 1,
  //           'description': null,
  //           'createTime': '2019-07-27 10:02:43',
  //           'updateTime': '2019-07-29 06:03:12',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 20,
  //           'projectId': 7,
  //           'code': 'shijian_77',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:11:00',
  //           'updateTime': '2019-07-29 06:03:09',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 21,
  //           'projectId': 7,
  //           'code': 'shijian_29',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:13:53',
  //           'updateTime': '2019-07-29 06:03:08',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 22,
  //           'projectId': 7,
  //           'code': 'shijian_291',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:15:54',
  //           'updateTime': '2019-07-29 06:03:07',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 23,
  //           'projectId': 7,
  //           'code': 'shijian_292',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:16:43',
  //           'updateTime': '2019-07-29 06:03:06',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 25,
  //           'projectId': 7,
  //           'code': 'shijian_293',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:26:38',
  //           'updateTime': '2019-07-29 06:03:05',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 27,
  //           'projectId': 7,
  //           'code': 'shijian_294',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 01:28:09',
  //           'updateTime': '2019-07-29 06:00:40',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 30,
  //           'projectId': 7,
  //           'code': 'shijian_294',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.1,
  //           'description': null,
  //           'createTime': '2019-07-29 06:00:41',
  //           'updateTime': '2019-07-29 06:05:56',
  //           'deleteFlag': 1
  //         },
  //         {
  //           'id': 31,
  //           'projectId': 7,
  //           'code': 'shijian_294',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.2,
  //           'description': null,
  //           'createTime': '2019-07-29 06:06:13',
  //           'updateTime': '2019-07-30 04:12:10',
  //           'deleteFlag': 0
  //         },
  //         {
  //           'id': 32,
  //           'projectId': 7,
  //           'code': 'shijian_294',
  //           'name': '事件66',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.3,
  //           'description': null,
  //           'createTime': '2019-07-29 11:57:49',
  //           'updateTime': '2019-07-29 12:37:49',
  //           'deleteFlag': 0
  //         },
  //         {
  //           'id': 33,
  //           'projectId': 7,
  //           'code': 'shijian_295',
  //           'name': '事件666',
  //           'typeId': 11,
  //           'keywordRelation': 'or',
  //           'version': 1.3,
  //           'description': null,
  //           'createTime': '2019-07-29 11:57:49',
  //           'updateTime': '2019-07-29 12:37:49',
  //           'deleteFlag': 0
  //         }
  //       ],
  //       'total': 13,
  //       'size': 10,
  //       'current': 1,
  //       'searchCount': true,
  //       'pages': 2
  //     }
  //   });

  // },


  // 'GET /dmp-ml/metaevent/info/:id': (req, res) => {

  //   const { id } = req.params;

  //   return res.json({
  //     'metaEvent': {
  //       'code': 'shijian_77',
  //       'description': '描述',
  //       'keywordRelation': 'or',
  //       'name': '事件66',
  //       'projectId': 7,
  //       'typeId': 11,
  //       'version': 1.1
  //     },
  //     'metaEventKeywords': [
  //       {
  //         'operateDictId': 0,
  //         'wordGroup': ['发送','发出']
  //       },
  //   {
  //         'operateDictId': 0,
  //         'wordGroup': ['发送','发出']
  //       }
  //     ],
  //     'metaEventProperties': [
  //       {
  //         'code': 'shuxing_66',
  //         'name': '属性666',
  //         'propertyType': 'txt',
  //         'sortNumber': '2'
  //       }
  //     ]
  //   });

  // },

  // 'POST /dmp-ml/metaevent': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'PUT /dmp-ml/metaevent': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'DELETE /dmp-ml/metaevent/:id': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'POST /dmp-ml/metaeventtype': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'PUT /dmp-ml/metaeventtype': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'DELETE /dmp-ml/metaeventtype/:id': (req, res) => {
  //   return res.json(commonRes);
  // },

  // 'POST /dmp-lt/metaevent/analysis': (req, res) => {

  //   const count = 0;

  //   const data = [];

  //   for (let i = 0; i < count; i++) {
  //     data.push({
  //       date: Mock.Random.date('yyyy-MM-dd HH:mm:ss'),
  //       analyticsResult: Mock.Random.integer(0, 9999)
  //     });
  //   }

  //   return res.json(Object.assign({}, commonRes, { data: data }));
  // },

  // 'GET /metaevent/byprojectid/:id': (req, res) => {
  //   return res.json(Object.assign({}, commonRes, {
  //     'code': 0,
  //     'msg': null,
  //     'data': [
  //       {
  //         'id': 31,
  //         'projectId': 7,
  //         'code': 'shijian_294',
  //         'name': '事件66',
  //         'typeId': 11,
  //         'keywordRelation': 'or',
  //         'version': 1.2,
  //         'description': '描述',
  //         'createTime': '2019-07-29 06:06:13',
  //         'updateTime': '2019-07-30 04:12:10',
  //         'deleteFlag': 0
  //       },
  //       {
  //         'id': 32,
  //         'projectId': 7,
  //         'code': 'shijian_294',
  //         'name': '事件66',
  //         'typeId': 11,
  //         'keywordRelation': 'or',
  //         'version': 1.3,
  //         'description': '描述',
  //         'createTime': '2019-07-29 11:57:49',
  //         'updateTime': '2019-07-29 12:37:49',
  //         'deleteFlag': 0
  //       },
  //       {
  //         'id': 36,
  //         'projectId': 7,
  //         'code': 'shijian_777',
  //         'name': '事件66',
  //         'typeId': 11,
  //         'keywordRelation': 'or',
  //         'version': 1.1,
  //         'description': '描述',
  //         'createTime': '2019-07-30 10:07:25',
  //         'updateTime': null,
  //         'deleteFlag': 0
  //       },
  //       {
  //         'id': 37,
  //         'projectId': 7,
  //         'code': 'shijian_771',
  //         'name': '事件66',
  //         'typeId': 11,
  //         'keywordRelation': 'or',
  //         'version': 1.1,
  //         'description': '描述',
  //         'createTime': '2019-07-30 10:09:28',
  //         'updateTime': null,
  //         'deleteFlag': 0
  //       }
  //     ]
  //   }));
  // },

  'GET /personprofile/page': (req, res) => {

    const { projectId } = req.query;

    return res.json({
      'code': 0,
      'msg': null,
      'data': [
        {
          'id': 11,
          'projectId': projectId,
          'code': 'string',
          'name': 'string3',
          'tagLayerId': '1,2,3,4',
          'version': 1.2,
          'createTime': '2019-07-30 02:11:50',
          'updateTime': null,
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11',
            '2': 'nulllayer11',
            '3': '标签123layer11',
            '4': '标layer11'
          }
        },
        {
          'id': 9,
          'projectId': projectId,
          'code': 'string2',
          'name': 'string2',
          'tagLayerId': '1',
          'version': 1,
          'createTime': '2019-07-30 02:06:30',
          'updateTime': null,
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11'
          }
        },
        {
          'id': 7,
          'projectId': projectId,
          'code': '事务测试2',
          'name': '事务测试2',
          'tagLayerId': '1,2',
          'version': 1,
          'createTime': '2019-07-29 11:46:04',
          'updateTime': null,
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11',
            '2': 'nulllayer11'
          }
        },
        {
          'id': 6,
          'projectId': projectId,
          'code': '事务测试1',
          'name': '事务测试1',
          'tagLayerId': '1,2',
          'version': 1,
          'createTime': '2019-07-29 11:43:36',
          'updateTime': null,
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11',
            '2': 'nulllayer11'
          }
        },
        {
          'id': 5,
          'projectId': projectId,
          'code': 'string1',
          'name': 'string1',
          'tagLayerId': '1,2,3,4',
          'version': 1.3,
          'createTime': '2019-07-28 07:26:42',
          'updateTime': '2019-07-28 07:28:56',
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11',
            '2': 'nulllayer11',
            '3': '标签123layer11',
            '4': '标layer11'
          }
        },
        {
          'id': 1,
          'projectId': projectId,
          'code': 'test1',
          'name': 'test1',
          'tagLayerId': '1,2,3',
          'version': 1,
          'createTime': '2019-07-26 09:49:17',
          'updateTime': null,
          'deleteFlag': 0,
          'tagLayerIdAndTagLayerNameMap': {
            '1': '标签9layer11',
            '2': 'nulllayer11',
            '3': '标签123layer11'
          }
        }
      ]
    }
    );
  },

  // 'GET /dmp/personprofile/page': (req, res) => {
  //   return res.json({"code":0,"msg":null,"data":[{"id":68,"projectId":1,"code":"jeFQ","name":"金额12","tagLayerId":"17","version":1.4,"createTime":"2019-08-12 18:30:19","updateTime":"2019-08-13 10:31:55","deleteFlag":0,"tagLayerIdAndTagLayerNameMap":{"17":"金额金额大于660"}},{"id":3,"projectId":1,"code":"1","name":"112","tagLayerId":"16","version":0.0,"createTime":"2019-08-12 16:50:16","updateTime":"2019-08-13 06:46:16","deleteFlag":0,"tagLayerIdAndTagLayerNameMap":{"16":"1分层1"}},{"id":2,"projectId":1,"code":"testFQCode2","name":"testFQName2","tagLayerId":"14,15","version":1.0,"createTime":"2019-08-06 08:59:41","updateTime":null,"deleteFlag":0,"tagLayerIdAndTagLayerNameMap":{"14":"tixianTag31userTagLayer","15":"testTixianName2userTagLayer"}},{"id":1,"projectId":1,"code":"testFQCode","name":"testFQName","tagLayerId":"14","version":1.0,"createTime":"2019-08-06 04:02:44","updateTime":null,"deleteFlag":0,"tagLayerIdAndTagLayerNameMap":{"14":"tixianTag31userTagLayer"}}]});
  // },

  'POST /dmp/audiencepackage/userid': (req, res) => {
    return res.json({
      'code': 0,
      'msg': null,
      'data': [
        {
          'userId': '542628399',
          'smsTime': '2019-08-22 19:54:54.0'
        },
        {
          'userId': '223454311',
          'smsTime': '2019-08-22 21:16:16.0'
        },
        {
          'userId': '898166340',
          'smsTime': '2019-08-22 10:06:06.0'
        },
        {
          'userId': '893589814',
          'smsTime': '2019-08-22 14:39:39.0'
        },
        {
          'userId': '173115988',
          'smsTime': '2019-08-22 11:13:13.0'
        },
        {
          'userId': '57237815',
          'smsTime': '2019-08-22 12:30:30.0'
        },
        {
          'userId': '2211307',
          'smsTime': '2019-08-22 12:23:23.0'
        },
        {
          'userId': '115650974',
          'smsTime': '2019-08-22 08:45:45.0'
        },
        {
          'userId': '1024902702',
          'smsTime': '2019-08-22 15:20:20.0'
        },
        {
          'userId': '1181523638',
          'smsTime': '2019-08-22 09:08:08.0'
        }
      ]
    }
    );
  },

  'POST /dmp/audiencepackage/name': (req, res) => {
    return res.json({"code":0,"msg":null,"data":"英雄互娱--20190828-1"})
  },

  'POST /dmp/audiencepackage': (req, res) => {
    return res.json({
      'code': 0,
      'msg': null,
      data: null
    })
  },

  'GET /dmp-lt/getnumberrecord/page': (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, '/test.json'), 'utf-8');
    data = JSON.parse(data);
    return res.json(data);
  }


};

// proxy = {};

module.exports = proxy;
