appControllers.controller('jike-group-write-sim', function($scope, $state, my) {

	$scope.title = "提交确认";

	// 减免 临时小补丁
	$scope.reduceMoneyShow = Number(cateInfo["reduceMoney"]) === 0 ? true : false;			// 减免金额输入框显示状态

	$scope.simInput = {
		  "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "preNumberCharge":telInfo["costPrice"]
		, "preFee":telInfo["preCharge"]
		, "reduceMoney":String(Number(cateInfo["reduceMoney"]))
	}

	$scope.order = function(){
		if($scope.simInput.preFee === ""){
			my.alert("请输入预存金额!");
		}else{
			if(telInfo.goodType && $scope.simInput.preFee<telInfo["preCharge"]){
				my.alert("号码<"+telInfo["tel"]+">是靓号,预存不能低于:"+telInfo["preCharge"]+"元。");
			}else{
				submitFee = $scope.simInput.preFee;
				if(authentication["sign"]){
					$state.go("jike-group-write-sim-submit");
				}else{
					$state.go("signature");
				}
			}
		}
	}
})


.controller('jike-group-write-sim-submit', function($scope, $rootScope, $http, $state, $ionicPopup, $cordovaBLE, $ionicActionSheet,  $cordovaBarcodeScanner, unicomm_server, ble, my) {

	$scope.title = telInfo["tel"];
	$scope.btnText = {"read":"读卡","write":"提交订单"}	// 读写卡按钮文字
	$scope.boxDisplay = [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay = [false, true];	// 读卡 写卡 按钮控制
	$scope.btnActive =  [false, false];	// 按钮选中控制

	$scope.isContainsFee = false;	// SIM卡信息同步 这个步骤使用
	$scope.ReSubmitDiv = true;		// 重复提交按钮
	$scope.amount = 0;				// 联通返回的订单金额


	
	// 读卡|扫描
	if(service_type == "groupCbssSemiManufactures" || service_type == "groupSfCbssSemiManufactures"){
		$scope.btnText = {"read":"扫描","write":"提交订单"}
		$scope.readBtn = [true,false]
	}else{
		$scope.readBtn = [false,true]
	}


	// 写卡步骤初始
	$scope.domEaplan = "准备开卡";
	$scope.domLine = "1";


	// 拼接套餐信息部分
	$scope.sub_productObj = sub_productObj;
	$scope.sub_productList = jike_cbss_package_arr["result"]["sub_productList"].concat(
						jike_cbss_package_arr["service"]["sub_productList"],
						jike_cbss_package_arr["activity"]["sub_productList"]
						);
	$scope.sub_elementList = jike_cbss_package_arr["result"]["sub_elementList"].concat(
						jike_cbss_package_arr["service"]["sub_elementList"],
						jike_cbss_package_arr["activity"]["sub_elementList"]
					);
	$scope.selecteElementCode = jike_cbss_package_arr["result"]["selecteElementCode"]+
						 jike_cbss_package_arr["service"]["selecteElementCode"]+
						 jike_cbss_package_arr["activity"]["selecteElementCode"];


	// 一个和联通的中转参数
	var createtrade_result = {};
	// getbaseandtradeid 返回信息
	var sub_basetradeidObj = {};
	// 图片上传成功后返回的信息
	var brNumber = null;
	// 号码验证(validatetonumber)成功后 返回的信息
	var sub_numberObj = {};
	//var numberJson = null;	// sub_numberObj(原始信息)
	// 用户信息 & custId(用户确认时填加)
	var sub_personObj = {}
	sub_personObj["custName"] = authentication['name'];
	sub_personObj["psptId"] = authentication['cardId'];



	$scope.simInput = {
		 "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "simcard":""
		, "preNumberCharge":telInfo["costPrice"]
		, "preFee":String(Number(submitFee))
		, "reduceMoney":String(Number(cateInfo["reduceMoney"]))
	}


	$scope.write=function(){
		if($scope.btnActive[1]){
		}
		else{
			if($scope.domLine == "70"){
				$scope.boxDisplay = [true, false];
				$scope.getsiminfo();
			}else if($scope.domLine == "45"){
				$scope.boxDisplay = [true, false];
				$scope.cbss_number_checkSimCardNoNew();
			}
			else{
				$scope.btnActive[1] =  true; // 选中状态开启
				unicomm_server.cbssLogin().then(function(){
					$scope.boxDisplay = [true, false];
					$scope.CBSSUser()
				},function(){
					$scope.btnActive[1] =  false;
				});
			}
		}
	}


	$scope.reSubmit = function(){
		$scope.ReSubmitDiv = true;
		$scope.message = false;
		if($scope.domLine == "10"){
			$scope.CBSSUser();
		}
		else if($scope.domLine == "20"){
			$scope.validNumber();
		}
		else if($scope.domLine == "30"){
			$scope.uploadImage();
		}
		else if($scope.domLine == "40"){
			$scope.getbaseandtradeid();
		}
		else if($scope.domLine == "50"){
			$scope.createmodtrade();
		}
		else if($scope.domLine == "60"){
			$scope.firstfinishorder();
		}
		else if($scope.domLine == "70"){
			$scope.getsiminfo();
		}
		else if($scope.domLine == "75"){
			$scope.writesim();
		}
		else if($scope.domLine == "80"){
			$scope.submitorder();
		}
		else if($scope.domLine == "85"){
			$scope.continueTradeReg();
		}
		else if($scope.domLine == "90"){
			$scope.writeOrder();
		}
		else if($scope.domLine == "95"){
			$scope.updateShop();
		}
	}
	$scope.interrupt = function(){
		if(arguments[0]){
			my.alert(arguments[0]).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}

		if($scope.domLine >= 85){
			$scope.message = true;
		}
	}



	$scope.CBSSUser = function() {
		$scope.domEaplan = "登录成功";
		$scope.domLine = "10";

		var unicomm_command = {
			  "cmd":"iscustomexists"
			, "pspt_id":authentication['cardId']		// 真实身份证号码
			, "cust_name":authentication['name']
		}
		unicomm_server.getUnicomm(unicomm_command)
		.then(
			function(data){
				if (data.status == "1") {
					sub_personObj["custId"] = data.data.custId;
					$scope.validNumber();
				} else {
					unicomm_server.getUnicomm({
						  "cmd":"createcustomer"
						, "cust_name":authentication["name"]
						, "pspt_id":authentication["cardId"]
						, "end_date":authentication["end_date"]
						, "contact_name":authentication["name"]
						, "contact_phone":authentication["contractNumber"]
						, "addressinfo":authentication["address"]
						, "birthday":authentication["birthday"]
						, "nation":authentication["nation"]
						, "sex":(authentication["gender"].indexOf("男") !== -1 ? "M" : "F")
					})
					.then(
						function(result_json){
							if(result_json.status == "1"){
								sub_personObj["custId"] = result_json.data.custId;
								$scope.validNumber();
							}else{
								$scope.interrupt("联通开户失败，失败原因："+result_json.data.message+"，请检查");
							}
						}
						, function(){
							$scope.interrupt();
						})
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}








	$scope.validNumber = function(){
		$scope.domEaplan = "用户建立成功!";
		$scope.domLine = "20";

		var unicomm_command = {
			  "cmd":"validatetonumber"
			, "tonumber":telInfo["tel"]
		}
		unicomm_server.getUnicomm(unicomm_command)
		.then(
			function(result_json){
				if (result_json.status == "1") {
					//numberJson = result_json;
					sub_numberObj["serialNumber"] = result_json.data.serialNumber;
					sub_numberObj["numberSrc"] = result_json.data.numberSrc;
					sub_numberObj["numberType"] = result_json.data.numberType;
					sub_numberObj["numThawPro"] = result_json.data.numThawPro;

					sub_numberObj["netTypeCode"] = result_json.data.netTypeCode;
					sub_numberObj["classId"] = result_json.data.classId;
					sub_numberObj["lowCostItemId"]= result_json.data.lowCostItemId;
					
					sub_numberObj["leaseLength"]= result_json.data.leaseLength;
					$scope.uploadImage()
				} else {
					$scope.interrupt(result_json.data.message);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}


	$scope.uploadImage = function(){
		$scope.domEaplan = "号码验证成功";
		$scope.domLine = "30";

		var unicomm_command = {
			  "cmd":"uploadPhotoForGroup"
			, "imagepath":authentication["customerImageUrl"]
		}
		unicomm_server.getUnicomm(unicomm_command)
		.then(
			function(result_json){
				if (result_json.status == "1") {
					brNumber = result_json.data;
					$scope.getbaseandtradeid();
				} else {
					$scope.interrupt("上传照片错误，错误信息为："+result_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}




	$scope.getbaseandtradeid = function(){
		$scope.domEaplan = "图片上传成功!";
		$scope.domLine = "40";

		unicomm_server.getUnicomm({
			  "cmd":"cbss_order_getbaseandtradeid4Group"
			//, "number":numberJson
		}).then(function(return_json){
			if (return_json.status == "1") {
				sub_basetradeidObj["base"] = return_json.data.base;
				sub_basetradeidObj["tradeid"] = return_json.data.tradeid;
				// 半成卡跳转
				if(service_type == "groupCbssSemiManufactures" || service_type == "groupSfCbssSemiManufactures"){
					$scope.cbss_number_checkSimCardNoNew();
				}else{
					$scope.createmodtrade();
				}
			} else {
				$scope.interrupt(return_json.data);
			}
		});
	};



	// 半成卡 需要调用的
	var SimCardNoNew_data = {};
	$scope.cbss_number_checkSimCardNoNew = function(){

		$scope.domEaplan = "获取SIM卡信息!";
		$scope.domLine = "45";

		unicomm_server.getUnicomm({
			  "cmd":"cbss_number_checkSimCardNoNew"
			, "number":$scope.simInput.number
			, "iccid": $scope.simInput.simcard
		})
		.then(function(return_json){
			if (return_json.status == "1") {
				SimCardNoNew_data = return_json.data;
				$scope.createmodtrade();
			} else {
				my.alert(return_json.data).then(function(){
					$scope.simInput.simcard = "";
					$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
					$scope.boxDisplay = [false, true];	// 读卡div 显示
					$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
					$scope.btnActive =  [false, false];	// 按钮选中状态
				});
			}
		});
	};




	// 订单返回信息
	$scope.tradeMainList = {};
	$scope.continueFeeList = {};
	$scope.feePayMoneyList = {};
	$scope.TRADE_ID_MORE_STR = "";
	$scope.SERIAL_NUMBER_STR = "";
	$scope.TRADE_TYPE_CODE_STR = "";
	$scope.NET_TYPE_CODE_STR = "";
	$scope.totalMoneyFee = 0;
	$scope.create_result = {};


	$scope.createmodtrade = function() {
		$scope.domEaplan = "创建并提交订单";
		$scope.domLine = "50";

		var unicomm_command = {
			  "cmd":"createmodtrade"
			, "person":sub_personObj
			, "number":sub_numberObj
			, "product":$scope.sub_productObj
			, "productList":$scope.sub_productList
			, "elementList":$scope.sub_elementList
			, "tradeuser":{"developStaffId":cbssInfo["developCode"],"channelCode":cbssInfo["channelCode"]}
			, "basetradeid":sub_basetradeidObj
			, "brNumber":brNumber
			, "group":{"productUserId":group["productUserId"],"productId":group["groupProductId"]}
			, "simcardinfo":{}
			, "tradeType":"0"	// 0:白卡 2:对公
			, "custPersonInfo":{ 			// 对公 开卡信息
				  "psptId":authentication["cardId"]
				, "custName":authentication["name"]
				, "address":authentication["address"]
			}
		}

		// 半成卡 & 白卡
		if(service_type == "groupCbssSemiManufactures" || service_type == "groupSfCbssSemiManufactures"){
			unicomm_command.isCompleteCard = true;
			unicomm_command.simcardinfo = SimCardNoNew_data;
		}else{
			unicomm_command.isCompleteCard = false;
		}

		// 对公
		if(service_type == "groupCbssEnterprise"){
			unicomm_command.tradeType = "2";
			unicomm_command.person = jike_group_person;
		}

		unicomm_server.getUnicomm(unicomm_command)
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.tradeMainList = result_json.data.tradeMainList;
					$scope.continueFeeList = result_json.data.continueFeeList;
					$scope.feePayMoneyList = result_json.data.feePayMoneyList;
					$scope.TRADE_ID_MORE_STR = result_json.data.TRADE_ID_MORE_STR;
					$scope.SERIAL_NUMBER_STR = result_json.data.SERIAL_NUMBER_STR;
					$scope.TRADE_TYPE_CODE_STR = result_json.data.TRADE_TYPE_CODE_STR;
					$scope.NET_TYPE_CODE_STR = result_json.data.NET_TYPE_CODE_STR;
					$scope.totalMoneyFee = result_json.data.totalMoneyFee;
					$scope.create_result = result_json.data.create_result;
					
					createtrade_result = result_json.data.createtrade_result;
					$scope.firstfinishorder();
				} else {
					$scope.interrupt(result_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}







	$scope.firstfinishorder = function() {
		$scope.domEaplan = "创建并提交订单";
		$scope.domLine = "60";

		unicomm_server.getUnicomm({
			  "cmd":"submitorder"
			, "totalMoneyFee":$scope.totalMoneyFee
			, "tradeMainList":$scope.tradeMainList
			, "feePayMoneyList":$scope.feePayMoneyList
			, "continueFeeList":$scope.continueFeeList
			, "TRADE_ID_MORE_STR":$scope.TRADE_ID_MORE_STR
			, "SERIAL_NUMBER_STR":$scope.SERIAL_NUMBER_STR
			, "TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR
			, "NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR
			, "create_result":$scope.create_result
			, "createtrade_result":createtrade_result
		})
		.then(
			function(result_json){
				if(result_json.status == "1"){
					// 半成卡 & 白卡
					if(service_type == "groupCbssSemiManufactures" || service_type == "groupSfCbssSemiManufactures"){
						$scope.writeOrder();
					}else{
						$scope.getsiminfo();
					}
				}else{
					$scope.interrupt(result_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}



	var xoption = "";
	var imsi = "";
	var procid = null;
	var capacityTypeCode = null;
	var cardData = null;

	$scope.getsiminfo = function(){

		$scope.domEaplan = "获取SIM卡信息";
		$scope.domLine = "70";

		unicomm_server.getUnicomm({
			"cmd":"cbss_number_getwritesiminfo",
			"ccid":$scope.simInput.simcard,
			"productId":$scope.sub_productObj.productId,
			"branchCode":$scope.sub_productObj.brandCode,
			"tradeId":sub_basetradeidObj["tradeid"],
			"serialNumber":sub_numberObj["serialNumber"],
			"tradeTypeCode":$scope.TRADE_TYPE_CODE_STR.substring(0,$scope.TRADE_TYPE_CODE_STR.length-1),
			"netTypeCode":$scope.NET_TYPE_CODE_STR.substring(0,$scope.NET_TYPE_CODE_STR.length-1),
			"containsFee":$scope.isContainsFee	
		})
		.then(
			function(result_json){
				if (result_json.status == "1" && result_json.data.xoption && result_json.data.xoption) {
					xoption = result_json.data.xoption;
					imsi = result_json.data.imsi;
					procid = result_json.data.procid;
					capacityTypeCode = result_json.data.capacityTypeCode;
					cardData = result_json.data.cardData;
					$scope.writesim();
				} else {
					$ionicPopup.alert({title: '提示',template:result_json.data}).then(function(){
						$scope.simInput.simcard = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];	// 读卡div 显示
						$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
						$scope.btnActive =  [false, false];	// 按钮选中状态
					});
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}


	$scope.writesim = function() {
		$scope.domEaplan = "写入SIM卡";
		$scope.domLine = "75";

		ble.BLEwriteSim(imsi, xoption2str(xoption)).then(function() {
			$http({
				  "method":'GET'
				, "url":ajaxurl + 'orderApp/updateWriteSimStatus'
				, "params":{
						  "token": $rootScope.token
						, "orderNo":authentication["orderNo"]
					}
			}).success(function(){
				$scope.submitorder();
			}).error(function(){
				$scope.submitorder();
			});
		},
		function(data){
			$scope.interrupt(data);
		})
	}


	$scope.submitorder = function() {
		$scope.domEaplan = "SIM卡信息同步";
		$scope.domLine = "80";
		unicomm_server.getUnicomm({
			  "cmd":"writesimok"
			, "ccid":$scope.simInput.simcard		// sim卡
			, "productId":$scope.sub_productObj.productId
			, "branchCode":$scope.sub_productObj.brandCode
			, "tradeId":sub_basetradeidObj["tradeid"]
			, "serialNumber":sub_numberObj["serialNumber"]
			, "tradeTypeCode":$scope.TRADE_TYPE_CODE_STR.substring(0,$scope.TRADE_TYPE_CODE_STR.length-1)
			, "netTypeCode":$scope.NET_TYPE_CODE_STR.substring(0,$scope.NET_TYPE_CODE_STR.length-1)
			, "imsi":imsi
			, "xoption":xoption
			, "procid":procid
			, "capacityTypeCode":capacityTypeCode
			, "cardData":cardData
		}).then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.tradeMainList = result_json.data.tradeMainList;
					$scope.continueFeeList = result_json.data.continueFeeList;
					$scope.feePayMoneyList = result_json.data.feePayMoneyList;
					$scope.TRADE_ID_MORE_STR = result_json.data.TRADE_ID_MORE_STR;
					$scope.SERIAL_NUMBER_STR = result_json.data.SERIAL_NUMBER_STR;
					$scope.TRADE_TYPE_CODE_STR = result_json.data.TRADE_TYPE_CODE_STR;
					$scope.NET_TYPE_CODE_STR = result_json.data.NET_TYPE_CODE_STR;
					$scope.totalMoneyFee = result_json.data.totalMoneyFee;
					$scope.create_result = result_json.data.create_result;

					createtrade_result = result_json.data.createtrade_result;
					$scope.continueTradeReg();
				} else {
					$scope.interrupt(result_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}


	$scope.continueTradeReg = function() {
		$scope.domEaplan = "联通订单组装完成";
		$scope.domLine = "85";

		unicomm_server.getUnicomm({
			  "cmd":"continueTradeReg"
			, "totalMoneyFee":$scope.totalMoneyFee
			, "tradeMainList":$scope.tradeMainList
			, "reduceMoney":$scope.simInput.reduceMoney
			, "feePayMoneyList":$scope.feePayMoneyList
			, "continueFeeList":$scope.continueFeeList
			, "TRADE_ID_MORE_STR":$scope.TRADE_ID_MORE_STR
			, "SERIAL_NUMBER_STR":$scope.SERIAL_NUMBER_STR
			, "TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR
			, "NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR
			, "create_result":$scope.create_result
			, "createtrade_result":createtrade_result
			, "money":Number($scope.simInput.preFee)	// 这里传预存
			, "serialNumber":sub_numberObj["serialNumber"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.amount = result_json.data.fee;
					$scope.writeOrder();
				} else {
					$scope.interrupt(result_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		);
	}



	$scope.writeOrder = function(){
		$scope.domEaplan = "订单写入";
		$scope.domLine = "90";

		var param="imsi="+imsi;
			param += "&xoption="+xoption;
			param += "&tradeFee="+$scope.amount;
			param += "&preCharge="+$scope.simInput.preFee;
			param += "&tradeId="+(sub_basetradeidObj["tradeid"] ? sub_basetradeidObj["tradeid"] : "");
			param += "&ccid="+$scope.simInput["simcard"];
			param += "&orderNo="+authentication["orderNo"];
			param += "&number="+telInfo["tel"];
			param += "&name="+ authentication["name"];
			param += "&cardid="+ authentication["cardId"];
			param += "&selectedElement="+$scope.selecteElementCode;
			$http({
				url : ajaxurl+ "orderApp/savedirecttrade?token=" + $rootScope.token + "&" + param,
				type : "get"
			}).success(function(){
				$scope.orderToSuccess();
			}).error(function(){
				$scope.orderToSuccess();
			});
	}


	$scope.orderToSuccess = function(){

		$scope.domEaplan = "订单确认";
		$scope.domLine = "90";

		var param  = "&orderNo="+authentication['orderNo'];
		$http({
			url : ajaxurl+ "orderApp/numberOrderToSuccess?token=" + $rootScope.token + "&" + param,
			method : "GET"
		}).success(function(){
			$scope.cbssPdf();
		}).error(function(){
			$scope.cbssPdf();
		});
	}


	$scope.cbssPdf = function(){
		$scope.domEaplan = "CBSS电子工单生成中";
		$scope.domLine = "95";
		unicomm_server.getUnicomm({
			  "cmd":"cbss_number_generateBillPaper"
			, "personInfo":{
				  "custName":authentication["name"]
				, "psptId":authentication["cardId"]
				, "nation":authentication["nation"]
				, "gender":authentication["gender"]
				, "address":authentication["address"]
				, "police":authentication["police"]
				, "startDate":authentication["start_date"]
				, "endDate":authentication["end_date"]
				, "birthday":authentication["birthday"]
				, "idCardImageUrl":authentication["idHeadImgUrl"]
				, "handCardUrl":authentication["customerImageUrl"]
				, "signPicUrl":authentication["sign"]
			}
			, "number":String(telInfo["tel"]) 
		})
		.then(function(result_json){
			if(result_json.status == "1"){
				$scope.upPdf(result_json.data)
			}else{
				$state.go("ok")
			}
		}, function(){
			$state.go("ok")
		})
	}



	$scope.upPdf = function(){
		$scope.domEaplan = "电子工单保存中";
		$scope.domLine = "95";
		$http({
			method: 'POST',
			url: ajaxurl + 'identityApp/updateEleWorkForNumberOrder?token='+$rootScope.token,
			data: {"orderNo":authentication["orderNo"], "eleWork":arguments[0]}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$state.go("ok");
		});
	}






	// 读卡
	//
	//
	//
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


	$scope.scan = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.simInput.simcard = barcodeData.text;
					$scope.btnDisplay = [true, false];	// 按钮显示控制
					$scope.btnActive =  [false, false];	// 按钮选中控制
				}else{
					my.alert("读取卡号不完整,请重新扫描一次。").then(function(){
						$scope.btnActive[0] =  false;
					});
				}
			});
	};


	$scope.simcardInput = function(){
		if($scope.simInput.simcard.length >= 19){
			// 读卡消失,写卡浮现
			$scope.btnDisplay = [true, false];	// 按钮显示控制
			$scope.btnActive =  [false, false];	// 按钮选中控制
		}else{
			$scope.btnDisplay = [false, true];	// 按钮显示控制
			$scope.btnActive =  [false, false];	// 按钮选中控制
		}
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
})
