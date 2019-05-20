appControllers.controller('bss-payfee', function($scope, $state, unicomm_server, $http, $rootScope, my) {
	$scope.title = "BSS补交费";
	$scope.resState = true;
	$scope.loading = true;
	$scope.data = {"tel":"","promptid":""};

	$scope.telChange = function(){
		$scope.data.tel = telFormat($scope.data.tel);
		if($scope.data.tel.replace(/[^\d]/g, "").length >= 11){
			$scope.data.number = $scope.data.tel.replace(/[^\d]/g, "");
			$scope.loading = false;
			$http({
				  "method":'GET'
				, "url":ajaxurl + 'orderApp/getTradeIdByNumber'
				, "params":{
						  "token": $rootScope.token
						, "number":$scope.data.number
					}
			}).success(function(return_json){
				if(return_json.status === "1"){
					$scope.resState = false;
					$scope.loading = true;
					$scope.data.promptid = return_json.tradeId
				}else{
					my.alert(return_json.error).then(function(){
						$scope.data.number = ""
						$scope.loading = true;
						$scope.resState = true;
					});
				}
			}).error(function(){
				my.alert("获取交易编码失败，请联系号码之家客服!").then(function(){
					$scope.data.number = ""
					$scope.loading = true;
					$scope.resState = true;
				});
			});
		}else{
			$scope.data.number = ""
			$scope.resState = true;
			$scope.loading = true;
		}
	}

	$scope.writeCard = function(){
		$scope.resState = true;
		$scope.loading = false;
		unicomm_server.bssLogin().then(function(){
			$scope.submitsim();
		},function(){
			$scope.resState = false;
			$scope.loading = true;
		});
	}

	$scope.submitsim = function(){
		var unicomm_command = new Object();
			unicomm_command.cmd = "bss_payfee";
			unicomm_command.lanaccount = $scope.data.promptid;

		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if (return_json.status == '1' || return_json.data.indexOf("受理已清费") >= 0){
					my.alert('BSS补交费完成！').then(function(){
						$state.go('index');
					 });
				}else{
					my.alert("BSS补交费失败，原因："+return_json.data).then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			},function(){
				$scope.resState = false;
				$scope.loading = true;
			}
		)
	}
})