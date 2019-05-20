appControllers.controller('daili-add-salesman', function($scope,$http,$state,my,$rootScope) {
	$scope.title = '新增业务员';
	$scope.resState = true;
	$scope.loading = false;
	$scope.stateTxt = '确认添加';
	$scope.data = {userName:'',password:'',password1:'',realName:'',contractNumber:''};
	$scope.dataState = {userName:false,password:false,realName:false,contractNumber:false};
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
		var reg = /^[b]1[0-9]{10}$/;
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
			return;
		}else if($scope.data.password != $scope.data.password1){
			$scope.passwordErrorTips = '';
			$scope.rePasswordErrorTips = '密码不一致';
			return;
		}else{
			$scope.passwordErrorTips = '';
			$scope.rePasswordErrorTips = '';
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
	//提交表单
	$scope.submitForm = function(){
		$scope.resState = true;
		$scope.stateTxt = '正在添加';
		$http({
			method:'post',
			url:ajaxurl + 'userApp/saveDeveloper?token=' + $rootScope.token,
			data:{
				userName:$scope.data.userName
				,password:$scope.data.password
				,password1:$scope.data.password1
				,realName:$scope.data.realName
				,contractNumber:$scope.data.contractNumber
			}
		}).success(function(data){
			$scope.resState = false;
			$scope.loading = false;
			$scope.stateTxt = '确认添加';
			if(data == true){
				my.alert("已成功添加！").then(function(){
					$state.go('index_dl');
				});
			}else{
				my.alert(data);
			}
		});
	}
});