appControllers.controller('kuandai-wojia-number-selected', function($scope, $state, $ionicPopup, my) {
	$scope.title = "选择4G业务";
	$scope.nextBtn = false;
	$scope.numberLi = [];

	$scope.intoShow = true;
	$scope.newShow = true;

	// 线上引流 隐藏 新装
	if(wx_order.orderCode){
		$scope.newShow = false;
	}

	$scope.numberShowList = function(){
		$scope.numberLi = [];
		for(var i in kuandai_tel){
			if(i.length == 11){
				$scope.numberLi.push({"number":i, "numberWrite":kuandai_tel[i]["write"]});
			}else{
				delete kuandai_tel[i];
				delete kuandai_tel_package_list[i]
			}
		}
		$scope.nextBtn = $scope.numberLi.length > 0 ? true : false;
	}
	$scope.numberShowList();


	$scope.addNewNumber = function(){
		if($scope.numberLi.length && wojiaIsronghe == false){
			my.alert("组合类套餐只允许添加或纳入一张4G卡");
		}else{
			isOldNumber = false;
			$state.go("number-list");
		}
	}


	$scope.intoOldNumber = function(){
		if($scope.numberLi.length && wojiaIsronghe == false){
			my.alert("组组合类套餐只允许添加或纳入一张4G卡");
		}else{
			isOldNumber = true;
			$state.go("kuandai-wojia-number-into");
		}
	}


	$scope.writeSim = function(telNumber){
		writesimNow = telNumber;
		if(userBo.userName == "18866668888"){
			my.alert("您使用的是测试工号，无法进行写卡操作!");
		}else{
			$state.go("kuandai-wojia-number-read-write-card");
		}
	}


	$scope.delNumber = function(telNumber){
		$ionicPopup.confirm({
				"title": '确认',
				"template": '是否放弃号码<'+telNumber+'>！',
				"okText":'放弃号码',
				"cancelText":'取消'
			}).then(function(res) {
				console.log(res)
				if(res){
					delete kuandai_tel[telNumber];
					delete kuandai_tel_package_list[telNumber]
					delete kuandai_oldUserInfo[telNumber]
					delete kuandai_oldNumberPackageList[telNumber]
					delete simcardinfo[telNumber]
					$scope.numberShowList();
				}
			});
	}


	$scope.order = function(){
		var j = true;
		if($scope.numberLi.length){
			for(var i in kuandai_tel){
				if(!kuandai_tel[i]["write"]){
					j = false;
				}
			}
			if(j || userBo.userName == "18866668888"){
				if(wojiaIsronghe){
					$state.go(jump[service_type]["number-selected"]);
				}else{
					$scope.setWojiaProductId();
				}
			}else{
				my.alert("请写卡")
			}
		}else{
			my.alert("请新装和纳入联通手机号码!")
		}
	}


	$scope.setWojiaProductId = function(){

		var product = null;
		var tel = null;
		var productList = {
			// "90381554":["90311029"],
			"90395648":["90375644","90375767","90417365","90451656","90451657"],
			"90393643":["90350506","90155946"],
			"wk":["90063345"]
		}
		for(var i in kuandai_tel_package_list){
			product = kuandai_tel_package_list[i].sub_productObj
			if(!(product && product.productId)){
				product = kuandai_oldNumberProductList[i] ? kuandai_oldNumberProductList[i][0] : {}
			}
			tel = i;
		}

		wojiaRootProductId = "89706086"

		if(product.productName.indexOf("冰激凌") !== -1 && ["90311029","90417365"].indexOf(product.productId) === -1){
			wojiaRootProductId = "90381554";
		}else{
			for(var i in productList){
				if(productList[i].indexOf(product.productId) !== -1){
					wojiaRootProductId = i;
				}
			}
		}


		if(wojiaRootProductId == "wk"){
			delete kuandai_tel[tel];
			delete kuandai_tel_package_list[tel]
			delete kuandai_oldUserInfo[tel]
			delete kuandai_oldNumberPackageList[tel]
			delete simcardinfo[tel]

			wojiaRootProductId = "";
			service_type = "cbssLan";

			KuandaiMainProductName = "王卡宽带";
			kuandai_wk_isFixedLan = true;
			kuandai_combination['bindingSerialNumber'] = tel.replace(/[^\d]/g, "");
			$state.go(jump[service_type]["authentication"]);
		}else{
			$state.go(jump[service_type]["number-selected"]);
		}
	}
});

