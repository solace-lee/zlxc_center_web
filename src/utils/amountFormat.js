//金额格式化 以元为单位
function amountFormat(amount) {
    if (amount) {
        let str = (amount).toFixed(2) + '';
        let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
        let dot = str.substring(str.length, str.indexOf(".")) //取到小数部分搜索
        let ret = intSum + dot;
        return "￥" + ret;
    } else {
        return "￥0.00"
    }
}

export {
    amountFormat
}