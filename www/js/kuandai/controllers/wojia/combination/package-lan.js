appControllers.controller('kuandai-wojia-combination-package-lan-list', function($scope, $state, $http, $rootScope, my) {
	$scope.title = "产品列表";

	$scope.packageList = [];
	kuandai_combination['broadband']["lanproduct"] = []; // 重置


	$http({
		method: 'GET',
		url: ajaxurl + "/lancontract/queryLanContract?token=" + $rootScope.token
	}).success(
		function(data){
			// 陕西智慧沃家组合套餐（优化版）
			var productList = ["90063034", "90063164", "90311400"];
			// 冰融组合
			if(wojiaRootProductId == "90381554"){
				productList = ["90381564","90417638","90417639"]
			}
			// 分摊优化版
			if(wojiaRootProductId == "90395648"){
				productList = ["90063164"]
			}
			// 天地王卡融合
			if(wojiaRootProductId == "90393643"){
				productList = ["90389127"]
			}
			for(var i in data["contractList"]){
				if(productList.indexOf(data["contractList"][i]["productId"]) != -1){
					$scope.packageList.push(data["contractList"][i]);
				}
			}
		}
	).error(function () {
		my.alert("产品列表获取失败!");
	});


	$scope.order = function(index) {
		kuandai_combination['broadband']["productInfo"] = $scope.packageList[index];
		kuandai_combination['broadband']["lanproduct"].push($scope.packageList[index])
		$state.go("kuandai-wojia-combination-package-lan-detail");
	}
})



.controller('kuandai-wojia-combination-package-lan-detail', function($scope, $state, $http, $rootScope, my) {

	$scope.title = "套餐详情";
	$scope.loading = false;
	$scope.resState = true;
	
	// 主套餐
	kuandai_combination["combination"]["info"] = {};
	kuandai_combination["combination"]["ElementList"] = [];
	// 基础产品
	kuandai_combination["broadband"]["lanelementlist"] = [];
	// 活动
	kuandai_combination['broadband']["activityOriginal"] = [];

	$scope.getInfo = function(){
		$http({
			method: 'GET',
			url: ajaxurl + "/lancontract/queryAllPackageByProductId",
			params : {"productId":wojiaRootProductId, "token":$rootScope.token}
		}).success(
			function(data){
				kuandai_combination["combination"]["info"] = data.productInfo;
				for(var i in data.resultList){
					for(var ii in data.resultList[i]["elementList"]){
						if(data.resultList[i]["elementList"][ii]["defaultTag"] == 1){
							kuandai_combination["combination"]["ElementList"].push(data.resultList[i]["elementList"][ii])
						}
					}
				}
				for(var i in data.activityList){
					var obj = {}
					obj["elementList"] = JSON.parse(JSON.stringify(data.activityList[i].fj2ndLevelList));
					obj["productInfo"] = data.activityList[i];
					delete obj["productInfo"].fj2ndLevelList
					kuandai_combination['broadband']["activityOriginal"].push(obj)
				}
				$scope.getPackage();
			}
		).error(function (){
			$scope.loading = true;
			my.alert("获取套餐详情失败!", "", "重新获取").then(function(){
				$scope.loading = false;
				$scope.getInfo();
			})
		});
	}
	$scope.getInfo();

	$scope.getPackage = function(){
		$http({
			method: 'GET',
			url: ajaxurl + "lancontract/queryAllPackageByProductId",
			params:{"productId":kuandai_combination['broadband']["productInfo"]["productId"],"token":$rootScope.token}
		}).success(
			function(data){
				$scope.loading = true;
				$scope.resState = false;
				var list = [];
				for(var i in data.resultList){
					var elementList = [];
					if(data.resultList[i].packageBo.showTag === "1"){
						for(var ii in data.resultList[i]["elementList"]){
							data.resultList[i]["elementList"][ii].defaultTag = (data.resultList[i]["elementList"][ii].defaultTag === "1")
							elementList.push(data.resultList[i]["elementList"][ii]);
						}
						list.push({
							"package":data.resultList[i]["packageBo"],
							"elementList":elementList
						});
					}else{
						for(var ii in data.resultList[i]["elementList"]){
							kuandai_combination["broadband"]["lanelementlist"].push(data.resultList[i]["elementList"][ii])
						}
					}
				}
				$scope.packageList = list;
				// 活动
				for(var i in data.activityList){
					var obj = {}
					obj["elementList"] = JSON.parse(JSON.stringify(data.activityList[i].fj2ndLevelList));
					obj["productInfo"] = data.activityList[i];
					delete obj["productInfo"].fj2ndLevelList
					kuandai_combination['broadband']["activityOriginal"].push(obj)
				}
				// 配置文件
				var config = data.configList ? str2json(data.configList) : ""
				kuandai_combination["broadband"].config = config ? str2json(config.config) : {};
			}
		).error(function (){
			$scope.loading = true;
			my.alert("获取套餐详情失败!", "", "重新获取").then(function(){
				$scope.loading = false;
				$scope.getPackage();
			})
		});
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


	$scope.order = function() {
		lanElementId = {};
		var pushElement = [];
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
				}
			}
		}
		if(lanElementId.elementId){
			my.confirm("请确定<宽带资费>选项，选择正确！","","确认","修改").then(function(){
				kuandai_combination["broadband"]["lanelementlist"] = 
					kuandai_combination["broadband"]["lanelementlist"].concat(pushElement);

				if(kuandai_combination['broadband']["activityOriginal"].length){
					$state.go("kuandai-wojia-combination-activity");
				}else{
					$state.go("kuandai-wojia-combination-package-lan-tv");
				}
			});
		}else{
			my.alert("有必选项没有选择!");
		}
	}
})



.controller('kuandai-wojia-combination-activity', function($scope, $state, my){

	$scope.title = "宽带活动";
	$scope.select = {"elementMap":""};
	kuandai_combination['broadband']["activity"] = {"lanproduct":[], "lanelementlist":[]};
	$scope.queryactivitylist = kuandai_combination['broadband']["activityOriginal"];

	$scope.order = function(){

		if($scope.select.elementMap == ""){
			my.confirm("没有选择活动！<br>请确认：此套餐，本地区联通可不选择活动！", "", "确定不需要", "重选活动").then(function(){
				$state.go("kuandai-wojia-combination-package-lan-tv");
			})
		}else{
			kuandai_combination['broadband']["activity"]["lanproduct"].push($scope.select.elementMap.productInfo);
			for(var i in $scope.select.elementMap['elementList']){
				for(var ii in $scope.select.elementMap['elementList'][i].elementList){
					kuandai_combination['broadband']["activity"]["lanelementlist"].push($scope.select.elementMap['elementList'][i].elementList[ii]);
				}
			}
			$state.go("kuandai-wojia-combination-package-lan-tv");
		}
	}
})



.controller('kuandai-wojia-combination-package-lan-tv', function($scope, $state, my) {
	$scope.title = "ITV应用包";
	$scope.li = [
		{"text":"互联网电视(ITV)-0元/月", "check":false, "id":"tv", "type":"data/tv-0"},
		{"text":"互联网电视(ITV)-10元/月", "check":false, "id":"tv", "type":"data/tv-10"}
	];
	// 河南临时
	if(shopInfo.shopBo.city == "4730000"){
		$scope.li = [{"text":"河南IPTV包月-0元/月", "check":false, "id":"tv", "type":"data/tv-10-4730000"}]
	}


	$scope.pushNotificationChange = function(index) {
		for(var i in $scope.li){
			if(i != index){
				$scope.li[i]["check"] = false;
			}
		}
	};

	$scope.order = function() {

		var check = false;
		for(var i in $scope.li){
			if($scope.li[i]["check"]){
				kuandai_selected_package["tv"] = true;
				kuandai_selected_package["tv_type"] = $scope.li[i]["type"];
				check = true;
			}
		}

		if(check){
			$scope.go();
		}else{
			my.confirm('不选择ITV应用包，ITV数字电视将无法开通！', '提示', '确认不需要', '我需要').then(
				function() {
					kuandai_selected_package["tv"] = false;
					kuandai_selected_package["tv_type"] = "";
					$scope.go();
				}
			);
		}
	}


	$scope.go = function(){
		if(service_type =="cbssLan"){
			var iptoShow = true;
			if(kuandai_wk_isFixedLan){
				iptoShow = false;
			}
			if(iptoShow){
				$state.go("kuandai-wojia-iptvinfo");
			}else{
				$state.go("kuandai-wojia-select-terminals");
			}
			return ;
		}else{
			$state.go("kuandai-wojia-select-terminals");
		}
	}
})
;