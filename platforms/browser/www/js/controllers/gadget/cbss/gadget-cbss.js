//
appControllers.controller('gadget-cbss', function($scope,$state) {
	$scope.title = "CBSS小工具";
	//重置
	$scope.resetCard = function(){
		$state.go('gadget-cbss-reset-card');
	}
	//返销
	$scope.cancelCard = function(){
		$state.go('gadget-cbss-cancel-card');
	}
})



.controller('gadget-cbss-reset-card', function($scope, $ionicActionSheet, unicomm_server, ble, my) {
	$scope.title = "CBSS废卡重置";
	$scope.simInput = {"simcard":""};
	$scope.imsi = "";
	$scope.iccid = "";
	$scope.procid = "";
	$scope.apduAry = [];
	$scope.readI = 0;
	$scope.simList = [];

	$scope.loading = false;
	$scope.resState = false;

	//立即重置
	$scope.write = function(){
		if($scope.simInput.simcard.length < 19){
			my.alert("请先读卡！");
			return false;
		}
		if($scope.simList.indexOf($scope.simInput.simcard) !== -1){
			my.alert("本卡已经重置成功，重复重置将造成卡片损坏!");
			return false;
		}
		if(!$scope.resState){
			$scope.order_unlockBlankCardNew();
		}
		$scope.resState = true;
		$scope.loading = true;
		
	}

	// 获取 apdu 指令 
	$scope.order_unlockBlankCardNew = function(){
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_order_unlockBlankCardNew",
				"iccid":$scope.simInput.simcard,
				"imsi":$scope.imsi
			}).then(function(return_json){
				$scope.apduAry = [];
				$scope.readI = 0;
				if (return_json.status == '1') {
					$scope.procid = return_json.data.procid;
					$scope.iccid = return_json.data.iccid;
					$scope.getApdu(return_json.data.imsiscript);
					$scope.getApdu(return_json.data.ortherscriptseq);
					$scope.order_unlockcardsuccess();
				} else {
					$scope.complete(return_json.data ? return_json.data : "重置失败");
				}
			})
		});
	}

	$scope.getApdu = function(imsiCommonds) {
		var commondList = imsiCommonds.split("!");
		for(var i = 1; i < commondList.length; i++) {
			var allcommond = commondList[i];
			var commond = allcommond.split(",")[0];
			$scope.apduAry.push(commond);
		}
	}

	// 重置成功
	
	$scope.order_unlockcardsuccess = function(){
		ble.BLEresetSim($scope.apduAry).then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_order_unlockcardsuccess",
				"iccid":$scope.iccid,
				"imsi":$scope.imsi,
				"procid":$scope.procid,
				"result":"1"
			}).then(function(return_json){
				if (return_json.status == '1') {
					$scope.simList.push($scope.simInput.simcard);
					$scope.complete(return_json.data);
				} else {
					$scope.complete(return_json.data ? return_json.data : "重置失败");
				}
			})
		}, function(){
			if($scope.readI < 5){
				$scope.readI++;
				$scope.order_unlockcardsuccess();
			}else{
				$scope.complete("SIM卡重置失败!	请重新重置SIM卡。");
			}
		});
	}


	// 读卡
	$scope.read = function(){

		$scope.resState = true;
		$scope.loading = true;

		if(BLEcurrDevice){
			$scope.readImsi();
		}else{
			ble.BLEfind().then(function(data){
				$scope.bleSelect(data);
			}, function(){
				$scope.complete('没有搜索到蓝牙设备!');
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
				$scope.complete();
			},
			buttonClicked: function(index) {
				BLEcurrDevice = data[index];
				$scope.readImsi();
				return true;
			}
		});
	}


	$scope.readImsi = function(){
		ble.BLEreadSim(true).then(function(data){
			$scope.simInput.simcard = data;
			if($scope.simInput.simcard.length >= 19){
				ble.BLEreadImsi().then(function(imsi) {
					$scope.imsi = imsi;
					$scope.complete();
				}, function(error) {
					$scope.complete(error);
				});
			}else{
				$scope.complete("读取卡号不完整,请将SIM卡插紧。重新读取一次。");
			}
		}, function(data){
			$scope.complete(data);
		});
	}

	$scope.complete = function(){
		var data = arguments[0];
		if(data != undefined){
			my.alert(data);
		}
		$scope.resState = false;
		$scope.loading = false;
	}
})



.controller('gadget-cbss-cancel-card', function($scope, unicomm_server, my)
{
	$scope.title = "CBSS返销";
	$scope.data = {"tel":""};

	$scope.resState = true;
	$scope.loading = false;

	$scope.orderInfo = {}

	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	};
	
	$scope.cancelCard = function(){
		$scope.resState = true;
		$scope.loading = true;
		$scope.orderInfo = {};
		
		
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_order_queryCancelInfo",
				"serialNumber":$scope.data.tel.replace(/[^\d]/g, "")
			}).then(function(return_json){
				console.log(return_json)
				if (return_json.status == '1') {
					$scope.orderInfo["tradeBase"] = return_json.data["tradeBase"];
					$scope.orderInfo["custInfo"] = return_json.data["orderList"];
					$scope.orderInfo["selectOrder"] = return_json.data["orderList"][0];
					$scope.cbss_order_cancelCbssOrder();
				} else {
					my.alert(return_json.data);
					$scope.resState = false;
					$scope.loading = false;
				}
			})
		});
	}


	$scope.cbss_order_cancelCbssOrder = function(){

		unicomm_server.getUnicomm({
			"cmd":"cbss_order_cancelCbssOrder",
			"tradeBase":$scope.orderInfo["tradeBase"],
			"selectOrder":$scope.orderInfo["selectOrder"],
			"custInfo":$scope.orderInfo["custInfo"]
		}).then(function(return_json){
			console.log(return_json)
			if (return_json.status == '1') {
				$scope.resState = false;
				$scope.loading = false;
			} else {
				my.alert(return_json.data);
				$scope.resState = false;
				$scope.loading = false;
			}
		});

	}
})
