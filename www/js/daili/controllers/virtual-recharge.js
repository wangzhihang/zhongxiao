appControllers.controller('daili-virtual-recharge', function($scope,$http,$rootScope,$state,my,$stateParams) {
	$scope.title = '充值';
	$scope.resState = true;
	$scope.balance = '0.00';
	$scope.input = {amount:''};
	$scope.userId = $stateParams.userId;
	$scope.balance = localStorage.getItem('virtualAmount');
	//金额判断
	$scope.enterAmount = function(){
		if($scope.input.amount == '' || $scope.input.amount.replace(/[1-9][0-9]*$/,"") || $scope.input.amount > 10000){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	}
	//充值
	$scope.next = function(){
		my.confirm("确定充值?", "", "确定").then(function(){
			$http({
				method:'post',
				url:ajaxurl + 'accountApp/virtualRecharge?token=' + $rootScope.token,
				data:{
					userId:$scope.userId,
					fee:$scope.input.amount
				}
			}).success(function(data){
				my.alert('充值成功').then(function(){
					$state.go('daili-virtual-account');
				}); 
			});
		})
		
	}

});