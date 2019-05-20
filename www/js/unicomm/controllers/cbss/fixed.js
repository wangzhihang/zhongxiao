appControllers.controller('unicomm-cbss-fixed-information', function($scope, $state) {

	$scope.title = "CBSS商务座机";
	service_type = "cbss_fixed";
	$scope.resState = true;

	cbss_fixed = {}
	$scope.s182List = [
		{"id":"182001","txt":"同时振铃"},
		{"id":"182002","txt":"顺序振铃"}
	]
	$scope.input = {
		"fixedPhoneNumber":"",
		"s182":$scope.s182List[0]
	}

	$scope.telChange = function(){
		$scope.input["fixedPhoneNumber"] = telFormat($scope.input["fixedPhoneNumber"]);
		if(String($scope.input["fixedPhoneNumber"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.order = function(){
		cbss_fixed = {
			"s182":$scope.input.s182.id,
			"fixedPhoneNumber":String($scope.input["fixedPhoneNumber"]).replace(/[^\d]/g, "")
		}
		$state.go(jump[service_type]["information"]);
	}
})


.controller('unicomm-cbss-fixed-getFixNumber', function($scope, $state, unicomm_server, my) {

	$scope.title = sourceName + "获取固话号码";
	$scope.input = {keyWord:""}

	
	// 获取号码
	$scope.cbss_fixedphone_getFixNumber = function(){
		$scope.numberList = []
		$scope.loading = true;
		unicomm_server.cbssLogin().then(function(){

			unicomm_server.getUnicomm(
				{
					"cmd":"cbss_fixedphone_getFixNumber",
					"exchCode":kuandai_combination_address["detailed"]["exchCode"],
					"productId":"90348174",
					"addressCode":kuandai_combination_address["addressCode"],
					"keyWord":$scope.input.keyWord,
					"areaExchId":kuandai_combination_address["detailed"]['areaExchId'],
					"pointExchId":kuandai_combination_address["detailed"]["pointExchId"],
					"accessType":kuandai_combination_address["detailed"]["accessType"]
				}
			).then(
				function(result_json){
					$scope.loading = false;
					if(result_json.status == "1"){
						for(var i in result_json.data){
							result_json.data[i].numCutOne = result_json.data[i].serialNumber.substring(0, 4)
							result_json.data[i].numCutTwo = result_json.data[i].serialNumber.substring(4, 8)
							result_json.data[i].numCutThree = result_json.data[i].serialNumber.substring(8, 12)
						}
						$scope.numberList = result_json.data;
					}else{
						my.alert(result_json.data)
					}
				}
			);
		},function(){
			// $scope.cbss_fixedphone_getFixNumber();
		})
	}
	$scope.cbss_fixedphone_getFixNumber();

	// 预占号码
	$scope.cbss_fixedphone_preSelectNumber = function(index){
		unicomm_server.getUnicomm(
			{
				"cmd":"cbss_fixedphone_preSelectNumber",
				"number":$scope.numberList[index],
				"productId":"90348174"
			}
		).then(
			function(return_json){
				if(return_json.status == 1){
					cbss_fixed.fixedNumber = $scope.numberList[index];
					$scope.cbss_fixedphone_getUserAcct();
				}else{
					my.alert(return_json.data)
				}
			}
		);
	}

	$scope.cbss_fixedphone_getUserAcct = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_fixedphone_getUserAcct",
			"mobileSerialNumber":cbss_fixed.fixedPhoneNumber
		}).then(
			function(return_json){
				if(return_json.status == 1){
					cbss_fixed.phoneUserAcct = return_json.data;
					telInfo['productId'] = "90348174";
					telInfo['tel'] = cbss_fixed.fixedNumber.number;
					source = "000004";
					number_pool = "CBSS";
					order_type = "kaika"
					$state.go("dianpu-cbbs-package-result");
				}else{
					my.alert(return_json.data)
				}
			}
		);
	}
})


.controller('unicomm-cbss-fixed-submit', function($scope, $state, $http, $rootScope, unicomm_server, my){

	$scope.title = "<" + cbss_fixed.fixedNumber.serialNumber + '>业务提交';

	$scope.ReSubmitDiv = false;

	var sub_personObj = {}
	$scope.brNumber = null;
	$scope.LiveNumber = null;
	var sub_basetradeidObj = {};
	sub_personObj["custName"] = authentication['name'];
	sub_personObj["psptId"] = authentication['cardId'];
	sub_personObj.contractName = authentication['name'];
	sub_personObj.contractNumber = authentication["contractNumber"];

	
	// 套餐信息部分
	$scope.pruductInitial = function()
	{
		$scope.sub_productObj = dianpu_cbss_package_array["sub_productObj"];
		$scope.sub_productList = dianpu_cbss_package_array["result"]["sub_productList"].concat(
				dianpu_cbss_package_array["service"]["sub_productList"],
				dianpu_cbss_package_array["activity"]["sub_productList"]
			);
		$scope.sub_elementList = dianpu_cbss_package_array["result"]["sub_elementList"].concat(
				dianpu_cbss_package_array["service"]["sub_elementList"],
				dianpu_cbss_package_array["activity"]["sub_elementList"],
			);
		$scope.selecteElementCode = dianpu_cbss_package_array["result"]["selecteElementCode"].concat(
				dianpu_cbss_package_array["service"]["selecteElementCode"],
				dianpu_cbss_package_array["activity"]["selecteElementCode"]
			);
	}
	$scope.pruductInitial();

	
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
		}else{
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

		// 有可能成功了
		if($scope.domLine >= 55){
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


	// 写卡步骤初始
	$scope.domEaplan = "准备开卡";
	$scope.domLine = "1";

	$scope.reSubmit = function(){

		$scope.ReSubmitDiv = true;
		$scope.message = false;
		if($scope.domLine == "1"){
			$scope.write();
		}
		else if($scope.domLine == "4"){
			$scope.cbss_checkpsptByGzt();
		}
		else if($scope.domLine == "5"){
			$scope.CBSSUser();
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
		else if($scope.domLine == "65"){
			$scope.quicksubmit();
		}
		else if($scope.domLine == "75"){
			$scope.cbss_fixedphone_finalSubmit();
		}
		else if($scope.domLine == "85"){
			$scope.cbss_lan_aftersubmit();
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
				// $scope.uploadImage();
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
				$scope.CBSSUser();
			}else{
				if(result_json.data == "国政通验证失败"){
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-国政通验证失败"
					});
				}else{
					$scope.saveFailed("CBSS开卡-国政通验证失败", result_json.data);
					$scope.CBSSUser();
				}
			}
		},function(data){
			$scope.saveFailed("CBSS开卡-国政通验证失败(系统)", data);
			$scope.ReSubmitDiv = false;
		});
	}

	$scope.CBSSUser = function() {
		$scope.domEaplan = "身份验证";
		$scope.domLine = "5";

		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],
			"cust_name":authentication['name'],
			"isWithCustOrderInfo":false
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					sub_personObj["custId"] = result_json.data.custId;
					$scope.uploadImage();
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
					$scope.uploadImage();
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
					$scope.getbaseandtradeid();
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
			// "number":
		})
		.then(
			function(result_json){
				if(isEmptyObject(sub_basetradeidObj)){
					if (result_json.status == "1") {
							sub_basetradeidObj["base"] = result_json.data.base;
							sub_basetradeidObj["tradeid"] = result_json.data.tradeid;
							// 半成卡跳转
							$scope.quicksubmit();
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

	
	
	$scope.quicksubmit = function(){
		$scope.domEaplan = "订单组装中，时间稍长。请耐心等待";
		$scope.domLine = "65";
		$scope.uc = {
			"cmd":"cbss_fixedphone_submitFixedPhoneOrder",
			"person":sub_personObj,
			"product":$scope.sub_productObj,
			"productList":$scope.sub_productList,
			"elementList":$scope.sub_elementList,
			"number":cbss_fixed.fixedNumber,
			"tradeUser":{"developStaffId":$scope.UnicommUserInfo["developCode"],"channelCode":$scope.UnicommUserInfo["channelCode"]},
			"basetradeid":sub_basetradeidObj,
			"baseinfo":{
				"townFlag":"C",
				"terminaltype":"0",
				"terminalSrcMode":"A008",
				"address":kuandai_combination_address["setupaddress"],
			},
			"accountId":cbss_fixed.phoneUserAcct[0].acctId
		}
		if($scope.LiveNumber){
			$scope.uc.uploadLivePhoto = $scope.LiveNumber;
			$scope.uc.uploadIdCardSequence = $scope.uploadIdCardSequence;
		}else{
			$scope.uc.brNumber = $scope.brNumber;
		}
		$scope.uc.addressinfo = {
			"cbAccessType":kuandai_combination_address["detailed"]["cbAccessType"],
			"pointExchId":kuandai_combination_address["detailed"]["pointExchId"],
			"areaExchId":kuandai_combination_address["detailed"]['areaExchId'],
			"speed":"",	// 需要特定的值
			"accessType":kuandai_combination_address["detailed"]["accessType"],
			"addressId":kuandai_combination_address["addressCode"],
			"addressName":kuandai_combination_address["addressName"]
		};
		unicomm_server.getUnicomm($scope.uc)
		.then(
			function(result_json){
				if(!$scope.submitResponse){
					if (result_json.status == "1") {
						$scope.cbss_fixedphone_finalSubmit();
					} else {
						$scope.interrupt({
							"popup":true,
							"text":result_json.data,
							"saveName":"CBSS宽带-订单保存第一步(new)"
						});
					}
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-订单保存第一步(系统new)",
					"text":data
				});
			}
		);
	}


	$scope.cbss_fixedphone_finalSubmit = function(){
		
		$scope.domEaplan = "号码绑定";
		$scope.domLine = "75";
		var obj = {
			"cmd":"cbss_fixedphone_finalSubmit",
			"elementInfo":{
				"id":615767,
				"orgCode":"0500000",
				"parentProductId":"90348174",
				"productId":"90348174",
				"packageId":"51981507",
				"elementId":"30501",
				"elementTypeCode":"S",
				"elementName":"融合一号双机",
				"elementDesc":"",
				"defaultTag":"1",
				"hmzjDefaultTag":"1",
				"modifyTag":"0",
				"relyStr":"",
				"partyId":"-1",
				"hasAttr":"12",
				"rewardLimit":"-1",
				"startUnit":"",
				"spProductId":"-1",
				"spId":"-1",
				"paramvalue":"-1",
				"startOffset":"0",
				"svcStartMode":null,
				"startAbsoluteDate":"",
				"endEnableTag":"",
				"score":"-1",
				"forceTag":"1",
				"endOffset":"0",
				"endAbsoluteDate":"",
				"itemIndex":"0",
				"mutexStr":"",
				"enableTag":"1",
				"selectTag":"1",
				"endUnit":"",
				"showTag":"1"
			},
			"person":sub_personObj,
			"s182":cbss_fixed.s182,
			"mobileNumber":cbss_fixed.fixedPhoneNumber,
			"fixedPhoneNumber":cbss_fixed.fixedNumber.serialNumber
		}
		unicomm_server.cbssLogin($scope.UnicommUserInfo).then(function(){
			unicomm_server.getUnicomm(obj)
			.then(
				function(result_json){
					if (result_json.status == "1") {
						$scope.submitResponse = result_json.data;
						$scope.cbss_lan_afterSubmit();
					} else {
						$scope.interrupt({
							"popup":true,
							"text":result_json.data,
							"saveName":"CBSS宽带-订单保存第一步(new)"
						});
					}
				},
				function(data){
					$scope.interrupt({
						"saveName":"CBSS宽带-订单保存第一步(系统new)",
						"text":data
					});
				}
			);
		})
	}


	$scope.cbss_lan_aftersubmit = function(){
		$scope.domEaplan = "提交费用";
		$scope.domLine = "85";
		var obj = {
			"cmd":"cbss_lan_aftersubmit",
			"number":cbss_fixed.fixedNumber.serialNumber,
			"baseinfo":$scope.uc.baseinfo,
			"submitResponse":$scope.submitResponse,
			"isWithOutIptvFee":kuandai_combination["tvType"] === "E" && kuandai_combination["tvPrice"] === "0",
			"isWithOutOnuFee":kuandai_combination["ftthType"] === "C" && kuandai_combination["ftthPrice"] === "0"
		}
		unicomm_server.getUnicomm(obj).then(
			function(result_json){
				if(!$scope.submitResponse){
					if (result_json.status == "1") {
						$scope.writeOrder();
					} else {
						$scope.interrupt({
							"popup":true,
							"text":result_json.data,
							"saveName":"CBSS宽带-订单保存第一步(new)"
						});
					}
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-订单保存第一步(系统new)",
					"text":data
				});
			}
		);
	}


	
	$scope.writeOrder = function(){
		$scope.domEaplan = "订单写入";
		$scope.domLine = "90";
		var params = {
			"token": $rootScope.token,
			"orderNo": authentication['orderNo'],
			"number": cbss_fixed.fixedNumber.serialNumber,
			"tradeFee": "0"
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
		$scope.domLine = "95";
		var postJson = {"orderNo":authentication["orderNo"],"productId":"","preCharge":"0"}
		if(cbss_commission.id){
			postJson.commsiionId = cbss_commission.id;
		}
		$http({
			method : "POST",
			url : ajaxurl + "orderApp/orderCheckOut?token=" + $rootScope.token,
			data : postJson
		}).success(function(){
			$state.go("ok");
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"更新订单状态失败",
				"saveText":postJson,
				"saveName":"CBSS开卡-订单确认"
			});
		});
	}


	$scope.getUser();
})

;