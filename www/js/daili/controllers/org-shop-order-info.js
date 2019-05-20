appControllers.controller('daili-org-shop-order-info', function($scope) {
	$scope.title = '订单详情';
	$scope.loading=false;
	$http({
		method:'get',
		url:ajaxurl + 'numberOrderApp/queryNumberOrderDetailByOrderCode?token=' + $rootScope.token,
		params:{orderCode:localStorage.getItem('orderCode')},
		timeout: 5000
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		$scope.hideLoadingPage = false;
		//console.log(JSON.stringify(data));
		$scope.orderCode = data.orderDetail.orderCode;
		$scope.status = data.orderDetail.status;
		$scope.isCbss=data.orderDetail.isCbss;
		console.log($scope.status)
		if($scope.isCbss=='000001'){
			$scope.isCbssVal="CBSS";
		}else if($scope.isCbss=='000002'){
			$scope.isCbssVal="BSS";
		}
		
		//用户信息
		$scope.orderDetail = data.orderDetail;
		$scope.activityName = data.orderDetail.activityName;
		if($scope.activityName==undefined){
			$scope.isNoShowActivityName =false;
		}

		//店铺信息
		$scope.userInfos=data.userInfos;
		$scope.showUserInfos=true;
		$scope.showShopInfo=true;
		$scope.showSalemanInfo=true;
		if($scope.userInfos){
			$scope.shopName=$scope.userInfos.shopName;
			$scope.cTel=$scope.userInfos.cTel;
			$scope.cUserName=$scope.userInfos.cUserName;
			if($scope.shopName==null&&$scope.cTel==null&&$scope.cUserName==null){
				$scope.showShopInfo=false;
			}
			$scope.bRealName=$scope.userInfos.bRealName;
			$scope.bUserName=$scope.userInfos.bUserName;
			if($scope.bRealName==null&&$scope.bUserName==null){
				$scope.showSalemanInfo=false;
			}
		}else{
			$scope.showUserInfos=false;
		}

		//根据经纬度获取并显示地图
		$scope.isShowMapContainer=true;
		$scope.getMap=function(){
			 var map = new AMap.Map('mapContainer', {
                center: [$scope.longitude,$scope.latitude],
                zoom: 16
            });
            var marker=new AMap.Marker({
                position:[$scope.longitude,$scope.latitude],
                map:map
            });
		}
		$scope.lnglats=$scope.orderDetail.lnglats;
		console.log("lnglats==="+$scope.lnglats);
		$scope.lnglarArr=[];
		if($scope.lnglats==null||$scope.lnglats==""){
			$scope.isShowMapContainer=false;
		}else{
			$scope.lnglarArr=$scope.lnglats.split(',');
			$scope.longitude =$scope.lnglarArr[0];
			$scope.latitude =$scope.lnglarArr[1];
			$scope.getMap();
		}
		
		//如果"source == 000008 显示身份证正面照片"
		if(data.orderDetail.source == '000008'){
			$scope.idCardHeadUrl = data.orderDetail.idCardImageBackUrl;
		}
		//获取电子工单编号
		$scope.eleOrder = data.orderDetail.eleOrder;
		//如果电子工单不为空，则显示查看按钮
		if($scope.eleOrder == '' || $scope.eleOrder == null){
			$scope.hasElectronicWorksheets = false;
		}else{
			$scope.hasElectronicWorksheets = true;
		}

		
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
	});
});