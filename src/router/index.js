import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
// const home2 = r => require.ensure([], () => r(require('@/page/home.1')), 'home2');
// const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
// const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
// const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
// const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
// const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
const orderList = r => require.ensure([], () => r(require('@/page/ordersManage/orderList')), 'orderList'); //全部订单列表xc
const returnOrderList = r => require.ensure([], () => r(require('@/page/ordersManage/returnOrderList')), 'returnOrderList'); //退货订单列表xc
const exchangeOrderList = r => require.ensure([], () => r(require('@/page/ordersManage/exchangeOrderList')), 'exchangeOrderList'); //换货订单列表xc
const orderDetails = r => require.ensure([], () => r(require('@/page/ordersManage/orderDetails')), 'orderDetails'); //订单详情xc
const returnOrderDetails = r => require.ensure([], () => r(require('@/page/ordersManage/returnOrderDetails')), 'returnOrderDetails'); //退货订单详情xc
const exchangeOrderDetails = r => require.ensure([], () => r(require('@/page/ordersManage/exchangeOrderDetails')), 'exchangeOrderDetails'); //换货订单详情xc
const goodsList = r => require.ensure([], () => r(require('@/page/goodsManage/goodsList')), 'goodsList'); //区域运营商商品列表xc
const unauditedSellerList = r => require.ensure([], () => r(require('@/page/areaSellerManage/unauditedSellerList')), 'unauditedSellerList'); //区域运营商待审核商家列表xc
const auditedSellerList = r => require.ensure([], () => r(require('@/page/areaSellerManage/auditedSellerList')), 'auditedSellerList'); //区域运营商所有商家列表xc
const checkSellerData = r => require.ensure([], () => r(require('@/page/areaSellerManage/checkSellerData')), 'checkSellerData'); //区域运营商查看商家信息xc
const editSellerData = r => require.ensure([], () => r(require('@/page/areaSellerManage/editSellerData')), 'editSellerData'); //区域运营商编辑商家信息xc
// const visitor1 = r => require.ensure([], () => r(require('@/page/visitor1')), 'visitor1');
// const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
// const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
// const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
// const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
// const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
// const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
// const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
//const unFound = r => require.ensure([], () => r(require('@/page/unFound')), 'unFound'); //404页面
const news = r => require.ensure([], () => r(require('@/page/news/news')), 'news'); //消息
const brandManage = r => require.ensure([], () => r(require('@/page/brand/brandManage')), 'brandManage'); //品牌管理
const visitor = r => require.ensure([], () => r(require('@/page/commodity/visitor')), 'visitor');
const manageGoods = r => require.ensure([], () => r(require('@/page/commodity/manageGoods')), 'manageGoods'); //发布管理
const evaluate = r => require.ensure([], () => r(require('@/page/comment/evaluate')), 'evaluate'); //评论管理
const evaluateDetails = r => require.ensure([], () => r(require('@/page/comment/evaluateDetails')), 'evaluateDetails'); //评论管理详情
const adsense = r => require.ensure([], () => r(require('@/page/advertisement/adsense')), 'adsense'); //广告位


//requireAuth  需要登录权限的路由 
const routes = [
    {
      path: '/',
      component: login,
      auth: {
          requireAuth: false
      },
      redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/manage',
        component: manage,
        meta: {
            requireAuth: true,
        },
        children: [{
                path: '', // twh
                component: home,
                meta: [],
            }, {
                path: '/news', // twh
                component: news,
                name: '信息管理',
                meta: ["店铺管理", "信息管理"],
            }, {
                path: '/visitor', // twh
                component: visitor,
                name: '发布商品',
                meta: ['图表', '用户分布'],
            }, {
                path: '/brandManage', // twh 
                component: brandManage,
                meta: ['品牌管理']
            }, {
                path: '/manageGoods', // twh 
                component: manageGoods,
                name: '商品管理',
                meta: ['商品管理']
            }, {
                path: '/evaluate', // twh  evaluateDetails
                component: evaluate,
                name: '评论管理',
                meta: ['评论管理']
            }, {
                path: '/evaluateDetails', // twh  
                component: evaluateDetails,
                name: '评论管理详情',
                meta: ['评论管理详情']
            }, {
                path: '/adsense', // twh  
                component: adsense,
                name: '广告位管理',
                meta: ['评论管理详情']
            },
            // {
            //     path: '/addShop',
            //     component: addShop,
            //     meta: ['添加数据', '添加商铺'],
            // }, {
            //     path: '/addGoods',
            //     component: addGoods,
            //     meta: ['添加数据', '添加商品'],
            // }, {
            //     path: '/userList',
            //     component: userList,
            //     meta: ["店铺管理", "我的店铺"],
            // }, {
            //     path: '/shopList',
            //     component: shopList,
            //     meta: ['数据管理', '商家列表'],
            // }, {
            //     path: '/foodList',
            //     component: foodList,
            //     meta: ['数据管理', '食品列表'],
            // }, 
            {
                path: '/orderList', //xc
                component: orderList,
                meta: ['商家订单', '订单列表'],

            }, {
                path: '/exchangeOrderList', //xc
                component: exchangeOrderList,
                meta: ['商家订单', '换货订单列表'],

            },
            {
                path: '/returnOrderList', //xc
                component: returnOrderList,
                meta: ['商家订单', '退货订单列表'],

            },
            {
                path: '/orderDetails', //xc
                component: orderDetails,
                meta: ['商家订单', '订单详情'],
            }, {
                path: '/exchangeOrderDetails', //xc
                component: exchangeOrderDetails,
                meta: ['商家订单', '换货订单详情'],
            },
            {
                path: '/returnOrderDetails', //xc
                component: returnOrderDetails,
                meta: ['商家订单', '退货订单详情'],
            },
            {
                path: '/unauditedSellerList', //xc
                component: unauditedSellerList,
                meta: ['商家订单', '待审核商家列表'],

            },
            {
                path: '/auditedSellerList', //xc
                component: auditedSellerList,
                meta: ['商家管理', '已审核商家列表'],
            },
            {
                path: '/checkSellerData', //xc
                component: checkSellerData,
                meta: ['商家管理', '查看商家'],
            },
            {
                path: '/editSellerData', //xc
                component: editSellerData,
                meta: ['商家管理', '编辑商家'],
            }, {
                path: '/goodsList', //xc
                component: goodsList,
                meta: ['商家管理', '商品管理'],
            },
            // {
            //     path: '/visitor1',
            //     component: visitor1,
            //     meta: ['数据管理', '订单列表'],
            // }, {
            //     path: '/adminList',
            //     component: adminList,
            //     meta: ['数据管理', '管理员列表'],
            // }, {
            //     path: '/newMember',
            //     component: newMember,
            //     meta: ['图表', '用户数据'],
            // }, {
            //     path: '/uploadImg',
            //     component: uploadImg,
            //     meta: ['文本编辑', 'MarkDown'],
            // }, {
            //     path: '/vueEdit',
            //     component: vueEdit,
            //     meta: ['编辑', '文本编辑'],
            // }, {
            //     path: '/adminSet',
            //     component: adminSet,
            //     meta: ['设置', '管理员设置'],
            // }, {
            //     path: '/sendMessage',
            //     component: sendMessage,
            //     meta: ['设置', '发送通知'],
            // }, {
            //     path: '/explain',
            //     component: explain,
            //     meta: ['说明', '说明'],
            // },
            // {
            //     path: '/unFound',
            //     component: unFound,
            //     meta: ['页面不存在']
            // }

        ]
    }

]


export default new Router({
    routes,
    mode: 'history',
    // base: process.env.BASE_ENV === 'dev' ? '' : '/center/'
    // base: '/center/'
    // strict: process.env.NODE_ENV !== 'production',
})