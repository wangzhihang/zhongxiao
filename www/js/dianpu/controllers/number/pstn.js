appControllers.controller('dianpu-pstn-dealerreturn', function($scope, $state, $http, $rootScope, my) {
	dianpu_pstn = {
		"address":{
			"accmode":"9",
			"accmodeName":"合作项目入网",
			"addresscode":"84498",
			"addressname":"陕西省西安语音合作项目无线固话绑定",
			"exchcode":"-1",
			"exchname":"合作类局向",
			"idlecount":"32",
			"localnetid":"841",
			"portnum":"32",
			"projectcode":"2888",
			"projectdesc":"市区无线固话",
			"projectname":"市区无线固话",
			"prompt":"资源预判接口:资源预判成功!!",
			"resources":" ",
			"speed":"6M"
		},
		"productId":"95583",
		"innetMethod":"70",
		"accAreaId":"50203495",
		"accAreaCode":"西安无线固话放号区-市区",
		"defaultPassword":"123456"
	}

	$scope.title = sourceName + "号码";
	$scope.data = {"followNumber":"", "lanaccount":"029"};
	$scope.haoduan = ["185","186","155","156","130","131","132","175","176"];
	$scope.resState = true;

	$scope.telChange = function(){
		$scope.data["followNumber"] = telFormat($scope.data["followNumber"]);
		$scope.data["lanaccount"] = telFormat($scope.data["lanaccount"]);
		if(String($scope.data["followNumber"]).replace(/[^\d]/g, "").length >= 11 && String($scope.data["lanaccount"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.order = function(){
		if(arrayContains($scope.haoduan, $scope.data['followNumber'].substring(0, 3)) && arrayContains(["029"], $scope.data['lanaccount'].substring(0, 3)) ){
			dianpu_pstn["followNumber"] = $scope.data["followNumber"].replace(/[^\d]/g, "");
			dianpu_pstn["lanaccount"] = $scope.data["lanaccount"].replace(/[^\d]/g, "").substring(3);
			dianpu_dealerreturn['number'] = $scope.data["followNumber"].replace(/[^\d]/g, "");
			if(service_type == "bssPstnReturn8"){
				$http({
					"method": 'GET',
					"url": ajaxurl + 'telOrderApp/checkNumber',
					"params": {"token":$rootScope.token, "number":dianpu_pstn["followNumber"]}
				}).success(function(data){
					if(data.status == "1"){
						my.confirm("订单短号码："+ data.telOrder.telphoneNumber +"<br />修改短号码："+dianpu_pstn["lanaccount"], "信息确认", "办理", "修改").then(function(){
							authentication["name"] 		= data.cardInfo["name"];
							authentication["cardId"] 	= data.cardInfo["cardId"];
							authentication["address"] 	= data.cardInfo["address"];
							authentication["birthday"] 	= data.cardInfo["birthday"];
							authentication["police"] 	= data.cardInfo["police"];
							authentication["nation"] 	= data.cardInfo["nation"];
							authentication["gender"] 	= data.cardInfo["sex"];
							authentication["start_date"]= data.cardInfo["validStart"];
							authentication["end_date"] 	= data.cardInfo["validEnd"];
							authentication["contractNumber"] = data.telOrder["contactNumber"];
							
							authentication["orderNo"] = data.telOrder["numberOrderCode"];
							authentication["telOrderNo"] = data.telOrder["orderCode"];
							authentication["idHeadImg"] = data.headBase64;
							authentication["idHeadImgUrl"] = data.idCardImageUrl;
						
							$state.go("authentication-face");
						})
					}else{
						my.alert('您的长号码未在号码之家受理或长号未竣工，请联系管理员查询（029-86262222）');
						// $state.go("authentication-device");
					}
				}).error(function(data){
					my.alert('获取长号信息失败!');
				});
			}else{
				$state.go("authentication-device");
			}
		}else{
			my.alert('您输入的手机号码或座机号码不是联通的号码,请重新输入!').then(function(){
				dianpu_dealerreturn['number'] = "";
			});
		}
	}
})


// 确认
.controller('dianpu-pstn-confirm', function($scope, $state, $http, $rootScope, my) {

	$scope.title = sourceName + "座机信息确认";
	$scope.accAreaList = [
		{"value":"50203495","name":"西安无线固话放号区-市区"},
		{"value":"50203498","name":"西安无线固话放号区-公众"},
		{"value":"50253842","name":"西安无线固话放号区—县分"},
		{"value":"50239073","name":"西安无线固话放号区-话吧"}
	];

	$scope.productList = [
		{"value":"120426","name":"无线固话30元市话套餐(陕西)(新)"},
		{"value":"120425","name":"无线固话50元包150元套餐(陕西)(新)"},
		{"value":"120424","name":"无线固话100元包300元(陕西)(新)"},

		{"value":"72575","name":"无线固话50元包150元套餐套"},
		// {"value":"52808","name":"无线固话商务108试点套餐1"},
		// {"value":"76919","name":"无线固话新100元包300元"},
		// {"value":"58368","name":"迁转最低消费30元套餐新"},
		// {"value":"54488","name":"迁转无月租区间0.1套餐1"}
	];
	$scope.simInput = {
		"name":authentication["name"],
		"cardId":authentication["cardId"],
		"number":dianpu_pstn["lanaccount"],
		"defaultPassword":"",
		"accArea":$scope.accAreaList[0],
		"product":$scope.productList[0],
		"addressdetailnam":"陕西省西安市",
		"description":"无线固话号码自开通之日起，必须在网12个月，12个月内不做退网业务，首次预存不退不转。"
	};

	$scope.order = function(){
		if($scope.simInput.addressdetailnam.length < 9){
			my.alert("请输入准确的装机地址，确认主产品！")
		}else{
			dianpu_pstn["accAreaId"] = $scope.simInput.accArea.value;
			dianpu_pstn["accAreaCode"] = $scope.simInput.accArea.name;
			dianpu_pstn["productId"] = $scope.simInput.product.value;
			dianpu_pstn["addressdetailnam"] = $scope.simInput.addressdetailnam;
			dianpu_pstn["remark"] = $scope.simInput.description;
			$http({
				"method":"POST",
				"url":ajaxurl+"telOrderApp/updateTelphoneOrderInfo",
				"params":{
					"token":$rootScope.token
				},
				"data":{
					"orderNo":authentication['telOrderNo'],
					"areaCode":dianpu_pstn["accAreaId"],
					"areaName":dianpu_pstn["accAreaCode"],
					"address":$scope.simInput.addressdetailnam,
					"mainProductId":dianpu_pstn["productId"],
					"mainProductName":$scope.simInput.product.name,
					"number":dianpu_pstn["followNumber"],
					"telphoneNumber":dianpu_pstn["lanaccount"]
				}
			}).success(function(){
				$state.go("dianpu-pstn-submit");
			}).error(function(){
				$state.go("dianpu-pstn-submit");
			});
		}
	}
})




// 提交订单
.controller('dianpu-pstn-submit', function($scope, $state, $http, $rootScope, $filter, $timeout, unicomm_server, my){

	$scope.title = "<" + dianpu_pstn["lanaccount"] + '>业务提交';
	$scope.ReSubmitDiv = true;		// 重新提交按钮
	$scope.prompt = "";

	$scope.domEaplan = "准备提交";
	$scope.domLine = "1";

	$scope.reSubmit = function(){
		if($scope.domLine == "1"){
		}
		else if($scope.domLine == "20"){
			$scope.pstn_numberList()
		}
		else if($scope.domLine == "40"){
			$scope.getCustomerList()
		}
		else if($scope.domLine == "60"){
			$scope.bss_lan_submitOrder()
		}
		else if($scope.domLine == "90"){
			$scope.orderToSuccess()
		}
		$scope.ReSubmitDiv = true;
	}

	$scope.pstn_numberList = function(){
		$scope.domEaplan = "获取号码信息";
		$scope.domLine = "20";
		unicomm_server.bssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"bss_pstn_numberList",
				"localNetId":dianpu_pstn["address"]["localnetid"],
				"exchCode":dianpu_pstn["address"]["exchcode"],
				"address_id":dianpu_pstn["address"]["addresscode"],
				"innerMethod":dianpu_pstn["innetMethod"],
				"accAreaId":dianpu_pstn["accAreaId"],
				"accAreaCode":dianpu_pstn["accAreaCode"],
				"accMode":dianpu_pstn["address"]["accmode"],
				"serialNumber":"",
				"serviceKind":"10",
				"queryNumber":String(dianpu_pstn["lanaccount"])
			}).then(function(return_json){
				if(return_json.status == '1'){
					dianpu_pstn["areaCode"] = return_json.data[0].areaCode;
					dianpu_pstn["serviceAreaId"] = return_json.data[0].serviceAreaId;
					$scope.getCustomerList();
				}else{
					$scope.interrupt({
						"popup":true,
						"text":return_json.data,
						"saveName":"商务座机(座机)提交-获取号码信息"
					});
				}
			},function(data){
				$scope.interrupt({
					"saveName":"商务座机(座机)提交-获取号码信息",
					"saveText":data
				});
			})
		},function(data){
			$scope.interrupt({
				"saveName":"商务座机(座机)提交-登录",
				"saveText":data
			});
		})
	}


	$scope.getCustomerList = function(){
		$scope.domEaplan = "获取用户信息";
		$scope.domLine = "40";
		unicomm_server.getUnicomm({
			"cmd":"bss_pstn_getCustomerList",
			"psptId":authentication["cardId"]
		}).then(function(return_json){
			if(return_json.status == '1'){
				for(var i in return_json.data){
					if(return_json.data[i]["rviceId"] == dianpu_pstn["followNumber"]){
						dianpu_pstn["strCustId"] = return_json.data[i].stomerId
						dianpu_pstn["countId"] = return_json.data[i].countId
					}
				}
				if(dianpu_pstn["strCustId"] && dianpu_pstn["countId"]){
					$scope.bss_lan_submitOrder();
				}else {
					$scope.interrupt({
						"popup":true,
						"text":"获取用户信息失败！",
						"saveName":"商务座机(座机)提交-用户获取!",
						"saveText":return_json
					});
				}
			}else{
				$scope.interrupt({
					"popup":true,
					"text":return_json.data,
					"saveName":"商务座机(座机)提交-用户获取!"
				});
			}
		}, function(data){
			$scope.interrupt({
				"saveName":"商务座机(座机)提交-用户获取!",
				"saveText":data
		});

		})
	}

	$scope.bss_lan_submitOrder = function(){

		$scope.domEaplan = "商务座机提交";
		$scope.domLine = "60";

		unicomm_server.getUnicomm({

			"cmd":"bss_pstn_submit",

			"developChannel":	bssInfo["channelCode"],
			"dealerName": 		bssInfo["channelName"],
			"dealerCode":		bssInfo["channelCode"],
			"dealerUserCode":	bssInfo["developCode"],

			"lanaccount":	"029" + dianpu_pstn["lanaccount"], 	// 029号码
			"followNumber":	dianpu_pstn["followNumber"], 	// 长号码
			
			"imageBase64": 	authentication["customerImagebase64"],
			"cardbase64": 	authentication["idHeadImg"].substring(23),
			"psptid": 		authentication["cardId"],
			"customerName": authentication["name"],
			"startdate": 	authentication["start_date"],
			"enddate": 		authentication["end_date"],
			"addressinfo": 	authentication["address"],
			"gender": 		authentication["gender"],
			"nation": 		authentication["nation"],
			"birthday": 	authentication["birthday"],
			"police": 		authentication["police"],
			"contactName": 	authentication["name"],
			"contactNumber":authentication["contractNumber"],


			"accmode":		dianpu_pstn["address"]["accmode"], 		// 预判中的accmode
			"innetMethod":	dianpu_pstn["innetMethod"], 				// 预判 接入方式
			"areainfo":		dianpu_pstn["accAreaId"], 				// 号码中的放号
			"areaname":		dianpu_pstn["accAreaCode"], 				// 号码中的放号地址
			"serviceAreaId":dianpu_pstn["serviceAreaId"], 			// no 号码中的serviceAreaId字段
			"areaCode":		dianpu_pstn["areaCode"], 				// no 号码中的areaCode字段
			"addressid": 	dianpu_pstn["address"]["addresscode"],
			"addressname":	dianpu_pstn["address"]["addressname"], 	// 预判预占中的addressName
			"addressdetailnam":dianpu_pstn["addressdetailnam"], 		// 安装地址
			"bureauId":		dianpu_pstn["address"]["exchcode"], 		// 预判预占的exch_code
			"bureauName":	dianpu_pstn["address"]["exchname"], 		// 预判预占的exch_name
			"project_code": dianpu_pstn["address"]["projectcode"], 	// 项目类型，来自于预判预占中
			"project_name": dianpu_pstn["address"]["projectname"], 	// 项目名称，来自于预判预占中
			"productId": 	dianpu_pstn["productId"], 		// no

			"setupaddress":dianpu_pstn["followNumber"],
			"strCustId":dianpu_pstn["strCustId"],
			"stomerId":dianpu_pstn["strCustId"],
			"countId":dianpu_pstn["countId"],
			"description":dianpu_pstn["remark"],
			"defaultPassword":dianpu_pstn["defaultPassword"],
			"payType":"2"
		}).then(function(return_json){
			if(return_json.status == '1'){
				$scope.prompt = return_json.data;
				$scope.bssPdf();
			}else{
				if(return_json.data == "输入的【" + dianpu_pstn["followNumber"] + "】从号码有未竣工业务！"){
					$scope.interrupt({
						"popup":true,
						"text":"长号码【" + dianpu_pstn["followNumber"] + "】联通系统正在施工中，请稍等2分钟！！！<br />点击<继续提交>按钮。",
						"saveName":"商务座机(座机)提交-开卡"
					});
				}else{
					$scope.interrupt({
						"popup":true,
						"text":return_json.data,
						"saveName":"商务座机(座机)提交-开卡"
					});
				}
			}
		}, function(data){
			$scope.interrupt({
				"saveName":"商务座机(座机)提交-开卡(系统)",
				"saveText":data
			});
		})
	}


	$scope.bssPdf = function(){
		$scope.domEaplan = "电子工单生成";
		$scope.domLine = "70";
		$http({
			method:'get',
			url:ajaxurl + 'numbercontract/queryContractInfo',
			params:{"token":$rootScope.token,"contractId":dianpu_pstn["productId"]}
		}).success(function (data){
			var tc = data.productInfo && data.productInfo.productExplain ? data.productInfo.productExplain.split("|||||") : [];
			if(tc.length < 2){tc = ["", ""];}	// 套餐没详情
			var desc  = '【套餐名称】：<u>'+data.productInfo.productName+'</u><br>';
				desc += '【套餐首月生效方式】：<u>立即生效</u><br>'
				desc += '【套餐信息】：<u>'+tc[0]+'</u><br>';
				desc += '【产品信息】：'+replaceAll(tc[1], '{kk}', $filter('date')(new Date(), 'yyyy-MM-dd'))+'<br>';
				desc += '【备注】：<u>月套餐国内（不含台港澳）流量当月不清零，剩余流量自动结转至下月，有效期至下月月底。套餐内其他业务量以及定向流量叠加包、后向流量产品、赠送流量等仅限当月使用，不能延续至下月使用。</u><br>';
			bssPdf = {
				"cmd":"bss_number_generateNumberBillPaper",
				"number":"029"+dianpu_pstn["lanaccount"],
				"tradeId":$scope.prompt,
				"productName":"",
				"productDesc":"",
				"packageDetail":desc,
				"channelName":bssInfo["channelName"],
				"developName":bssInfo["developName"],
				"developCode":bssInfo["developCode"],
				"areaCode":(userBo.disId == "7100000" ? "029" : ""),
				"personInfo":{
					"custName":authentication['name'],
					"gender":authentication['gender'],
					"birthday":authentication['birthday'],
					"address":authentication['address'],
					"startDate":authentication['start_date'],
					"endDate":authentication['end_date'],
					"nation":authentication['nation'],
					"psptId":authentication['cardId'],
					"contractName":authentication['name'],
					"contractNumber":authentication['contractNumber'],
					"police":authentication['police'],
					"idCardImageUrl":authentication["idHeadImgUrl"],
					"signPicUrl":authentication["sign"],
					"handCardUrl":authentication["customerImageUrl"]
				}
			};
			unicomm_server.getUnicomm(bssPdf).then(function(result_json){
				if(result_json.status == "1"){
					$scope.upPdf(result_json.data)
				}else{
					$scope.saveFailed("商务座机返单-工单生成", bssPdf);
					$scope.orderOk();
				}
			}, function(){
				$scope.saveFailed("商务座机返单-工单生成(系统)", bssPdf);
				$scope.orderOk();
			})
		}).error(function() {
			$scope.orderOk();
		});
	}



	$scope.upPdf = function(){
		$scope.domEaplan = "电子工单保存";
		$scope.domLine = "80";

		$http({
			"method":'POST',
			"url":ajaxurl + 'orderApp/updateEleWork',
			"params":{"token": $rootScope.token},
			"data":{
				"orderNo":authentication["telOrderNo"],
				"eleWork":arguments[0],
				"type":"000003"
			}
		}).success(function(){
			$scope.orderOk();
		}).error(function(){
			$scope.orderOk();
		});
	}


	$scope.orderOk = function(){
		$scope.domEaplan = "订单回写确认";
		$scope.domLine = "90";
		$http({
			"method":"GET",
			"url":ajaxurl+ "orderApp/savedirecttrade",
			"params":{
				"token": $rootScope.token,
				"orderNo": authentication['telOrderNo'],
				"imsi": "",
				"xoption": "",
				"ccid": "",
				"tradeFee": "0",
				"preCharge": "0",
				"tradeId": $scope.prompt,
				"number": dianpu_pstn["lanaccount"],
				"name": authentication['name'],
				"cardid": authentication["cardId"],
				"selectedElement": dianpu_pstn["productId"],
				"type":"000003"
			}
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$state.go("ok");
		});
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
	}


	$scope.saveFailed = function(){
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/saveFailedInfo?token=" + $rootScope.token,
			data : {"orderCode":authentication["telOrderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}



	// 防止重复提交
	var implement = true;
	$timeout(function () {
		if(implement){
			implement = false;
			$scope.pstn_numberList();
		}
	}, 2 * 1000);
})





// 
// 
// 
// 
// 
// 为获取提交信息的接口，相对固定获取值后不要每次都调用 
// 
// 
// 
// 
// .controller('dianpu-pstn-address-area', function($scope, $state, $ionicPopup,unicomm_server, my)
// {
// 	$scope.title = '地址预判';
// 	$scope.input = {"keyword":"", "page":"1"}
// 	$scope.addressList = [];
	

// 	$scope.loading = true;
// 	$scope.noMore = false;

// 	$scope.resState = false;	// 搜索按钮
	
// 	$scope.addrLi = true;	// 搜索记录
// 	$scope.addrList = true;	// 搜索记录列表
// 	$scope.nocity = true;	// 搜索记录为空

// 	$scope.historyLi = false;	// 搜索历史列表
// 	$scope.historyTips = true;	// 搜索历史为空


// 	$scope.queryaddress = function(){
// 		$scope.loading = false;
// 		$scope.resState = true;
// 		$scope.historyLi = true;
// 		if($scope.input.keyword == ""){
// 			my.alert('请输入关键词进行查询');
// 			$scope.resState = false;
// 			$scope.historyLi = false;
// 			$scope.loading = true;
// 		}else{
// 			$scope.addressList = [];
// 			$scope.input.page = "1";
// 			unicomm_server.bssLogin().then(function(){
// 				$scope.bss_lan_queryaddressList()
// 			});
// 		}
// 	}


// 	$scope.bss_lan_queryaddressList = function(){
// 		unicomm_server.getUnicomm({
// 			  "cmd":"bss_lan_queryaddressList"
// 			, "pagesize":"20"
// 			, "keyword":$scope.input.keyword
// 			, "page":String($scope.input.page)
// 		}).then(function(return_json){
// 			if(return_json.status == '1'){
// 				var i = 0;
// 				$("<table>" + return_json.data + "</table>").find('tr').each(function(index, el) {
// 					$scope.addressList.push({"addresscode":$(this).find('td:eq(0)').text(), "addressname":$(this).find('td:eq(1)').text()});
// 					i++;
// 				});
// 				$scope.addrLi = false;
// 				$scope.addrList = false;
// 				$scope.nocity = true;
// 				if($scope.input.page == "1"){
// 					$scope.areaHistory();
// 				}
// 				console.log(i)
// 				if(i < 20){
// 					$scope.noMore = true;
// 				}else{
// 					$scope.domore = true;
// 				}
// 			}else{
// 				if(Number($scope.input.page) > 1){
// 					$scope.noMore = true;
// 				}else{
// 					my.alert(return_json.data);
// 					$scope.addrLi = false;
// 					$scope.nocity = false;
// 				}
// 			}
// 			$scope.loading = true;
// 			$scope.resState = false;
// 		})
// 	}


// 	$scope.loadOlderStories = function(){
// 		if($scope.domore){
// 			$scope.domore = false;
// 			$scope.loading = false;
// 			$scope.resState = true;
// 			$scope.input.page = Number($scope.input.page)+1;
// 			$scope.bss_lan_queryaddressList();
// 			$scope.$broadcast('scroll.infiniteScrollComplete');
// 		}
// 	}


// 	$scope.showHistory = function(){
// 		$scope.areaHistoryList = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
// 		if($scope.areaHistoryList == null || $scope.areaHistoryList.length < 1){
// 			$scope.historyTips = false;
// 		}else{
// 			$scope.historyTips = true;
// 		}
// 	}
// 	$scope.showHistory();	//显示搜索历史记录



// 	// 从历史记录里选择文件连接 或 删除
// 	$scope.queryHistory = function(row){
// 		if($scope.editHistoryBtn){
// 			$scope.input.keyword = row.key;
// 			$scope.queryaddress();
// 		}else{
// 			$scope.clearHistory(row.key);
// 		}
// 	}

// 	// 添加搜索历史
// 	$scope.areaHistory = function(){
// 		var areaHistory = localStorage.getItem("bss_lan_areaHistory");
// 		var areaJson = {"key":$scope.input.keyword};
// 		if(areaHistory == null){
// 			localStorage.setItem("bss_lan_areaHistory",JSON.stringify([areaJson]) );
// 		}else{
// 			$scope.clearHistory($scope.input.keyword);
// 			var areaHistoryJson = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
// 			localStorage.setItem("bss_lan_areaHistory",JSON.stringify([areaJson].concat(areaHistoryJson)))
// 		}
// 	}


// 	// 清除历史记录
// 	$scope.clearHistory = function(){
// 		var key  = arguments[0];
// 		if(key){
// 			var arrTemp = [];
// 			var areaHistory = JSON.parse(localStorage.getItem("bss_lan_areaHistory"));
// 			for(var i in areaHistory){
// 				if(areaHistory[i].key== key){
// 				}else{
// 					arrTemp.push(areaHistory[i]);
// 				}
// 			}
// 			localStorage.setItem("bss_lan_areaHistory",JSON.stringify(arrTemp) )
// 		}else{
// 			localStorage.removeItem('bss_lan_areaHistory');
// 		}
// 		$scope.showHistory();
// 	}



// 	$scope.editHistoryText = "编辑";
// 	$scope.editHistoryBtn = true;
// 	$scope.editHistory = function(){
// 		if($scope.editHistoryText == "编辑"){
// 			$scope.editHistoryText = "完成";
// 			$scope.editHistoryBtn = false;
// 		}else{
// 			$scope.editHistoryText = "编辑";
// 			$scope.editHistoryBtn = true;
// 		}
// 	}




// 	$scope.order = function(i){
// 		console.log($scope.addressList)
// 		dianpu_pstn["address"]["addresscode"] = $scope.addressList[i]["addresscode"];
// 		dianpu_pstn["address"]["addressname"] = $scope.addressList[i]["addressname"];
// 		$scope.bsslan_queryaddressList();
// 	}

// 	// 预判
// 	$scope.bsslan_queryaddressList = function(){

// 		unicomm_server.getUnicomm({
// 			  "cmd":"bss_pstn_getAddressLanList"
// 			, "addressid":dianpu_pstn["address"]["addresscode"]
// 		}).then(function(return_json){
// 			console.log(return_json)
// 			if(return_json.status == '1'){
// 				var json = $(return_json.data.resource);
// 				dianpu_pstn["address"]["prompt"] = 			return_json.data.prompt;		// 预判 结果(bss_lan_occupy需要)
// 				dianpu_pstn["address"]["localnetid"] = 		return_json.data.localnetid;	// 下一个请求是需要

// 				dianpu_pstn["address"]["projectcode"] = 	return_json.data.projectcode;
// 				dianpu_pstn["address"]["projectname"] = 	return_json.data.projectname;
// 				dianpu_pstn["address"]["projectdesc"] = 	return_json.data.projectdesc;	// (bss_lan_occupy需要)

// 				dianpu_pstn["address"]["accmode"] = 		json.find('td:eq(0)').text() 	// 接入方式
// 				dianpu_pstn["address"]["accmodeName"] = 	json.find('td:eq(1)').text() 	// 接入方式名称
// 				dianpu_pstn["address"]["resources"] = 		json.find('td:eq(2)').text()	// 资源
// 				dianpu_pstn["address"]["portnum"] = 		json.find('td:eq(3)').text() 	// 端口总数
// 				dianpu_pstn["address"]["idlecount"] = 		json.find('td:eq(4)').text() 	// 端口空闲数
// 				dianpu_pstn["address"]["exchcode"] = 		json.find('td:eq(5)').text() 	// 局向编码
// 				dianpu_pstn["address"]["exchname"] = 		json.find('td:eq(6)').text() 	// 局向名称
// 				dianpu_pstn["address"]["speed"] = 			json.find('td:eq(7)').text() 	// 支持速率

// 				if(Number(dianpu_pstn["address"]["idlecount"]) < 1){
// 					my.alert("空闲端口数为 0,请返回重新选择");
// 				}else{
// 					$state.go("dianpu-pstn-getinnetmethod");
// 				}
// 			}else{
// 				my.alert(return_json.data);
// 			}
// 		})
// 	}

// })
// // 



// // 号码接入方式
// .controller('dianpu-pstn-getinnetmethod', function($scope, $state, unicomm_server, my){
// 	$scope.title = '接入方式';
// 	$scope.innetMethodList = [];
// 	$scope.loading = false;

// 	unicomm_server.getUnicomm({
// 		  "cmd":"bss_pstn_getinnetmethod"
// 		, "accmode":dianpu_pstn["address"]["accmode"]
// 	}).then(function(return_json){
// 		if(return_json.status == '1'){
// 			var json = [];
// 			$("<select>" + return_json.data + "</select>").each(function(index, el) {
// 				var innetMethod = $(this).val();
// 				if(innetMethod != null && innetMethod != "-1"){
// 					json.push({"innetMethod":$(this).val(), "innetMethodName":$(this).text()})
// 				}
// 			});
// 			console.log(json)
// 			$scope.innetMethodList = json;
// 			$scope.loading = true;
// 		}else{
// 			my.alert(return_json.data);
// 			$scope.loading = true;
// 		}
// 	})
		
// 	$scope.order = function(i){
// 		dianpu_pstn["innetMethod"] = $scope.innetMethodList[i]["innetMethod"];
// 		$state.go("dianpu-pstn-number-area");
// 	}
// })


// // 号码放号地区
// .controller('dianpu-pstn-number-area', function($scope, $state, unicomm_server, my){
// 	$scope.title = '放号地区';
// 	$scope.number_area = [];
// 	$scope.loading = false;
// 	unicomm_server.getUnicomm({
// 		  "cmd":"bss_lan_numberArea"
// 		, "localNetId":dianpu_pstn["address"]["localnetid"]
// 		, "exchCode":dianpu_pstn["address"]["exchcode"]
// 		, "serviceKind":"10"
// 		, "serialNumber":""
// 		, "address_id":dianpu_pstn["address"]["addresscode"]
// 		, "innerMethod":dianpu_pstn["innetMethod"]
// 		, "accMode":dianpu_pstn["address"]["accmode"]
// 	}).then(function(return_json){
// 		//console.log(JSON.stringify(return_json))
// 		// {"value":"50203498","name":"西安无线固话放号区-公众"}
//   //       {"value":"50253842","name":"西安无线固话放号区—县分"}
//   //       {"value":"50203495","name":"西安无线固话放号区-市区"}
//   //       {"value":"50239073","name":"西安无线固话放号区-话吧"}
// 		if(return_json.status == '1'){
// 			$scope.number_area = return_json.data.area;
// 			$scope.loading = true;
// 		}else{
// 			my.alert(return_json.data)
// 			$scope.loading = true;
// 		}
// 	})

// 	$scope.order = function(i){
// 		dianpu_pstn["accAreaId"] = $scope.number_area[i]["value"];
// 		dianpu_pstn["accAreaCode"] = $scope.number_area[i]["name"];
// 		dianpu_pstn["accAreaName"] = $scope.number_area[i]["name"];
// 		$state.go("dianpu-pstn-number-list");
// 	}
// })



// // 选择号码
// .controller('dianpu-pstn-number-list', function($scope, $state, unicomm_server, my){
// 	$scope.title = '选择号码';
// 	$scope.numberList = [];
// 	$scope.loading = false;

// 	unicomm_server.getUnicomm({
// 		  "cmd":"bss_pstn_numberList"
// 		, "localNetId":dianpu_pstn["address"]["localnetid"]
// 		, "exchCode":dianpu_pstn["address"]["exchcode"]
// 		, "address_id":dianpu_pstn["address"]["addresscode"]
// 		, "innerMethod":dianpu_pstn["innetMethod"]
// 		, "accAreaId":dianpu_pstn["accAreaId"]
// 		, "accAreaCode":dianpu_pstn["accAreaCode"]
// 		, "accMode":dianpu_pstn["address"]["accmode"]
// 		, "serialNumber":""
// 		, "serviceKind":"10"
// 		, "queryNumber":"63370142"
// 	}).then(function(return_json){
// 			console.log(JSON.stringify(return_json))
// 		if(return_json.status == '1'){
// 		}else{

// 		}
// 	})

// 	// $scope.order = function(i){
// 	// 	dianpu_pstn["lanaccount"] = $scope.numberList[i]["mobileNumber"];
// 	// 	$state.go("dianpu-pstn-getCustomerList");
// 	// }

// 	// $scope.bss_lan_getProductList = function(){
// 	// 	unicomm_server.getUnicomm({
// 	// 		  "cmd":"bss_pstn_getProductList"
// 	// 		, "lanaccount":"02963370142"
// 	// 		, "innetMethod":dianpu_pstn["innetMethod"]
// 	// 		, "productName":"无线固话"
// 	// 		, "projectInfo":dianpu_pstn["address"]["projectcode"]
// 	// 		, "developChannel":bssInfo["channelCode"]
// 	// 		, "accMode":dianpu_pstn["address"]["accmode"]
// 	// 	}).then(function(return_json){

			
// 	// 		if(return_json.status == '1'){
// 	// 			return_json.data.shift();
// 	// 			$scope.productList = return_json.data;
// 	// 			$scope.loading = true;
// 	// 		}else{
// 	// 			my.alert(return_json.data);
// 	// 			$scope.loading = true;
// 	// 		}
// 			// {"value":"52810","name":"无线固话200元包1200元包月套餐"},
// 	  //       {"value":"68241","name":"无线固话40元包500分钟"},
// 	  //       {"value":"68242","name":"无线固话55元包750分钟"},
// 	  //       {"value":"68513","name":"无线固话乡村30元套餐"},
// 	  //       {"value":"68243","name":"无线固话75元包1000分钟"},
// 	  //       {"value":"95583","name":"无线固话新市话王套餐"},
// 	  //       {"value":"68244","name":"无线固话100元包1500分钟"},
// 	  //       {"value":"72575","name":"无线固话50元包150元套餐"},
// 	  //       {"value":"72576","name":"无线固话156元包600元套餐"},
// 	  //       {"value":"68408","name":"无线固话30元包300分钟"},
// 	  //       {"value":"52808","name":"无线固话商务108试点套餐1"},
// 	  //       {"value":"61768","name":"宽带无线固话最低消费15元"},
// 	  //       {"value":"52809","name":"无线固话100元包300元包月套餐"},
// 	  //       {"value":"76919","name":"无线固话新100元包300元"},
// 	  //       {"value":"52811","name":"无线固话300元包1800元包月套餐"}
// 		// })
// 	// }
// 	// $scope.bss_lan_getProductList();
// })





// // 宽带产品
// .controller('dianpu-pstn-getCustomerList', function($scope, $state, unicomm_server, my){

// 	$scope.title = '用户信息';
// 	$scope.productList = [];
// 	$scope.loading = false;


// 	$scope.bss_lan_getProductList = function(){
// 		unicomm_server.getUnicomm({
// 			  "cmd":"bss_pstn_getCustomerList"
// 			, "psptId":authentication["cardId"]
// 		}).then(function(return_json){
// 			if(return_json.status == '1'){
// 				return_json.data.shift();
// 				$scope.productList = return_json.data;
// 				$scope.loading = true;
// 			}else{
// 				my.alert(return_json.data);
// 				$scope.loading = true;
// 			}
// 		})
// 	}
// 	$scope.order = function(i){
// 		kuandai_bssLan["productId"] = $scope.productList[i]["value"];
// 		kuandai_bssLan["productName"] = $scope.productList[i]["name"];
// 		//$state.go("kuandai-bss-lan-develop-dealer")
// 		// 先跳过实施人
// 		$state.go("kuandai-bss-lan-select-equipment");
// 	}
// })


;