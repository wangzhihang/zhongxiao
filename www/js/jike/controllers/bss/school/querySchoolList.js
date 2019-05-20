appControllers.controller('school-package', function($scope, $state, $http, $rootScope, unicomm_server, my) {
	
	$scope.title = "套餐列表";
	if(service_type == "schoolBssNumber"){
		$scope.queryproductidlist = [
			  {"id":"100257", "name":"固带移(专用59元)"}
			, {"id":"100258", "name":"固带移(专用39元)"}
			
			// , {"id":"103974", "name":"OCS4G沃派26元套餐（A）新"}
			// , {"id":"101183", "name":"OCS日租套餐"}
			// , {"id":"76916",  "name":"OCS半年流量卡"}
			// , {"id":"110169", "name":"OCS36元沃派畅视卡"}
			
			// , {"id":"104607", "name":"10元智慧互动课堂卡(新)"}
			// , {"id":"104608", "name":"18元宝宝沃卡(新)"}
			// , {"id":"104609", "name":"28元宝宝沃卡(新)"}
			// , {"id":"104368", "name":"关爱快递专属卡(新)"}
		];
	// }else if (service_type == "zhuNongKaBssNumber") {
	// 	$scope.queryproductidlist = [
	// 		  {"id":"102177", "name":"OCS农业信息化应用专属套餐A"}
	// 		, {"id":"103385", "name":"OCS农业信息化应用专属套餐B"}
	// 	];		
	}else if (service_type == "groupBssEnterprise") {
		$scope.queryproductidlist = [
			  {"id":"100257", "name":"固带移(专用59元)"}
			, {"id":"100258", "name":"固带移(专用39元)"}
			// , {"id":"104608", "name":"18元宝宝沃卡(新)"}
		]
	}
	$scope.order = function(row){
		school["productid"] = $scope.queryproductidlist[row]["id"];
		school["productname"] = $scope.queryproductidlist[row]["name"];
		$http({
			method: 'GET',
			url: ajaxurl + '/identityApp/toBssIdentity?token='+ $rootScope.token,
			params:{"number":telInfo['tel'], "productId":school["productid"], "productName":school["productname"], "source":source}
		}).success(function(data) {
			authentication["orderNo"] = data.orderNo;
			$state.go(service_type == "groupBssEnterprise" ? "bss-getEnterpriseInfo" : "school-querygrouplist")
		}).error(function(){
			my.alert("生成订单失败!")
		});
	}
})


.controller('bss-getEnterpriseInfo', function($scope, $rootScope, $http, $state, unicomm_server, my) {

	$scope.title = "营业执照";
	$scope.input = {"psptId":""};
	$scope.enterpriseList = [];

	$scope.loading = true;
	$scope.resState = false;	// 搜索按钮
	
	$scope.addrLi = true;	// 搜索记录
	$scope.addrList = true;	// 搜索记录列表
	$scope.nocity = true;	// 搜索记录为空

	$scope.historyLi = false;	// 搜索历史列表
	$scope.historyTips = true;	// 搜索历史为空

	//点击查询
	$scope.queryList = function(){
		$scope.loading = false;
		$scope.resState = true;
		$scope.historyLi = true;
		if($scope.input.psptId == ""){
			my.alert("请输入营业执照编码").then(function(){
				$scope.resState = false;
				$scope.historyLi = false;
				$scope.loading = true;
			})
		}else{
			unicomm_server.getUnicomm({
				  "cmd":"bss_getInheritInfo"
				, "viaIdentityCode":$scope.input.psptId
			}).then(
				function(result_json){
					if (result_json.status == "1") {
						if(result_json.data.length){
							$scope.addrLi = false;
							$scope.addrList = false;

							$scope.enterpriseList = result_json.data;
							$scope.areaHistory();
						}else{
							my.alert("在联通库中没有查到信息，请重新输入！").then(function(){
								$scope.addrLi = false;
								$scope.nocity = false;
							})
						}
					} else {
						my.alert("在联通库中没有查到信息，请重新输入！").then(function(){
							$scope.addrLi = false;
							$scope.nocity = false;
						})
					}

					$scope.loading = true;
					$scope.resState = false;
				}
			);
		}
	}

	$scope.order = function(row){
		bss_enterpriseInfo = $scope.enterpriseList[row];
		$state.go("school-querygrouplist");
	}
	


	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_Enterprise_key"));
		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
			$scope.historyTips = false;
		}else{
			$scope.historyTips = true;
		}
	}
	$scope.showHistory();	//显示搜索历史记录



	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.input.psptId = row.key;
			$scope.queryList();
		}else{
			$scope.clearHistory(row.key);
		}
	}

	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("bss_Enterprise_key");
		var areaJson = {"key":$scope.input.psptId};
		if(areaHistory == null){
			localStorage.setItem("bss_Enterprise_key",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.input.psptId);
			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_Enterprise_key"));
			localStorage.setItem("bss_Enterprise_key",JSON.stringify([areaJson].concat(areaHistoryJson)))
		}
	}


	// 清除历史记录
	$scope.clearHistory = function(){
		var key  = arguments[0];
		if(key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("bss_Enterprise_key"));
			for(var i in areaHistory){
				if(areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("bss_Enterprise_key",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('bss_Enterprise_key');
		}
		$scope.showHistory();
	}



	$scope.editHistoryText = "编辑";
	$scope.editHistoryBtn = true;
	$scope.editHistory = function(){
		if($scope.editHistoryText == "编辑"){
			$scope.editHistoryText = "完成";
			$scope.editHistoryBtn = false;
		}else{
			$scope.editHistoryText = "编辑";
			$scope.editHistoryBtn = true;
		}
	}
})



.controller('school-querygrouplist', function($scope, $state, $http, $rootScope, $ionicPopup, $ionicLoading, unicomm_server, my) {
	$scope.title = "机构选择";
	$scope.citylist = true;
	$scope.nocity = true;
	$scope.clicked = false;
	$scope.loading = [true];

	$scope.group = {"keyword":""};
	if(service_type == "groupBssEnterprise"){
		$scope.group.keyword = bss_enterpriseInfo.rstName;
	}
	
	$scope.querygrouplist = [];

	$scope.queryList=function(){
		$scope.clicked = true;
		$scope.loading[0] = false;
		unicomm_server.bssLogin().then(function(){
			unicomm_server.getUnicomm(unicomm_command = {
					"cmd":"bss_schoollan_getGroupList"
					,"groupkeyword":$scope.group.keyword
			}).then(function(return_json){
				if (return_json.status == "1"){
					$scope.loading[0] = true;
					$scope.clicked = false;
					$scope.querygrouplist = Array2delArray(return_json.data, "value", ["-1"]);
				} else {
					my.alert(return_json.data).then(function() {
						$scope.querygrouplist = [];
						$scope.nocity = false;
						$scope.loading[0] = true;
						$scope.clicked = false;
					})
				}

			}, function() {
				my.alert('获取机构列表失败!');
				$scope.loading[0] = true;
				$scope.clicked = false;
			})
		},function(){
			$scope.loading[0] = true;
			$scope.clicked = false;
		});
	};

	$scope.order = function(row){
		school["groupid"] = row.value;
		school["groupname"] = row.name;
		$state.go("school-queryareatown")
	}
})





.controller('school-queryareatown', function($scope, $state, $http, $rootScope, $ionicPopup, $ionicLoading, unicomm_server) {
	$scope.title = "区域列表";
	$scope.queryareatownList = [];
	$scope.clicked = false;
	$scope.loading = [true];

	$scope.clicked = true;
	$scope.loading[0] = false;
	unicomm_server.getUnicomm(
		{"cmd":"bss_queryareatown",
		 "dealer":bssInfo["developCode"]}).then(
	function(return_json){

		if (return_json.status == "1"){
			// alert(return_json.data)
			$scope.clicked = false;
			$scope.loading[0] = true;
			var html_dom = [];
			$(return_json.data).find("option").each(function(){
				if($(this).val() != "0"){
					html_dom.push({"id":$(this).val(),"name":$(this).text()})
				}
			})
			
			$scope.queryareatownList = html_dom;
		} else {
			$scope.querygrouplist = [];
		}
	}, function() {
		$ionicPopup.alert({title: '提示',template: '获取区域列表失败!'});
	})
	


	$scope.order = function(row){
		school["areaTownId"] = row.id;
		school["areaTownName"] = row.name;
		$state.go("authentication-device")
	}

})


;