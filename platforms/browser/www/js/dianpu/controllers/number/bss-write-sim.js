appControllers.controller('dianpu-bss-write-sim', function($scope, $state, $http, $rootScope, $ionicPopup, my) {

	$scope.title = "订单确认";

	// 如果是异步订单直接提交
	if(yy_order.orderCode){
		$state.go("dianpu-bss-write-sim-submit");	
	}


	$scope.simInput = {
		"name":authentication["name"],
		"cardId":authentication["cardId"],
		"number":telInfo["tel"],
		"preNumberCharge":telInfo["lowCost"],
		"preFee":(telInfo["preCharge"] == "0" ? "100" : telInfo["preCharge"]),
		"editPreFee":""
	}
	if(telInfo["originalPreCharge"] == undefined){
		telInfo["originalPreCharge"] = "50";
	}


	$scope.editPreFee = function() {
		$ionicPopup.show({
			"template": '<input type="tel" ng-model="simInput.editPreFee" placeholder="预存金额不能少于'+telInfo["originalPreCharge"]+'元">',
			"title": '输入预存金额',
			"scope": $scope,
			"buttons":[
				{"text":'取消'},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						if(Number($scope.simInput.editPreFee) < Number(telInfo["originalPreCharge"])){
							$scope.simInput.editPreFee = "";
							e.preventDefault();
						}else{
							$scope.simInput.preFee = $scope.simInput.editPreFee;
							$scope.simInput.editPreFee = "";
						}
					}
				},
			]
		});
	}



	$scope.order = function(){
		if(app == "dianpu" && userBo.testTag == "000001"){
			$http({
				method: 'GET',
				url: ajaxurl + "shopAndroid/validateBalance?token=" + $rootScope.token,
				params: {"orderNo":authentication['orderNo'], "preCharge":$scope.simInput.preFee}
			}).success(function(return_json){
				if(return_json.result == "1"){
					$scope.orderGo()
				}else{
					my.alert(return_json.msg);
				}
			}).error(function(){
				my.alert("店铺余额判断失败,请和系统管理联系!");
			})
		}else{
			$scope.orderGo()
		}
	}

	$scope.orderGo = function(){
		submitFee = $scope.simInput.preFee;
		if(authentication["sign"]){
			$state.go("dianpu-bss-write-sim-submit");
		}else{
			$state.go("signature");
		}
	}
})


.controller('dianpu-bss-write-sim-submit', function($scope, $rootScope, $http, $state, $ionicActionSheet, $cordovaBarcodeScanner, $filter, unicomm_server, ble, my) {

	$scope.title = sourceName + "("+ telInfo["tel"] +")";

	$scope.proTypes = [
		 {"customerGroupId":"2", "preserver13":"22","name":"普通卡"} 	// 普通卡
		,{"customerGroupId":"2", "preserver13":"7","name":"惠农卡"} 	// 惠农卡
	];
	
	$scope.input = {
		"proType":$scope.proTypes[(dianpu_bss_package_array["bssPackageSelect"]["productId"] == "109170" ? 1 : 0)]
	};

	$scope.simInput = {
		  "preFee":submitFee
		, "simcard":""
	}

	// 
	if(service_type == "bssSemiManufactures"){
		$scope.input.simtype = {"id":"1", "name":"半成卡"};
	}else{
		$scope.input.simtype = {"id":"0", "name":"白卡"};
	}

	// 如果是异步订单直接提交
	if(yy_order.orderCode){	
		// 设为半成卡
		$scope.input.simtype = {"id":"1", "name":"半成卡"};
		service_type = "telSelectNewBSS";
		authentication["orderNo"] = yy_order.orderCode;
		// 预存
		$scope.simInput.preFee = yy_order.preFee;
	}

	var unicomm_type;
	if(service_type == "bssSemiManufactures"){
		unicomm_type = source == "000005" ? "telSelectBSS" : "telSelectNewBSS";
	}else{
		unicomm_type = service_type;
	}

	// 订单 需要的
	$scope.prompt = "";
	$scope.imsi = "";
	$scope.xoption = ""
	var tradeFee = "";


	$scope.boxDisplay = [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay = [false, true];	// 读卡 写卡 按钮控制
	$scope.btnActive =  [false, false];	// 按钮选中控制
	$scope.ReSubmitDiv = true;			// 重新提交


	// 写卡步骤初始
	$scope.domEaplan = "准备开卡";
	$scope.domLine = "1";

	$scope.reSubmit = function(){
		if($scope.domLine == "1"){
		}
		else if($scope.domLine == "10"){
			$scope.BSSUser()
		}
		else if($scope.domLine == "20"){
			$scope.createorder()
		}
		else if($scope.domLine == "45"){
			$scope.setTradeId()
		}
		else if($scope.domLine == "50"){
			$scope.bssPdf()
		}
		else if($scope.domLine == "55") {
			$scope.upPdf()
		}
		else if($scope.domLine == "60"){
			$scope.submitsim()
		}
		else if($scope.domLine == "70"){
			$scope.writesim()
		}
		else if($scope.domLine == "80"){
			$scope.finishOrder()
		}
		else if($scope.domLine == "90"){
			$scope.addShop()
		}
		else if($scope.domLine == "95"){
			$scope.updateShop()
		}
		$scope.boxDisplay = [true, false];
		$scope.ReSubmitDiv = true;
		$scope.message = false;
	}



	BusinessSubmission = false;
	$scope.write=function(){
		$scope.boxDisplay = [true, false];
		if(userBo.userName == "test"){
			$scope.addShop();
		}else{
			if(!BusinessSubmission){
				BusinessSubmission = true;
				if($scope.domLine == "60"){
					$scope.submitsim()
				}else{
					$scope.BSSUser();
				}
			}
		}
	}



	$scope.BSSUser = function() {
		$scope.domEaplan = "登录BSS";
		$scope.domLine = "10";
		$scope.UnicommUserInfo = bssInfo;
		$scope.login();
		// unicomm_server.getUnicomm({"cmd":"logout"}).then(function(){
		// 	if(wx_order.category == "000002"){
		// 		$http({
		// 			  "method": "POST"
		// 			, "url": ajaxurl + "/wechatShopApp/getBssAndCbssInfoByUserId"
		// 			, "data":{"userId":wx_order.userId}
		// 			, "params":{"token":$rootScope.token}
		// 		}).success(function(data){
		// 			$scope.UnicommUserInfo = {
		// 				  "username":data.wechatShopBssInfo.userName
		// 				, "password":data.wechatShopBssInfo.password
		// 				// 发展人
		// 				, "developCode":data.wechatShopBssInfo.developCode
		// 				, "developName":data.wechatShopBssInfo.developName == null ? "" : data.wechatShopBssInfo.developName
		// 				// 渠道
		// 				, "channelCode": data.wechatShopBssInfo.developChannel
		// 				, "channelName":data.wechatShopBssInfo.channelName == null ? "" : data.wechatShopBssInfo.channelName
							
		// 			}
		// 			$scope.login();
		// 		}).error(function() {
		// 			$scope.interrupt({
		// 				  "popup":true
		// 				, "text":"获取抢单工号，系统错误!"
		// 				, "saveName":"BSS开卡-获取抢单工号!(系统)"
		// 			});
		// 		});
		// 	}else{
		// 		$scope.UnicommUserInfo = bssInfo;
		// 		$scope.login();
		// 	}
		// }, function(data){
		// 	$scope.interrupt({
		// 		  "saveName":"BSS开卡-退出登录!(系统)"
		// 		, "saveText":data
		// 	});
		// })
	}


	$scope.login = function(){
		unicomm_server.bssLogin($scope.UnicommUserInfo).then(function(){
			if(userBo.userName == "18866668888"){
				my.alert("您使用的是测试工号，下一步操作将产生消费，将跳过开卡步骤").then(function(){
					$scope.addShop();
				})
			}else{
				$scope.bssConfirm();
			}
		},function(data){
			$scope.interrupt({
				  "saveName":"BSS开卡-登录失败!(系统)"
				, "saveText":data
			});
		});
	}


	$scope.bssConfirm = function(index){
		$scope.domLine = "15";
		unicomm_server.getUnicomm({
			  "cmd":"bss_number_insert_pre_select"
			, "number":telInfo['tel']
			, "payfee":telInfo["preCharge"]
		}).then(function(return_json){
			if(return_json.status == "1"){
				// 号码预占后和订单确认号码
				$http({
					url : ajaxurl+ "orderApp/updateNumberByOrderNo",
					method : "GET",
					params:{
						  "token":$rootScope.token
						, "orderNo":authentication["orderNo"]
						, "number":telInfo["tel"]
					}
				})

				$scope.createorder();
			}else{
				$scope.interrupt({
					  "popup":true
					, "text":return_json.data
					, "saveName":"BSS开卡-号码预占"
				});
			}
		}, function(data){
			$scope.interrupt({
				  "saveName":"BSS开卡-号码预占(系统)"
				, "saveText":data
			});
		})
	}


	$scope.createorder = function(){

		$scope.domEaplan = "生成订单";
		$scope.domLine = "20";

		tradeFee = Number($scope.simInput.preFee);
		var unicomm_command = new Object();
			unicomm_command.payMoney = String(tradeFee);
			unicomm_command.productCode = dianpu_bss_package_array["bssPackageSelect"]["productId"];
			unicomm_command.imageBase64 = authentication['customerImagebase64'];
			unicomm_command.contactNumber = authentication['contractNumber'];
			unicomm_command.ifOcs = (dianpu_bss_package_array["bssPackageSelect"]["productName"].indexOf("OCS") == "-1" ? "0" : "1");
			unicomm_command.uploadResponse = bss_faceCheckAndUploadPhoto_uploadResponse;
		if(unicomm_type == "telSelectNewBSS"){
			unicomm_command.cmd = "bss_product_new_submitOrder";
			unicomm_command.cardBase64 = authentication["idHeadImg"].substring(23);
			unicomm_command.lanaccount = telInfo['tel'];
			unicomm_command.customerName = authentication['name'];
			unicomm_command.psptid = authentication['cardId'];
			unicomm_command.addressinfo = authentication['address'];
			unicomm_command.startdate = authentication['start_date'];
			unicomm_command.enddate = authentication['end_date'];
			unicomm_command.gender = authentication['gender'];
			unicomm_command.nation = authentication['nation'];
			unicomm_command.birthday = authentication['birthday'];
			unicomm_command.police = authentication['police'];
			unicomm_command.contactName = authentication['name'];
			unicomm_command.dealerName = $scope.UnicommUserInfo["channelName"];
			unicomm_command.dealerCode = $scope.UnicommUserInfo["channelCode"] ? $scope.UnicommUserInfo["channelCode"] : cbssInfo.channelCode;
			unicomm_command.dealerUserCode = $scope.UnicommUserInfo["developCode"];
			unicomm_command.busPropertyList = bss_huinongka;
			unicomm_command.simtype = String($scope.input.simtype.id);
			unicomm_command.simid = $scope.simInput.simcard;
		}else{
			unicomm_command.cmd = "bss_createorder";
			unicomm_command.number = telInfo['tel'];
			unicomm_command.name = authentication['name'];
			unicomm_command.cardno = authentication['cardId'];
			unicomm_command.address = authentication['address'];
			unicomm_command.productDesc = dianpu_bss_package_array["bssPackageSelect"]['productName'];
			unicomm_command.developCode = $scope.UnicommUserInfo["developCode"];
			unicomm_command.dealer = $scope.UnicommUserInfo["channelCode"] ? $scope.UnicommUserInfo["channelCode"] : cbssInfo.channelCode;
			unicomm_command.customerGroupId = $scope.input.proType.customerGroupId;
			unicomm_command.preserver13  = $scope.input.proType.preserver13;
		}
		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if(!$scope.prompt){
					if (return_json.status == '1') {
						$scope.prompt = return_json.data.tradeId;
						$scope.setTradeId();
					}else{
						$scope.bss_order_queryOrderInfo({"text":return_json.data,"name":unicomm_command.cmd})
					}
				}
			}, function(data){
				$scope.interrupt({
					  "saveName":"BSS开卡-订单生成-"+unicomm_command.cmd + "(系统)"
					, "saveText":data
				});
			}
		)
	}


	$scope.bss_order_queryOrderInfo = function(){
		var msg = arguments[0];
		unicomm_server.getUnicomm({"cmd":"bss_order_queryOrderInfo","serialNumber":telInfo['tel'],"tradeflag":"2"}).then(
			function(return_json){
				if(!$scope.prompt){
					if (return_json.status == '1' &&
						return_json.data.acceptPerson == $scope.UnicommUserInfo.username &&
						return_json.data.remark == "现场写卡"
						){
						$scope.prompt = return_json.data.registerNumber;
						$scope.setTradeId();
					}else{
						$scope.interrupt({
							  "popup":true
							, "text":"生成订单失败，原因："+msg["text"]
							, "saveName":"BSS开卡-订单生成-"+msg["name"]
						});
					}
				}
			}, function(data){
				$scope.interrupt({
					  "saveName":"BSS开卡-订单生成-bss_order_queryOrderInfo(系统)"
					, "saveText":data
				});
			}
		)
	}


	$scope.setTradeId = function(){
		$scope.domEaplan = "保存交易编码";
		$scope.domLine = "45";
		// 释放预存号码
		store.remove("occupyNumber", telInfo['tel']);
		$http({
			  "method":'GET'
			, "url":ajaxurl + 'orderApp/setTradeId'
			, "params":{
					  "token": $rootScope.token
					, "orderNo":authentication["orderNo"]
					, "tradeId":$scope.prompt
				}
		}).success(function(){
			$scope.bssPdf();
		}).error(function(){
			$scope.bssPdf();
		});
	}


	$scope.bssPdf = function(){

		// 如果是微信订单 回写
		if(wx_order.orderCode){
			$http({
				url : ajaxurl+ "wechatShopApp/updateWechatShopPreorderStatus",
				method : "GET",
				params:{
					  "token":$rootScope.token
					, "orderCode":wx_order.orderCode
					, "number":telInfo["tel"]
					, "category":wx_order.category
					, "orderType":wx_order.orderType
					, "orderStatus":(wx_order.orderType == "000001" ? "000002" : "000004")
				}
			})
			wx_order = {};
		}
		if(yy_order.orderCode){
			$http({
				url : ajaxurl+ "remoteMarketOrderApp/updateWechatNumPreorderByNumber",
				method : "GET",
				params:{
					  "token":$rootScope.token
					, "orderCode":yy_order.orderCode
				}
			})
			yy_order = {}
		}

		$scope.domEaplan = "生成电子工单";
		$scope.domLine = "50";

		$http({
			  method:'get'
			, url:ajaxurl + 'numbercontract/queryContractInfo'
			, params:{"token":$rootScope.token,"contractId":dianpu_bss_package_array["bssPackageSelect"]["productId"]}
		}).success(function (data){
			var tc = data.productInfo && data.productInfo.productExplain ? data.productInfo.productExplain.split("|||||") : [];
			if(tc.length < 2){tc = ["", ""];}	// 套餐没详情
			var desc  = '【套餐名称】：<u>'+data.productInfo.productName+'</u><br>';
				desc += '【套餐首月生效方式】：<u>立即生效</u><br>'
				desc += '【套餐信息】：<u>'+tc[0]+'</u><br>';
				desc += '【产品信息】：'+replaceAll(tc[1], '{kk}', $filter('date')(new Date(), 'yyyy-MM-dd'))+'<br>';
				desc += '【备注】：<u>月套餐国内（不含台港澳）流量当月不清零，剩余流量自动结转至下月，有效期至下月月底。套餐内其他业务量以及定向流量叠加包、后向流量产品、赠送流量等仅限当月使用，不能延续至下月使用。</u><br>';
			bssPdf = {
				  "cmd":"bss_number_generateNumberBillPaper"
				, "number":telInfo['tel']
				, "tradeId":$scope.prompt
				, "productName":""
				, "productDesc":""
				, "packageDetail":desc
				, "channelName":$scope.UnicommUserInfo["channelName"]
				, "developName":$scope.UnicommUserInfo["developName"]
				, "developCode":$scope.UnicommUserInfo["developCode"]
				, "areaCode":(userBo.disId == "7100000" ? "029" : "")
				, "personInfo":{
					 "custName":authentication['name']
					, "gender":authentication['gender']
					, "birthday":authentication['birthday']
					, "address":authentication['address']
					, "startDate":authentication['start_date']
					, "endDate":authentication['end_date']
					, "nation":authentication['nation']
					, "psptId":authentication['cardId']
					, "contractName":authentication['name']
					, "contractNumber":authentication['contractNumber']
					, "police":authentication['police']
					, "idCardImageUrl":authentication["idHeadImgUrl"]
					, "signPicUrl":authentication["sign"]
					, "handCardUrl":authentication["customerImageUrl"]
				}
			};

			unicomm_server.getUnicomm(bssPdf).then(function(result_json){
				if(result_json.status == "1"){
					$scope.upPdf(result_json.data)
				}else{
					$scope.saveFailed("BSS开卡-bss工单生成", bssPdf);
					$scope.submitsim();
				}
			}, function(){
				$scope.saveFailed("BSS开卡-bss工单生成(系统)", bssPdf);
				$scope.submitsim();
			})
		}).error(function() {
			$scope.submitsim();
		});
	}




	$scope.upPdf = function(){
		$scope.domEaplan = "电子工单保存";
		$scope.domLine = "55";
		$http({
			  "method":'POST'
			, "url":ajaxurl + 'orderApp/updateEleWork'
			, "params":{"token": $rootScope.token}
			, "data":{
				  "orderNo":authentication["orderNo"]
				, "eleWork":arguments[0]
				, "type":"000001"
			}
		}).success(function(){
			$scope.submitsim();
		}).error(function(){
			$scope.submitsim();
		});
	}



	$scope.submitsim = function(){

		$scope.domEaplan = "订单绑定SIM卡";
		$scope.domLine = "60";

		if(String($scope.input.simtype.id) === "1"){
			$scope.finishOrder();
			return ;
		}

		var unicomm_command = new Object();
		unicomm_command.cmd = "bss_writesim";
		unicomm_command.iccid = swap2str($scope.simInput.simcard);
		unicomm_command.number = telInfo['tel'];
		unicomm_command.promptid = $scope.prompt;
		unicomm_command.simtype= String($scope.input.simtype.id);	// 卡的种类 0=白卡;1=半成卡

		if(unicomm_type == "telSelectNewBSS"){
			unicomm_command.cmd = "bss_writesim_for_product_new"
		}

		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.imsi = return_json.data.imsi;
					$scope.xoption = return_json.data.xoption;
					$scope.writesim();
				}else{
					$scope.saveFailed("BSS开卡-订单绑定SIM卡", return_json.data);
					my.alert(return_json.data).then(function(){
						$scope.boxDisplay = [false, true];
						$scope.simInputSelect();
					});
				}
			},function(data){
				$scope.interrupt({
					"saveName":"BSS开卡-订单绑定SIM卡(系统)"
				  , "saveText":data
				});
			}
		)
	}



	$scope.writesim = function(){
		$scope.domEaplan = "SIM卡写入信息";
		$scope.domLine = "70";
		ble.BLEwriteSim($scope.imsi, xoption2str($scope.xoption)).then(function(){
			$http({
					"method":'GET'
				, "url":ajaxurl + 'orderApp/updateWriteSimStatus'
				, "params":{
						 "token": $rootScope.token
						, "orderNo":authentication["orderNo"]
					}
			}).success(function(){
				$scope.finishOrder();
			}).error(function(){
				$scope.finishOrder();
			});
		}, function(data){
			$scope.interrupt({
					"popup":true
				, "text":data
				, "saveName":"BSS开卡-写入SIM卡"
			});
		})
	}



	$scope.finishOrder = function() {

		$scope.domEaplan = "订单缴费";
		$scope.domLine = "80";

		var unicomm_command = new Object();
		if(unicomm_type == "telSelectNewBSS"){
			unicomm_command.cmd = "bss_payfee";
			unicomm_command.lanaccount = $scope.prompt;
		}else{
			unicomm_command.cmd = "bss_finishorder";
			unicomm_command.promptid = $scope.prompt;
		}
		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if (return_json.status == '1' || return_json.data.indexOf("受理已清费") >= 0){
					$http({
						  "method":'GET'
						, "url":ajaxurl + 'orderApp/hasPaidStatusToSuccess'
						, "params":{
								  "token": $rootScope.token
								, "orderNo":authentication["orderNo"]
							}
					}).success(function(){
						$scope.addShop();;
					}).error(function(){
						$scope.addShop();;
					});
				}else{
					$scope.interrupt({
						  "popup":true
						, "text":return_json.data
						, "saveName":"BSS开卡-"+unicomm_command.cmd
					});
				}
			},function(data){
				$scope.interrupt({
					  "saveName":"BSS开卡-"+unicomm_command.cmd+"(系统)"
					, "saveText":data
				});
			}
		)
	}


	$scope.addShop = function(){

		$scope.domEaplan = "提交订单";
		$scope.domLine = "90";
		$http({
			  "url" : ajaxurl+ "orderApp/savedirecttrade"
			, "method" : "GET"
			, "params" : {
				  "token": $rootScope.token
				, "orderNo": authentication['orderNo']
				, "imsi": $scope.imsi
				, "xoption": $scope.xoption
				, "ccid": $scope.simInput.simcard
				, "tradeFee": tradeFee
				, "preCharge": tradeFee
				, "tradeId": $scope.prompt
				, "number": telInfo['tel']
				, "name":authentication['name']
				, "cardid": authentication["cardId"]
				, "selectedElement": dianpu_bss_package_array["bssPackageSelect"]["productId"]
				, "type": order_type2id[order_type]
			}
		}).success(function(){
			$scope.orderToSuccess();
		}).error(function(){
			$scope.interrupt({
				  "popup":true
				, "text":"更新订单失败!"
				, "saveName":"BSS开卡-更新订单失败!"
				, "saveText":authentication['orderNo']
			});
		});
	}


	$scope.orderToSuccess = function(){

		$scope.domEaplan = "提交订单";
		$scope.domLine = "90";

		var param  = "&orderNo="+authentication['orderNo'];
		$http({
			url : ajaxurl+ "orderApp/numberOrderToSuccess?token=" + $rootScope.token + "&" + param,
			method : "GET"
		}).success(function(){
			$scope.updateShop();
		}).error(function(){
			$scope.updateShop();
		});
	}





	$scope.updateShop = function(){
		$scope.domEaplan = "订单确认";
		$scope.domLine = "95";
		order_amount = tradeFee;
		if($rootScope.isShowsetTab === false || userBo.testTag == "000001"){
			$http({
				method : "POST",
				url : ajaxurl + "orderApp/orderCheckOut?token=" + $rootScope.token,
				data : {"orderNo":authentication["orderNo"],"preCharge":tradeFee}
			}).success(function(){
				my.alert("订单成功，可提供用户使用！").then(function(){
					$state.go("ok");
				});
			}).error( function(){
				$scope.interrupt({
					  "popup":true
					, "text":"更新订单状态失败"
					, "saveName":"BSS开卡-更新订单状态失败"
					, "saveText":"更新订单状态失败("+tradeFee+"元)"
				});
			})
		}else{
			my.alert("当前店铺未走账，不会产生任何交易流水，当前号码若为测试号码，请及时返销，若是用户正常开户，可忽略此信息。").then(function(){
				$state.go("ok");
			})
		}
	}


	//
	//
	//
	// 读卡
	//
	//
	//

	$scope.read = function(){
		if(BLEcurrDevice){
			$scope.readImsi();
		}else{
			ble.BLEconnectServer().then(function(){
				ble.BLEfind().then(function(data){
					var buttons = []
					for(var i in data){
						buttons.push({"text":data[i]['name']});
					}
					$ionicActionSheet.show({
						"buttons": buttons,
						"destructiveText": '取消',
						"titleText": '选择蓝牙',
						buttonClicked: function(index) {
							BLEcurrDevice = data[index];
							$scope.readImsi();
							return true;
						}
					});
				}, function(){
					my.alert('没有找到蓝牙读卡器!');
				})

			}, function(){
				my.alert('蓝牙解码服务器不可以,请将手机连接到网络上!');
			})
		}
	}


	$scope.readImsi = function(){
		ble.BLEreadSim().then(function(data){
			$scope.simInput.simcard = data;
			if($scope.simInput.simcard.length >= 19){
				$scope.submitShow()
			}else{
				my.alert("读取卡号不完整,请将SIM卡插紧。重新读取一次。");
			}
		},
		function(data){
			my.alert(data);
		});
	}


	$scope.scan = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.simInput.simcard = barcodeData.text;
					$scope.submitShow();
				}else{
					my.alert("读取卡号不完整,请重新扫描一次。")
				}
			});
	};

	$scope.simcardInput = function(){
		if($scope.simInput.simcard.length >= 19){
			$scope.submitShow()
		}else{
			$scope.simInputSelect();
		}
	}
	

	$scope.simInputSelect = function(){
		$scope.btnDisplay = [false, true];
	}
	$scope.submitShow = function(){
		$scope.btnDisplay = [true, false];
	}


	// 重新提交显示
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		if($scope.domLine == "15"){
			my.alert("号码已被使用，请重新选择号码！", "提示", "重选号码").then(function(){
				store.remove("occupyNumber", telInfo['tel']);
				reelectNumber = 1;
				$state.go('number-list')
			});
		}else{
			if(msg["popup"]){
				my.alert(alertInfo(msg["text"])).then(function(){
					$scope.ReSubmitDiv = false;
				});
			}else{
				$scope.ReSubmitDiv = false;
			}
		}


		if($scope.domLine >= 45){
			$scope.message = true;
		}
	}


	$scope.saveFailed = function(){
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/saveFailedInfo?token=" + $rootScope.token,
			data : {"orderCode":authentication["orderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}



	

	// 如果是异步订单直接提交
	if(yy_order.orderCode && yy_order.simNumber){
		$scope.simInput.simcard = yy_order.simNumber;
		$scope.write();
	}

	if(service_type == "bssSemiManufactures"){
		$scope.simInput.simcard = order_info["simInput"];
		$scope.write();
	}
})
