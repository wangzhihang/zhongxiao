appControllers.controller('dianpu-microshop-cancel-order-reason', function($scope,$http,$rootScope,$state,my, $stateParams) {
	$scope.title = "取消订单原因";
	 $scope.input={
	 	cancelCode:""
	 };
	 $scope.list=[];
	 $scope.ifShowOther=false;
	 $scope.keyword="";
	$scope.getData=function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'orderApp/queryCancelTypeListByDisId',
			params: {
				token: $rootScope.token
			},
			timeout: 5000
		}).success(function(data){
			console.log(data)
			if(data.data==null){
				$scope.list=[];
			}else{
				$scope.list=data.data;
			}
			$scope.list.push({"cancelCode":"000000","cancelValue":"其他"});
			console.log("222",$scope.list)
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
				$state.go('index');
			}); 
		});
	}
	$scope.getData();
	$scope.choseReason=function(item){
		console.log(item, $scope.input.cancelCode)
		if($scope.input.cancelCode=="000000"){
			$scope.ifShowOther=true;
		}else{
			$scope.ifShowOther=false;
			$scope.keyword="";
		}
	}

	$scope.entrue=function(){
		$http({
			method: 'POST',
			url: ajaxurl + 'wechatShopApp/modifyTmWechatNumPreorderInfo',
			data: {
				orderCode:$stateParams.orderCode,
				status :"000200",
				remark :$scope.keyword,
				cancelCode :$scope.input.cancelCode,
				token: $rootScope.token
			},
			timeout: 5000
		}).success(function(data){
			my.alert('取消成功').then(function(){
				$state.go('dianpu-guide-network-flow-order');
			})
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
				$state.go('index');
			}); 
		});
	}
})