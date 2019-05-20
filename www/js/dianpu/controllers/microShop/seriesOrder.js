appControllers.controller('dianpu-series-order', function($scope, $state,$sce, $http, $rootScope, my, unicomm_server,$stateParams) {

	$scope.title = "产品预约";
	$scope.userId = userBo.userId;
	$scope.viceNum =localStorage.getItem('viceNum');
	$scope.productId =localStorage.getItem('productId');
	console.log("viceNum==="+$scope.viceNum+",,$scope.productId==="+$scope.productId)
	//http://localhost:8080/tms-app-war/productForApp/toProductPage?pageType=000001&category=000002&token=VTNP983J749BYZYZDQDOZDBAKRV6KKK
	// console.log("userInfo===",userInfo)
	console.log("$scope.userId===",$scope.userId)
    // console.log("")
    // 跨域访问
	$scope.trustSrc = function(src) {
		// localStorage.setItem('viceNum',$scope.viceNum);
	    return $sce.trustAsResourceUrl(src);

	}
	$scope.comboUrl="http://z.haoma.cn/yinliu/ylNumOrder/toEditOrderInfo?userId="+$scope.userId+"&ylProductId="+$scope.productId+"&viceNum="+$scope.viceNum;
	console.log("$scope.comboUrl===",$scope.comboUrl)
});

//http://localhost:8080/tms-app-war/productForApp/toProductPage?pageType=000001&category=000002&token=VTNP983J749BYZYZDQDOZDBAKRV6KKK