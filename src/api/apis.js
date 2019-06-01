export default {
    transformNews: '/api/user/inside/message/getTransactionMsg', //交易消息列表
    systemNews: '/api/user/inside/message/getTerraceMsg', //获取平台信息
    delNews: '/api/user/inside/message/deleteMsg', //删除消息



    putGoods: '', //修改商品
    // twh
    login: '/api/auth/accredit', //登录
    userInfo: '/api/auth/verify', //用户信息
    home: '/api/order/inside/centerConsole/getOrderSellList', //*首页信息
    uploadImg: 'http://192.168.1.182:9100/api/upload/uploadFile', //上传图片（cs）
    // uploadImg: 'https://new.zhulixc.com/api/upload/uploadFile', //上传图片（xs）

    OneLeve: '/api/getOneLevelCClassify', //*发布商品-获取1级分类
    TwoLeve: '/api/getTwoLevelCClassify/', //*发布商品-获取2.3级分类
    getBrandManage: '/api/commodity/brand/queryBrandName', //*发布获取品牌列表
    getCommoditySpec: '/api/getCommoditySpec/', //*发布获取规格
    labelList: '/api/commodity/commodityLabel/getUserCommodityLabel', //*发布获取规格
    addGoods: '/api/commodity/save', //*发布商品
    queryCommodityList: '/api/commodity/queryCommodityList',
    upGood: '/api/commodity/update', //更新商品
    deleteSpecification: '/api/commodity/deleteSpecification', //删除规格
    deleteCommodityServer: '/api/commodity/deleteCommodityServer', //删除服务
    deleteCommodityImg: '/api/commodity/deleteCommodityImg', //删除图片

    allNews: '/api/user/inside/message/getUserMsg', //全部消息
    unReadyNews: '/api/user/inside/message/getMsgRow', //未读信息条数
    deleteMsg: '/api/user/inside/message/deleteMsg/', //删除消息
    editMsg: '/api/user/inside/message/getUserMsgDetail/', // 已读消息及获取详情

    goodsList: '/api/commodity/query', //*商品列表 
    delGoods: '/api/commodity/delete/', //*删除商品
    commodityReview: '/api/commodity/commodityReview?', //商品审核

    brandList: '/api/commodity/brand/queryBrand', //获取品牌类别
    postBrand: '/api/commodity//brand/saveBrand', //增加品牌
    updateBrand: '/api/commodity/brand/updateBrand', //更新品牌
    delBrend: '/api/commodity//brand/deleteBrand/', //删除

    queryAds: '/api/commodity/ads/queryAds', //*广告位列表
    AdsPositionList: '/api/getAllAdsPositionList', //
    saveAds: '/api/commodity/ads/saveAds', //*广告位添加
    updateAds: '/api/commodity/ads/updateAds', //*广告位更新
    deldateAds: '/api/commodity/ads/delete/', //*广告位删除
    checkByCommodityId: '/api/commodity/checkByCommodityId', //*广告位查询商品id是否存在

    query: '/api/commodity/comment/query', //*评论
    deleteComment: '/api/commodity/comment/deleteByCommentId', //*评论删除
    queryDetailComment: '/api/commodity/comment/queryCommodityComment/', //获取评论详情
    queryByCommodityId: '/api/commodity/queryByCommodityId', //根据商品id查询商品
    replyUser: '/api/commodity/reply/replyUserCommentContext', //回复
    // xc
    getShopOrder: '/api/order/inside/showShopOrder', //全部订单列表 xc
    getOrderDetails: '/api/order/inside/shopOrderDetails', //全部订单详情 xc
    queryOrderRefundList: '/api/order/inside/queryOrderRefundList', //退换订单列表xc
    getMailList: '/api/getExpress', //快递列表 xc
    updateOrderMoney: '/api/order/inside/updateOrderMoney', // 修改价格 xc
    updateKuaiDi: "/api/order/inside/updateKuaiDi", //卖家发货cv
    shopRefundLogistics: "/api/order/inside/shopRefundLogistics", //换货卖家发货cv
    updateShopRefund: '/api/order/updateShopRefund', //商家审核xc
    queryOrderRefundDetails: '/api/order/inside/queryOrderRefundDetails', //退换货订单详情xc
    getAddress: '/api/order/inside/address/getAddressByAddressId', //获取用户发货地址xc
    getLogistics: 'api/order/kuaiDi', //获取物流信息xc
    confirmReceive: '/api/order/inside/refundOperation', //商家确认收货xc
    shopAudit: '/api/order/inside/shopAudit', //商家审核取消订单xc
    queryShopList: '/api/commodity/shop/queryShop', //商家未审核列表信息xc
    getSellerDetails: '/api/commodity/shop/checkShopByShopId', //获取商家信息xc
    shopAuditing: '/api/commodity/shop/updateSellerAuditorStatus', //审核商家xc
    getCarrieroperatorNotDoneOrders: '/api/order/inside/centerConsole/getOperatorOrderSellList', //获取取未完成订单 运营商xc
    getSellerNotDoneData: '/api/order/inside/centerConsole/getOrderSellList', //获取取未完成订单 商家xc
    getGoodsList: '/api/commodity/query', //商品列表xc
    updateCommodityStatus: '/api/commodity/updateCommodityStatus', //商品上下架xc
    getAddressDetail: '/api/getAddressDetail', //通过ID集合获取地址xc
    getProvinceList: '/api/getProvinceList', //获取所有省份xc
    getCityList: '/api/getCityList', //获取城市xc
    getDistrictList: '/api/getDistrictList', //获取区域xc
    getVillage: '/api/getVillage', //获取街道xc
    updateShop: "/api/commodity/shop/updateShop", //修改店铺xc
    isFreezeShop: "/api/commodity/shop/freezeShop", //冻结，解冻店铺 xc
    getOneLevelCClassify: '/api/getOneLevelCClassify', //获取一级分类xc
    getNextLevelCClassify: '/api/getTwoLevelCClassify', //获取下级分类xc
    test: '/api/commodity/inside/query'

}