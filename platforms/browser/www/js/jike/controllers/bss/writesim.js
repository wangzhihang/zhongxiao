appControllers.controller('school-writesim', function($scope, $state, my) {

	$scope.title = "订单确认";

		$scope.simInput = {
		  "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "productName":school["productname"]
		, "schoolName":school["groupname"]
		, "payMoney":""
	}


	$scope.order = function(){
		if($scope.simInput.payMoney === ""){
			my.alert("请输入预存金额!")
		}else{
			submitFee = $scope.simInput.payMoney;
			if(authentication["sign"]){
				$state.go("school-writesim-submit");
			}else{
				$state.go("signature");
			}
		}
	}
})


.controller('school-writesim-submit', function($scope, $rootScope, $http, $state, $ionicActionSheet, $filter, unicomm_server, ble, my) {

	$scope.title = telInfo["tel"];
	$scope.boxDisplay = [false, true];
	$scope.btnDisplay = [false, false];
	$scope.btnActive = 	[false, false];
	$scope.ReSubmitDiv = true;

	$scope.prompt = "";


	// 写卡步骤初始
	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";


	$scope.simInput = {
		  "simcard":""
		, "name":authentication["name"]
		, "cardId":authentication["cardId"]
		, "number":telInfo["tel"]
		, "productName":school["productname"]
		, "schoolName":school["groupname"]
		, "payMoney":String(Number(submitFee))
	}


	$scope.reSubmit = function(){
		if($scope.domLine == "1"){
			$scope.BSSUser();
		}
		else if($scope.domLine == "10"){
			$scope.bss_validNumber()
		}
		else if($scope.domLine == "20"){
			$scope.bss_grouplan_groupsubmit()
		}
		else if($scope.domLine == "30"){
			$scope.bss_grouplan_submit()
		}
		else if($scope.domLine == "50"){
			$scope.bssPdf()
		}
		else if($scope.domLine == "60"){
			$scope.submitsim()
		}
		else if($scope.domLine == "70"){
			$scope.bss_payfee()
		}
		else if($scope.domLine == "80"){
			$scope.writesim()
		}
		else if($scope.domLine == "90"){
			$scope.orderOk()
		}
		else if($scope.domLine == "95"){
			$scope.orderToSuccess()
		}
		$scope.boxDisplay = [true, false];
		$scope.ReSubmitDiv = true;
		$scope.message = false;
	}


	$scope.write=function(){
		if($scope.simInput.simcard.length >= 19 && $scope.simInput.payMoney != ""){
			$scope.boxDisplay = [true, false];
			if($scope.domLine == "60"){
				$scope.submitsim();
			}else{
				$scope.BSSUser();
			}
		}else{
			my.alert('请插入SIM卡，并读取成功。并且输入预存金额!');
		}
	}


	$scope.BSSUser = function() {

		unicomm_server.bssLogin().then(function(){
			$scope.bss_validNumber()
		},function(){
			$scope.interrupt("");
		})
	}


		// 号码预占
	$scope.bss_validNumber = function() {

		$scope.domEaplan = "号码预占";
		$scope.domLine = "10";

		unicomm_server.getUnicomm({
			  "cmd":"bss_number_insert_pre_select"
			, "number":telInfo["tel"]
			, "payfee":telInfo["preCharge"]
		}).then(function(return_json){
			if(return_json.status == "1"){
				$scope.bss_grouplan_groupsubmit();
			}else{
				$scope.interrupt(return_json.data);
			}
		})
	}


	$scope.bss_grouplan_groupsubmit = function(){

		$scope.domEaplan = "生成订单-生成ID";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			  "cmd":"bss_schoollan_groupsubmit"
			, "lanaccount":telInfo["tel"]
			, "groupId":school["groupid"]
			, "groupName":school["groupname"]
			, "userRole":"0"
		}).then(function(return_json){
			if(return_json.status == "1"){
				school["groupSubmitId"] = return_json.data;
				$scope.bss_grouplan_submit();
			}else{
				$scope.interrupt(return_json.data);
			}
		})
	}



	$scope.bss_grouplan_submit = function(){

		$scope.domEaplan = "生成订单-预写入";
		$scope.domLine = "30";

		var unicomm_command = {
			  "cmd": 			"bss_grouplan_submit"
			, "lanaccount": 	telInfo["tel"]
			, "productCode": 	school["productid"]
			, "ifOcs": 			(school["productname"].indexOf("OCS") == "-1" ? "0" : "1") 	// 是否OCS产品
			, "ifwhite": 		"1" 	// 是否白卡
			, "payMoney": 		$scope.simInput.payMoney 	//储值金额

			, "imageBase64": 	authentication["customerImagebase64"]
			, "cardBase64": 	authentication["idHeadImg"].substring(23)
			, "psptid": 		authentication["cardId"]
			, "customerName": 	authentication["name"]
			, "startdate": 		authentication["start_date"]
			, "enddate": 		authentication["end_date"]
			, "addressinfo": 	authentication["address"]
			, "gender": 		authentication["gender"]
			, "nation": 		authentication["nation"]
			, "birthday": 		authentication["birthday"]
			, "police": 		authentication["police"]
			, "contactName": 	authentication["name"]
			, "contactNumber": 	authentication["contractNumber"]


			, "groupId": 		school["groupid"] 			// 组织id getGroupList返回值的value
			, "groupSubmitId": 	school["groupSubmitId"] 	// groupsubmit返回的data值
			, "groupkeyword": 	school["groupname"] 		// 查询关键字 和上面getGroupList保持一致
			, "areaTownId": 	school["areaTownId"]
			, "areaTownName": 	school["areaTownName"]

			, "dealerkeyword": 	bssInfo["channelName"]
			, "dealerName": 	bssInfo["channelName"]

			, "dealerCode": 	bssInfo["dealer"]
			, "dealerUserCode": bssInfo["developCode"]
			, "uploadResponse":bss_faceCheckAndUploadPhoto_uploadResponse
		}

		if(service_type == "groupBssEnterprise"){
			unicomm_command.ifvia = "1"
			unicomm_command.inheritInfo = bss_enterpriseInfo;
		}else {
			unicomm_command.ifvia = "0";
		}

		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.prompt = return_json.data.tradeId;
					$scope.setTradeId();
				}else{
					$scope.interrupt(return_json.data);
				}
			},
			function(){
				$scope.interrupt();
			}
		)
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
		$scope.domEaplan = "生成电子工单";
		$scope.domLine = "50";
		$http({
			  method:'get'
			, url:ajaxurl + 'numbercontract/queryContractInfo'
			, params:{"token":$rootScope.token,"contractId":school["productid"]}
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
				, "channelName":bssInfo["channelName"]
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
					, "idCardImageUrl":""
					, "signPicUrl":""
					, "handCardUrl":""
				}
			};
			unicomm_server.getUnicomm(bssPdf).then(function(result_json){
				if(result_json.status == "1"){
					$scope.upPdf(result_json.data)
				}else{
					$scope.submitsim();
				}
			}, function(){
				$scope.submitsim();
			})
		}).error(function() {
			$scope.submitsim();
		});
	}



	$scope.upPdf = function(){
		$scope.domEaplan = "保存电子工单";
		$scope.domLine = "50";
		$http({
			  "method":'POST'
			, "url":ajaxurl + 'identityApp/updateEleWorkForNumberOrder'
			, "params":{"token": $rootScope.token}
			, "data":{"orderNo":authentication["orderNo"],"eleWork":arguments[0]}
		}).success(function(){
			$scope.submitsim();
		}).error(function(){
			$scope.submitsim();
		});
	}



	$scope.imsi = "";
	$scope.xoption = "";
	$scope.submitsim = function(){

		$scope.domEaplan = "SIM卡校验";
		$scope.domLine = "60";

		var unicomm_command = new Object();
		unicomm_command.cmd = "bss_writesim_for_product_new";
		unicomm_command.iccid = swap2str($scope.simInput.simcard);
		unicomm_command.number = telInfo['tel'];
		unicomm_command.promptid = $scope.prompt;
		unicomm_command.simtype= "0";
		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.imsi = return_json.data.imsi;
					$scope.xoption = return_json.data.xoption;
					$scope.writesim();
				}else{
					my.alert(return_json.data).then(function(){
						$scope.simInput.simcard = "";
						$scope.boxDisplay[false, true];
						$scope.simcardInput();
					});
				}
			},
			function(){
				$scope.interrupt("");
			}
		)
	}


	$scope.writesim = function() {
		$scope.domEaplan = "写入SIM卡";
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
				$scope.bss_payfee();
			}).error(function(){
				$scope.bss_payfee();
			});
		}, function(data){
			$scope.interrupt(data);
		})
	}


	$scope.bss_payfee = function(){

		$scope.domEaplan = "订单缴费";
		$scope.domLine = "80";

		unicomm_server.getUnicomm({
			  "cmd":"bss_payfee"
			, "lanaccount":$scope.prompt
		}).then(function(return_json){
			if(return_json.status == "1" || return_json.data.indexOf("受理已清费") >= 0){
				$http({
					  "method":'GET'
					, "url":ajaxurl + 'orderApp/hasPaidStatusToSuccess'
					, "params":{
							  "token": $rootScope.token
							, "orderNo":authentication["orderNo"]
						}
				}).success(function(){
					$scope.orderOk();;
				}).error(function(){
					$scope.orderOk();;
				});
			}else{
				$scope.interrupt(return_json.data);
			}
		},function(){
			$scope.interrupt("");
		})
	}


	$scope.orderOk = function() {

		$scope.domEaplan = "订单回写";
		$scope.domLine = "90";


		var param  = "imsi="+$scope.imsi;
			param += "&xoption="+$scope.xoption;
			param += "&tradeFee="+$scope.simInput.payMoney;
			param += "&preCharge="+$scope.simInput.payMoney;
			param += "&tradeId="+$scope.prompt;
			param += "&ccid="+$scope.simInput.simcard;
			param += "&orderNo="+authentication["orderNo"];
			param += "&number="+telInfo['tel'];
			param += "&name="+ authentication["name"];
			param += "&cardid="+ authentication["cardId"];
			param += "&selectedElement="+school["groupid"];
		$http({
			url:ajaxurl+ "orderApp/savedirecttrade?token=" + $rootScope.token + "&" + param,
			type:"get"
		}).then(function(){
			$scope.orderToSuccess();
		}, function(){
			$scope.orderToSuccess();
		});
	}


	$scope.orderToSuccess = function(){

		$scope.domEaplan = "订单确认";
		$scope.domLine = "95";

		var param  = "&orderNo="+authentication['orderNo'];
		$http({
			url : ajaxurl+ "orderApp/numberOrderToSuccess?token=" + $rootScope.token + "&" + param,
			method : "GET"
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
				})

			}, function(){
				my.alert('蓝牙解码服务器不可以,请将手机连接到网络上!');
			})
		}
	}


	$scope.readImsi = function(){
		if(!$scope.btnActive[0]){
			$scope.btnActive[0] = true;
			ble.BLEreadSim().then(function(data){
				$scope.simInput.simcard = data;
				if($scope.simInput.simcard.length >= 19){
					$scope.simcardInput();
				}else{
					my.alert("读取卡号不完整,请将SIM卡插紧。重新读取一次。").then(function(){
						$scope.btnActive[0] = false;
					})
				}
			},
			function(data){
				my.alert(data);
			});
		}
	}


	$scope.simcardInput = function(){
		$scope.btnDisplay = $scope.simInput.simcard.length >= 19 ? [true, false] : [false, true];
		$scope.btnActive =  [false, false];	// 按钮选中控制
	}


	// 重新提交显示
	$scope.interrupt = function(){
		if(arguments[0]){
			my.alert(arguments[0]).then(function(){
				$scope.ReSubmitDiv = false;
			});
		}else{
			$scope.ReSubmitDiv = false;
		}

		if($scope.domLine >= 30){
			$scope.message = true;
		}
	}
})
