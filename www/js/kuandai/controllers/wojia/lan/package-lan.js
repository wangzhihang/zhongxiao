appControllers.controller('kuandai-cbss-SingleLan-list', function($scope, $state, $http, $rootScope, my) {
	$scope.title = "产品列表";

	$scope.packageList = [];
	kuandai_combination['broadband']["lanproduct"] = []; // 重置
	
	$http({
		method: 'GET',
		url: ajaxurl + "/lancontract/queryCbssSingleLan?token=" + $rootScope.token
	}).success(
		function(data){
			for(var i in data["contractList"]){
				if(kuandai_wk_isFixedLan && data["contractList"][i].productName.indexOf("王卡") !== -1){
					$scope.packageList.push(data["contractList"][i])
				}else if(!kuandai_wk_isFixedLan && data["contractList"][i].productName.indexOf("王卡") === -1){
					$scope.packageList.push(data["contractList"][i])
				}
			}
		}
	).error(function () {
		my.alert("获取产品列表出错(系统)");
	});


	$scope.order = function(index) {
		kuandai_combination['broadband']["productInfo"] = $scope.packageList[index];
		kuandai_combination['broadband']["lanproduct"].push($scope.packageList[index])
		$state.go("kuandai-cbss-SingleLan-detail");
	}
})



.controller('kuandai-cbss-SingleLan-detail', function($scope, $state, $http, $rootScope, my) {

	$scope.title = "套餐详情";
	kuandai_combination["broadband"]["lanelementlist"] = [];  // 重置

	$scope.loading = false;
	$scope.resState = true;


	// 主包
	kuandai_combination["combination"]["info"] = {};
	kuandai_combination["combination"]["ElementList"] = [];
	kuandai_combination["service"]["info"] = [];
	kuandai_combination["service"]["ElementList"] = [];
	kuandai_combination["service"]["list_temp"] = null;

	$scope.serviceList = [];
	$scope.serviceList_length = 0;
	$scope.getInfo = function(){
		$http({
			method: 'GET',
			url: ajaxurl + "/lancontract/queryAllPackageByProductId",
			params : {"productId":kuandai_combination['broadband']["productInfo"].productId, "token":$rootScope.token}
		}).success(
			function(data){
				$scope.loading = true;
				$scope.resState = false;
				kuandai_combination["combination"]["info"] = data.productInfo;

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
				
				// 添加附加产品
				$scope.serviceList = data.serviceList;
				// 配置文件
				var config = data.configList ? str2json(data.configList) : ""
				kuandai_combination["broadband"].config = config ? str2json(config.config) : {};
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
				// 添加附加产品
				if($scope.serviceList.length){
					kuandai_combination["service"]["list_temp"] = $scope.serviceList;
					$state.go("kuandai-cbss-SingleLan-service");
				}else{
					$state.go("kuandai-wojia-combination-package-lan-tv");
				}
			});
		}else{
			my.alert("有必选项没有选择!");
		}
	}
})


.controller('kuandai-cbss-SingleLan-service', function($scope, $state, $http, $ionicPopup, $rootScope) {

	$scope.title = "附加产品";
	$scope.resState = false;

	$scope.packageList = [];
	for(var i in kuandai_combination["service"]["list_temp"]){
		kuandai_combination["service"]["list_temp"][i].check = false;
		$scope.packageList.push(kuandai_combination["service"]["list_temp"][i])
	}
	kuandai_combination["service"]["list_temp"] = null;

	kuandai_combination["service"]["info"] = [];
	kuandai_combination["service"]["ElementList"] = [];

	$scope.getPackage = function(index){
		$http({
			method: 'GET',
			url: ajaxurl + "lancontract/queryPackageBo",
			params:{"productId":$scope.packageList[index].productId,"parentProductId":kuandai_combination['broadband']["productInfo"].productId,"token":$rootScope.token}
		}).success(
			function(data){
				kuandai_combination["service"]["info"].push(data.productInfo);
				if(data.resultList){
					for(var i in data.resultList){
						if(data.resultList[i].elementList){
							for(var ii in data.resultList[i].elementList){
								kuandai_combination["service"]["ElementList"].push(data.resultList[i].elementList[ii]);
							}
						}
					}
				}
				$scope.resState = false;
				$state.go("kuandai-wojia-combination-package-lan-tv");
			}
		).error(function (){
			$scope.loading = true;
			my.alert("获取套餐详情失败!", "", "重新获取").then(function(){
				$scope.loading = false;
				$scope.getPackage();
			})
		});
	}

	$scope.pushNotificationChange = function(index) {
		for(var i in $scope.packageList){
			$scope.packageList[i]["check"] = i == index ? true : false;
		}
	};

	$scope.order = function() {
		
		$scope.resState = true;
		var index = null;
		for(var i in $scope.packageList){
			if($scope.packageList[i].check){
				index = i;
			}
		}
		if(index === null){
			$state.go("kuandai-wojia-combination-package-lan-tv");
		}else{
			$scope.getPackage(index);
		}
	}
})


.controller('kuandai-cbss-SingleLan-wk', function($scope, $state, my) {
	$scope.title = "大王卡号码";
	$scope.data = {"tel":""};
	$scope.resState = true;
	$scope.haoduan = ["185","186","155","156","130","131","132","175","176","166"];

	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.order = function(){
		kuandai_combination['bindingSerialNumber'] = $scope.data["tel"].replace(/[^\d]/g, "");
		if(arrayContains($scope.haoduan, kuandai_combination['bindingSerialNumber'].substring(0, 3))){
			$state.go("kuandai-wojia-address-area");
		}else{
			my.alert('您输入的手机号不是联通的号码,请重新输入!').then(function(){
				kuandai_combination['bindingSerialNumber'] = "";
			});
		}
	}
})
;