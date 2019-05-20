appControllers.controller('dianpu-cbss-package-list', function($scope, $rootScope, $http, $state, my) {

	$scope.title = "套餐";
	$scope.packageList = [];
	my.loaddingShow();

	$http({
		method: 'GET',
		url: ajaxurl + 'shopAndroid/toContractPage?token='+ $rootScope.token,
		params : {"source":"000001", "number":telInfo['tel'], "price":telInfo['lowCost'], "poolId":telInfo["poolId"]}
	}).success(function(data){
		// show = true 可以使用 false= 该号码已被其他人订购，请选择其他号码
		my.loaddingHide();
		if(service_type == "cbssPhoneGiveFee"){
			$scope.phoneGiveFee_filter(data.list)
		}else{
			$scope.packageList = data.list;
		}
	}).error(function(data){
		my.alert("获取可用套餐失败!")
	});


	$scope.details = function(id){
		my.alert($scope.packageList[id].productExplain, $scope.packageList[id].productName)
	}


	$scope.phoneGiveFee_filter = function(data){
		for (var i in data) {
			// 本地56套餐 有一个可以 一个不可以 所以暂时先屏蔽掉 本地
			// if(data[i].price >= 56 && (data[i]["productName"].substring(0, 4) == '4G全国' || data[i]["productName"].substring(0, 4) == '4G本地')){
			// 	$scope.packageList.push(data[i]);
			// }
			if(data[i].price >= 56 && data[i]["productName"].substring(0, 4) != '4G本地'){
				$scope.packageList.push(data[i]);
			}
		}
	}


	$scope.order = function(index){
		telInfo["productId"] = $scope.packageList[index]["productId"];
		order_info = {
			  "number":telInfo['tel']
			, "productId":$scope.packageList[index]["productId"]
			, "productName":$scope.packageList[index]["productName"]
		}
		$state.go("dianpu-cbbs-package-result");
	}
})



.controller('dianpu-cbss-zukaInfo', function($scope, $rootScope, $http, $state, $ionicPopup){

	$scope.title = "是否设为主卡";

	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryAllPackageList',
		params : {"productId":"89128067", "token":$rootScope.token}
	}).success(function(data){
		console.log(JSON.stringify(data))
	});	
})



.controller('dianpu-cbbs-package-result', function($scope, $rootScope, $http, $state, $ionicPopup) {

	$scope.title = "套餐详情";
	$scope.packageList = [];
	$scope.select = {"elementMap":null};	// 3级结构保存内容 2级结构保存坐标
	$scope.packageType = null;				// 0 为直接显示3级结构,1 选中显示二级结构内容但保存的是3级内容
	$scope.ChargingPackage = null;			// 如果是3级结构 临时变了保存

	$scope.packageListDefault = null;		// 冰激凌套餐(或者其他选项)有些需要加默认选项


	$scope.reArrayid = [];
	$scope.loading = false;
	$scope.resState = true;

	// 清除所选数据sub_productObj
	dianpu_cbss_package_array["sub_productObj"] = {};
	dianpu_cbss_package_array["result"]["sub_productList"] = [];
	dianpu_cbss_package_array["result"]["sub_elementList"] = [];
	dianpu_cbss_package_array["result"]["selecteElementCode"] = "";

	// 购机赠费清除
	dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] = "";

	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryAllPackageList',
		params : {"productId":telInfo['productId'], "token":$rootScope.token}
	}).success(function(data){
		$scope.loading = true;
		$scope.resState = false;
		// 获取的原始信息 抛出给全局变量 下一步需要
		cbss_package_original = data; // (不需要了应该)

		// 组装订单需要的 套餐 信息
		dianpu_cbss_package_array["sub_productObj"] = data.productInfo;
		dianpu_cbss_package_array["result"]["sub_productList"].push(data.productInfo);


		for(var i in data.resultList){
			var row = data.resultList[i];
			if(row.packageBo.maxNumber == "1"){
				$scope.packageType = 0;
				var list = []
				for(var ii in row.elementList){
					if(row.elementList[ii].hasAttr == "3"){
						$scope.packageListDefault = row.elementList[ii];
					}else{
						list.push({"name":row.elementList[ii]["elementName"],"list":row.elementList[ii]});
					}
				}
				$scope.packageList.push({"name":row.packageBo.packageName,"list":list});
			}else{
				for(var ii in row.elementList){

					if(row.elementList[ii].defaultTag === "1"){
						// 默认选中的
						dianpu_cbss_package_array["result"]["sub_elementList"].push(row.elementList[ii]);
						dianpu_cbss_package_array["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
					}
				}
			}
		}


		if(!$scope.packageList.length){
			$scope.packageType = 1;
			$http({
				method: 'GET',
				url: ajaxurl + 'lancontract/queryChargingPackage',
				params : {"productId":telInfo['productId'], "token":$rootScope.token}
			}).success(function(data){
				var list = [];
				$scope.ChargingPackage = data;

				for(var i in data.resultList){
					// 如果
					if(data["resultList"][i]["packageBo"]["defaultTag"] == "1"){
						for(var ii in data["resultList"][i]["elementList"]){
							var dd = data["resultList"][i]["elementList"][ii];
							for(var jj in dianpu_cbss_package_array["result"]["sub_elementList"]){
								if(dd["elementId"] == dianpu_cbss_package_array["result"]["sub_elementList"][jj]["elementId"] ){
									$scope.reArrayid.push(jj);
								}
							}
						}
					}
					//
					list.push({"name":data["resultList"][i]["packageBo"]["packageName"], "list":i});
				}
				// 抛出 让用户选择
				$scope.packageList.push({"name":"资费包详情","list":list});
			});
		}


	}).error(function(data){
		$ionicPopup.alert({title: '提示',template: '获取套餐详情失败!',okText:'我知道了',okType:'button-calm'});
	});



	$scope.order = function () {

		if($scope.select.elementMap == null){
			$ionicPopup.alert({title: '提示',template: '请选择一个主餐包!',okText:'我知道了',okType:'button-calm'});
			return false;
		}

		if($scope.packageType == "0"){
			dianpu_cbss_package_array["result"].sub_elementList.push($scope.select.elementMap);
			dianpu_cbss_package_array["result"].selecteElementCode +=  $scope.select.elementMap["elementId"]+",";
			if($scope.packageListDefault){
				dianpu_cbss_package_array["result"].sub_elementList.push($scope.packageListDefault);
				dianpu_cbss_package_array["result"].selecteElementCode +=  $scope.packageListDefault["elementId"]+",";
			}

		}else if($scope.packageType == "1"){
			for(var i in $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"]){
				dianpu_cbss_package_array["result"]["sub_elementList"][$scope.reArrayid[i]] = $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"][i];
				dianpu_cbss_package_array["result"].selecteElementCode +=  $scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"][i]["elementList"];
				// alert(JSON.stringify($scope.ChargingPackage.resultList[$scope.select.elementMap]["elementList"][i]) );
			}
		}


		if(service_type == "cbssPhoneGiveFee"){
			$state.go("dianpu-cbbs-package-service");
		}else{
			if(cateInfo["additionalPackage"]){
				$state.go("dianpu-cbbs-package-service");
			}else{
				if(cateInfo["activity"]){
					$state.go("dianpu-cbbs-package-activity");
				}else{
					$state.go("authentication-device");
				}
			}
		}
	}
})







.controller('dianpu-cbbs-package-service', function($scope, $rootScope, $http, $state, $ionicPopup) {

	$scope.title = "套餐附加产品";
	$scope.orderNext = false;

	// 清除所选数据
	dianpu_cbss_package_array["service"]["sub_productList"] = [];
	dianpu_cbss_package_array["service"]["sub_elementList"] = [];
	dianpu_cbss_package_array["service"]["selecteElementCode"] = "";


	$scope.serviceList = [];// 菜单列表
	$scope.showChenk = {};	// 子菜单开关
	$scope.serviceSon = {};	// 选中的子菜单
	$scope.parentList = {};	// 选中父级的内容列表

	for(var i in cbss_package_original.serviceList){
		var row = cbss_package_original.serviceList[i];

		// 过滤集客附加产品
		var productName = row["productName"].indexOf("集客");
		if(productName < 0){
			$scope.serviceList.push(row);
			$scope.showChenk[row.productId] = false;
			$scope.serviceSon[row.productId] = {};
		}
	}

	$scope.selectP = function(productId){
		$scope.orderNext = true;
		if($scope.showChenk[productId]){
			$scope.showChenk[productId] = false;
			$scope.orderNext = false;
		}else{
			$scope.showChenk[productId] = true;
			$http({
				method: 'GET',
				url: ajaxurl + 'lancontract/queryPackageBo',
				params : {"productId":productId, "parentProductId":telInfo['productId'],"token":$rootScope.token}
			}).success(function(data){
				var dataList = data['resultList'];
				var arr = [];
				for (var i = 0; i < dataList.length; i++) {
					var elementList = dataList[i]['elementList'];
					var arrSon = [];
					for(var ii in elementList){
						if(elementList[ii].defaultTag == 1){
							arrSon.push({"name":elementList[ii]["elementName"],"list":elementList[ii], "check":true})
						}else{
							arrSon.push({"name":elementList[ii]["elementName"],"list":elementList[ii], "check":false})
						}
					}
					arr.push({"name":dataList[i]["packageBo"]["packageName"],"sonList":arrSon})
					
				}
				$scope.orderNext = false;

				$scope.parentList[productId] = data["productInfo"];
				$scope.serviceSon[productId] = arr;
			}).error(function(data){
				$ionicPopup.alert({title: '提示',template: '获取附加产品失败!',okText:'我知道了',okType:'button-calm'});
			});
		}
	}


	$scope.order = function(data){
		var sonData = false;	// 子集是否有内容
		console.log(JSON.stringify($scope.serviceSon))
		for(var i in $scope.showChenk){
			if($scope.showChenk[i]){
				sonData = false;
				for(var j in $scope.serviceSon[i]){
					var elementList =  $scope.serviceSon[i][j]["sonList"]
					for(var ii in elementList){
						if(elementList[ii].check){
							sonData = true;
							dianpu_cbss_package_array["service"]["sub_elementList"].push(elementList[ii].list);
							dianpu_cbss_package_array["service"]["selecteElementCode"] +=  elementList[ii].list["elementId"]+",";
						}
					}
				}
				if(sonData){
					// 子集有内容 选中的父级才需要加进去
					dianpu_cbss_package_array["service"]["sub_productList"].push($scope.parentList[i]);
				}
			}
		}


		if(service_type == "cbssPhoneGiveFee"){
			$state.go("dianpu-cbss-phoneGiveFee");		// 购机赠费
		}else{
			if(cateInfo["activity"]){
				$state.go("dianpu-cbbs-package-activity");
			}else{
				$state.go("authentication-device");
			}
		}
	}
})









.controller('dianpu-cbbs-package-activity', function($scope, $rootScope, $http, $state, $ionicPopup) {


	$scope.title = "套餐活动";
	$scope.select = {"elementMap":""};
	$scope.queryactivitylist = [];

	$scope.nocity = true;
	$scope.loading = false;
	$scope.resState = true;

	// 清除所选数据
	dianpu_cbss_package_array["activity"]["sub_productList"] = [];
	dianpu_cbss_package_array["activity"]["sub_elementList"] = [];
	dianpu_cbss_package_array["activity"]["selecteElementCode"] = "";



	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryMobileActivityList',
		params : {"productId":telInfo['productId'], "token":$rootScope.token}
	}).success(function(data){
		$scope.loading = true;
		$scope.resState = false;
		if(data.activityList.length){
			for(var i in data.activityList){
				var productName = data.activityList[i]["productName"].indexOf("集客专享");
				if(productName < 0){
					$scope.queryactivitylist.push(data.activityList[i])
				}
			}
		}
		else{
			$scope.nocity = false;
		}
	}).error(function(data){
		$state.go("authentication-device");
	});



	$scope.order = function(){
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			$state.go("authentication-device");
		}else{
			$http({
				method: 'GET',
				url: ajaxurl + 'lancontract/queryPackageBo',
				params : {"productId":$scope.select.elementMap['productId'], "parentProductId":telInfo['productId'], "token":$rootScope.token}
			}).success(function(data){
				dianpu_cbss_package_array["activity"]["sub_productList"].push(data.productInfo);

				var elementList = data['resultList'][0]['elementList'];
				for(var ii in elementList){
					dianpu_cbss_package_array["activity"]["sub_elementList"].push(elementList[ii]);
					dianpu_cbss_package_array["activity"]["selecteElementCode"] +=  elementList[ii]["elementId"]+",";
				}


				$http({
					method: 'GET',
					url: ajaxurl + 'orderApp/updateActivityForShopNumberOrder?token='+ $rootScope.token,
					params : {"orderNo":authentication["orderNo"],"activityId":$scope.select.elementMap['productId'], "activityName":$scope.select.elementMap["productName"]}
				}).success(function(data){
					$state.go("authentication-device");
				}).error(function(data){
					$ionicPopup.alert({
							  "title": "提示"
							, "template": "生成订单失败"
							, "okText": '我知道了'
							, "okType": 'button-calm'})
				});

			}).error(function(data){
			});
		}
	}

})


;
