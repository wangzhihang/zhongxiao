appControllers.controller('dianpu-cbss-phoneGiveFee', function($scope, $rootScope, $http, $state, unicomm_server, $cordovaBarcodeScanner, my) {

	dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] = "";
	dianpu_phoneGiveFee["phoneinfo"] = {}

	$scope.title = "购机赠费活动";
	$scope.input = {"imei":""};
	$scope.imeiList = [];
	$scope.imeiListShow = false;

	$scope.activityListDom = false;
	$scope.loading = false;
	$scope.resState = false;
	
	$scope.select = {"elementMap":""};

	$scope.qrImei = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.input.imei = barcodeData.text;
				}else{
				}
			});
	};

	$scope.queryPhoneInfo = function(){
		$scope.resState = true;
		if($scope.input.imei == ""){
			my.alert("请输入或扫描手机IEMI码。");
		}else{
			$scope.loading = true;
			dianpu_phoneGiveFee.imei = $scope.input.imei;
			$scope.getPhoneList();
		}
	}

	$scope.getPhoneList = function(){
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
					"cmd":"cbss_product_getPhoneList",
					"imei":dianpu_phoneGiveFee["imei"]
				})
				.then(
					function(result_json){
						if(result_json.status == "1" && result_json.data.length){
							dianpu_phoneGiveFee["phoneinfo"] = result_json.data[0];
							if(dianpu_phoneGiveFee["phoneinfo"]["deviceno"]){
								$scope.getActivityList();
							}
						}else{
							$scope.loading = false;
							$scope.resState = false;
							my.alert("IMEI信息没有查到手机信息");
						}
					}
					, function(){
						$scope.loading = false;
						$scope.resState = false;
					}
				)
		});
	}

	$scope.getActivityList = function(){
		unicomm_server.getUnicomm({
			"cmd":"showactivitydetail",
			"root":"SALE",
			"productTypeCode":"GJRM001",
			"productId":dianpu_cbss_package_array["sub_productObj"]["productId"]?dianpu_cbss_package_array["sub_productObj"]["productId"]:changeOrderInfo.oldProductId,
			"number":telInfo["tel"],
			"deviceType":dianpu_phoneGiveFee["phoneinfo"]["resourcesModelCode"],
			"deviceBrand":dianpu_phoneGiveFee["phoneinfo"]["resourcesBrandCode"],
			"deviceNumber":dianpu_phoneGiveFee["phoneinfo"]["deviceno"]
		})
		.then(
			function(result_json){
				if(result_json.status == "1"){
					$scope.activityList = result_json.data;
					if(cbss_huabei === 1){
							$scope.showactivitydetail();
					}else{
						$scope.activityListDom = true;
						$scope.loading = false;
						$scope.resState = false;
					}
				}else{
					$scope.loading = false;
					$scope.resState = false;
					my.alert(result_json.data);
				}
			}
		)
	}

	$scope.showactivitydetail = function(){
		unicomm_server.getUnicomm({
			"cmd":"showactivitydetail",
			"root":"SALE",
			"productTypeCode":"HBZX003",
			"productId":dianpu_cbss_package_array["sub_productObj"]["productId"]?dianpu_cbss_package_array["sub_productObj"]["productId"]:changeOrderInfo.oldProductId,
			"number":telInfo["tel"],
			"deviceType":dianpu_phoneGiveFee["phoneinfo"]["resourcesModelCode"],
			"deviceBrand":dianpu_phoneGiveFee["phoneinfo"]["resourcesBrandCode"],
			"deviceNumber":dianpu_phoneGiveFee["phoneinfo"]["deviceno"]
		})
		.then(
			function(result_json){
				$scope.loading = false;
				$scope.resState = false;
				if(result_json.status == "1"){
					$scope.activityList = $scope.activityList.concat(result_json.data);
					if($scope.activityList.length == 0){
						my.alert("未查询到相应的活动，可能由以下原因造成：<br>1.该串码不支持此活动，请更换串码;<br>2.cbss无花呗分期活动权限，请联系渠道经理赋权");
					}else{
						$scope.activityListDom = true;
					}
				}else{
					my.alert(result_json.data);
				}
			}
		)
	}

	$scope.order = function(){
		$scope.loading = false;
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			my.alert('请选择一个活动。').then(function(){
				$scope.loading = true;
				$scope.resState = false;
			});
		}else{
			for(var i in $scope.select.elementMap.package[0].element){
				dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"].push($scope.select.elementMap.package[0].element[i]);
				dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] += $scope.select.elementMap.package[0].element[i]["elementId"]+",";
			}
			delete $scope.select.elementMap.package;
			dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"].push($scope.select.elementMap);

			$http({
				method: 'GET',
				url: ajaxurl + 'orderApp/updateActivityForShopNumberOrder?token='+ $rootScope.token,
				params : {"orderNo":authentication["orderNo"],"activityId":$scope.select.elementMap['productId'], "activityName":$scope.select.elementMap["productName"]}
			}).success(function(){
				if(reelectPhone == 1){
					$state.go(jump[service_type]["authentication"]);
				}else{
					if(wx_order.orderCode){
						$state.go("dianpu-cbss-write-sim");
					}else{
						$state.go("authentication-device");
					}
				}
			}).error(function(){
				my.alert("生成订单失败，请重新提交。").then(function(){
					$scope.loading = true;
					$scope.resState = false;
				});
			});
		}
	}


	
	$scope.setImei = function(){
		$scope.activityListDom = false;
	}

	$http({
		method: 'GET',
		url: ajaxurl + 'imei/queryImeiList',
		params : {"status":"000001","pageSize":"10", "pageIndex":"1", "token":$rootScope.token}
	}).success(function(data){
		if(data.imeiList.length){
			$scope.imeiListShow = true;
			$scope.imeiList = data.imeiList;
		}
	})

	$scope.setImeiZhanYong = function(i){
		$http({
			method: 'POST',
			url: ajaxurl + 'imei/setImeiZhanYong',
			data: {"id":$scope.imeiList[i].id},
			params: {"token":$rootScope.token}
		}).success(function(data){
			if(data){
				$scope.input.imei = $scope.imeiList[i].imei;
				dianpu_phoneGiveFee.imeiId = $scope.imeiList[i].id;
				$scope.order();
			}else{
				my.alert("已被其他人选中，请换一个");
			}
		})
	}

})
;