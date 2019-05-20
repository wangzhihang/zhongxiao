appControllers.controller('newOrderList', function($scope,$http,$rootScope,$filter,$ionicPopup) {
	$scope.title = "实时最新订单";
	$scope.newOrderList = [];
	$scope.loading = true;
	$scope.showInfo = false;
	$http({
		method:'get',
		url:ajaxurl + 'orderPushApp/queryPushOrder?token=' + $rootScope.token
	}).success(function (data){
		$scope.loading = false;
		$scope.showInfo = true;
		//判断"订单类型->显示对应信息"
		for(var i = 0;i < data['list'].length;i++){
			$scope.newOrderList.push(data['list'][i]);
			if(data['list'][i].orderType == '000001'){
				$scope.newOrderList[i].orderType = '号码办理';
				$scope.newOrderList[i].showInfo = $filter('hideCode')(data['list'][i].number,'3,4,5,6');
			}else if(data['list'][i].orderType == '000002'){
				$scope.newOrderList[i].orderType = '宽带业务';
				$scope.newOrderList[i].showInfo = data['list'][i].productName;
			}else if(data['list'][i].orderType == '000003'){
				$scope.newOrderList[i].orderType = '话费充值';
				$scope.newOrderList[i].showInfo = $filter('hideCode')(data['list'][i].number,'3,4,5,6');
			}
			//订单状态
			if(data['list'][i].status == '000003'){
				$scope.newOrderList[i].status = '成功办理';
			}else{
				$scope.newOrderList[i].status = '正在办理';
			}
		}
	});
})
