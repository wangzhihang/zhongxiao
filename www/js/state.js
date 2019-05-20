app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // 缓存
    $ionicConfigProvider.views.maxCache(0);

    dianpuState($stateProvider);
    kuandaiState($stateProvider);
    userState($stateProvider);
    daili($stateProvider);
    jikeState($stateProvider);
    unicommState($stateProvider);

    $stateProvider

        .state('index_dl', {
            url: '/index_dl',
            templateUrl: "templates/indexDaili.html",
            controller: "index_dl"
        })
        .state('index', {
            url: '/index',
            templateUrl: "templates/index.html",
            controller: "index"
        })
        .state('login', {
            url: '/login',
            templateUrl: "templates/user/login.html",
            controller: "login"
        })
        .state('lock', {
            url: '/lock',
            templateUrl: "templates/user/lock.html",
            controller: "lock"
        })
        .state('tel-ok', {
            url: '/tel-ok',
            templateUrl: 'templates/ok.html',
            controller: "tel-ok"
        })


    ///////////////////
    .state('okk', {
            url: '/okk',
            templateUrl: 'templates/ok.html',
            controller: "okk"
        })
        ////////////////////////
        .state("signature", {
            "templateUrl": "templates/signature.html",
            "url": "/signature",
            "controller": "signature"
        })

    .state("ok", {
            "templateUrl": "templates/ok.html",
            "url": "/ok",
            "controller": "ok"
        })
        .state("noNetWork", {
            "templateUrl": "templates/noNetWork.html",
            "url": "/noNetWork",
            "controller": "noNetWork"
        })






    // 身份认证
    .state('authentication-device', {
            url: '/authentication-device/:id',
            templateUrl: 'templates/authentication/identity/device.html',
            controller: 'authentication-device'
        })
        .state('authentication-readIDCard', {
            url: '/authentication-readIDCard',
            templateUrl: 'templates/authentication/identity/readIdCard.html',
            controller: 'authentication-readIDCard'
        })
        .state('authentication-video', {
            url: '/authentication-video',
            templateUrl: 'templates/authentication/identity/video.html',
            controller: 'authentication-video'
        })
        .state('authentication-face', {
            url: '/authentication-face',
            templateUrl: 'templates/authentication/identity/face.html',
            controller: 'authentication-face'
        })
        .state('authentication-contact', {
            url: '/authentication-contact',
            templateUrl: 'templates/authentication/identity/contact.html',
            controller: 'authentication-contact'
        })

    //拍身份证正面
    .state('pho-identy-front', {
        url: '/pho-identy-front',
        templateUrl: 'templates/authentication/identity/phoIdentyFront.html',
        controller: 'pho-identy-front'
    })

    //核对身份证正面信息
    .state('check-fr-info', {
        url: '/check-fr-info',
        templateUrl: 'templates/authentication/identity/checkFrInfo.html',
        controller: 'check-fr-info'
    })

    //拍身份证反面
    .state('pho-identy-oth', {
        url: '/pho-identy-oth',
        templateUrl: 'templates/authentication/identity/phoIdentyOth.html',
        controller: 'pho-identy-oth'
    })

    //核对身份证反面信息
    .state('check-oth-info', {
        url: '/check-oth-info',
        templateUrl: 'templates/authentication/identity/checkOthInfo.html',
        controller: 'check-oth-info'
    })


    //裁剪身份证正面
    .state('cutting-pic', {
        url: '/cutting-pic',
        templateUrl: 'templates/authentication/identity/cuttingPic.html',
        controller: 'cutting-pic'
    })

    /**小工具**/
    //小工具列表
    .state('gadget', {
            url: '/gadget',
            templateUrl: 'templates/gadget/index.html',
            controller: 'gadget'
        })
        //CBSS小工具列表
        .state('gadget-cbss', {
            url: '/gadget-cbss',
            templateUrl: 'templates/gadget/cbss/gadget-list.html',
            controller: 'gadget-cbss'
        })
        //CBSS重置卡
        .state('gadget-cbss-reset-card', {
            url: '/gadget-cbss-reset-card',
            templateUrl: 'templates/gadget/cbss/reset-card.html',
            controller: 'gadget-cbss-reset-card'
        })
        //CBSS返销卡
        .state('gadget-cbss-cancel-card', {
            url: '/gadget-cbss-cancel-card',
            templateUrl: 'templates/gadget/cbss/cancel-card.html',
            controller: 'gadget-cbss-cancel-card'
        })


    // bss 补卡
    .state("dianpu-bss-write-card", {
            "templateUrl": "templates/gadget/bss/write-card.html",
            "url": "/dianpu-bss-write-card",
            "controller": "dianpu-bss-write-card"
        })
        // bss 补缴费
        .state("bss-payfee", {
            "templateUrl": "templates/gadget/bss/payfee.html",
            "url": "/bss-payfee",
            "controller": "bss-payfee"
        })

    //手持身份证拍照
    .state('gadget-photograph', {
            url: '/gadget-photograph',
            templateUrl: 'templates/gadget/public/photograph.html',
            controller: 'gadget-photograph'
        })
        // 电子发票
        .state('gadget-cbss-invoice', {
            url: '/gadget-cbss-invoice',
            templateUrl: 'templates/gadget/cbss/invoice.html',
            controller: 'gadget-cbss-invoice'
        })
        // 我的付款码
        .state('gadget-myPaymentQr', {
            url: '/gadget-myPaymentQr',
            templateUrl: 'templates/gadget/myPaymentQr.html',
            controller: 'gadget-myPaymentQr'
        })


    $urlRouterProvider.otherwise('/login');
})