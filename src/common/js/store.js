/**
 * save本地存储
 * @param {String} id  商家id
 * @param {String} key localStorage
 * @param {String} value localStorage
 */
export function saveToLocal(id,key,value) {
    let seller = window.localStorage.__seller__;  //__表示私有变量
    if(!seller) {
        seller = {};
        seller[id] = {};
    }else{
        seller = JSON.parse(seller);
        if(!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);  // "{"123456":{"favorite":false}}"
};

/**
 * read本地存储
 * @param {String} id  localStorage
 * @param {String} key localStorage
 * @param {String} key 默认值
 */
export function loadFromLocal(id,key,def) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller) {
        return def;
    }
    let ret = seller[key];
    return ret || def;
}
