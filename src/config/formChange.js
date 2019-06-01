// 发布
// 平台价
const priceCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("价格不能为空"));
    } else if (value <= 0) {
        return callback(new Error('价格必须大于0'));
    } else {
        callback();
    }
}
// 折扣价
const discountCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("折扣价不能为空"));
    } else if (value <= 0) {
        return callback(new Error('折扣价必须大于0'));
    } else {
        callback();
    }
}
// 基金价
const discountJJCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("基金价不能为空"));
    } else if (value <= 0) {
        return callback(new Error('基金价必须大于0'));
    } else {
        callback();
    }
}
// 积分
const discountJFCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("积分不能为空"));
    } else if (value <= 0) {
        return callback(new Error('积分必须大于0'));
    } else {
        callback();
    }
}
// 会员价
const discountHYCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("会员价不能为空"));
    } else if (value <= 0) {
        return callback(new Error('会员价必须大于0'));
    } else {
        callback();
    }
}

// 库存
const quantityCheck = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("库存不能为空"));
    } else if (value <= 0) {
        return callback(new Error('库存必须大于0'));
    } else {
        callback();
    }
}

const indexNum = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("排序不能为空"));
    } else if (!/^([1-9]|\+?[1-9][0-9]*)$/.test(value)) {
        return callback(new Error('排序必须是正整数'));
    } else {
        callback();
    }
}
export {
    priceCheck,
    discountCheck,
    discountJJCheck,
    discountJFCheck,
    discountHYCheck,
    quantityCheck,
    indexNum

}
