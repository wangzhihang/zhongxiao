appControllers.controller('number-list', function($scope, $state, $timeout, $ionicPopup, $ionicScrollDelegate, unicomm_server, my) {
	$scope.title = "联通" + number_pool + "选号";
	$scope.disPreCharge = disPreCharge;		// 地区最低预存
	$scope.numberList = [];
	$scope.domore = false;			// 翻页触发
	$scope.loading = [false, true, true];	// loading|到底|没符合要求 CSS控制
	$scope.selectNumberIndex = "-1";
	// bss 共享宽带 副卡 直接选套餐并设为不选靓号 不能选靓号
	$scope.filter = number_pool == "BSS" 
					|| service_type == "cbssFuka" 
					|| (app == "kuandai" && wojiaIsronghe === true) 
					|| ((service_type == "cbssJumpPackage" || service_type == "cbssJumpHalfPackage") && GoodHaoma === false) 
						? false 
						: true;			// 筛选按钮
	// 搜索区域选择
	$scope.hmList = [{"id":"0", "name":"不限位置"},{"id":"1","name":"搜索尾部"}];
	// 列表参数
	$scope.pageIndex = 1;
	$scope.pageSize = 36;
	$scope.input = {
		"bufenhaoma":filterSelect["bufenhaoma"], 
		"hm":$scope.hmList[1],
		"postfix":""
	};


	// 预占号码
	$scope.addOccupyNumber = function(){
		store.set("occupyNumber", telInfo);
	}

	$scope.showOccupyNumber = function(){
		var occupyNumber = store.get("occupyNumber");
		$scope.occupyNumber = [];
		if(occupyNumber.length){
			var isCbss = number_pool == "CBSS" ? true : false;
			for(var i in occupyNumber){
				if(occupyNumber[i].isCbss == isCbss){
					$scope.occupyNumber.push(occupyNumber[i]);
				}
			}
		}
		if($scope.occupyNumber == null || $scope.occupyNumber.length < 1){
			$scope.occupyShow = false;
		}else{
			$scope.occupyShow = true;
		}
		$scope.occupyHeight = 5*$scope.occupyNumber.length+5;
	}
	$scope.showOccupyNumber();


	// 预占号码 办理
	$scope.continueOrder = function(){
		telInfo = $scope.occupyNumber[arguments[0]];
		$scope.order(telInfo, "continue");
	}
	$scope.continueOrder_jump = function(){
		if(telInfo["isCbss"]){
			$scope.cbssConfirm_success();
		}
	}


	$scope.getUnicommNumberList = function(){
		if($scope.pageIndex == "1"){
			unicomm_server.cbssLogin().then(function(){
				$scope.getNumberOnTime();
			});
		}else{
			$scope.getNumberOnTime();
		}
	}
	$scope.getNumberOnTime = function(){
		$scope.prefix = $scope.input.bufenhaoma ? $scope.input.bufenhaoma : "";
		$scope.lh_type = filterSelect["lh_type"] && filterSelect["lh_type"] != "-1" ? filterSelect["lh_type"] : "";
		$scope.deposit = filterSelect["deposit"] && filterSelect["deposit"] != "-1" ? filterSelect["deposit"].split("|") : ["0","100000"];
	
		// 非靓号选择
		if(!$scope.filter){
			$scope.deposit = ["0", "0"];
			$scope.lh_type = "201";
		}
	
		if($scope.prefix != ""){
			$scope.lh_type == "";
		}

		if((service_type == "cbssSemiManufactures" || service_type == "bssSemiManufactures") && order_info["sectionNumber"]["haoduan"]){
			unicomm_server_json["prefix"] = order_info["sectionNumber"]["haoduan"];
			unicomm_server_json["lwxh"] = "0";
		}

		var unicomm_server_json = {
			"cmd":"getNumberOnTime",
			"pagenumber":String($scope.pageIndex),
			"pageSize":String($scope.pageSize),
			"prefix":$scope.prefix,
			"postfix":"",
			// 靓号类型 AAAAA | AAAA | ABCDE | ABCD | AAA | AABB | ABAB | ABC | AA | "201"
			"lh_type":$scope.lh_type,
			// 尾号:1有,0没有
			"lwxh":($scope.input.hm.id == "1" && $scope.input.bufenhaoma ? "1" : "0"),
			// 价格区间下限 *100
			"minDeposit":String($scope.deposit[0]*100),
			// 价格区间上限 *100
			"maxDeposit":String($scope.deposit[1]*100)
		}

		unicomm_server.getUnicomm(unicomm_server_json).then(function(return_json){
			var numberList = [];
			if(return_json.status == "1"){
				for(var i in return_json.data){
					if((service_type == "cbssSemiManufactures" || service_type == "bssSemiManufactures") && order_info["sectionNumber"] && order_info["sectionNumber"]["filter"]){
						if(order_info["sectionNumber"]["filter"].indexOf(return_json.data[i].serialNumber.substring(0, order_info["sectionNumber"]["filter"][0].length) ) === -1 ){
							numberList.push($scope.pushNumberList(return_json.data[i]) );
						}
					}else{
						numberList.push($scope.pushNumberList(return_json.data[i]) );
					}
				}
			}
			$scope.numberList = $scope.numberList.concat(numberList);
			$scope.loadNumberDone(return_json.data.length);
		}, function(data) {
			my.confirm(alertInfo(data), "", "重新获取").then(
				function(){$scope.getNumberOnTime();},
				function(){$state.go("index");}
			);
		})
	}

	$scope.pushNumberList = function(){
		var arg = arguments[0]
		return {
			"isOrdered":"",
			"select":"",
			"cityStr":"",
			"number":arg.serialNumber,
			"numCutOne":arg.serialNumber.substring(0, 3),
			"numCutTwo":arg.serialNumber.substring(3, 7),
			"numCutThree":arg.serialNumber.substring(7),
			"preCharge":String(Number(arg.advancePay) ),
			"lowCost":String(Number(arg.lowCost) ),
			"costPrice":"0",
			"leaseLength":arg.leaseLength,
			"poolId":"0",
			"goodType":arg.goodType
		}
	}


	// 翻页
	$scope.loadOlderStories = function(){
		if($scope.domore){
			$scope.domore = false;
			$scope.pageIndex++;
			$scope.getUnicommNumberList();
		}
	}

	// 内容加载后动作
	$scope.loadNumberDone = function(){
		if(arguments[0] < $scope.pageSize ){
			if($scope.pageIndex == 1){
				$scope.loading = [true, true, false]; // 没有符合要求的号码
			}else{
				$scope.loading = [true, false, true]; // 没有更多了
			}
		}else{
			$timeout(function () {
				$scope.domore = true;
			}, 1 * 1000);
		}
	}

	// 点击效果
	$scope.liSelect = function(index){
		if($scope.selectNumberIndex == "-1"){
			$scope.numberList[index].select = true;
			$scope.selectNumberIndex = index;
		}else{
			if(index == $scope.selectNumberIndex){
				$scope.numberList[index].select = false;
				$scope.selectNumberIndex = "-1"
			}else{
				$scope.numberList[$scope.selectNumberIndex].select = false;
				$scope.numberList[index].select = true;
				$scope.selectNumberIndex = index;
			}
		}
	};

	/*-------------------------------------------------------------------------------
	 *
	 * cbss Confirm
	 *
	 *-------------------------------------------------------------------------------
	 */
	$scope.cbssConfirm = function(){
		my.loaddingShow(telInfo["tel"]+'号码确认中');
		unicomm_server.cbssLogin().then(function(){
			$scope.cbssConfirm_advanced();
		});
	}

	$scope.cbssConfirm_advanced = function(){
		if(userBo.userName == "18866668888"){
			$scope.cbssConfirm_success();
		}else{
			unicomm_server.getUnicomm({
				"cmd":"validatetonumber",
				"tonumber":telInfo["tel"]
			}, 10000)
			.then(
				function(result_json){
					if (result_json.status == "1") {
						telInfo["costPrice"] = "0";			// 号码费用
						telInfo["preCharge"] = String(Number(result_json.data.advancePay) );	// 预存话费
						telInfo["lowCost"] = String(Number(result_json.data.lowCost) );			// 最低消费
						telInfo["leaseLength"] = String(result_json.data.leaseLength);			// 在网时长
						telInfo["goodType"] = result_json.data.goodType;
						$scope.addOccupyNumber(telInfo)
						$scope.cbssConfirm_success();
					} else {
						$scope.confirm_fail(result_json.data.message)
					}
				}
				,function(){
					my.loaddingHide();
					my.alert("核验号码服务无反应，请检查网络后重新预占");
				}
			);
		}
	}

	$scope.cbssConfirm_success = function(){
		my.loaddingHide();
		empty_filterSelect();
		// 宽带共享套餐将号码信息保存,直接跳过套餐部分
		if(["wojia-ronghe", "wojia-share-suburb"].indexOf(service_type) != -1){
			kuandai_tel[telInfo['tel']] = deepCopy(telInfo);
		}
		// 换号码
		if(reelectNumber == 1){
			$state.go(jump[service_type]["authentication"]);
		}else{
			if(shopInfo.shopBo.city == "6100000"){
				if(wx_order.productId){
					if(app == "jike"){		
						$state.go("group-querygrouplist");
					}else{
						if(service_type == "cbssFuka"){
							$state.go(jump[service_type]["authentication"]);
						}else{
							$state.go("dianpu-cbbs-package-result");
						}
					}
				}else{
					$state.go(jump[service_type]["number-list-sc"]);
				}
			}else{
				if(wx_order.productId){
					if(app == "jike"){		
						$state.go("group-querygrouplist");
					}else{
						if(service_type == "cbssFuka"){
							$state.go(jump[service_type]["authentication"]);
						}else{
							$state.go("dianpu-cbbs-package-result");
						}
					}
				}else{
					$state.go(jump[service_type]["number-list"]);
				}
			}
		}
	}
	// end cbssConfirm


	// 预占失败
	$scope.confirm_fail = function(){
		my.loaddingHide();
		var alertTxt = arguments[0] ? arguments[0] : "当前号码已销售";
		my.alert(alertTxt)
	}


	$scope.search = function(){
		filterSelect = {};
		filterSelect["bufenhaoma"] = $scope.input.bufenhaoma;
		filterSelect["hm"] = $scope.input.hm["id"];
		$scope.numberList = [];
		$scope.loading = [false, true, true];
		$ionicScrollDelegate.scrollTop();
		$scope.pageIndex = 1;
		$scope.oneGetList();
	}

	$scope.searchUnicommTel = function(){
		$scope.domore = false;
		$scope.loading = [false, true, true];
		$scope.numberList = [];
		$ionicScrollDelegate.scrollTop();
		$scope.pageIndex = 1;
		
		filterSelect["lh_type"] = "-1";
		filterSelect["deposit"] = "-1";
		$scope.getUnicommNumberList();
	}
	

	$scope.order = function(Numberindex)
	{
		var row = $scope.numberList[Numberindex];
		if(arguments[1] === "continue"){
			row = Numberindex;
			Numberindex = "continue";
		}
		if($scope.occupyNumber.length > 3){
			my.alert("一次预占号码过多，容易被锁号！！");
		}

		if(reelectNumber == 1 && !(telInfo["preCharge"] == String(Number(row.preCharge) ) && telInfo["lowCost"] == String(row.lowCost) ) ){
			my.alert("选择的号码预存和最低消费和上一个号码不符，请重选选择！");
			return false;
		}

		if(row.number.substring(0, 3) == "166" && ["8120000", "8800000"].indexOf(shopInfo.shopBo.city) === -1 && (service_type == "cbssFuka" || dianpu_cbss_package_array.sub_productObj.productId == "90063345")){
			my.alert("166号段只支持办理冰激凌套餐!");
			return false;
		}

		if(row.goodType){
			if(number_pool == "BSS"){
				my.alert("BSS不能办理靓号，此号码需要通过CBSS系统来办理，或重选其他号码！");
				return false;
			}
			if(app == "kuandai" && wojiaIsronghe === true){
				my.alert("<共享宽带>不能办理靓号，此号码需要通过<组合宽带>来办理，或重选其他号码！");
				return false;
			}
			my.confirm(
				sprintf(
					"此<{tel}>号码为靓号，办理需：<br>月承诺通信费不低于<span style='color:#F00'>{fee}元</span><br>协议期:<span style='color:#F00'>{date}</span>",
					{
						tel:row["number"],
						fee:row["lowCost"],
						date:row["leaseLength"]
					}),
				"办理靓号提示",
				"继续办理",
				"换号码办理"
			).then(function(){
				$scope.orderSubmit(row, Numberindex);
			})
		}else{
			$scope.orderSubmit(row, Numberindex);
		}
	};
	
	$scope.orderSubmit = function(row, index){
		if(index === "continue"){
			$scope.continueOrder_jump();
		}else{
			telInfo["tel"] = row.number;
			telInfo["number"] = row.number;
			telInfo["isOldNumber"] = false;
			telInfo["write"] = false;
			telInfo["isCbss"] = number_pool == "CBSS" ? true : false;
			telInfo["delTime"] = new Date().getTime() + 1000*60*30;
			telInfo["primary_key"] = "tel";
			telInfo["poolId"] = "0";
			$scope.cbssConfirm();
		}
	}


	
	//点击输入
	$scope.autofocus = false;
	$scope.inputNumber = false;
	$scope.data = {"inputTelVal":""}
	$scope.inputTel = function(){
		$ionicPopup.show({
			"template": '<input type="tel" ng-model="data.inputTelVal"  ng-keyup="telChange()" placeholder="请输入11位手机号码">',
			"title": '请输入您的定制号码',
			"scope": $scope,
			"buttons":[
				{"text":'取消'},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						if (!$scope.data.inputTelVal) {
							e.preventDefault();
						} else {
							$scope.orderSubmit({"number":String($scope.data.inputTelVal).replace(/[^\d]/g, "")})
						}
					}
				},
			]
		});
	}

	$scope.telChange = function(){
		$scope.data.inputTelVal = telFormat($scope.data.inputTelVal);
	}


	


	// 微信订单
	if(wx_order.number && wx_order.number != ""){
		$scope.input.bufenhaoma = wx_order.number;
		wx_order.number = "";
		$scope.getUnicommNumberList();
	}else{
		if(service_type == "cbssSemiManufactures" && order_info["sectionNumber"]["haoduan"]){
			$scope.javaNumber = false;
		}else{
			$scope.javaNumber = true;
		}
		$scope.javaNumberText = "优选";
		localStorage.setItem("numberListSource","unicomm");
		$scope.getUnicommNumberList();
	}
})





	// // 预占号码 释放
	// $scope.cancelOrder = function(){
	// 	var tel = $scope.occupyNumber[arguments[0]]["tel"];
	// 	my.loaddingShow(tel+'号码释放中');
	// 	unicomm_server.getUnicomm({
	// 		  "cmd":"cbss_delOccupyResource"
	// 		, "number":String(tel)
	// 	}).then(function(data){
	// 		my.loaddingHide();
	// 		store.remove("occupyNumber", tel);
	// 		$scope.showOccupyNumber();
	// 	})
	// }

	/*-------------------------------------------------------------------------------
	 *
	 * bss Confirm
	 *
	 *-------------------------------------------------------------------------------
	 */
	// $scope.bssConfirm = function(){
	// 	unicomm_server.bssLogin().then(function(){
	// 		if(reelectNumber == 1 || app == "jike"){
	// 			$scope.bssConfirm_advanced();
	// 		}else{
	// 			$scope.bssConfirm_advanced();
	// 			// if(data < 6){
	// 			// }else{
	// 				// $scope.bssConfirm_base();
	// 			// }
	// 		}
	// 	})
	// }

	// $scope.bssConfirm_base = function(){
	// 	$scope.bssConfirm_success()
	// }

	// $scope.bssConfirm_advanced = function(){
	// 	if(userBo.userName == "18866668888"){
	// 		$scope.bssConfirm_success();
	// 	}else{
	// 		unicomm_server.getUnicomm({
	// 			  "cmd":"bss_number_insert_pre_select"
	// 			, "number":telInfo['tel']
	// 			, "payfee":telInfo["preCharge"]
	// 		}, 10000).then(
	// 			function(return_json){
	// 				if(return_json.status == "1"){
	// 					$scope.bssConfirm_success();
	// 				}else{
	// 					$scope.confirm_fail(return_json.data)
	// 				}
	// 			}
	// 			,function(){
	// 				my.loaddingHide();
	// 				my.alert("核验号码服务无反应，请检查网络后重新预占");
	// 			}
	// 		)
	// 	}
	// }
	
	// $scope.bssConfirm_success = function(){
	// 	if(reelectNumber == 1){
	// 		my.loaddingHide();
	// 		$state.go(jump[service_type]["authentication"]);
	// 	}else{
	// 		if(service_type == "schoolBssNumber" || service_type == "groupLanBssSelectNumber"){
	// 			my.loaddingHide();
	// 			$state.go(jump[service_type]["number-list"])
	// 		}else{
	// 			$scope.bss_getProductList();
	// 		}
	// 	}
	// }


	// $scope.bss_getProductList = function(){
	// 	var unicomm_json = {"number":telInfo['tel']};
	// 	if(service_type == "telSelectNewBSS"){
	// 		unicomm_json["cmd"] = "bss_product_new_queryProduct";
	// 		unicomm_json["developChannel"] = bssInfo['channelCode'];
	// 	}else{
	// 		unicomm_json["cmd"] = "bss_getProductList";
	// 	}
	// 	unicomm_server.getUnicomm(unicomm_json)
	// 	.then(function(return_json){
	// 		my.loaddingHide();
	// 		if (return_json.status == '1') {
	// 			dianpu_bss_package_array["bssPackageList"] = [];
	// 			for(var i in return_json.data){
	// 				if(return_json.data[i]["productId"] > 0){
	// 					dianpu_bss_package_array["bssPackageList"].push(return_json.data[i]);
	// 				}
	// 			}
	// 			if(dianpu_bss_package_array["bssPackageList"].length){
	// 				$state.go(jump[service_type]["number-list"]);
	// 			}else{
	// 				$scope.confirm_fail("BSS号码<"+telInfo['tel']+">没有可选套餐");
	// 			}
	// 		}else{
	// 			//console.log(return_json)
	// 			$scope.confirm_fail("BSS号码<"+telInfo['tel']+">获取可选套餐失败", false);
	// 		}
	// 	})
	// }


