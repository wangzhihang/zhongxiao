appControllers.controller('kuandai-wojia-number-into', function($scope, $state, $http, $rootScope, unicomm_server, my) {

	$scope.title = "纳入号码";
	$scope.input = {"number":null, "tel":null, "name":null, "pspt_id":null, "custId":null, "userId":null, "productTypeCode":null, "type":null};
	$scope.divShow = {"card":true,"type":true,"btn":true,"package":true};
	$scope.editPackageShow = true;
	$scope.editPackageIf = true;
	if(wx_order && wx_order.intoNumber){
		$scope.input["number"] = wx_order['intoNumber'];
		$scope.editPackageIf = false;
	}

	$scope.numberChannel = null;	// bss|cbss
	$scope.addOldUser_temp = {};	// 用户信息临时保存

	$scope.resState = true;
	$scope.loading = true;

	$scope.typeList = {
		"cbss":[{"id":"50","name":"CBSS所有套餐"}],
		"bss":[ {"id":"10","name":"BSS后付费的2G套餐"},
				{"id":"16","name":"BSS预付费2G套餐"},
				{"id":"33","name":"BSS后付费3G套餐"},
				{"id":"17","name":"BSS预付费3G套餐"}
				]
	}
	$scope.typeli = [];

	var relationTypeCode = null;
	var productId = wojiaRootProductId;	// 宽带套餐ID


	//输入手机号码
	$scope.telChange = function(){
		$scope.input["number"] = telFormat($scope.input["number"]);
		$scope.input["tel"] = String($scope.input["number"]).replace(/[^\d]/g, "");
		if($scope.input["tel"].length >= 11){
			if($scope.resState){
				wx_order['intoNumber'] = $scope.input["number"].replace(/[^\d]/g, "");
				$scope.resState = false;
				$scope.getInfo();
			}
		}else{
			$scope.divShow["card"] = true;
			$scope.divShow["type"] = true;
			$scope.divShow["btn"] = true;
			$scope.resState = true;
			$scope.loading = true;
		}
	};
	
	
	$scope.getInfo = function(){
		$scope.loading = false;
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_number_getNumberRoute",
				"number":$scope.input["tel"]
			}).then(function(return_json){
				if(return_json.status == "1"){
					$scope.numberChannel = "cbss";
					$scope.getCustIdCbss();
				}else{
					$scope.numberChannelBSS();
				}
			}, function() {
				$scope.loading = true;
			});
		}, function() {
			$scope.loading = true;
		});
	}

	// 判断是否为CBSS用户
	// cbss_number_getNumberRoute 下一步可以用这个接口首页判断是不是cbss 然后直接去获取号码信息
	var getCustIdCbss_index = 0;
	$scope.getCustIdCbss = function(){
		unicomm_server.getUnicomm({
			"cmd":"iscustomexists",
			"pspt_id":authentication['cardId'],
			"cust_name":authentication['name'],
			"isWithCustOrderInfo":true
		}).then(function(return_json){
			if (return_json.status == "1"){
				$scope.loading = true;
				for(var i in return_json.custOrderInfo){
					for(var ii in return_json.custOrderInfo[i]){
						if( return_json.custOrderInfo[i][ii].serialNumber == $scope.input["tel"]){
							$scope.input.custId = return_json.custOrderInfo[i][ii].custId;
						}
					}
				}
				if($scope.input.custId){
					$scope.input.name = authentication["name"]
					$scope.numberChannelShow();
				}else{
					my.alert("手机户主和实名信息不符，<br>请换手机号码或重新用手机户主的身份证实名!")
				}
			}else{
				if(getCustIdCbss_index > 4){
					$scope.loading = true;
					getCustIdCbss_index = 0;
					my.alert("手机户主和实名信息不符，<br>请换手机号码或重新用手机户主的身份证实名!");
				}else{
					getCustIdCbss_index++;
					$scope.getCustIdCbss();
				}
			}
		})
	}


	// 判断是否为BSS用户
	$scope.numberChannelBSS = function(){
		$scope.loading = false;
		unicomm_server.bssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"bss_fee_getcustomerinfo",
				"number":$scope.input["tel"]
			}).then(function(return_json){
				if(return_json.status == "1"){
					console.log(return_json)
					$scope.loading = true;
					$scope.numberChannel = "bss";
					$scope.input.name = return_json.data.name;
					$scope.numberChannelShow();
				}else{
					my.alert(return_json.data).then(function(){
						$scope.loading = true;
					});
				}
			}, function() {
				$scope.loading = true;
			})
		}, function() {
			$scope.loading = true;
		});
	}

	// 用户信息查找成功 显示下一步按钮
	$scope.numberChannelShow = function(){
		if($scope.input.name == authentication["name"]){
			$scope.input.pspt_id = authentication["cardId"];
			$scope.divShow["type"] = false;
			$scope.editPackageShow = false;
			$scope.nextShow = true;
			$scope.divShow["btn"] = false;
			$scope.typeli = $scope.typeList[$scope.numberChannel];
			$scope.input.type = $scope.typeli[0];
		}else{
			my.alert("手机户主和实名信息不符，<br>请换手机号码或重新用手机户主的身份证实名!")
		}
	}


	// 用户custID获取
	$scope.getCustId = function(){
		$scope.resState = true;
		$scope.loading = false;

		unicomm_server.getUnicomm({
			"cmd":"getRongheActivity",
			"productId":productId
		}).then(function(return_json){
			if (return_json.status == "1") {
				relationTypeCode = return_json.data.productInfo.relationTypeCode;
				$scope.cbss_lan_getOldUserInfo();
			}else{
				my.alert(return_json.data);
				$scope.resState = false;
				$scope.loading = true;
			}
		})
	}



	// 纳入用户信息
	$scope.cbss_lan_getOldUserInfo = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_getOldUserInfo",
			"number":$scope.input.tel,
			"productCode":productId,
			"relationTypeCode":relationTypeCode,
			"custId":$scope.input.custId,
			"name":$scope.input.name,
			"cardid":$scope.input.pspt_id,
			"netTypeCode":$scope.input.type["id"],
			"baseBrandCode":"4G00",	// 纳入号码传入4G00，纳入宽带传入GZKD
			"roleCode":"1"			// 纳入号码传入1，纳入宽带传入4
		}).then(function(return_json){
			if(return_json.status == '1'){
				$scope.addOldUser_temp = return_json.data;
				$scope.input.userId = return_json.data["userId"];
				$scope.input.productTypeCode = return_json.data["productTypeCode"];
				if($scope.numberChannel == "cbss"){
					$scope.cbss_lan_getOldUserProductList();
				}else{
					$scope.cbss_lan_getOldUserProductList4Bss();
				}
			}else{
				my.alert(return_json.data.message);
				$scope.resState = false;
				$scope.loading = true;
			}
		})
	}





	//
	//
	//
	//
	//
	//
	//
	//
	//
	//




	// cbss 纳入用户套餐列表
	$scope.cbss_lan_getOldUserProductList = function(){
		unicomm_server.getUnicomm({
			"cmd":"cbss_lan_getOldUserProductList",
			"productCode":productId,
			"relationTypeCode":relationTypeCode,
			"oldMobileProductTypeCode":$scope.input.productTypeCode,
			"userId":$scope.input.userId
		}).then(function(return_json){
			console.log(return_json)
			if (return_json.status == "1") {
				$scope.addOldUser();
				$scope.addNumber();
				$scope.toPackage(return_json.data);
			}else{
				my.alert(return_json.data)
				$scope.resState = false;
				$scope.loading = true;
			}
		})
	}

	// cbss 处理获取的套餐
	$scope.cbssOldpackageList = [];
	$scope.toPackage = function(return_json){
		$scope.cbssOldpackageListExecute = 0;

		var qg = [],
			bd = [],
			bj = [];
		kuandai_oldNumberProduct[$scope.input.tel] = {}
		kuandai_oldNumberProductList[$scope.input.tel] = [];
		for (var i in return_json) {
			if(return_json[i].modifyTag === "9" || return_json[i].modifyTag === "1"){
				if(return_json[i].productMode === "00"){
					kuandai_oldNumberProduct[$scope.input.tel] = return_json[i];
					kuandai_oldNumberProduct[$scope.input.tel]["productTypeCode"] = $scope.input.productTypeCode;
				}
				kuandai_oldNumberProductList[$scope.input.tel].push(return_json[i]);
			}else{
				if(return_json[i]["productName"]){
					if(return_json[i]["productName"].substring(0, 4) == '4G全国'){
						qg.push(return_json[i]);
					}else if(return_json[i]["productName"].substring(0, 4) == '4G本地'){
						bd.push(return_json[i]);
					}
					else if (return_json[i]["productName"].indexOf("冰激凌") !== -1) {
						bj.push(return_json[i]);
					}
					else if (return_json[i]["productName"].indexOf("畅爽") !== -1) {
						bj.push(return_json[i]);
					}
				}
			}
		}
		if(service_type == "wojia-combination"){
			var reg = new RegExp("[0-9]*元", "g");
			var priceArr = reg.exec(kuandai_oldNumberProduct[$scope.input.tel]["productName"]);
			console.log(priceArr)
			if(priceArr){
				if(priceArr.length === 1){
					kuandai_oldNumberProduct[$scope.input.tel]["price"] = priceArr[0].replace(/[^\d]/g, "");
					kuandai_oldNumberProduct_Admissible = bj.concat(bd).concat(qg);
					$scope.cbss_product_queryuserpackagelist();
				}else{
					my.alert('"'+ kuandai_oldNumberProduct[$scope.input.tel]["productName"]+'"特殊套餐，不允许纳入组合版融合产品！').then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			}else{
				kuandai_oldNumberProduct[$scope.input.tel]["price"] = "0";
				kuandai_oldNumberProduct_Admissible = bj.concat(bd).concat(qg);
				$scope.editPackageIf = false;
				$scope.cbss_product_queryuserpackagelist();
			}
		}else{
			if(kuandai_oldNumberProductList[$scope.input.tel].length === 1){
				var okProduct = [
					"90311029",
					"90381159",
					"90356341",
					"90356344",
					"90356346",
					"90155715",
					"90131367",
					"90350506",
					"90155946",
					"90375644",
					"90375767",
					"89098167",
					"89950166",
					"89950167",
					"99999828",
					"99999827",
					"99999826",
					"99999825",
					"99999824",
					"99999823"];
				if(okProduct.indexOf(kuandai_oldNumberProduct[$scope.input.tel]["productId"]) !== -1){
					$scope.cbss_product_queryuserpackagelist();
				}else{
					my.alert("此号码的套餐<"+ kuandai_oldNumberProduct[$scope.input.tel]["productName"] +"> 号码之家暂不支持受理！").then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			}else{
				my.alert("用户"+$scope.input.tel+"存在合约计划不允许纳入共享版融合产品！").then(function(){
					$scope.resState = false;
					$scope.loading = true;
				});
			}
		}
	}


	// cbss 纳入用户的老套餐
	$scope.cbss_product_queryuserpackagelist = function(){
		if($scope.cbssOldpackageListExecute === kuandai_oldNumberProductList[$scope.input.tel].length){
			$scope.cbssOldpackageListExecute = 0;
			$scope.cbss_product_queryuserelementlist();	
		}else{
			unicomm_server.getUnicomm({
				"cmd":"cbss_product_queryuserpackagelist",
				"userId":$scope.input.userId,
				"modifyTag":"1",
				"curProductId": kuandai_oldNumberProduct[$scope.input.tel]["productId"],
				"productId": 	kuandai_oldNumberProductList[$scope.input.tel][$scope.cbssOldpackageListExecute]["productId"],
				"productMode": 	kuandai_oldNumberProductList[$scope.input.tel][$scope.cbssOldpackageListExecute]["productMode"]
			}).then(function(return_json){
				if(return_json.status == "1"){
					$scope.cbssOldpackageList = $scope.cbssOldpackageList.concat(return_json.packageList);
					$scope.cbssOldpackageListExecute++;
					kuandai_oldNumberElementList[$scope.input.tel] = [];
					$scope.cbss_product_queryuserpackagelist();
				}else{
					my.alert(return_json.data).then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			})
		}
	}


	$scope.cbss_product_queryuserelementlist = function(){

		if($scope.cbssOldpackageListExecute === $scope.cbssOldpackageList.length){
			if(service_type == "wojia-combination"){
				$scope.divShow["package"] = false;
				$scope.input.package = kuandai_oldNumberProduct[$scope.input.tel]["productName"]
				$scope.nextShow = false;
				$scope.editPackageShow = true;
				$scope.divShow["btn"] = false;
				$scope.resState = false;
				$scope.loading = true;
			}else {
				$state.go(jump[service_type]["number-into"]);	
			}
		}else{
			unicomm_server.getUnicomm({
				"cmd":"cbss_product_queryuserelementlist",
				"productId": $scope.cbssOldpackageList[$scope.cbssOldpackageListExecute]["productId"],
				"packageId": $scope.cbssOldpackageList[$scope.cbssOldpackageListExecute]["packageId"],
				"productMode":"00",
				"userId":$scope.input.userId,
				"modifyTag":"1"
			}).then(function(return_json){
				if(return_json.status == "1"){
					kuandai_oldNumberElementList[$scope.input.tel] = kuandai_oldNumberElementList[$scope.input.tel].concat(return_json.elementList);
					$scope.cbssOldpackageListExecute++;
					$scope.cbss_product_queryuserelementlist();
				}else{
					my.alert(return_json.data)
					$scope.resState = false;
					$scope.loading = true;
				}
			})
		}
	}


	$scope.editPackageNo = function(){
		$scope.editPackage = false;
		$scope.wojiaCombinationEditPackage()
	}
	$scope.editPackageOk = function(){
		$scope.editPackage = true;
		$scope.wojiaCombinationEditPackage()
	}

	$scope.wojiaCombinationEditPackage = function(){
		if($scope.editPackage == false){
			kuandai_tel_package_list[$scope.input.tel] = {
				"sub_productObj":{},
				"result":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
				"service":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""},
				"activity":{"sub_productList":[],"sub_elementList":[],"selecteElementCode":""}
			};
			// if(wx_order.intoNumber){
			// 	$state.go("kuandai-wojia-combination-package-lan-list");
			// }else{
			// }
			$state.go("kuandai-wojia-number-selected");
		}else{
			$state.go(jump[service_type]["number-into"]);
		}
	}





	//
	//
	//
	//
	//
	//
	//
	//
	//




	// bss
	$scope.cbss_lan_getOldUserProductList4Bss = function(){
		if(service_type == "wojia-combination"){
			unicomm_server.getUnicomm({
				"cmd":"cbss_lan_getOldUserProductList4Bss",
				"productCode":productId,
				"relationTypeCode":relationTypeCode
			}).then(function(return_json){
				if (return_json.status == "1") {
					$scope.addOldUser(return_json.data);
					$scope.addNumber();
					$scope.BSStoPackage(return_json.data);
				}else{
					my.alert(return_json.data)
					$scope.resState = false;
					$scope.loading = true;
				}
			})
		}else{
			$scope.addOldUser();
			$scope.addNumber();
			$state.go(jump[service_type]["number-into"]);
		}
	}

	// bss 处理获取的套餐
	$scope.BSStoPackage = function(return_json){
		var qg = [],
			bd = [];
		for(var i in return_json){
			if(return_json[i]["productName"]){
				if(return_json[i]["productName"].substring(0, 4) == '4G全国'){
					qg.push(return_json[i]);
				}else if(return_json[i]["productName"].substring(0, 4) == '4G本地'){
					bd.push(return_json[i]);
				}
			}
		}
		kuandai_oldNumberProduct_Admissible = bd.concat(qg);
		$state.go(jump[service_type]["number-into"]);
	}




	$scope.addNumber = function(){

		telInfo["tel"] = $scope.input.tel;
		telInfo["costPrice"] = "0"
		telInfo["preCharge"] = "0"
		telInfo["lowCost"] = "0"
		telInfo["leaseLength"] = 12
		telInfo["isOldNumber"] = true;
		telInfo["write"] = true;
		kuandai_tel[$scope.input.tel] = {
			"number":$scope.input.tel,
			"tel":$scope.input.tel,
			"costPrice":"0",
			"preCharge":"0",
			"lowCost":"0",
			"leaseLength":12,
			"isOldNumber":true,
			"write":true,
			"editPackage":$scope.editPackage
		}
	}
	$scope.addOldUser = function(){
		$scope.addOldUser_temp["ACCT_ID"] = $scope.addOldUser_temp["ACCT_ID"] ? $scope.addOldUser_temp["ACCT_ID"] : $scope.addOldUser_temp['acctId'];
		$scope.addOldUser_temp["USER_ID"] = $scope.addOldUser_temp["USER_ID"] ? $scope.addOldUser_temp["USER_ID"] : $scope.addOldUser_temp['userId'];
		kuandai_oldUserInfo[$scope.input.tel] = $scope.addOldUser_temp;
	}

	
	$scope.telChange();
})