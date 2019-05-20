appControllers.controller('kuandai-wojia-submit', function($scope, $state, $rootScope, $http, $ionicPopup, $timeout, unicomm_server, ble) {

	
	$scope.title = KuandaiMainProductName + "(" + authentication["name"] + ")";
	$scope.loding = 1;
	$scope.numberList = [];	// 号码列表
	$scope.pdfContent = "";

	// 重新提交按钮
	$scope.ReSubmitDiv = true;

	// 开通步骤初始
	$scope.domEaplan = "准备开通";
	$scope.domLine = "1";


	// 沃家 大提交 cmd 参数
	$scope.wojieCmd = function(){

		$scope.uc.isBingrongNaru = false;

		// map 结构开始
		$scope.uc.number = [];
		for(var i in kuandai_tel){
			kuandai_tel[i]["preCharge"] = Number(kuandai_tel[i]["preCharge"]);
			kuandai_tel[i]["number"] = kuandai_tel[i]["tel"];
			$scope.uc.number.push(kuandai_tel[i]);
		}
		$scope.uc.numberMainProduct = {};
		$scope.uc.numberProductList = {};
		$scope.uc.numberElementList = {};
		$scope.uc.newNumberProduct = {};
		for(var key in kuandai_tel_package_list){

			// 号码套餐，如果主套餐为空(纳入不修改套餐)使用纳入号码的老套餐
			$scope.uc.numberMainProduct[key]=kuandai_tel_package_list[key].sub_productObj.productId ? kuandai_tel_package_list[key].sub_productObj : kuandai_oldNumberProduct[key];
			$scope.uc.numberElementList[key] = [];
			$scope.uc.numberProductList[key] = [];


			// 如果是纳入 把老套餐 加入到 numberProductList
			if(kuandai_tel[key].isOldNumber === true){
				$scope.uc.numberProductList[key] = kuandai_oldNumberProductList[key];
				// $scope.uc.isBingrongNaru = wojiaRootProductId === "90381554"
				$scope.uc.isBingrongNaru = true;

			}

			// numberProductList
			if(kuandai_tel_package_list[key].result.sub_productList!=null){
				$scope.uc.numberProductList[key] = $scope.uc.numberProductList[key].concat(kuandai_tel_package_list[key].result.sub_productList);
			}
			if (kuandai_tel_package_list[key].service.sub_productList!=null){
				$scope.uc.numberProductList[key] = $scope.uc.numberProductList[key].concat(kuandai_tel_package_list[key].service.sub_productList);
			}
			if (kuandai_tel_package_list[key].activity.sub_productList!=null){
				$scope.uc.numberProductList[key] = $scope.uc.numberProductList[key].concat(kuandai_tel_package_list[key].activity.sub_productList);
			}

			// numberElementList
			$scope.uc.numberElementList[key]=kuandai_tel_package_list[key].result.sub_elementList;
			if (kuandai_tel_package_list[key].service.sub_elementList!=null){
				$scope.uc.numberElementList[key] = $scope.uc.numberElementList[key].concat(kuandai_tel_package_list[key].service.sub_elementList);
			}
			if (kuandai_tel_package_list[key].activity.sub_elementList!=null){
				$scope.uc.numberElementList[key] = $scope.uc.numberElementList[key].concat(kuandai_tel_package_list[key].activity.sub_elementList);
			}
			
			// 如果不是 纳入不修改套餐 添加newNumberProduct
			if(kuandai_tel_package_list[key].sub_productObj.productId){
				$scope.uc.newNumberProduct[key] = kuandai_tel_package_list[key].sub_productObj;
			}
		}



		$scope.uc.oldUserInfo = kuandai_oldUserInfo;			// 新加的参数
		$scope.uc.oldNumberPackageList = kuandai_oldNumberElementList;
		$scope.uc.simcardinfo = simcardinfo;
		// map结构


		$scope.uc.productinfo=kuandai_combination["combination"].info;
		$scope.uc.productList=[kuandai_combination["combination"].info].concat(kuandai_combination["broadband"].activity.lanproduct)
		$scope.uc.elementList=kuandai_combination["combination"]["ElementList"]
					.concat(kuandai_combination["combination"]["ElementListFlow"])
					.concat(kuandai_combination["combination"]["ElementListVoice"])
					.concat(kuandai_combination["combination"]["ElementListSMS"])
					.concat(kuandai_combination["combination"]["ElementList1-5G"])
					.concat(kuandai_combination["broadband"].activity.lanelementlist);


		$scope.uc.phoneListMap = kuandai_phoneListMap;
		$scope.uc.isronghe = wojiaIsronghe;	// 组合=false,共享=true
	}


	$scope.uc = {};
	// 单宽 || 融合
	$scope.uc.cmd = service_type == "cbssLan" ? "cbss_lan_submitSingleLan" : "cbss_lan_submitmodetrade";
	$scope.uc.baseinfo = {
		"name":authentication["name"],
		"cardid":authentication['cardId'],
		"contactName":authentication["name"],
		"contactNumber":authentication["contractNumber"],
		"address":kuandai_combination_address["setupaddress"],
		"remark":kuandai_combination["remark"],
		"developCode":cbssInfo["developCode"],
		"channelCode":cbssInfo["channelCode"],

		"terminalSrcMode":kuandai_combination["ftthMode"], // 光猫类型 ftth:A002,其他:A001
		"terminaltype":kuandai_combination["ftthType"], 	// ftth光猫
		"gateWayFee":String(Number(kuandai_combination["ftthPrice"])), // 光猫费用

		"feetype":kuandai_combination["tvType"]	,						// tv 机顶盒 类型
		"telBoxFee":String(Number(kuandai_combination["tvPrice"])),		// 机顶盒费用
		"macaddress":kuandai_combination["tvMacAddress"],				// 机顶盒 MAC

		"preCharge":String(Number(kuandai_combination["preCharge"])), 	// 预存
		"acctPasswd":"123456",
		"townFlag":(service_type == "wojia-share-suburb" ? "C" : "T"),
		"fee_8234":(kuandai_combination.fee_8234 ? kuandai_combination.fee_8234 : "0") 		// 单宽体验版
	};


	$scope.uc.lanproduct=kuandai_combination["broadband"].productInfo;
	$scope.uc.lanproductList=kuandai_combination["broadband"].lanproduct.concat(kuandai_combination["service"]["info"]).concat(kuandai_combination["broadband"].tv.lanproduct);
	$scope.uc.lanelementlist=kuandai_combination["broadband"].lanelementlist.concat(kuandai_combination["service"]["ElementList"]).concat(kuandai_combination["broadband"].tv.lanelementlist);
	
	$scope.uc.iptvinfo = kuandai_iptvinfo;
	$scope.uc.addressinfo = {
		"cbAccessType":kuandai_combination_address["detailed"]["cbAccessType"],
		"pointExchId":kuandai_combination_address["detailed"]["pointExchId"],
		"areaExchId":kuandai_combination_address["detailed"]['areaExchId'],
		"speed":String(kuandai_combination["broadband"].productInfo.flowTmp),
		"accessType":kuandai_combination_address["detailed"]["accessType"],
		"addressId":kuandai_combination_address["addressCode"],
		"addressName":kuandai_combination_address["addressName"]
	};

	// 如果不是 cbss单宽 将wojia获取的参数导入
	if(service_type != "cbssLan"){
		$scope.wojieCmd();
	}else{
		// 单宽可绑定手机号码(大王卡和单宽可组成 王卡宽带)
		$scope.uc.isFixedLan = kuandai_wk_isFixedLan;
		if(kuandai_wk_isFixedLan){
			$scope.uc.baseinfo.bindingSerialNumber = kuandai_combination['bindingSerialNumber'];
		}
	}
	
	$scope.reSubmit = function(){

		$scope.ReSubmitDiv = true;

		if($scope.domLine == "1"){
			$scope.cbssLogin();
		}else if($scope.domLine == "5"){
			$scope.cbss_checkpsptByGzt();
		}else if($scope.domLine == "10"){
			$scope.checkCreateUser();
		}else if ($scope.domLine == "20"){
			$scope.getacctid()
		}else if ($scope.domLine == "30"){
			$scope.getlanacctinfo();
		}else if ($scope.domLine == "40"){
			$scope.getiptvinfo();
		}else if ($scope.domLine == "55"){
			$scope.uploadImage();
		}else if ($scope.domLine == "57"){
			$scope.uploadImageTel();
		}else if ($scope.domLine == "60"){
			$scope.seveOrder();
		}else if ($scope.domLine == "65"){
			$scope.quicksubmit();
		}else if ($scope.domLine == "80"){
			$scope.cbss_lan_afterSubmit();
		}else if ($scope.domLine == "85"){
			$scope.updateShop();
		}else if ($scope.domLine == "90") {
			$scope.wojiaMakePdf()
		}else if ($scope.domLine == "95") {
			$scope.upPdf()
		}
	}
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		if(msg["popup"]){
			$ionicPopup.alert({"title":"提示","template":alertInfo(msg["text"])}).then(function(){
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
			data : {"orderCode":authentication["orderNo"], "node":arguments[0], "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}


	var implement = true;
	$scope.cbssLogin = function(){
		// 工单池绑定工号
		if(wx_order.orderCode){
			// 号码之家外呼用特殊工号
			if(wx_order.hmzj){
				cbssInfo = {
					"username":"142393085",
					"password":"QWEzNjkzNjk=",
					"orgno":"84",
					"developCode":"8406364120",
					"developName":"西安联通新城飞翔通讯专营店",
					"channelCode":"84b2h39",
					"channelName":"西安联通新城飞翔通讯专营店",
					"ifTest":false
				}
				$scope.cbssLoginGo(true);
			}else{
				$http({
					method:'get',
					url:ajaxurl + 'userApp/getParameterByName',
					params:{"token":$rootScope.token,"name":"kuandaiPoolCbssList"}
				}).success(function (data){
					if(data){
						return_json = JSON.parse(data)
						if(return_json[userBo.disId]){
							cbssInfo = return_json[userBo.disId];
							$scope.cbssLoginGo(true);
						}else{
							$scope.cbssLoginGo(false)
						}
					}else{
						$scope.cbssLoginGo(false)
					}
				}).error(function() {
					my.alert("工单池默认CBSS工号，获取失败!");
				});
			}
		}else{
			$scope.cbssLoginGo(false)
		}
	};

	$scope.cbssLoginGo = function(cbssUser){
		unicomm_server.cbssLogin(cbssUser ? cbssInfo : {}).then(function(){
			if(implement){
				implement = false;
				if(userBo.userName == "18866668888"){
					my.alert("您使用的是测试工号，下一步操作将产生消费，将跳过办理步骤").then(function(){
						$scope.updateShop();
					})
				}else{
					$scope.cbss_checkpsptByGzt();
				}
			}
		},function(data){
			$scope.interrupt({
				"saveName":"CBSS宽带-登录失败",
				"text":data
			});
		});
	}



	
	// 第一步
	// $scope.checkCreateUser = function(){
	// 	$scope.cbss_checkpsptByGzt();
	// }
	$scope.cbss_checkpsptByGzt = function(){
		$scope.domEaplan = "国政通验证";
		$scope.domLine = "5";
		unicomm_server.getUnicomm({
			"cmd":"cbss_checkpsptByGzt",
			"custName":authentication['name'],
			"psptId":authentication['cardId']
		}).then(function(result_json){
			if(result_json.status == "1"){
				$scope.iscustomexists();
			}else{
				if(result_json.data == "国政通验证失败"){
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS开卡-国政通验证失败"
					});
				}else{
					$scope.saveFailed("CBSS开卡-国政通验证失败", result_json.data);
					$scope.iscustomexists();
				}
			}
		},function(data){
			$scope.interrupt({
				"popup":true,
				"text":data,
				"saveName":"CBSS开卡-国政通验证失败(系统)"
			});
		});
	}


	$scope.iscustomexists = function(){
		
		$scope.domEaplan = "用户确认中";
		$scope.domLine = "10";
	
		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],
			"cust_name":authentication['name'],
			"isWithCustOrderInfo":kuandai_wk_isFixedLan
		}).then(function(result_json){
			if (result_json.status == "1") {
				if(kuandai_wk_isFixedLan){
					$scope.kuandai_wk_custId(result_json.custOrderInfo);
				}else{
					$scope.uc.baseinfo["custId"] = result_json.data.custId;
					$scope.getacctid();
				}
			}else if(result_json.status == "99"){
				$scope.iscustomexists();
			}
			else if(result_json.status == "98"){
				var data = result_json.data.message ? result_json.data.message : result_json.data;
				if(kuandai_wk_isFixedLan){
					$scope.interrupt({
						"popup":true,
						"saveName":"CBSS宽带-获取custId(系统)",
						"text":"没有查到<"+authentication['name']+">的用户信息!"
					});
				}else{
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
			}
			else {
				var data = result_json.data.message ? result_json.data.message : result_json.data;
				if(kuandai_wk_isFixedLan){
					$scope.interrupt({
						"popup":true,
						"saveName":"CBSS宽带-获取custId(系统)",
						"text":"没有查到<"+authentication['name']+">的用户信息!"
					});
				}else{
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
		},function(data){
			$scope.interrupt({
				"popup":true,
				"saveName":"CBSS宽带-获取custId(系统)",
				"text":data
			});
		});
	}


	
	$scope.kuandai_wk_custId = function(custOrderInfo){
		$scope.uc.baseinfo["custId"] = "";
		for(var i in custOrderInfo){
			for(var ii in custOrderInfo[i]){
				if( custOrderInfo[i][ii].serialNumber == $scope.uc.baseinfo.bindingSerialNumber
					&& custOrderInfo[i][ii].productName.indexOf("王卡") !== -1){
					$scope.uc.baseinfo["custId"] = custOrderInfo[i][ii].custId;
				}
			}
		}
		if($scope.uc.baseinfo["custId"] === ""){
			$scope.interrupt({
				"popup":true,
				"text":"号码<"+$scope.uc.baseinfo.bindingSerialNumber+">没有查到用户信息，请确定号码是否填写正确，并确认是联通王卡!",
				"saveName":"王卡宽带-获取custId"
			});
		}else{
			$scope.getacctid();	
		}
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
		.then(function(result_json){
			if(result_json.status == "1"){
				$scope.uc.baseinfo["custId"] = result_json.data.custId;
				$scope.getacctid();
			}else if(result_json.status == "99"){
				$scope.createcustomer();
			}else{
				$scope.interrupt({
					"popup":true,
					"text":result_json.data,
					"saveName":"CBSS宽带-新建用户"
				});
			}
		}, function(data){
			$scope.interrupt({
				"saveName":"CBSS宽带-新建用户(系统)",
				"text":data
			});
		})
	}



	$scope.getacctid = function(){

		$scope.domEaplan = "获取ACCTID";
		$scope.domLine = "20";

		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_getacctid",
			"custid":$scope.uc.baseinfo["custId"],
			"is_single_lan":(service_type == "cbssLan" ? true : false)
		})
		.then(
			function(result_json){
				if((!$scope.uc.baseinfo["acctId"]) && (!$scope.uc.baseinfo["tradeBase"])){
					if (result_json.status == "1") {
						$scope.uc.baseinfo["acctId"] = result_json.data.acctId;
						$scope.uc.baseinfo["tradeBase"] = result_json.data.tradeBase;
						$scope.getlanacctinfo()
					} else {
						$scope.interrupt({
							"popup":true,
							"text":result_json.data,
							"saveName":"CBSS宽带-获取ACCTID"
						});
					}
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-获取ACCTID(系统)",
					"text":data
				});
			}
		);
	}



	$scope.getlanacctinfo = function(){

		$scope.domEaplan = "获取authAcctId账号";
		$scope.domLine = "30";

		if(!$scope.uc.baseinfo["authAcctId"]){
			unicomm_server.getUnicomm({
				"cmd":"cbss_lan_getlanacctinfo",
				"accessType":kuandai_combination_address["detailed"]["accessType"],
				"productId":kuandai_combination["broadband"].productInfo['productId'],
				"brandCode":"GZKD",
				"areaExchId":kuandai_combination_address["detailed"]['areaExchId'],
				"pointExchId":kuandai_combination_address["detailed"]["pointExchId"],
				"exchCode":kuandai_combination_address["detailed"]["exchCode"],
				"switchExchId":kuandai_combination_address["detailed"]["switchExchId"]
			})
			.then(
				function(result_json){
					if(!$scope.uc.baseinfo["authAcctId"]){
						if (result_json.status == "1") {
							$scope.uc.baseinfo["authAcctId"] = result_json.data;
							$scope.getiptvinfo();
						} else {
							$scope.interrupt({
								"popup":true,
								"text":result_json.data,
								"saveName":"CBSS宽带-获取authAcctId账号"
							});
						}
					}
				},
				function(data){
					$scope.interrupt({
						"saveName":"CBSS宽带-获取authAcctId账号(系统)",
						"text":data
					});
				}
			);
		}
	}



	$scope.getiptvinfo = function(){
		
		$scope.domEaplan = "获取宽带IP";
		$scope.domLine = "40";

		unicomm_server.getUnicomm({"cmd":"cbss_lan_getiptvinfo"})
		.then(
			function(result_json){
				if(!$scope.uc.iptvinfo["iptvid"]){
					if (result_json.status == "1") {
						$scope.uc.iptvinfo["iptvid"] = result_json.data.acctId;
						$scope.uploadImage()
					} else {
						$scope.interrupt({
							"popup":true,
							"text":result_json.data,
							"saveName":"CBSS宽带-获取IP"
						});
					}
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-获取IP(系统)",
					"text":data
				});
			}
		);
	}



	$scope.uploadImage = function(){

		$scope.domEaplan = "用户照片保存";
		$scope.domLine = "55";

		unicomm_server.getUnicomm({
			"cmd":"uploadPhoto",
			"imagepath":authentication["customerImageUrl"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.uc.baseinfo["picname"] = result_json.data;
					$scope.uploadImageTel();
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS宽带-用户照片保存"
					});
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-用户照片保存(系统)",
					"text":data
				});
			}
		);
	}



	$scope.uploadImageTel = function(){

		$scope.domEaplan = "用户照片保存";
		$scope.domLine = "57";

		unicomm_server.getUnicomm({
			"cmd":"uploadPhoto",
			"imagepath":authentication["customerImageUrl"]
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.uc.baseinfo["picname1"] = result_json.data;
					$scope.seveOrder();
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS宽带-用户照片保存"
					});
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-用户照片保存(系统)",
					"text":data
				});
			}
		);
	}


	$scope.inputData = {};
	$scope.seveOrder = function(){

		$scope.domEaplan = "保存订单信息";
		$scope.domLine = "60";

		$scope.numberList = [];
		for(var i in kuandai_tel){
			var simNumber = simcardinfo[i] ? simcardinfo[i]["iccid"] : "";
			var activity = (kuandai_tel_package_list[i]["activity"] && kuandai_tel_package_list[i]["activity"]["sub_productList"] && kuandai_tel_package_list[i]["activity"]["sub_productList"][0]) ? kuandai_tel_package_list[i]["activity"]["sub_productList"][0] : "";
			var numberInfo = {
				"number":i,
				"contractId":kuandai_tel_package_list[i]["sub_productObj"]["productId"],
				"contractName":kuandai_tel_package_list[i]["sub_productObj"]["productName"],		// 号码套餐
				"activityId":(activity == "" ? "" : activity["productId"]),
				"activityName":(activity == "" ? "" : activity["productName"]),
				"activityAmount":(activity == "" ? "" : activity["price"]),
				"simNumber":simNumber,
				"numAmount":kuandai_tel[i]["preCharge"],
				"isNewNumber":kuandai_tel[i]["isOldNumber"] ? "000002" : "000001",		/*新裝,纳入*/
			}
			// 如果是新增走佣金
			if(!kuandai_tel[i]["isOldNumber"]){
				numberInfo.commission = kuandai_tel[i].commission;
			}
			$scope.numberList.push(numberInfo)
			store.remove("occupyNumber", i);
		}


		// 单宽绑定号码
		if(kuandai_combination['bindingSerialNumber'] && $scope.numberList.length == 0){
			$scope.numberList.push({
				"number":kuandai_combination['bindingSerialNumber'],
				"contractId":"",
				"contractName":"",
				"activityId":"",
				"activityName":"",
				"activityAmount":"",
				"simNumber":"",
				"numAmount":"",
				"isNewNumber":"000003"
			})
		}

		if(isEmptyObject($scope.inputData)){

			$scope.inputData = {
				"orderCode":authentication["orderNo"],

				"customer":authentication["name"],							//(顾客姓名)
				"contractNumber":authentication["contractNumber"],			//(联系方式)
				"lanAddress":kuandai_combination_address["setupaddress"],	//(宽带地址)
				"addressCode":kuandai_combination_address["addressCode"],	//(地址编码)
				"comment":kuandai_combination["remark"],					//(备注信息)
				
				"mainProductId":kuandai_combination["combination"]["info"]["productId"],		//(主套餐ID)
				"mainProductName":kuandai_combination["combination"]["info"]["productName"],	//(主套餐名称) 组合或融合
				"detailedProductId":kuandai_combination["broadband"]["productInfo"]["productId"],		//(子套餐ID) 50M||100M
				"detailedProductName":kuandai_combination["broadband"]["productInfo"]["productName"],	//(子套餐名称)
				"lanAmount":$scope.uc.baseinfo.preCharge,			// 宽带费用
				"amount":kuandai_combination["amount"],

				"ftthAddress":kuandai_combination["ftthMacAddress"],	//(MAC地址)
				"lanNumber":$scope.uc.baseinfo["authAcctId"],	//(宽带号码)
				"ftthPassword":"",		//(TV密码)
				
				"ftthType":kuandai_combination["ftthType"], 	//(光猫类型)
				"ftthAmount":kuandai_combination["ftthPrice"], //(光猫价格)

				"tvType":kuandai_combination["tvType"], 			//(机顶盒类型)
				"tvAmount":kuandai_combination["tvPrice"], 		//(机顶盒价格)
				"macAddress":kuandai_combination["tvMacAddress"],	//(MAC地址)
				"account":$scope.uc.iptvinfo["iptvid"],			//(TV账户)
				"tvPassword":"",		//(TV密码)

				"number":JSON.stringify($scope.numberList),

				"developCode":cbssInfo["developCode"],
				"channelCode":cbssInfo["channelCode"],
				"channelName":cbssInfo["channelName"],
				"developName":cbssInfo["developName"],
				"unicomAccountId":cbssInfo.id,
				"unicommAccountName":cbssInfo["username"],

				"lanCommission":kuandai_combination.commission,
				"cmd":"quicksubmit",
				"unicomm_json":$scope.uc
			}

			if(kuandai_combination['broadband']["activity"]["lanproduct"].length){
				$scope.inputData["lanActivityName"] = kuandai_combination['broadband']["activity"]["lanproduct"][0]["productName"];
				$scope.inputData["lanActivityPrice"] = kuandai_combination['broadband']["activity"]["lanproduct"][0]["price"];
			}

			$http({
				method: 'POST',
				url: ajaxurl + 'orderLanApp/submitLanOrder?token='+$rootScope.token,
				data: $scope.inputData
			}).success(function(){
				$scope.quicksubmit();
			}).error(function(){
				$scope.interrupt({
					"popup":true,
					"text":"保存订单信息失败!",
					"saveName":"CBSS宽带-保存订单信息失败"
				});
			});
		}
	}


	$scope.submitResponse = "";
	$scope.quicksubmit = function(){

		$scope.domEaplan = "订单组装中，时间稍长。请耐心等待";
		$scope.domLine = "65";
		unicomm_server.getUnicomm($scope.uc)
		.then(
			function(result_json){
				if(!$scope.submitResponse){
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


	$scope.cbss_lan_afterSubmit = function(){
		$scope.domEaplan = "订单组装中，时间稍长。请耐心等待";
		$scope.domLine = "80";
		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_afterSubmit",
			"number":$scope.uc.number,
			"baseinfo":$scope.uc.baseinfo,
			"submitResponse":$scope.submitResponse,
			"isWithOutIptvFee":kuandai_combination["tvType"] === "E" && kuandai_combination["tvPrice"] === "0",
			"isWithOutOnuFee":kuandai_combination["ftthType"] === "C" && kuandai_combination["ftthPrice"] === "0"
		})
		.then(
			function(result_json){
				if (result_json.status == "1") {
					$scope.updateShop(result_json.data);
				} else {
					$scope.interrupt({
						"popup":true,
						"text":result_json.data,
						"saveName":"CBSS宽带-订单保存第二步(new)"
					});
				}
			},
			function(data){
				$scope.interrupt({
					"saveName":"CBSS宽带-订单保存第二步(系统new)",
					"text":data
				});
			}
		);
	}


	$scope.updateShop = function(result_json){
		$scope.domEaplan = "更新订单状态";
		$scope.domLine = "85";

		$scope.pdfContent = result_json.pdfContent;
		$scope.feeList = JSON.parse($scope.pdfContent["continueFeeList"]);
		
		order_amount = 0;
		for(var i=0;i<9;i=i+1){
			if(result_json.chargeInfo && result_json.chargeInfo["fee"+i]){
				order_amount = Number(order_amount) + Number(result_json.chargeInfo["fee"+i])
			}
		}

		// 如果是微信订单 回写
		if(wx_order.orderCode){
			$http({
				url : ajaxurl+ "lanPreorderApp/updateStatusByPreorderNo",
				method : "GET",
				params:{
					"token":$rootScope.token,
					"preOrderNo":wx_order.orderCode,
					"status":"000100",
					"projectAddressCode":$scope.uc.baseinfo["authAcctId"],
					"normalOrderCode":authentication['orderNo']
				}
			})
			wx_order = {};
		}

		if(scanCode_order.orderCode){
			var numberList = [];
			for(var i in $scope.numberList){
				numberList.push({"number":$scope.numberList[i].number, "subGoodsId":$scope.numberList[i].contractId,"subGoods":$scope.numberList[i].contractName})
			}
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
					"number":$scope.uc.baseinfo["authAcctId"],
					"productId":kuandai_combination["broadband"]["productInfo"]["productId"],
					"productName":kuandai_combination["broadband"]["productInfo"]["productName"],
					"tradeId":$scope.uc.baseinfo["acctId"],
					"remark":"",
					"numberlist":JSON.stringify(numberList)
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

		// 账目列表
		for(var i in $scope.feeList){
			kuandai_combination["feeList"].push({
				"FEEITEM_NAME":$scope.feeList[i]["FEEITEM_NAME"],
				"OLDFEE":$scope.feeList[i]["OLDFEE"],
				"FEE":$scope.feeList[i]["FEE"]
			})
		}

		// 总额


		$http({
			method: 'POST',
			url: ajaxurl + 'orderLanApp/verifyFinance?token='+$rootScope.token,
			params: {
				"orderCode":authentication["orderNo"],
				"amount":order_amount,
				"unicommFee":order_amount,
				"financeStr":JSON.stringify(kuandai_combination["feeList"]),
				"number":JSON.stringify($scope.numberList),
				"customer":authentication["name"],
				"contractNumber":authentication["contractNumber"],
				"tradeid":$scope.uc.baseinfo["acctId"],
				"channelName":cbssInfo["channelName"],
				"developName":cbssInfo["developName"],
				"unicommAccountName":cbssInfo["username"]
			}
		}).success(function(){
			$scope.wojiaMakePdf();
		}).error(function(){
			$scope.interrupt({
				"popup":true,
				"text":"更新订单状态失败!",
				"saveName":"CBSS宽带-更新订单状态"
			});
		});
	}



	$scope.wojiaMakePdf = function(){
		$scope.domEaplan = "生成电子工单!";
		$scope.domLine = "90";

		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_generateBillPaper",
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
			"pdfContent":$scope.pdfContent
		})
		.then(function(result_json){
			if(result_json.status == "1"){
				$scope.upPdf(result_json.data)
			}else{
				$state.go("ok");
			}
		}, function(){
			$state.go("ok");
		})
	}


	$scope.upPdf = function(){
		$scope.domEaplan = "保存电子工单!";
		$scope.domLine = "95";
		$http({
			"method":'POST',
			"url":ajaxurl + 'orderApp/updateEleWork',
			"params":{"token": $rootScope.token},
			"data":{
				"orderNo":authentication["orderNo"],
				"eleWork":arguments[0],
				"type":"000002"
			}
		}).success(function(data){
			$state.go("ok");
		}).error(function(data){
			$state.go("ok");
		});
	}



	// 防止重复提交
	$timeout(function () {
		if(implement){
			$scope.cbssLogin();
		}
	}, 2 * 1000);
});