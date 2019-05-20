appControllers.controller('dianpu-wx-lan-order-detail', function($scope,$state,$rootScope, $http, $ionicPopup,$ionicLoading,my) {
	$scope.title = '预约订单详情';
	$scope.loading = false;
	// $ionicLoading.show({template: '数据加载中...'});
	var orderStatus = {
		 "000000":{"text":"全部订单"}
		,"000001":{"text":"待处理"}
		,"000002":{"text":"地址预判成功,等待实名"}
		,"000003":{"text":"实名成功,等待开卡"}
		,"000004":{"text":"开卡成功,等待快递"}
		,"000005":{"text":"快递中"}
		,"000100":{"text":"订单完成,未收费"}
		,"000101":{"text":"订单完成,已收费"}
		,"000200":{"text":"订单失败"}
		,"000201":{"text":"用户取消"}
	}
	$scope.orderInfo = {};
	$http({
		method: 'GET',
		url: ajaxurl + "lanPreorderApp/queryPreorderDetailByOrderCode?token=" + $rootScope.token,
		params: {"orderCode":order["orderCode"]},
		timeout: 5000
	}).success(function(data){
		$scope.loading = true
		// $ionicLoading.hide();
		//console.log(JSON.stringify(data));
		if(data.preorderInfo){
			$scope.preorderInfo=data.preorderInfo;
			$scope.orderInfo = data;
			// if($scope.status=="000003"){
				$scope.btnIsHide=false;
			// }else{
			// 	$scope.btnIsHide=true;
			// }
			//是否有活动
			if($scope.preorderInfo.remark==""||$scope.preorderInfo.remark==null){
				$scope.numberActive=false;
			}
			else{
				$scope.numberActive=true;
			}
			$scope.OrderState=orderStatus[$scope.preorderInfo.status].text;					
		}
	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
              $state.go('index');
          }); 
    });
	
		//点击办理
	$scope.manage=function(){
		
		empty_filterSelect();
        filterSelect = {};
        reset_kuandai_wojia();
        order_type = "kuandai";
        app = "kuandai";
        number_pool = "CBSS";
        wojiaIsronghe = false;  // 判断是不是共享套餐
        wojiaRootProductId = "89706086";
        KuandaiMainProductName = "沃家组合";
        service_type = "wojia-combination";
        kuandai_number_into = true;
        reelectNumber = 0;
		
		authentication["name"] 		= $scope.orderInfo.customerInfo["name"];
		authentication["cardId"] 	= $scope.orderInfo.customerInfo["cardId"];
		authentication["address"] 	= $scope.orderInfo.customerInfo["address"];
		authentication["birthday"] 	= $scope.orderInfo.customerInfo["birthday"];
		authentication["police"] 	= $scope.orderInfo.customerInfo["police"];
		authentication["nation"] 	= $scope.orderInfo.customerInfo["nation"];
		authentication["gender"] 	= $scope.orderInfo.customerInfo["sex"];
		authentication["start_date"]= $scope.orderInfo.customerInfo["validStart"];
		authentication["end_date"] 	= $scope.orderInfo.customerInfo["validEnd"];
		authentication["contractNumber"] = $scope.orderInfo.customerInfo["contactNumber"];
		authentication["idHeadImgUrl"] = $scope.orderInfo.customerInfo["idCardHeadUrl"];
		authentication["customerImageUrl"] = $scope.orderInfo.customerInfo["customerImageUrl"];
		authentication["idHeadImg"] = $scope.orderInfo.customerInfo[""];
		authentication["sign"] = $scope.orderInfo.combineInfo["signUrl"];
		authentication["orderNo"] = $scope.orderInfo.customerInfo["orderNo"];

		wx_order = {"orderCode":$scope.orderInfo.preorderInfo["orderCode"]}
        $state.go("kuandai-wojia-address-area");
	}
	
	//放弃订单
	$scope.giveUp=function(){
			//console.log(index);
//			$scope.orderCode=data.orderInfo['orderCode'];
			$scope.orderStatus="000003";
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
							url:ajaxurl + '/wechatShopApp/updateLanPreorderStatus?token=' + $rootScope.token,
							params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus}
						}).success(function(data){
							//console.log(JSON.stringify(data));
							$scope.btnIsHide=false;
						});
			         }
			       },
			     ]
		       
		     });
		     confirmPopup.then(function(res) {
		       
		     });

	}
});
