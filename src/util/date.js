/**
 * 一天的时间
 * @types {number}
 **/
export const ONE_DAY_TIME = 86400000;

export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss'
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}

/**
 * 获得一天的起始时间
 * @params { Date } date
 * @returns { string }
 */
export function getDayStart(date) {
  return dateFormat(date).substring(0, 11) + '00:00:00';

}

/**
 * 获得一天的结束时间
 * @params { Date } date
 * @returns { string }
 */
export function getDayEnd(date) {
  return dateFormat(date).substring(0, 11) + '23:59:59';
}

/**
 * 获得上月现在的时间
 * 只精确到日
 * @params { string } dateStr - 输入的日期字符串
 * @returns { date } 去年的今天
 */
export function getLastMonthTime(dateStr) {

  const ndate = typeof (dateStr) === 'string' ? new Date(dateStr) : dateStr;

  const nyear = ndate.getFullYear();
  const nmonth = ndate.getMonth();
  const nday = ndate.getDate();

  let lyear;
  let lmonth;
  let lday = nday;

  /** 如果是一月份 */
  if (nmonth === 0) {
    lyear = nyear - 1;
    lmonth = 11;
  } else {
    lyear = nyear;
    lmonth = nmonth - 1;
  }

  const ldate = new Date();

  ldate.setFullYear(lyear);
  ldate.setMonth(lmonth);
  ldate.setDate(lday);

  /** 如果月份不对，表明当前设置的日期数过大，要调小 */
  while (ldate.getMonth() !== lmonth) {
    lday = lday - 1;

    ldate.setMonth(lmonth);
    ldate.setDate(lday);
  }

  return ldate;

}

/**
 * 获得去年现在的时间
 * 只精确到日
 * @params { string } dateStr - 输入的日期字符串
 * @returns { date } 去年的今天
 */
export function getLastYearTime(dateStr) {

  const ndate = typeof (dateStr) === 'string' ? new Date(dateStr) : dateStr;

  const nyear = ndate.getFullYear();
  const nmonth = ndate.getMonth();
  const nday = ndate.getDate();

  const lyear = nyear - 1;
  const lmonth = nmonth;
  let lday = nday;

  const ldate = new Date();

  ldate.setFullYear(lyear);
  ldate.setMonth(lmonth);
  ldate.setDate(lday);

  /** 如果月份不对，表明当前设置的日期数过大，要调小 */
  while (ldate.getMonth() !== lmonth) {
    lday = lday - 1;

    ldate.setMonth(lmonth);
    ldate.setDate(lday);
  }

  return ldate;

}


/**
 * 获得7天
 * @params { Date }
 * @returns { Date }
 **/
export function nearly7DayTime(nowDate = new Date()) {

  if (typeof nowDate === 'string') {
    nowDate = new Date(nowDate);
  }

  const nearly7 = new Date(nowDate.valueOf() - (7 * ONE_DAY_TIME));

  return nearly7;

}

/**
 * 获得近 7 天的范围
 * @param { Date } endTime
 * @returns { string[] }
 */
export function nearly7DayRange(endTime = new Date()) {

  if (typeof endTime === 'string') {
    endTime = new Date(endTime);
  }

  return [dateFormat(nearly7DayTime(endTime)), dateFormat(endTime)];

}
