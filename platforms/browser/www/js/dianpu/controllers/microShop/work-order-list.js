appControllers.controller('dianpu-microshop-work-order-list', function($scope,$state,$http,$ionicPopup,$rootScope,my){

    $scope.title = "工单池订单";
	$scope.loading = false;
    $scope.orderList=[];
    

    $scope.getData=function(){
        $http({
			method:'GET',
			url:ajaxurl + 'lanPreorderApp/queryLanCallNumberByDeptCode?token=' + $rootScope.token,
		}).success(function(data){
            console.log("asjg",data);
            $scope.orderList=data.data;
		}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('orderManagements');
              }); 
        });
    }

    $scope.getData();

    $scope.goDetail=function(index){
        localStorage.setItem("orderList",JSON.stringify($scope.orderList[index]))
        $state.go('dianpu-microshop-work-order-detail');
    }
})