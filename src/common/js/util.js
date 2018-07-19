/**
 * 解析url参数
 * @example ?id=123456&a=b
 * @return Object {id:123456, a:b}
 */
export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g; //以上面example为例: [?&]匹配?&  [^?&]+匹配id   =匹配=   [^?&]+匹配b  g全局
    let arr = url.match(reg); //test验证是否匹配正则，match验证并且返回匹配内容
    //['?id=123456','&a=b'] 匹配规则的内容就拿出来，一直循环
    if (arr) {
        arr.forEach((element) => {
            let tempArr = element.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]); //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        })
    }
    return obj;
}