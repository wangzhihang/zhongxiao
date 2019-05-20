appControllers.controller('userCenter', function($scope, $rootScope, my, $filter, $http, $state, $ionicPopup, unicomm_server, url2base64, $cordovaCamera, $ionicLoading, $timeout) {
    $scope.title = '用户中心';
    $scope.realName = '';
    $scope.balance = '0.00';
    $scope.commission = '0.00';
    $scope.avatar = 'img/logo.png';
    $scope.signId = userBo.signId;
    $scope.weixinTop = '绑定微信';
    if (userBo.userType == '000005') {
        $scope.showDianpuCard = true;
    }
    if (localStorage.getItem('weixinName')) {
        $scope.weixinName = localStorage.getItem('weixinName');
        $scope.weixinTop = '取消微信绑定';
    } else {
        if (userBo.appNickName) {
            $scope.weixinName = userBo.appNickName;
            $scope.weixinTop = '取消微信绑定';
        } else {
            $scope.weixinTop = '绑定微信';
        }
    }

    $scope.getUserData = function() {
        $http({
            method: 'GET',
            url: ajaxurl + "/userApp/toMyView?token=" + $rootScope.token,
        }).success(
            function(data) {
                //console.log("111="+JSON.stringify(data));
                if ($scope.avatar == null) {
                    console.log('logo');
                    $scope.avatar = 'img/logo.png';
                } else {
                    $scope.avatar = data.user.headImgUrl;
                }
                $scope.realName = data.user.realName;
                $scope.contractNumber = data.user.contractNumber;
                // if(data.shopBo){
                //  $scope.balance = data.shopBo.shopBalance;
                // }
                $scope.balance = data.shopBo.amount;
                $scope.commission = data.commission;
                if ($scope.commission == null) {
                    $scope.commission = 0.00;
                }
                if (data.user.isVirtual != "000001") {
                    if ($scope.balance < 0) {
                        $scope.balance = 0.00;
                    }
                }
            }
        ).error(function() {
            $ionicPopup.alert({ title: '提示', template: '用户信息获取服务器连接失败,请稍后再试!', okText: '我知道了', okType: 'button-calm' });
        });
    }
    $scope.getUserData();

    $scope.userAccount = function() {
        // if (userBo.userType == '000002') {
        //     return;
        // } else {
        //     if (userBo.testTag == "000001" && userBo.isVirtual == "000001") {
        //         $state.go('userAccount');
        //     } else {
        //         return;
        //     }
        // }
        $state.go('userAccount');
    }
    $scope.commissionRecord = function() {
        // if ((userBo.testTag == "000001" && userBo.isVirtual == "000002") || userBo.testTag == "000002") {
        //     return;
        // } else {
        //     $state.go('commissionRecord');
        // }
        $state.go('commissionRecord');
    }

    //设置头像
    $scope.photograph = function() {
        $cordovaCamera.getPicture({
            quality: 70,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 320,
            targetHeight: 320,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        }).then(function(imageData) {
            $scope.avatar = "data:image/jpeg;base64," + imageData;
            $scope.uploadAvatar();
        }, function(err) {
            //...
        });
    };
    //上传照片
    $scope.uploadAvatar = function() {
        $http({
            "method": 'post',
            "url": ajaxurl + '/imgUpladApp/saveImg',
            "data": { imageBase64: $scope.avatar.substring(23) }
        }).success(function(data) {
            $scope.avatar = data.imgUrl;
            // $scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
            $scope.saveAvatar();
        }).error(function(data) {
            my.alert('照片上传失败,请联系管理员!').then(function() {
                $scope.avatar = 'img/logo.png';
            });
        });
    };
    //保存头像
    $scope.saveAvatar = function() {
        $http({
            method: 'get',
            url: ajaxurl + '/userApp/saveHeadImage?token=' + $rootScope.token,
            params: { imageUrl: $scope.avatar }
        }).success(function(data) {
            //...上传成功
        }).error(function() {
            my.alert('照片保存失败,请重新拍摄！').then(function() {
                $scope.avatar = 'img/logo.png';
            });
        });
    };

    $scope.callPhone = function(mobilePhone) {
        window.open("tel:" + mobilePhone);
    };
    $scope.loginOut = function() {

        $http({
            method: 'GET',
            url: ajaxurl + "userApp/loginOut?token=" + $rootScope.token
        }).success(function(data) {
            $rootScope.token = "";
            $scope.loginOut_unicomm();
        }).error(function() {
            $rootScope.token = "";
            $scope.loginOut_unicomm();
        });
    }
    $scope.loginOut_unicomm = function() {
        // if(shopInfo.shopBo.city == "8120000"){
        // 	$state.go("login");
        // }else{
        // 	unicomm_server.getUnicomm({"cmd":"logout"}).then(
        // 		function(return_json){
        // 		}
        // 	)
        // }
        $state.go("login");
    }

    //绑定微信
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
                    $scope.accessToken = return_json.access_token;
                    $scope.isHasBindingWX($scope.openId, $scope.accessToken);
                }).error(function(data) {});
            }, function(error) {});
        }
        //判断是否有绑定微信
    $scope.isHasBindingWX = function(openId, accessToken) {
            $http({
                method: 'get',
                url: ajaxurl + 'userApp/checkUserByWeixinOpenId',
                params: { openId: openId }
            }).success(function(data) {
                if (data) {
                    $scope.releaseBindingWX(openId);
                    // my.confirm("该账号已绑定过微信，请先解绑再绑定新微信", "提示", "立即解绑", "暂时不了").then(function() {
                    //     $scope.releaseBindingWX(openId);
                    // })
                } else {
                    $scope.bindingWX(openId, accessToken);
                }
            }).error(function() {

            });
        }
        // $scope.isHasBindingWX('o-vT00xhdLAxiGC7PsA0y87Bdy38','');
        //绑定微信
    $scope.bindingWX = function(openId, accessToken) {
            $http({
                method: 'post',
                url: ajaxurl + 'userApp/userBindingWeixinOpenId?token=' + $rootScope.token,
                data: {
                    openId: openId,
                    accessToken: accessToken
                }
            }).success(function(data) {
                if (data.msg == '成功') {
                    $scope.weixinName = data.data;
                    my.alert('微信绑定成功！').then(function() {
                        localStorage.setItem('weixinName', $scope.weixinName);
                        $scope.weixinTop = '取消微信绑定';
                    });
                }
            }).error(function() {
                my.alert('微信绑定失败！');
            });
        }
        //解绑微信
    $scope.releaseBindingWX = function(openId) {
        $http({
            method: 'post',
            url: ajaxurl + 'userApp/userUntieWeixinOpenId?token=' + $rootScope.token,
            data: { openId: openId }
        }).success(function(data) {
            if (data == true) {
                my.alert('微信解绑成功！').then(function() {
                    localStorage.setItem('weixinName', '');
                    $scope.weixinName = '';
                    $scope.weixinTop = '绑定微信';
                    $scope.getUserData();
                });
            }
        }).error(function() {
            my.alert('微信解绑失败！');
        });
    }



    //支付宝授权
    //判断是否有授权
    $scope.checkAuthorize = function() {
            $http({
                method: 'post',
                url: ajaxurl + 'huabei/checkAuthorize?token=' + $rootScope.token
            }).success(function(data) {
                if (data == false) {
                    $ionicLoading.show({ template: '正在跳转支付宝' });
                    $scope.ParametersCreate()
                } else {
                    my.alert('支付宝已授权，请直接注册。');
                }
            }).error(function() {
                my.alert('数据信息获取失败！请稍后尝试。');
            });
        }
        //获取需要参数
    $scope.ParametersCreate = function() {
        $http({
            method: 'post',
            url: ajaxurl + 'huabei/ParametersCreate?token=' + $rootScope.token,
        }).success(function(data) {
            $scope.AlipayAuthorize(data.agentcode, data.customerId, data.sign);
        }).error(function() {

        });
    }

    //支付宝授权接口
    $scope.AlipayAuthorize = function(agentcode, customerId, sign) {
            $http({
                method: 'POST',
                // url: 'http://118.122.120.53:30084/v1/register/grant',
                url: 'http://pay.api.creditgogogo.com/v1/register/grant',
                data: {
                    agentcode: agentcode,
                    customerId: customerId,
                    sign: sign
                }
            }).success(function(data) {
                $ionicLoading.hide();
                // console.log('data=='+JSON.stringify(data));
                cordova.plugins.skipAppPlugin.skip(data, function(data) {
                        my.alert('支付宝授权失败！');
                    })
                    //绑定花呗和用户
                    // $scope.bindUserAndAlipay(agentcode);
            }).error(function(err) {
                // console.log('err==' + JSON.stringify(err));
            });
        }
        //绑定花呗和用户
    $scope.bindUserAndAlipay = function(agentcode) {
        $http({
            method: 'post',
            url: ajaxurl + 'huabei/bindingUserAndAlipay?token=' + $rootScope.token,
            data: {
                agentcode: agentcode
            }
        }).success(function(data) {
            // my.alert('支付宝授权成功!');
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        });
    }

    //花呗商家注册
    $scope.userHuabeiRegister = function() {
        //判断商家是否支付宝授权 未授权不让注册
        $http({
            method: 'post',
            url: ajaxurl + 'huabei/checkAuthorize?token=' + $rootScope.token
        }).success(function(data) {
            if (data == true) {
                $state.go('user-huabei-register');
            } else {
                my.alert('请先进行支付宝授权');
            }
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        });

    }

    //版本更新
    if (localStorage.getItem('lastUpdateTime')) {
        $scope.updateVersion = true;
        $scope.lastUpdateTime = localStorage.getItem('lastUpdateTime');
    }
    $scope.versionUpdate = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '系统提示',
            template: '是否更新版本?',
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: function() {
                        $http({
                            method: 'get',
                            url: ajaxurl + 'appVersion/queryAppVersionByAppName',
                            params: { "appName": 'zx_app', "appType": (device.platform == "Android" ? "android" : "ios") }
                        }).success(function(data) {
                            my.loaddingShow('版本更新中');
                            chcp.fetchUpdate(function(error) {
                                if (error) {
                                    my.loaddingHide();
                                    //提示
                                    $ionicLoading.show({
                                        animation: 'fade-in',
                                        showBackdrop: true,
                                        maxWidth: 200,
                                        showDelay: 0,
                                        template: '当前已是最新版本'
                                    });
                                    $timeout(function() {
                                        $ionicLoading.hide();
                                    }, 1000);
                                } else {
                                    chcp.installUpdate();
                                }
                                $scope.lastUpdateTime = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
                                localStorage.setItem('lastUpdateTime', $scope.lastUpdateTime);
                            }, { 'config-file': data.result.appUrl });
                        })
                    }
                }
            ]
        });
    }
})