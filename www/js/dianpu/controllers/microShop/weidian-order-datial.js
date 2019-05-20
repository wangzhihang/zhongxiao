appControllers.controller('dianpu-weidian-order-datial', function($scope,$rootScope,$http) {
	$scope.title = "订单详情";
	$scope.orderCode = localStorage.getItem('weidianOrderCode');;
    
    $scope.getData = function(){
		$http({
			  "method" : 'get'
			, "url" : 'http://z.haoma.cn/yinliu/ylNumOrder/queryNumberOrderDetailByOrderCode'
			, "params" : {
				
				orderCode:$scope.orderCode

			}
		}).success(function(data){
			console.log("xiangqing___"+JSON.stringify(data));
			
			$scope.orderDetail = data.orderDetail;
			console.log("~~~~~~~"+$scope.orderDetail);

			
			



		}).error(function(){
			
		});



		





	};
	$scope.getData();




})