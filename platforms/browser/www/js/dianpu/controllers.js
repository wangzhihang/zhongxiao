var controllersfile = [

    "number/cbss-number-package"
    ,"number/cbss-oldUserInfo"
    , "number/cbss-phoneGiveFee" // 购机赠费活动
    , "number/cbss-write-sim", "number/cbss-fukaInfo", "number/cbss-changshi-imei", "number/cbss-protocol-details" //CBSS入网协议
    , "number/cbss-siteWriteCard" // 现场写卡
    // , "number/bss-number-package"
    // , "number/bss-write-sim"
    , "number/pstn", "number/cbss-write-sim-card" //cbss单页面写卡

    , "number/semiManufactures-sim" // 半程卡 先读SIM卡

    , "dealerreturn/bss" // bss成卡返单
    , "dealerreturn/cbss" // cbss成卡返单

    , "recharge/number-recharge" // 充值

    , "microShop/microShop" // 微店
    , "microShop/myShop" // 我的微店
    , "microShop/weiDian" // 我的微店：我的微店
    , "microShop/lanOrderList" // 我的微店：宽带预存订单
    , "microShop/hmBusiness" // 我的微店：号码业务
    , "microShop/lanBusiness" // 我的微店：宽带业务
    , "microShop/myCode" // 我的微店：我的二维码
    , "microShop/bssList" // 我的微店：BSS业务
    , "microShop/cbssList" // 我的微店：CBSS业务


    // , "microShop/iceCream"	// 我的微店：冰激凌系列
    // , "microShop/newBroadband"	// 我的微店：新装宽带
    // , "microShop/giveBroadband"	// 我的微店：送宽带
    , "microShop/seriesProduct" // 我的微店：系列产品
    , "microShop/seriesOrder" // 我的微店：系列产品预约



    , "microShop/weidian-amount" // 我的微店：我的佣金列表
    , "microShop/weidian-numberorder-list" // 我的微店：号码订单
    , "microShop/weidian-lanOrder-list" // 我的微店：宽带订单
    , "microShop/weidian-order-datial" // 我的微店：号码-订单详情
    , "microShop/weidian-checkIccid" // 我的微店：ICCID校验


    , "microShop/lanOrderDetail" // 我的微店：预约订单详情
    , "microShop/wxStatistical" // 我的微店：微店统计
    , "microShop/cooperateChoseNum" // 协同选号
    , "microShop/otherAccept" // 异业受理
    , "microShop/otherAcceptDetail" // 异业受理
    , "microShop/UnlimitedCombo" // 不限量套餐
    , "microShop/cool56" // 畅爽56元
    , "microShop/cool119" // 畅爽119元
    , "microShop/dwCard" // 大王卡
    , "microShop/fillInfo" // 填写信息
    , "microShop/dwfillInfo" // 大王卡预约流程
    , "microShop/lanfillInfo" // 其他预约流程
    , "microShop/scanCodeOrder", "microShop/scanCodeOrderDetail", "microShop/scanCodeManage", "microShop/lan-order-search" //宽带收费
    , "microShop/lan-order-search-hz" // 宽带后置
    , "microShop/order-redeploy" // 查询装维人员信息
    , "microShop/work-order-list" // 查询装维人员信息
    , "microShop/work-order-detail" // 查询装维人员信息
    , "microShop/lan-order-search-handle" // 宽带后置操作

    , "app-ranking" // app开卡排行榜
    , "assert-user" // 老客户维系
    , "order_queryOrderInfo" // 订单状态查询
    , "microShop/icecreamCombo" //冰淇淋套餐预约
    , "microShop/lanCombo" // 宽带预约智慧沃家
    , "microShop/nailingCombo" // 宽带预约智慧沃家

    , "shareRegister", "microShop/internetList" // 互联网订单
    , "microShop/guideNetworkFlowOrder" // 互联网订单->引流订单
    , "microShop/guideNetworkFlowOrderDetails" // 互联网订单->引流订单详情
    , "microShop/synergyNetworkOrder" // 互联网订单->异业订单
    , "microShop/synergyNetworkOrderDetails" // 互联网订单->异业订单详情
    , "microShop/dianpuComboInfo" // 套餐详情
    , "microShop/lan-order-Code" // 套餐详情
    , "microShop/lan-order-pay-detail" // 宽带收费明细
    , "microShop/cancel-order-reason" // 取消订单原因
    , "microShop/shipments-info" // 物流信息
    , "qrgo/number", "qrgo/product", "qrgo/submitOrder", "qrgo/writesimok"


    , "qrgov2/number", "qrgov2/product", "qrgov2/submitOrder", "qrgov2/writesimok"

    , "qrgov2/now-purchase" //现场购

    , "qrgov2/protocol-details"

    , "oldUser/change-order", "cbss_queryUserList"

];

for (var i in controllersfile) {
    document.write('<script type="text/javascript" src="js/dianpu/controllers/' + controllersfile[i] + '.js"></script>');
}