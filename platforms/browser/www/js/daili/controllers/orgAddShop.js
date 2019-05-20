appControllers.controller('org-add-shop', function($scope, $state, $http, my, $rootScope) {
    $scope.title = '新增店铺';
    $scope.resState = true;
    $scope.loading = false;
    $scope.stateTxt = '确认添加';
    $scope.deveList = [];
    $scope.deveId = '';
    $scope.isNoShowArea = false;
    $scope.isNoShowHeader = false;
    $scope.arearValue = '请选择地区';
    // $scope.evaluate="请选择店铺类型";
    $scope.cateCode = '';
    $scope.province = '';
    $scope.id = null;
    $scope.data = { salesman: '', userName: '', password: '', password1: '', realName: '',shopName: '', address: '' };
    $scope.dataState = { salesman: false, userName: false, password: false, password1: false, realName: false, shopName: false, address: false, shopType: false };
    if (localStorage.getItem('DevelopInfo')) {
        $scope.developeId = JSON.parse(localStorage.getItem('DevelopInfo')).deptCode;
        $scope.developeOrgCode = JSON.parse(localStorage.getItem('DevelopInfo')).orgCode;
        // console.log('developeId=='+$scope.developeId+'    '+$scope.developeOrgCode);
    }
    // $scope.sites=[];
    $scope.sites = [{ 'id': 0, 'typeName': '请选择店铺类型' }];
    //选择店铺类型
    // if(userBo.userType == "000003"){
    $scope.dianpuType = function() {
            $http({
                method: 'get',
                url: ajaxurl + 'userApp/queryShopTypeByDeveDeptCodeForAPP?token=' + $rootScope.token,
                // url:'http://192.168.31.93:8080/tms-app-war/userApp/queryShopTypeByDeveDeptCodeForAPP?token=' + $rootScope.token,
                params: {
                    'userId': userBo.userId
                }
            }).success(function(data) {

                $scope.sites = $scope.sites.concat(data.data);
                $scope.input = { 'id': $scope.sites[0] };
            }).error(function() {
                my.alert('服务器请求失败');
            });
        }
        //是否显示选择店铺类型
    if (userBo.disId == '6100000' || userBo.disId == '8120000' || userBo.disId == '0500000') {
        $scope.choseDianpuType = true;
        $scope.dianpuType();
    } else {
        $scope.dataState.shopType = true;
    }
    // if(localStorage.getItem('developeOrgCode')){
    // 	$scope.developeOrgCode = localStorage.getItem('developeOrgCode')
    // }
    // 获取业务员信息
    $scope.getSalemanInfo = function() {
        $http({
            method: 'get',
            url: ajaxurl + 'appDept/getDeveList?token=' + $rootScope.token
        }).success(function(data) {
            $scope.deveList = data;
            $scope.select = function(e) {
                $scope.dataState.salesman = false;
                if (e != null) {
                    $scope.deptCode = e.deptCode;
                    // console.log('deptCode=='+$scope.deptCode);
                    $scope.dataState.salesman = true;
                }
                $scope.submit();
            }

        });
    }
    if (signInInfo.deptMap.deptType == '000001' && localStorage.getItem('dianpuTag') == 'dianpu') {
        $scope.showChoseSaleman = true;
        $scope.getSalemanInfo();
    } else if (signInInfo.deptMap.deptType == '000002' && localStorage.getItem('dianpuTag') == 'dianpu') {
        $scope.showChoseSaleman = true;
        $scope.getSalemanInfo();
    } else if (signInInfo.deptMap.deptType == '000003') {
        $scope.showChoseSaleman = false;
        $scope.dataState.salesman = true;
    } else {
        $scope.dataState.salesman = true;
    }
    // if(signInInfo.userInfo.userType == '000003'){
    // 	$scope.showChoseSaleman = false;
    // }

    //按钮状态
    $scope.submit = function() {
            var t = false;
            for (var i in $scope.dataState) {
                if ($scope.dataState[i] == false) {
                    t = true;
                }
            }
            $scope.resState = t;
        }
        //用户名验证
    $scope.userName = function() {
            $scope.dataState.userName = false;
            var reg = /^1[0-9]{10}$/;
            if (!reg.test($scope.data.userName)) {
                $scope.userNameErrorTips = '账号错误';
                $scope.submit();
            } else {
                $http({
                    method: 'post',
                    url: ajaxurl + 'userApp/existUserName?token=' + $rootScope.token,
                    data: { userName: $scope.data.userName }
                }).success(function(data) {
                    if (data == true) {
                        $scope.userNameErrorTips = '';
                        $scope.dataState.userName = true;
                    } else {
                        $scope.userNameErrorTips = '已被占用';
                    }
                    $scope.submit();
                });
            }

        }
        //密码验证
    $scope.password = function() {
            $scope.dataState.password = false;
            if ($scope.data.password.length < 6) {
                $scope.passwordErrorTips = '最小长度为6位';
                // }else if($scope.data.password != $scope.data.password1){
                // 	$scope.rePasswordErrorTips = '密码不一致';
            } else {
                $scope.passwordErrorTips = '';
                $scope.dataState.password = true;

            }
            $scope.submit();
        }
        //确认密码验证
    $scope.repassword = function() {
            $scope.dataState.password1 = false;
            if ($scope.data.password != $scope.data.password1) {
                $scope.repasswordErrorTips = '密码不一致';
            } else {
                $scope.repasswordErrorTips = '';
                $scope.dataState.password1 = true;
            }
            $scope.submit();
        }
        //真实姓名
    $scope.realName = function() {
            $scope.dataState.realName = false;
            var reg = /^[\u4E00-\u9FA5]{2,4}$/;
            if (!reg.test($scope.data.realName)) {
                $scope.realNameErrorTips = '请输入真实姓名';
            } else {
                $scope.realNameErrorTips = '';
                $scope.dataState.realName = true;
            }
            $scope.submit();
        }
        //联系电话
    $scope.contractNumber = function() {
            $scope.dataState.contractNumber = false;
            var reg = /^1[0-9]{10}$/;
            if (!reg.test($scope.data.contractNumber)) {
                $scope.contractNumberErrorTips = '手机号码有误';
            } else {
                $scope.contractNumberErrorTips = '';
                $scope.dataState.contractNumber = true;
            }
            $scope.submit();
        }
        //店铺名称
    $scope.shopName = function() {
            $scope.dataState.shopName = false;
            if ($scope.data.shopName.length < 3) {
                $scope.shopNameErrorTips = '最小长度为3位';
            } else {
                $scope.shopNameErrorTips = '';
                $scope.dataState.shopName = true;
            }

            $scope.submit();
        }
        //店铺地址
    $scope.address = function() {
            $scope.dataState.address = false;
            if ($scope.data.address.length < 5) {
                $scope.addressErrorTips = '详细地址';
            } else {
                $scope.addressErrorTips = '';
                $scope.dataState.address = true;
            }
            $scope.submit();
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
                        'disId': signInInfo.userInfo.disId
                    }
                }).success(function(data) {
                    // console.log(JSON.stringify(data));
                    $scope.wxNumberCate = data.data.wxNumberCate;
                    $scope.cateList = data.data.cateList;
                    for (var i in $scope.cateList) {
                        if ($scope.cateList[i].cateCode == signInInfo.userInfo.disId) {
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


    //   }else{
    //   	$http({
    // 	method:'get',
    // 	url:'http://192.168.31.93:8080/tms-app-war/userApp/queryShopTypeByDeveDeptCodeForAPP?token=' + $rootScope.token,
    // 	 params:{
    //         	'userId':$scope.developeId
    //         }
    // }).success(function(data){

    // 	$scope.sites =$scope.sites.concat(data.data);
    // 	$scope.input = {'id':$scope.sites[0]};
    // }).error(function(){
    // 	my.alert('服务器请求失败');
    // });
    //   }



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

    $scope.input1 = function() {
        // console.log('input'+JSON.stringify($scope.input.id));
        // console.log('id'+$scope.input.id.id);
        $scope.id = $scope.input.id.id;
        $scope.isSwitch();
    }
    $scope.isSwitch = function() {
        // console.log('id=='+$scope.id);
        if ($scope.id == 0 || $scope.id == null) {
            $scope.dataState.shopType = false;
            return;
        } else {
            $scope.dataState.shopType = true;
            $scope.submit();
        }
    }

    //提交表单
    $scope.submitForm = function() {
        $scope.loading = true;
        $scope.resState = true;
        $scope.stateTxt = '正在添加';
        if (localStorage.getItem('dianpuTag') == 'dianpu') {
            if (signInInfo.deptMap.deptType == "000003") {
                $scope.deptCode = signInInfo.deptMap.deptCode;
            }
            $http({
                method: 'post',
                url: ajaxurl + 'userApp/saveShopUser?token=' + $rootScope.token,
                data: {
                    userName: $scope.data.userName,
                    password: $scope.data.password,
                    password1: $scope.data.password1,
                    realName: $scope.data.realName,
                    contractNumber: $scope.data.userName,
                    shopName: $scope.data.shopName,
                    address: $scope.arearValue + $scope.data.address,
                    orgCode: userBo.orgCode,
                    parentCode: $scope.deptCode,
                    shopTypeId: $scope.id,
                    disId: signInInfo.userInfo.disId
                }
            }).success(function(data) {
                $scope.resState = true;
                $scope.loading = false;
                $scope.stateTxt = '确认添加';
                if (data) {
                    my.confirm("现在是否上传门头及营业执照", "已添加成功！", "确认上传", "暂时不上传").then(function() {
                        $state.go('daili-addshop-upload-pic', { 'userId': data });
                    }, function() {
                        $state.go("index_dl");
                    })
                } else {
                    my.alert('添加失败！').then(function() {
                        $state.go('index_dl');
                    });
                }
            });
        }

        if ((localStorage.getItem('dianpuTag') != 'dianpu') && (signInInfo.deptMap.deptType == "000002" || signInInfo.deptMap.deptType == "000001")) {
            // console.log('2222');
            $http({
                method: 'post',
                url: ajaxurl + 'userApp/saveShopUser?token=' + $rootScope.token,
                data: {
                    userName: $scope.data.userName,
                    password: $scope.data.password,
                    password1: $scope.data.password1,
                    realName: $scope.data.realName,
                    contractNumber: $scope.data.userName,
                    shopName: $scope.data.shopName,
                    address: $scope.arearValue + $scope.data.address,
                    orgCode: $scope.developeOrgCode,
                    parentCode: $scope.developeId,
                    shopTypeId: $scope.id,
                    disId: signInInfo.userInfo.disId
                }
            }).success(function(data) {
                $scope.loading = false;
                $scope.stateTxt = '确认添加';
                if (data) {
                    my.confirm("现在是否上传门头及营业执照", "已添加成功！", "确认上传", "暂时不上传").then(function() {
                        $state.go('daili-addshop-upload-pic', { 'userId': data });
                    }, function() {
                        $state.go("daili-org-saleman-shop-list");
                    })
                } else {
                    my.alert('添加失败！').then(function() {
                        $state.go('index_dl');
                    });
                }
            });
        }
        if (localStorage.getItem('dianpuTag') != 'dianpu' && signInInfo.deptMap.deptType == "000003") {
            // console.log('3333');
            $http({
                method: 'post',
                url: ajaxurl + 'userApp/saveShopUser?token=' + $rootScope.token,
                data: {
                    userName: $scope.data.userName,
                    password: $scope.data.password,
                    password1: $scope.data.password1,
                    realName: $scope.data.realName,
                    contractNumber: $scope.data.userName,
                    shopName: $scope.data.shopName,
                    address: $scope.arearValue + $scope.data.address,
                    orgCode: userBo.orgCode,
                    parentCode: userBo.deptCode,
                    shopTypeId: $scope.id,
                    disId: signInInfo.userInfo.disId
                }
            }).success(function(data) {
                $scope.resState = true;
                $scope.loading = false;
                $scope.stateTxt = '确认添加';
                if (data) {
                    my.confirm("现在是否上传门头及营业执照", "已添加成功！", "确认上传", "暂时不上传").then(function() {
                        $state.go('daili-addshop-upload-pic', { 'userId': data });
                    }, function() {
                        $state.go("daili-org-index-list");
                    })
                } else {
                    my.alert('添加失败！').then(function() {
                        $state.go('index_dl');
                    });
                }
            });
        }

    }

});