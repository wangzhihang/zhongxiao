appControllers

.controller('dianpu-qrgoV2-writesimok', function($scope, $state, $http, $rootScope, $ionicActionSheet, ble, unicomm_server, my) {

	$scope.title = qrgoInfo.number;

	$scope.simInput = {simcard:""}

	$scope.btnText		= {"read":"读卡","write":"写卡"};	// 读写卡按钮文字
	$scope.boxDisplay	= [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay 	= [false, true];	// 按钮显示控制
	$scope.btnActive 	= [false, false];	// 按钮选中控制
	$scope.ReSubmitDiv	= true;				// 重新提交按钮


	$scope.reSubmit = function(){
		$scope.ReSubmitDiv = true;
		if($scope.domLine == "20"){
			$scope.qrgo2_writesim();
		}
		else if($scope.domLine == "40"){
			$scope.writesim();
		}
		else if($scope.domLine == "60"){
			$scope.writesimok();
		}
		else if($scope.domLine == "80"){
			$scope.writeOrder();
		}
		else if($scope.domLine == "90"){
			$scope.updateShop();
		}
	}

	
	// 重新提交显示
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		var popupTxt = alertInfo(msg["text"]);
		if(msg["popup"]){
			my.alert(popupTxt).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}
	}
	
	$scope.saveFailed = function(){
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/saveFailedInfo?token=" + $rootScope.token,
			data : {"orderCode":authentication["orderNo"], "node":arguments[0]+"(v2)", "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}
	
	$scope.write = function(){
		$scope.qrgo2_writesim();
	}


	$scope.qrgo2_writesim = function() {

		$scope.domEaplan = "提交SIM卡";
		$scope.domLine = "20";
		$scope.boxDisplay = [true, false];

		unicomm_server.getUnicomm({
			"cmd":"qrgo2_writesim",
			"orderId":qrgoInfo.orderId,
			"iccid":$scope.simInput.simcard
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					qrgoInfo.imsi = return_json.data.imsi;
					qrgoInfo.xoption = return_json.data.scriptSeq;
					$scope.writesim();
				}else{
					$scope.saveFailed("2i产品-订单绑定SIM卡", alertInfo(return_json.data));
					my.alert(alertInfo(return_json.data)).then(function(){
						$scope.simInput.simcard = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];
						$scope.simcardInput();
					});
				}
			}
		)
	}


	$scope.writesim = function() {

		$scope.domEaplan = "写入SIM卡";
		$scope.domLine = "40";

		ble.BLEwriteSim(qrgoInfo.imsi, xoption2str(qrgoInfo.xoption)).then(function(){
			$scope.writesimok();
		}, function(data){
			$scope.interrupt({
				"popup":true,
				"text":data,
				"saveName":"2i产品-写入SIM卡",
			});
		})
	}

	$scope.writesimok = function()
	{
		$scope.domEaplan = "订单确认";
		$scope.domLine = "60";
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_finalSubmit",
			"orderId":qrgoInfo.orderId
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.writeOrder();
				}else{
					$scope.interrupt({
						"popup":true,
						"text":return_json.data,
						"saveName":"2i产品-SIM卡联通绑定失败!",
					});
				}
			}
		)
	}


	$scope.writeOrder = function(){
		$scope.domEaplan = "订单回写";
		$scope.domLine = "80";
		$http({
			"url" : ajaxurl+ "orderApp/savedirecttrade",
			"method" : "GET",
			"params":{
				"token": $rootScope.token,
				"orderNo": authentication['orderNo'],
				"imsi": qrgoInfo.imsi,
				"xoption": qrgoInfo.xoption,
				"ccid": $scope.simInput.simcard,
				"tradeFee":"0",
				"preCharge": "0",
				"tradeId": "",
				"number": qrgoInfo.number,
				"name":authentication['name'],
				"cardid": authentication["cardId"],
				"selectedElement": "",
				"type": order_type2id[order_type],
			},
		}).success(function(){
			if($rootScope.isShowsetTab === false || userBo.testTag == "000001"){
				$scope.updateShop();
			}else{
				my.alert("当前店铺未走账，不会产生任何交易流水，当前号码若为测试号码，请及时返销，若是用户正常开户，可忽略此信息。").then(function(){
					$state.go("ok");
				})
			}
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"订单写入失败",
				"saveName":"2i产品-回写订单",
			});
		});
	}
	

	$scope.updateShop = function(){
		$scope.domEaplan = "订单确认";
		$scope.domLine = "90";
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/orderCheckOut?token=" + $rootScope.token,
			data : {"orderNo":authentication["orderNo"],"productId":"0","preCharge":"0"}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"更新订单状态失败",
				"saveName":"2i产品-订单确认",
			});
		});
	}


	$scope.read = function(){
		if($scope.btnActive[0]){
			my.alert('正在读取中,请稍后!');
		}else{
			$scope.btnActive[0] =  true; // 选中状态开启
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
		ble.BLEreadSim().then(function(data){
			$scope.simInput.simcard = data;
			if($scope.simInput.simcard.length >= 19){
				// 读卡消失,写卡浮现
				$scope.btnDisplay = [true, false];	// 按钮显示控制
				$scope.btnActive =  [false, false];	// 按钮选中控制
			}else{
				my.alert("读取卡号不完整,请将SIM卡插紧。重新读取一次。").then(function(){
					$scope.btnActive[0] =  false;
				});
			}
		},
		function(data){
			my.alert(data).then(function(){
				$scope.btnActive[0] = false;
			});
		});
	}


	$scope.simcardInput = function(){
		if($scope.simInput.simcard.length >= 19){
			// 读卡消失,写卡浮现
			$scope.btnDisplay = [true, false];	// 按钮显示控制
		}else{
			$scope.btnDisplay = [false, true];	// 按钮显示控制
		}
		$scope.btnActive =  [false, false];	// 按钮选中控制
	}
});





// .controller('dianpu-qrgo-applyOrder', function($scope, $state, $http, $rootScope, my, unicomm_server, url2base64) {

	// 	$scope.title = "受理订单";
	// 	$scope.orderList = [];
	// 	qrgoInfo = {};
	// 	authentication["orderNo"] = "";
	// 	$scope.loading = true;
	// 	$scope.noOrder=false;
	// 	$scope.qrgo_login = function(){
	// 		unicomm_server.getUnicomm({
	// 			"cmd":"qrgo_login",
	// 			"userName":qrgoInfo.userName,
	// 			"password":qrgoInfo.password,
	// 		}).then(
	// 			function(return_json){
	// 				if (return_json.status == '1') {
	// 					$scope.qrgo_getOrderList();
	// 				}else{
	// 					my.alert("登录失败!");
	// 				}
	// 			}
	// 		)
	// 	}
	
	
	// 	$scope.qrgo_getOrderList = function(i)
	// 	{
	// 		unicomm_server.getUnicomm({
	// 			"cmd":"qrgo_getOrderList"
	// 		}).then(
	// 			function(return_json){
	// 				$scope.loading = false;
	// 				if (return_json.status == '1') {
	// 					if(return_json.data.length==0){
	// 						$scope.noOrder=true;
	// 					}else{
	// 						$scope.orderList = return_json.data;
	// 					}
	// 				}else{
	// 					my.alert("获取产品列表失败!");
	// 				}
	// 			}
	// 		)
	// 	}
	// 	$http({
	// 		method : "GET",
	// 		url : ajaxurl + "nowGoApp/getDefaultByShopId?token=" + $rootScope.token
	// 	}).success(function(data){
	// 		if(data.userInfo){
	// 			if(data.userInfo.userName && data.userInfo.password){
	// 				qrgoInfo.userName = data.userInfo.userName;
	// 				qrgoInfo.password = data.userInfo.password;
	// 				$scope.qrgo_login();
	// 			}else{
	// 				my.alert("请联系您的上级代理商绑定码上购账号。");
	// 			}
	// 		}else{
	// 			my.alert("请联系您的上级代理商绑定码上购账号。");
	// 		}
	// 	}).error(function(){
	// 		my.alert("获取码上购账号失败。");
	// 	});
	
		
	// 	$scope.submitOrder = function(i){
	// 		// 选定这里 loading 开始
	
	// 		$scope.noOrder=false;
	
	// 		qrgoInfo.number = $scope.orderList[i].PHONE_NUMBER
	// 		qrgoInfo.orderId = $scope.orderList[i].ORDER_ID;
	// 		qrgoInfo.ORDER_SUB_STATE_DESC = $scope.orderList[i].ORDER_SUB_STATE_DESC;
	// 		qrgoInfo.ORDER_STATE = $scope.orderList[i].ORDER_STATE
	// 		app = "dianpu";
	// 		order_type = "kaika";
	// 		number_pool = "QRGO";
	// 		service_type = "qrgo";
	// 		source = "000028";
	// 		sourceName = "2i产品"
	// 		order_info = {
	// 			"number":qrgoInfo.number,
	// 			"productId":"",
	// 			"productName":$scope.orderList[i].PRODUCT_NAME,
	// 		}
	
	// 		$http({
	// 			method : "GET",
	// 			url : ajaxurl + "numberOrderApp/queryOneCardInfoByCondition",
	// 			params: {
	// 				"token":$rootScope.token,
	// 				"number":qrgoInfo.number,
	// 				"customer":$scope.orderList[i].RECEIVER_NAME,
	// 				"contactNumber":$scope.orderList[i].MOBILE_PHONE,
	// 			}
	// 		}).success(function(data){
	// 			if(data && data.result && data.result.orderNo){
	// 				authentication["name"] = data.result.name;
	// 				authentication["cardId"] = data.result.cardId;
	// 				authentication["nation"] = data.result.nation;
	// 				authentication["end_date"] = data.result.validEnd.replace(/[^\d]/g, "");
	// 				authentication["start_date"] = data.result.validStart.replace(/[^\d]/g, "");
	// 				authentication["address"] = data.result.address;
	// 				authentication["orderNo"] = data.result.orderNo;
	// 				url2base64.getBase64(data.result.idCardHeadUrl).then(function(base64){
	// 					authentication["idHeadImg"] = base64.substring(23);
	// 					url2base64.getBase64(data.result.customerImageUrl).then(function(base64){
	// 						authentication["customerImagebase64"] = base64.substring(23);
	// 						$scope.goState(true)
	// 					}, function(){
	// 						$scope.goState()
	// 					})
	// 				}, function(){
	// 					$scope.goState()
	// 				})
	// 			}else{
	// 				$scope.goState()
	// 			}
	// 		}).error(function(){
	// 			$scope.goState()
	// 		});
	// 	}
	
	// 	$scope.goState = function(){
	// 		$scope.noOrder=true;
	// 		if(arguments[0] == true){
	// 			$state.go("dianpu-qrgo-writesimok");
	// 		}else{
	// 			$state.go("authentication-device");
	// 		}
	
	// 	}
	// })