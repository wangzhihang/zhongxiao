// 返单选号码
appControllers.controller('dianpu-cbss-dealerreturn', function($scope, $state, my) {
	$scope.title = "CBSS成卡返单";
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
			order_info = {
				"number":dianpu_dealerreturn['number'],
				"productId":"",
				"productName":""
			}
			$state.go("authentication-device");
		}else{
			my.alert('您输入的手机号不是联通的号码,请重新输入!').then(function(){
				dianpu_dealerreturn['number'] = "";
			});
		}
	}
})


// 确认
.controller('dianpu-cbss-dealerreturn-confirm', function($scope, $state) {

	$scope.title = "CBSS成卡提交确认";

	$scope.simInput = {
		"name":authentication["name"],
		"cardId":authentication["cardId"],
		"number":dianpu_dealerreturn["number"],
		"address":authentication["address"]
	};

	$scope.order = function(){
		$state.go("signature");
	}
})


// 返单成功
.controller('dianpu-cbss-dealerreturn-submit', function($scope, $state, $http, $rootScope, $timeout, unicomm_server, my) {

	$scope.title = dianpu_dealerreturn['number'];
	$scope.ReSubmitDiv = true;		// 重新提交按钮

	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";

	var implement = true;
	$scope.login = function(){
		$scope.domEaplan = "系统登录";
		$scope.domLine = "10";

		unicomm_server.cbssLogin().then(function(){
			if(implement){
				implement = false;
				$scope.CBSSUser();
			}
		},function(data){
			$scope.interrupt({
				"saveName":"CBSS返单-登录",
				"saveText":data
			});
		})
	}

	$scope.CBSSUser = function() {
		$scope.domEaplan = "身份验证";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],		// 真实身份证号码
			"cust_name":authentication['name']
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.submitDealerreturn();
				}else {
					var message = result_json.data.message ? result_json.data.message : result_json.data
					if(message == "无此客户信息，请创建客户！"){
						$scope.createcustomer();
					}else{
						$scope.interrupt({
							"popup":true,
							"saveName":"CBSS开卡-联通用户确认",
							"text":message
						});
					}
				}
			},
			function(data){
				$scope.interrupt({
					"popup":true,
					"saveName":"CBSS开卡-获取联通用户(系统)",
					"text":data
				});
			}
		);
	}


	$scope.createcustomer = function(){
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
					$scope.submitDealerreturn();
				}else{
					$scope.interrupt({
						"popup":true,
						"text":"联通开户失败，失败原因："+result_json.data,
						"saveName":"CBSS开卡-联通开户"
					});
				}
			}
			, function(data){
				$scope.interrupt({
					"popup":true,
					"saveName":"CBSS开卡-联通开户(系统)",
					"text":data
				});
			})
	}


	$scope.submitDealerreturn = function(){
		$scope.domEaplan = "号码开卡";
		$scope.domLine = "30";
		var unicomm_command = {
			"cmd":"cbss_order_dealReturn",
			"serialNumber":dianpu_dealerreturn['number'],
			"custName":authentication['name'],
			"cardId":authentication['cardId'],
			"address":authentication['address'],
			"startDate":authentication['start_date'],
			"endDate":authentication['end_date'],
			"birthday":authentication['birthday'],
			"nation":authentication['nation'],
			"police":authentication['police'],
			"sex":(authentication['gender'] == "男" ? "0" : "1")	,
			"headImageBase64":authentication["idHeadImg"],
			"imagePath":authentication["customerImageUrl"],
			"contractName":authentication['name'],
			"contractNumber":authentication["contractNumber"]
		};
		unicomm_server.getUnicomm(unicomm_command).then(function(return_json){
			if (return_json.status == '1') {
				$scope.cbssPdf();
			} else {
				$scope.interrupt({
					"popup":true,
					"text":return_json.data,
					"saveName":"CBSS返单-开卡"
				});
			}
		}, function(data){
			$scope.interrupt({
				"saveName":"CBSS返单-开卡(系统)",
				"saveText":data
			});
		});
	}


	$scope.cbssPdf = function(){
		$scope.domEaplan = "电子工单生成中";
		$scope.domLine = "50";
		var pdf = {
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
			"number":String(dianpu_dealerreturn['number'])
		}
		unicomm_server.getUnicomm(pdf).then(function(result_json){
			if(result_json.status == "1"){
				$scope.upPdf(result_json.data)
			}else{
				$scope.saveFailed("CBSS返单-工单生成", pdf);
				$scope.orderOk();
			}
		}, function(){
			$scope.saveFailed("CBSS返单-工单生成(系统)", pdf);
			$scope.orderOk();
		})
	}




	$scope.upPdf = function(){
		$scope.domEaplan = "电子工单保存";
		$scope.domLine = "60";
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
				"tradeId": "",
				"number": dianpu_dealerreturn["number"],
				"name": authentication['name'],
				"cardid": authentication["cardId"],
				"selectedElement": "",
				"type": order_type2id[order_type]
			}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$state.go("ok");
		});
	}


	// $scope.orderToSuccess = function(){
	// 	$scope.domEaplan = "订单确认";
	// 	$scope.domLine = "90";
	// 	$http({
	// 		  "method":"GET"
	// 		, "url":ajaxurl+"orderApp/numberOrderToSuccess"
	// 		, "params":{
	// 			  "token": $rootScope.token
	// 			, "orderNo":authentication['orderNo']
	// 		}
	// 	}).success(function(){
	// 		$state.go("ok");
	// 	}).error(function(){
	// 		$state.go("ok");
	// 	});
	// }

	$scope.reSubmit = function(){
		if($scope.domLine == "1"){
		}
		else if($scope.domLine == "10"){
			$scope.login()
		}
		else if($scope.domLine == "20"){
			$scope.CBSSUser()
		}
		else if($scope.domLine == "30"){
			$scope.submitDealerreturn()
		}
		else if($scope.domLine == "50"){
			$scope.cbssPdf()
		}
		else if($scope.domLine == "60") {
			$scope.upPdf()
		}
		else if($scope.domLine == "80"){
			$scope.orderOk()
		}
		else if($scope.domLine == "90"){
			$scope.orderToSuccess()
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
