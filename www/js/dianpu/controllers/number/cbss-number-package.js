appControllers.controller('dianpu-cbss-package-list', function($scope, $rootScope, $http, $state, my) {

	$scope.title = "套餐";
	$scope.changshiShow = changshiProduct;


	$scope.queryCommissionRelList = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'commission/queryCommissionRelList',
			params:{
				"token":$rootScope.token,
				"source":"000001"
			}
		}).success(function(data){
			if(data.data && data.data.length){
				for(var i in data.data){
					var temp = data.data[i];
					if(Number(temp.price) >= Number(telInfo['lowCost'])){
						temp["productName"] = temp["productAlias"] ? temp["productAlias"] : temp["productName"];
						$scope.packageList.push(temp);
					}
				}
			}
			if($scope.packageList.length){
				my.loaddingHide();
				if(service_type == "cbssPhoneGiveFee"){
					$scope.phoneGiveFee_filter($scope.packageList)
				}
			}else{
				$scope.queryToContractPage();
			}
		}).error(function(){
			$scope.queryToContractPage();
		});
	}
	
	$scope.queryToContractPage = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'shopAndroid/toContractPage',
			params : {
				"token":$rootScope.token,
				"source":"000001",
				"number":telInfo['tel'],
				"price":telInfo['lowCost'],
				"poolId":telInfo["poolId"]
			}
		}).success(function(data){
			// show = true 可以使用 false= 该号码已被其他人订购，请选择其他号码
			my.loaddingHide();
			if(service_type == "cbssPhoneGiveFee"){
				$scope.phoneGiveFee_filter(data.list)
			}else{
				$scope.packageList = data.list;
				if(scanCode_order.orderCode){
					$scope.packageList.unshift({
						"productId":scanCode_order.productId,
						"productName":scanCode_order.productName,
						"productExplain":"",
						"hot":true
					})
				}
			}
		}).error(function(){
			my.alert("获取可用套餐失败!")
		});
	}


	$scope.phoneGiveFee_filter = function(data){
		$scope.packageList = [];
		for (var i in data) {
			if(cbss_huabei == 1){
				if(["90356341", "90356344", "90356346"].indexOf(data[i]["productId"]) !== -1){
					$scope.packageList.push(data[i]);
				}
			}else{
				if((data[i].price >= 56 && data[i]["productName"].substring(0, 4) != '4G本地') || data[i]["productName"].indexOf("固话伴侣-移网套餐") !== -1){
					$scope.packageList.push(data[i]);
				}
			}
		}
	}

	$scope.details = function(id){
		my.alert($scope.packageList[id].productExplain, $scope.packageList[id].productName)
	}


	$scope.order = function(index){
		telInfo["productId"] = $scope.packageList[index]["productId"];
		if($scope.packageList[index].preChareList || $scope.packageList[index].activeList){
			cbss_commission = $scope.packageList[index];
		}
		$state.go("dianpu-cbbs-package-result");
	}


		$scope.packageList = [];
		my.loaddingShow();
		$scope.queryCommissionRelList();

})



.controller('dianpu-cbbs-package-result', function($scope, $rootScope, $http, $state, my) {

	if(service_type == "cbssJumpHalfPackage"){
		// telInfo['productId'] = JumpHalfPackage.productId;
		for(var i in cbss_packageList){
			if(cbss_packageList[i].id == JumpHalfPackage.id){
				telInfo["productId"] = cbss_packageList[i]["productId"];
				if(cbss_packageList[i].preChareList || cbss_packageList[i].activeList){
					cbss_commission = cbss_packageList[i];
				}
			}
		}
	}

	if(yy_order.orderCode){
		for(var i in cbss_packageList){
			if(telInfo["productId"] == cbss_packageList[i]["productId"]){
				if(cbss_packageList[i].preChareList || cbss_packageList[i].activeList){
					cbss_commission = cbss_packageList[i];
				}
			}
		}
	}
	
	$scope.title = "套餐详情";
	$scope.packageList = [];

	$scope.loading = false;
	$scope.resState = true;

	// 清除所选数据sub_productObj
	dianpu_cbss_package_array["sub_productObj"] = {};
	dianpu_cbss_package_array["result"]["sub_productList"] = [];
	dianpu_cbss_package_array["result"]["sub_elementList"] = [];
	dianpu_cbss_package_array["result"]["selecteElementCode"] = "";
	
	dianpu_cbss_package_array["service"]["sub_productList"] = [];
	dianpu_cbss_package_array["service"]["sub_elementList"] = [];
	dianpu_cbss_package_array["service"]["selecteElementCode"] = "";

	dianpu_cbss_package_array["activity"]["sub_productList"] = [];
	dianpu_cbss_package_array["activity"]["sub_elementList"] = [];
	dianpu_cbss_package_array["activity"]["selecteElementCode"] = "";

	// 购机赠费清除
	dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] = "";


	$scope.getProduct = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'lancontract/queryAllPackageByProductId',
			params : {"productId":telInfo['productId'], "token":$rootScope.token}
		}).success(function(data){
			$scope.handlePackage(data);
		}).error(function(){
			my.alert('获取套餐详情失败!').then(function(){
				$scope.getProduct();
			});
		});
	}

	if(wx_order.productId && telInfo.productId != "89128067"){
		telInfo['productId'] = wx_order.productId;
		telInfo["productPrice"] = wx_order.productPrice;
		$http({
			method: 'GET',
			url: ajaxurl + 'shopApp/queryPackedProductById?token='+ $rootScope.token,
			params : {"packageId":telInfo["productId"]}
		}).success(function(data){
			telInfo["productId"] = data.data["productId"]
			telInfo["additionalId"] = arrayDelEmpty((data.data["additionalId"] ? data.data["additionalId"] : "").split(",") );
			telInfo["activityId"] = data.data["activityId"];
			$scope.queryCommission();
			
		}).error(function(data){
			my.alert("获取可用套餐失败!")
		});
		
	}else{
		$scope.getProduct();
	}

	$scope.queryCommission = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'commission/queryCommissionRelList',
			params:{
				"token":$rootScope.token,
				"source":"000001"
			}
		}).success(function(data){
			if(data.data && data.data.length){
				for(var i in data.data){
					var temp = data.data[i];
					console.log(temp.productId + "====" + telInfo["productId"])
					if(temp.productId == telInfo["productId"]){
						cbss_commission = temp;
					}
				}
			}
			$scope.getProduct();
		}).error(function(){
			$scope.getProduct();
		});
		
	}


	$scope.handlePackage = function(data){
		$scope.loading = true;
		$scope.resState = false;
		// 获取的原始信息 抛出给全局变量 下一步需要
		cbss_package_original = {};

		// 组装订单需要的 套餐 信息
		dianpu_cbss_package_array["sub_productObj"] = data.productInfo;
		dianpu_cbss_package_array["result"]["sub_productList"].push(data.productInfo);

		var productConfig = {}
		if(data.configList && data.configList.config){
			productConfig = JSON.parse(data.configList.config);
		}

		for(var i in data.resultList){
			var row = data.resultList[i];
			if(row.packageBo.showTag == "1"){
				// $scope.packageType = 0;
				var list = []
				for(var ii in row.elementList){
					if(row.elementList[ii].showTag == "1"){
						row.elementList[ii].defaultTag = (row.elementList[ii].defaultTag === "1")
						list.push(row.elementList[ii]);
					}else{
						dianpu_cbss_package_array["result"]["sub_elementList"].push(row.elementList[ii]);
						dianpu_cbss_package_array["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
					}
				}
				$scope.packageList.push({"package":row.packageBo,"elementList":list});
			}else{
				for(var ii in row.elementList){
					dianpu_cbss_package_array["result"]["sub_elementList"].push(row.elementList[ii]);
					dianpu_cbss_package_array["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
				}
			}
		}

		// 附加产品
		cbss_package_original.serviceList = [];
		for(var i in data.serviceList){
			if(data.serviceList[i]["productName"].indexOf("集客") === -1){
				var obj = {};
				obj["elementList"] = JSON.parse(JSON.stringify(data.serviceList[i].fj2ndLevelList));
				obj["productInfo"] = data.serviceList[i];
				delete obj["productInfo"].fj2ndLevelList
				cbss_package_original.serviceList.push(obj);
			}
		}

		// 活动
		cbss_package_original.activityList = [];
		if(cbss_commission.activeList){
			var activityList = [];
			for(var i in cbss_commission.activeList){
				activityList.push(cbss_commission.activeList[i].activeId)
			}
			for(var i in data.activityList)
			{
				if(activityList.indexOf(data.activityList[i].productId) !== -1){
					var obj = {}
					obj["elementList"] = JSON.parse(JSON.stringify(data.activityList[i].fj2ndLevelList));
					obj["productInfo"] = data.activityList[i];
					delete obj["productInfo"].fj2ndLevelList
					cbss_package_original.activityList.push(obj)
				}
			}
		}

		cbss_package_original.group = Boolean(productConfig.product && productConfig.product.group);
	}

	$scope.pushNotificationChange = function(packageId, elementId) {
		for(var i in $scope.packageList){
			if($scope.packageList[i].package.packageId == packageId){
				for(var ii in $scope.packageList[i].elementList){
					if($scope.packageList[i].elementList[ii].elementId != elementId){
						$scope.packageList[i].elementList[ii]["defaultTag"] = false;
					}
				}
			}
		}
	};

	$scope.order = function () {

		lanElementId = {};
		var pushElement = [];
		var pushElementCode = "";
		for(var i in $scope.packageList){
			for(var ii in $scope.packageList[i].elementList){
				var item = $scope.packageList[i].elementList[ii]
				if(item.defaultTag === true){
					if($scope.packageList[i].package.forceTag === "1"){
						lanElementId = {
							"packageId":$scope.packageList[i].package.packageId,
							"elementId":item.elementId
						}
					}
					pushElement.push(item);
					pushElementCode = item.elementId+",";
				}
			}
		}

		if(lanElementId.elementId){
			dianpu_cbss_package_array["result"]["sub_elementList"] = 
				dianpu_cbss_package_array["result"]["sub_elementList"].concat(pushElement);
			dianpu_cbss_package_array["result"]["selecteElementCode"] +=  pushElementCode;
		}else{
			my.alert("有必选项没有选择!");
			return ;
		}

		// 如果是副卡直接跳转
		if(service_type == "cbssFuka"){
			$state.go(jump[service_type]["dianpu-cbss-package-list"]);
			return ;
		}

		if(service_type == "cbssPhoneGiveFee"){
			if(cbss_package_original.serviceList.length){
				$state.go("dianpu-cbbs-package-service");
			}else{
				$state.go("dianpu-cbss-phoneGiveFee");
			}
		}else{
			if(cbss_package_original.serviceList.length){
				$state.go("dianpu-cbbs-package-service");
			}else{
				if(cbss_package_original.activityList.length){
					$state.go("dianpu-cbbs-package-activity");
				}else{
					if(cbss_package_original.group){
						$state.go("dianpu-cbbs-package-GroupInfo");
					}else{
						if(reelectPackage == 1){
							$state.go(jump[service_type]["authentication"]);
						}else{
							if(wx_order.orderCode){
								$state.go("dianpu-cbss-write-sim");
							}else{
								$state.go("authentication-device");
							}
						}	
					}
				}
			}
		}
	}
})



.controller('dianpu-cbbs-package-service', function($scope, $state) {

	$scope.title = "套餐附加产品";

	// 清除所选数据
	dianpu_cbss_package_array["service"]["sub_productList"] = [];
	dianpu_cbss_package_array["service"]["sub_elementList"] = [];
	dianpu_cbss_package_array["service"]["selecteElementCode"] = "";

	$scope.serviceList = cbss_package_original.serviceList;


	$scope.order = function(){
		for(var i in $scope.serviceList){
			if($scope.serviceList[i].check){
				dianpu_cbss_package_array["service"]["sub_productList"].push($scope.serviceList[i].productInfo);
				for(var j in $scope.serviceList[i].elementList){
					for(var jj in $scope.serviceList[i].elementList[j]["elementList"]){
						dianpu_cbss_package_array["service"]["sub_elementList"].push($scope.serviceList[i].elementList[j]["elementList"][jj]);
						dianpu_cbss_package_array["service"]["selecteElementCode"] +=  $scope.serviceList[i].elementList[j]["elementList"][jj]["elementId"]+",";
					}
				}
			}
		}
		if(service_type == "cbssPhoneGiveFee"){
			$state.go("dianpu-cbss-phoneGiveFee");
		}else{
			if(cbss_package_original.activityList.length){
				$state.go("dianpu-cbbs-package-activity");
			}else{
				if(cbss_package_original.group){
					$state.go("dianpu-cbbs-package-GroupInfo");
				}else{
					if(reelectPackage == 1){
						$state.go(jump[service_type]["authentication"]);
					}else{
						if(wx_order.orderCode){
							$state.go("dianpu-cbss-write-sim");
						}else{
							$state.go("authentication-device");
						}
					}
				}
			}
		}
	}
})









.controller('dianpu-cbbs-package-activity', function($scope, $state) {


	$scope.title = "套餐活动";
	$scope.select = {"elementMap":""};

	// 清除所选数据
	dianpu_cbss_package_array["activity"]["sub_productList"] = [];
	dianpu_cbss_package_array["activity"]["sub_elementList"] = [];
	dianpu_cbss_package_array["activity"]["selecteElementCode"] = "";

	$scope.queryactivitylist = cbss_package_original.activityList;

	$scope.order = function(){
		if($scope.select.elementMap == ""){
			$scope.go();
		}else{
			dianpu_cbss_package_array["activity"]["sub_productList"].push($scope.select.elementMap.productInfo);
			for(var i in $scope.select.elementMap['elementList']){
				for(var ii in $scope.select.elementMap['elementList'][i].elementList){
					dianpu_cbss_package_array["activity"]["sub_elementList"].push($scope.select.elementMap['elementList'][i].elementList[ii]);
					dianpu_cbss_package_array["activity"]["selecteElementCode"] +=  $scope.select.elementMap['elementList'][i].elementList[ii]["elementId"]+",";
				}
			}
			$scope.go();
		}
	}

	$scope.go = function(){
		if(cbss_package_original.group){
			$state.go("dianpu-cbbs-package-GroupInfo");
		}else{
			if(reelectPackage == 1){
				$state.go(jump[service_type]["authentication"]);
			}else{
				if(wx_order.orderCode){
					$state.go("dianpu-cbss-write-sim");
				}else{
					$state.go("authentication-device");
				}
			}
		}
	}
})


.controller('dianpu-cbbs-package-GroupInfo', function($scope, $state, unicomm_server) {


	$scope.title = "集团信息";
	$scope.input = {"groupCode":""};
	$scope.resState = false;
	dianpu_cbss_groupData = null;


	$scope.order = function(){
		$scope.resState = true;
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
					"cmd":"cbss_order_queryGroupInfo",
					"groupCode":$scope.input.groupCode 
				})
				.then(
					function(result_json){
						if(result_json.status == "1"){
							dianpu_cbss_groupData = {
								"groupCode":$scope.input.groupCode,
								"userIdA":result_json.data.userIdA,
								"relationTypeCode":result_json.data.relationTypeCode,
								"selectedRoleCode":"1"
							};
							if(wx_order.orderCode){
								$state.go("dianpu-cbss-write-sim");
							}else{
								$state.go("authentication-device");
							}
						}else{
							my.alert(result_json.data).then(function(){
								$scope.resState = false;
							});
						}
					}
					, function(){
						$scope.resState = false;
					}
				)
		});
	};
})
;



		// if($scope.packageType == "0"){
		// 	var elementId = "";
		// 	for(var i in $scope.packageList){
		// 		for(var ii in $scope.packageList[i].list){
		// 			if($scope.packageList[i].list[ii]["check"]){
		// 				dianpu_cbss_package_array["result"].sub_elementList.push($scope.packageList[i].list[ii]["list"]);
		// 				elementId  += $scope.packageList[i].list[ii]["list"]["elementId"]+",";
		// 			}
		// 		}
		// 	}
		// 	if(elementId === ""){
		// 		my.alert('请选择一个主餐包!');
		// 		return false;
		// 	}
			
		// 	// dianpu_cbss_package_array["result"].selecteElementCode +=  elementId;
		// 	// if($scope.packageListDefault.length){
		// 	// 	for(var i in $scope.packageListDefault){
		// 	// 		dianpu_cbss_package_array["result"].sub_elementList.push($scope.packageListDefault[i]);
		// 	// 		dianpu_cbss_package_array["result"].selecteElementCode +=  $scope.packageListDefault[i]["elementId"]+",";
		// 	// 	}
		// 	// }

		// }else if($scope.packageType == "1"){

		// 	$scope.select = {"elementMap":null};	// 2级结构保存坐标
		// 	for(var i in $scope.packageList){
		// 		for(var ii in $scope.packageList[i].list){
		// 			if($scope.packageList[i].list[ii]["check"]){
		// 				$scope.select.elementMap = $scope.packageList[i].list[ii].list;
		// 			}
		// 		}
		// 	}
			
		// 	if($scope.select.elementMap == null){
		// 		my.alert('请选择一个主餐包!');
		// 		return false;
		// 	}
		// 	for(var i in $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"]){
		// 		dianpu_cbss_package_array["result"]["sub_elementList"][$scope.reArrayid[i]] = $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"][i];
		// 		dianpu_cbss_package_array["result"].selecteElementCode +=  $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"][i]["elementList"];
		// 	}
		// }


		// if(!$scope.packageList.length){
		// 	$scope.packageType = 1;
		// 	$http({
		// 		method: 'GET',
		// 		url: ajaxurl + 'lancontract/queryChargingPackage',
		// 		params : {"productId":telInfo['productId'], "token":$rootScope.token}
		// 	}).success(function(data){
		// 		var list = [];
		// 		$scope.ChargingPackage = data;

		// 		for(var i in data.resultList){
		// 			// 如果
		// 			if(data["resultList"][i]["packageBo"]["defaultTag"] == "1"){
		// 				for(var ii in data["resultList"][i]["elementList"]){
		// 					var dd = data["resultList"][i]["elementList"][ii];
		// 					for(var jj in dianpu_cbss_package_array["result"]["sub_elementList"]){
		// 						if(dd["elementId"] == dianpu_cbss_package_array["result"]["sub_elementList"][jj]["elementId"] ){
		// 							$scope.reArrayid.push(jj);
		// 						}
		// 					}
		// 				}
		// 			}
		// 			//
		// 			list.push({"name":data["resultList"][i]["packageBo"]["packageName"], "list":i});
		// 		}
		// 		// 抛出 让用户选择
		// 		$scope.packageList.push({"name":"资费包详情","list":list});
		// 	});
		// }
