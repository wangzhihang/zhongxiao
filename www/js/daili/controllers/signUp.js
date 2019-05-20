appControllers.controller('sign-up', function($scope,$http,my,$state,$rootScope) {
	$scope.title = '填写个人信息';
	$scope.btnText = '下一步';
	$scope.orgListVal_2 = false;
	$scope.orgListVal_3 = false;
	$scope.loading = false;
	$scope.resState = false;
	$scope.isNoShowHeader=false;
	$scope.isNoShowArea=false;
	$rootScope.arearValue='请选择归属地';
	$scope.provinceList = [];
	$scope.cityList  = [];
	$scope.orgList_1 = [];
	$scope.formInfo = {
		userName:'',
		realName:'',
		password:'',
		repassword:'',
		wangGe:'',
		channelManager:'',
		channelName:'',
		orgCode:'',
		disId:'',
		roleId:''
	};
	/***************获取基础信息***************/
	//获取表单初始值信息
	//选择省份
	$scope.selectProvince = function(e){
		//console.log("e=="+JSON.stringify(e));
		if(e != null){
			getCityInfo(e.cateCode);
		}
	};
	//选择城市
	$scope.selectCity = function(e){
		if(e != null){
			$scope.formInfo.disId = e.cateCode;
		}
	};
	//城市选项获取
	function getCityInfo(e){
		$scope.cityList = [];
		$http({
			method:'get',
			url:ajaxurl + 'userApp/queryCityList',
			params:{province:e}
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.cityList = data.cityList;
			//console.log("1111==="+JSON.stringify($scope.cityList));
			if($scope.cityList.length > 0){
				$scope.cityVal = true;
				$scope.formInfo.disId = '';//有子项
			}else{
				$scope.cityVal = false;
				$scope.formInfo.disId = e;//无子项
				$rootScope.arearValue=$rootScope.province;
				$scope.cityList = [{"cateName":"无数据"}];
			}
		}).error(function(){
			my.alert('服务器请求失败');
		});
	}
	//注册初始化信息查询
	 $scope.registerInfo =function(){
		$http({
			method:'get',
			url:ajaxurl + 'userApp/toRegister'
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.provinceList = data.provinceList;		//暂时显示陕西
			for(var i in data.orgList){
				if(data.orgList[i].orgCode == '000009'){
					$scope.orgList_1.push(data.orgList[i]);

					//console.log("orgList_1"+JSON.stringify($scope.orgList_1));
				}
			}
			getCityInfo(8610000);
		}).error(function(){
			my.alert('服务器请求失败');
		});	
	};
	
	$scope.registerInfo();
	/**********提交表单************/
	$scope.channelInfo = function(){
		$scope.telNumber=$scope.formInfo.userName.toString();
		if($scope.formInfo.userName == ''){
			my.alert('请输入手机号码');
		}else if($scope.telNumber.length < 11 
		   || $scope.telNumber.length > 11){
			my.alert('请正确输入手机号码');
		}else if($scope.telNumber.length == 11){
			//手机号码是否占用
			$http({
				method:'post',
				url:ajaxurl + 'userApp/existPhoneNumber',
				data:{phoneNumber:$scope.formInfo.userName}
			}).success(function(data){
				console.log('data'+JSON.stringify(data));
				if(data == false){
					my.alert('手机号码已被占用！');
					}else{
						if($scope.formInfo.realName == ''||$scope.formInfo.realName.length <2){
							my.alert('请输入真实姓名');
							return ;
						}
					    if($scope.formInfo.password == ''){
							my.alert('请设置密码');
							return ;
						}else if($scope.formInfo.password.length < 6){
							my.alert('密码必须大于6位数');
							return ;
						}else{
							 if($scope.formInfo.repassword == ''){
								my.alert('请再次确认密码');
								return ;
							}else if($scope.formInfo.repassword != $scope.formInfo.password){
								my.alert('两次密码不一致');
								return ;
							}
							
						}
						if($scope.formInfo.disId == ''){
							my.alert('请选择所属地区');
							return ;
						}
						//console.log("注册成功！");
						localStorage.setItem('formInfo',JSON.stringify($scope.formInfo));
						$state.go("signup-channel");
					}
			});
		}	
	};

	// 显示区域
	$scope.choseCity=function  () {
		$scope.isNoShowHeader=true;
		$scope.isNoShowArea=true;
	}
	//关闭区域
	$scope.closeCity=function (){
		$scope.isNoShowHeader=false;
		$scope.isNoShowArea=false;
	}

	$scope.tag = {
		current: "1",
		current1: "27"
	};
	$rootScope.province = "陕西";
	$scope.actions = {
		// 市
		setCurrent: function (param) {

			$scope.tag.current = JSON.parse(param).id;
			$rootScope.city=JSON.parse(param).cateName;
			if($rootScope.city=="无数据"){
				$rootScope.city="";
				$scope.formInfo.disId = $scope.disId;
			}else {
				$scope.formInfo.disId = JSON.parse(param).cateCode;
				$rootScope.arearValue=$rootScope.province+ ' ' + $rootScope.city;
				localStorage.setItem('city',$rootScope.city);
			}
			$scope.closeCity();
		},
		// 省
		setCurrent1: function (param) {
			//onsole.log(param);
			$scope.tag.current1 = JSON.parse(param).id;
			$rootScope.province=JSON.parse(param).cateName;
			$scope.selectProvince(JSON.parse(param));
			$scope.disId = JSON.parse(param).cateCode
		}
  };
});