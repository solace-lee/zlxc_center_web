/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath;

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://192.168.1.182:9100';
    // baseUrl = 'https://new.zhulixc.com';
    baseImgPath = '/img/';
} else {
    // baseUrl = '//elm.cangdu.org';
    // baseImgPath = '//elm.cangdu.org/img/';
    baseUrl = 'http://192.168.1.182:9100';
    // baseUrl = 'https://new.zhulixc.com';
    baseImgPath = '/img/';
}

export {
    baseUrl,
    routerMode,
    baseImgPath
}