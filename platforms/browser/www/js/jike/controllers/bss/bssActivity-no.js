appControllers.controller('school-activity-bss-flash_getcustomerinfo', function($scope,$state, $http, $rootScope, my, unicomm_server) {

	$scope.title = "联通BSS活动";
	$scope.loading = true;
	$scope.resState = true;
	schoolActivity = {"tel":"","type":""}
	var telNumber = '';


	$scope.input = {
		  "tel":""
		, "customerinfo":{}
		, "initSolutionParammgr":{}
	}
	
	
	$scope.telChange = function(){
		$scope.input["tel"] = telFormat($scope.input["tel"]);
		if($scope.input.tel == '' || $scope.input.tel.replace(/[^\d]/g, "").length < 11){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	};

	//点击查询
	$scope.order = function(){
		telNumber = $scope.input.tel.replace(/[^\d]/g, "");
		$scope.loading = false;
		$scope.resState = true;
		unicomm_server.bssLogin().then(function(){
			$scope.getcustomerinfo();
		}, function(){
			$scope.loading = true;
			$scope.resState = false;
		})
	}


	$scope.getcustomerinfo = function()
	{
		unicomm_server.getUnicomm({
			  "cmd":"bss_flash_getcustomerinfo"
			, "number":telNumber
		}).then(function(return_json){
			if(return_json.status == "1"){
				schoolActivity = {"tel":telNumber, "customerinfo":return_json.data}
				$state.go("school-activity-bss-flash_finishtrade");
			}else{
				$scope.alert(return_json.data);
			}
		}, function() {
			$scope.alert('获取号码信息出错!');
		})
	}


	$scope.alert = function(data)
	{
		my.alert(data)
		.then(function(){
			$scope.loading = true;
			$scope.resState = false;
		});
	}
});


appControllers.controller('school-activity-bss-flash_finishtrade', function($scope, $state, $ionicPopup, unicomm_server) {

	// 获取套餐的接口
	// unicomm_server.getUnicomm({"cmd":"bss_flash_initSolutionParammgr"})
	// .then(function(return_json){
	// 	console.log(return_json)
	// 	// citycode = cityCodeList.id
	// 	// productType = ownerTypeList.
		
	// })
	// unicomm_server.getUnicomm({"cmd":"bss_flash_getProductList","productType":1,"cityCode":"841"})
	// .then(function(return_json){
	// 	console.log(JSON.stringify(return_json))
	// })


	$scope.title = "活动受理";
	$scope.loading = true;
	$scope.resState = false;
	$scope.input = {"act_solution":[]};
	$scope.customer = schoolActivity.customerinfo;
	$scope.productType = "";

	if(service_type == "activityBss"){
		$scope.productType = "分月转兑";
		$scope.productList = [
		// {
		// 	"premise_accept":"主产品串宝宝沃卡18套餐，入网月数小于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1。",
		// 	"act_solution_name":"预存100送240元促销政策(18元宝宝沃卡)",
		// 	"act_solution_id":"10110922",
		// 	"moneyVal":100
		// }
		{
			"premise_accept":"主产品串X，入网月数大于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1，X操作员才能受理(#号分隔)。",
			"act_solution_name":"老用户年末存100送100维系",
			"act_solution_id":"10133071",
			"moneyVal":100
		}
		,{
			"premise_accept":"主产品串X，入网月数大于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1，X操作员才能受理(#号分隔)。",
			"act_solution_name":"老用户年末存200送200维系",
			"act_solution_id":"10133072",
			"moneyVal":200
		}
		,{
			"premise_accept":"主产品串X，入网月数大于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1，X操作员才能受理(#号分隔)。",
			"act_solution_name":"老用户年末存300送300维系",
			"act_solution_id":"10133073",
			"moneyVal":300
		}
		,{
			"premise_accept":"主产品串X，入网月数大于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1，X操作员才能受理(#号分隔)。",
			"act_solution_name":"老用户年末存500送500维系",
			"act_solution_id":"10133074",
			"moneyVal":500
		}
		,{
			"premise_accept":"主产品串X，入网月数大于等于1，办理次数限制类型 同方案限制累计次数，办理次数不超过1，X操作员才能受理(#号分隔)。",
			"act_solution_name":"老用户年末存1000送1000维系",
			"act_solution_id":"10133075",
			"moneyVal":1000
		}
		];
	}else{
		$scope.productType = "OCS充值分月转兑";
		$scope.productList = [{
			"premise_accept":"主产品串OCS3G沃派36元预付费套餐2012,OCS陕西校园专属-沃派16元套餐,OCS陕西校园专属-沃派26元套餐,OCS陕西校园专属-沃派66元套餐，办理次数限制类型 同方案限制累计次数，办理次数不超过1。",
			"act_solution_name":"OCS2016年暑期校园用户存费赠业务维系活动（50元档）",
			"act_solution_id":"10103107",
			"moneyVal":50
		},
		{
			"premise_accept":"主产品串OCS陕西校园专属-沃派16元套餐,OCS3G沃派36元预付费套餐2012,OCS陕西校园专属-沃派26元套餐,OCS陕西校园专属-沃派66元套餐，办理次数限制类型 同方案限制累计次数，办理次数不超过1。",
			"act_solution_name":"OCS2016年暑期校园用户存费赠业务维系活动（100元档）",
			"act_solution_id":"10103095",
			"moneyVal":100
		}
		];
	}
	$scope.input.act_solution = $scope.productList[0];
	$scope.changeA = function () {
		$scope.moneyVal = $scope.input.act_solution.moneyVal;
		$scope.premise_accept = $scope.input.act_solution.premise_accept;
	}
	$scope.changeA();



	//点击提交
	$scope.order = function(){
		$scope.loading = false;
		$scope.resState = true;
		unicomm_server.getUnicomm({
			  "cmd":"bss_flash_finishtrade"
			, "number":schoolActivity["tel"]
			, "citycode":"841"
			, "act_solution_id":$scope.input.act_solution["act_solution_id"]})
		.then(function(return_json){
			if(return_json.status == "1"){
				$ionicPopup.alert({title: '提示',template: '办理成功!'});
			}else{
				$ionicPopup.alert({title: '提示',template: return_json.data});
			}
		}, function() {
			$ionicPopup.alert({title: '提示',template: '办理失败!'});
		})
	}
});