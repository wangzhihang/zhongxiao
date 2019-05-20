appControllers.controller('dianpu-cbss-write-sim', function($scope, $state, $http, $rootScope, my) {

	$scope.title = "提交确认";
	$scope.agree = true;

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
		if(dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"][0].itemYcmpFee){
			$scope.activityPrice = String(dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"][0].itemYcmpFee/100);
		}else{
			var phonePackagePriceL = phonePackage.indexOf("预存");
			if(phonePackagePriceL == -1){
				$scope.activityPrice = 0;
			}else{
				$scope.activityPrice = String(Number(phonePackage.substring(Number(phonePackagePriceL)+2, phonePackage.indexOf("元", phonePackagePriceL) ) ) );
			}
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


	// 打包套餐
	if(telInfo["productPrice"] || (telInfo["productPrice"] && telInfo["productPrice"] === "0")){
		$scope.preFeeList = [Number(telInfo.productPrice)];
	}

	
	// 如果副卡 大王卡 钉钉钻石/金/银 直接预存 为 0
	var sub_productObj_id = ["90063345", "90126182", "90126163", "90126144", "90350506", "90155946"]
	if(service_type == "cbssFuka" || sub_productObj_id.indexOf(dianpu_cbss_package_array["sub_productObj"]["productId"]) != -1){
		$scope.preFeeList = [0];
	}
	// sub_productObj_id = ["90350506", "90155946"]
	// if(sub_productObj_id.indexOf(dianpu_cbss_package_array["sub_productObj"]["productId"]) != -1){
	// 	$scope.preFeeList = [0,100,200];
	// }

	// 如果是新的套餐佣金 重设
	if(cbss_commission.preChareList || cbss_commission.activeList){
		$scope.preFeeList = [];
		if($scope.activityId && service_type != "cbssPhoneGiveFee"){
			var preChareList = [];
			for(var i in cbss_commission.activeList){
				if($scope.activityId == cbss_commission.activeList[i].activeId){
					preChareList = cbss_commission.activeList[i].preChareList;
				}
			}
			cbss_commission.preChareList = preChareList;
		}
		if(cbss_commission.preChareList){
			for(var i in cbss_commission.preChareList){
				if(Number(telInfo["preCharge"]) <= Number(cbss_commission.preChareList[i].preCharge)){
					$scope.preFeeList.push(Number(cbss_commission.preChareList[i].preCharge))
				}
			}
		}
	}


	// 引流订单按设置的套餐预存来
	if(wx_order.orderCode){
		$scope.preFeeList = [wx_order.preFee];
		cbss_commission = {};
	}
	$scope.select = {"preFeeList":$scope.preFeeList[0]}



	$scope.simInput = {
		"name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "productName":dianpu_cbss_package_array["sub_productObj"]["productName"]
		, "preNumberCharge":telInfo["lowCost"]
		, "leaseLength":Number(telInfo["leaseLength"])+"月"
		, "preFee":""
		, "reduceMoney":String(cateInfo["reduceMoney"])
		, "activity":$scope.activityShow
		, "activityName":$scope.activityName
		, "activityFee": Number($scope.activityPrice)

		,"effectiveTime":""
		,"additionalProduct":""
	}

	if(dianpu_cbss_package_array["service"]["sub_productList"].length){
		$scope.simInput.additionalProductShow = true;
		for(var i in dianpu_cbss_package_array["service"]["sub_productList"]){
			$scope.simInput.additionalProduct +=  ", " + dianpu_cbss_package_array["service"]["sub_productList"][i].productName
		}
		$scope.simInput.additionalProduct = $scope.simInput.additionalProduct.substring(2);
	}
	
	// 首页计费方式
	var effectiveTimeArr = ["首月按量计费","首月全量全价","首月套餐减半"]
	for(var i in dianpu_cbss_package_array["result"]["sub_elementList"]){
		for(var ii in effectiveTimeArr){
			if(dianpu_cbss_package_array["result"]["sub_elementList"][i].elementName.indexOf(effectiveTimeArr[ii]) !== -1){
				$scope.simInput.effectiveTime = effectiveTimeArr[ii];
				$scope.simInput.effectiveTimeShow = true;
			}
		}
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
		if(!$scope.agree){
			my.alert("同意协议后，可继续进行！")
			return;
		}

		if($scope.simInput.preFee === ""){
			my.alert("没有查到配套的预存，请确认<"+telInfo["tel"]+">是否可办理<"+$scope.simInput.productName+">套餐！");
			return;
		}

		// 新套餐乱加
		if(cbss_commission.preChareList){
			for(var i in cbss_commission.preChareList){
				if(Number(cbss_commission.preChareList[i].preCharge) ===  Number($scope.simInput.preFee)){
					cbss_commission.id = cbss_commission.preChareList[i].id;
				}
			}
		}

		if(app == "dianpu" && userBo.testTag == "000001"){
			var postJson = {"orderNo":authentication['orderNo'], "preCharge":$scope.simInput.amount}
			if(cbss_commission.id){
				postJson.commsiionId = cbss_commission.id;
			}
			$http({
				method: 'GET',
				url: ajaxurl + "shopAndroid/validateBalance?token=" + $rootScope.token,
				params: postJson
			}).success(function(return_json){
				if(return_json.result == "1" || return_json.result == "-2"){
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
		$http({
			method: 'GET',
			url: ajaxurl + "orderApp/addUnicommProductInfo",
			params: {
				"token":$rootScope.token,
				"effectiveTime":$scope.simInput.effectiveTime,
				"additionalProduct":$scope.simInput.additionalProduct,
				"orderNo":authentication['orderNo']
			}
		})
		submitFee = $scope.simInput.preFee;
		submitAmount = $scope.simInput.amount;
		if(authentication["sign"]){
			$state.go("dianpu-cbss-write-sim-submit");
		}else{
			$state.go("signature");
		}
	}


	//同意协议
	$scope.agreeClick=function(){
		$scope.agree=!$scope.agree;
	}
	//协议细则
	$scope.protocolDetails=function(){
		localStorage.setItem('userOrderNumber',$scope.simInput.number);
		localStorage.setItem('userOrderName',$scope.simInput.name);
		localStorage.setItem('userOrderCardId',$scope.simInput.cardId);
		$state.go("dianpu-cbss-protocol-details");
	}

})



// 返单成功
.controller('dianpu-cbss-write-sim-submit', function($scope, $rootScope, $http, $state, $ionicActionSheet, $cordovaBarcodeScanner, unicomm_server, ble, my, url2base64) {

	$scope.title = sourceName + "("+ telInfo["tel"] +")";
	$scope.btnText = {"read":"读卡","write":"写卡"};	// 读写卡按钮文字

	$scope.boxDisplay = [false, true];	// 读卡 写卡状态 控制
	$scope.btnDisplay = [false, true];	// 按钮显示控制
	$scope.btnActive =  [false, false];	// 按钮选中控制

	$scope.ReSubmitDiv = true;		// 重新提交按钮
	$scope.amount = 0;				// 联通返回的订单金额
	order_type = "kaika";
	$scope.emailShow = userBo.userName == "c88" ? true : false;


	// 30%后 不用的
	var sub_personObj = {}
	sub_personObj["custName"] = authentication['name'];
	sub_personObj["psptId"] = authentication['cardId'];

	// 图片上传成功后返回的信息
	$scope.brNumber = null;
	$scope.LiveNumber = null;
	// getbaseandtradeid 返回信息
	var sub_basetradeidObj = {};
	// 号码验证(validatetonumber)成功后 返回的信息
	var sub_numberObj = {};
	var numberJson = null;		// sub_numberObj(原始信息)


	// 主卡 副卡 判断
	$scope.dianpu_cbss_zf_tradeType = "";
	if(dianpu_cbss_package_array.service.sub_productList.length){
		for(var i in dianpu_cbss_package_array.service.sub_productList){
			if(dianpu_cbss_package_array.service.sub_productList[i].productName.indexOf("主卡") !== -1){
				$scope.dianpu_cbss_zf_tradeType = "4";
			}
		}
	}
	if(service_type == "cbssFuka"){
		$scope.dianpu_cbss_zf_tradeType = "3";
	}


	// 套餐信息部分
	$scope.pruductInitial = function()
	{
		$scope.sub_productObj = dianpu_cbss_package_array["sub_productObj"];
		$scope.sub_productList = dianpu_cbss_package_array["result"]["sub_productList"].concat(
				dianpu_cbss_package_array["service"]["sub_productList"],
				dianpu_cbss_package_array["activity"]["sub_productList"],
				dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"],
				dianpu_cbss_package_array["zhuka"]["sub_productList"]
			);
		$scope.sub_elementList = dianpu_cbss_package_array["result"]["sub_elementList"].concat(
				dianpu_cbss_package_array["service"]["sub_elementList"],
				dianpu_cbss_package_array["activity"]["sub_elementList"],
				dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"],
				dianpu_cbss_package_array["zhuka"]["sub_elementList"]
			);
		$scope.selecteElementCode = dianpu_cbss_package_array["result"]["selecteElementCode"].concat(
				dianpu_cbss_package_array["service"]["selecteElementCode"],
				dianpu_cbss_package_array["activity"]["selecteElementCode"],
				dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"],
				dianpu_cbss_package_array["zhuka"]["selecteElementCode"]
			);
	
		// 活动
		var temp_activity = [];
		temp_activity = dianpu_cbss_package_array["activity"]["sub_productList"].concat(
			dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"]
		);
		if(temp_activity.length){
			$scope.activity = temp_activity[0];
		}else{
			$scope.activity = {}
		}
	}


	// 写卡步骤初始
	$scope.domEaplan = "准备开卡";
	$scope.domLine = "1";

	$scope.reSubmit = function(){

		$scope.ReSubmitDiv = true;
		$scope.message = false;
		if($scope.domLine == "1"){
			$scope.write();
		}
		else if($scope.domLine == "5"){
			$scope.CBSSUser();
		}
		else if($scope.domLine == "4"){
			$scope.cbss_checkpsptByGzt();
		}
		else if($scope.domLine == "10"){
			$scope.validNumber();
		}
		else if($scope.domLine == "8"){
			$scope.createcustomer();
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
		else if($scope.domLine == "32"){
			$scope.submitDone()
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
		else if($scope.domLine == "51"){
			$scope.updateOrder2ReadyPay();
		}
		else if($scope.domLine == "52"){
			$scope.cbss_order_startWoPos();
		}
		else if($scope.domLine == "53"){
			$scope.cbss_order_checkWoposStatus();
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



	// 重新提交显示
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		if($scope.domLine == "10"){
			my.alert("号码已被使用，请重新选择号码！", "提示", "重选号码").then(function(){
				// 释放预存号码
				store.remove("occupyNumber", telInfo["tel"]);
				reelectNumber = 1;
				$state.go('number-list')
			});
		}
		else if($scope.domLine == "30"){
			if(msg["text"].indexOf("终端已经被使用") !== -1 ){
				my.alert("手机串码(IMEI)已使用，请重新换一个串码，继续提交！", "提示", "换手机串码").then(function(){
					reelectPhone = 1;
					$state.go('dianpu-cbss-phoneGiveFee')
				});
			}
			// else if(msg["text"].indexOf("终端已经被使用") !== -1 ){
			// 	my.alert("手机串码(IMEI)已使用，请重新换一个串码，继续提交！", "提示", "换手机串码").then(function(){
			// 		reelectPhone = 1;
			// 		$state.go('dianpu-cbss-phoneGiveFee')
			// 	});
			// }
			else{
				$scope.interruptGo(msg);
			}
		}else{
			$scope.interruptGo(msg);
		}
		// 有可能成功了
		if($scope.domLine >= 55){
			$scope.message = true;
		}
	}

	$scope.interruptGo = function(){
		var msg = arguments[0];
		if(msg["popup"]){
			var popupTxt = alertInfo(msg["text"]);
			if(popupTxt.indexOf("黑名单客户") !== -1 || popupTxt.indexOf("实名制限制：合并后，身份证和户口本") !== -1){
				my.alert(popupTxt + "<br><span style='color:#F00'>联通限制，该客户为不允许办理联通新业务！</span>").then(function(){
					$state.go("index");
				});
			}else{
				my.alert(popupTxt).then(function(){
					$scope.ReSubmitDiv = false;
				});
			}
		}else{
			$scope.ReSubmitDiv = false;
		}
	}
	$scope.saveFailed = function(){
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/saveFailedInfo?token=" + $rootScope.token,
			data : {"orderCode":authentication["orderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}

	$scope.write=function(){
		$scope.boxDisplay = [true, false];
		if($scope.domLine == "40"){
			$scope.getsiminfo();
		}else if($scope.domLine == "25"){
			$scope.cbss_number_checkSimCardNoNew();
		}
		else{
			$scope.getUser();
		}
	}

	BusinessSubmission = false;
	$scope.getUser = function(){
		$scope.domEaplan = "系统登录.";
		if(!BusinessSubmission){
			BusinessSubmission = true;
			$scope.UnicommUserInfo = cbssInfo; 
			$scope.login();
		}else{
			BusinessSubmission = false;
			$scope.ReSubmitDiv = false;
		}
	}

	$scope.login = function(){
		$scope.domEaplan = "系统登录..";
		unicomm_server.cbssLogin($scope.UnicommUserInfo).then(function(){
			if(userBo.userName == "18866668888"){
				my.alert("您使用的是测试工号，下一步操作将产生消费，将跳过开卡步骤").then(function(){
					$scope.writeOrder();
				})
			}else{
				$scope.cbss_checkpsptByGzt();
			}
		},function(data){
			$scope.saveFailed("cbss开卡登录(系统)", data);
			$scope.ReSubmitDiv = false;
		});
	}
	$scope.cbss_checkpsptByGzt = function(){
		$scope.domEaplan = "国政通验证";
		$scope.domLine = "4";
		unicomm_server.getUnicomm({
			"cmd":"cbss_checkpsptByGzt",
			"custName":authentication['name'],
			"psptId":authentication['cardId']
		}).then(function(result_json){
			if(result_json.status == "1"){
				if(wx_order.orderCode){
					$scope.cbss_customer_isblack();
				}else{
					$scope.CBSSUser();
				}
			}else{
				if(result_json.data == "国政通验证失败"){
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-国政通验证失败"
					});
				}else{
					$scope.saveFailed("CBSS开卡-国政通验证失败", result_json.data);
					if(wx_order.orderCode){
						$scope.cbss_customer_isblack();
					}else{
						$scope.CBSSUser();
					}
				}
			}
		},function(data){
			$scope.saveFailed("CBSS开卡-国政通验证失败(系统)", data);
			$scope.ReSubmitDiv = false;
		});
	}

	

	
	$scope.cbss_customer_isblack = function(){
		unicomm_server.getUnicomm({
				"cmd":"cbss_customer_isblack",
				"psptId":authentication['cardId'],
				"custName":authentication['name']
		}).then(function(result_json){
			if(result_json.status == "1"){
				$scope.cbss_user_checklimit_unicomm();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":result_json.data,
					"saveName":"黑户验证"
				});
			}
		})
	}
	// 5户
	$scope.cbss_user_checklimit_unicomm = function(){
		unicomm_server.getUnicomm({
				"cmd":"cbss_user_checklimit",
				"name": authentication['name'],
				"psptid": authentication['cardId']
		}, 30000).then(function(result_json){
			if(result_json.status == "1"){
				$scope.CBSSUser();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":result_json.data,
					"saveName":"五户验证"
				});
			}
		})
	}

	var isWithCustOrderInfo = false;
	if(["000112","000113"].indexOf(source) !== -1){
		isWithCustOrderInfo = true;
	}
	$scope.CBSSUser = function() {
		$scope.domEaplan = "身份验证";
		$scope.domLine = "5";
		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],
			"cust_name":authentication['name'],
			"isWithCustOrderInfo":isWithCustOrderInfo
		})
		.then(
			function(result_json){
				sub_personObj["custId"] = "";
				if(isWithCustOrderInfo){
					var data = "办理此业务的客户和不是首页认证的客户。"
					if(result_json.status == "1"){
						for(var i in result_json.custOrderInfo){
							for(var ii in result_json.custOrderInfo[i]){
								if( result_json.custOrderInfo[i][ii].serialNumber == changeOrderInfo.number){
									sub_personObj["custId"] = result_json.custOrderInfo[i][ii].custId;
								}
							}
						}
						if(sub_personObj["custId"] === ""){
							$scope.interrupt({
								"popup":true,
								"saveName":"CBSS开卡-联通用户确认",
								"text":data
							});
						}else{
							$scope.getbaseandtradeid();
						}
					}else{
						$scope.interrupt({
							"popup":true,
							"saveName":"CBSS开卡-联通用户确认",
							"text":data
						});
					}
				}else{
					if (result_json.status == "1") {
						sub_personObj["custId"] = result_json.data.custId;
						$scope.validNumber();
					}else if(result_json.status == "99"){
						$scope.CBSSUser();
					}
					else if(result_json.status == "98"){
						var data = result_json.data.message ? result_json.data.message : result_json.data;
						if(data == "无此客户信息，请创建客户！"){
							$scope.createcustomer();
						}else if(data == "用户姓名与身份证号码不匹配，请确认!"){
							$scope.createcustomer();
						}else{
							$scope.interrupt({
								"popup":true,
								"saveName":"CBSS开卡-联通用户确认",
								"text":data
							});
						}
					}
					else {
						var data = result_json.data.message ? result_json.data.message : result_json.data;
						if(data == "无此客户信息，请创建客户！"){
							$scope.createcustomer();
						}else{
							$scope.interrupt({
								"popup":true,
								"saveName":"CBSS开卡-联通用户确认",
								"text":data
							});
						}
					}
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-获取联通用户(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}


	$scope.createcustomer = function(){
		$scope.domEaplan = "建立用户!";
		$scope.domLine = "8";

		unicomm_server.getUnicomm({
			"cmd":"createcustomer",
			"cust_name":authentication["name"],
			"pspt_id":authentication["cardId"],
			"end_date":authentication["end_date"],
			"contact_name":authentication["name"],
			"contact_phone":authentication["contractNumber"],
			"addressinfo":authentication["address"],
			"birthday":authentication["birthday"],
			"nation":authentication["nation"],
			"sex":(authentication["gender"].indexOf("男") !== -1 ? "M" : "F")
		})
		.then(
			function(result_json){
				if(result_json.status == "1"){
					sub_personObj["custId"] = result_json.data.custId;
					$scope.validNumber();
				}else if(result_json.status == "99"){
					$scope.createcustomer();
				}else{
					$scope.interrupt({
						"popup":true,
						"text":"联通开户失败，失败原因："+result_json.data,
						"saveName":"CBSS开卡-联通开户"
					});
				}
			}
			, function(data){
				$scope.saveFailed("CBSS开卡-联通开户(系统)", data);
				$scope.ReSubmitDiv = false;
			})
	}






	$scope.validNumber = function(){
		$scope.domEaplan = "号码验证!";
		$scope.domLine = "10";

		unicomm_server.getUnicomm({
			"cmd":"validatetonumber",
			"tonumber":telInfo["tel"]
		})
		.then(
			function(result_json){
				numberJson = result_json;
				if (result_json.status == "1") {
					// 号码预占后和订单确认号码
					$http({
						url : ajaxurl+ "orderApp/updateNumberByOrderNo",
						method : "GET",
						params:{
							"token":$rootScope.token,
							"orderNo":authentication["orderNo"],
							"number":telInfo["tel"]
						}
					})
					sub_numberObj = result_json.data;
					sub_numberObj.lowCost = String(sub_numberObj.lowCost*100)
					$scope.uploadImage()
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data.message,
						"saveName":"CBSS开卡-号码预占"
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-号码预占(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.uploadImage = function(){
		$scope.domEaplan = "上传认证信息";
		$scope.domLine = "15";
		if($scope.UnicommUserInfo.bodyCertification === "1"){
			if(authentication["uploadLivePhoto"] && authentication["uploadLivePhoto"].length == 3){
				$scope.cbss_customer_uploadLivePhoto_unicomm();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":"上传视频，错误信息为：未获取到完整的活体认证信息",
					"saveName":"CBSS开卡-上传视频"
				});
			}
		}else{
			$scope.uploadImage_unicomm();
		}
	}

	$scope.uploadImage_unicomm = function(){
		unicomm_server.getUnicomm({
			"cmd":"uploadPhoto",
			"imagepath":authentication["customerImageUrl"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.brNumber = result_json.data;
					if($scope.UnicommUserInfo.identityCard === "1" || shopInfo.shopBo.city == "8120000"){
						$scope.cbss_customer_uploadIdCardPhoto();
					}else{
						$scope.getbaseandtradeid();
					}
				} else {
					$scope.interrupt({
						"popup":true,
						"text":"上传照片错误，错误信息为："+result_json.data,
						"saveName":"CBSS开卡-上传照片"
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-上传照片(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}
	
	$scope.cbss_customer_uploadLivePhoto_unicomm = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_customer_uploadLivePhoto",
			"alivePic1":authentication["uploadLivePhoto"][0].replace(/[\n]/g,"").replace(/[\r]/g,""),
			"alivePic2":authentication["uploadLivePhoto"][1].replace(/[\n]/g,"").replace(/[\r]/g,""),
			"alivePic3":authentication["uploadLivePhoto"][2].replace(/[\n]/g,"").replace(/[\r]/g,"")
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.LiveNumber = result_json.data;
					if(shopInfo.shopBo.city == "8120000"){
						$scope.getbaseandtradeid();
					}else{
						$scope.cbss_customer_uploadIdCardPhoto();
					}
				} else {
					$scope.interrupt({
						"popup":true,
						"text":"上传视频错误，错误信息为："+result_json.data,
						"saveName":"CBSS开卡-上传视频"
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-上传视频(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.uploadIdCardSequence = null;
	$scope.cbss_customer_uploadIdCardPhoto = function(){
		$scope.domEaplan = "上传证件信息";
		unicomm_server.getUnicomm({
			"cmd":"cbss_customer_uploadIdCardPhoto",
			"frontIdCardPath":authentication["frontIdCardPath"],
			"backIdCardPath":authentication["backIdCardPath"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.uploadIdCardSequence = result_json.data;
					$scope.getbaseandtradeid();
				} else {
					$scope.interrupt({
						"popup":true,
						"text":"上传身份证错误，错误信息为："+result_json.data,
						"saveName":"CBSS开卡-上传身份证"
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-上传身份证(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.getbaseandtradeid = function(){
		$scope.domEaplan = "获取tradeid信息!";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			"cmd":"getbaseandtradeid",
			"number":numberJson
		})
		.then(
			function(result_json){
				if(isEmptyObject(sub_basetradeidObj)){
					if (result_json.status == "1") {
							sub_basetradeidObj["base"] = result_json.data.base;
							sub_basetradeidObj["tradeid"] = result_json.data.tradeid;
							// 半成卡跳转
							if(changeOrderInfo){
								$scope.createmodtrade_old();
							}else{
								if(service_type == "cbssSemiManufactures"){
									$scope.cbss_number_checkSimCardNoNew();
								}else{
									$scope.createmodtrade();
								}
							}
					} else {
						$scope.interrupt({
							"popup":true,
							"text":"获取tradeid出错",
							"saveName":"CBSS开卡-获取tradeid",
							"saveText":JSON.stringify(result_json)
						});
					}
				}
			}, function(data){
				$scope.saveFailed("CBSS开卡-获取tradeid(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	};



	// 半成卡 需要调用的
	var SimCardNoNew_data = {};
	$scope.cbss_number_checkSimCardNoNew = function(){

		$scope.domEaplan = "提交SIM卡信息!";
		$scope.domLine = "25";

		unicomm_server.getUnicomm({
			"cmd":"cbss_number_checkSimCardNoNew",
			"number":telInfo["tel"],
			"iccid": $scope.simInput.simcard
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
		}, function(data){
			$scope.saveFailed("CBSS开卡-提交SIM卡(半成卡)-(系统)", data);
			$scope.ReSubmitDiv = false;
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
			"cmd":"createmodtrade",
			"person":sub_personObj,
			"number":sub_numberObj,
			"product":$scope.sub_productObj,
			"productList":$scope.sub_productList,
			"elementList":$scope.sub_elementList,
			"tradeuser":{"developStaffId":$scope.UnicommUserInfo["developCode"],"channelCode":$scope.UnicommUserInfo["channelCode"]},
			"basetradeid":sub_basetradeidObj,
			"simcardinfo":{},
			"tradeType":($scope.simType.product.id + (["3","4"].indexOf($scope.dianpu_cbss_zf_tradeType) !== -1  ? $scope.dianpu_cbss_zf_tradeType : "")), 	//主副卡 (0:白卡 1:半成卡) (3:副卡 4:主卡)  2:对公
			"zfInfo":dianpu_cbss_zkInfo
		};

		// 社会渠道的归集
		if(dianpu_cbss_groupData){
			unicomm_json.groupData = dianpu_cbss_groupData;
		}

		// 购机赠费
		if(service_type == "cbssPhoneGiveFee"){
			unicomm_json["phoneinfo"] = JSON.stringify(dianpu_phoneGiveFee["phoneinfo"]);
		}

		// 活体 & 持证照片
		if($scope.LiveNumber){
			unicomm_json.uploadLivePhoto = $scope.LiveNumber;
		}else{
			unicomm_json.brNumber = $scope.brNumber;
		}

		// 身份证正反面
		if($scope.uploadIdCardSequence){
			unicomm_json.uploadIdCardSequence = $scope.uploadIdCardSequence;
		}

		// 半成卡 & 白卡
		if(service_type == "cbssSemiManufactures"){
			unicomm_json.isCompleteCard = true;
			unicomm_json.simcardinfo = SimCardNoNew_data;
			unicomm_json.simcardinfo.pin = "1234";
			unicomm_json.simcardinfo.puk = "12345678";
		}else{
			unicomm_json.isCompleteCard = false;
		}

		// 畅视卡 imei
		if(changshiProduct && ["C","D"].indexOf(changshiInfo.type) != -1){
			unicomm_json.imei = changshiInfo.imei;
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
					if(service_type != "cbssSemiManufactures"){
						cbss_wzhDeal_orderinfo = result_json.data; // 无纸化
					}
					$scope.submitDone();
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-"+unicomm_json["cmd"]
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-"+unicomm_json["cmd"]+"(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	// 业务变更
	$scope.createmodtrade_old = function() {
		$scope.domEaplan = "创建并提交订单";
		$scope.domLine = "31";

		var unicomm_json = {
			"cmd":"cbss_order_changeOrderInfo",
			"isChangePackage":dianpu_cbss_package_array["sub_productObj"].productId?true:false,
			"changeInfo":changeOrderInfo,
			"productList":$scope.sub_productList,
			"elementList":$scope.sub_elementList,
			"phoneinfo":JSON.stringify(dianpu_phoneGiveFee["phoneinfo"]),
			"imei":dianpu_phoneGiveFee.imei,
			"productId":dianpu_cbss_package_array["sub_productObj"].productId?dianpu_cbss_package_array["sub_productObj"].productId:changeOrderInfo.oldProductId,
			"tradeuser":{"developStaffId":$scope.UnicommUserInfo["developCode"],"channelCode":$scope.UnicommUserInfo["channelCode"]},
			"basetradeid":sub_basetradeidObj.tradeid,
			"tradeType":($scope.simType.product.id + (["3","4"].indexOf($scope.dianpu_cbss_zf_tradeType) !== -1  ? $scope.dianpu_cbss_zf_tradeType : "")), 	//主副卡 (0:白卡 1:半成卡) (3:副卡 4:主卡)  2:对公	
		};

		unicomm_server.getUnicomm(unicomm_json)
		.then(
			function(result_json){
				if (result_json.status == "1") {
					sub_numberObj["serialNumber"] = changeOrderInfo.number;
					sub_basetradeidObj["tradeid"] = result_json.data.create_result.tradeId;

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
					$scope.submitDone();
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-"+unicomm_json["cmd"]
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-"+unicomm_json["cmd"]+"(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.submitDone = function(){
		$scope.domEaplan = "保存订单信息";
		$scope.domLine = "32";
		var oldProductId = "";
		var oldProductName = "";
		if(changeOrderInfo){
			oldProductId=changeOrderInfo.oldProductId;
			oldProductName=changeOrderInfo.oldProductName;
		}
		$http({
			method: 'POST',
			url: ajaxurl + 'orderApp/submitDone',
			params:{"token":$rootScope.token},
			data:{
				"orderNo": authentication['orderNo'],
				"tradeId": (sub_basetradeidObj["tradeid"] ? sub_basetradeidObj["tradeid"] : ""),
				"number": telInfo['tel'],
				"name":authentication['name'],
				"cardid": authentication["cardId"],
				"preCharge": submitFee,
				"activeAmount":($scope.activity.price ? $scope.activity.price : 0),
				"totalAmount":"",
				"selectedElement": $scope.selecteElementCode,
				"unicommJson":JSON.stringify({
					"sub_productObj":$scope.sub_productObj,
					"activity":$scope.activity,
					"sub_numberObj":sub_numberObj,
					"sub_basetradeidObj":sub_basetradeidObj,
					"TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR,
					"NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR,
					"commsiionId":cbss_commission.id,
					"submitAmount":submitAmount,
					"submitFee":submitFee
				}),
				"commsiionId":cbss_commission.id,
				"unicomAccountId":$scope.UnicommUserInfo.id,
				// 主卡号码
				"mainNumber":dianpu_cbss_zkInfo.serialnumberA?dianpu_cbss_zkInfo.serialnumberA:"",
				"tradeType":($scope.simType.product.id + (["3","4"].indexOf($scope.dianpu_cbss_zf_tradeType) !== -1  ? $scope.dianpu_cbss_zf_tradeType : "")),
				// 办卡时活体开启状态
				"bodyCertification":($scope.LiveNumber?"1":"0"),
				"identityCard":($scope.uploadIdCardSequence?"1":"0"),
				// 业务变更老套餐
				"oldProductId":oldProductId,
				"oldProductName":oldProductName,
				"oldActivityId":"",
				"oldActivityName":"",
				"oldAdditionalId":"",
				"oldAdditionalName":""
			}
		}).success(function(){
			$scope.submitDoneGo();
		}).error(function(){
			$scope.submitDoneGo();
		});
	}


	$scope.submitDoneGo = function(){
		if(changeOrderInfo){
			$scope.updateOrder2ReadyPay();
		}else{
			if(service_type == "cbssSemiManufactures"){
				$scope.updateOrder2ReadyPay();
			}else{
				$scope.firstfinishorder();
			}
		}
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
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-submitorder"
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-submitorder(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}


	// $scope.cbss_order_changeOrderInfo = function(){
	// 	$scope.domEaplan = "创建并提交订单";
	// 	$scope.domLine = "36";

	// 	unicomm_server.getUnicomm({
	// 		"cmd":"submitorder",
	// 		"totalMoneyFee":$scope.totalMoneyFee,
	// 		"tradeMainList":$scope.tradeMainList,
	// 		"feePayMoneyList":$scope.feePayMoneyList,
	// 		"continueFeeList":$scope.continueFeeList,
	// 		"TRADE_ID_MORE_STR":$scope.TRADE_ID_MORE_STR,
	// 		"SERIAL_NUMBER_STR":$scope.SERIAL_NUMBER_STR,
	// 		"TRADE_TYPE_CODE_STR":$scope.TRADE_TYPE_CODE_STR,
	// 		"NET_TYPE_CODE_STR":$scope.NET_TYPE_CODE_STR,
	// 		"create_result":$scope.create_result,
	// 		"createtrade_result":$scope.createtrade_result
	// 	})
	// 	.then(
	// 		function(result_json){
	// 			if (result_json.status == "1") {
	// 				$scope.getsiminfo();
	// 			} else {
	// 				$scope.interrupt({
	// 					"popup":true,
	// 					"text":result_json.data,
	// 					"saveName":"CBSS开卡-submitorder"
	// 				});
	// 			}
	// 		},
	// 		function(data){
	// 			$scope.saveFailed("CBSS开卡-submitorder(系统)", data);
	// 			$scope.ReSubmitDiv = false;
	// 		}
	// 	);
	// }


	//
	var xoption = "";
	var imsi = "";
	var procid = null;
	var capacityTypeCode = null;
	var cardData = null;

	$scope.getsiminfo = function(){
		$scope.domEaplan = "获取SIM卡信息";
		$scope.domLine = "40";
		var unicomm_json = {}
		if(orderContinue.orderCode){
			unicomm_json = {
				"cmd":"cbss_number_getwritesiminfo",
				"serialNumber":sub_numberObj["serialNumber"],
				"ccid":$scope.simInput.simcard,
				"netTypeCode":"50"
			}
		}else{
			unicomm_json = {
				"cmd":"cbss_number_getwritesiminfo",
				"ccid":$scope.simInput.simcard,
				"productId":$scope.sub_productObj.productId,
				"branchCode":$scope.sub_productObj.brandCode,
				"tradeId":sub_basetradeidObj["tradeid"],
				"serialNumber":sub_numberObj["serialNumber"],
				"tradeTypeCode":$scope.TRADE_TYPE_CODE_STR.substring(0,$scope.TRADE_TYPE_CODE_STR.length-1),
				"netTypeCode":$scope.NET_TYPE_CODE_STR.substring(0,$scope.NET_TYPE_CODE_STR.length-1),
				"containsFee":false
			}
		}
		unicomm_server.getUnicomm(unicomm_json)
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
					$scope.saveFailed("CBSS开卡-订单绑定SIM卡", alertInfo(result_json.data));
					my.alert(alertInfo(result_json.data)).then(function(){
						$scope.simInput.simcard = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];	// 读卡div 显示
						$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
						$scope.btnActive =  [false, false];	// 按钮选中状态
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-订单绑定SIM卡(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.bleFind = 0;
	$scope.writesim = function() {
		$scope.domEaplan = "写入SIM卡";
		$scope.domLine = "45";
		ble.BLEwriteSim(imsi, xoption2str(xoption)).then(function(){
			$scope.submitorder();
		}, function(data){
			if($scope.bleFind < 5){
				$scope.bleFind++;
				$scope.writesim();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":data,
					"saveName":"CBSS开卡-写入SIM卡"
				});
			}
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
					$scope.updateOrder2ReadyPay()	
				} else {
					$scope.domLine = "40";
					$scope.saveFailed("CBSS开卡-SIM卡信息同步", result_json.data);
					my.alert("卡资源同步失败。<br>处理方法：<br>1.换卡继续提交。<br>2.此卡片可废卡重置。").then(function(){
						$scope.simInput.simcard = "";
						$scope.btnText = {"read":"重新读卡","write":"继续写卡"};
						$scope.boxDisplay = [false, true];	// 读卡div 显示
						$scope.btnDisplay = [false, true];	// 读卡按钮显示, 写入按钮隐藏
						$scope.btnActive =  [false, false];	// 按钮选中状态
					});
				}
			},
			function(data){
				$scope.saveFailed("CBSS开卡-SIM卡信息同步(系统)", data);
				$scope.ReSubmitDiv = false;
			}
		);
	}

	$scope.continueTradeReg_json = {}
	$scope.updateOrder2ReadyPay = function(){
		$scope.domEaplan = "保存联通订单信息";
		$scope.domLine = "51";
		$scope.continueTradeReg_json = {
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
			"money":Number(submitFee - $scope.sub_productObj.lowPreCharge),	// 减去套餐内的最低预存金额
			"serialNumber":sub_numberObj["serialNumber"],
			"tradeId":sub_basetradeidObj["tradeid"]	// 分期需要
		};
		var post_data = {
			"orderNo": authentication['orderNo'],
			"imsi": imsi,
			"xoption": xoption,
			"ccid": $scope.simInput.simcard,
			"unicommJson":JSON.stringify({
				"continueTradeReg_json":$scope.continueTradeReg_json,
				"sub_productObj":$scope.sub_productObj,
				"activity":$scope.activity,
				"sub_numberObj":sub_numberObj,
				"sub_basetradeidObj":sub_basetradeidObj,
				"commsiionId":cbss_commission.id,
				"submitAmount":submitAmount,
				"submitFee":submitFee
			})
		}
		$http({
			method: 'POST',
			url: ajaxurl + 'orderApp/updateOrder2ReadyPay',
			params:{"token": $rootScope.token},
			data:post_data
		}).success(function(){
			$scope.woPos2RegGo();
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"saveName":"CBSS开卡-保存联通订单信息",
				"text":"CBSS开卡-保存联通订单信息",
				"saveText":post_data,
			});
		});
	}

	$scope.woPos2RegGo = function(){
		if($scope.activity.productName && 
			($scope.activity["productName"].indexOf("金融分期终端购机赠费") !== -1 
			|| $scope.activity["productName"].indexOf("红包电子券") !== -1
			|| $scope.activity["productName"].indexOf("分期冰激凌") !== -1 )
		){
			if($scope.activity["productName"].indexOf("金融分期终端购机赠费") !== -1){
				$scope.simInput.fqType = "wopos";
			}
			if($scope.activity["productName"].indexOf("红包电子券") !== -1
				|| $scope.activity["productName"].indexOf("分期冰激凌") !== -1 ){
				$scope.simInput.fqType = "huabei";
			}
			$scope.ShowWoPosSelect = true;
			if($scope.simInput.fqType != "huabei"){
				$scope.ShowWoPosSelectJump = true;
			}
			// 花呗
			if($scope.checkWoposStatusJson){
				$scope.ShowWoPosSelect = false;
				$scope.posPwShow();
			}
		}else{
			$scope.continueTradeReg();
		}
	}


	var posOrderInfo = ""
	$scope.cbss_order_startWoPos = function(){
		$scope.domEaplan = "分期付款提交";
		$scope.domLine = "52";
		$scope.simInput["cbss_order_startWoPos_period"] = $scope.activity.endOffset;
		$scope.ShoWoPosInfo = true;
		$scope.ShowWoPosSelect = false;
	}

	$scope.cbss_order_startWoPos_cmd = function(){
		$scope.simInput.cbss_order_startWoPos_posMoney = String($scope.simInput.cbss_order_startWoPos_posMoney).replace(/[^\d]/g, "");
		$scope.simInput["cbss_order_startWoPos_period"]= String($scope.simInput["cbss_order_startWoPos_period"]).replace(/[^\d]/g, "");
		if(["430","715","1200","1998","720","2000","3000","4000","888","1088","1688","3388"].indexOf($scope.simInput.cbss_order_startWoPos_posMoney) === -1){
			my.alert("请根据政策输入金额");
			return ;
		}
		$scope.simInput["cbss_order_startWoPos_period"]   = $scope.simInput["cbss_order_startWoPos_period"];
		$scope.simInput["cbss_order_startWoPos_posMoney"] = $scope.simInput.cbss_order_startWoPos_posMoney;
		$scope.ShoWoPosInfo = false;
		unicomm_server.getUnicomm({
			"cmd":"cbss_order_startWoPos",
			"serialNumber":sub_numberObj["serialNumber"],
			"tradeId":sub_basetradeidObj["tradeid"],
			"posMoney":$scope.simInput.cbss_order_startWoPos_posMoney,
			"fqType":$scope.simInput.fqType
		}).then(function(result_json){
			if(result_json.status == "1"){
				posOrderInfo = result_json.data;
				$scope.cbss_order_setFqType();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":result_json.data,
					"saveName":"CBSS开卡-分期付款提交"
				});
			}
		},function(data){
			$scope.saveFailed("CBSS开卡-分期付款提交（系统）", data);
			$scope.ReSubmitDiv = false;
		})
	}
	$scope.cbss_order_setFqType = function(){
		$scope.ShoWoPosInfo = false;
		var posOrderInfoFq = {}
		if($scope.simInput.fqType == "huabei" && posOrderInfo.fqList){
			for(var i in posOrderInfo.fqList){
				if(Number(posOrderInfo.fqList[i].fqPeriod) == Number($scope.simInput["cbss_order_startWoPos_period"]) ){
					posOrderInfoFq = posOrderInfo.fqList[i];
				}
			}
		}
		unicomm_server.getUnicomm({
			"cmd":"cbss_order_setFqInfo",
			"cbssOrder":posOrderInfo.cbssOrder,
			"fqType":$scope.simInput.fqType,
			"period":($scope.simInput.fqType=="wopos"?$scope.simInput.cbss_order_startWoPos_period:String(posOrderInfoFq.fqPeriod)),
			"fqFlag":(posOrderInfoFq.flag?posOrderInfoFq.flag:""),
			"fqId":(posOrderInfo.fqId?posOrderInfo.fqId:""),
			"fqRate":(posOrderInfoFq.rate?posOrderInfoFq.rate:""),
			"issuerName":(posOrderInfoFq.issuerName?posOrderInfoFq.issuerName:""),
		}).then(function(result_json){
			if(result_json.status == "1"){
				posOrderInfo = result_json.data;
				$scope.checkWoposStatusJson = {
					"cmd":"cbss_order_checkWoposStatus",
					"cbssOrderInfo":posOrderInfo.cbssOrderInfo,
					"outSerialNo":posOrderInfo.outSerialNo,
					"tradeId":sub_basetradeidObj["tradeid"], 
					"posMoney":$scope.simInput.cbss_order_startWoPos_posMoney,
				}
				$scope.updateOrder2ReadyPay2();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":result_json.data,
					"saveName":"CBSS开卡-分期付款提交"
				});
			}
		},function(data){
			$scope.saveFailed("CBSS开卡-分期付款提交（系统）", data);
			$scope.ReSubmitDiv = false;
		})
	}


	$scope.updateOrder2ReadyPay2 = function(){
		var post_data = {
			"orderNo": authentication['orderNo'],
			"unicommJson":JSON.stringify({
				"continueTradeReg_json":$scope.continueTradeReg_json,
				"sub_productObj":$scope.sub_productObj,
				"activity":$scope.activity,
				"sub_numberObj":sub_numberObj,
				"sub_basetradeidObj":sub_basetradeidObj,
				"commsiionId":cbss_commission.id,
				"submitAmount":submitAmount,
				"submitFee":submitFee,
				"checkWoposStatusJson":$scope.checkWoposStatusJson
			})
		}
		$http({
			method: 'POST',
			url: ajaxurl + 'orderApp/updateOrder2ReadyPay',
			params:{"token": $rootScope.token},
			data:post_data
		}).success(function(){
			$scope.posPwShow();
		}).error(function(){
			$scope.posPwShow();
		});
	}

	$scope.posPwShow = function(){
		$scope.BUSI_ORDER_ID = $scope.checkWoposStatusJson.cbssOrderInfo.BUSI_ORDER_ID.substr(-8, 4) + " " + $scope.checkWoposStatusJson.cbssOrderInfo.BUSI_ORDER_ID.substr(-4);
		// if($scope.simInput.fqType == "wopos"){
		// }else{
		// 	$scope.BUSI_ORDER_ID = "";
		// }
		$scope.ShowPosPw = true;
	}

	$scope.cbss_order_checkWoposStatus = function(){
		$scope.domEaplan = "分期付款确认";
		$scope.domLine = "53";
		$scope.ShowPosPw = false;
		unicomm_server.getUnicomm($scope.checkWoposStatusJson).then(function(result_json){
			if(result_json.status == "1"){
				if($scope.simInput.fqType != "huabei"){
					$scope.continueTradeReg();
				}else{
					my.alert("为保障用户自动还款权益，请协助用户为本次办理的号码注册沃钱包APP并实名认证！！").then(
						function(){
							$scope.continueTradeReg();
						}
					)
				}
			}else{
				my.alert(result_json.data).then(function(){
					$scope.ShowPosPw = true;
				});
			}
		},function(){
			$scope.saveFailed("分期付款确认-cbss_order_checkWoposStatus（系统）", data);
			$scope.ShowPosPw = true;
			// $scope.ReSubmitDiv = false;
		})
	}



	$scope.continueTradeReg = function() {
		$scope.domEaplan = "联通订单组装完成";
		$scope.domLine = "55";
		$scope.ShowWoPosSelect = false;

		unicomm_server.getUnicomm($scope.continueTradeReg_json)
		.then(
			function(result_json){
				console.log(result_json)
				if (result_json.status == "1") {
					$scope.amount = result_json.data.fee;
					order_amount = result_json.data.fee;
					$scope.orderSuccess_process();
				} else {
					$scope.cbss_order_queryOrderInfo_jump(result_json.data);
				}
			},
			function(data){
				$scope.cbss_order_queryOrderInfo(data);
			}
		);
	}


	$scope.cbss_order_queryOrderInfo_jump = function(){
		var popupTxt = arguments[0];
		if(popupTxt.indexOf("省份代理商接口返回错误信息如下") !== -1){
			$scope.interrupt({
				"popup":true,
				"text":popupTxt,
				"saveName":"CBSS开卡-订单组装最后一步"
			});
		}else{
			$scope.cbss_order_queryOrderInfo(popupTxt);
		}
	}


	$scope.cbss_order_queryOrderInfo = function(){
		var popupTxt = arguments[0];
		unicomm_server.getUnicomm({"cmd":"cbss_order_queryOrderInfo","serialNumber":telInfo["tel"]}).then(
			function(return_json){
				if(return_json.status == "1"){
					var ordertype = false;
					if(return_json.data && return_json.data.length){
						for(var i in return_json.data){
							if(return_json.data[i].TRADE_TYPE == "开户" && ["正常完工","IOM施工中","可继续执行"].indexOf(return_json.data[i].BSS_NEXT_DEAL_TAG_NAME) !== -1){
								ordertype = true;
							}
						}
					}
					if(ordertype){
						$scope.amount = submitAmount;
						order_amount = submitAmount;
						$scope.orderSuccess_process()
					}else{
						$scope.interrupt({
							"popup":true,
							"text":popupTxt,
							"saveName":"CBSS开卡-订单组装最后一步"
						});
					}
				}else{
					$scope.interrupt({
						"popup":true,
						"text":popupTxt,
						"saveName":"CBSS开卡-订单组装最后一步"
					});
				}
			}, function(){
				$scope.saveFailed("CBSS开卡-订单组装最后一步", popupTxt);
				$scope.ReSubmitDiv = false;
			}
		)
	}


	$scope.orderSuccess_process = function(){
		// 释放预存号码
		store.remove("occupyNumber", telInfo["tel"]);
		// 将imei设为以使用
		if(service_type == "cbssPhoneGiveFee" && dianpu_phoneGiveFee.imeiId){
			$http({
				method: 'POST',
				url: ajaxurl + 'imei/setImeiZhanYong',
				data: {"id":dianpu_phoneGiveFee.imeiId,"orderCode":authentication['orderNo']},
				params: {"token":$rootScope.token}
			})
		}

		// 营业厅订单
		if(scanCode_order.orderCode){
			$http({
				url : ajaxurl+ "ltOrder/ltOrderSuccess",
				method : "GET",
				params:{
					"token":$rootScope.token,
					"id":scanCode_order.id,
					"orderCode":scanCode_order.orderCode,
					"orderType":scanCode_order.orderType,
					"developCode":cbssInfo.developCode,
					"cbss":cbssInfo.username,
					"wxOrderNo":authentication['orderNo'],
					"number":telInfo["tel"],
					"productId":order_info["productId"],
					"productName":order_info["productName"],
					"tradeId":sub_basetradeidObj["tradeid"],
					"remark":""
				}
			}).success(function(data){
				$http({
					method:'POST',
					url:'http://123.139.156.77:18081/orderReceive/order/haomaHomeProductNotice',
					headers:{'Content-Type':'Content-Type:text/plain'},
					data:data
				}).success(function(){
					scanCode_order = {}
				}).error(function () {
				});
			})
		}

		$scope.writeOrder();
	}


	$scope.writeOrder = function(){
		$scope.domEaplan = "订单写入";
		$scope.domLine = "60";
		var params = {
			"token": $rootScope.token,
			"orderNo": authentication['orderNo'],
			"number": telInfo['tel'],
			"tradeFee": $scope.amount
		}
		$http({
			method: 'GET',
			url: ajaxurl + 'orderApp/numberOrder2Success',
			params : params
		}).success(function(){
			if($rootScope.isShowsetTab === false || userBo.testTag == "000001"){
				$scope.updateShop();
			}else{
				my.alert("当前店铺未走账，不会产生任何交易流水，当前号码若为测试号码，请及时返销，若是用户正常开户，可忽略此信息。").then(function(){
					$scope.orderToSuccess();
				})
			}
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"订单写入失败",
				"saveText":params,
				"saveName":"CBSS开卡-回写订单"
			});
		});
	}


	$scope.updateShop = function(){
		$scope.domEaplan = "订单确认";
		$scope.domLine = "65";
		var postJson = {"orderNo":authentication["orderNo"],"productId":$scope.activity.productId,"preCharge":submitFee}
		if(cbss_commission.id){
			postJson.commsiionId = cbss_commission.id;
		}
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/orderCheckOut?token=" + $rootScope.token,
			data : postJson
		}).success(function(){
			$scope.orderToSuccess();
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"更新订单状态失败",
				"saveText":postJson,
				"saveName":"CBSS开卡-订单确认"
			});
		});
	}


	
	$scope.orderToSuccess = function(){
		if(userBo.userName == "c88"){
			$scope.cbss_wzhDeal();
		}else{
			$scope.cbssPdf();
			// $scope.cbss_wzhDeal();
		}
		// $scope.domEaplan = "订单确认";
		// $scope.domLine = "65";

		// var param  = "&orderNo="+authentication['orderNo'];
		// $http({
		// 	url : ajaxurl+ "orderApp/numberOrderToSuccess?token=" + $rootScope.token + "&" + param,
		// 	method : "GET"
		// }).success(function(){
		// 	$scope.cbssPdf();
		// }).error(function(){
		// 	$scope.cbssPdf();
		// });
	}





	$scope.cbss_wzhDeal = function(){
		$scope.domEaplan = "无纸化工单生成中";
		$scope.domLine = "70";
		var argument = arguments;
		unicomm_server.getUnicomm({
			"cmd":"cbss_billpager_getWzhInfo",
			"orderinfo": cbss_wzhDeal_orderinfo
		})
		.then(function(result_json){
			if(result_json.status == "1"){
				$scope.cbss_billpaper_wzhDeal(result_json.data)
			}else{
				$scope.cbssPdf();
			}
		}, function(){
			$scope.cbssPdf();
		})
	}


	$scope.cbss_billpaper_wzhDeal = function(){
		$scope.domEaplan = "无纸化工单保存中";
		$scope.domLine = "75";
		unicomm_server.getUnicomm({
			"cmd":"cbss_billpaper_wzhDeal",
			"strInfo": arguments[0],
			"signImageUrl":authentication["sign"],
			"personInfo":{
				"custName":authentication["name"],
				"psptId":authentication["cardId"],
				"nation":authentication["nation"],
				"gender":authentication["gender"],
				"address":authentication["address"],
				"police":authentication["police"],
				"startDate":authentication["start_date"],
				"endDate":authentication["end_date"],
				"birthday":authentication["birthday"],
				"idCardImageUrl":authentication["idHeadImgUrl"],
				"handCardUrl":authentication["customerImageUrl"],
				"signPicUrl":authentication["sign"]
			}
		})
		.then(function(){
			$scope.cbssPdf();
			// if(result_json.status == "1"){
			// 	$scope.cbss_billpaper_wzhmail(result_json.data)
			// }else{
			// 	$scope.cbssPdf();
			// }
		}, function(){
			$scope.cbssPdf();
		})
	}

	

	// $scope.cbss_billpaper_wzhmail = function(){
	// 	$scope.domEaplan = "无纸化工单邮件发送中";
	// 	$scope.domLine = "75";
	// 	unicomm_server.getUnicomm({
	// 		  "cmd":"cbss_billpaper_wzhmail"
	// 		, "email":$scope.simInput.email
	// 		, "caseNo":arguments[0].caseNo
	// 		, "orderId":arguments[0].orderId
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
		var data = {
			"cmd":"cbss_number_generateBillPaper",
			"personInfo":{
				"custName":authentication["name"],
				"psptId":authentication["cardId"],
				"nation":authentication["nation"],
				"gender":authentication["gender"],
				"address":authentication["address"],
				"police":authentication["police"],
				"startDate":authentication["start_date"],
				"endDate":authentication["end_date"],
				"birthday":authentication["birthday"],
				"idCardImageUrl":authentication["idHeadImgUrl"],
				"handCardUrl":authentication["customerImageUrl"],
				"signPicUrl":authentication["sign"]
			},
			"number":String(telInfo["tel"])
		}
		if(telInfo["goodType"]){
			data.bestNumber = {
				"preCharge":telInfo["preCharge"],
				"monthCharge":telInfo["lowCost"]
			}
			
			$http({
				url : ajaxurl+ "shopAndroid/addPriceNumber",
				method : "GET",
				params :{
					token:$rootScope.token,
					number:telInfo["tel"],
					lowInline:telInfo["leaseLength"],
					priceType:telInfo["goodType"],
					lowCost:telInfo["lowCost"]

				}
			})
		}
		if(authentication["idCardFrontImage"]){
			data.personInfo.idCardFrontImage = authentication["idCardFrontImage"];
			data.personInfo.idCardBackImage = authentication["idCardBackImage"];	
		}
	
		unicomm_server.getUnicomm(data)
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
			"method":'POST',
			"url":ajaxurl + 'orderApp/updateEleWork',
			"params":{"token": $rootScope.token},
			"data":{
				"orderNo":authentication["orderNo"],
				"eleWork":arguments[0],
				"type":"000001"
			}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
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

	$scope.switchSim = function(){
		if($scope.simType.product.id === 0){
			service_type = "telSelectCBSS";
			$scope.readBtn = true;
		}else{
			service_type = "cbssSemiManufactures";
			$scope.readBtn = false;
		}
	}
	$scope.simTypeList = [
		{"id":0,"name":"白卡"},
		{"id":1,"name":"半成卡"},
	];
	$scope.simInput = {"simcard":""}
	$scope.simType = {"product":""}
	// 现场写卡
	if(orderContinue.orderCode){
		unicomm_server.cbssLogin();
		$scope.sub_productObj	= orderContinue.unicommJson.sub_productObj;
		$scope.activity			= orderContinue.unicommJson.activity;
		sub_basetradeidObj		= orderContinue.unicommJson.sub_basetradeidObj;
		submitAmount			= orderContinue.unicommJson.submitAmount;
		submitFee				= orderContinue.unicommJson.submitFee;
		sub_numberObj			= orderContinue.unicommJson.sub_numberObj
		cbss_commission = {
			"id":orderContinue.unicommJson.commsiionId
		}
		telInfo = {"tel":sub_numberObj["serialNumber"]}	
		authentication = {'orderNo':orderContinue.orderCode}
		$scope.title = "("+ telInfo["tel"] +")现场写卡"

		if(orderContinue.status == "000009"){
			$scope.TRADE_TYPE_CODE_STR	= orderContinue.unicommJson.TRADE_TYPE_CODE_STR;
			$scope.NET_TYPE_CODE_STR= orderContinue.unicommJson.NET_TYPE_CODE_STR;
			$scope.domLine = "40";
		}else{
			$scope.continueTradeReg_json = orderContinue.unicommJson.continueTradeReg_json;
			$scope.checkWoposStatusJson = orderContinue.unicommJson.checkWoposStatusJson;
			$scope.boxDisplay = [true, false];
			$scope.woPos2RegGo();
		}
	}
	else if(changeOrderInfo){
		$scope.pruductInitial();
		$scope.write();
	}
	else{
		$scope.pruductInitial();
		// 半成卡
		if(service_type == "cbssSemiManufactures"){
			$scope.simType.product = $scope.simTypeList[1];
			$scope.simInput = {"simcard":order_info["simInput"]}
			$scope.readBtn = false;
			if($scope.simInput.simcard){
				$scope.write();
			}
		}else{
			$scope.simType.product = $scope.simTypeList[0];
			$scope.readBtn = true;
			$scope.simInput = {"simcard":""}
		}
	}
	
})
