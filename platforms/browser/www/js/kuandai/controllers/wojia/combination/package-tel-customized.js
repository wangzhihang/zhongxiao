appControllers.controller('kuandai-wojia-combination-package-tel-customized', function($scope, $rootScope, $http, $state, my) {

	$scope.title = "套餐详情";
	$scope.packageList = [];
	$scope.select = {"elementMap":null};	// 3级结构保存内容 2级结构保存坐标
	$scope.packageType = null;				// 0 为直接显示3级结构,1 选中显示二级结构内容但保存的是3级内容
	$scope.ChargingPackage = null;			// 如果是3级结构 临时变了保存


	$scope.reArrayid = [];
	$scope.loading = [false];
	$scope.resState = true;


	// 清除所选数据
	kuandai_tel_package["sub_productObj"] = {};
	kuandai_tel_package["result"]["sub_productList"] = [];
	kuandai_tel_package["result"]["sub_elementList"] = [];
	kuandai_tel_package["result"]["selecteElementCode"] = "";
	kuandai_tel_package['productId'] = kuandai_number_info['productId'];



	$http({
		method: 'GET',
		url: ajaxurl + 'lancontract/queryAllPackageList',
		params : {"productId":kuandai_tel_package['productId'], "token":$rootScope.token}
	}).success(function(data){
		$scope.loading[0] = true;
		$scope.resState = false;
		// 获取的原始信息 抛出给全局变量 下一步需要
		cbss_package_original = data;
		// 组装订单需要的 套餐 信息
		kuandai_tel_package["sub_productObj"] = data.productInfo;
		kuandai_tel_package["result"]["sub_productList"].push(data.productInfo);

		for(var i in data.resultList){
			var row = data.resultList[i];
			if(row.packageBo.maxNumber == "1"){
				$scope.packageType = 0;
				// 抛出 让用户选择
				var list = []
				for(var ii in row.elementList){
					list.push({"name":row.elementList[ii]["elementName"],"list":row.elementList[ii]});
				}
				$scope.packageList[0] = {"name":row.packageBo.packageName,"list":list};
			}else{
				for(var ii in row.elementList){
					if(row.elementList[ii].defaultTag === "1"){
						// 默认选中的
						kuandai_tel_package["result"]["sub_elementList"].push(row.elementList[ii]);
						kuandai_tel_package["result"]["selecteElementCode"] +=  row.elementList[ii]["elementId"]+",";
					}
				}
			}
		}

	}).error(function(data){
		my.alert('获取套餐详情失败!');
	});



	$scope.order = function () {

		if($scope.select.elementMap == null){
			my.alert('请选择一个主餐包!');
			return false;
		}

		kuandai_tel_package["result"]["sub_elementList"].push($scope.select.elementMap);
		kuandai_tel_package["result"]["selecteElementCode"] +=  $scope.select.elementMap["elementId"]+",";
		
		if(service_type == "wojia-combination-56"){
			kuandai_tel_package_list[telInfo['tel']] = deepCopy(kuandai_tel_package);
			kuandai_tel[telInfo['tel']] = deepCopy(telInfo);
			reset_kuandai_wojia_package();
			reset_telInfo();
			$state.go(jump[service_type]["package-tel"]);
		}else{
			$state.go("kuandai-wojia-combination-package-tel-service");
		}
	}
})
;
