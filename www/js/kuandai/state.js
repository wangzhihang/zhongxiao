function kuandaiState(_this) {

    _this

       //组合宽带
        // .state("kuandai-wojia-order-confirm", {
        // 	  "templateUrl":"templates/kuandai/wojia/combination-submit-order-confirm.html"
        // 	, "url":"/kuandai-wojia-order-confirm"
        // 	, "controller":"kuandai-wojia-order-confirm"
        // })
    .state("kuandai-wojia-order-confirm", {
        "templateUrl": "templates/kuandai/wojia/submit-order-confirm.html",
        "url": "/kuandai-wojia-order-confirm",
        "controller": "kuandai-wojia-order-confirm"
    })
    .state("kuandai-handle-kuandai", {
        "templateUrl": "templates/kuandai/wojia/handle-kuandai.html",
        "url": "/kuandai-handle-kuandai",
        "controller": "kuandai-handle-kuandai"
    })
    .state("kuandai-wojia-combination-add-two", {
        "templateUrl": "templates/kuandai/wojia/combination/add_two.html",
        "url": "/kuandai-wojia-combination-add-two",
        "controller": "kuandai-wojia-combination-add-two"
    })

    // 智慧沃家 共用部分
    // 地址预判
    .state("kuandai-wojia-address-area", {
        "templateUrl": "templates/kuandai/wojia/address-area.html",
        "url": "/kuandai-wojia-address-area",
        "controller": "kuandai-wojia-address-area"
    })
    .state("kuandai-wojia-address-detailed", {
        "templateUrl": "templates/kuandai/wojia/address-detailed.html",
        "url": "/kuandai-wojia-address-detailed",
        "controller": "kuandai-wojia-address-detailed"
    })
    // 设备
    .state("kuandai-wojia-select-terminals", {
        "templateUrl": "templates/kuandai/wojia/submit-select-terminals.html",
        "url": "/kuandai-wojia-select-terminals",
        "controller": "kuandai-wojia-select-terminals"
    })
    // 到期处理方式
    .state("kuandai-wojia-iptvinfo", {
        "templateUrl": "templates/kuandai/wojia/iptvinfo.html",
        "url": "/kuandai-wojia-iptvinfo",
        "controller": "kuandai-wojia-iptvinfo"
    })
    // 提交
    .state("kuandai-submit-wojia", {
        "templateUrl": "templates/kuandai/wojia/submit.html",
        "url": "/kuandai-submit-wojia",
        "controller": "kuandai-submit-wojia"
    })


    //沃家宽带号码区
    .state("kuandai-wojia-number-selected", {
        "templateUrl": "templates/kuandai/wojia/number-selected.html",
        "url": "/kuandai-wojia-number-selected",
        "controller": "kuandai-wojia-number-selected"
    })
    .state("kuandai-wojia-number-into", {
        "templateUrl": "templates/kuandai/wojia/number-into.html",
        "url": "/kuandai-wojia-number-into",
        "controller": "kuandai-wojia-number-into"
    })
    // 暂不支持换套餐
    // .state("kuandai-wojia-number-getOldUserProductList", {
    //     "templateUrl": "templates/kuandai/wojia/number-into.html",
    //     "url": "/kuandai-wojia-number-getOldUserProductList",
    //     "controller": "kuandai-wojia-number-getOldUserProductList"
    // })
    .state("kuandai-wojia-number-read-write-card", {
        "templateUrl": "templates/kuandai/wojia/number-read-card.html",
        "url": "/kuandai-wojia-number-read-write-card",
        "controller": "kuandai-wojia-number-read-write-card"
    })


    // 沃家宽带号码套餐
    .state("kuandai-wojia-combination-package-tel-list", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tel-list.html",
        "url": "/kuandai-wojia-combination-package-tel-list",
        "controller": "kuandai-wojia-combination-package-tel-list"
    })
    // 纳入套餐
    .state("kuandai-wojia-combination-package-tel-list-into", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tel-list.html",
        "url": "/kuandai-wojia-combination-package-tel-list-into",
        "controller": "kuandai-wojia-combination-package-tel-list-into"
    })
    .state("kuandai-wojia-combination-package-tel-result", {
        "templateUrl": "templates/dianpu/kaika/cbbs-package-result.html",
        "url": "/kuandai-wojia-combination-package-tel-result",
        "controller": "kuandai-wojia-combination-package-tel-result"
    })
    .state("kuandai-wojia-combination-package-tel-service", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tel-service.html",
        "url": "/kuandai-wojia-combination-package-tel-service",
        "controller": "kuandai-wojia-combination-package-tel-service"
    })
    .state("kuandai-wojia-combination-package-activity-selected", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tel-activity-selected.html",
        "url": "/kuandai-wojia-combination-package-activity-selected",
        "controller": "kuandai-wojia-combination-package-activity-selected"
    })
    .state("kuandai-wojia-combination-package-tel-phoneGiveFee", {
        "templateUrl": "templates/kuandai/wojia/combination/phoneGiveFee.html",
        "url": "/kuandai-wojia-combination-package-tel-phoneGiveFee",
        "controller": "kuandai-wojia-combination-package-tel-phoneGiveFee"
    })
    .state("kuandai-wojia-combination-package-tel-phoneGiveFee-phoneList", {
        "templateUrl": "templates/kuandai/wojia/combination/phoneGiveFee-phoneList.html",
        "url": "/kuandai-wojia-combination-package-tel-phoneGiveFee-phoneList",
        "controller": "kuandai-wojia-combination-package-tel-phoneGiveFee-phoneList"
    })
    .state("kuandai-wojia-combination-package-tel-phoneGiveFee-activity", {
        "templateUrl": "templates/kuandai/wojia/combination/phoneGiveFee-activity.html",
        "url": "/kuandai-wojia-combination-package-tel-phoneGiveFee-activity",
        "controller": "kuandai-wojia-combination-package-tel-phoneGiveFee-activity"
    })
    .state("kuandai-wojia-combination-package-tel-activity", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tel-activity.html",
        "url": "/kuandai-wojia-combination-package-tel-activity",
        "controller": "kuandai-wojia-combination-package-tel-activity"
    })

    // 宽带套餐
    .state("kuandai-wojia-combination-package-lan-list", {
        "templateUrl": "templates/kuandai/wojia/combination/package-lan-list.html",
        "url": "/kuandai-wojia-combination-package-lan-list",
        "controller": "kuandai-wojia-combination-package-lan-list"
    })
    .state("kuandai-wojia-combination-package-lan-detail", {
        "templateUrl": "templates/kuandai/wojia/combination/package-lan-detail.html",
        "url": "/kuandai-wojia-combination-package-lan-detail",
        "controller": "kuandai-wojia-combination-package-lan-detail"
    })
    .state("kuandai-wojia-combination-package-lan-tv", {
        "templateUrl": "templates/kuandai/wojia/combination/package-tv.html",
        "url": "/kuandai-wojia-combination-package-lan-tv",
        "controller": "kuandai-wojia-combination-package-lan-tv"
    })
    .state("kuandai-wojia-combination-activity", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-activity.html",
        "url": "/kuandai-wojia-combination-activity",
        "controller": "kuandai-wojia-combination-activity"
    })


    //     // 56 88 冰激凌套餐
    //     .state("kuandai-wojia-combination-package-tel-customized", {
    //         "templateUrl": "templates/kuandai/wojia/combination/package-tel-customized.html",
    //         "url": "/kuandai-wojia-combination-package-tel-customized",
    //         "controller": "kuandai-wojia-combination-package-tel-customized"
    //     })

    // 共享套餐部分
    .state("kuandai-wojia-ronghe-package-index", {
        "templateUrl": "templates/kuandai/wojia/ronghe/package-index.html",
        "url": "/kuandai-wojia-ronghe-package-index",
        "controller": "kuandai-wojia-ronghe-package-index"
    })
    .state("kuandai-wojia-ronghe-package-detail", {
        "templateUrl": "templates/kuandai/wojia/ronghe/package-detail.html",
        "url": "/kuandai-wojia-ronghe-package-detail",
        "controller": "kuandai-wojia-ronghe-package-detail"
    })


    // .state("kuandai-wojia-ronghe-package-list", {
    // 	  "templateUrl":"templates/kuandai/wojia/ronghe/package-list.html"
    // 	, "url":"/kuandai-wojia-ronghe-package-list"
    // 	, "controller":"kuandai-wojia-ronghe-package-list"
    // })
    // .state("kuandai-wojia-ronghe-lan-detail", {
    // 	  "templateUrl":"templates/kuandai/wojia/ronghe/lan-detail.html"
    // 	, "url":"/kuandai-wojia-ronghe-lan-detail"
    // 	, "controller":"kuandai-wojia-ronghe-lan-detail"
    // })
    .state("kuandai-wojia-ronghe-lan-flow", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-flow.html",
        "url": "/kuandai-wojia-ronghe-lan-flow",
        "controller": "kuandai-wojia-ronghe-lan-flow"
    })
    .state("kuandai-wojia-ronghe-lan-voice", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-voice.html",
        "url": "/kuandai-wojia-ronghe-lan-voice",
        "controller": "kuandai-wojia-ronghe-lan-voice"
    })
    .state("kuandai-wojia-ronghe-lan-SMS", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-SMS.html",
        "url": "/kuandai-wojia-ronghe-lan-SMS",
        "controller": "kuandai-wojia-ronghe-lan-SMS"
    })
    .state("kuandai-wojia-ronghe-1-5G", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-1-5g.html",
        "url": "/kuandai-wojia-ronghe-1-5G",
        "controller": "kuandai-wojia-ronghe-1-5G"
    })
    .state("kuandai-wojia-ronghe-tv", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-tv.html",
        "url": "/kuandai-wojia-ronghe-tv",
        "controller": "kuandai-wojia-ronghe-tv"
    })
    .state("kuandai-wojia-ronghe-activity", {
        "templateUrl": "templates/kuandai/wojia/ronghe/lan-activity.html",
        "url": "/kuandai-wojia-ronghe-activity",
        "controller": "kuandai-wojia-ronghe-activity"
    })




    // BSS单宽
    // .state("kuandai-bss-lan-address-area", {
    //         "templateUrl": "templates/kuandai/bss-lan/address-area.html",
    //         "url": "/kuandai-bss-lan-address-area",
    //         "controller": "kuandai-bss-lan-address-area"
    //     })
    //     .state("kuandai-bss-lan-address-detailed", {
    //         "templateUrl": "templates/kuandai/bss-lan/address-detailed.html",
    //         "url": "/kuandai-bss-lan-address-detailed",
    //         "controller": "kuandai-bss-lan-address-detailed"
    //     })
    //     .state("kuandai-bss-lan-lan_getinnetmethod", {
    //         "templateUrl": "templates/kuandai/bss-lan/access-mode.html",
    //         "url": "/kuandai-bss-lan-lan_getinnetmethod",
    //         "controller": "kuandai-bss-lan-lan_getinnetmethod"
    //     })
    //     .state("kuandai-bss-lan-number-area", {
    //         "templateUrl": "templates/kuandai/bss-lan/number-area.html",
    //         "url": "/kuandai-bss-lan-number-area",
    //         "controller": "kuandai-bss-lan-number-area"
    //     })
    //     .state("kuandai-bss-lan-number-list", {
    //         "templateUrl": "templates/kuandai/bss-lan/number-list.html",
    //         "url": "/kuandai-bss-lan-number-list",
    //         "controller": "kuandai-bss-lan-number-list"
    //     })
    //     .state("kuandai-bss-lan-getLanType", {
    //         "templateUrl": "templates/kuandai/bss-lan/getLanType.html",
    //         "url": "/kuandai-bss-lan-getLanType",
    //         "controller": "kuandai-bss-lan-getLanType"
    //     })
    //     .state("kuandai-bss-lan-getAreaTownInfo", {
    //         "templateUrl": "templates/kuandai/bss-lan/getAreaTownInfo.html",
    //         "url": "/kuandai-bss-lan-getAreaTownInfo",
    //         "controller": "kuandai-bss-lan-getAreaTownInfo"
    //     })
    //     .state("kuandai-bss-lan-product-list", {
    //         "templateUrl": "templates/kuandai/bss-lan/product-list.html",
    //         "url": "/kuandai-bss-lan-product-list",
    //         "controller": "kuandai-bss-lan-product-list"
    //     })
    //     .state("kuandai-bss-lan-develop-dealer", {
    //         "templateUrl": "templates/kuandai/bss-lan/develop-dealer.html",
    //         "url": "/kuandai-bss-lan-develop-dealer",
    //         "controller": "kuandai-bss-lan-develop-dealer"
    //     })
    //     .state("kuandai-bss-lan-select-equipment", {
    //         "templateUrl": "templates/kuandai/bss-lan/select-equipment.html",
    //         "url": "/kuandai-bss-lan-select-equipment",
    //         "controller": "kuandai-bss-lan-select-equipment"
    //     })
    //     .state("kuandai-bss-lan-confirmOrder", {
    //         "templateUrl": "templates/kuandai/bss-lan/submit-confirm.html",
    //         "url": "/kuandai-bss-lan-confirmOrder",
    //         "controller": "kuandai-bss-lan-confirmOrder"
    //     })
    //     .state("kuandai-bss-lan-submitOrder", {
    //         "templateUrl": "templates/kuandai/bss-lan/submit.html",
    //         "url": "/kuandai-bss-lan-submitOrder",
    //         "controller": "kuandai-bss-lan-submitOrder"
    //     })

    // CBSS单宽
    .state("kuandai-cbss-SingleLan-list", {
        "templateUrl": "templates/kuandai/wojia/combination/package-lan-list.html",
        "url": "/kuandai-cbss-SingleLan-list",
        "controller": "kuandai-cbss-SingleLan-list"
    })
    .state("kuandai-cbss-SingleLan-detail", {
        "templateUrl": "templates/kuandai/wojia/combination/package-lan-detail.html",
        "url": "/kuandai-cbss-SingleLan-detail",
        "controller": "kuandai-cbss-SingleLan-detail"
    })
    .state("kuandai-cbss-SingleLan-service", {
        "templateUrl": "templates/kuandai/wojia/combination/package-SingleLan-service.html",
        "url": "/kuandai-cbss-SingleLan-service",
        "controller": "kuandai-cbss-SingleLan-service"
    })
    // .state("kuandai-cbss-single-order-confirm", {
    //     "templateUrl": "templates/kuandai/wojia/single-submit-order-confirm.html",
    //     "url": "/kuandai-cbss-single-order-confirm",
    //     "controller": "kuandai-cbss-single-order-confirm"
    // })
    .state("kuandai-cbss-submit-singleLan", {
        "templateUrl": "templates/kuandai/wojia/submit.html",
        "url": "/kuandai-cbss-submit-singleLan",
        "controller": "kuandai-cbss-submit-singleLan"
    })
    // 王卡宽带
    .state("kuandai-cbss-SingleLan-wk", {
        "templateUrl": "templates/dianpu/dealerreturn/bss/index.html",
        "url": "/kuandai-cbss-SingleLan-wk",
        "controller": "kuandai-cbss-SingleLan-wk"
    })
};