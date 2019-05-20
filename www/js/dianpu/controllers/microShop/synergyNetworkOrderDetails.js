appControllers.controller('dianpu-synergy-network-order-details', function($scope,$http,$state,$timeout,$rootScope,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = "异业订单详情";
	$scope.orderDetail = [];
	// 获取详情信息
	$http({
		method: 'GET',
		url: ajaxurl + 'wechatShopApp/findOrderDetail',
		params: {
			orderCode: order["orderCode"],
			token: $rootScope.token
		},
		timeout: 5000
	}).success(function(data){
		if (data.code === 0) {
			$scope.orderDetail = data['data'];
		}
	}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
				$state.go('index');
			}); 
	});
	
	//点击办理
	$scope.manage=function(){
		$scope.orderStatus="000005";
		if($scope.orderDetail.customer["name"]){
			reset_dianpu_bss();
			reset_dianpu_cbss();
			wx_order = {
				"number":$scope.orderDetail.shopOrder.number
				, "orderCode":$scope.orderDetail.shopOrder.orderCode
				, "productId":$scope.orderDetail.wxPackage.id
				, "productPrice":$scope.orderDetail.shopOrder && $scope.orderDetail.shopOrder.amount
				, "simNumber":$scope.orderDetail.shopOrder.simNumber
				, "TMorderCode":$scope.orderDetail.wechatOrder && $scope.orderDetail.wechatOrder.orderCode
			}
			order_type = "kaika";
			GoodHaoma = false;
			app = "dianpu";
			number_pool = "CBSS";
			if($scope.orderDetail.shopOrder.simNumber){
				service_type = "cbssSemiManufactures";
			}else{
				service_type = "telSelectCBSS";
			}

			authentication["name"] 		= $scope.orderDetail.customer["name"];
			authentication["cardId"] 	= $scope.orderDetail.customer["cardId"];
			authentication["address"] 	= $scope.orderDetail.customer["address"];
			authentication["birthday"] 	= $scope.orderDetail.customer["birthday"];
			authentication["police"] 	= $scope.orderDetail.customer["police"];
			authentication["nation"] 	= $scope.orderDetail.customer["nation"];
			authentication["gender"] 	= $scope.orderDetail.customer["sex"];
			authentication["start_date"]= $scope.orderDetail.customer["validStart"];
			authentication["end_date"] 	= $scope.orderDetail.customer["validEnd"];
			authentication["contractNumber"] = $scope.orderDetail.shopOrder["contactNumber"];
			authentication["idHeadImgUrl"] = $scope.orderDetail.customer["idCardHeadUrl"];
			authentication["customerImageUrl"] = $scope.orderDetail.customer["customerImageUrl"];
			authentication["sign"] = $scope.orderDetail.shopOrder["signName"];
			authentication["orderNo"] = $scope.orderDetail.shopOrder["orderCode"];
			$state.go('number-list');
			return;
		}else{
			my.alert('用户未实名认证，无法开卡。')
		}
	}
	
	//放弃订单
	$scope.giveUp=function(){
		var confirmPopup = $ionicPopup.confirm({
		title: '提示信息',
		template: '你确定要放弃订单吗?',
		buttons: [
			{ text: '取消' },
			{
				text: '<b>确定</b>',
				type: 'button-positive',
				onTap: function() {
				$http({
					method:'GET',
					url:ajaxurl + '/orderApp/doFail?token=' + $rootScope.token,
					params:{orderNo:$scope.orderDetail.shopOrder.orderCode, number: $scope.orderDetail.shopOrder.number }
				}).success(function(data){
					my.alert('订单已放弃！');
				});
				}
			},
			]
		});
		confirmPopup.then(function(res) {
		
		});
	}

	
	// translate card type
	$scope.translateCardType = function (e) {
		if (e === '000027') {
			return '<span class="txtTips">白卡</span>'
		} else if (e === '000028') {
			return '<span class="txtTips">半成卡</span>'
		} else {
			return e;
		}
	};



// translate status
$scope.translateStatus = function (e) {
	if (e === '000001') {
		return '<span class="produceProgress f-13 goingStatus">待处理</span>'
	} else if (e === '000002') {
		return '<span class="produceProgress f-13 goingStatus">身份验证成功</span>'
	} else if (e === '000003') {
		return '<span class="produceProgress f-13 finishStatus">订单成功</span>'
	} else if (e === '000004') {
		return '<span class="produceProgress f-13 unfinishedStatus">订单已取消</span>'
	} else if (e === '000005') {
		return '<span class="produceProgress f-13 unfinishedStatus">身份验证失败</span>'
	} else if (e === '000006') {
		return '<span class="produceProgress f-13 otherStatus">长号完成</span>'
	} else if (e === '000007') {
		return '<span class="produceProgress f-13 otherStatus">签名完成</span>'
	} else if (e === '000009') {
		return '<span class="produceProgress f-13 goingStatus">订单提交成功</span>'
	} else if (e === '000010') {
		return '<span class="produceProgress f-13 goingStatus">活体认证成功</span>'
	} else if (e === '000011') {
		return '<span class="produceProgress f-13 unfinishedStatus">活体认证失败</span>'
	} else if (e === '000013') {
		return '<span class="produceProgress f-13 goingStatus">已付款</span>'
	}
}



	//点击图片放大
	$scope.isNoShowHeader=false;
	$scope.changePic=function(){
		$scope.isShowBigPic=true;
		$scope.isNoShowHeader=true;
	}
	//关闭放大图片
	$scope.closeBigPic=function(){
		$scope.isShowBigPic=false;
		$scope.isNoShowHeader=false;
	}
})