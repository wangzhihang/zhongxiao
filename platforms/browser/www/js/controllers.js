var controllersfile = [

    "index"
    , "indexDaili"
    , "authentication/identity"
    // ,"authentication/cuttingFrontPic"
    , "authentication/cuttingOthPic"
    // , "signature-dianpu"
    // , "signature-dianpu"
    // , "ok-kuandai"
    // , "ok-tel"




    //业务分类

    , "bussniess-type"



    , "signature"
    , "ok"
    , "noNetWork"


    // ,"number-list"
    // ,"number-filter"

    , "systemState"

    , "user/login"
    , "user/lock"
    , "user/user-center"
    , "user/user-account"
    , "user/kd-order-list"
    ,"user/kd-order-detail"
    , "user/uc-set"
    , "user/user-profile"
    , "user/security-center"
    , "user/change-password"
    , "user/bind-tel"
    , "user/about-us"
    , "user/online-service"
    , "user/contact-us"
    , "user/agencyInfo"
    , "user/commission"
    , "user/pay-password"
    , "user/number-order-list"
    , "user/number-order-detail"
    , "user/tel-fare-order"
    , "user/ordered-order-list"
    , "user/ordered-order-detail"
    , "user/grapOrder"
    , "user/grapOrderDetail"
    , "user/grapOrderManage"
    , "user/grapOrderLanBusiness"
    , "user/newsInform"
    , "user/newsList"
    , "gadget/gadget"
    , "gadget/cbss/gadget-cbss"
    , "gadget/bss/bss-payfee"
    , "gadget/bss/bss-write-card"
    , "gadget/cbss-invoice"

    , "gadget/public/photograph" //手持身份证拍照

    , "user/new-order-list"
    , "user/more-messages-list"


    , "user/dwIndex"
    , "user/dwInfo"
    , "user/dwIccid"

    , "user/order-managements"
    , "user/fix-phone"
    , "user/fix-phone-detail"

    , "user/UnicomMallLanOrderForUser"
    , "user/UnicomMallLanOrder"
    , "user/UnicomMallLanOrderDetail"
    , "user/UnicomMallLanOrderCancle"
    , "user/dianpuInfo"
    , "user/UnicomOrder"
    , "user/UnicomOrderForUser"
    , "user/resetPassword"
    , "user/dianpu-card"
    , "user/helper-center"
    , "user/helper-problem-list"
    , "user/helper-search-keyword"
    , "user/helper-advice-feedback"
    , "user/helper-problem-detail"
    , "user/search"
    , "user/huabei-register"
    , "user/huabei-register-step"
    , "user/huabei-charge" //花呗分期收费
    , "user/cumulate-income" //累计收益
    , "user/visitor-detial" //访客详情
    , "user/breathe-SIM-classify" //外呼SIM
    , "user/breathe-SIM-submit" //外呼SIM卡信息提交
    , "user/breathe-SIM-send" //外呼SIM卡派送
    , "user/balance-withdrawal" //余额提现



    , "market/marketAddNewAdds"
    , "market/marketAdds"
    , "market/marketBag"
    , "market/marketFailPay"
    , "market/marketGoods"
    , "market/marketIndex"
    , "market/marketLists"
    , "market/marketLogistics"
    , "market/marketMyord"
    , "market/marketOkPay"
    , "market/marketOrd"
    , "market/marketOrdInfo"
    , "market/marketSearch"
    , "market/marketType"
    , "market/marketEval"
    , "market/marketEvalGoods"
    , "market/marketEvalOk"
    , "market/shopping-card"

    , "visit/resure-My-Orders"
    , "visit/plan-travel-route"
    , "visit/gohome-order-detial"
    , "visit/transfer-order"
    , "visit/reserve-gohome-dealCard"



];

for (var i in controllersfile) {
    document.write('<script type="text/javascript" src="js/controllers/' + controllersfile[i] + '.js"></script>');
}