appControllers.controller('add-shop-inspection-record', function($scope,$http,$state,$rootScope,$ionicLoading,my) {
	$scope.title = '添加巡店记录';
	$scope.evaluate="请选择";
	$scope.isShowEvaluate=false;
	$scope.visitorName=signInInfo.userInfo.realName;
	$scope.input = {
		"problemFeedback":""
		, "newProblemFeedback":""
		, "evaluate":""

	}
	 $scope.sites = [ 
	  	{site : "请选择", status: ""},   
        {site : "优秀", status: "000001"},  
        {site : "良好", status: "000002"},  
        {site : "一般", status: "000003"} ,
        {site : "差", status: "000004"}  
    ]; 
	//保存巡店记录
	$scope.addShopInspection=function(){
		//console.log("111=="+$scope.visitorName);
		//console.log($scope.input.evaluate);
		$http({
			method:'get',
			url:ajaxurl + 'shopVisit/insert?token=' + $rootScope.token,
			params:{userId: localStorage.getItem('ownerIdShop'),shopId:localStorage.getItem('shopId'),visitorId:localStorage.getItem('visitorId'),visitorName:localStorage.getItem('visitorName'),feedback:$scope.input.problemFeedback,newEvent:$scope.input.newProblemFeedback,status:$scope.input.evaluate},
			timeout: 10000
		}).success(function(data){
			//console.log(JSON.stringify(data));
			 my.alert('添加巡店记录成功').then(function(){
	                $state.go('shop-inspection-list');
	            }); 
		})
	}

	
})
