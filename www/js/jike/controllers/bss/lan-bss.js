

// 固带移卡
appControllers.controller('group-lan-bss-getLanaccount', function($scope, $state, unicomm_server) {
	$scope.title = "业务号码";
	$scope.data = {"tel":""};
	$scope.loading = true;
	$scope.resState = true;
	
	//输入手机号码
	$scope.telChange = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	//下一步
	$scope.order = function(){
		$scope.resState = true;
		groupLanBss["lanaccount"] = $scope.data["tel"].replace(/[^\d]/g, "");
		$state.go('group-lan-bss-getProductList');
	}
})



.controller('group-lan-bss-getProductList', function($scope, $state, unicomm_server) {
	$scope.title = "产品列表";	

	// 从选号通道过来 对接一下
	if(service_type == "groupLanBssSelectNumber"){
		groupLanBss["lanaccount"] = telInfo['tel'];
	}

	$scope.productList = [
		  {"code":"100257", "name":"固带移(专用59元)"}
		, {"code":"100258", "name":"固带移(专用39元)"}
		// , {"code":"104368", "name":"关爱快递专属卡(新)"}
		// , {"code":"104608", "name":"18元宝宝沃卡(新)"}
		// , {"code":"104609", "name":"28元宝宝沃卡(新)"}
	];
	
	$scope.order = function(i){
		groupLanBss["productCode"] = $scope.productList[i].code;
		groupLanBss["productName"] = $scope.productList[i].name;
		$state.go('group-lan-bss-getGroupList');
	}
})



.controller('group-lan-bss-getGroupList', function($scope, $state,  my, unicomm_server) {
	$scope.title = "机构关键词";
	$scope.input = {"groupkeyword":""};
	$scope.groupList = [];
	//输入关键词
	$scope.loading = true;
	$scope.resState = false;
	$scope.list = true;

	$scope.getList = function(){
		if($scope.input.groupkeyword == ""){
			my.alert("请输入关键字！")
			.then(function(){
				$scope.loading = true;
				$scope.list = true;
				$scope.resState = false;
			});
		}else{
			$scope.loading = false;
			$scope.resState = true;
			$scope.historyLi = true;
			$scope.list = true;
			unicomm_server.bssLogin().then(function(){
				unicomm_server.getUnicomm({
					  "cmd":"bss_grouplan_getGroupList"
					, "groupkeyword":$scope.input.groupkeyword
				}).then(function(return_json){
					if(return_json.status == "1"){
						return_json.data.shift();
						$scope.groupList = return_json.data;
						$scope.loading = true;
						$scope.list = false;
						$scope.resState = false;
						if($scope.groupList.length){
							$scope.areaHistory();
						}else{
							my.alert("未找到相关机构，请修改关键字，重新查找！")
						}
					}else{
						my.alert("未找到相关机构，请修改关键字，重新查找！")
						.then(function(){
							$scope.loading = true;
							$scope.resState = false;
							$scope.list = true;
						});
					}
				})

			})
		}
	}


	$scope.order = function(i){
		groupLanBss["groupId"] = $scope.groupList[i].value;
		groupLanBss["groupName"] = $scope.groupList[i].name;
		groupLanBss["groupkeyword"] = $scope.input.groupkeyword;
		//$state.go("authentication-device");
		$state.go("group-lan-bss-getDealerList");
	}


	// 历史记录

	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_lan_group_list"));
		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
			$scope.historyTips = false;
		}else{
			$scope.historyTips = true;
		}
	}
	$scope.showHistory();	//显示搜索历史记录


	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.input.groupkeyword = row.key;
			$scope.getList();
		}else{
			$scope.clearHistory(row.key);
		}
	}
	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("bss_lan_group_list");
		var areaJson = {"key":$scope.input.groupkeyword};
		if(areaHistory == null){
			localStorage.setItem("bss_lan_group_list",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.input.groupkeyword);
			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_lan_group_list"));
			localStorage.setItem("bss_lan_group_list",JSON.stringify([areaJson].concat(areaHistoryJson)))
		}
	}
	// 清除历史记录
	$scope.clearHistory = function(){
		var key  = arguments[0];
		if(key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("bss_lan_group_list"));
			for(var i in areaHistory){
				if(areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("bss_lan_group_list",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('bss_lan_group_list');
		}
		$scope.showHistory();
	}
	$scope.editHistoryText = "编辑";
	$scope.editHistoryBtn = true;
	$scope.editHistory = function(){
		if($scope.editHistoryText == "编辑"){
			$scope.editHistoryText = "完成";
			$scope.editHistoryBtn = false;
		}else{
			$scope.editHistoryText = "编辑";
			$scope.editHistoryBtn = true;
		}
	}
})





.controller('group-lan-bss-getDealerList', function($scope, $state, $http, $rootScope, $ionicLoading, my, unicomm_server) {
	$scope.title = "渠道关键词";
	$scope.input = {"delearkeyword":""};
	$scope.dealerList = [];
	//输入关键词
	$scope.loading = true;
	$scope.resState = false;
	$scope.list = true;

	$scope.getList = function(){
		if($scope.input.groupkeyword == ""){
			my.alert("请输入关键字！")
			.then(function(){
				$scope.loading = true;
				$scope.list = true;
				$scope.resState = false;
			});
		}else{
			$scope.loading = false;
			$scope.resState = true;
			$scope.historyLi = true;
			$scope.list = true;
			unicomm_server.bssLogin().then(function(){
				unicomm_server.getUnicomm({
					  "cmd":"bss_grouplan_getDealerList"
					, "delearkeyword":$scope.input.delearkeyword
				}).then(function(return_json){
					if(return_json.status == "1"){
						return_json.data.shift();
						$scope.dealerList = return_json.data;
						$scope.loading = true;
						$scope.resState = false;
						$scope.list = false;
						if($scope.dealerList.length){
							$scope.areaHistory();
						}else{
							my.alert("未找到相关渠道，请修改关键字，重新查找！")
						}
					}else{
						my.alert("未找到相关渠道，请修改关键字，重新查找！")
						.then(function(){
							$scope.loading = true;
							$scope.resState = false;
							$scope.list = true;
						});

					}
				})

			})
		}
	}


	$scope.getUserList = function(i){
		groupLanBss["dealerCode"] = $scope.dealerList[i].value;
		groupLanBss["dealerName"] = $scope.dealerList[i].name;
		groupLanBss["dealerkeyword"] = $scope.input.delearkeyword;
//		$state.go("group-lan-bss-getDealerUserList");
		for(var ii=0;ii<$scope.dealerList.length;ii++){
			if(ii == i){
				$scope.dealerList[ii].selected = false;
			}else{
				$scope.dealerList[ii].selected = true;
			}
		}

		$scope.userList = [];
		$ionicLoading.show({template: '获取发展人'});
		unicomm_server.getUnicomm({
			  "cmd":"bss_grouplan_getDealerUserList"
			, "delearCode":groupLanBss["dealerCode"]
		}).then(function(return_json){
			console.log(JSON.stringify(return_json));
			if(return_json.status == "1"){
				return_json.data.shift();
				$scope.userList = return_json.data;
				$scope.list = false;
				$ionicLoading.hide();
			}else{
				my.alert("未找到相关渠道，请修改关键字，重新查找！")
				.then(function(){
					$scope.list = false;
					$ionicLoading.hide();
				});
			}
		})
	}


	$scope.order = function(i){
		groupLanBss["dealerUserCode"] = $scope.userList[i].value;
		$http({
			method: 'GET',
			url: ajaxurl + '/identityApp/toBssIdentity?token='+ $rootScope.token,
			params:{"number":groupLanBss["lanaccount"], "productId":groupLanBss["productCode"], "productName":groupLanBss["productName"], "source":source}
		}).success(function(data) {
			authentication["orderNo"] = data.orderNo;
		}).error(function(){
			my.alert("保存订单失败!")
		});
		$state.go('authentication-device');
	}


	// 历史记录
	$scope.showHistory = function(){
		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_lan_delear_list"));
		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
			$scope.historyTips = false;
		}else{
			$scope.historyTips = true;
		}
	}
	$scope.showHistory();	//显示搜索历史记录


	// 从历史记录里选择文件连接 或 删除
	$scope.queryHistory = function(row){
		if($scope.editHistoryBtn){
			$scope.input.delearkeyword = row.key;
			$scope.getList();
		}else{
			$scope.clearHistory(row.key);
		}
	}
	// 添加搜索历史
	$scope.areaHistory = function(){
		var areaHistory = localStorage.getItem("bss_lan_delear_list");
		var areaJson = {"key":$scope.input.delearkeyword};
		if(areaHistory == null){
			localStorage.setItem("bss_lan_delear_list",JSON.stringify([areaJson]) );
		}else{
			$scope.clearHistory($scope.input.delearkeyword);
			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_lan_delear_list"));
			localStorage.setItem("bss_lan_delear_list",JSON.stringify([areaJson].concat(areaHistoryJson)))
		}
	}
	// 清除历史记录
	$scope.clearHistory = function(){
		var key  = arguments[0];
		if(key){
			var arrTemp = [];
			var areaHistory = JSON.parse(localStorage.getItem("bss_lan_delear_list"));
			for(var i in areaHistory){
				if(areaHistory[i].key== key){
				}else{
					arrTemp.push(areaHistory[i]);
				}
			}
			localStorage.setItem("bss_lan_delear_list",JSON.stringify(arrTemp) )
		}else{
			localStorage.removeItem('bss_lan_delear_list');
		}
		$scope.showHistory();
	}
	$scope.editHistoryText = "编辑";
	$scope.editHistoryBtn = true;
	$scope.editHistory = function(){
		if($scope.editHistoryText == "编辑"){
			$scope.editHistoryText = "完成";
			$scope.editHistoryBtn = false;
		}else{
			$scope.editHistoryText = "编辑";
			$scope.editHistoryBtn = true;
		}
	}



})



.controller('group-lan-bss-confirm', function($scope, $state, my){

	$scope.title = "订单确认";
	$scope.input = {"payMoney":""};

	$scope.order = function(){
		if($scope.input.payMoney != "" && $scope.input.payMoney >= 0){
			submitFee = Number($scope.input.payMoney);
			$state.go("signature");
		}else{
			my.alert("请输入预存金额");
		}
	}
})



.controller('group-lan-bss-submit', function($scope, $state, $rootScope, $http, $rootScope, $filter, unicomm_server, my){

	$scope.title = groupLanBss["lanaccount"];
	$scope.input = {"payMoney":String(submitFee)};

	$scope.ReSubmitDiv = true;
	$scope.prompt = "";

	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";


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
			$scope.bss_payfee()
		}
		else if($scope.domLine == "90"){
			$scope.orderToSuccess()
		}
		$scope.message = false;
		$scope.ReSubmitDiv = true;
	}


	// 号码预占
	$scope.bss_validNumber = function() {

		$scope.domEaplan = "号码预占";
		$scope.domLine = "10";

		var unicomm_json = {}
		if(service_type == "groupLanBssSelectNumber"){
			unicomm_json = {
				  "cmd":"bss_number_insert_pre_select"
				, "number":groupLanBss["lanaccount"]
				, "payfee":telInfo["preCharge"]
			}
		}else{
			unicomm_json = {
				  "cmd":"bss_number_insert_pre_select_for_group"
				, "number":groupLanBss["lanaccount"]
			}
		}
		unicomm_server.getUnicomm(unicomm_json).then(function(return_json){
			if(return_json.status == "1"){
				$scope.bss_grouplan_groupsubmit();
			}else{
				$scope.interrupt(return_json.data);
			}
		})
	}
	$scope.bss_validNumber();


	$scope.bss_grouplan_groupsubmit = function(){

		$scope.domEaplan = "生成订单-生成ID";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			  "cmd":"bss_grouplan_groupsubmit"
			, "lanaccount":groupLanBss["lanaccount"]
			, "groupId":groupLanBss["groupId"]
			, "groupName":groupLanBss["groupName"]
			, "userRole":groupLanBss["userRole"]
		}).then(function(return_json){
			if(return_json.status == "1"){
				groupLanBss["groupSubmitId"] = return_json.data;
				$scope.bss_grouplan_submit();
			}else{
				$scope.interrupt(return_json.data);
			}
		})
	}


	$scope.bss_grouplan_submit = function(){
		$scope.domEaplan = "生成订单-预写入";
		$scope.domLine = "30";

		var cmd;
		if(service_type == "policeLanBss"){
			cmd = "bss_grouplan_submit_for_daili";
		}else if (service_type == "groupLanBss") {
			cmd = "bss_grouplan_submit";
		}
		unicomm_server.getUnicomm({
			  "cmd":cmd
			, "lanaccount": 	groupLanBss["lanaccount"]
			, "groupId": 		groupLanBss["groupId"]
			, "groupkeyword": 	groupLanBss["groupkeyword"]
			, "groupSubmitId": 	groupLanBss["groupSubmitId"]
			, "productCode": 	groupLanBss["productCode"]
			, "dealerkeyword": 	groupLanBss["dealerkeyword"] 	//查询发展人关键字 和getDealerList保持一致
			, "dealerName": 	groupLanBss["dealerName"] 		//发展人姓名
			, "dealerCode": 	groupLanBss["dealerCode"] 		//发展人编号 选出来的，不是系统自带的
			, "dealerUserCode": groupLanBss["dealerUserCode"] 	//发展人用户编码
			, "payMoney": 		String(Number($scope.input.payMoney)) 			//储值金额

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
			, "uploadResponse":bss_faceCheckAndUploadPhoto_uploadResponse
		}).then(function(return_json){
			if(return_json.status == "1"){
				$scope.prompt = return_json.data.tradeId;
				$scope.setTradeId();
			}else{
				$scope.interrupt(return_json.data);
			}
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
		$scope.domEaplan = "生成电子工单";
		$scope.domLine = "50";
		$http({
			  method:'get'
			, url:ajaxurl + 'numbercontract/queryContractInfo'
			, params:{"token":$rootScope.token,"contractId":groupLanBss["productCode"]}
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
				, "number":groupLanBss["lanaccount"]
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
					, "idCardImageUrl":authentication["idHeadImgUrl"]
					, "signPicUrl":authentication["sign"]
					, "handCardUrl":authentication["customerImageUrl"]
				}
			};
			unicomm_server.getUnicomm(bssPdf).then(function(result_json){
				if(result_json.status == "1"){
					$scope.upPdf(result_json.data)
				}else{
					//$scope.saveFailed("固带移-bss工单生成", bssPdf);
					$scope.bss_payfee();
				}
			}, function(){
				//$scope.saveFailed("固带移-bss工单生成(系统)", bssPdf);
				$scope.bss_payfee();
			})
		}).error(function() {
			$scope.bss_payfee();
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
			$scope.bss_payfee();
		}).error(function(){
			$scope.bss_payfee();
		});
	}



	$scope.bss_payfee = function(){

		$scope.domEaplan = "费用受理";
		$scope.domLine = "60";

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
			param += "&number="+groupLanBss["lanaccount"];
			param += "&name="+ authentication["name"];
			param += "&cardid="+ authentication["cardId"];
			param += "&selectedElement="+groupLanBss["productCode"];
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
		$scope.domLine = "90";
		
		$http({
			  "method":"GET"
			, "url":ajaxurl+"orderApp/numberOrderToSuccess"
			, "params":{
				  "token":$rootScope.token
				, "orderNo":authentication['orderNo']
			}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$state.go("ok");
		});
	}


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

