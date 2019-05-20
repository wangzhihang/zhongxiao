appControllers.controller('dianpu-weidian-amount', function($scope,$rootScope,$http) {
	$scope.title = "我的佣金";
	$scope.noPayList=false;

    console.log("9090090")






	$scope.getData = function(){
		$http({
			  "method" : 'get'
			, "url" : 'http://z.haoma.cn/yinliu/ylNumOrder/queryShopOrderCommissionList'
			, "params" : {
				
				pageIndex:1,
				pageSize:10

			}
		}).success(function(data){
			console.log("~~~~~~~"+JSON.stringify(data));
			$scope.commissionList = data.data.commissionList;
			console.log("???"+$scope.commissionList);

			if($scope.commissionList.length==0){
				$scope.noPayList=true;
			}


		}).error(function(){
			
		});



		





	};
	$scope.getData();









})