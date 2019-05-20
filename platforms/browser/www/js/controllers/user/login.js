appControllers.controller('login', function($scope, $rootScope, $state, $http, unicomm_server, LoginService, my) {

    $scope.title = "中国联通" + appName;
    $scope.data = { "userName": "", "password": "", "login_pattern": "" };
    $scope.loading = false;
    $scope.resState = true;
    $scope.txtVal = "立即登录";
    $scope.version = version;
    $scope.loginUser = null;
    $scope.lockPatternTipsSwitch = true;
    var lock = null;
    $scope.openId = null;
    $rootScope.isShowsetTab = true;
    $rootScope.developIsHide = false;
    $scope.date = new Date();
    $scope.tag = {
        current: "0"
    };
    $scope.otherType = true;
    $scope.actions = {
        setCurrent: function(param) {
            $scope.tag.current = param;
            if ($scope.tag.current == '2') {
                $scope.noSetLockPattern = true;
            } else {
                $scope.noSetLockPattern = false;
                if (JSON.parse(localStorage.getItem('login')).login_pattern == "" || JSON.parse(localStorage.getItem('login')).login_pattern == undefined) {
                    $scope.showLoginPattern = false;
                } else {
                    $scope.showLoginPattern = true;
                }
            }
        }
    };
    if (localStorage.getItem('loginUserType') == '000002') {
        $scope.loginHeadImg = 'img/daili.png';
    } else if (localStorage.getItem('loginUserType') == '000003') {
        $scope.loginHeadImg = 'img/yewu.png';
    } else if (localStorage.getItem('loginUserType') == '000005') {
        $scope.loginHeadImg = 'img/dianpu.png';
    } else {
        $scope.loginHeadImg = 'img/l.png';
    }
    if (localStorage.getItem('login')) {
        if (JSON.parse(localStorage.getItem('login')).login_pattern == "" || JSON.parse(localStorage.getItem('login')).login_pattern == undefined) {
            $scope.showLoginPattern = false;
        } else {
            $scope.showLoginPattern = true;
        }
    } else {
        $scope.showLoginPattern = false;
    }

    $scope.lockPatternTips = "请输入手势密码";
    //密码显示出来
    $scope.showPwdText = false;
    $scope.PwdText = function() {
        $scope.showPwdText = true;
    }
    $scope.hidePwdText = function() {
        $scope.showPwdText = false;
    }

    // $scope.queryVersion = function()
    // {
    // 	var u = navigator.userAgent;
    // 	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // 	$http({
    // 			method:'get',
    // 			url:ajaxurl + 'appVersion/queryAppVersionByAppName',
    // 			params:{"appName":'zx_app', "appType":(isAndroid == true ? "android" : "ios")}
    // 	}).success(function(data){
    // 		var localVersion = localStorage.getItem("localVersion");
    // 		if(!(data.result.appVersion == version || data.result.appVersion == localVersion)){
    // 			if(data.result.status == "000002" || data.result.appLowVersion != localVersion){
    // 				my.alert(data.result.updateContent, "版本更新提示", "更新版本").then(function(){
    // 					$scope.upVersion(data.result)
    // 				})
    // 			}else{
    // 				my.confirm(data.result.updateContent, "版本更新提示", "更新版本", "暂不更新").then(function(){
    // 					$scope.upVersion(data.result)
    // 				}, function(){
    // 					localStorage.setItem("localVersion", data.result.appVersion);
    // 				})
    // 			}
    // 		}else{

    // 		}
    // 	})
    // }
    // $scope.queryVersion();

    // 版本更新
    $scope.upVersion = function(data) {
        my.loaddingShow('版本更新中');
        chcp.fetchUpdate(function(error) {
            if (error) {
                my.loaddingHide();
                return;
            }
            localStorage.setItem("localVersion", data.appVersion);
            chcp.installUpdate();
        }, { 'config-file': data.url });
    }


    // 手势解锁 显示状态
    $scope.patternBox = function() {

        $scope.loginHistory = localStorage.getItem("login");
        if ($scope.loginHistory != null) {
            $scope.loginHistory = JSON.parse($scope.loginHistory);
            if ($scope.loginHistory.login_pattern) {
                $scope.tag = {
                    current: "2"
                };
                $scope.noSetLockPattern = true;
                lock = new PatternLock('#lockPattern_login', {
                    onDraw: function(pattern) {
                        LoginService.checkLoginPattern(pattern).success(function(data) {
                            //lock.reset();
                            $scope.data = $scope.loginHistory;
                            // 登录前状态
                            $scope.errorTips = false;
                            $scope.lockPatternTips = "密码正确，正在登录...";
                            $scope.login();
                        }).error(function(data) {
                            lock.error();
                            lock.reset();
                            $scope.lockPatternTips = "手势密码错误，请重新输入！";
                            $scope.lockPatternTipsSwitch = true;
                            $scope.errorTips = true;
                        });
                    }
                });

            } else {
                $scope.tag = {
                    current: "1"
                };
                $scope.noSetLockPattern = false;
            }
        } else {
            $scope.loginHistory = {};
            $scope.tag = {
                current: "1"
            };
            $scope.noSetLockPattern = false;
        }
    }
    $scope.patternBox();



    $scope.changeBtn = function() {
        $scope.data.userName = $scope.data.userName.toLowerCase().replace(/[^a-z0-9]/g, "");
        if ($scope.data.userName == '' || $scope.data.password == '') {
            $scope.resState = true;
        } else {
            $scope.resState = false;
        }
    }

    $scope.workerJudgment = function() {
        if (return_json.userInfo.userType == "000003") {
            $rootScope.login_dl();
        } else {
            $scope.login();
        }
    }

    $scope.login = function() {
        // if(["a", "b", "c"].indexOf($scope.data.userName.substring(0,1) ) === -1){
        // 	my.alert("用户名错误，登录账号为：<br>字母[a|b|c]+手机号码")
        // 	// return ;
        // }
        //
        if ($scope.data.userName.length == 12 && ["a", "b", "c"].indexOf($scope.data.userName.substring(0, 1)) !== -1) {
            $scope.data.userName = $scope.data.userName.replace(/[^0-9]/g, "")
        }
        $scope.loading = true;
        $scope.otherType = false;
        $scope.resState = true;
        $scope.txtVal = "正在登录";
        $scope.loginLoading = true;
        $scope.loginHttp();
    }


    $scope.loginHttp = function() {
        $http({
            method: 'POST',
            url: ajaxurl + 'userApp/loginForAgency',
            data: { "userName": $scope.data.userName, "password": $scope.data.password }
        }).success(function(return_json) {
            //console.log("登录=="+JSON.stringify(return_json));
            //保存代理登录信息
            if (return_json.result == "success") {
                $rootScope.signInData = { "userName": $scope.data.userName, "password": $scope.data.password };
                if (Number($scope.data.userName.substring(1)) === Number($scope.data.password)) {
                    my.alert('您的密码是初始密码，为了保证您的账号安全。建议您登录成功后：<br>在底部菜单"我的"中顶部的"设置"中修改登录密码!');
                }
                $scope.logoSuccess(return_json);
            } else {
                $scope.LoginError(return_json["msg"])
            }
        }).error(function(data) {
            $scope.LoginError('登录连接服务器无返回信息!')
        });
    }

    //微信登录
    $scope.wxLogin = function() {
            cordova.plugins.wxLoginPlugin.sendAuthRequest(function(code) {
                // console.log(code);
                $http({
                    method: 'GET',
                    url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
                    params: {
                        "appid": "wxab73944d08b342cf",
                        "secret": "b572ae5b41d191b8ad32e1b6e18197a3",
                        "code": code,
                        "grant_type": "authorization_code"
                    }
                }).success(function(return_json) {
                    // console.log(return_json);
                    $scope.openId = return_json.openid;
                    $scope.isHasBindingWX($scope.openId);
                }).error(function(data) {});
            }, function(error) {});
        }
        //判断是否有绑定微信
    $scope.isHasBindingWX = function(openId) {
        $http({
            method: 'get',
            url: ajaxurl + 'userApp/checkUserByWeixinOpenId',
            params: { openId: openId }
        }).success(function(data) {
            if (data) {
                $scope.weixinLogin(openId);
            } else {
                my.alert('您的微信还未与号码之家账号绑定，请先登录，在"我的——绑定微信"里面进行微信绑定。');
            }
        }).error(function() {

        });
    }

    $scope.weixinLogin = function(openId) {
        $http({
            method: 'POST',
            url: ajaxurl + 'userApp/loginAppByWeiXin',
            data: {
                "openId": openId
            }
        }).success(function(return_json) {
            $scope.logoSuccess(return_json);
        }).error(function(data) {
            $scope.LoginError(return_json["msg"])
        });
    }

    $scope.appFuncList = function(return_json) {
        appFuncListShow = {};
        appFuncListRx = [];
        if (return_json.appFuncList) {
            for (var i = return_json.appFuncList.length - 1; i >= 0; i--) {
                for (var ii = return_json.appFuncList[i]["appList"].length - 1; ii >= 0; ii--) {
                    if (return_json.appFuncList[i]["appList"][ii].isSelect) {
                        if (return_json.appFuncList[i].funcCode == "RX0000") {
                            appFuncListRx.push(JSON.parse(return_json.appFuncList[i]["appList"][ii].remark));
                        } else {
                            appFuncListShow[return_json.appFuncList[i]["appList"][ii].funcCode] = true;
                        }
                    }
                }
            }
        }
    }

    $scope.bss2cbss = function(return_json) {
        bssInfo = {}
        cbssInfo = {}
        if (return_json.bssInfo || return_json.cbssInfo) {
            if (return_json.bssInfo) {
                bssInfo = {
                    "username": return_json.bssInfo.userName,
                    "password": return_json.bssInfo.password
                        // 发展人
                        ,
                    "developCode": return_json.bssInfo.developCode,
                    "developName": return_json.bssInfo.developName == null ? "" : return_json.bssInfo.developName
                        // 渠道 dealer
                        ,
                    "channelCode": return_json.bssInfo.channelCode,
                    "channelName": return_json.bssInfo.channelName == null ? "" : return_json.bssInfo.channelName
                };
            }
            if (return_json.cbssInfo) {
                cbssInfo = {
                    "username": return_json.cbssInfo.userName,
                    "password": return_json.cbssInfo.password,
                    "orgno": return_json.cbssInfo.province
                        // 发展人
                        ,
                    "developCode": return_json.cbssInfo.developCode,
                    "developName": return_json.cbssInfo.developName
                        // 渠道
                        ,
                    "channelCode": return_json.cbssInfo.channelCode,
                    "channelName": return_json.cbssInfo.channelName

                    ,
                    "ifTest": return_json.cbssInfo.ifTest == "000001",
                    "id": return_json.cbssInfo.id
                };
            }


            if (return_json.defaultBss) {
                bssInfoHaoma = {
                    "username": return_json.defaultBss.userName,
                    "password": return_json.defaultBss.password
                }
            }

        } else {
            if (appFuncListShow["000204"] || appFuncListShow["000205"]) {
                my.alert("您的账号没有绑定有有效的BSS和CBSS账号和发展人,无法使用APP的功能!");
            }
        }
    }

    $scope.loginAuthority = function(return_json) {
        if (userBo.userType == "000005") {
            $rootScope.isLogin = true;
            $scope.loginUser = userBo.userType;
        } else {
            $rootScope.orderCntToday = return_json.orderCntToday;
            $rootScope.orderCntThisMon = return_json.orderCntThisMon;
            $rootScope.shopCount = return_json.shopCount;
            $rootScope.loginShopCnt = return_json.loginShopCnt;
            $rootScope.opLogList = [];
            $rootScope.noticeList = [];
            $rootScope.orderList = [];
            if (userBo.userType == "000003") {
                $rootScope.isShowsetTab = false;
                $rootScope.developIsHide = true;
                if (userBo.headImgUrl == "" || userBo.headImgUrl == null) {
                    $rootScope.headImg = false;
                } else {
                    $rootScope.headImg = true;
                }
                //测试版预先存储下来
                localStorage.setItem('userId', JSON.stringify(userBo.userId));
            } else {
                $rootScope.isShowsetTab = false;
                $rootScope.developIsHide = false;
            }
        }

    }

    $scope.logoSuccess = function(return_json) {
        reset_login();
        //账户信息
        accountInfo = return_json.accountInfo;
        userBo = return_json.userInfo;
        deptInfo = return_json.deptInfo;
        localStorage.setItem('loginUserType', return_json.userInfo.userType);

        // 可使用的功能
        $scope.appFuncList(return_json)
        $scope.bss2cbss(return_json)

        // 翻拍照片
        authentication_faceVerify = return_json.agencyParam && return_json.agencyParam.faceVerify === "000001"

        // 微店
        shopInfo = {
            "shopUrl": return_json.shopUrl,
            "shopBo": return_json.shopBo,
            "appFuncList": return_json.appFuncList
        };
        // console.log('return_json.appFuncList==',JSON.stringify(shopInfo.appFuncList));
        //console.log("rtshopBo=="+return_json.shopBo);
        //console.log("shopBo=="+shopInfo.shopBo);

        // shopBo 这个变量可以删除
        if (return_json.shopBo1) {
            shopBo = {
                "agencyTel": return_json.shopBo1.agencyTel,
                "shopName": return_json.shopBo1.shopName,
                "address": return_json.shopBo1.address,
                "auserName": return_json.shopBo1.auserName,
                "cuserName": return_json.shopBo1.cuserName,
                "shopTel": return_json.shopBo1.shopTel,
                "city": return_json.shopBo1.city
            };
        }

        // cateInfo 也可以去掉
        cateInfo = {
            "additionalPackage": return_json.cateBo["additionalPackage"] // 附加套餐
                ,
            "activity": return_json.cateBo["activity"] // 活动
                //, "preCharge":""			// 预付款设置
                ,
            "reduceMoney": return_json.cateBo["reduceMoney"] // 四川返钱
                // , "lanNumberPreCharge":Number(return_json.cateBo["lanNumberPreCharge"]) 	// 沃家组合单卡的最低预存
                ,
            "lanNumberPreCharge": Number(0) // 沃家组合单卡的最低预存
        }


        // console.log(JSON.stringify(return_json));
        //通知
        if (return_json.hasOwnProperty("noticeList")) {
            noticeList = return_json.noticeList;
        } else {
            noticeList = null;
        }
        $rootScope.token = return_json.token;
        unicommServer = unicommServer == "" ? return_json.unicommServer : unicommServer;

        // 可以去掉
        disPreChargeList = [];
        // console.log(return_json.preChargeList.length)
        // console.log(return_json.preChargeList)
        if (return_json.preChargeList.length) {
            for (var i in return_json.preChargeList) {
                disPreChargeList.push(return_json.preChargeList[i].preCharge)
            }
        } else {
            disPreChargeList = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
        }

        // 预存费用
        disPreCharge = return_json.cateBo["preCharge"];
        // 活动 1:可以抵预存,0:可以抵预存
        preChargeAddActivity = return_json.cateBo["preChargeAddActivity"];

        // shopname=return_json.shopname;

        // 
        senruiAccount = return_json.senruiAccount;
        senruiList = return_json.senruiList;
        senruiActive = rnd(0, senruiList.length - 1);

        agencyId = return_json.agencyId;
        $rootScope.isShowTabs = true;
        localStorage.setItem('accountType', return_json.accountType);
        $scope.loginAuthority(return_json);
        $scope.loginOut_unicomm()
    }



    $scope.loginOut_unicomm = function() {
        localStorage.setItem("login", JSON.stringify({ "userName": $scope.data.userName, "password": $scope.data.password, "login_pattern": $scope.data.login_pattern }))
        if (shopInfo.shopBo.city == "8120000") {
            $scope.logout_ac();
        } else {
            if (cbssInfo.ifTest) {
                $scope.logout_ac();
            } else {
                unicomm_server.getUnicomm({ "cmd": "other_logout" }).then(
                    function(return_json) {
                        if (return_json.status == '1') {
                            $scope.logout_ac();
                        } else {
                            $scope.LoginError('接口服务器登录失败!');
                        }
                    },
                    function() {
                        $scope.LoginError('接口服务器无返回信息!');
                    }
                )
            }
        }
    }


    $scope.logout_ac = function() {
        // 极光推送
        $scope.setupJPush();
        //$state.go("index");
        if ($scope.openId == null) {
            if ($scope.loginHistory.login_pattern == undefined || $scope.loginHistory.login_pattern == "") {
                my.confirm("设置滑动手势，代替输入密码", "便捷登录设置", "去设置", "不了").then(function() {
                    $state.go("lock");
                }, function() {
                    $state.go("index");
                    localStorage.setItem('judgeNews', 1);
                })
            } else {
                $state.go("index");
                localStorage.setItem('judgeNews', 1);
            }
        } else {
            $state.go("index");
            localStorage.setItem('judgeNews', 1);
        }
    }


    $scope.LoginError = function(data) {
        $scope.loading = false;
        $scope.resState = false;
        $scope.txtVal = "立即登录";
        my.alert(data);
    }

    // 极光推送
    $scope.setupJPush = function() {
        if (window.JPush) {
            window.JPush.init();
            var platform;
            if (device.platform == "Android") {
                platform = "android";
            } else {
                platform = "ios";
                window.JPush.startJPushSDK();
                window.JPush.setApplicationIconBadgeNumber(0);
                window.JPush.resetBadge();
            }
            // 获取 registradionID
            window.JPush.getRegistrationID(function(registradionID) {
                if (registradionID) {
                    $scope.sendJpushMessage($scope.data.userName, registradionID, platform);
                    if ($scope.loginUser == "000002") {
                        $scope.sendJpushMessage(userBo.userName, registradionID, platform);
                    }
                }
            });
        }
    }
    $scope.sendJpushMessage = function(userName, registradionID, platform) {
        $http({
            method: 'GET',
            url: ajaxurl + '/userDeviceApp/existUserDevice',
            params: { "userName": userName, "registrationId": registradionID, "deviceType": platform }
        }).success(function(return_json) {
            // 获取点击通知内容
            document.addEventListener("jpush.openNotification", function(event) {
                if (device.platform == "Android") {

                } else {
                    window.JPush.setApplicationIconBadgeNumber(0);
                    window.JPush.resetBadge();
                }
            }, false);
            // 获取通知内容
            document.addEventListener("jpush.receiveNotification", function(event) {
                if (device.platform == "Android") {

                } else {
                    window.JPush.setApplicationIconBadgeNumber(0);
                    window.JPush.resetBadge();
                }
            }, false);
            // 获取自定义消息推送内容
            document.addEventListener("jpush.receiveMessage", function(event) {
                if (device.platform == "Android") {

                } else {
                    window.JPush.setApplicationIconBadgeNumber(0);
                    window.JPush.resetBadge();
                }
            }, false);
        });
    }
})