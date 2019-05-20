appControllers.controller('org-Lan-order-list', function($scope,$state,$http,$rootScope) {
	$scope.title = '宽带订单列表';
	$scope.pageSize = 10;
	$scope.pageIndex = 1;
	$scope.levelCode = localStorage.getItem('levelCode');
	$scope.lanOrderList==[];
	$scope.getNumberData=function(){
		$http({
		method:'GET',
		url:ajaxurl + 'orderLanApp/queryLanOrderAppList?token=' + $rootScope.token,
		params:{
			levelCode:$scope.levelCode,
			// status:$scope.numberInfo.status,
			pageSize:$scope.pageIndex,
			pageIndex:$scope.pageIndex
		},
		timeout: 30000
	}).success(function(data){
		console.log("nnnnnn="+JSON.stringify(data));
		$scope.lanOrderList=data.list;
	}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}
	$scope.getNumberData();

});