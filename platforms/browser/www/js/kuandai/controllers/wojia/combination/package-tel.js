appControllers.controller('kuandai-wojia-combination-package-tel-list', function($scope, $rootScope, $http, $state, my) {
	$scope.title = "套餐";
	$scope.packageList = [];
	var packageList = []

	
	$scope.queryCommissionRelList = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'commission/queryCommissionRelList',
			params:{
				"token":$rootScope.token,
				"source":"100001"
			}
		}).success(function(data){
			if(data.data && data.data.length){
				for(var i in data.data){
					var temp = data.data[i];
					temp["productName"] = temp["productAlias"] ? temp["productAlias"] : temp["productName"]
					packageList.push(temp);
				}
			}
			if(packageList.length){
				my.loaddingHide();
				$scope.packageList = packageList;
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
				"token":$rootScope.token
				,"source":"000001"
				,"number":telInfo['tel']
				,"price":telInfo['lowCost']
				,"poolId":telInfo["poolId"]
			}
		}).success(function(data){
			my.loaddingHide();
			$scope.packageList = data.list;
		}).error(function(){
			my.alert("获取可用套餐失败!")
		});
	}


	my.loaddingShow();
	$scope.queryCommissionRelList();

	$scope.details = function(id){
		my.alert($scope.packageList[id].productExplain, $scope.packageList[id].productName)
	}

	$scope.order = function(index){
		cbss_commission = $scope.packageList[index];
		kuandai_tel_package['productId']  = $scope.packageList[index]["productId"];
		$state.go("kuandai-wojia-combination-package-tel-result");
	}
})


// 纳入可选套餐
.controller('kuandai-wojia-combination-package-tel-list-into', function($scope, $state, my) {
	$scope.title = "套餐";
	$scope.packageList = kuandai_oldNumberProduct_Admissible;
	$scope.details = function(id){
		my.alert($scope.packageList[id].productExplain, $scope.packageList[id].productName)
	}
	$scope.order = function(index){
		kuandai_tel_package['productId']  = $scope.packageList[index].productId;
		$state.go("kuandai-wojia-combination-package-tel-result");
	}
})



.controller('kuandai-wojia-combination-package-tel-result', function($scope, $rootScope, $http, $state, my) {

	$scope.title = "套餐详情";
	$scope.packageList = [];

	$scope.loading = false;
	$scope.resState = true;

	// 清除所选数据
	kuandai_tel_package["sub_productObj"] = {};
	kuandai_tel_package["result"]["sub_productList"] = [];
	kuandai_tel_package["result"]["sub_elementList"] = [];
	kuandai_tel_package["result"]["selecteElementCode"] = "";

	$scope.getProduct = function(){
		$http({
			method: 'GET',
			url: ajaxurl + 'lancontract/queryAllPackageByProductId',
			params : {"productId":kuandai_tel_package['productId'], "token":$rootScope.token}
		}).success(function(data){
			$scope.handlePackage(data);
		}).error(function(){
			my.alert('获取套餐详情失败!').then(function(){
				$scope.getProduct();
			});
		});
	}
	$scope.getProduct();


	$scope.handlePackage = function(data){
		$scope.loading = true;
		$scope.resState = false;
		// 获取的原始信息 抛出给全局变量 下一步需要
		cbss_package_original = {};
		// 组装订单需要的 套餐 信息
		kuandai_tel_package["sub_productObj"] = data.productInfo;
		kuandai_tel_package["result"]["sub_productList"].push(data.productInfo);

		// var productConfig = {}
		// if(data.configList && data.configList.config){
		// 	productConfig = JSON.parse(data.configList.config);
		// }

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
						kuandai_tel_package["result"]["sub_elementList"].push(row.elementList[ii]);
						kuandai_tel_package["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
					}
				}
				$scope.packageList.push({"package":row.packageBo,"elementList":list});
			}else{
				for(var ii in row.elementList){
					// 默认选中的
					kuandai_tel_package["result"]["sub_elementList"].push(row.elementList[ii]);
					kuandai_tel_package["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
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
			for(var i in data.activityList){
				if(activityList.indexOf(data.activityList[i].productId) !== -1){
					var obj = {}
					obj["elementList"] = JSON.parse(JSON.stringify(data.activityList[i].fj2ndLevelList));
					obj["productInfo"] = data.activityList[i];
					delete obj["productInfo"].fj2ndLevelList
					cbss_package_original.activityList.push(obj)
				}
			}
		}
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
			kuandai_tel_package["result"]["sub_elementList"] = 
				kuandai_tel_package["result"]["sub_elementList"].concat(pushElement);
			kuandai_tel_package["result"]["selecteElementCode"] +=  pushElementCode;
		}else{
			my.alert("有必选项没有选择!");
			return ;
		}


		if(telInfo["isOldNumber"]){
			$scope.copyobj();
		}else{
			if(cbss_package_original.serviceList.length){
				$state.go("kuandai-wojia-combination-package-tel-service");
			}else{
				if(cbss_package_original.activityList.length){
					$state.go("kuandai-wojia-combination-package-tel-activity");
				}else{
					$scope.copyobj();
				}
			}
		}
	}

	$scope.copyobj = function(){

		kuandai_tel_package_list[telInfo['tel']] = deepCopy(kuandai_tel_package);
		kuandai_tel[telInfo['tel']] = deepCopy(telInfo);

		// 重置对象
		reset_kuandai_wojia_package();
		reset_telInfo();
		$state.go(jump[service_type]["package-tel"]);
	}
})





.controller('kuandai-wojia-combination-package-tel-service', function($scope, $state) {
	
	$scope.title = "套餐附加产品";

	// 清除所选数据
	kuandai_tel_package["service"]["sub_productList"] = [];
	kuandai_tel_package["service"]["sub_elementList"] = [];
	kuandai_tel_package["service"]["selecteElementCode"] = "";

	$scope.serviceList = cbss_package_original.serviceList;


	$scope.order = function(){

		for(var i in $scope.serviceList){
			if($scope.serviceList[i].check){
				kuandai_tel_package["service"]["sub_productList"].push($scope.serviceList[i].productInfo);
				for(var j in $scope.serviceList[i].elementList){
					for(var jj in $scope.serviceList[i].elementList[j]["elementList"]){
						kuandai_tel_package["service"]["sub_elementList"].push($scope.serviceList[i].elementList[j]["elementList"][jj]);
						kuandai_tel_package["service"]["selecteElementCode"] +=  $scope.serviceList[i].elementList[j]["elementList"][jj]["elementId"]+",";
					}
				}
			}
		}
		// 如果有主卡包 设为主卡
		telInfo.tradeType = "0";
		if(kuandai_tel_package.service.sub_productList.length){
			for(var i in kuandai_tel_package.service.sub_productList){
				if(kuandai_tel_package.service.sub_productList[i].productName.indexOf("主卡") != -1){
					telInfo.tradeType = "4";
				}
			}
		}

		if(cbss_package_original.activityList.length){
			$state.go("kuandai-wojia-combination-package-tel-activity");
		}else{
			$scope.copyobj();
		}
	}

	$scope.copyobj = function(){

		kuandai_tel_package_list[telInfo['tel']] = deepCopy(kuandai_tel_package);
		kuandai_tel[telInfo['tel']] = deepCopy(telInfo);

		// 重置对象
		reset_kuandai_wojia_package();
		reset_telInfo();
		$state.go(jump[service_type]["package-tel"]);
	}
})



.controller('kuandai-wojia-combination-package-tel-activity', function($scope, $state) {

	$scope.title = "套餐活动";
	$scope.select = {"elementMap":""};

	// 清除所选数据
	kuandai_tel_package["activity"]["sub_productList"] = [];
	kuandai_tel_package["activity"]["sub_elementList"] = [];
	kuandai_tel_package["activity"]["selecteElementCode"] = "";

	$scope.queryactivitylist = cbss_package_original.activityList;

	$scope.order = function(){

		if($scope.select.elementMap == ""){
			$scope.copyobj();
		}else{
			kuandai_tel_package["activity"]["sub_productList"].push($scope.select.elementMap.productInfo);
			for(var i in $scope.select.elementMap['elementList']){
				for(var ii in $scope.select.elementMap['elementList'][i].elementList){
					kuandai_tel_package["activity"]["sub_elementList"].push($scope.select.elementMap['elementList'][i].elementList[ii]);
					kuandai_tel_package["activity"]["selecteElementCode"] +=  $scope.select.elementMap['elementList'][i].elementList[ii]["elementId"]+",";
				}
			}
			$scope.copyobj();
		}
	}

	$scope.copyobj = function(){
		kuandai_tel_package_list[telInfo['tel']] = deepCopy(kuandai_tel_package);
		kuandai_tel[telInfo['tel']] = deepCopy(telInfo);

		// 重置对象
		reset_kuandai_wojia_package();
		reset_telInfo();
		$state.go(jump[service_type]["package-tel"]);
	}
})





.controller('kuandai-wojia-combination-package-activity-selected', function($scope, $state, my) {

	$scope.title = "活动类型选择";
	$scope.lists = [
		{"name":"购机赠费","code":"huafeichongzhi_lan"},
		{"name":"存费赠费","code":"goujizengfei"}
		]
	$scope.input = {"code":""}



	$scope.order = function(){
		if($scope.input.code == ""){
			my.alert("请选择活动的类型。");
		}else{
			if($scope.input.code == "huafeichongzhi_lan"){
				$state.go("kuandai-wojia-combination-package-tel-phoneGiveFee");
			}else{
				$state.go("kuandai-wojia-combination-package-tel-activity");
			}
		}
	}
})



.controller('kuandai-wojia-combination-package-tel-phoneGiveFee', function($scope, $state, $cordovaBarcodeScanner, my) {

	$scope.title = "购机赠费手机IMEI";
	$scope.input = {"imei":""};

	$scope.qrImei = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.input.imei = barcodeData.text;
				}else{
				}
			}, function() {
			});
	};



	$scope.order = function(){
		if($scope.input.imei == ""){
			my.alert("请输入或扫描手机IEMI码。");
		}else{
			kuandai_phoneGiveFee.imei = $scope.input.imei;
			$state.go("kuandai-wojia-combination-package-tel-phoneGiveFee-phoneList");
		}
	}
})

.controller('kuandai-wojia-combination-package-tel-phoneGiveFee-phoneList', function($scope, $state, unicomm_server, my) {

	$scope.title = "选择手机型号";
	$scope.select = {"elementMap":""};
	$scope.queryPhoneList = [];


	$scope.loading = true;
	$scope.nocity = false;
	$scope.resState = true;

	// 初始
	kuandai_phoneListMap[telInfo['tel']] = {};

	unicomm_server.cbssLogin().then(function(){

		unicomm_server.getUnicomm({
				"cmd":"cbss_product_getPhoneList",
				"imei":kuandai_phoneGiveFee["imei"]
			})
			.then(
				function(result_json){
					if(result_json.status == "1"){
						$scope.loading = false;
						if(result_json.data.length){
							$scope.resState = false;
							$scope.queryPhoneList = result_json.data;
						}else{
							$scope.nocity = true;
						}
					}else{
						my.alert(result_json.data).then(function(){
							$state.go("kuandai-wojia-combination-package-tel-phoneGiveFee");
						});
					}
				}
				, function(){
					$state.go("kuandai-wojia-combination-package-tel-phoneGiveFee")
				}
			)
		
	});

	$scope.order = function(){
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			my.alert("请选择一款手机。").then(function(){
				$scope.resState = false;
			});
		}else{
			kuandai_phoneListMap[telInfo['tel']] = $scope.select.elementMap;
			$state.go("kuandai-wojia-combination-package-tel-phoneGiveFee-activity");
		}
	}
})



.controller('kuandai-wojia-combination-package-tel-phoneGiveFee-activity', function($scope, $state, unicomm_server, my) {

	$scope.title = "购机赠费选择活动";
	$scope.select = {"elementMap":""};
	$scope.activityList = [];
	$scope.loading = true;
	$scope.resState = true;

	kuandai_tel_package["activity"]["sub_productList"] = [];
	kuandai_tel_package["activity"]["sub_elementList"] = [];
	kuandai_tel_package["activity"]["selecteElementCode"] = "";

	unicomm_server.cbssLogin().then(function(){

		unicomm_server.getUnicomm({
				"cmd":"showactivitydetail" ,
				"root":"SALE",
				"productTypeCode":"GJRM001",
				"productId":kuandai_tel_package['productId'],
				"number":telInfo["tel"],
				"deviceType":kuandai_phoneListMap[telInfo['tel']]["resourcesModelCode"],
				"deviceBrand":kuandai_phoneListMap[telInfo['tel']]["resourcesBrandCode"],
				"deviceNumber":kuandai_phoneListMap[telInfo['tel']]["deviceno"]
			})
			.then(
				function(result_json){
					if(result_json.status == "1"){
						$scope.loading = false;
						$scope.resState = false;
						$scope.activityList = result_json.data;
					}else{
						my.alert(result_json.data);
					}
				}
			)			
	});


	$scope.order = function(){
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			my.alert('请选择一个活动。').then(function(){
				$scope.resState = false;
			});
		}else{
			for(var i in $scope.select.elementMap.package[0].element){
				kuandai_tel_package["activity"]["sub_elementList"].push($scope.select.elementMap.package[0].element[i]);
				kuandai_tel_package["activity"]["selecteElementCode"] += $scope.select.elementMap.package[0].element[i]["elementId"]+",";
			}
			delete $scope.select.elementMap.package;
			kuandai_tel_package["activity"]["sub_productList"].push($scope.select.elementMap);
			$scope.copyobj();
		}
	}


	$scope.copyobj = function(){
		kuandai_tel_package_list[telInfo['tel']] = deepCopy(kuandai_tel_package);
		kuandai_tel[telInfo['tel']] = deepCopy(telInfo);

		// 重置对象
		reset_kuandai_wojia_package();
		reset_telInfo();
		$state.go(jump[service_type]["package-tel"]);
	}
})
;
