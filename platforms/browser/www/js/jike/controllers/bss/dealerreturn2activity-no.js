appControllers.controller('bss-dealerreturn-activity-tel', function($scope, $state, $http, $rootScope, my, unicomm_server) {

	$scope.title = dealerreturn2activity["productName"]+"返单";
	$scope.data = {"tel":""};
	$scope.resState = true;
	$scope.loading = false;
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
			$scope.resState = true;
			$scope.loading = true;
			unicomm_server.bssLogin().then(function(){
				$scope.querydefaultproduct();
			}, function(){
				$state.go("index");
			})
		}else{
			my.alert('您输入的手机号不是联通的号码,请重新输入!').then(function(){
				dianpu_dealerreturn['number'] = "";
			});
		}
	}


	// 获取默认套餐
	$scope.querydefaultproduct = function(){
		unicomm_server.getUnicomm({
			  "cmd":"bss_querySerQueryContentPage"
			, "number":dianpu_dealerreturn['number']
			}
		).then(function(result_json){
			if (result_json.status == '1') {
				dianpu_dealerreturn["queryServiceInfo"] = result_json.data;
				$scope.getProductList();
			} else {
				$scope.interrupt(result_json.data);
			}
		}, function() {
			$scope.interrupt();
		});
	};


	// 获取可以支持修改的套餐
	$scope.getProductList = function () {
		dianpu_dealerreturn["productCode"] = dealerreturn2activity["productCode"];
		dianpu_dealerreturn["productName"] = "18元宝宝沃卡(新)";
		$http({
			method: 'GET',
			url: ajaxurl + '/identityApp/toBssIdentity?token='+ $rootScope.token,
			params:{"number":dianpu_dealerreturn['number'], "productId":dianpu_dealerreturn["productCode"], "productName":dealerreturn2activity["productName"], "source":source}
		}).success(function(data) {
			authentication["orderNo"] = data.orderNo;
			$state.go("authentication-device");
		}).error(function(){
			$scope.interrupt("保存订单失败!");
		});
	}

	$scope.interrupt = function(){
		if(arguments[0]){
			my.alert(arguments[0]).then(function(){
				$scope.resState = false;
				$scope.loading = false;
			});
		}else{
			$scope.resState = false;
			$scope.loading = false;
		}
	}
})



// 确认
.controller('bss-dealerreturn-activity-confirm', function($scope, $state) {

	$scope.title = dealerreturn2activity["productName"]+"提交确认";

	$scope.simInput = {
		  "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":dianpu_dealerreturn["number"]
		, "productName":dealerreturn2activity["productName"]
		, "producDesc":dealerreturn2activity["producDesc"]
		//, "activityName":dealerreturn2activity["activityName"]
	};

	$scope.order = function(){
		$state.go("signature");
	}
})



// 返单成功
.controller('bss-dealerreturn-activity-submit', function($scope, $state, $http, $rootScope, $filter, unicomm_server, my) {
	
	$scope.title = "<"+dianpu_dealerreturn['number']+">业务提交";
	$scope.prompt = "";
	$scope.ReSubmitDiv = true;		// 重新提交按钮

	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";
	$scope.unicomm_command = {
		  "cmd":"bss_dealerreturn"
		, "queryServiceInfo":JSON.stringify(dianpu_dealerreturn["queryServiceInfo"])
		, "number":dianpu_dealerreturn['number']
		, "cardno":authentication['cardId']
		, "name":authentication['name']
		, "address":authentication['address']
		, "end_date":authentication['end_date']
		, "birthday":authentication['birthday']
		, "contactNumber":authentication['contractNumber']
		, "productCode":dianpu_dealerreturn['productCode']
		, "productName":dianpu_dealerreturn['productName']
		, "imageBase64":authentication['customerImagebase64']
		, "developCode":bssInfo["developCode"]
		, "uploadResponse":bss_faceCheckAndUploadPhoto_uploadResponse
	};


	$scope.login = function(){
		$scope.domEaplan = "系统登录";
		$scope.domLine = "10";
		unicomm_server.bssLogin().then(function(){
			$scope.submitDealerreturn();
		},function(data){
			$scope.interrupt(data, "BSS返单2活动-登录");
		})
	}


	$scope.submitDealerreturn = function(){
		$scope.domEaplan = "号码开卡";
		$scope.domLine = "20";
		unicomm_server.getUnicomm($scope.unicomm_command).then(function(return_json){
			if (return_json.status == '1') {
				$scope.prompt = return_json.data.tradeId;
				$scope.setTradeId();
			} else {
				$scope.interrupt(return_json.data, "BSS返单2活动-开卡", 1);
			}
		}, function(data){
			$scope.interrupt(data, "BSS返单2活动-开卡(系统)");
		})
	}


	$scope.setTradeId = function(){
		$scope.domEaplan = "保存交易编码";
		$scope.domLine = "45";
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
		$scope.domEaplan = "电子工单生成";
		$scope.domLine = "50";
		bssPdf = {
			  "cmd":"bss_number_generateNumberBillPaper"
			, "number":dianpu_dealerreturn["number"]
			, "tradeId":$scope.prompt
			, "productName":""
			, "productDesc":""
			, "packageDetail":"【产品】"+ dealerreturn2activity["productName"] +"（描述："+ dealerreturn2activity["producDesc"] +"）生效日期：" + $filter('date')(new Date(), 'yyyy-MM-dd')
			, "channelName":"西安鑫海物联网科技有限公司(电话:4000400501)"
			, "developName":bssInfo["developName"]
			, "developCode":bssInfo["developCode"]
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
				, "handCardUrl":authentication["customerImageUrl"]
				, "signPicUrl":authentication["sign"]
			}
		};
		unicomm_server.getUnicomm(bssPdf).then(function(result_json){
			if(result_json.status == "1"){
				$scope.upPdf(result_json.data)
			}else{
				$scope.saveFailed("BSS返单2活动-bss工单生成", bssPdf);
				$scope.submitActivity();
			}
		}, function(){
			$scope.saveFailed("BSS返单2活动-bss工单生成(系统)", bssPdf);
			$scope.submitActivity();
		})
	}



	$scope.upPdf = function(){
		$scope.domEaplan = "电子工单保存";
		$scope.domLine = "60";
		$http({
			method: 'POST',
			url: 'http://z.haoma.cn/tms-app-war/identityApp/updateEleWorkForNumberOrder?token='+$rootScope.token,
			data: {"orderNo":authentication["orderNo"], "eleWork":arguments[0]}
		}).success(function(){
			$scope.submitActivity()
		}).error(function(){
			$scope.submitActivity();
		});
	}




	$scope.submitActivity = function(){
		$scope.domEaplan = "号码活动提交";
		$scope.domLine = "70";
		unicomm_server.getUnicomm({
			  "cmd":"bss_flash_finishtrade"
			, "number":dianpu_dealerreturn["number"]
			, "citycode":"841"
			, "act_solution_id":dealerreturn2activity["activityCode"]
		})
		.then(function(return_json){
			if(return_json.status == "1"){
				$scope.orderOk();
			}else{
				$scope.interrupt(return_json.data, "BSS返单2活动-活动提交", 1);
			}
		}, function(data) {
			$scope.interrupt(data, "BSS返单2活动-活动提交(系统)");
		})
	}


	$scope.orderOk = function(){
		$scope.domEaplan = "订单回写确认";
		$scope.domLine = "80";
		var param  = "imsi=";
			param += "&xoption=";
			param += "&tradeFee=0";
			param += "&preCharge=0";
			param += "&tradeId="+$scope.prompt;
			param += "&ccid=";
			param += "&orderNo="+authentication["orderNo"];
			param += "&number="+dianpu_dealerreturn["number"];
			param += "&name="+ authentication["name"];
			param += "&cardid="+ authentication["cardId"];
			param += "&selectedElement="+dianpu_dealerreturn["productCode"];
		$http({
			url:ajaxurl+ "orderApp/savedirecttrade?token=" + $rootScope.token + "&" + param,
			type:"get"
		}).success(function(){
			$scope.orderToSuccess();
		}).error(function(){
			$scope.orderToSuccess();
		});
	}


	$scope.orderToSuccess = function(){
		$scope.domEaplan = "订单回写确认";
		$scope.domLine = "90";

		$http({
			  "method":"GET"
			, "url":ajaxurl+"orderApp/numberOrderToSuccess"
			, "params":{
				  "token": $rootScope.token
				, "orderNo":authentication['orderNo']
			}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$state.go("ok");
		});
	}


	$scope.reSubmit = function(){

		$scope.ReSubmitDiv = true;
		$scope.message = false;
		
		if($scope.domLine == "10"){
			$scope.login();
		}
		else if($scope.domLine == "20"){
			$scope.submitDealerreturn();
		}
		else if($scope.domLine == "45"){
			$scope.setTradeId();
		}
		else if($scope.domLine == "50"){
			$scope.bssPdf();
		}
		else if($scope.domLine == "60"){
			$scope.upPdf();
		}
		else if($scope.domLine == "70"){
			$scope.submitActivity();
		}
		else if($scope.domLine == "80"){
			$scope.orderOk();
		}
	}


	$scope.interrupt = function(){
		// 保存错误信息
		if(arguments[1] != ""){
			$scope.saveFailed(arguments[1],(arguments[3] ? arguments[3] : arguments[0]));
		}
		// 提示错误信息，重新提交
		if(arguments[2]){
			my.alert(alertInfo(arguments[0])).then(function(){
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
			data : {"orderCode":authentication["orderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1])}
		})
	}


	$scope.login();
})