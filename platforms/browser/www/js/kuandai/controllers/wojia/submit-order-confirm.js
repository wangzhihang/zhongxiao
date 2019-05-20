appControllers.controller('kuandai-wojia-order-confirm', function($scope, $state, $ionicPopup, $http)
{
	
	$scope.title = "订单信息确认";

	$scope.telActivityShow = false;	// 组合为true 共享false
	$scope.ftthShow = true;
	$scope.tvShow = true;
	kuandai_combination.fee_8234_jm = "0";
	if(kuandai_combination["ftthType"] === "0" && kuandai_combination["tvType"] === "0"){
		$scope.fee_8234_jm_dom = true;
	}
	$scope.orderinfo = {
		"lan":kuandai_combination["broadband"]["productInfo"]["productName"],
		"TV":kuandai_combination["tvPrice"],
		"FTTH":kuandai_combination["ftthPrice"],
		"preCharge":kuandai_combination["combination"]["info"]["price"],
		"leastPreCharge":kuandai_combination["combination"]["info"]["price"],
		"address":kuandai_combination_address["setupaddress"],
		"remark":"用户宽带套餐合约期不少于12个月，合约期内不得无资源移机、停机及离网，合约期内离网需补交100元工料费。已告知用户宽带终端收费标准光猫180元/台，机顶盒190元/元！",
		"fee_8234":Number(kuandai_combination.fee_8234) + Number(kuandai_combination.fee_8376),
		"fee_8234_jm":"0"
	}
	// 引流 修改金额
	if(wx_order.orderCode){
		$scope.orderinfo.preCharge = wx_order.preCharge;
		$scope.orderinfo.fee_8234 = "0"
		kuandai_combination.fee_8234 = "0";
		kuandai_combination.fee_8376 = "0";
		$scope.fee_8234_jm_dom = false;
	}
	// 修改值输入框
	$scope.input = {"preCharge":"", "editTelShow":true,"materialFee":""};
	// 如果是FTTh 备注添加
	
	if(kuandai_combination_address["detailed"]["cbAccessTypeName"].indexOf("FTTH") !== -1){
		if(kuandai_combination["ftthType"] === "0"){
			$scope.ftthShow = false;
			$scope.orderinfo.remark += "客户选择：光猫自备。";
		}else if(kuandai_combination["ftthType"] === "C"){
			$scope.orderinfo.remark += "客户选择：光猫180元/台。";
		}
	}
	if(kuandai_selected_package.tv == true){
		if(kuandai_combination["tvType"] === "0"){
			$scope.tvShow = false;
			$scope.orderinfo.remark += "客户选择：机顶盒自备。";
		}else{
			$scope.orderinfo.remark += "客户选择：机顶盒190元/台。";
		}
	}
	
	
	if(service_type == "cbssLan"){
		if(kuandai_combination["service"]["info"].length){
			$scope.orderinfo.remark += "用户参加"+kuandai_combination["service"]["info"][0].productName+"优惠活动，1年合约期到期后恢复原资费。"
		}
	}
	
	// 56 88 号码预存修正
	if(["wojia-combination-56", "wojia-combination-88", "wojia-combination-88b"].indexOf(service_type) == -1){
		$scope.lanNumberPreCharge = cateInfo["lanNumberPreCharge"]
	}else{
		$scope.lanNumberPreCharge = 100;
		// $scope.orderinfo.leastPreCharge = service_type == "wojia-combination-56" ? 100 : 0;
		$scope.orderinfo.leastPreCharge = 0;
		$scope.orderinfo.preCharge = $scope.orderinfo.leastPreCharge;
		$scope.orderinfo.remark += "本活动为新装融合业务用户专享。赠送速率为"+kuandai_combination["broadband"].productInfo.flowTmp+"Mbps宽带一年，办理次月生效，次年宽带资费按照标准资费执行。";
	}

	if(service_type == "cbssLan"){
		if(kuandai_combination["service"]["info"].length){
			$scope.orderinfo.remark += "用户参加"+kuandai_combination["service"]["info"][0].productName+"优惠活动，1年合约期到期后恢复原资费。"
		}
	}

	
	if(shopInfo.shopBo.city == "7100000"){
		$scope.orderinfo.remark = "用户宽带套餐合约期不少于12个月，用户离网时须交回宽带终端设备（智能网关、机顶盒）。"
	}
	if(kuandai_combination.terminalsRemark){
		$scope.orderinfo.remark = kuandai_combination.terminalsRemark + $scope.orderinfo.remark;
	}
	
	if(wx_order.orderCode){
		if(wx_order["verifyCode"]){
			$scope.orderinfo.remark = "号码之家线上宽带，需装机人员取卡收费，实名认证验证码：" + wx_order["verifyCode"] + "。" + $scope.orderinfo.remark;
		}else{
			$scope.orderinfo.remark = "号码之家实名后置宽带。" + $scope.orderinfo.remark;
		}
	}
	
	$scope.orderinfo.remark += "接入速率按照项目网络实际接入能力提供服务。客户联系电话：" + authentication["contractNumber"] + "。";

	// 购机赠费修正
	$scope.activity_price = function(tel){
		var activity_price = kuandai_tel_package_list[tel].activity.sub_productList[0]["price"];
		if(activity_price == undefined){
			activity_price = kuandai_tel_package_list[tel].activity.sub_elementList[0]["elementName"];
			var priceL = activity_price.indexOf("预存");
			if(priceL == "-1"){
				activity_price = 0;
			}else{
				activity_price = activity_price.substring(priceL, activity_price.indexOf("元", priceL)).replace(/[^\d]/g, "");
			}
			kuandai_tel_package_list[tel].activity.sub_productList[0]["price"] = activity_price;
		}
		return Number(activity_price);
	}

	

	$scope.telList = [];

	if(service_type == "wojia-ronghe" || service_type == "wojia-share-suburb"){
		for(var i in kuandai_tel){
			$scope.telList.push({"tel":kuandai_tel[i]["tel"], "preCharge":kuandai_tel[i]["preCharge"], "activity":""});
		}
	}else{
		for(var row in kuandai_tel){
			var arr = [],numberCharge;
			arr["tel"] = row;
			if(kuandai_tel[row]["originalPreCharge"] != undefined){
				kuandai_tel[row]["preCharge"] = kuandai_tel[row]["originalPreCharge"];
			}
			if(kuandai_tel[row].isOldNumber == true){
				//if(kuandai_tel[row].editPackage == false)
				arr["preCharge"] = 0;
				arr["isOldNumber"] = kuandai_tel[row].isOldNumber;
				if(kuandai_tel_package_list[row].activity){
					if(kuandai_tel_package_list[row].activity.sub_productList.length){
						arr["activity"] = kuandai_tel_package_list[row].activity.sub_productList[0]["productName"];
					}else{
						arr["activity"] = "没有选择活动";
					}
				}else{
					arr["activity"] = "保留老套餐的活动";
				}
			}else{
				if (kuandai_tel_package_list[row].activity.sub_productList.length){
					arr["activity"] = kuandai_tel_package_list[row].activity.sub_productList[0]["productName"];
					arr.activityShow = true;
					// console.log();
					// numberCharge = $scope.lanNumberPreCharge - $scope.activity_price(row);
					// console.log(numberCharge)
					// numberCharge = numberCharge > 0 ? numberCharge : 0;
					// console.log(numberCharge)
					//numberCharge = numberCharge > kuandai_tel[row]["preCharge"] ? numberCharge : kuandai_tel[row]["preCharge"];
					var activityPrice = $scope.activity_price(row);
					var chargeMax = Math.max($scope.lanNumberPreCharge, kuandai_tel[row]["preCharge"]);
					numberCharge = activityPrice > chargeMax ? 0 : chargeMax - activityPrice;
				}else{
					arr["activity"] = "没有选择活动";
					numberCharge = kuandai_tel[row]["preCharge"];
				}
				kuandai_tel[row]["originalPreCharge"] = kuandai_tel[row]["preCharge"];
				kuandai_tel[row]["preCharge"] = Number(numberCharge);
				kuandai_tel[row]["leastPreCharge"]  = Number(numberCharge);
				arr["preCharge"] = numberCharge;
			}

			// 99 冰激凌 沃4G+畅爽本地套餐36元（西安） 宽带预存可为 0, 号码预存为 100
			if(["90311029","90311053","90339630","90381159","90356344","90356346"].indexOf(kuandai_tel_package_list[row]["sub_productObj"]["productId"]) != -1){
				$scope.orderinfo.leastPreCharge = 0;
				$scope.orderinfo.preCharge = $scope.orderinfo.leastPreCharge;

				if(Number(kuandai_tel[row]["originalPreCharge"]) > 100){
					numberCharge = kuandai_tel[row]["originalPreCharge"];
				}else if(kuandai_tel_package_list[row].activity.sub_productList.length){
					numberCharge = "0";
				}
				else{
					numberCharge = "100";
				}

				if(kuandai_tel[row].isOldNumber){
					kuandai_tel[row]["preCharge"] = Number(0);
					kuandai_tel[row]["leastPreCharge"]  = Number(0);
					arr["preCharge"] = 0;

				}else{
					kuandai_tel[row]["preCharge"] = Number(numberCharge);
					kuandai_tel[row]["leastPreCharge"]  = Number(numberCharge);
					arr["preCharge"] = numberCharge;
				}
			}
			// 99 冰激凌 修正完成
			arr["packageName"] = kuandai_tel_package_list[row]["sub_productObj"]["productName"];
			if(!arr["packageName"]){
				arr["packageName"] = kuandai_oldNumberProductList[row] ? kuandai_oldNumberProductList[row][0]["productName"] : "";
			}
			$scope.telList.push(arr);
		}
		$scope.input.editTelShow = false;
		$scope.telActivityShow = true;		
		$scope["combinationTelList"] = true;
		if($scope.telList.length == 0){
			$scope.numberInfo = true;
		}
	}

	// 宽带活动
	if(kuandai_combination['broadband']["activity"]["lanproduct"].length){
		$scope["wojiaActivity"] = true;
		$scope["orderinfo"]["activity"] = kuandai_combination['broadband']["activity"]["lanproduct"][0]["productName"];
	}else{
		$scope["wojiaActivity"] = false;
	}

	$scope.orderinfoFee = function(){
		var orderinfoActivity = 0;
		var telAmount = 0;
		if(kuandai_combination['broadband']["activity"]["lanproduct"].length){
			orderinfoActivity = kuandai_combination['broadband']["activity"]["lanproduct"][0]["price"];
		}
		for(var i in kuandai_tel){
			if(kuandai_tel_package_list[i].activity && kuandai_tel_package_list[i].activity.sub_productList.length){
				telAmount += Number($scope.activity_price(i)) + Number(kuandai_tel[i]["preCharge"]);
			}else{
				telAmount += Number(kuandai_tel[i]["preCharge"]);
			}
		}
		$scope["orderinfo"]["fee"] = 
			Number(telAmount) + 
			Number(orderinfoActivity) + 
			Number($scope["orderinfo"]["preCharge"]) + 
			Number(kuandai_combination["tvPrice"]) + 
			Number(kuandai_combination["ftthPrice"])+
			Number(kuandai_combination.fee_8376 ? Number(kuandai_combination.fee_8376) : 0)+
			Number(kuandai_combination.fee_8234 ? Number(kuandai_combination.fee_8234) : 0)-
			Number($scope.orderinfo.fee_8234_jm);
	}
	$scope.orderinfoFee();



	$scope.editKDPreCharge = function() {
		if(wx_order.orderCode){
			return;
		}
		$ionicPopup.show({
			"template": '<input type="tel" ng-model="input.preCharge" placeholder="金额不能少于'+$scope.orderinfo.leastPreCharge+'元">',
			"title": '输入宽带预存金额',
			"scope": $scope,
			"buttons":[
				{"text":'取消'},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						if (!$scope.input.preCharge) {
							e.preventDefault();
						} else {
							$scope.orderinfo.preCharge = $scope.input.preCharge > $scope.orderinfo.leastPreCharge ? $scope.input.preCharge : $scope.orderinfo.leastPreCharge;
							// 临时跟两个工号 开放预存顺便填
							if(cbssInfo.username == "141690691" || cbssInfo.username == "141690627"){
								$scope.orderinfo.preCharge = $scope.input.preCharge;
							}
							
							$scope.input.preCharge = "";
							$scope.orderinfoFee();
						}
					}
				},
			]
		});
	}

	$scope.editTelPreCharge = function(i) {
		if(!wojiaIsronghe){
			$ionicPopup.show({
				"template": '<input type="tel" ng-model="input.preCharge" placeholder="金额不能少于'+kuandai_tel[i].leastPreCharge+'元">',
				"title": '输入<'+kuandai_tel[i].tel+'>预存金额',
				"scope": $scope,
				"buttons":[
					{"text":'取消'},
					{
						"text": '<b>确认</b>',
						"type": 'button-calm',
						"onTap": function(e) {
							if (!$scope.input.preCharge) {
								e.preventDefault();
							} else {
								kuandai_tel[i].preCharge = Number($scope.input.preCharge > kuandai_tel[i].leastPreCharge ? $scope.input.preCharge : kuandai_tel[i].leastPreCharge);
								// 临时跟两个工号 开放预存顺便填
								if(cbssInfo.username == "141690691" || cbssInfo.username == "141690627"){
									kuandai_tel[i].preCharge = $scope.input.preCharge;
								}

								for(var ii in $scope.telList){
									if(Number($scope.telList[ii]["tel"]) == Number(i)){
										$scope.telList[ii]["preCharge"] = kuandai_tel[i].preCharge;
									}
								}
								$scope.input.preCharge = "";
								$scope.orderinfoFee();
							}
						}
					},
				]
			});
		}
	}





	$scope.order = function()
	{
		kuandai_combination['broadband']["tv"]["lanproduct"] = [];
		kuandai_combination["broadband"]["tv"]["lanelementlist"] = [];
		kuandai_combination["combination"]["ElementList1-5G"] = [];

		if(service_type != "cbssLan"){
			kuandai_combination_list[0].lanProductListTv = [];
			kuandai_combination_list[0].lanElementListTv = []
		}
	
		// tv包
		if(kuandai_selected_package.tv == true){
			$http({
				method: 'GET',
				url: kuandai_selected_package["tv_type"] + ".json"
			}).success(function(return_json){
				for(var i in return_json["lanelementlist"]){
					kuandai_combination["broadband"]["tv"]["lanelementlist"].push(return_json["lanelementlist"][i]);
					if(service_type != "cbssLan"){
						kuandai_combination_list[0].lanElementListTv.push(return_json["lanelementlist"][i]);
					}
				}
				kuandai_combination['broadband']["tv"]["lanproduct"].push(return_json["lanproduct"]);
				if(service_type != "cbssLan"){
					kuandai_combination_list[0].lanProductListTv.push(return_json["lanproduct"]);
				}
				$scope.G15();
			})
		}else{
			$scope.G15();
		}
	}


	$scope.G15 = function(){
		if(kuandai_selected_package["1-5G"] == true){
			$http({
				method: 'GET',
				url: "data/wojia-ronghe-1-5G.json"
			}).success(function(return_json){
				kuandai_combination["combination"]["ElementList1-5G"].push(return_json);
				$scope.stateGo();
			})
		}else{
			$scope.stateGo();
		}
	}


	$scope.stateGo = function(){
		kuandai_combination["preCharge"] = $scope.orderinfo["preCharge"];
		kuandai_combination["remark"] = $scope.orderinfo["remark"];
		kuandai_combination["amount"] = $scope.orderinfo["fee"];
		if(service_type != "cbssLan"){
			kuandai_combination_list[0]["lanInfoList"].preCharge = $scope.orderinfo["preCharge"];
			kuandai_combination_list[0]["lanInfoList"].fee_8234 = kuandai_combination.fee_8234;
			kuandai_combination_list[0]["lanInfoList"].fee_8376 = kuandai_combination.fee_8376;
		}
		if(wx_order.orderCode && authentication["sign"]){
			$state.go(jump[service_type]["signature"]);
		}else{
			$state.go("signature");
		}
	}

	//修改备注
	$scope.updateRemark = function(){
		$scope.input = {
			"remark":$scope.orderinfo.remark
		}
		var temp = '<textarea class="bd pl-10" ng-model="input.remark" style="min-height:27vh;" placeholder="输入备注信息"></textarea>';
		$ionicPopup.show({
			template: temp,
			title: '更改备注',
			subTitle: '输入要更改的备注',
			scope: $scope,
			buttons: [
				{ 	text: '取消',
					onTap:function(){
						$scope.orderinfo.remark = $scope.orderinfo.remark;
					}
				},
				{
					text: '<b>确定</b>',
					type: 'button-calm',
					onTap: function() {
						$scope.orderinfo.remark = $scope.input.remark;
					}
				},
			]
		});
	}
	//取消工料费
	$scope.cancelMaterialFee = function() {
		if(wx_order.orderCode){
			return;
		}
		$ionicPopup.show({
			"template": '<input type="tel" ng-model="input.materialFee" placeholder="请修改工料费">',
			"title": '输入工料费',
			"scope": $scope,
			"buttons":[
				{"text":'取消',
					"onTap": function(e) {
						$scope.input.materialFee = '';
					}
				},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						$scope.orderinfo.fee_8234_jm = $scope.input.materialFee;
						kuandai_combination.fee_8234_jm = $scope.input.materialFee;
						$scope.orderinfoFee();
					}
				},
			]
		});
	}
});
