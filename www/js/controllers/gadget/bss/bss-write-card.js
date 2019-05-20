appControllers.controller('dianpu-bss-write-card', function($scope, $ionicLoading, $ionicPopup, $state, $timeout, $ionicActionSheet, $http, $rootScope, ble, unicomm_server, my) {
	$scope.title = "BSS写卡";
	$scope.resState = true;
	$scope.loading = true;
	$scope.readCardBtn = false;
	$scope.writeCardBtn = true;
	$scope.data = {"tel":"","number":"","promptid":"","sim":""};

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
			$scope.data.number = "";
			$scope.resState = true;
			$scope.loading = true;
		}
	}


	//开始读卡
	$scope.readCard = function(){
		$scope.resState = true;
		$scope.loading = false;
		$scope.read();
	}

	//开始写卡
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



	/*------------------------------------------------------------------------------**/

	$scope.submitsim = function(){
		unicomm_server.getUnicomm({
			"cmd":"bss_writesim",
			"iccid":swap2str($scope.data["sim"]),
			"number":$scope.data['number'],
			"promptid":$scope.data["promptid"],
			"simtype":"0"
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.imsi = return_json.data.imsi;
					$scope.xoption = return_json.data.xoption;
					$scope.writesim();
				}else{
					my.alert("联通白卡校验失败："+return_json.data).then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			},function(return_json){
				my.alert("联通白卡校验失败："+return_json.data).then(function(){
						$scope.resState = false;
						$scope.loading = true;
				});
			}
		)
	}



	$scope.writesim = function(){
		ble.BLEwriteSim($scope.imsi, xoption2str($scope.xoption)).then(function(){
			$ionicPopup.alert({
			   title: '系统提示',
			   template: '写卡完成！',
			   okText:'完成',
			   okType:'button-calm'
			 }).then(function(){
				$state.go('index');
			 });
		}, function(data){
			$scope.resState = false;
			$scope.loading = true;
		})
	}



	/*------------------------------------------------------------------------------**/

	$scope.read = function(){
		if(BLEcurrDevice){
			$scope.readImsi();
		}else{
			ble.BLEconnectServer().then(function(){
				ble.BLEfind().then(function(data){
					$scope.bleSelect(data);
				}, function(){
					my.alert('没有搜索到蓝牙设备!').then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				})

			}, function(){
				my.alert('蓝牙解码服务器不可以,请将手机连接到网络上!').then(function(){
					$scope.resState = false;
					$scope.loading = true;
				});
			})
		}
	}

	$scope.bleSelect = function(data){
		var buttons = []
		for(var i in data){
			buttons.push({"text":data[i]['name']});
		}
		$ionicActionSheet.show({
			"buttons": buttons,
			"cancelText": '取消',
			"titleText": '选择蓝牙',
			cancel: function() {
				$scope.resState = false;
				$scope.loading = true;
			},
			buttonClicked: function(index) {
				BLEcurrDevice = data[index];
				$scope.readImsi();
				return true;
			}
		});
	}

	$scope.readImsi = function(){
		ble.BLEreadSim().then(function(data){
			$scope.data.sim = data;
			if($scope.data.sim.length >= 19){
				$scope.resState = false;
				$scope.loading = true;
				$scope.readCardBtn = true;
				$scope.writeCardBtn = false;
			}else{
				my.alert("读取卡号不完整,请将SIM卡插紧。重新读取一次。").then(function(){
					$scope.resState = false;
					$scope.loading = true;
				});
			}
		},
		function(data){
			my.alert(data).then(function(){
				$scope.resState = false;
				$scope.loading = true;
			});
		});
	}
})