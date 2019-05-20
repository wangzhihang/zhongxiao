appControllers.controller('user-huabei-register', function($scope, $http, $state, my, $rootScope, $cordovaCamera) {
    $scope.title = '花呗商家注册';
    $scope.stateTxt = '确认注册';
    $scope.resState = true;
    $scope.loading = false;
    $scope.showBusinessPhoto = true;
    $scope.arearValue = '请选择店铺所属地区';
    $scope.filename = '';
    $scope.province = '';
    $scope.city = '';
    $scope.district = '';
    $scope.data = { userName: '', taxNumber: '', tel: '', alipayAccount: '', alipayName: '', dianpuName: '', detailAdd: '',dianpuCounty:'' };
    $scope.dataState = { userName: false, taxNumber: false, tel: false, alipayAccount: false, alipayName: false, dianpuName: false, detailAdd: false ,dianpuCounty:false};
    var formData = new FormData();
    //获取需要参数
    $http({
        method: 'POST',
        url: ajaxurl + 'huabei/selectAgentCodeAndSign?token=' + $rootScope.token
    }).success(function(data) {
        if(data.wxHuaBeiBo == null){
            my.alert('系统正在传输数据,请一分钟后尝试注册。').then(function(){
                $state.go('userCenter');
            });
        }else{
            if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 1){
                my.alert('该账号已注册成功,请直接使用。').then(function(){
                    $state.go('index');
                });
            }else if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 2){
                 $scope.uId = data.wxHuaBeiBo.uId;
            }else if(data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == null){
                my.alert('支付宝正在审核。').then(function(){
                    $state.go('index');
                });
            }else if(data.wxHuaBeiBo.userCode == null && data.wxHuaBeiBo.status == null){
                $scope.uId = data.wxHuaBeiBo.uId;
            }
        }
    }).error(function(err) {
        my.alert('数据信息获取失败！请稍后尝试。');
    });

    //按钮状态
    $scope.submit = function() {
        var t = false;
        for (var i in $scope.dataState) {
            if ($scope.dataState[i] == false) {
                t = true;
            }
        }
        $scope.resState = t;
        console.log($scope.dataState);
        // console.log('111===' + $scope.resState);
    }

    //用户名验证
    $scope.userName = function() {
            $scope.dataState.userName = false;
            var reg = /^1[0-9]{10}$/;
            if (!reg.test($scope.data.userName)) {
                $scope.userNameErrorTips = '账号错误';
            } else {
                $scope.userNameErrorTips = '';
                $scope.dataState.userName = true;
            }
            $scope.submit();
        }
        //税号验证
    $scope.taxNumber = function() {
            $scope.dataState.taxNumber = false;
            var reg = /^[0-9]+.?[0-9]*/;
            if (!reg.test($scope.data.taxNumber)) {
                $scope.taxNumberErrorTips = '税号错误';
            } else if ($scope.data.taxNumber.length <= 16) {
                $scope.taxNumberErrorTips = '最小长度为我16位';
            } else {
                $scope.taxNumberErrorTips = '';
                $scope.dataState.taxNumber = true;
            }
            $scope.submit();
        }
        //联系电话
    $scope.tel = function() {
            $scope.dataState.tel = false;
            var reg = /^1[0-9]{10}$/;
            if (!reg.test($scope.data.tel)) {
                $scope.telErrorTips = '手机号码有误';
            } else {
                $scope.telErrorTips = '';
                $scope.dataState.tel = true;
            }
            $scope.submit();
        }
        //支付宝账号
    $scope.alipayAccount = function() {
            $scope.dataState.alipayAccount = false;
            if ($scope.data.alipayAccount == '') {
                $scope.alipayAccountErrorTips = '请输入支付宝账号';
            } else {
                $scope.alipayAccountErrorTips = '';
                $scope.dataState.alipayAccount = true;
            }
            $scope.submit();
        }
        //支付宝实名
    $scope.alipayName = function() {
            $scope.dataState.alipayName = false;
            var reg = /^[0-9]+.?[0-9]*/;
            if (reg.test($scope.data.alipayName)) {
                $scope.alipayNameErrorTips = '实名错误';
            } else {
                if ($scope.data.alipayName.length <= 1) {
                    $scope.alipayNameErrorTips = '最小长度为2位';
                } else {
                    $scope.alipayNameErrorTips = '';
                    $scope.dataState.alipayName = true;
                }
            }
            $scope.submit();
        }
        //门店名称
    $scope.dianpuName = function() {
            $scope.dataState.dianpuName = false;
            if ($scope.data.dianpuName.length < 3) {
                $scope.dianpuNameErrorTips = '最小长度为3位';
            } else {
                $scope.dianpuNameErrorTips = '';
                $scope.dataState.dianpuName = true;
            }
            $scope.submit();
        }
        //门店所属县
    $scope.dianpuCounty = function() {
            $scope.dataState.dianpuCounty = false;
            if ($scope.data.dianpuCounty.length == 0) {
                $scope.dianpuCountyErrorTips = '请输入门店所属县';
            } else {
                $scope.dianpuCountyErrorTips = '';
                $scope.dataState.dianpuCounty = true;
            }
            $scope.submit();
        }
        //店铺地址
    $scope.detailAdd = function() {
        $scope.dataState.detailAdd = false;
        if ($scope.data.detailAdd.length < 5) {
            $scope.detailAddErrorTips = '详细地址';
        } else {
            $scope.detailAddErrorTips = '';
            $scope.dataState.detailAdd = true;
        }
        $scope.submit();
    }

    // 显示区域
    $scope.choseCity = function() {
        $scope.isNoShowHeader = true;
        $scope.isNoShowArea = true;
    }

    //关闭区域
    $scope.closeCity = function() {
            $scope.isNoShowHeader = false;
            $scope.isNoShowArea = false;
        }
        //初始化地区信息
    $scope.tag = {
        current1: '',
        current: '1'
    };
    $scope.proviceInfo = function() {
        $http({
            method: 'get',
            url: ajaxurl + 'cateApp/queryAllProviceCode?token=' + $rootScope.token
        }).success(function(data) {
            // console.log(JSON.stringify(data));
            $scope.provinceList = data.data.provices;
            if (data.msg == '成功') {
                $http({
                    method: 'get',
                    url: ajaxurl + 'cateApp/queryProviceByDisId?token=' + $rootScope.token,
                    params: {
                        'disId': userBo.disId
                    }
                }).success(function(data) {
                    // console.log(JSON.stringify(data));
                    $scope.wxNumberCate = data.data.wxNumberCate;
                    $scope.cateList = data.data.cateList;
                    for (var i in $scope.cateList) {
                        if ($scope.cateList[i].cateCode == userBo.disId) {
                            $scope.city = $scope.cateList[i].cateName;
                        }
                    }
                    $scope.cateCode = $scope.wxNumberCate.cateCode;
                    $scope.province = $scope.wxNumberCate.cateName;
                    $scope.arearValue = $scope.province + ' ' + $scope.city;
                    $scope.tag.current1 = $scope.cateCode;
                    $scope.cityInfo($scope.cateCode);
                }).error(function() {
                    my.alert('服务器请求失败');
                });
            }
        }).error(function() {
            my.alert('服务器请求失败');
        });
    };
    $scope.proviceInfo();

    //默认市
    $scope.cityInfo = function(province) {
        $http({
            method: 'get',
            url: ajaxurl + 'cateApp/queryCityList?token=' + $rootScope.token,
            params: {
                'province': province
            }
        }).success(function(data) {
            // console.log(JSON.stringify(data));
            $scope.cityList = data.cityList;
        }).error(function() {
            my.alert('服务器请求失败');
        });
    }

    $scope.actions = {
        // 市
        setCurrent: function(param) {
            $scope.tag.current = JSON.parse(param).cateCode;
            $scope.city = JSON.parse(param).cateName;
            $scope.closeCity();
            $scope.arearValue = $scope.province + ' ' + $scope.city;
        },
        // 省
        setCurrent1: function(param) {
            //onsole.log(param);
            $scope.tag.current1 = JSON.parse(param).cateCode;
            $scope.province = JSON.parse(param).cateName;
            $scope.cityInfo($scope.tag.current1);
        }
    };
    //file上传营业执照
    $scope.businessAvatar = function(target) {
            $scope.filename = target.files[0];
            // $scope.dataState.filename = false;
            // console.log($scope.filename);
            //  	if($scope.filename){
            // 	$scope.dataState.filename = true;
            // }
            // formData.append('storephoto',$scope.filename);
            // alert('1111=='+$scope.filename);
            // $scope.submit();
        }
        //上传营业执照
        //  $scope.CameraBusinessLicense = function (){
        // 	$cordovaCamera.getPicture(CameraOptions).then(function(imageData1) {
        // 		$scope.showBusinessPhoto=false;
        // 		$scope.businessAvatar = "data:image/jpeg;base64," + imageData1;
        // 		$scope.submit();
        // 		// alert($scope.businessAvatar);
        // 	}, function(err) {
        // 		my.alert('请重新拍照');
        // 	});
        // }

    //注册提交
    $scope.huabeiRegister = function(sign) {
        var parmass = "?" //可以保证数据不会乱码 隔离multipart/form-data
            +
            'customerId=' + '100003' + "&" +
            'agentName=' + $scope.data.userName + "&" +
            'taxNumber=' + $scope.data.taxNumber + "&" +
            'cellPhone=' + $scope.data.tel + "&" +
            'payAccount=' + $scope.data.alipayAccount + "&" +
            'contacts=' +  encodeURI(encodeURI($scope.data.alipayName)) + "&" +
            'province=' + encodeURI(encodeURI($scope.province)) + "&" +
            'city=' + encodeURI(encodeURI($scope.city)) + "&" +
            'district=' + encodeURI(encodeURI($scope.data.dianpuCounty)) + "&" +
            'address=' + encodeURI(encodeURI($scope.data.detailAdd)) + "&" +
            'storeName=' + encodeURI(encodeURI($scope.data.dianpuName)) + "&" +
            'uId=' + $scope.uId;
        //                   + 'sign=' + sign;
        $http({
            method: 'post',
            // url:'http://118.122.120.53:30084/v1/register/add'+ parmass,
            // // headers: {
            // //               'content-type' : 'multipart/form-data'
            // //          },
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity,
            url: ajaxurl + 'HuaBei/register' + parmass,
            data: formData
                // data:{
                // 	'customerId':'100003',
                // 	'agentName':$scope.data.userName,
                // 	'taxNumber':$scope.data.taxNumber,
                // 	'cellPhone':$scope.data.tel,
                // 	'payAccount':$scope.data.alipayAccount,
                // 	'contacts':$scope.data.alipayName,
                // 	'province':$scope.province,
                // 	'city':$scope.city,
                // 	'district':'临潼县',
                // 	'address':$scope.data.detailAdd,
                // 	'storeName':$scope.data.dianpuName,
                // 	'uId':'2088112722504574'
                // 	// 'storephoto':$scope.filename
                // }
        }).success(function(data) {
            console.log(JSON.parse(data).data.userCode);
            if(JSON.parse(data).codeMsg == '成功'){
                // 返回userCode
                $scope.saveUserCode(JSON.parse(data).data.userCode);
            }
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        });
    }
    $scope.returnSign = function(formData) {
        $http({
            method: 'post',
            url: ajaxurl + 'huabei/returnSign',
            data: {
                'customerId': '100003',
                'agentName': $scope.data.userName,
                'taxNumber': $scope.data.taxNumber,
                'cellPhone': $scope.data.tel,
                'payAccount': $scope.data.alipayAccount,
                'contacts': $scope.data.alipayName,
                'province': $scope.province,
                'city': $scope.city,
                'district': $scope.data.dianpuCounty,
                'address': $scope.data.detailAdd,
                'storeName': $scope.data.dianpuName,
                'uId': $scope.uId
            }
        }).success(function(data) {
            if (data.sign) {
                formData.append('storephoto', $scope.filename);
                // formData.append('sign',data.sign);
                $scope.huabeiRegister(data.sign);
            }
        }).error(function() {

        });
    }
    $scope.submitForm = function() {

        // formData.append('customerId','100003');
        // formData.append('agentName',$scope.data.userName);
        // formData.append('taxNumber',$scope.data.taxNumber);
        // formData.append('cellPhone',$scope.data.tel);
        // formData.append('payAccount',$scope.data.alipayAccount);
        // formData.append('contacts',$scope.data.alipayName);
        // formData.append('province',$scope.province);
        // formData.append('city',$scope.city);
        // formData.append('district','临潼县');
        // formData.append('address',$scope.data.detailAdd);
        // formData.append('storeName',$scope.data.dianpuName);
        // formData.append('uId','2088112722504574');
        // for (var value of formData.values()) {
        //    console.log('value==='+value); 
        // }
        //获取sign
        if ($scope.filename) {
            $scope.returnSign(formData);
        } else {
            my.alert('请上传营业执照');
        }

    }

    //返给后台数据
    $scope.saveUserCode = function(userCode) {
        $http({
            method: 'post',
            url: ajaxurl + 'huabei/saveUserCode?token=' + $rootScope.token,
            data: {
                userCode: userCode
            }
        }).success(function(data) {
            if(data.result == 'ok'){
                my.alert('注册成功,等待审核。').then(function(){
                    $state.go('userCenter');
                });
            }else{
                my.alert('注册失败,请稍后重试。');
            }
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        });
    }


})