// 返单选号码
appControllers.controller('dianpu-bss-order_queryOrderInfo', function($scope, unicomm_server, my) {

	$scope.title = "BSS号码查询";
	$scope.data = {"tel":""};
	$scope.resState = true;
	$scope.loading = false;
	$scope.resultShow = false;
	$scope.bssinfo = {}

	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}


	$scope.order = function(){
		$scope.resState = true;
		$scope.loading = true;
		$scope.resultShow = false;
		$scope.data['number'] = $scope.data["tel"].replace(/[^\d]/g, "");
		unicomm_server.bssLogin().then(function(){
			$scope.bss_order_queryOrderInfo();
		}, function(){
			$scope.resState = false;
			$scope.loading = false;
		})
	}



	$scope.bss_order_queryOrderInfo = function(){
		unicomm_server.getUnicomm({"cmd":"bss_order_queryOrderInfo","serialNumber":$scope.data['number'],"tradeflag":"2"}).then(
			function(return_json){
				if(return_json.status == "1"){
					$scope.loading = false;
					$scope.resultShow = true;
					$scope.bssinfo = return_json.data;
				}else{
					$scope.resState = false;
					$scope.loading = false;
					my.alert(return_json.data);
				}
			}, function(data){
				my.alert("查询结果为空!");
			}
		)
	}
})

.controller('dianpu-cbss-order_queryOrderInfo', function($scope, $rootScope, $filter, $timeout, unicomm_server, my) {

	$scope.title = "CBSS号码查询";
	$scope.data = {"tel":""};
	$scope.resState = true;
	$scope.loading = false;
	$scope.resultShow = false;
	$scope.cbssinfo = {}

	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}


	$scope.order = function(){
		$scope.resState = true;
		$scope.loading = true;
		$scope.resultShow = false;
		$scope.data['number'] = $scope.data["tel"].replace(/[^\d]/g, "");
		unicomm_server.cbssLogin().then(function(){
			$scope.cbss_order_queryOrderInfo();
		}, function(){
			$scope.resState = false;
			$scope.loading = false;
		})
	}



	$scope.cbss_order_queryOrderInfo = function(){
		unicomm_server.getUnicomm({"cmd":"cbss_order_queryOrderInfo","serialNumber":$scope.data['number']}).then(
			function(return_json){
				//console.log(return_json)
				if(return_json.status == "1"){
					$scope.loading = false;
					$scope.resultShow = true;
					$scope.cbssinfo = return_json.data;
				}else{
					$scope.resState = false;
					$scope.loading = false;
					my.alert(return_json.data);
				}
			}, function(data){
				my.alert("查询结果为空!");
			}
		)
	}
})