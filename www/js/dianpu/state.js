function dianpuState(_this) {

    _this
        .state("dianpu-cbss-package-list", {
            "templateUrl": "templates/dianpu/kaika/cbss-package-list.html",
            "url": "/dianpu-cbss-package-list",
            "controller": "dianpu-cbss-package-list"
        })
        .state("dianpu-cbbs-package-result", {
            "templateUrl": "templates/dianpu/kaika/cbbs-package-result.html",
            "url": "/dianpu-cbbs-package-result",
            "controller": "dianpu-cbbs-package-result"
        })

    .state("dianpu-cbbs-package-service", {
            "templateUrl": "templates/dianpu/kaika/cbbs-package-service.html",
            "url": "/dianpu-cbbs-package-service",
            "controller": "dianpu-cbbs-package-service"
        })
        .state("dianpu-cbbs-package-activity", {
            "templateUrl": "templates/dianpu/kaika/cbbs-package-activity.html",
            "url": "/dianpu-cbbs-package-activity",
            "controller": "dianpu-cbbs-package-activity"
        })
        .state("dianpu-cbbs-package-GroupInfo", {
            "templateUrl": "templates/dianpu/kaika/cbss-GroupInfo.html",
            "url": "/dianpu-cbbs-package-GroupInfo",
            "controller": "dianpu-cbbs-package-GroupInfo"
        })
        .state("dianpu-cbss-write-sim", {
            "templateUrl": "templates/dianpu/kaika/cbss-write-sim.html",
            "url": "/dianpu-cbss-write-sim",
            "controller": "dianpu-cbss-write-sim"
        })
        .state("dianpu-cbss-write-simCard", {
            "templateUrl": "templates/dianpu/kaika/cbss-write-sim-card.html",
            "url": "/dianpu-cbss-write-simCard",
            "controller": "dianpu-cbss-write-simCard"
        })

    //CBSS入网协议
    .state("dianpu-cbss-protocol-details", {
        "templateUrl": "templates/dianpu/kaika/cbss-protocol-details.html",
        "url": "/dianpu-cbss-protocol-details",
        "controller": "dianpu-cbss-protocol-details"
    })


    .state("dianpu-cbss-write-sim-submit", {
            "templateUrl": "templates/dianpu/kaika/cbss-write-sim-submit.html",
            "url": "/dianpu-cbss-write-sim-submit",
            "controller": "dianpu-cbss-write-sim-submit"
        })
        // cbss 半成卡
        .state("dianpu-semiManufactures-sim", {
            "templateUrl": "templates/dianpu/kaika/semiManufactures-sim.html",
            "url": "/dianpu-semiManufactures-sim",
            "controller": "dianpu-semiManufactures-sim"
        })
        // cbss 畅视卡
        .state("dianpu-cbss-changshi-imei", {
            "templateUrl": "templates/dianpu/kaika/changshika/imei.html",
            "url": "/dianpu-cbss-changshi-imei",
            "controller": "dianpu-cbss-changshi-imei"
        })
        // cbss副卡
        .state("dianpu-cbss-fukaInfo", {
            "templateUrl": "templates/dianpu/kaika/cbss-fukaInfo.html",
            "url": "/dianpu-cbss-fukaInfo",
            "controller": "dianpu-cbss-fukaInfo"
        })
        // cbss 购机赠费活动
        .state("dianpu-cbss-phoneGiveFee", {
            "templateUrl": "templates/dianpu/kaika/phoneGiveFee/imei.html",
            "url": "/dianpu-cbss-phoneGiveFee",
            "controller": "dianpu-cbss-phoneGiveFee"
        })
        // .state("dianpu-cbss-phoneGiveFee-phoneList", {
        //     "templateUrl": "templates/dianpu/kaika/phoneGiveFee/phoneList.html",
        //     "url": "/dianpu-cbss-phoneGiveFee-phoneList",
        //     "controller": "dianpu-cbss-phoneGiveFee-phoneList"
        // })
        // .state("dianpu-cbss-phoneGiveFee-activity", {
        //     "templateUrl": "templates/dianpu/kaika/phoneGiveFee/activity.html",
        //     "url": "/dianpu-cbss-phoneGiveFee-activity",
        //     "controller": "dianpu-cbss-phoneGiveFee-activity"
        // })

    // cbss 成卡返单
    .state("dianpu-cbss-dealerreturn", {
            "templateUrl": "templates/dianpu/dealerreturn/cbss/index.html",
            "url": "/dianpu-cbss-dealerreturn",
            "controller": "dianpu-cbss-dealerreturn"
        })
        .state("dianpu-cbss-dealerreturn-confirm", {
            "templateUrl": "templates/dianpu/dealerreturn/cbss/confirm.html",
            "url": "/dianpu-cbss-dealerreturn-confirm",
            "controller": "dianpu-cbss-dealerreturn-confirm"
        })
        .state("dianpu-cbss-dealerreturn-submit", {
            "templateUrl": "templates/dianpu/dealerreturn/cbss/submit.html",
            "url": "/dianpu-cbss-dealerreturn-submit",
            "controller": "dianpu-cbss-dealerreturn-submit"
        })

    // bss 开卡
    // .state("dianpu-bss-package-list", {
    // 	  "templateUrl":"templates/dianpu/kaika/bss-package-list.html"
    // 	, "url":"/dianpu-bss-package-list"
    // 	, "controller":"dianpu-bss-package-list"
    // })
    // .state("dianpu-bss-package-huinongka", {
    // 	  "templateUrl":"templates/dianpu/kaika/bss-package-huinongka.html"
    // 	, "url":"/dianpu-bss-package-huinongka"
    // 	, "controller":"dianpu-bss-package-huinongka"
    // })
    // .state("dianpu-bss-write-sim", {
    // 	  "templateUrl":"templates/dianpu/kaika/bss-write-sim.html"
    // 	, "url":"/dianpu-bss-write-sim"
    // 	, "controller":"dianpu-bss-write-sim"
    // })
    // .state("dianpu-bss-write-sim-submit", {
    // 	  "templateUrl":"templates/dianpu/kaika/bss-write-sim-submit.html"
    // 	, "url":"/dianpu-bss-write-sim-submit"
    // 	, "controller":"dianpu-bss-write-sim-submit"
    // })

    // bss 成卡返单
    .state("dianpu-bss-dealerreturn", {
            "templateUrl": "templates/dianpu/dealerreturn/bss/index.html",
            "url": "/dianpu-bss-dealerreturn",
            "controller": "dianpu-bss-dealerreturn"
        })
        // .state("dianpu-bss-dealerreturn-package", {
        // 	  "templateUrl":"templates/dianpu/dealerreturn/bss/package.html"
        // 	, "url":"/dianpu-bss-dealerreturn-package"
        // 	, "controller":"dianpu-bss-dealerreturn-package"
        // })
        .state("dianpu-bss-dealerreturn-confirm", {
            "templateUrl": "templates/dianpu/dealerreturn/bss/confirm.html",
            "url": "/dianpu-bss-dealerreturn-confirm",
            "controller": "dianpu-bss-dealerreturn-confirm"
        })
        .state("dianpu-bss-dealerreturn-submit", {
            "templateUrl": "templates/dianpu/dealerreturn/bss/submit.html",
            "url": "/dianpu-bss-dealerreturn-submit",
            "controller": "dianpu-bss-dealerreturn-submit"
        })


    // // 商务座机
    .state("dianpu-pstn-dealerreturn", {
            "templateUrl": "templates/dianpu/pstn/number.html",
            "url": "/dianpu-pstn-dealerreturn",
            "controller": "dianpu-pstn-dealerreturn"
        })
        .state("dianpu-pstn-confirm", {
            "templateUrl": "templates/dianpu/pstn/confirm.html",
            "url": "/dianpu-pstn-confirm",
            "controller": "dianpu-pstn-confirm"
        })
        .state("dianpu-pstn-submit", {
            "templateUrl": "templates/dianpu/pstn/submit.html",
            "url": "/dianpu-pstn-submit",
            "controller": "dianpu-pstn-submit"
        })

    // .state("dianpu-pstn-address-area", {
    // 	  "templateUrl":"templates/dianpu/pstn/test/address-area.html"
    // 	, "url":"/dianpu-pstn-address-area"
    // 	, "controller":"dianpu-pstn-address-area"
    // })
    // .state("dianpu-pstn-getinnetmethod", {
    // 	  "templateUrl":"templates/dianpu/pstn/test/getinnetmethod.html"
    // 	, "url":"/dianpu-pstn-getinnetmethod"
    // 	, "controller":"dianpu-pstn-getinnetmethod"
    // })
    // .state("dianpu-pstn-number-area", {
    // 	  "templateUrl":"templates/dianpu/pstn/test/number-area.html"
    // 	, "url":"/dianpu-pstn-number-area"
    // 	, "controller":"dianpu-pstn-number-area"
    // })
    // .state("dianpu-pstn-number-list", {
    // 	  "templateUrl":"templates/dianpu/pstn/test/number-list.html"
    // 	, "url":"/dianpu-pstn-number-list"
    // 	, "controller":"dianpu-pstn-number-list"
    // })
    // .state("dianpu-pstn-getCustomerList", {
    // 	  "templateUrl":"templates/dianpu/pstn/test/getCustomerList.html"
    // 	, "url":"/dianpu-pstn-getCustomerList"
    // 	, "controller":"dianpu-pstn-getCustomerList"
    // })
    // .state("dianpu-pstn-submitOrder", {
    // 	  "templateUrl":"templates/dianpu/pstn/submitOrder.html"
    // 	, "url":"/dianpu-pstn-submitOrder"
    // 	, "controller":"dianpu-pstn-submitOrder"
    // })



    // BSS|CBSS 号码直充
    .state("dianpu-recharge-number", {
            "templateUrl": "templates/dianpu/recharge/number.html",
            "url": "/dianpu-recharge-number",
            "controller": "dianpu-recharge-number"
        })
        // 微店
        .state("dianpu-micro-shop", {
            "templateUrl": "templates/dianpu/micro-shop/home.html",
            "url": "/dianpu-micro-shop",
            "controller": "dianpu-micro-shop"
        })
        .state("dianpu-signature", {
            "templateUrl": "templates/dianpu/signature.html",
            "url": "/dianpu-signature",
            "controller": "dianpu-signature"
        })
        //我的微店
        .state("dianpu-my-shop", {
            "templateUrl": "templates/dianpu/micro-shop/myShop.html",
            "url": "/dianpu-my-shop",
            "controller": "dianpu-my-shop"
        })
        //我的微店：我的微店
        .state("dianpu-wei-dian", {
            "templateUrl": "templates/dianpu/micro-shop/weiDian.html",
            "url": "/dianpu-wei-dian",
            "controller": "dianpu-wei-dian"
        })
        //我的微店:预存宽带订单
        .state("dianpu-microshop-lan-order-list", {
            "templateUrl": "templates/dianpu/micro-shop/lanOrderList.html",
            "url": "/dianpu-microshop-lan-order-list",
            "controller": "dianpu-microshop-lan-order-list"
        })
        //我的微店：号码业务
        .state("dianpu-hm-business", {
            "templateUrl": "templates/dianpu/micro-shop/hmBusiness.html",
            "url": "/dianpu-hm-business",
            "controller": "dianpu-hm-business"
        })


    //我的微店：宽带业务
    .state("dianpu-lan-business", {
            "templateUrl": "templates/dianpu/micro-shop/lanBusiness.html",
            "url": "/dianpu-lan-business",
            "controller": "index"
        })
        // .state("dianpu-kd-list", {
        // 	  "templateUrl":"templates/dianpu/directory/kuandai-list.html"
        // 	, "url":"/dianpu-kd-list/:pageTitle"
        // 	, "controller":"index"
        // })

    //我的微店：我的二维码
    .state("dianpu-my-code", {
            "templateUrl": "templates/dianpu/micro-shop/myCode.html",
            "url": "/dianpu-my-code",
            "controller": "dianpu-my-code"
        })
        //我的微店：BSS业务
        .state("dianpu-mybss-list", {
            "templateUrl": "templates/dianpu/micro-shop/bssList.html",
            "url": "/dianpu-mybss-list",
            "controller": "index"
        })
        //我的微店：CBSS业务
        .state("dianpu-mycbss-list", {
            "templateUrl": "templates/dianpu/micro-shop/cbssList.html",
            "url": "/dianpu-mycbss-list",
            "controller": "index"
        })


    //我的微店：冰激凌系列
    // .state("dianpu-iceCream", {
    // 	  "templateUrl":"templates/dianpu/micro-shop/iceCream.html"
    // 	, "url":"/dianpu-iceCream"
    // 	, "controller":"dianpu-iceCream"
    // })
    // //我的微店：新装宽带
    // .state("dianpu-new-broadband", {
    // 	  "templateUrl":"templates/dianpu/micro-shop/newBroadband.html"
    // 	, "url":"/dianpu-new-broadband"
    // 	, "controller":"dianpu-new-broadband"
    // })
    // //我的微店：送宽带
    // .state("dianpu-give-broadband", {
    // 	  "templateUrl":"templates/dianpu/micro-shop/giveBroadband.html"
    // 	, "url":"/dianpu-give-broadband"
    // 	, "controller":"dianpu-give-broadband"
    // })

    //我的微店：系列产品
    .state("dianpu-series-product", {
            "templateUrl": "templates/dianpu/micro-shop/seriesProduct.html",
            "url": "/dianpu-series-product/:pageType/:category",
            "controller": "dianpu-series-product"
        })
        //我的微店：系列产品预约
        .state("dianpu-series-order", {
            "templateUrl": "templates/dianpu/micro-shop/seriesOrder.html",
            "url": "/dianpu-series-order",
            "controller": "dianpu-series-order"
        })


    //我的微店：宽带预约订单详情
    .state("dianpu-microshop-lan-order-detail", {
            "templateUrl": "templates/dianpu/micro-shop/lanOrderDetail.html",
            "url": "/dianpu-microshop-lan-order-detail",
            "controller": "dianpu-microshop-lan-order-detail"
        })
        //我的微店：微店统计
        .state("dianpu-wx-statistical", {
            "templateUrl": "templates/dianpu/micro-shop/wxStatistical.html",
            "url": "/dianpu-wx-statistical",
            "controller": "dianpu-wx-statistical"
        })
        //我的微店：异业受理
        .state("dianpu-wx-other-accept", {
            "templateUrl": "templates/dianpu/micro-shop/otherAccept.html",
            "url": "/dianpu-wx-other-accept",
            "controller": "dianpu-wx-other-accept"
        })
        //我的微店：异业受理详情
        .state("dianpu-wx-other-accept-detail", {
            "templateUrl": "templates/dianpu/micro-shop/otherAcceptDetail.html",
            "url": "/dianpu-wx-other-accept-detail/:orderCode",
            "controller": "dianpu-wx-other-accept-detail"
        })



    // 互联网号码订单（引流订单/异业订单）
    .state("dianpu-guide-network-flow-order", {
            "templateUrl": "templates/dianpu/micro-shop/guideNetworkFlowOrder.html",
            "url": "/dianpu-guide-network-flow-order",
            "controller": "dianpu-guide-network-flow-order"
        })
        .state("dianpu-guide-network-flow-order-details", {
            "templateUrl": "templates/dianpu/micro-shop/guideNetworkFlowOrderDetails.html",
            "url": "/dianpu-guide-network-flow-order-details",
            "controller": "dianpu-guide-network-flow-order-details"
        })
        .state("dianpu-synergy-network-order", {
            "templateUrl": "templates/dianpu/micro-shop/synergyNetworkOrder.html",
            "url": "/dianpu-synergy-network-order",
            "controller": "dianpu-synergy-network-order"
        })
        .state("dianpu-synergy-network-order-details", {
            "templateUrl": "templates/dianpu/micro-shop/synergyNetworkOrderDetails.html",
            "url": "/dianpu-synergy-network-order-details",
            "controller": "dianpu-synergy-network-order-details"
        })









    //我的微店：佣金列表
    .state("dianpu-weidian-amount", {
        "templateUrl": "templates/dianpu/micro-shop/weidian-amount.html",
        "url": "/dianpu-weidian-amount",
        "controller": "dianpu-weidian-amount"
    })

    //我的微店：号码订单列表
    .state("dianpu-weidian-numberorder-list", {
        "templateUrl": "templates/dianpu/micro-shop/weidian-numberorder-list.html",
        "url": "/dianpu-weidian-numberorder-list",
        "controller": "dianpu-weidian-numberorder-list"
    })

    //我的微店：宽带订单列表
    .state("dianpu-weidian-lanOrder-list", {
        "templateUrl": "templates/dianpu/micro-shop/weidian-lanOrder-list.html",
        "url": "/dianpu-weidian-lanOrder-list",
        "controller": "dianpu-weidian-lanOrder-list"
    })

    //我的微店：号码订单详情
    .state("dianpu-weidian-order-datial", {
        "templateUrl": "templates/dianpu/micro-shop/weidian-order-datial.html",
        "url": "/dianpu-weidian-order-datial",
        "controller": "dianpu-weidian-order-datial"
    })

    //我的微店：ICCID校验
    .state("dianpu-weidian-checkIccid", {
        "templateUrl": "templates/dianpu/micro-shop/weidian-checkIccid.html",
        "url": "/dianpu-weidian-checkIccid",
        "controller": "dianpu-weidian-checkIccid"
    })








    // 扫码订单
    .state("scan-code-order", {
            templateUrl: "templates/dianpu/micro-shop/scanCodeOrder.html",
            url: "/scan-code-order",
            controller: "scan-code-order"
        })
        //扫码订单详情
        .state("scan-code-order-detail", {
            templateUrl: "templates/dianpu/micro-shop/scanCodeOrderDetail.html",
            url: "/scan-code-order-detail/:orderItem",
            controller: "scan-code-order-detail"
        })
        //扫码订单 -办理
        .state("scan-code-manage", {
            templateUrl: "templates/dianpu/micro-shop/scanCodeManage.html",
            url: "/scan-code-manage",
            controller: "scan-code-manage"
        })
        //店铺::分类目录
        .state("dianpu-bss-list", {
            "templateUrl": "templates/dianpu/directory/bss-list.html",
            "url": "/dianpu-bss-list",
            "controller": "index"
        })
        .state("dianpu-cbss-list", {
            "templateUrl": "templates/dianpu/directory/cbss-list.html",
            "url": "/dianpu-cbss-list",
            "controller": "index"
        })
        .state("dianpu-kd-list", {
            "templateUrl": "templates/dianpu/directory/kuandai-list.html",
            "url": "/dianpu-kd-list",
            "controller": "index"
        })
        //宽带共享套餐
        .state("dianpu-kd-share-list", {
            "templateUrl": "templates/dianpu/directory/kuandai-share-list.html",
            "url": "/dianpu-kd-share-list",
            "controller": "index"
        })

    // 操作PC端
    .state("dianpu-pc-operate", {
            "templateUrl": "templates/dianpu/directory/pc-operate.html",
            "url": "/dianpu-pc-operate/:pageTitle",
            "controller": "index"
        })
        //app 开卡排行榜
        .state("app-ranking", {
            "templateUrl": "templates/dianpu/kaika/appstats/app-ranking.html",
            "url": "/app-ranking",
            "controller": "app-ranking"
        })
        //维系老客户
        .state("assert-list", {
            "templateUrl": "templates/dianpu/directory/assert-list.html",
            "url": "/assert-list"
        })
        .state("assert-user", {
            "templateUrl": "templates/dianpu/directory/assert-user.html",
            "url": "/assert-user",
            "controller": "assert-user"
        })
        //4g畅视
        .state("changshi-4g", {
            "templateUrl": "templates/dianpu/directory/changshi4g.html",
            "url": "/changshi-4g/:pageTitle",
            "controller": "index"
        })
        //协同选号
        .state("cooperate-chose-num", {
            "templateUrl": "templates/dianpu/micro-shop/cooperateChoseNum.html",
            "url": "/cooperate-chose-num",
            "controller": "cooperate-chose-num"
        })
        //商务座机列表
        .state("shangwu-zuoji-list", {
            "templateUrl": "templates/dianpu/directory/shangwuzuojiList.html",
            "url": "/shangwu-zuoji-list",
            "controller": "index"
        })

    //订单状态查询
    .state("dianpu-bss-order_queryOrderInfo", {
            "templateUrl": "templates/dianpu/order_queryOrderInfo/bss.html",
            "url": "/dianpu-bss-order_queryOrderInfo",
            "controller": "dianpu-bss-order_queryOrderInfo"
        })
        .state("dianpu-cbss-order_queryOrderInfo", {
            "templateUrl": "templates/dianpu/order_queryOrderInfo/cbss.html",
            "url": "/dianpu-cbss-order_queryOrderInfo",
            "controller": "dianpu-cbss-order_queryOrderInfo"
        })
        //现场写卡
        .state("dianpu-cbss-site-writeCard", {
            "templateUrl": "templates/dianpu/kaika/cbss-siteWriteCard.html",
            "url": "/dianpu-cbss-site-writeCard",
            "controller": "dianpu-cbss-site-writeCard"
        })
        // 身份证开户数确认
        .state("dianpu-cbss_queryUserList", {
            "templateUrl": "templates/dianpu/cbss_queryUserList.html",
            "url": "/dianpu-cbss_queryUserList",
            "controller": "dianpu-cbss_queryUserList"
        })
		// 身份证开户数 - 验证方式
        .state("dianpu-cbss_queryUserList-mode", {
            "templateUrl": "templates/dianpu/cbss_queryUserList-mode.html",
            "url": "/dianpu-cbss_queryUserList-mode",
            "controller": "dianpu-cbss_queryUserList-mode"
        })
        //冰淇淋套餐预约
        .state("dianpu-icecream-combo", {
            "templateUrl": "templates/dianpu/micro-shop/icecreamCombo.html",
            "url": "/dianpu-icecream-combo",
            "controller": "dianpu-icecream-combo"
        })
        // 宽带预约智慧沃家
        .state("dianpu-lan-combo", {
            "templateUrl": "templates/dianpu/micro-shop/lanCombo.html",
            "url": "/dianpu-lan-combo",
            "controller": "dianpu-lan-combo"
        })
        // 钉钉卡预约
        .state("dianpu-nailing-combo", {
            "templateUrl": "templates/dianpu/micro-shop/nailingCombo.html",
            "url": "/dianpu-nailing-combo",
            "controller": "dianpu-nailing-combo"
        })
        // 不限量
        .state("dianpu-Unlimited-combo", {
            "templateUrl": "templates/dianpu/micro-shop/UnlimitedCombo.html",
            "url": "/dianpu-Unlimited-combo",
            "controller": "dianpu-Unlimited-combo"
        })
        // 畅爽56元
        .state("dianpu-cool-combo", {
            "templateUrl": "templates/dianpu/micro-shop/cool56.html",
            "url": "/dianpu-cool-combo",
            "controller": "dianpu-cool-combo"
        })
        // 畅爽119元
        .state("dianpu-cool119-combo", {
            "templateUrl": "templates/dianpu/micro-shop/cool119.html",
            "url": "/dianpu-cool119-combo",
            "controller": "dianpu-cool119-combo"
        })
        // 大王卡
        .state("dianpu-dw-card", {
            "templateUrl": "templates/dianpu/micro-shop/dwCard.html",
            "url": "/dianpu-dw-card",
            "controller": "dianpu-dw-card"
        })
        // 填写信息
        .state("dianpu-fill-info", {
            "templateUrl": "templates/dianpu/micro-shop/fillInfo.html",
            "url": "/dianpu-fill-info/:productName",
            "controller": "dianpu-fill-info"
        })
        // 大王卡预约流程
        .state("dianpu-dw-fill-info", {
            "templateUrl": "templates/dianpu/micro-shop/dwfillInfo.html",
            "url": "/dianpu-dw-fill-info/:num",
            "controller": "dianpu-dw-fill-info"
        })
        // 其他预约流程
        .state("dianpu-lan-fill-info", {
            "templateUrl": "templates/dianpu/micro-shop/lanfillInfo.html",
            "url": "/dianpu-lan-fill-info",
            "controller": "dianpu-lan-fill-info"
        })

    .state("yunying-share-register", {
            "templateUrl": "templates/shareRegister.html",
            "url": "/yunying-share-register",
            "controller": "yunying-share-register"
        })
        // 集客
        .state("dianpu-jike-list", {
            templateUrl: "templates/dianpu/directory/jike-list.html",
            url: "/dianpu-jike-list",
            controller: "index"
        })
        // 集客bss
        .state("dianpu-jike-bssList", {
            templateUrl: "templates/dianpu/directory/jike-bssList.html",
            url: "/dianpu-jike-bssList",
            controller: "index"
        })
        // 集客cbss
        .state("dianpu-jike-cbssList", {
            templateUrl: "templates/dianpu/directory/jike-cbssList.html",
            url: "/dianpu-jike-cbssList",
            controller: "index"
        })

    .state("dianpu-jike-bsslist", {
        templateUrl: "templates/dianpu/directory/jike-bsslist.html",
        url: "/dianpu-jike-list",
        controller: "index"
    })

    .state("dianpu-internet-list", {
            templateUrl: "templates/dianpu/micro-shop/internetList.html",
            url: "/dianpu-internet-list",
            controller: "dianpu-internet-list"
        })
        .state("dianpu-combo-info", {
            templateUrl: "templates/dianpu/micro-shop/dianpuComboInfo.html",
            url: "/dianpu-combo-info/:url",
            controller: "dianpu-combo-info"
        })
        .state("dianpu-microshop-lan-order-Code", {
            templateUrl: "templates/dianpu/micro-shop/lan-order-Code.html",
            url: "dianpu-microshop-lan-order-Code/:orderCode/:payNumber",
            controller: "dianpu-microshop-lan-order-Code"
        })


    // 码上购
    .state("dianpu-qrgo-list", {
            templateUrl: "templates/dianpu/directory/qrgo-list.html",
            url: "/dianpu-qrgo-list"
        })
        .state("dianpu-qrgo-package", {
            templateUrl: "templates/dianpu/qrgo/package.html",
            url: "/dianpu-qrgo-package",
            controller: "dianpu-qrgo-package"
        })
        .state("dianpu-qrgo-number", {
            templateUrl: "templates/dianpu/qrgo/number.html",
            url: "/dianpu-qrgo-number",
            controller: "dianpu-qrgo-number"
        })
        .state("dianpu-qrgo-submitOrder", {
            templateUrl: "templates/dianpu/qrgo/submitOrder.html",
            url: "/dianpu-qrgo-submitOrder",
            controller: "dianpu-qrgo-submitOrder"
        })
        .state("dianpu-qrgo-applyOrder", {
            templateUrl: "templates/dianpu/qrgo/applyOrder.html",
            url: "/dianpu-qrgo-applyOrder",
            controller: "dianpu-qrgo-applyOrder"
        })
        .state("dianpu-qrgo-writesimok", {
            templateUrl: "templates/dianpu/qrgo/writesimok.html",
            url: "/dianpu-qrgo-writesimok",
            controller: "dianpu-qrgo-writesimok"
        })
        // 码上购2
        .state("dianpu-qrgoV2-package", {
            templateUrl: "templates/dianpu/qrgo/package.html",
            url: "/dianpu-qrgoV2-package/:qrgoType",
            controller: "dianpu-qrgoV2-package"
        })
        .state("dianpu-qrgoV2-number", {
            templateUrl: "templates/dianpu/qrgo/number.html",
            url: "/dianpu-qrgoV2-number",
            controller: "dianpu-qrgoV2-number"
        })
        .state("dianpu-qrgoV2-submitOrder", {
            templateUrl: "templates/dianpu/qrgo/submitOrder.html",
            url: "/dianpu-qrgoV2-submitOrder",
            controller: "dianpu-qrgoV2-submitOrder"
        })
        // .state("dianpu-qrgo-applyOrder",{
        // 	  templateUrl:"templates/dianpu/qrgo/applyOrder.html"
        // 	, url:"/dianpu-qrgo-applyOrder"
        // 	, controller:"dianpu-qrgo-applyOrder"
        // })
        .state("dianpu-qrgoV2-writesimok", {
            templateUrl: "templates/dianpu/qrgo/writesimok.html",
            url: "/dianpu-qrgoV2-writesimok",
            controller: "dianpu-qrgoV2-writesimok"
        })
        //现场购
        .state("dianpu-qrgo-now-purchase", {
            templateUrl: "templates/dianpu/qrgo/now-purchase.html",
            url: "/dianpu-qrgo-now-purchase",
            controller: "dianpu-qrgo-now-purchase"
        })


    .state("dianpu-qrgo-protocol-details", {
        templateUrl: "templates/dianpu/qrgo/protocol-details.html",
        url: "/dianpu-qrgo-protocol-details",
        controller: "dianpu-qrgo-protocol-details"
    })



    // 宽带收费
    .state("dianpu-microshop-lan-order-search", {
            templateUrl: "templates/dianpu/micro-shop/lan-order-search.html",
            url: "dianpu-microshop-lan-order-search",
            controller: "dianpu-microshop-lan-order-search"
        })
        // 后置宽带查询
        .state("dianpu-microshop-lan-order-search-hz", {
            templateUrl: "templates/dianpu/micro-shop/lan-order-search-hz.html",
            url: "dianpu-microshop-lan-order-search-hz",
            controller: "dianpu-microshop-lan-order-search-hz"
        })
        // 查询装维人员
        .state("dianpu-microshop-order-redeploy", {
            templateUrl: "templates/dianpu/micro-shop/order-redeploy.html",
            url: "dianpu-microshop-order-redeploy/:orderCode",
            controller: "dianpu-microshop-order-redeploy"
        })
        // 宽带收费明细
        .state("dianpu-microshop-lan-order-pay-detail", {
            templateUrl: "templates/dianpu/micro-shop/lan-order-pay-detail.html",
            url: "dianpu-microshop-lan-order-pay-detail/:orderCode",
            controller: "dianpu-microshop-lan-order-pay-detail"
        })
        // 取消订单原因
        .state("dianpu-microshop-cancel-order-reason", {
            templateUrl: "templates/dianpu/micro-shop/cancel-order-reason.html",
            url: "dianpu-microshop-cancel-order-reason/:orderCode",
            controller: "dianpu-microshop-cancel-order-reason"
        })
        // 物流信息
        .state("dianpu-microshop-shipments-info", {
            templateUrl: "templates/dianpu/micro-shop/shipments-info.html",
            url: "dianpu-microshop-shipments-info/:orderCode",
            controller: "dianpu-microshop-shipments-info"
        })
        //工单池订单
        .state("dianpu-microshop-work-order-list", {
            "templateUrl": "templates/dianpu/micro-shop/work-order-list.html",
            "url": "/dianpu-microshop-work-order-list",
            "controller": "dianpu-microshop-work-order-list"
        })
        //工单池订单详情
        .state("dianpu-microshop-work-order-detail", {
            "templateUrl": "templates/dianpu/micro-shop/work-order-detail.html",
            "url": "/dianpu-microshop-work-order-detail",
            "controller": "dianpu-microshop-work-order-detail"
        })
        //后置宽带订单操作
        .state("dianpu-microshop-lan-order-search-handle", {
            "templateUrl": "templates/dianpu/micro-shop/lan-order-search-handle.html",
            "url": "/dianpu-microshop-lan-order-search-handle",
            "controller": "dianpu-microshop-lan-order-search-handle"
        })

    // 老客户
    .state("dianpu-oldUser-change_order", {
        templateUrl: "templates/dianpu/oldUser/change_order.html",
        url: "dianpu-oldUser-change_order/",
        controller: "dianpu-oldUser-change_order"
    })

    // 老客户
    .state("dianpu-cbss-oldUserInfo", {
        templateUrl: "templates/dianpu/kaika/old-user-info.html",
        url: "dianpu-cbss-oldUserInfo/",
        controller: "dianpu-cbss-oldUserInfo"
    })

};