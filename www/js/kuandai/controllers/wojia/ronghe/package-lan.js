appControllers.controller('kuandai-wojia-ronghe-package-index', function($scope, $state, $http, $ionicPopup, $rootScope, my) {

	$scope.title = "宽带产品列表";
	$scope.packageList = [];
	$scope.loading = true;

	kuandai_combination['broadband']["productInfo"] = null;
	kuandai_combination['broadband']["lanproduct"] = [];

	$http({
		method: 'GET',
		url: ajaxurl + "/lancontract/queryLanContract?token=" + $rootScope.token
	}).success(
		function(data){	
			$scope.loading = false;
			for(var i in data["contractList"]){
				if(wojiaProduct.LanList.indexOf(data["contractList"][i]["productId"])  !== -1){
					$scope.packageList.push(data["contractList"][i]);
				}
			}
		}
	).error(function () {
		my.alert('获取宽带列表失败!');
	});

	$scope.order = function(index) {
		kuandai_combination['broadband']["productInfo"] = $scope.packageList[index];
		kuandai_combination['broadband']["lanproduct"].push($scope.packageList[index])
		$state.go("kuandai-wojia-ronghe-package-detail");
	}
})


.controller('kuandai-wojia-ronghe-package-detail', function($scope, $state, $http, $ionicPopup, $rootScope, my) {

	$scope.title = "套餐详情";
	$scope.packageList = [];
	$scope.select = {"elementMap":null};
	$scope.loading = true;
	$scope.resState = false;

	kuandai_combination["broadband"]["lanelementlist"] = [];	

	$http({
		method: 'GET',
		url: ajaxurl + "lancontract/queryAllPackageList?productId="+ kuandai_combination['broadband']["productInfo"]["productId"] +"&token=" + $rootScope.token
	}).success(
		function(data){
			var list = [];
			for(var i in data.resultList){
				var sonList = [];
				for(var ii in data.resultList[i]["elementList"]){
					if(data.resultList[i]["elementList"][ii]["defaultTag"] == 1){
						kuandai_combination["broadband"]["lanelementlist"].push(data.resultList[i]["elementList"][ii]);
					}
					sonList.push({"list":data.resultList[i]["elementList"][ii],"check":Boolean(Number(data.resultList[i]["elementList"][ii]["defaultTag"]))});
				}
				if(data.resultList[i]["packageBo"]["maxNumber"] == "1"){
					list.push({"title":data.resultList[i]["packageBo"],"content":sonList});
				}
			}
			$scope.loading = false;
			$scope.resState = true;
			$scope.packageList = list;
		}
	).error(function (){
		my.alert("获取套餐详情失败!");
	});


	$scope.order = function() {
		if($scope.select.elementMap == null){
			my.alert("请选择一个套餐!");
		}else{
			kuandai_combination["broadband"]["lanelementlist"].push($scope.select.elementMap);
			$state.go("kuandai-wojia-ronghe-lan-flow");
		}
	}
})




.controller('kuandai-wojia-ronghe-lan-flow', function($scope, $state, $http, $ionicPopup, $rootScope, my) {


	if(wojiaRootProductId == "89017299"){
		$scope.title = "流量包";
	}else{
		$scope.title = "语音包";
	}
	$scope.packageList = [];	// 套餐包
	$scope.select = {"elementMap":null};
	$scope.loading = true;
	$scope.resState = false;
	$scope.isOldNumber = false;	// 是否有纳入号码

	// 宽带 融合部分
	kuandai_combination["combination"]["info"] = {};
	kuandai_combination["combination"]["ElementList"] = [];
	kuandai_combination["combination"]["ElementListFlow"] = [];
	kuandai_selected_package["SMS"] = [];
	kuandai_selected_package["voice"] = [];

	$scope.telPackage = function() {
		kuandai_tel_package = {
			"productId":"",
			"productName":"",
			"sub_productObj":{},
			"result":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
			"service":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
			"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""}
		}
		$http({
			method: 'GET',
			url: ajaxurl + 'lancontract/queryAllPackageList',
			params : {"productId":"89002922", "token":$rootScope.token}
		}).success(function(data){

			kuandai_tel_package["sub_productObj"] = data.productInfo;
			kuandai_tel_package["result"]["sub_productList"].push(data.productInfo);

			for(var i in data.resultList){
				var row = data.resultList[i].elementList;
				for(var ii in row){
					if(row[ii].defaultTag === "1"){
						kuandai_tel_package["result"]["sub_elementList"].push(row[ii]);
						kuandai_tel_package["result"]["selecteElementCode"] +=  row[ii]["elementId"]+",";
					}
				}
			}
			for(var i in kuandai_tel){
				// 如果有纳入号码标记出来
				if(kuandai_tel[i]["isOldNumber"]){
					$scope.isOldNumber = true;
				}
				kuandai_tel_package_list[i] = deepCopy(kuandai_tel_package);
			}
			$scope.combination();
		}).error(function(data){
			my.alert('获取手机套餐失败!');
		});
	}
	$scope.telPackage();

	$scope.combination = function()
	{
		$http({
			method: 'GET',
			url: ajaxurl + "/lancontract/queryAllPackageList",
			params : {"productId":wojiaRootProductId, "token":$rootScope.token}
		}).success(
			function(data){
				kuandai_combination["combination"]["info"] = data.productInfo;
				var list = [];
				for(var i in data.resultList){
					if(data.resultList[i]["packageBo"]["packageId"] == wojiaflowProductId){
						list.push({"title":data.resultList[i]["packageBo"],"content":$scope.forElementList(data.resultList[i]["elementList"])});
					}else if(data.resultList[i]["packageBo"]["packageId"] == "51018055"){	// 短信包
						kuandai_selected_package["SMS"].push({"title":data.resultList[i]["packageBo"],"content":$scope.forElementList(data.resultList[i]["elementList"])});
					}else if(data.resultList[i]["packageBo"]["packageId"] == "51018054"){	// 语音包
						kuandai_selected_package["voice"].push({"title":data.resultList[i]["packageBo"],"content":$scope.forElementList(data.resultList[i]["elementList"])});
					}else{
						for(var ii in data.resultList[i]["elementList"]){
							if(data.resultList[i]["elementList"][ii]["defaultTag"] == 1){
								kuandai_combination["combination"]["ElementList"].push(data.resultList[i]["elementList"][ii])
							}
						}
					}
				}
				$scope.loading = false;
				$scope.resState = true;
				$scope.packageList = list;

				// 需要写这个
				// if(wx_order && wx_order){
				// 	for(var i in $scope.packageList){
				// 		if($scope.packageList[i].productId == wx_order.lanProductId){
				// 			$scope.order(i);
				// 			break;
				// 		}
				// 	}
				// }
			}
		).error(function () {
		});
	}


	$scope.forElementList = function(data){
		var sonList = [];
		for(var ii in data){
			if($scope.isOldNumber){
				if(data[ii]["elementName"].indexOf("全量全价") != -1){
					sonList.push({"list":data[ii],"check":(data[ii]["defaultTag"] == 1 ? true : false)});
				}
			}else {
				sonList.push({"list":data[ii],"check":(data[ii]["defaultTag"] == 1 ? true : false)});
			}
		}
		return sonList;
	}

	// 默认选中 ----------------------------------
	// if(wx_order.orderCode){
	// 	for(var i in $scope.packageList[i0].content[i]){
	// 		if($scope.packageList[0].content[i].list.elementName){
	// 			$scope.packageList[0].content[i]["check"] = true;
	// 		}
	// 	}
	// }


	$scope.order = function() {
		if($scope.select.elementMap == null){
			my.alert("请选择一个"+$scope.title+"!");
		}else{
			kuandai_combination["combination"]["ElementListFlow"].push($scope.select.elementMap);
			if(wojiaRootProductId == "89017299"){
				$state.go("kuandai-wojia-ronghe-lan-voice");
			}else{
				if(wx_order.orderCode){
					$state.go("kuandai-wojia-ronghe-activity");
				}else{
					$state.go("kuandai-wojia-ronghe-tv");
				}
			}
		}
	}
})



.controller('kuandai-wojia-ronghe-lan-voice', function($scope, $state, $http, $ionicPopup, $rootScope, my) {

	$scope.title = "语音包";
	$scope.packageList = kuandai_selected_package["voice"];
	kuandai_combination["combination"]["ElementListVoice"] = [];

	// 默认选中 ----------------------------------
	if(wx_order.orderCode){
		for(var i in $scope.packageList[i0].content[i]){
			if($scope.packageList[0].content[i].list.elementName){
				$scope.packageList[0].content[i]["check"] = true;
			}
		}
	}

	$scope.pushNotificationChange = function(index) {
		if(wx_order.orderCode){
			my.alert("语音包已经选定不可更改!")
			return ;
		}
		for(var i in $scope.packageList[0].content){
			if(i != index){
				$scope.packageList[0].content[i]["check"] = false;
			}
		}
	};

	$scope.order = function() {
		for(var i in $scope.packageList[0].content){
			if($scope.packageList[0].content[i]["check"]){
				kuandai_combination["combination"]["ElementListVoice"].push($scope.packageList[0].content[i]["list"])
			}
		}
		// if()
		$state.go("kuandai-wojia-ronghe-lan-SMS");
	}
})


.controller('kuandai-wojia-ronghe-lan-SMS', function($scope, $state, $http, $ionicPopup, $rootScope) {
	
	$scope.title = "短/彩信包";
	$scope.packageList = kuandai_selected_package["SMS"];
	kuandai_combination["combination"]["ElementListSMS"] = [];

	$scope.pushNotificationChange = function(index) {
		for(var i in $scope.packageList[0].content){
			if(i != index){
				$scope.packageList[0].content[i]["check"] = false;
			}
		}
	};

	$scope.order = function() {
		for(var i in $scope.packageList[0].content){
			if($scope.packageList[0].content[i]["check"]){
				kuandai_combination["combination"]["ElementListSMS"].push($scope.packageList[0].content[i]["list"])
			}
		}
		$state.go("kuandai-wojia-ronghe-1-5G");
	}
})

.controller('kuandai-wojia-ronghe-1-5G', function($scope, $state, $http, $ionicPopup, $rootScope) {
	$scope.title = "1元5G包";
	$scope.li = [{"text":"1元5G省内流量包(陕西)", "check":true, "id":"1-5G"}]

	$scope.order = function() {
		if($scope.li[0]["check"]){
			kuandai_selected_package["1-5G"] = true;
			$state.go("kuandai-wojia-ronghe-tv");
		}else{
			$ionicPopup.confirm({
				"title": '确认',
				"template": '1元5G省内流量包(陕西)',
				"okText":'确认不需要',
				"cancelText":'我需要'
			}).then(function(res) {
				if(res){
					kuandai_selected_package["1-5G"] = false;
					$state.go("kuandai-wojia-ronghe-tv");
				}
			});
		}
	}
})

.controller('kuandai-wojia-ronghe-tv', function($scope, $state, $http, $ionicPopup, $rootScope) {
	$scope.title = "ITV应用包";
	$scope.li = [
		{"text":"互联网电视(ITV)-0元/月", "check":false, "id":"tv", "type":"data/tv-0"},
		{"text":"互联网电视(ITV)-10元/月", "check":false, "id":"tv", "type":"data/tv-10"}
	];

	if(wojiaRootProductId != "89017299" && wojiaRootProductId != "89248286"){
		$scope.li = [{"text":"陕西（IPTV）智慧沃家共享版-0元/月", "check":false, "id":"tv", "type":"data/tv-0-90359679"}]
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
			$state.go("kuandai-wojia-ronghe-activity");
		}else{
			$ionicPopup.confirm({
				"title": '确认',
				"template": '不选择ITV应用包，ITV数字电视将无法开通！',
				"okText":'确认不需要',
				"cancelText":'我需要'
			}).then(function(res) {
				if(res){
					kuandai_selected_package["tv"] = false;
					kuandai_selected_package["tv_type"] = "";
					$state.go("kuandai-wojia-ronghe-activity");
				}else{}
			});
		}
	}
})



.controller('kuandai-wojia-ronghe-activity', function($scope, $state, $http, $ionicPopup, $rootScope, my) {
	$scope.title = "宽带活动";

	$scope.select = {"elementMap":""};
	$scope.queryactivitylist = [];
	$scope.loading = true;
	$scope.btnOrder = false;
	$scope.nocity = false;

	// 清除所选数据
	kuandai_combination['broadband']["activity"] = {"lanproduct":[], "lanelementlist":[]};

	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryActivityList',
		params : {"productId":wojiaRootProductId, "token":$rootScope.token}
	}).success(function(data){
		$scope.loading = false;
		$scope.btnOrder = true;
		if(data.activityList.length){
			$scope.queryactivitylist = data.activityList;
		}
		else{
			$scope.nocity = false;
		}
	});



	$scope.order = function(){
		console.log($scope.select.elementMap)

		if($scope.select.elementMap == ""){
			my.alert("根据联通要求，必选选择一个活动");
		}else{
			$scope.loading = true;
			$scope.btnOrder = false;
			$http({
				method: 'GET',
				url: ajaxurl + 'lancontract/queryPackageBo',
				params : {"productId":$scope.select.elementMap['productId'], "parentProductId":wojiaRootProductId, "token":$rootScope.token}
			}).success(function(data){
				kuandai_combination['broadband']["activity"]["lanproduct"].push($scope.select.elementMap);
				kuandai_combination['broadband']["activity"]["lanelementlist"].push(data['resultList'][0]['elementList'][0]);
				$scope.loading = false;
				$scope.btnOrder = true;
				$state.go("kuandai-wojia-select-terminals");
			}).error(function(data){
				my.alert("活动详情失败，请联系系统管理员");
			});
		}
	}

})
;