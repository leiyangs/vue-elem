/**
 * exaple
 * var str = 'abcd';
 * 'yyyy-MM-dd hh:mm:ss'.replace('yyyy',str+'').substr(0)  => "abcd-MM-dd hh:mm:ss"
 * @param {new Date(time);} date
 * @param {yyyy-MM-dd hh:mm} fmt 
 */

export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        //RegExp.$1 正则表达式匹配的第一个内容   +''可将类型转化为字符串
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) { //`(${k})` => M+、d+、h+
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str)); //fmt=2016-07-dd hh:mm; RegExp.$1= MM; 
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
