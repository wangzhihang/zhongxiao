appControllers.controller('jike-cbbs-package-result', function($scope, $rootScope, $http, $state, $ionicPopup) {

	$scope.title = "套餐详情";
	$scope.packageList = [];
	$scope.select = {"elementMap":null};	// 3级结构保存内容 2级结构保存坐标
	$scope.packageType = null;		// 0 为直接显示3级结构,1 选中显示二级结构内容但保存的是3级内容
	$scope.ChargingPackage = null;	// 如果是3级结构 临时变了保存

	$scope.packageListDefault = [];		// 冰激凌套餐(或者其他选项)有些需要加默认选项

	$scope.reArrayid = [];
	$scope.loading = [false];
	$scope.resState = true;
	
	// 清除所选数据sub_productObj
	sub_productObj = "";
	jike_cbss_package_arr["result"]["sub_productList"] = [];
	jike_cbss_package_arr["result"]["sub_elementList"] = [];
	jike_cbss_package_arr["result"]["selecteElementCode"] = "";

	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryAllPackageByProductId',
		params : {"productId":group['productId'], "token":$rootScope.token}
	}).success(function(data){
		$scope.loading = true;
		$scope.resState = false;

		cbss_package_original = {}

		// 组装订单需要的 套餐 信息
		sub_productObj = data.productInfo;
		jike_cbss_package_arr["result"]["sub_productList"].push(data.productInfo);

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
						jike_cbss_package_arr["result"]["sub_elementList"].push(row.elementList[ii]);
						jike_cbss_package_arr["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
					}
				}
				$scope.packageList.push({"package":row.packageBo,"elementList":list});
			}else{
				for(var ii in row.elementList){
					jike_cbss_package_arr["result"]["sub_elementList"].push(row.elementList[ii]);
					jike_cbss_package_arr["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
				}
			}
		}


		cbss_package_original.serviceList = [];

		// 活动
		cbss_package_original.activityList = [];
		for(var i in data.activityList)
		{
			var obj = {}
			obj["elementList"] = JSON.parse(JSON.stringify(data.activityList[i].fj2ndLevelList));
			obj["productInfo"] = data.activityList[i];
			delete obj["productInfo"].fj2ndLevelList
			cbss_package_original.activityList.push(obj)
		}

	}).error(function(data){
		$ionicPopup.alert({title: '提示',template: '获取套餐详情失败!',okText:'我知道了',okType:'button-calm'});
	});

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
			jike_cbss_package_arr["result"]["sub_elementList"] = 
				jike_cbss_package_arr["result"]["sub_elementList"].concat(pushElement);
			jike_cbss_package_arr["result"]["selecteElementCode"] +=  pushElementCode;
		}else{
			my.alert("有必选项没有选择!");
			return ;
		}

		// 半成卡 跳过 附加产品和活动
		if(service_type == "groupCbssSemiManufactures"){
			if(authentication["name"]){
				$state.go(jump[service_type].authentication);
			}else{
				$state.go("authentication-device");
			}
		}else{
			$state.go("jike-cbbs-package-service");
		}
	}
})







.controller('jike-cbbs-package-service', function($scope, $rootScope, $http, $state, $ionicPopup, unicomm_server) {
	$scope.title = "套餐附加产品";
	$scope.select = {"elementMap":""}
	$scope.loading = [true];
	$scope.resState = true;

	// 清除所选数据
	jike_cbss_package_arr["service"]["sub_productList"] = [];
	jike_cbss_package_arr["service"]["sub_elementList"] = [];
	jike_cbss_package_arr["service"]["selecteElementCode"] = "";


	$scope.serviceList = [];// 菜单列表
	$scope.showChenk = {};	// 子菜单开关
	$scope.serviceSon = {};	// 选中的子菜单
	$scope.parentList = {};	// 选中父级的内容列表


	unicomm_command = {
		"cmd":"cbss_product_queryproductlist"
		, "productTypeCode":group["productObj"]["productTypeCode"]
		, "branchCode":group["productObj"]["brandCode"]
		, "productId":group["productObj"]["productId"]
		, "groupUserId":group["productUserId"]
	}
	unicomm_server.cbssLogin().then(
		function(){
			$scope.loading[0] = false;
			unicomm_server.getUnicomm(unicomm_command).then(
				function(return_json){
					$scope.loading[0] = true;
					$scope.resState = false;
					$scope.serviceList = [];
					if (return_json.status == "1"){
						if(service_type == "groupSfCbssSemiManufactures"){
							for(var i in return_json.data.service){
								var productName = return_json.data.service[i]["productName"].indexOf("集客冰激凌");
								if(productName >= 0){
									$scope.serviceList.push(return_json.data.service[i])
								}
							}
						}else{
							$scope.serviceList = return_json.data.service;
						}
					}
				},
				function(textStatus, errorThrown){
					$ionicPopup.alert({"title":textStatus,"template":errorThrown});
				}
			);
		},
		function()
		{
			$ionicPopup.alert({title: '提示',template: "登录失败,请联系管理员!"});
		}
	);

	$scope.selectP = function(row){
		if($scope.showChenk[row["productId"]]){
			$scope.showChenk[row["productId"]] = false;
		}else{
			$scope.showChenk[row["productId"]] = true;
			unicomm_command = {
				"cmd":"getPackageDetail"
				, "productId":row["productId"]
				, "modifyTag":row["modifyTag"]
				, "productMode":row["productMode"]
			}
			unicomm_server.cbssLogin().then(
				function(){
					unicomm_server.getUnicomm(unicomm_command).then(
						function(data){
							if (data.status == "1"){
								var elementList = data.data[0]['element'];
								var arr = [];
								for(var ii in elementList){
									if(elementList[ii].defaultTag == 1){
										arr.push({"name":elementList[ii]["elementName"],"list":elementList[ii], "check":true})
									}else{
										arr.push({"name":elementList[ii]["elementName"],"list":elementList[ii], "check":false})
									}
								}
								$scope.parentList[row["productId"]] = row;
								$scope.serviceSon[row["productId"]] = arr;
							} else {
							}
						},
						function(textStatus, errorThrown){
							$ionicPopup.alert({"title":textStatus,"template":errorThrown});
						}
					);
				},
				function()
				{
					$ionicPopup.alert({title: '提示',template: "登录失败,请联系管理员!"});
				}
			);
		}
	}


	$scope.order = function(data){
		var sonData = false;	// 子集是否有内容
		for(var i in $scope.showChenk){
			if($scope.showChenk[i]){
				sonData = false;
				for(var ii in $scope.serviceSon[i]){
					if($scope.serviceSon[i][ii].check){
						sonData = true;
						jike_cbss_package_arr["service"]["sub_elementList"].push($scope.serviceSon[i][ii].list);
						jike_cbss_package_arr["service"]["selecteElementCode"] +=  $scope.serviceSon[i][ii].list["elementId"]+",";
					}
				}
				if(sonData){
					// 子集有内容 选中的父级才需要加进去
					jike_cbss_package_arr["service"]["sub_productList"].push($scope.parentList[i]);
				}
			}
		}
		if(cbss_package_original.activityList.length){
			$state.go("jike-cbbs-package-activity");
		}else{
			if(authentication["name"]){
				$state.go(jump[service_type].authentication);
			}else{
				$state.go("authentication-device");
			}
		}
	}
})



.controller('jike-cbbs-package-activity', function($scope, $rootScope, $http, $state, $ionicPopup, unicomm_server) {

	$scope.title = "套餐活动";
	$scope.select = {"elementMap":""};

	// 清除所选数据
	jike_cbss_package_arr["activity"]["sub_productList"] = [];
	jike_cbss_package_arr["activity"]["sub_elementList"] = [];
	jike_cbss_package_arr["activity"]["selecteElementCode"] = "";

	$scope.queryactivitylist = cbss_package_original.activityList;

	$scope.order = function(){
		if($scope.select.elementMap == ""){
			$scope.go();
		}else{
			jike_cbss_package_arr["activity"]["sub_productList"].push($scope.select.elementMap.productInfo);
			for(var i in $scope.select.elementMap['elementList']){
				for(var ii in $scope.select.elementMap['elementList'][i].elementList){
					jike_cbss_package_arr["activity"]["sub_elementList"].push($scope.select.elementMap['elementList'][i].elementList[ii]);
					jike_cbss_package_arr["activity"]["selecteElementCode"] +=  $scope.select.elementMap['elementList'][i].elementList[ii]["elementId"]+",";
				}
			}
			$scope.go();
		}
	}

	$scope.go = function(){
		if(authentication["name"]){
			$state.go(jump[service_type].authentication);
		}else{
			$state.go("authentication-device");
		}
	}

})
;