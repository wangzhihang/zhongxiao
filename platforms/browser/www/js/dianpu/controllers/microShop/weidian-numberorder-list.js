appControllers.controller('dianpu-weidian-numberorder-list', function($scope,$rootScope,$http,$state) {
	$scope.title = "号码订单";
	$scope.shopOrderListInfo = [];
	$scope.shopOrderList = [];
    $scope.finishList = [];
    $scope.unfinishList = [];



$scope.getData = function(){
		$scope.shopOrderListInfo = [];
		$http({
			  "method" : 'get'
			, "url" : 'http://z.haoma.cn/yinliu/ylNumOrder/getShopNumbeOrderList'
			, "params" : {
				
				pageIndex:1,
				pageSize:10

			}
		}).success(function(data){
			console.log(data);
			$scope.shopOrderListInfo = data.data.shopOrderList;
			$scope.shopOrderList = $scope.shopOrderListInfo;

		}).error(function(){
			
		});

};

$scope.getData();
$scope.tag = {
		ordType: "1"
	};
	$scope.actions = {
		setOrdType: function (param) {
			$scope.tag.ordType = param;

			switch(param){
        		case 1:
        			$scope.shopOrderList = [];
        			$scope.shopOrderList = $scope.shopOrderListInfo;
        		break;
        		case 2:
        			$scope.shopOrderList = [];
        			for (var i in $scope.shopOrderListInfo) {
        				if ($scope.shopOrderListInfo[i].status === '000003') {
        					$scope.shopOrderList.push($scope.shopOrderListInfo[i]);
        				}
        			}
        		break;
        		case 3:
        			$scope.shopOrderList = [];
        			for (var i in $scope.shopOrderListInfo) {
        				if ($scope.shopOrderListInfo[i].status != '000003') {
        					$scope.shopOrderList.push($scope.shopOrderListInfo[i]);
        				}
        			}
        		break;
        	}




		}
};







$scope.goToDetail=function(e){
	console.log("123321---"+JSON.stringify($scope.shopOrderList));
	   $scope.weidianOrderCode = $scope.shopOrderList[e].orderCode;
	   localStorage.setItem('weidianOrderCode', $scope.weidianOrderCode);
	    $state.go('dianpu-weidian-order-datial');
}




})