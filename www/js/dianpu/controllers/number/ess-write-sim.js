appControllers.controller('dianpu-cbss-write-sim', function($scope, $state) {

	$scope.title = "提交确认";

	// 减免输入框显示状态
	$scope.reduceMoneyShow = Number(cateInfo["reduceMoney"]) === 0 ? true : false;


	// 预存
	$scope.preFeeList = deepCopy(disPreChargeList);
	// 活动
	$scope.activityShow = true;
	$scope.activityPrice = 0;
	$scope.activityId = "";
	$scope.activityName = "";
	if(dianpu_cbss_package_array.activity.sub_productList.length){
		$scope.activityShow = false;
		$scope.activityPrice = dianpu_cbss_package_array.activity.sub_productList[0]["price"];
		$scope.activityId = dianpu_cbss_package_array.activity.sub_productList[0]["productId"];
		$scope.activityName = dianpu_cbss_package_array.activity.sub_productList[0]["productName"];
	}
	// 购机赠费的活动
	if(dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"].length){
		$scope.activityShow = false;
		$scope.activityId = dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"][0]["productId"];
		$scope.activityName = dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"][0]["productName"];
		var phonePackage = dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"][0]["elementName"];
		var phonePackagePriceL = phonePackage.indexOf("预存");
		if(phonePackagePriceL == -1){
			$scope.activityPrice = 0;
		}else{
			$scope.activityPrice = phonePackage.substring(phonePackagePriceL, phonePackage.indexOf("元", phonePackagePriceL)).replace(/[^\d]/g, "")
		}
	}

	// 如果没有活动把 0 预存删除
	if($scope.activityShow){
		$scope.preFeeList.shift();
	}else{
		if(activityFee == 1){
			$scope.preFeeList = [0];
		}
	}

	// 判断套餐是否有最低预存
	if(dianpu_cbss_package_array.sub_productObj.lowPreCharge > 0){
		telInfo["preCharge"] = telInfo["preCharge"] > dianpu_cbss_package_array.sub_productObj.lowPreCharge ? telInfo["preCharge"] : dianpu_cbss_package_array.sub_productObj.lowPreCharge;
	}

	if(Number(telInfo["preCharge"])>0){
		var preFeeList = [];
		var telPreCharge = 0;
		if(preChargeAddActivity == 1){
			telPreCharge = Number(telInfo["preCharge"]) - $scope.activityPrice;
			telPreCharge = telPreCharge > 0 ? telPreCharge : 0;
		}else{
			telPreCharge = Number(telInfo["preCharge"]);
		}
		for(var i=0,j=$scope.preFeeList.length;i<j;i++){
			
			if($scope.preFeeList[i] >= telPreCharge){
				preFeeList.push($scope.preFeeList[i]);
			}
		}
		if(preFeeList.length){
			$scope.preFeeList = preFeeList;
		}else{
			preFeeList.push(telInfo["preCharge"]);
			$scope.preFeeList = preFeeList;
		}
	}
	$scope.select = {"preFeeList":$scope.preFeeList[0]}



	$scope.simInput = {
		  "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "productName":dianpu_cbss_package_array["sub_productObj"]["productName"]
		, "preNumberCharge":telInfo["lowCost"]
		, "preFee":0
		, "reduceMoney":String(cateInfo["reduceMoney"])
		, "activity":$scope.activityShow
		, "activityName":$scope.activityName
		, "activityFee": Number($scope.activityPrice)
	}


	$scope.reset_preFee = function(){
		$scope.simInput.preFee = $scope.select.preFeeList;
		$scope.simInput.amount = Number($scope.activityPrice) + Number($scope.simInput.preFee);
		// if(dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"].length && $scope.activityPrice == 0){
		// 	// 大部分已经没用了，购机赠的活动预存可以算出来，这个是
		// 	$scope.simInput.amount = "购机赠费活动的金额 + " + $scope.simInput.preFee;
		// }else{
		// }
	}
	$scope.reset_preFee();


	$scope.order = function(){
		submitFee = $scope.simInput.preFee;
		if(authentication["sign"]){
			$state.go("dianpu-cbss-write-sim-submit");
		}else{
			$state.go("signature");
		}
	}
})



// 返单成功
.controller('dianpu-cbss-write-sim-submit', function($scope, $rootScope, $http, $state, $ionicActionSheet, $cordovaBarcodeScanner, unicomm_server, ble, my) {

	$scope.title = "<"+ telInfo["tel"] +">业务提交";
	$scope.btnText = {"read":"读卡","write":"写卡"};	// 读写卡按钮文字

	$scope.boxDisplay = [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay = [false, true];	// 按钮显示控制
	$scope.btnActive =  [false, false];	// 按钮选中控制

	$scope.ReSubmitDiv = true;		// 重新提交按钮
	$scope.amount = 0;				// 联通返回的订单金额

	// 读卡|扫描
	if(service_type == "cbssSemiManufactures"){
		$scope.btnText = {"read":"扫描","write":"提交"}
		$scope.readBtn = [true, false]
	}else{
		$scope.readBtn = [false, true]
	}

	$scope.simInput = {"simcard":""}


	// getbaseandtradeid 返回信息
	var sub_basetradeidObj = {};
	// 图片上传成功后返回的信息
	var brNumber = null;
	// 号码验证(validatetonumber)成功后 返回的信息
	var sub_numberObj = {};
	var numberJson = null;		// sub_numberObj(原始信息)
	// 用户信息 & custId(用户确认时填加)
	var sub_personObj = {}
	sub_personObj["custName"] = authentication['name'];
	sub_personObj["psptId"] = authentication['cardId'];


	// 套餐信息部分
	$scope.sub_productObj = dianpu_cbss_package_array["sub_productObj"];
	$scope.sub_productList = dianpu_cbss_package_array["result"]["sub_productList"].concat(
			  dianpu_cbss_package_array["service"]["sub_productList"]
			, dianpu_cbss_package_array["activity"]["sub_productList"]
			, dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"]
			, dianpu_cbss_package_array["zhuka"]["sub_productList"]
		);
	$scope.sub_elementList = dianpu_cbss_package_array["result"]["sub_elementList"].concat(
			  dianpu_cbss_package_array["service"]["sub_elementList"]
			, dianpu_cbss_package_array["activity"]["sub_elementList"]
			, dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"]
			, dianpu_cbss_package_array["zhuka"]["sub_elementList"]
		);
	$scope.selecteElementCode = dianpu_cbss_package_array["result"]["selecteElementCode"].concat(
			  dianpu_cbss_package_array["service"]["selecteElementCode"]
			, dianpu_cbss_package_array["activity"]["selecteElementCode"]
			, dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"]
			, dianpu_cbss_package_array["zhuka"]["selecteElementCode"]
		);



	// 写卡步骤初始
	$scope.domEaplan = "准备开卡";
	$scope.domLine = "1";



	$scope.write=function(){

		if($scope.btnActive[1]){
		}
		else{
			if($scope.domLine == "40"){
				$scope.boxDisplay = [true, false];
				$scope.getsiminfo();
			}else if($scope.domLine == "25"){
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
		if($scope.domLine == "5"){
			$scope.CBSSUser();
		}
		else if($scope.domLine == "10"){
			$scope.validNumber();
		}
		else if($scope.domLine == "15"){
			$scope.uploadImage();
		}
		else if($scope.domLine == "20"){
			$scope.getbaseandtradeid();
		}
		else if($scope.domLine == "30"){
			$scope.createmodtrade();
		}
		else if($scope.domLine == "35"){
			$scope.firstfinishorder();
		}
		else if($scope.domLine == "45"){
			$scope.writesim();
		}
		else if($scope.domLine == "50"){
			$scope.submitorder();
		}
		else if($scope.domLine == "55"){
			$scope.continueTradeReg();
		}
		else if($scope.domLine == "60"){
			$scope.writeOrder();
		}
		else if($scope.domLine == "65"){
			$scope.updateShop();
		}
		else if($scope.domLine == "70"){
			$scope.cbss_wzhDeal();
		}
		else if($scope.domLine == "75"){
			$scope.cbss_billpaper_wzhDeal();
		}
		else if($scope.domLine == "80"){
			$scope.cbssPdf();
		}
		else if($scope.domLine == "85"){
			$scope.upPdf();
		}
	}
	$scope.interrupt = function(){
		// 保存错误信息
		if(arguments[1] != ""){
			$scope.saveFailed(arguments[1],(arguments[3] ? arguments[3] : arguments[0]));
		}
		// 提示错误信息，重新提交
		if($scope.domLine == "10"){
			my.alert("号码已被使用，请重选选择号码！").then(function(){
				reelectNumber = 1;
				$state.go('number-list')
			});
		}else{
			if(arguments[2]){
				my.alert(alertInfo(arguments[0])).then(function(){
					$scope.ReSubmitDiv = false;
				});
			}else{
				$scope.ReSubmitDiv = false;
			}
		}

		if($scope.domLine >= 55){
			$scope.message = true;
		}
	}
	$scope.saveFailed = function(){
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/saveFailedInfo?token=" + $rootScope.token,
			data : {"orderCode":authentication["orderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1])}
		})
	}




	$scope.CBSSUser = function() {
		$scope.domEaplan = "身份验证";
		$scope.domLine = "5";

		unicomm_server.getUnicomm({
			  "cmd":"iscustomexists"
			, "pspt_id":authentication['cardId']		// 真实身份证号码
		})
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
					})
					.then(
						function(result_json){
							if(result_json.status == "1"){
								sub_personObj["custId"] = result_json.data.custId;
								$scope.validNumber();
							}else{
								$scope.interrupt("联通开户失败，失败原因："+result_json.data, "CBSS开卡-联通开户", 1);
							}
						}
						, function(data){
							$scope.interrupt(data, "CBSS开卡-联通开户(系统)");
						})
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-获取联通用户(系统)");
			}
		);
	}


	$scope.validNumber = function(){
		$scope.domEaplan = "建立新用户!";
		$scope.domLine = "10";

		unicomm_server.getUnicomm({
			  "cmd":"validatetonumber"
			, "tonumber":telInfo["tel"]
		})
		.then(
			function(result_json){
				numberJson = result_json;
				if (result_json.status == "1") {
					telInfo["itemId"] = result_json.data.lowCostItemId;
					sub_numberObj["serialNumber"] = result_json.data.serialNumber;
					sub_numberObj["numberSrc"] = result_json.data.numberSrc;
					sub_numberObj["numberType"] = result_json.data.numberType;
					sub_numberObj["numThawPro"] = result_json.data.numThawPro;
					$scope.uploadImage()
				} else {
					$scope.interrupt(result_json.data.message, "CBSS开卡-号码预占", 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-号码预占(系统)");
			}
		);
	}



	$scope.uploadImage = function(){
		$scope.domEaplan = "上传照片";
		$scope.domLine = "15";

		unicomm_server.getUnicomm({
			"cmd":"uploadPhoto",
			"imagepath":authentication["customerImageUrl"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					brNumber = result_json.data;
					$scope.getbaseandtradeid();
				} else {
					$scope.interrupt("上传照片错误，错误信息为："+result_json.data, "CBSS开卡-上传照片", 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-上传照片(系统)");
			}
		);
	}




	$scope.getbaseandtradeid = function(){
		$scope.domEaplan = "获取tradeid信息!";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			  "cmd":"getbaseandtradeid"
			, "number":numberJson
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
						sub_basetradeidObj["base"] = result_json.data.base;
						sub_basetradeidObj["tradeid"] = result_json.data.tradeid;
						// 半成卡跳转
						if(service_type == "cbssSemiManufactures"){
							$scope.cbss_number_checkSimCardNoNew();
						}else{
							$scope.createmodtrade();
						}
				} else {
					$scope.interrupt("获取tradeid出错", "CBSS开卡-获取tradeid", 1, JSON.stringify(result_json) );
				}
			}, function(data){
				$scope.interrupt(data, "CBSS开卡-获取tradeid(系统)");
			}
		);
	};



	// 半成卡 需要调用的
	var SimCardNoNew_data = {};
	$scope.cbss_number_checkSimCardNoNew = function(){

		$scope.domEaplan = "提交SIM卡信息!";
		$scope.domLine = "25";

		unicomm_server.getUnicomm({
			  "cmd":"cbss_number_checkSimCardNoNew"
			, "number":telInfo["tel"]
			, "iccid": $scope.simInput.simcard
		})
		.then(function(result_json){
			if (result_json.status == "1") {
				SimCardNoNew_data = result_json.data;
				$scope.createmodtrade();
			} else {
				$scope.saveFailed("CBSS开卡-提交SIM卡(半成卡)", result_json.data);
				my.alert(result_json.data).then(function(){
					$scope.simInput.simcard = "";
					$scope.btnText = {"read":"重新扫描","write":"继续提交"};
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
	$scope.createtrade_result = {};


	$scope.createmodtrade = function() {
		$scope.domEaplan = "创建并提交订单";
		$scope.domLine = "30";

		var unicomm_json = {
			  "person":sub_personObj
			, "number":sub_numberObj
			, "product":$scope.sub_productObj
			, "productList":$scope.sub_productList
			, "elementList":$scope.sub_elementList
			, "tradeuser":{"developStaffId":cbssInfo["developCode"],"channelCode":cbssInfo["channelCode"]}
			, "basetradeid":sub_basetradeidObj
			, "brNumber":brNumber
			, "simcardinfo":{}
			, "tradeType":dianpu_cbss_zf_tradeType 	//主副卡 0:白卡 3:副卡 4:主卡
			, "zfInfo":dianpu_cbss_zkInfo
		}

		// 购机赠费 & cbss白卡
		if(service_type == "cbssPhoneGiveFee"){
			unicomm_json["cmd"] = "cbss_order_createMobtrade4Phone";
			unicomm_json["phoneinfo"] = JSON.stringify(dianpu_phoneGiveFee["phoneinfo"]);
		}else{
			unicomm_json["cmd"] = "createmodtrade";
		}

		// 半成卡 & 白卡
		if(service_type == "cbssSemiManufactures"){
			unicomm_json.isCompleteCard = true;
			unicomm_json.simcardinfo = SimCardNoNew_data;
		}else{
			unicomm_json.isCompleteCard = false;
		}


		unicomm_server.getUnicomm(unicomm_json)
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
					$scope.createtrade_result = result_json.data.createtrade_result;
					// 半成卡 & 白卡
					if(service_type == "cbssSemiManufactures"){
						$scope.continueTradeReg();
					}else{
						cbss_wzhDeal_orderinfo = result_json.data; // 无纸化
						$scope.firstfinishorder();
					}
				} else {
					$scope.interrupt(result_json.data, "CBSS开卡-"+unicomm_json["cmd"], 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-"+unicomm_json["cmd"]+"(系统)");
			}
		);
	}



	$scope.firstfinishorder = function() {
		$scope.domEaplan = "创建并提交订单";
		$scope.domLine = "35";

		unicomm_server.getUnicomm({
			"cmd":"submitorder",
			"totalMoneyFee":$scope.totalMoneyFee,
			"tradeMainList":$scope.tradeMainList,
			"feePayMoneyList":$scope.feePayMoneyList,
			"continueFeeList":$scope.continueFeeList,
			"TRADE_ID_MORE_STR":$scope.TRADE_ID_MORE_STR,
			"SERIAL_NUMBER_STR":$scope.SERIAL_NUMBER_STR,
			"TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR,
			"NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR,
			"create_result":$scope.create_result,
			"createtrade_result":$scope.createtrade_result
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.getsiminfo();
				} else {
					$scope.interrupt(result_json.data, "CBSS开卡-"+unicomm_json["cmd"], 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-"+unicomm_json["cmd"]+"(系统)");
			}
		);
	}



	//
	var xoption = "";
	var imsi = "";
	var procid = null;
	var capacityTypeCode = null;
	var cardData = null;

	$scope.getsiminfo = function(){

		$scope.domEaplan = "获取SIM卡信息";
		$scope.domLine = "40";

		unicomm_server.getUnicomm({
			"cmd":"cbss_number_getwritesiminfo",
			"ccid":$scope.simInput.simcard,
			"productId":$scope.sub_productObj.productId,
			"branchCode":$scope.sub_productObj.brandCode,
			"tradeId":sub_basetradeidObj["tradeid"],
			"serialNumber":sub_numberObj["serialNumber"],
			"tradeTypeCode":$scope.TRADE_TYPE_CODE_STR.substring(0,$scope.TRADE_TYPE_CODE_STR.length-1),
			"netTypeCode":$scope.NET_TYPE_CODE_STR.substring(0,$scope.NET_TYPE_CODE_STR.length-1),
			"containsFee":false
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					xoption = result_json.data.xoption;
					imsi = result_json.data.imsi;
					procid = result_json.data.procid;
					capacityTypeCode = result_json.data.capacityTypeCode;
					cardData = result_json.data.cardData;
					$scope.writesim();
				} else {
					$scope.saveFailed("CBSS开卡-订单绑定SIM卡", result_json.data);
					my.alert(result_json.data).then(function(){
						$scope.simInput.simcard = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];	// 读卡div 显示
						$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
						$scope.btnActive =  [false, false];	// 按钮选中状态
					});
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-订单绑定SIM卡(系统)");
			}
		);
	}


	$scope.writesim = function() {

		$scope.domEaplan = "写入SIM卡";
		$scope.domLine = "45";

		ble.BLEwriteSim(imsi, xoption2str(xoption)).then(function(){
			$scope.submitorder();
		}, function(data){
			$scope.interrupt(data, "CBSS开卡-写入SIM卡", 1);
		})
	}




	$scope.submitorder = function() {
		$scope.domEaplan = "SIM卡信息同步";
		$scope.domLine = "50";

		unicomm_server.getUnicomm({
			"cmd":"writesimok",
			"ccid":$scope.simInput.simcard,
			"productId":$scope.sub_productObj.productId,
			"branchCode":$scope.sub_productObj.brandCode,
			"tradeId":sub_basetradeidObj["tradeid"],
			"serialNumber":sub_numberObj["serialNumber"],
			"tradeTypeCode":$scope.TRADE_TYPE_CODE_STR.substring(0,$scope.TRADE_TYPE_CODE_STR.length-1),
			"netTypeCode":$scope.NET_TYPE_CODE_STR.substring(0,$scope.NET_TYPE_CODE_STR.length-1),
			"imsi": imsi,
			"xoption": xoption,
			"procid": procid,
			"capacityTypeCode": capacityTypeCode,
			"cardData": cardData
		})
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
					$scope.createtrade_result = result_json.data.createtrade_result;
					$scope.continueTradeReg();
				} else {
					$scope.interrupt(result_json.data, "CBSS开卡-SIM卡信息同步", 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-SIM卡信息同步(系统)");
			}
		);
	}


	$scope.continueTradeReg = function() {
		$scope.domEaplan = "联通订单组装完成";
		$scope.domLine = "55";

		unicomm_server.getUnicomm({
			"cmd":"continueTradeReg",
			"totalMoneyFee":$scope.totalMoneyFee,
			"tradeMainList":$scope.tradeMainList,
			"reduceMoney":String(cateInfo["reduceMoney"]),
			"feePayMoneyList":$scope.feePayMoneyList,
			"continueFeeList":$scope.continueFeeList,
			"TRADE_ID_MORE_STR":$scope.TRADE_ID_MORE_STR,
			"SERIAL_NUMBER_STR":$scope.SERIAL_NUMBER_STR,
			"TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR,
			"NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR,
			"create_result":$scope.create_result,

			"createtrade_result":$scope.createtrade_result,
			"money":Number(submitFee - dianpu_cbss_package_array.sub_productObj.lowPreCharge),	// 减去套餐内的最低预存金额
			"serialNumber":sub_numberObj["serialNumber"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.amount = result_json.data.fee;
					order_amount = result_json.data.fee;
					
					// 如果是微信订单 回写
					if(wx_orderCode != ""){
						$http({
							url : ajaxurl+ "wechatShopApp/updatePreorderStatus",
							method : "GET",
							params:{
								  "token":$rootScope.token
								, "orderCode":wx_orderCode
								, "number":telInfo["tel"]
								, "orderStatus":"000002"
							}
						})
						wx_orderCode = "";
						wx_number = "";
					}

					$scope.writeOrder();
				} else {
					$scope.interrupt(result_json.data, "CBSS开卡-订单组装最后一步", 1);
				}
			},
			function(data){
				$scope.interrupt(data, "CBSS开卡-订单组装最后一步(系统)");
			}
		);
	}



	$scope.writeOrder = function(){
		$scope.domEaplan = "订单写入";
		$scope.domLine = "60";

		var param  ="imsi="+imsi;
			param += "&xoption="+xoption;
			param += "&tradeFee="+$scope.amount;
			param += "&preCharge="+submitFee;
			param += "&tradeId="+(sub_basetradeidObj["tradeid"] ? sub_basetradeidObj["tradeid"] : "");
			param += "&ccid="+$scope.simInput.simcard;
			param += "&orderNo="+authentication["orderNo"];
			param += "&number="+telInfo["tel"];
			param += "&name="+ authentication["name"];
			param += "&cardid="+ authentication["cardId"];
			param += "&selectedElement="+$scope.selecteElementCode;
			$http({
				url : ajaxurl+ "orderApp/savedirecttrade?token=" + $rootScope.token + "&" + param,
				method : "GET"
			}).success(function(){
				if(userBo.testTag == "000001"){
					$scope.updateShop();
				}else{
					my.alert("当前店铺未走账，不会产生任何交易流水，当前号码若为测试号码，请及时返销，若是用户正常开户，可忽略此信息。").then(function(){
						$scope.orderToSuccess();
					})
				}
			}).error(function(){
				$scope.interrupt("订单写入失败", "CBSS开卡-回写订单", 1);
			});
	}





	$scope.updateShop = function(){
		$scope.domEaplan = "订单确认";
		$scope.domLine = "65";
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/orderCheckOut?token=" + $rootScope.token,
			data : {"orderNo":authentication["orderNo"],"productId":$scope.activityId,"preCharge":submitFee}
		}).success(function(){
			// my.alert("写卡成功，可提供用户使用！").then(function(){
				$scope.orderToSuccess();
			// })
		}).error(function(){
			$scope.interrupt("更新订单状态失败", "CBSS开卡-订单确认", 1);
		});
	}


	
	$scope.orderToSuccess = function(){

		$scope.domEaplan = "订单确认";
		$scope.domLine = "65";

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





	// $scope.cbss_wzhDeal = function(){
	// 	$scope.domEaplan = "无纸化工单生成中";
	// 	$scope.domLine = "70";
	// 	var argument = arguments;
	// 	unicomm_server.getUnicomm({
	// 		  "cmd":"cbss_billpager_getWzhInfo"
	// 		, "orderinfo": cbss_wzhDeal_orderinfo
	// 	})
	// 	.then(function(result_json){
	// 		if(result_json.status == "1"){
	// 			$scope.cbss_billpaper_wzhDeal(result_json.data)
	// 		}else{
	// 			$scope.cbssPdf();
	// 		}
	// 	}, function(){
	// 		$scope.cbssPdf();
	// 	})
	// }


	// $scope.cbss_billpaper_wzhDeal = function(){
	// 	$scope.domEaplan = "无纸化工单保存中";
	// 	$scope.domLine = "75";
	// 	unicomm_server.getUnicomm({
	// 		  "cmd":"cbss_billpaper_wzhDeal"
	// 		, "strInfo": arguments[0]
	// 		, "signImageUrl":authentication["sign"]
	// 		, "personInfo":{
	// 			  "custName":authentication["name"]
	// 			, "psptId":authentication["cardId"]
	// 			, "nation":authentication["nation"]
	// 			, "gender":authentication["gender"]
	// 			, "address":authentication["address"]
	// 			, "police":authentication["police"]
	// 			, "startDate":authentication["start_date"]
	// 			, "endDate":authentication["end_date"]
	// 			, "birthday":authentication["birthday"]
	// 			, "idCardImageUrl":authentication["idHeadImgUrl"]
	// 			, "handCardUrl":authentication["customerImageUrl"]
	// 			, "signPicUrl":authentication["sign"]
	// 		}
	// 	})
	// 	.then(function(result_json){
	// 		$scope.cbssPdf();
	// 	}, function(){
	// 		$scope.cbssPdf();
	// 	})
	// }


	$scope.cbssPdf = function(){
		$scope.domEaplan = "CBSS电子工单生成中";
		$scope.domLine = "80";
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
		$scope.domLine = "85";
		$http({
			method: 'POST',
			url: 'http://z.haoma.cn/tms-app-war/identityApp/updateEleWorkForNumberOrder?token='+$rootScope.token,
			data: {"orderNo":authentication["orderNo"], "eleWork":arguments[0]}
		}).success(function(data){
			$state.go("ok");
		}).error(function(data){
			$state.go("ok");
		});
	}





	//
	//
	//
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
		}else{
			$scope.btnDisplay = [false, true];	// 按钮显示控制
		}
		$scope.btnActive =  [false, false];	// 按钮选中控制
	}
})
