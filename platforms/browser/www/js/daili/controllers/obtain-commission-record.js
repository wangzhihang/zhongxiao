appControllers.controller('daili-obtain-commission-record', function($scope,$http,my,$state,$rootScope) {
	$scope.title = '佣金记录';
	$http({
		method:'post',
		url:ajaxurl + 'dealFlow/queryWechatDealFlow?token='+ $rootScope.token
	}).success(function(data){
		if(data.msg == '成功'){
			// $scope.dianpuList = data.data.shopList;
		}
	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index_dl');
        }); 
    });
});