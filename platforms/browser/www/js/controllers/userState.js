function userState(_this) {

    _this
    //用户中心
        .state('userCenter', {
            url: '/userCenter',
            templateUrl: 'templates/user/uc-center.html',
            controller: 'userCenter'
        })
        //用户账户
        .state('userAccount', {
            url: '/userAccount',
            templateUrl: 'templates/user/user-account.html',
            controller: 'userAccount'
        })
        //余额提现
        .state('user-balance-withdrawal', {
            url: '/user-balance-withdrawal',
            templateUrl: 'templates/user/balance-withdrawal.html',
            controller: 'user-balance-withdrawal'
        })
        //账户充值
        .state('accountRecharge', {
            url: '/accountRecharge',
            templateUrl: 'templates/user/account-recharge.html',
            controller: 'accountRecharge'
        })
        //支付方式
        .state('payment', {
            url: '/payment',
            templateUrl: 'templates/user/payment.html',
            controller: 'payment'
        })
        //佣金(收益)记录表
        .state('commissionRecord', {
            url: '/commissionRecord',
            templateUrl: 'templates/user/commission-record.html',
            controller: 'commissionRecord'
        })
        //累计收益
        .state('cumulate-income', {
            url: '/cumulate-income',
            templateUrl: 'templates/user/cumulate-income.html',
            controller: 'cumulate-income'
        })
        //访客详情
        .state('visitor-detial', {
            url: '/visitor-detial',
            templateUrl: 'templates/user/visitor-detial.html',
            controller: 'visitor-detial'
        })
        //交易明细列表
        .state('transactionRecord', {
            url: '/transactionRecord',
            templateUrl: 'templates/user/transaction-record.html',
            controller: 'transactionRecord'
        })
        //交易明细详情
        .state('transactionRecordDetail', {
            url: '/transactionRecordDetail',
            templateUrl: 'templates/user/transaction-record-detail.html',
            controller: 'transactionRecordDetail'
        })
        //号码::订单列表
        .state('numberOrderList', {
            url: '/numberOrderList',
            templateUrl: 'templates/user/number-order-list.html',
            controller: 'numberOrderList'
        })
        //号码::订单详情
        .state('numberOrderDetail', {
            url: '/numberOrderDetail',
            templateUrl: 'templates/user/number-order-detail.html',
            controller: 'numberOrderDetail'
        })
        //宽带::订单列表
        .state('kdOrderList', {
            url: '/kdOrderList',
            templateUrl: 'templates/user/kd-order-list.html',
            controller: 'kdOrderList'
        })
        //宽带::订单详情
        .state('kdOrderDetail', {
            url: '/kdOrderDetail/:number/:orderCode/:numOrderCode',
            templateUrl: 'templates/user/kd-order-detail.html',
            controller: 'kdOrderDetail'
        })
        //手机::话费充值
        .state('telFareOrderList', {
            url: '/telFareOrderList',
            templateUrl: 'templates/user/tel-fare-order.html',
            controller: 'telFareOrderList'
        })
        //号码::预约订单
        .state('orderedOrderList', {
            url: '/orderedOrderList',
            templateUrl: 'templates/user/ordered-order-list.html',
            controller: 'orderedOrderList'
        })
        //号码::预约订单详情
        .state('orderedOrderDetail', {
            url: '/orderedOrderDetail',
            templateUrl: 'templates/user/ordered-order-detail.html',
            controller: 'orderedOrderDetail'
        })
        //用户中心::设置
        .state('userCenterSet', {
            url: '/userCenterSet',
            templateUrl: 'templates/user/set.html',
            controller: 'userCenterSet'
        })
        //用户中心::个人资料
        .state('userProfile', {
            url: '/userProfile',
            templateUrl: 'templates/user/user-profile.html',
            controller: 'userProfile'
        })
        //用户中心::安全中心
        .state('securityCenter', {
            url: '/securityCenter',
            templateUrl: 'templates/user/security-center.html',
            controller: 'securityCenter'
        })
        //用户中心::修改密码
        .state('changePassWord', {
            url: '/changePassWord',
            templateUrl: 'templates/user/change-pwd.html',
            controller: 'changePassWord'
        })
        //用户中心::绑定手机号码
        .state('userBindTel', {
            url: '/userBindTel',
            templateUrl: 'templates/user/bind-tel.html',
            controller: 'userBindTel'
        })
        //用户中心::关于我们
        .state('aboutUs', {
            url: '/aboutUs',
            templateUrl: 'templates/user/about-us.html',
            controller: 'aboutUs'
        })
        //用户中心::技术支持
        .state('contactUs', {
            url: '/contactUs',
            templateUrl: 'templates/user/contact-us.html',
            controller: 'contactUs'
        })
        //用户中心::在线客服
        .state('onlineService', {
            url: '/onlineService',
            templateUrl: 'templates/user/online-service.html',
            controller: 'onlineService'
        })
        //用户中心::发展人信息
        .state('agencyInfo', {
            url: '/agencyInfo',
            templateUrl: 'templates/user/agency-info.html',
            controller: 'agencyInfo'
        })
        //用户中心::帮助中心
        .state('user-helper-center', {
            url: '/user-helper-center',
            templateUrl: 'templates/user/helper-center.html',
            controller: 'user-helper-center'
        })
        //帮助中心：问题列表
        .state('user-helper-problem-list', {
            url: '/user-helper-problem-list',
            templateUrl: 'templates/user/helper-problem-list.html',
            controller: 'user-helper-problem-list'
        })
        //帮助中心：搜索关键字
        .state('user-helper-search-keyword', {
            url: '/user-helper-search-keyword',
            templateUrl: 'templates/user/helper-search-keyword.html',
            controller: 'user-helper-search-keyword'
        })
        //帮助中心：意见反馈
        .state('user-helper-advice-feedback', {
            url: '/user-helper-advice-feedback',
            templateUrl: 'templates/user/helper-advice-feedback.html',
            controller: 'user-helper-advice-feedback'
        })
        //帮助中心：问题详情
        .state('user-helper-problem-detail', {
            url: '/user-helper-problem-detail',
            templateUrl: 'templates/user/helper-problem-detail.html',
            controller: 'user-helper-problem-detail'
        })
        //花呗商家注册
        .state('user-huabei-register', {
            url: '/user-huabei-register',
            templateUrl: 'templates/user/huabei-register.html',
            controller: 'user-huabei-register'
        })
        //花呗商家注册步骤
        .state('user-huabei-register-step', {
            url: '/user-huabei-register-step',
            templateUrl: 'templates/user/huabei-register-step.html',
            controller: 'user-huabei-register-step'
        })
        //支付密码
        .state('payPassWord', {
            url: '/payPassWord',
            templateUrl: 'templates/user/pay-password.html',
            controller: 'payPassWord'
        })
        //佣金返还规则
        .state('commission', {
            url: '/commission',
            templateUrl: 'templates/user/commission.html',
            controller: 'commission'
        })
        //获取店铺的卡片
        .state('user-dianpu-card', {
            url: '/user-dianpu-card/:userId',
            templateUrl: 'templates/user/dianpu-card.html',
            controller: 'user-dianpu-card'
        })
        //最新前10订单列表
        .state('newOrderList', {
            url: '/newOrderList',
            templateUrl: 'templates/user/new-order-list.html',
            controller: 'newOrderList'
        })
        //抢单
        .state('dianpu-grap-order', {
            url: '/dianpu-grap-order',
            templateUrl: 'templates/user/grapOrder.html',
            controller: 'dianpu-grap-order'
        })
        //抢单详情
        .state('dianpu-grap-order-detail', {
            url: '/dianpu-grap-order-detail',
            templateUrl: 'templates/user/grapOrderDetail.html',
            controller: 'dianpu-grap-order-detail'
        })
        //抢单办理业务选择
        .state('dianpu-grap-order-manage', {
            url: '/dianpu-grap-order-manage/:number/:orderCode',
            templateUrl: 'templates/user/grapOrderManage.html',
            controller: 'dianpu-grap-order-manage'
        })
        //抢单宽带业务
        .state('dianpu-grap-order-lan', {
            url: '/dianpu-grap-order-lan/:pageTitle',
            templateUrl: 'templates/user/grapOrderLanBusiness.html',
            controller: 'index'
        })
        //更多消息中心列表
        .state('moreMessagesList', {
            url: '/moreMessagesList',
            templateUrl: 'templates/user/more-messages-list.html',
            controller: 'moreMessagesList'
        })
        //大王卡首页
        .state('dianpu-dw-index', {
            url: '/dianpu-dw-index',
            templateUrl: 'templates/user/dwIndex.html',
            controller: 'dianpu-dw-index'
        })
        //大王卡信息
        .state('dianpu-dw-info', {
            url: '/dianpu-dw-info/:choseCrad',
            templateUrl: 'templates/user/dwInfo.html',
            controller: 'dianpu-dw-info'
        })

    //大王卡ICCID
    .state('dianpu-dw-iccid', {
        url: '/dianpu-dw-iccid',
        templateUrl: 'templates/user/dwIccid.html',
        controller: 'dianpu-dw-iccid'
    })

    //订单管理
    .state('orderManagements', {
            url: '/orderManagements',
            templateUrl: 'templates/user/order-managements.html',
            controller: 'orderManagements'
        })
        //固话订单
        .state('fixPhone', {
            url: '/fixPhone',
            templateUrl: 'templates/user/fix-phone.html',
            controller: 'fixPhone'
        })
        //固话订单
        .state('fixPhoneDetail', {
            url: '/fixPhoneDetail',
            templateUrl: 'templates/user/fix-phone-detail.html',
            controller: 'fixPhoneDetail'
        })

    // 联通商城订单
    .state("unicom-order", {
            templateUrl: "templates/user/UnicomMallLanOrder.html",
            url: "/unicom-order",
            controller: "unicom-order"
        })
        // 联通商城订单
        .state("unicom-order-user", {
            templateUrl: "templates/user/UnicomMallLanOrderForUser.html",
            url: "/unicom-order-user",
            controller: "unicom-order-user"
        })
        // 联通商城订单详情
        .state("unicom-order-detail", {
            templateUrl: "templates/user/UnicomMallLanOrderDetail.html",
            url: "/unicom-order-detail/:orderId",
            controller: "unicom-order-detail"
        })
        // 联通商城用户取消
        .state("unicom-order-cancle", {
            templateUrl: "templates/user/UnicomMallLanOrderCancle.html",
            url: "/unicom-order-cancle/:orderId/:status/:userName",
            controller: "unicom-order-cancle"
        })

    // 联通商城订单
    .state("unicom-lan-order", {
            templateUrl: "templates/user/UnicomOrder.html",
            url: "/unicom-lan-order",
            controller: "unicom-lan-order"
        })
        // 联通商城订单
        .state("unicom-lan-order-user", {
            templateUrl: "templates/user/UnicomOrderForUser.html",
            url: "/unicom-lan-order-user",
            controller: "unicom-lan-order-user"
        })
        // 店铺信息
        .state("zxdianpu-info", {
            templateUrl: "templates/user/dianpuInfo.html",
            url: "/zxdianpu-info",
            controller: "zxdianpu-info"
        })
        // 信息通知
        .state("news-inform", {
            templateUrl: "templates/user/newsInform.html",
            url: "/news-inform/:id",
            controller: "news-inform"
        })

    // 搜索
    .state("search", {
        templateUrl: "templates/user/search.html",
        url: "/search",
        controller: "search"
    })




    // 水果商城
    .state("market-index", {
        templateUrl: "templates/market/marketIndex.html",
        url: "/market-index/:typeCode",
        controller: "market-index"
    })










    //业务分类
    .state("bussniess-type", {
        templateUrl: "templates/bussniessType.html",
        url: "/bussniess-type/:tag",
        controller: "bussniess-type"
    })












    // 信息通知
    .state("news-list", {
        templateUrl: "templates/user/newsList.html",
        url: "/news-list",
        controller: "news-list"
    })

    //找回密码
    // 信息通知
    .state("reset-password", {
        templateUrl: "templates/user/resetPassword.html",
        url: "/reset-password",
        controller: "reset-password"
    })



    .state("market-adds", {
        templateUrl: "templates/market/marketAdds.html",
        url: "/market-adds/:formInfo",
        controller: "market-adds"
    })

    .state("market-type", {
        templateUrl: "templates/market/marketType.html",
        url: "/market-type",
        controller: "market-type"
    })

    .state("market-ord", {
        templateUrl: "templates/market/marketOrd.html",
        url: "/market-ord/:productCode",
        controller: "market-ord"
    })

    .state("market-myord", {
        templateUrl: "templates/market/marketMyord.html",
        url: "/market-myord",
        controller: "market-myord"
    })

    .state("market-search", {
        templateUrl: "templates/market/marketSearch.html",
        url: "/market-search",
        controller: "market-search"
    })

    .state("market-bag", {
        templateUrl: "templates/market/marketBag.html",
        url: "/market-bag",
        controller: "market-bag"
    })

    .state("market-goods", {
        templateUrl: "templates/market/marketGoods.html",
        url: "/market-goods/:productCode",
        controller: "market-goods"
    })

    .state("market-addbags", {
        templateUrl: "templates/market/marketaddBags.html",
        url: "/market-addbags",
        controller: "market-addbags"
    })

    .state("market-okpay", {
        templateUrl: "templates/market/marketOkPay.html",
        url: "/market-okpay",
        controller: "market-okpay"
    })

    .state("market-lists", {
        templateUrl: "templates/market/marketLists.html",
        url: "/market-lists/:typeCode/:keyword",
        controller: "market-lists"
    })

    .state("market-ordinfo", {
        templateUrl: "templates/market/marketOrdInfo.html",
        url: "/market-ordinfo/:orderCode/:status/:orderId",
        controller: "market-ordinfo"
    })

    .state("market-logistics", {
        templateUrl: "templates/market/marketLogistics.html",
        url: "/market-logistics/:orderCode",
        controller: "market-logistics"
    })

    .state("market-failpay", {
        templateUrl: "templates/market/marketFailPay.html",
        url: "/market-failpay",
        controller: "market-failpay"
    })

    .state("market-addnewadds", {
        templateUrl: "templates/market/marketAddNewAdds.html",
        url: "/market-addnewadds",
        controller: "market-addnewadds"
    })

    .state("market-eval", {
        templateUrl: "templates/market/marketEval.html",
        url: "/market-eval/:orderCode",
        controller: "market-eval"
    })

    .state("market-evalgoods", {
        templateUrl: "templates/market/marketEvalGoods.html",
        url: "/market-evalgoods/:productCode/:orderCode/:goodsStatus/:goodsId",
        controller: "market-evalgoods"
    })

    .state("market-evalok", {
            templateUrl: "templates/market/marketEvalOk.html",
            url: "/market-evalok",
            controller: "market-evalok"
        })
        //购物车
        .state("market-shopping-card", {
            templateUrl: "templates/market/shopping-card.html",
            url: "/market-shopping-card",
            controller: "market-shopping-card"
        })

    //花呗分期收费
    .state("user-huabei-charge", {
        templateUrl: "templates/user/huabei-charge.html",
        url: "/user-huabei-charge",
        controller: "user-huabei-charge"
    })


    //预约卡上门办理
    .state('visit-reserve-gohome-dealCard', {
            url: '/visit-reserve-gohome-dealCard',
            templateUrl: 'templates/visit/reserve-gohome-dealCard.html',
            controller: 'visit-reserve-gohome-dealCard'
        })
        //确认所选订单
        .state('visit-resure-My-Orders', {
            url: '/visit-resure-My-Orders',
            templateUrl: 'templates/visit/resure-My-Orders.html',
            controller: 'visit-resure-My-Orders'
        })
        //规划路线
        .state('visit-plan-travel-route', {
            url: '/visit-plan-travel-route',
            templateUrl: 'templates/visit/plan-travel-route.html',
            controller: 'visit-plan-travel-route'
        })
        //订单详情
        .state('visit-gohome-order-detial', {
            url: '/visit-gohome-order-detial',
            templateUrl: 'templates/visit/gohome-order-detial.html',
            controller: 'visit-gohome-order-detial'
        })
        //转单
        .state('visit-transfer-order', {
            url: '/visit-transfer-order',
            templateUrl: 'templates/visit/transfer-order.html',
            controller: 'visit-transfer-order'
        })
        //外呼SIM卡
        .state('user-breathe-SIM-classify', {
            url: '/user-breathe-SIM-classify',
            templateUrl: 'templates/user/breathe-SIM-classify.html',
            controller: 'user-breathe-SIM-classify'
        })
        //外呼SIM卡信息提交
        .state('user-breathe-SIM-submit', {
            url: '/user-breathe-SIM-submit/:iccid',
            templateUrl: 'templates/user/breathe-SIM-submit.html',
            controller: 'user-breathe-SIM-submit'
        })
        //外呼SIM卡派送
        .state('user-breathe-SIM-send', {
            url: '/user-breathe-SIM-send',
            templateUrl: 'templates/user/breathe-SIM-send.html',
            controller: 'user-breathe-SIM-send'
        })



};