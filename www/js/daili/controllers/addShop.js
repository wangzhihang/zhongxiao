appControllers.controller('daili-add-shop', function($scope,$http,$state,my,$rootScope) {
	$scope.title = '新增店铺';
	$scope.resState = true;
	$scope.loading = false;
	$scope.stateTxt = '确认添加';
	$scope.deveList = [];
	$scope.deveId = '';
	$scope.data = {salesman:'',userName:'',password:'',password1:'',realName:'',contractNumber:'',shopName:'',address:''};
	$scope.dataState = {salesman:false,userName:false,password:false,realName:false,contractNumber:false,shopName:false,address:false};
	//获取业务员信息
	$http({
		method:'get',
		url:ajaxurl + 'userApp/getAgencyContacts?token=' + $rootScope.token
	}).success(function(data){
		if(signInInfo.userType=="develop"){
			$scope.deveList =[{"realName":signInInfo.userInfo.realName,"userId":signInInfo.userInfo.userId}];
			$scope.firstName=$scope.deveList[0].realName;
			$scope.isNoDevelop=false;
			$scope.deveId =signInInfo.userInfo.userId ;
			$scope.dataState.salesman = true;
			$scope.submit();
		}else{
			$scope.deveList = data['deveList'];
			// console.log("222"+JSON.stringify($scope.deveList));
			$scope.isNoDevelop=true;
			$scope.select = function(e){
				$scope.dataState.salesman = false;
				if(e != null){
					$scope.deveId = e.userId;
					$scope.dataState.salesman = true;
				}
				$scope.submit();
			}
		}
		
	});
	//按钮状态
	$scope.submit = function(){
		var t = false;
		for(var i in $scope.dataState){
			if($scope.dataState[i] == false){
				t = true;
			}
		}
		$scope.resState = t;
	}
	//用户名验证
	$scope.userName = function(){
		$scope.dataState.userName = false;
		var reg = /^[c]1[0-9]{10}$/;
		if(!reg.test($scope.data.userName)){
			$scope.userNameErrorTips = '账号错误';
			$scope.submit();
		}else{
			$http({
				method:'post',
				url:ajaxurl + 'userApp/existUserName?token=' + $rootScope.token,
				data:{userName:$scope.data.userName}
			}).success(function(data){
				if(data == true){
					$scope.userNameErrorTips = '';
					$scope.dataState.userName = true;
				}else{
					$scope.userNameErrorTips = '已被占用';
				}
				$scope.submit();
			});
		}
	}
	//密码验证
	$scope.password = function(){
		$scope.dataState.password = false;
		if($scope.data.password.length < 6){
			$scope.passwordErrorTips = '最小长度为6位';
		}else if($scope.data.password != $scope.data.password1){
			$scope.passwordErrorTips = '密码不一致';
		}else{
			$scope.passwordErrorTips = '';
			$scope.dataState.password = true;
			
		}
		$scope.submit();
	}
	//真实姓名
	$scope.realName = function(){
		$scope.dataState.realName = false;
		var reg = /^[\u4E00-\u9FA5]{2,4}$/;
		if(!reg.test($scope.data.realName)){
			$scope.realNameErrorTips = '请输入真实姓名';
		}else{
			$scope.realNameErrorTips = '';
			$scope.dataState.realName = true;
		}
		$scope.submit();
	}
	//联系电话
	$scope.contractNumber = function(){
		$scope.dataState.contractNumber = false;
		var reg = /^1[0-9]{10}$/;
		if(!reg.test($scope.data.contractNumber)){
			$scope.contractNumberErrorTips = '手机号码有误';
		}else{
			$scope.contractNumberErrorTips = '';
			$scope.dataState.contractNumber = true;
		}
		$scope.submit();
	}
	//店铺名称
	$scope.shopName = function(){
		$scope.dataState.shopName = false;
		if($scope.data.shopName.length < 3){
			$scope.shopNameErrorTips = '设置店铺名称';
		}else{
			$scope.shopNameErrorTips = '';
			$scope.dataState.shopName = true;
		}
		$scope.submit();
	}
	//店铺地址
	$scope.address = function(){
		$scope.dataState.address = false;
		if($scope.data.address.length < 5){
			$scope.addressErrorTips = '详细地址';
		}else{
			$scope.addressErrorTips = '';
			$scope.dataState.address = true;
		}
		$scope.submit();
	}
	//提交表单
	$scope.submitForm = function(){
		if($scope.data.address.length>=6){
			$scope.resState = true;
			$scope.loading = true;
			$scope.stateTxt = '正在提交';
			$http({
				method:'post',
				url:ajaxurl + 'userApp/saveShopUser?token=' + $rootScope.token,
				data:{
					userName:$scope.data.userName
					,password:$scope.data.password
					,password1:$scope.data.password1
					,realName:$scope.data.realName
					,contractNumber:$scope.data.contractNumber
					,shopName:$scope.data.shopName
					,address:$scope.data.address
					,deveId:$scope.deveId
				}
			}).success(function(data){
				$scope.resState = false;
				$scope.loading = false;
				$scope.stateTxt = '确认添加';
				if(data == true){
					$scope.loading = false;
					my.alert("已成功添加！").then(function(){
						$state.go('index_dl');
					});
				}else{
					my.alert(data);
				}
			});
		}else{
			my.alert('地址的长度不应该少于6位');
		}
	}
});