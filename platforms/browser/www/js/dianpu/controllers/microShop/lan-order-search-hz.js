appControllers.controller('dianpu-microshop-lan-order-search-hz', function($scope,$state,$http,$rootScope,my){

    $scope.title = "实名后置宽带订单";
	$scope.loading = false;
	$scope.preorderList = [];

	$http({
		"method":'GET',
		"url":ajaxurl + 'lanPreorderApp/queryLanPreorderInfoByUserName',
		"params":{
			"token":$rootScope.token,
			"userName":userBo.userName
		}
	}).success(function(data){
		$scope.loading = false;
		for(var i in data.data){
			data.data[i].projectAddress = JSON.parse(data.data[i].projectAddress) 
			$scope.preorderList.push(data.data[i]);
		}
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。'); 
	});


	$scope.lanOrderPay=function(index){
		localStorage.setItem("preorderList",JSON.stringify($scope.preorderList[index]))
		$state.go("dianpu-microshop-lan-order-search-handle")
	}
})