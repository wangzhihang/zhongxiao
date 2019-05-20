appControllers.controller('kuandai-wojia-number-read-write-card', function($scope, $state, $ionicPopup, $ionicActionSheet, unicomm_server, ble, my) 
{
	$scope.title = '宽带写卡';
	$scope.btnText = {"read":"读卡","write":"写卡"};
	$scope.boxDisplay = [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay = [false, true];	// 按钮显示控制
	$scope.btnActive =  [false, false];	// 按钮选中控制
	$scope.resState = false;

	$scope.ReSubmitDiv = true;		// 重新提交按钮

	$scope["tel"] = writesimNow;
	$scope["simcardinfo"] = {"iccid":""}

	//写卡
	var productId;
	if(["wojia-ronghe", "wojia-share-suburb"].indexOf(service_type) != -1){
		productId = "89002922";
	}else{
		productId = kuandai_tel_package_list[writesimNow]["sub_productObj"]["productId"];
	}
	// 显示已连接的设备
	if (BLEcurrDevice) {
		$scope.bleMark = BLEcurrDevice;
		$scope.hasBle = true;
	}
	// 清除已连接的设备
	$scope.clear = function () {
		$scope.hasBle = false;
		BLEcurrDevice = null;
	}


	$scope.reSubmit = function(){

		$scope.ReSubmitDiv = true;
		if($scope.domLine == "10"){
			$scope.CBSSUser();
		}
		else if($scope.domLine == "30"){
			$scope.validNumber();
		}
		else if($scope.domLine == "50"){
			$scope.writeCard();
		}
		else if($scope.domLine == "60"){
			$scope.writesim();
		}
		else if($scope.domLine == "80"){
			$scope.writesimTocbss();
		}
	}
	$scope.interrupt = function(){
		if(arguments[0]){
			my.alert(alertInfo(arguments[0])).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}
	}



	$scope.cbssLogin = function(){

		$scope.boxDisplay = [true, false];

		if($scope.domLine == "30"){
			$scope.validNumber();
		}else{
			$scope.domEaplan = "写卡系统登录";
			$scope.domLine = "10";

			unicomm_server.cbssLogin().then(function(){
				$scope.validNumber()
			}, function(){
				$scope.interrupt();
			});
		}
	}





	$scope.validNumber = function(){
		$scope.domEaplan = "用户建立成功!";
		$scope.domLine = "30";

		unicomm_server.getUnicomm({
			"cmd":"validatetonumber",
			"tonumber":writesimNow
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
				// 	kuandai_tel[writesimNow] = result_json.data;
				// 	kuandai_tel[writesimNow]["itemId"] = result_json.data.lowCostItemId;
					kuandai_tel[writesimNow]["itemId"] = result_json.data.lowCostItemId;
					kuandai_tel[writesimNow]["lowCostItemId"] = result_json.data.lowCostItemId;
					kuandai_tel[writesimNow]["netTypeCode"] = result_json.data.netTypeCode;
					kuandai_tel[writesimNow]["classId"] = result_json.data.classId;
					kuandai_tel[writesimNow]["leaseLength"] = result_json.data.leaseLength;
					kuandai_tel[writesimNow]["lowCost"] = String(result_json.data.lowCost*100);
					
					$scope.writeCard()
				} else {
					$scope.interrupt(result_json.data.message);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}



	$scope.writeCard = function(){

		$scope.domEaplan = "获取SIM卡信息!";
		$scope.domLine = "50";

		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_getwritesiminfo",
			"iccid":$scope.simcardinfo["iccid"],
			"number":writesimNow,
			"productid":productId
		})
		.then(
			function(return_json){
				if (return_json.status == "1" && return_json.data.imsi && return_json.data.xoption) {
					$scope.simcardinfo["procId"] = return_json.data.procid;
					$scope.simcardinfo["imsi"] = return_json.data.imsi;
					$scope.simcardinfo["xoption"] = return_json.data.xoption;
					$scope.simcardinfo["cardData"] = return_json.data.cardData;
					$scope.simcardinfo["resKindCode"] = return_json.data.resKindCode;
					$scope.simcardinfo["capacityTypeCode"] = return_json.data.capacityTypeCode;
					// $scope.writesimTocbss();
					$scope.writesim();
				} else {
					my.alert(alertInfo(return_json.data)).then(function(){
						$scope.simcardinfo["iccid"] = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];	// 读卡div 显示
						$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
						$scope.btnActive =  [false, false];	// 按钮选中状态
					});
				}
			}
		);
	}


	$scope.bleFind = 0;
	$scope.writesim = function() {
		$scope.domEaplan = "写入SIM卡";
		$scope.domLine = "60";
		ble.BLEwriteSim($scope.simcardinfo["imsi"], xoption2str($scope.simcardinfo["xoption"])).then(function(){
			$scope.writesimTocbss();
		}, function(data){
			if($scope.bleFind < 5){
				$scope.bleFind++;
				$scope.writesim();
			}else{
				$scope.interrupt(data);
			}
		})
	}


	$scope.writesimTocbss = function(){	

		$scope.domEaplan = "SIM卡信息同步";
		$scope.domLine = "80";

		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_writesim",
			"iccid":$scope.simcardinfo["iccid"],
			"imsi":$scope.simcardinfo["imsi"],
			"procid":$scope.simcardinfo["procId"],
			"state":"1"
		})
		.then(
			function(return_json){
				if (return_json.status == "1") {
					simcardinfo[writesimNow] = deepCopy($scope.simcardinfo);
					kuandai_tel[writesimNow]["write"] = true;
					$scope.writeOk();
				}else{
					$scope.interrupt(return_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}



	$scope.writeOk = function(){
		$scope.domEaplan = "写卡成功";
		$scope.domLine = "100";

		my.alert("写卡成功!").then(function(){
			writesimNow = null;
			$state.go("kuandai-wojia-number-selected");
		})
	}


	$scope.simcardInput = function(){
		if($scope.simcardinfo["iccid"].length >= 19){
			$scope.btnDisplay = [true, false];
		}else{
			$scope.btnDisplay = [false, true];
		}
	}





	$scope.read = function(){
		if(BLEcurrDevice){
			$scope.readImsi();
		}else{
			ble.BLEconnectServer().then(function(){
				ble.BLEfind().then(function(data){
					$scope.bleSelect(data);
				}, function(){
					my.alert('没有搜索到蓝牙设备!');
				})

			}, function(){
				my.alert('蓝牙解码服务器不可以,请将手机连接到网络上!');
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
				$scope.btnActive[0] = false;
			},
			buttonClicked: function(index) {
				BLEcurrDevice = data[index];
				$scope.readImsi();
				return true;
			}
		});
	}

	$scope.readImsi = function(){
		$scope.resState = true;
		ble.BLEreadSim().then(function(data){
			$scope.simcardinfo.iccid = data;
			if($scope.simcardinfo["iccid"].length >= 19){
				$scope.btnDisplay = [true, false];	// 按钮显示控制
				$scope.resState = false;
			}else{
				my.alert("读取卡号不完整,请将SIM卡插紧。重新读取一次。").then(function(){
					$scope.resState = false;
				});
			}
		},
		function(data){
			my.alert(data).then(function(){
				$scope.resState = false;
			})
		});
	}
})
