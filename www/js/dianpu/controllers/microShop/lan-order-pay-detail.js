appControllers.controller('dianpu-microshop-lan-order-pay-detail', function($scope,$state,$http,$rootScope,my,$stateParams){
	$scope.title = '宽带收费明细';
	$scope.loading = false;
	$scope.isShowremark = true;
	$scope.isShowTVInfo = true;
	//获取订单详情
	$scope.getOrderPayDetail=function(){
		$http({
			method: 'get',
			url: ajaxurl+"lanPreorderApp/lanOrderDetailForApp?token=" + $rootScope.token,
			params: {
				orderCode:$stateParams.orderCode
			}
		}).success(function(data){
			$scope.loading = true;
			$scope.lanOrderCombineBo = data.data.lanOrderCombineBo;
			$scope.lanInfoBo = data.data.lanInfoBo;
			$scope.lanNumberList = data.data.lanNumberList;
			$scope.tvList = data.data.tvList;
			if($scope.tvList.length == 0){
				$scope.isShowTVInfo = false;
			}
			for(var i in $scope.lanNumberList){
				if($scope.lanNumberList[i].activityName == null){
					$scope.lanNumberList[i].isHasActive = false;
				}
				if($scope.lanNumberList[i].isNewNumber == '000001'){
					$scope.lanNumberList[i].NewNumber = '新装';
				}else if($scope.lanNumberList[i].isNewNumber == '000002'){
					$scope.lanNumberList[i].NewNumber = '纳入';
				}
			}
			for(var i in $scope.tvList){
				if($scope.tvList[i].tvAmount == null){
					$scope.tvList[i].tvAmount = false;
				}
			}
			if($scope.lanOrderCombineBo.remark == null){
				$scope.isShowremark = false;
			}
			if($scope.lanInfoBo.lanAmount == null){
				$scope.lanInfoBo.lanAmount = 0;
			}
			if($scope.lanInfoBo.lanActivityName == null){
				$scope.isHasLanActive = false;
			}
			if($scope.lanInfoBo.ftthAmount == null){
				$scope.lanInfoBo.ftthAmount = 0;
			}
		}).error(function () {
	       
	    });
	}
	$scope.getOrderPayDetail();

})