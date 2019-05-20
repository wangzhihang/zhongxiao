appControllers.controller('dianpu-series-product', function($scope, $state,$sce, $http, $rootScope, my, unicomm_server,$stateParams) {

	$scope.title = "系列产品";
	$scope.userName = userBo.userName;
	$scope.pageType = $stateParams.pageType;
	$scope.category = $stateParams.category;
	console.log("$scope.userName===",$scope.userName)
    console.log("$scope.pageType==="+$scope.pageType)
    console.log("$scope.category==="+$scope.category)
    //跨域访问
	// $scope.trustSrc = function(src) {
	//     return $sce.trustAsResourceUrl(src);
	// }
		// $scope.comboUrl="http://z.haoma.cn/tms-app-war/preOrderApp/toLanPrePage?username="+$scope.userName;
	// console.log("$scope.comboUrl===",$scope.comboUrl)
	$scope.getThisSeries = function(pageType,category){
		console.log("qingqiu?")
		$http({
			method:'get',
			url: ajaxurl + 'productForApp/toProductPage?token='+$rootScope.token,
			params:{ 
				pageType:$scope.pageType,
				category:$scope.category
			},
			// params:{userId:36291},
			
		}).success(function(data){
			console.log("data====",data);
			$scope.status = data.data.status;
			console.log("status===="+ $scope.status)
			console.log(typeof $scope.status)
			if(data.data.status == false){
				my.alert("目前未上架该系列套餐，请期待")
			}else{
				$scope.imgpath = data.data.imgList.imgPath;
				console.log("$scope.imgpath ====",$scope.imgpath)
				$scope.productInfo = data.data.imgList.productInfo;
			}
		})
	}

	$scope.getThisSeries($scope.pageType,$scope.category);

	$scope.gotoOrder = function(e){
			console.log("点击===",$scope.productInfo);
			// $scope.btnIndex = $scope.productInfo[e].btnIndex;
			// console.log("$scope.btnIndex---"+$scope.btnIndex);
			for(var i in $scope.productInfo){
				if($scope.productInfo[i].btnIndex-1 == e){
				console.log($scope.productInfo[i].productName);
				localStorage.setItem('viceNum',$scope.productInfo[i].viceNum);
				localStorage.setItem('productId',$scope.productInfo[i].productId);
				$state.go("dianpu-series-order");

				}

			
			}
			
			// console.log("$scope.viceNum==="+$scope.viceNum);
			// console.log("$scope.productId==="+$scope.productId);
			
			
		//跨域访问H5微店页面
	}


});