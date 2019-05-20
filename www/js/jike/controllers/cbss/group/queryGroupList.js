appControllers.controller('group-querygrouplist', function($scope, $state, $http, $rootScope, $ionicPopup, $ionicLoading, unicomm_server) {
	$scope.title = "集团选择";
	$scope.citylist = true;
	$scope.nocity = true;
	$scope.clicked = false;
	$scope.loading = [true];

	$scope.group = {"keyword":""};
	
	// 如果对公开户 可以省略输入 集团名称
	if(jike_group_person["custName"]){
		$scope.group.keyword = jike_group_person["custName"];
	}

	$scope.querygrouplist = [];

	$scope.queryList=function(){
		unicomm_command = {
			"cmd":"cbss_group_querygrouplist"
			,"keyword":$scope.group.keyword
			,"page":"1"
		}

		unicomm_server.cbssLogin().then(
			function(){
				$scope.clicked = true;
				$scope.loading[0] = false;
				unicomm_server.getUnicomm(unicomm_command).then(
					function(data){
						// alert(JSON.stringify(unicomm_command))
						// alert(JSON.stringify(data))
						if (data.status == "1"){
							$scope.loading[0] = true;
							$scope.clicked = false;
							$scope.citylist = false;
							$scope.nocity = true;
							$scope.querygrouplist = data.data;
						} else {
							$scope.querygrouplist = [];
							$scope.nocity = false;
						}
					},
					function(textStatus, errorThrown){
						$ionicPopup.alert({"title":textStatus,"template":errorThrown});
					}
				);
			},
			function()
			{
				$ionicPopup.alert({title: '系统提示',template: "登录失败,请联系管理员!",okText:"我知道了",okType:"button-calm"});
			}
		);
	};

	$scope.order = function(row){

		group = {
			  "groupId":row.groupId
			, "groupName":row.groupName
			, "groupCustId":row.groupCustId
		}


		$state.go("group-querygroupproductlist")
	}

})

.controller('group-querygroupproductlist', function($scope, $state, $http, $rootScope, $ionicPopup, $ionicLoading, unicomm_server) {
	$scope.title = "集团产品列表";
	$scope.querygrouplist = [];
	$scope.loading = [true];

	unicomm_command = {
		"cmd":"cbss_group_querygroupproductlist"
		,"groupid":group["groupId"]
	}
	unicomm_server.cbssLogin().then(

		function(){
			$scope.loading[0] = false;
			unicomm_server.getUnicomm(unicomm_command).then(
				function(data){
					// alert(JSON.stringify(unicomm_command))
					// alert(JSON.stringify(data))
					if (data.status == "1"){
						$scope.loading[0] = true;
						console.log(JSON.stringify(data.data))
						$scope.querygrouplist = data.data;
					} else {
						$scope.querygrouplist = [];
					}
				},
				function(textStatus, errorThrown){
					$ionicPopup.alert({"title":textStatus,"template":errorThrown});
				}
			);
		},
		function()
		{
			$ionicPopup.alert({title: '系统提示',template: "登录失败,请联系管理员!",okText:"我知道了",okType:"button-calm"});
		}
	);

	$scope.order = function(row){
		group["productUserId"] = row.productUserId;
		group["groupProductId"] = row.groupProductId;
		$state.go("group-queryproductbygroupid")
	}
})


.controller('group-queryproductbygroupid', function($scope, $state, $http, $rootScope, unicomm_server, my) {
	$scope.title = "集团套餐列表";
	$scope.loading = [true];

	// 顺丰把集客内容写死不用前面在查找了
	if(service_type == "groupSfCbssSemiManufactures"){
		group = {
			  "productUserId":"841GSV136321"
			, "groupProductId":"8417022884220260"
		}
	}
	unicomm_command = {
		"cmd":"cbss_product_queryproductbygroupid"
		,"groupUserId":group["productUserId"]
	}

	unicomm_server.cbssLogin().then(
		function(){
			$scope.loading[0] = false;
			unicomm_server.getUnicomm(unicomm_command).then(
				function(return_json){
					console.log(return_json)
					$scope.querygrouplist = [];
					if (return_json.status == "1"){
						$scope.loading[0] = true;
						if(service_type == "groupSfCbssSemiManufactures"){
							for(var i in return_json.data){
								var productName = return_json.data[i]["productName"].substring(0, 4);
								if(productName == '畅爽' || productName == '钉钉'){
									$scope.querygrouplist.push(return_json.data[i])
								}
							}
						}else{
							var productAllow = [
								 "90126144"
								,"90126163"
								,"90126182"
								,"90311029"
								,"90131367"
								,"90311053"
								,"90155715"
								,"90339638"
								,"90166583"
								,"90339627"
								,"90343547"
								,"90355587"
								,"90355599"
								,"90356341"
								,"90356344"
								,"90356346"
								
								,"90381159"
								,"90371385"
								,"90371386"
								,"90371391"

								,"90394485"
							];
							for(var i in return_json.data){
								if(productAllow.indexOf(return_json.data[i].productId) !== -1){
									$scope.querygrouplist.push(return_json.data[i])
								}
							}
						}
					}
				}
			);
		},
		function(){
			my.alert("登录失败,请联系管理员!");
		}
	);

	$scope.order = function(row){
		group["productId"] = row.productId;
		group["productObj"] = row;
		$http({
			method: 'GET',
			url: ajaxurl + 'identityApp/toIdentity?token='+ $rootScope.token,
			params : {"number":telInfo['tel'], "productId":row.productId, "productName":group["productObj"]["productName"], "source":source}
		}).success(function(data){
			authentication["orderNo"] = data.orderNo;
			$state.go("jike-cbbs-package-result")
		})
	}
})

;
