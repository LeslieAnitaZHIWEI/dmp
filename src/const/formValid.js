import { validateEnNum, validateEnNumUnder, validateEnUnder } from '@/util/validate';
import { ONE_DAY_TIME, dateFormat, getDayStart, getLastYearTime, getLastMonthTime } from '@/util/date';

/**
 * 直接用于表单的验证英文与数字
 * @param { object } rule 表单项的验证规则
 * @param { string } rule.message 验证出错时，显示的提示信息
 * @param { string } value 表单控件的值
 * @param { function } callback 回调函数
 * @returns { void }
 */
function validateFormEnNum(rule, value, callback) {

  if (validateEnNum(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }

}

/**
 * 直接用于表单的验证英文与下划线
 * @param { object } rule 表单项的验证规则
 * @param { string } rule.message 验证出错时，显示的提示信息
 * @param { string } value 表单控件的值
 * @param { function } callback 回调函数
 * @returns { void }
 */
function validateFormEnUnder(rule, value, callback) {

  if (validateEnUnder(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }

}

/**
 * 直接用于表单的验证英文与数字、下划线
 * @param { object } rule 表单项的验证规则
 * @param { string } rule.message 验证出错时，显示的提示信息
 * @param { string } value 表单控件的值
 * @param { function } callback 回调函数
 * @returns { void }
 */
function validateFormEnNumUnder(rule, value, callback) {

  if (validateEnNumUnder(value)) {
    callback();
  } else {
    callback(new Error(rule.message));
  }

}


export const FormRuleMap = {
  /** 英文和数字 */
  enNum: {
    validator: validateFormEnNum,
    message: '只能为字母与数字的组合',
    trigger: 'blur'
  },
  /** 英文与下划线 */
  enUnder: {
    validator: validateFormEnUnder,
    message: '只能为字母和下划线的组合',
    trigger: 'blur'
  },
  /** 英文与数字、下划线 */
  enNumUnder: {
    validator: validateFormEnNumUnder,
    message: '只能为字母、数字和下划线的组合',
    trigger: 'blur'
  },

  /** 最少 2 个字符 */
  minLen2: {
    min: 2,
    message: '最少 2 个字符',
    trigger: 'blur'
  },


  /** 最多 10 个字符 */
  maxLen10: {
    max: 10,
    message: '最多 10 个字符',
    trigger: 'blur'
  },

  /** 最多 20 个字符 */
  maxLen20: {
    max: 20,
    message: '最多 20 个字符',
    trigger: 'blur'
  },

  /** 最多 40 个字符 */
  maxLen40: {
    max: 40,
    message: '最多 40 个字符',
    trigger: 'blur'
  },

  /** 最多 50 个字符 */
  maxLen50: {
    max: 50,
    message: '最多 50 个字符',
    trigger: 'blur'
  },

  /**
   * 最多时间范围是 30 天
   * @param { Object } rule - 规则
   * @param { string } rule.message - 出错时的提示
   * @param { Array } value - 时间范围
   * @param { string | Object } value[0] - 开始时间
   * @param { string | Object } value[1] - 截止时间
   * @param { function } callback - 回调函数
   **/
  max30DayRange: {
    validator(rule, value, callback) {

      /** 最小值 */
      const endTime = typeof (value[1]) === 'string' ? dateFormat(value[1]) : value[1];

      const minTime = (new Date(getDayStart(endTime))).valueOf() - (30 * ONE_DAY_TIME);

      const liteTime = (new Date(getDayStart(new Date(value[0])))).valueOf();

      if (liteTime < minTime) {
        callback(new Error(rule.message));
      } else {
        callback();
      }

    },
    message: '时间跨度不能超过30天',
    trigger: 'change'
  },
  max29DayRange: {
    validator(rule, value, callback) {

      /** 最小值 */
      const endTime = typeof (value[1]) === 'string' ? dateFormat(value[1]) : value[1];

      const minTime = (new Date(getDayStart(endTime))).valueOf() - (29 * ONE_DAY_TIME);

      const liteTime = (new Date(getDayStart(new Date(value[0])))).valueOf();

      if (liteTime < minTime) {
        callback(new Error(rule.message));
      } else {
        callback();
      }

    },
    message: '时间跨度不能超过30天',
    trigger: 'change'
  },
  /**
   * 最多时间范围是1月
   * @param { Object } rule - 规则
   * @param { string } rule.message - 出错时的提示
   * @param { Array } value - 时间范围
   * @param { string | Object } value[0] - 开始时间
   * @param { string | Object } value[1] - 截止时间
   * @param { function } callback - 回调函数
   **/
  maxOneMonthRange: {
    validator(rule, value, callback) {

      /** 最小值 */
      let minTime = getLastMonthTime(typeof (value[1]) === 'string' ? value[1] : dateFormat(value[1]));

      /** 获得时间为 00:00:00 的值 */
      minTime = new Date(getDayStart(minTime));

      const liteTime = new Date(getDayStart(new Date(value[0])));

      if (liteTime < minTime) {
        callback(new Error(rule.message));
      } else {
        callback();
      }

    },
    message: '时间跨度不能超过一个月',
    trigger: 'change'
  },

  /**
   * 最多时间范围是1年
   * @param { Object } rule - 规则
   * @param { string } rule.message - 出错时的提示
   * @param { Array } value - 时间范围
   * @param { string | Object } value[0] - 开始时间
   * @param { string | Object } value[1] - 截止时间
   * @param { function } callback - 回调函数
   **/
  maxOneYearRange: {
    validator(rule, value, callback) {

      /** 最小值 */
      let minTime = getLastYearTime(typeof (value[1]) === 'string' ? value[1] : dateFormat(value[1]));
      minTime = new Date(getDayStart(minTime));
      const liteTime = new Date(getDayStart(new Date(value[0])));

      if (liteTime < minTime) {
        callback(new Error(rule.message));
      } else {
        callback();
      }

    },
    message: '时间跨度不能超过一年',
    trigger: 'change'
  }

};


