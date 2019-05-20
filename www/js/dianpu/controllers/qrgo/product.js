appControllers.controller('dianpu-qrgo-package', function($scope, $state, $http, $rootScope, my, unicomm_server) {

	$scope.title = "产品列表";
	
	$scope.loading = true;

	$scope.productList = [];
	qrgoInfo = {};
	authentication["orderNo"] = "";
	number_pool = "QRGO";
	
	$scope.qrgo_login = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo_login",
			"userName":qrgoInfo.userName,
			"password":qrgoInfo.password,
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.getProductList();
				}else{
					my.alert("登录失败，当前对接码上购版本V1,请确认码上购版本!");
				}
			}
		)
	}

	$http({
		method : "GET",
		url : ajaxurl + "nowGoApp/getDefaultByShopId?token=" + $rootScope.token
	}).success(function(data){

		if(data.userInfo){
			if(data.userInfo.userName && data.userInfo.password){
				qrgoInfo.userName = data.userInfo.userName;
				qrgoInfo.password = data.userInfo.password;
				$scope.qrgo_login();
			}else{
				my.alert("请联系您的上级代理商绑定码上购账号。").then(function(){
					$state.go("dianpu-qrgo-list")
				});
			}
		}else{
			my.alert("请联系您的上级代理商绑定码上购账号。").then(function(){
				$state.go("dianpu-qrgo-list")
			});
		}
	}).error(function(){
		my.alert("获取码上购账号失败。").then(function(){
			$state.go("dianpu-qrgo-list")
		});;
	});


	$scope.getProductList = function(){

		unicomm_server.getUnicomm({
			"cmd":"qrgo_getProductList"
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					console.log(JSON.stringify( return_json.data))
					for(var i in return_json.data){
						if(return_json.data[i].cardname == "腾讯王卡"){
							qrgoInfo.cardurl = return_json.data[i].cardurl;
						}
					}
					if(qrgoInfo.cardurl){
						$scope.productList = [
							{"id":"0","cardname":"大王卡(19元/月)","img":"img/goDwk.png"},
							{"id":"4","cardname":"地王卡(39元/月)","img":"img/goDiwk.png"},
							{"id":"3","cardname":"天王卡(59元/月)","img":"img/goTwk.png"},
						];
						$scope.loading = false;
					}else{
						my.alert("获取腾讯王卡产品参数失败!");
					}
				}else{
					my.alert("获取产品列表失败!");
				}
			}
		)
	}


	$scope.getInitData = function(i)
	{

		$scope.loading=true;
		order_info = {
			"productId":$scope.productList[i].id
			,"productName":$scope.productList[i].cardname
		}
		unicomm_server.getUnicomm({
			"cmd":"qrgo_getInitData",
			"cardUrl":qrgoInfo.cardurl,
			"product":$scope.productList[i].id,
		}).then(

			function(return_json){
				if (return_json.status == '1') {
					qrgoInfo.provinceCode = return_json.data.provinceData[0].PROVINCE_CODE;
					qrgoInfo.cityCode = return_json.data.cityData[qrgoInfo.provinceCode][0].CITY_CODE;
					qrgoInfo.groupKey = return_json.data.proGroupNum[qrgoInfo.provinceCode];
					qrgoInfo.goodsId = return_json.data.goodsId;
					$state.go("dianpu-qrgo-number");
				}else{
					my.alert("获取产品列表失败!");
				}
			}
		)
	}


});