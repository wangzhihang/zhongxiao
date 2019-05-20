// 返单选号码
appControllers.controller('dianpu-bss-dealerreturn', function($scope, $state, my) {
	$scope.title = sourceName + "号码";
	$scope.data = {"tel":""};
	$scope.resState = true;
	$scope.haoduan = ["185","186","155","156","130","131","132","175","176"];

	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.order = function(){
		dianpu_dealerreturn['number'] = $scope.data["tel"].replace(/[^\d]/g, "");
		if(arrayContains($scope.haoduan, dianpu_dealerreturn['number'].substring(0, 3))){
			$state.go("dianpu-bss-dealerreturn-package");
		}else{
			my.alert('您输入的手机号不是联通的号码,请重新输入!').then(function(){
				dianpu_dealerreturn['number'] = "";
			});
		}
	}
})


// 返单选套餐
.controller('dianpu-bss-dealerreturn-package', function($scope, $state, $http, $rootScope, unicomm_server, my) {

	$scope.title = sourceName + "套餐";
	$scope.data = {"packageList":[],"packagedefault":null,"packDefault":{}};
	$scope.packageList = [];

	$scope.loading = false;
	$scope.resState = true;
	$scope.loadMoreBtn = true;
	$scope.liShow = [true, true];

	$scope.txtVal = "套餐加载中";

	$scope.unicomm_command_fun = function(){
		unicomm_server.getUnicomm({"cmd":"other_logout"}).then(function(){
			unicomm_server.bssLogin($scope.bssInfo).then(function(){
				$scope.querydefaultproduct();
			}, function(){
				$state.go("index");
			})
		}, function(){
			$state.go("index");
		});
	}

	// 商务座机 临时添加
	$scope.bssInfo = bssInfo;
	if(service_type == "bssPstnReturn"){
		if(unicomm_account.pstnBssInfo && unicomm_account.pstnBssInfo.username){
			$scope.bssInfo = unicomm_account.pstnBssInfo;
			$scope.unicomm_command_fun();
		}else{
			$http({
				method:'get',
				url:ajaxurl + 'userApp/getParameterByName',
				params:{"token":$rootScope.token,"name":"pstnBssInfo"}
			}).success(function (data){
				if(data){
					return_json = JSON.parse(data)
					if(return_json[userBo.disId]){
						unicomm_account.pstnBssInfo = return_json[userBo.disId];
						$scope.bssInfo = unicomm_account.pstnBssInfo;
						$scope.unicomm_command_fun();
					}else{
						my.alert("本地区商务座机长号添加BSS工号未添加!请联系技术支持(029-86262222)！");
					}
				}else{
					my.alert("本地区商务座机长号添加BSS工号未添加!请联系技术支持(029-86262222)！");
				}
			}).error(function() {
				my.alert("获取长号添加BSS工号失败!请联系技术支持(029-86262222)！");
			});
		}
	}else{
		$scope.unicomm_command_fun()
	}


	// 获取默认套餐
	$scope.querydefaultproduct = function(){
		unicomm_server.getUnicomm({
			"cmd":"bss_querySerQueryContentPage",
			"number":dianpu_dealerreturn['number']
		}).then(function(result_json){
			if (result_json.status == '1') {

				dianpu_dealerreturn["queryServiceInfo"] = result_json.data;
				$scope.data.packagedefault = result_json.data.hiddenProductId;	// 默认套餐ID

				// 套餐列表对应
				$scope.data.packDefault = {
					"productId":dianpu_dealerreturn["queryServiceInfo"]["hiddenProductId"],
					"productName":dianpu_dealerreturn["queryServiceInfo"]["hiddenProductName"]
				};
				// 日租和郊县不用去找可更换套餐,第二期在加一个(无线固话G网套餐), "114632", "114628"
				if(["101183", "103575", "54608"].indexOf($scope.data.packagedefault) == -1){
					$scope.getProductList();
				}else{
					$scope.getReady();
				}
			} else {
				my.alert(result_json.data).then(function(){
					if(service_type == "bssPstnReturn"){
						$state.go("dianpu-pstn-dealerreturn");
					}else{
						$state.go("dianpu-bss-dealerreturn");
					}
				});
			}
		}, function() {
			$scope.querydefaultproduct();
		});
	};


	// 获取可以支持修改的套餐
	$scope.getProductList = function () {

		unicomm_server.getUnicomm({
			"cmd":"bss_queryDealerReturnProductList",
			"number":dianpu_dealerreturn['number'],
			"dealerId":$scope.bssInfo["channelCode"],
			"mainProductId":$scope.data.packagedefault
		}).then(function(result_json){
			if (result_json.status == '1') {
				// 103974: 26元A
				// 101183: 日租卡
				// 103575: 城市郊县版
				// 76916: 半年流量卡
				// 70419: 9+1上网卡
				// 106176: OCS沃4G+畅爽本地套餐36（西安） 
				// 106177: OCS沃4G+畅爽本地套餐56（西安） 
				// 111174: OCS本地畅爽流量王26元（陕西） 
				// 94392: OCS4G流量咖46元档产品（西安）
				var weed = ["-1", "103974", "101183", "103575", "76916", "70419", "106176", "106177", "111174", "94392"];
				var dataId = [];
				for(var i=0,j=result_json.data.length;i<j;i++){

					if(result_json.data[i]["productId"] != $scope.data.packagedefault){		// 默认剔除
						if(!arrayContains(dataId, result_json.data[i]["productId"]) ){		// 重复的剔除
							if(!arrayContains(weed, result_json.data[i]["productId"]) ){	// 没佣金的剔除
								dataId.push(result_json.data[i]["productId"]);
								$scope.packageList.push(result_json.data[i]);
							}
						}
					}
				}

				if(result_json.data.length){
					$scope.loadMoreBtn = false;
				}
			}
			$scope.getReady();
		}, function(){
			$scope.getProductList();
		});
	}



	// 显示所有套餐
	$scope.loadMore = function(){
		$scope.liShow[1] = false;
		$scope.loadMoreBtn = true;
	}

	$scope.getReady = function(){
		$scope.loading = true;
		$scope.resState = false;
		$scope.liShow[0] = false;
		$scope.txtVal = "确认套餐";
	}


	// 保存套餐
	$scope.order = function(){

		if($scope.data.packagedefault == dianpu_dealerreturn["queryServiceInfo"]["hiddenProductId"]){
			dianpu_dealerreturn["productCode"] = dianpu_dealerreturn["queryServiceInfo"]["hiddenProductId"];
			dianpu_dealerreturn["productName"] = dianpu_dealerreturn["queryServiceInfo"]["hiddenProductName"];
		}else{
			for(var i in $scope.packageList){
				if($scope.data.packagedefault == $scope.packageList[i]["productId"]){
					dianpu_dealerreturn["productCode"] = $scope.packageList[i]["productId"];	// 套餐的productId
					dianpu_dealerreturn["productName"] = $scope.packageList[i]["productName"];	// 套餐名称
				}
			}
		}

		if(dianpu_dealerreturn["productName"] == "106176"){
			my.alert("OCS沃4G+畅爽本地套餐36（西安）套餐已升级，请选择：OCS沃4G+畅爽本地套餐36（西安）新");
			return ;
		}
		if(dianpu_dealerreturn["productName"] == "106177"){
			my.alert("OCS沃4G+畅爽本地套餐56（西安）套餐已升级，请选择：OCS沃4G+畅爽本地套餐56（西安）新");
			return ;
		}

		order_info = {
			"number":dianpu_dealerreturn['number'],
			"productId":dianpu_dealerreturn["productCode"],
			"productName":dianpu_dealerreturn["productName"]
		}
		$state.go("authentication-device");
	}
})



// 确认
.controller('dianpu-bss-dealerreturn-confirm', function($scope, $state) {

	$scope.title = "商务座机(长号)提交确认";

	$scope.simInput = {
		"name":authentication["name"],
		"cardId":authentication["cardId"],
		"number":dianpu_dealerreturn["number"],
		"productName":dianpu_dealerreturn["productName"]
	};

	$scope.order = function(){
		$state.go("signature");
	}
})



// 返单成功
.controller('dianpu-bss-dealerreturn-submit', function($scope, $state, $http, $rootScope, $timeout, unicomm_server, my) {

	$scope.title = dianpu_dealerreturn['number'];
	$scope.prompt = "";
	$scope.ReSubmitDiv = true;		// 重新提交按钮

	// 商务座机 临时添加

	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";

	var implement = true;

	$scope.login = function(){
		$scope.domEaplan = "系统登录";
		$scope.domLine = "5";
		$scope.bssInfo = bssInfo;
		if(service_type == "bssPstnReturn"){
			// 不用王群的bss做的商务座机
			var noWqpstnBssInfo = [
				"141690726",
				"163120104",	// 西安联通高新知惠通讯专营店
				"142390765"		// 西安联通高新博惠通讯专营店
			]
			if(noWqpstnBssInfo.indexOf(bssInfo.username) !== -1){
				$scope.bssInfo = bssInfo;
				$scope.login_bss();
			}
			else if(unicomm_account.pstnBssInfo && unicomm_account.pstnBssInfo.username){
				$scope.bssInfo = unicomm_account.pstnBssInfo;
				$scope.login_bss();
			}else{
				$http({
					method:'get',
					url:ajaxurl + 'userApp/getParameterByName',
					params:{"token":$rootScope.token,"name":"pstnBssInfo"}
				}).success(function (data){
					if(data){
						return_json = JSON.parse(data)
						if(return_json[userBo.disId]){
							unicomm_account.pstnBssInfo = return_json[userBo.disId];
							$scope.bssInfo = unicomm_account.pstnBssInfo;
							$scope.login_bss();
						}else{
							my.alert("本地区商务座机长号添加BSS工号未添加!请联系技术支持(029-86262222)！");
						}
					}else{
						my.alert("本地区商务座机长号添加BSS工号未添加!请联系技术支持(029-86262222)！");
					}
				}).error(function() {
					my.alert("获取长号添加BSS工号失败!请联系技术支持(029-86262222)！");
				});
			}
		}else{
			$scope.login_bss()
		}
	}

	$scope.login_bss = function(){
		$scope.domEaplan = "系统登录";
		$scope.domLine = "10";

		$scope.unicomm_command = {
			"cmd":"bss_pstn_submitNumberInfo",
			"customerName":authentication['name'],
			"psptid":authentication['cardId'],
			"nation":authentication['nation'],
			"police":authentication['police'],
			"startdate":authentication['start_date'],
			"enddate":authentication['end_date'],
			"birthday":authentication['birthday'],
			"addressinfo":authentication['address'],
			"contactName":authentication['name'],
			"contactNumber":authentication['contractNumber'],

			"serialNumber":dianpu_dealerreturn['number'],
			"cardbase64":authentication["idHeadImg"].substring(23),
			"developCode":$scope.bssInfo["developCode"],
			"payMoney":"0",
			"uploadResponse":bss_faceCheckAndUploadPhoto_uploadResponse
		};
		unicomm_server.bssLogin($scope.bssInfo).then(function(){
			if(implement){
				implement = false;
				$scope.submitDealerreturn();
			}
		},function(data){
			$scope.interrupt({
					"saveName":"BSS返单-登录"
				, "saveText":data
			});
		})
	}


	$scope.submitDealerreturn = function(){
		$scope.domEaplan = "号码开卡";
		$scope.domLine = "20";

		unicomm_server.getUnicomm($scope.unicomm_command).then(function(return_json){
			if(!$scope.prompt){
				if (return_json.status == '1') {
					$scope.prompt = return_json.data && return_json.data.tradeId;
					$scope.bss_pstn_submitNumberFeeInfo();
				} else {
					$scope.bss_order_queryOrderInfo({"text":return_json.data});
				}
			}
		}, function(data){
			$scope.interrupt({
				"saveName":"BSS返单-开卡(系统)",
				"saveText":data
			});
		})
	}




	$scope.bss_order_queryOrderInfo = function(){
		var msg = arguments[0];
		unicomm_server.getUnicomm({"cmd":"bss_order_queryOrderInfo","serialNumber":dianpu_dealerreturn['number'],"tradeflag":"2"}).then(
			function(return_json){
				if(!$scope.prompt){
					if (return_json.status == '1' &&
						return_json.data.acceptPerson == $scope.bssInfo.username &&
						return_json.data.remark == "竣工"
						){
						$scope.prompt = return_json.data.registerNumber;
						$scope.bss_pstn_submitNumberFeeInfo();
					}else{
						$scope.interrupt({
							"popup":true,
							"text":"生成订单失败，原因："+msg["text"],
							"saveName":"BSS返单-开卡"
						});
					}
				}
			}, function(data){
				$scope.interrupt({
					"saveName":"BSS开卡-订单生成-bss_order_queryOrderInfo(系统)",
					"saveText":data
				});
			}
		)
	}


	$scope.bss_pstn_submitNumberFeeInfo = function(){
		$scope.domEaplan = "号码充值";
		$scope.domLine = "30";

		unicomm_server.getUnicomm({
			"cmd":"bss_pstn_submitNumberFeeInfo",
			"serialName":dianpu_dealerreturn['number']
		}).then(
			function(return_json){
				if (return_json.status == '1' || return_json.data.indexOf("受理已清费") >= 0){
					$http({
						"method":'GET',
						"url":ajaxurl + 'orderApp/hasPaidStatusToSuccess',
						"params":{
								"token": $rootScope.token,
								"orderNo":authentication["orderNo"]
							}
					}).success(function(){
						$scope.setTradeId();
					}).error(function(){
						$scope.setTradeId();
					});
				}else{
					$scope.setTradeId();
				}
			},function(data){
				$scope.setTradeId();
			}
		)
	}

	$scope.setTradeId = function(){
		$scope.domEaplan = "保存交易编码";
		$scope.domLine = "45";
		$http({
			"method":'GET',
			"url":ajaxurl + 'orderApp/setTradeId',
			"params":{
					"token": $rootScope.token,
					"orderNo":authentication["orderNo"],
					"tradeId":$scope.prompt
				}
		}).success(function(){
			$scope.orderOk();
		}).error(function(){
			$scope.orderOk();
		});
	}

	$scope.orderOk = function(){
		$scope.domEaplan = "订单回写确认";
		$scope.domLine = "80";
		$http({
			"method":"GET",
			"url":ajaxurl+ "orderApp/savedirecttrade",
			"params":{
				"token": $rootScope.token,
				"orderNo": authentication['orderNo'],
				"imsi": "",
				"xoption": "",
				"ccid": "",
				"tradeFee": "0",
				"preCharge": "0",
				"tradeId": $scope.prompt,
				"number": dianpu_dealerreturn["number"],
				"name": authentication['name'],
				"cardid": authentication["cardId"],
				"selectedElement": dianpu_dealerreturn["productCode"],
				"type":"000001"
			}
		}).success(function(){
			$scope.orderOkreturn();
		}).error(function(){
			$scope.orderOkreturn();
		});
	}


	$scope.orderOkreturn = function(){
		if(service_type == "bssPstnReturn"){
			$scope.domEaplan = "新装号码成功!";
			$scope.domLine = "95";
			$http({
				"method":"GET",
				"url":ajaxurl+ "telOrderApp/updateStatusToNumberSuccess",
				"params":{
					"token": $rootScope.token,
					"orderNo": authentication['telOrderNo']
				}
			});
			unicomm_server.getUnicomm({"cmd":"other_logout"}).then(function(){
				my.alert("手机号码新装成功，点击确认进入座机绑定").then(function(){
					$state.go(jump[service_type]["pstn"]);
				});
			});
		}else{
			$state.go("ok");
		}
	}

	$scope.reSubmit = function(){
		if($scope.domLine == "1"){
		}
		else if($scope.domLine == "10"){
			$scope.login()
		}
		else if($scope.domLine == "20"){
			$scope.submitDealerreturn()
		}
		else if($scope.domLine == "45"){
			$scope.setTradeId()
		}
		else if($scope.domLine == "50"){
			$scope.bssPdf()
		}
		else if($scope.domLine == "80"){
			$scope.orderOk()
		}
		else if($scope.domLine == "95"){
			$scope.orderOkreturn()
		}
		$scope.message = false;
		$scope.ReSubmitDiv = true;
	}


	// 重新提交显示
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		if(msg["popup"]){
			my.alert(alertInfo(msg["text"])).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}

		if($scope.domLine >= 20){
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

	// 防止重复提交
	$timeout(function () {
		if(implement){
			$scope.login();
		}
	}, 2 * 1000);
})