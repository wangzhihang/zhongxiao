appControllers.controller('kuandai-wojia-select-terminals', function ($scope, $state, $ionicPopup, $cordovaBarcodeScanner, my) {
	$scope.title = "选择设备";
	$scope.mac = {
		"ftthMacAddress": "",
		"tvMacAddress": ""
	}
	kuandai_combination.fee_8234 = 0;
	kuandai_combination.fee_8376 = 0;
	$scope.macAddressShow = true;

	$scope.select = {
		"tvLi": {},
		"ftthLi": {}
	}

	$scope.terminalsConfig = {}
	if (service_type == "cbssLan") {
		if (kuandai_combination["broadband"].config &&
			kuandai_combination["broadband"].config.wojia &&
			kuandai_combination["broadband"].config.wojia.terminals) {
			$scope.terminalsConfig = kuandai_combination["broadband"].config.wojia.terminals;
		}
	} else {

	}

	// 西安新设备
	if (shopInfo.shopBo.city == "7100000") {
		$scope.showTip = true;
		$scope.terminalsConfig = {
			"tv": [{
					"id": "0",
					"productName": "用户自备",
					"price": "0"
				},
				{
					"id": "2",
					"productName": "免费使用",
					"price": "0"
				}
			],
			"ftth": [{
					"id": "0",
					"productName": "用户自备",
					"price": "0"
				},
				{
					"id": "2",
					"productName": "免费使用",
					"price": "0"
				}
			],
			"price": {
				"0_0": {
					"fee_8376":"0",
					"fee_8234": "100",
					"remark": "宽带终端自备，享受家庭组网业务套包服务。",
				},
				"0_2": {
					"fee_8376":"0",
					"fee_8234":"100",
					"remark": "免费使用智能网关1台，离网退回。享受家庭组网业务套包服务。",
				},
				"2_0": {
					"fee_8376": "190",
					"fee_8234": "0",
					"remark": "免费使用4K机顶盒1台，离网退回。享受家庭组网业务套包服务。"
				},
				"2_2": {
					"fee_8376": "190",
					"fee_8234": "100",
					"remark": "免费使用智能网关+4k机顶盒，离网退回。享受家庭组网业务套包服务。"
				},
			}
		}
	}

	// 机顶盒选项
	$scope.tvList = [{
			"id": "0",
			"productName": "用户自备(￥:0.00)",
			"price": "0"
		},
		{
			"id": "E",
			"productName": "电视机顶盒款代收款(￥:190.00)",
			"price": "190"
		}
	];

	// 引流机顶盒选择
	if (wx_order.orderCode) {
		if (wx_order.tv) {
			$scope.tvList = [$scope.tvList[1], $scope.tvList[2]];
		} else {
			$scope.tvList = [$scope.tvList[0]];
		}
	}
	// 渭南 榆林 宝鸡 商洛 收取100元押金
	var terminals_price = ["7140000", "7190000", "7210000", "7260000"]
	if (terminals_price.indexOf(shopInfo.shopBo.city) !== -1) {
		$scope.tvList.push({
			"id": "5",
			"productName": "终端租用-中档资费(￥:100.00)",
			"price": "100"
		})
	}

	if (kuandai_selected_package.tv == true) {} else {
		$scope.tvList = [$scope.tvList[0]];
		$scope.select.tvLi = $scope.tvList[0];
	}
	$scope.select.tvLi = $scope.tvList[0];

	// 河南临时
	if (shopInfo.shopBo.city == "4730000") {
		$scope.tvList = [{
			"id": "2",
			"productName": "免费使用(￥:0.00)",
			"price": "0"
		}];
		$scope.select.tvLi = $scope.tvList[0];
		$scope.macAddressShow = false;
	}

	// 配置文件
	if ($scope.terminalsConfig.tv) {
		$scope.tvList = $scope.terminalsConfig.tv;
		$scope.select.tvLi = $scope.tvList[0];
	}


	// 机顶盒MAC地址
	$scope.switchTv = function (id) {
		if (id === "0" && kuandai_selected_package.tv != true) {
			$scope.macAddressShow = false;
			$scope.mac.tvMacAddress = "";
		} else {
			$scope.macAddressShow = true;
		}
		if (["4730000", "7100000"].indexOf(shopInfo.shopBo.city) !== -1) {
			$scope.macAddressShow = false;
			$scope.mac.tvMacAddress = "";
		}
	}
	$scope.switchTv($scope.select.tvLi["id"]);


	// ftth
	$scope.ftthShow = kuandai_combination_address["detailed"]["cbAccessTypeName"].indexOf("FTTH") !== -1;
	if ($scope.terminalsConfig.ftthShow !== undefined) {
		$scope.ftthShow = Boolean($scope.terminalsConfig.ftthShow)
	}
	$scope.ftthMode = "A001";

	$scope.ftthList = [{
			"id": "0",
			"productName": "用户自备(￥:0.00)",
			"price": "0"
		},
		{
			"id": "C",
			"productName": "ONU终端设备代收款(￥:180.00)",
			"price": "180"
		}
	];

	if (terminals_price.indexOf(shopInfo.shopBo.city) !== -1) {
		$scope.ftthList.push({
			"id": "5",
			"productName": "终端租用-中档资费(￥:100.00)",
			"price": "100"
		})
	}
	// 河南临时
	if (shopInfo.shopBo.city == "4730000") {
		$scope.ftthList[1] = {
			"id": "3",
			"productName": "ONU终端销售(￥:99.00)",
			"price": "99"
		};
		for (var row in kuandai_tel) {
			if (kuandai_tel_package_list[row].sub_productObj.productId == "90131367") {
				$scope.ftthList[1] = {
					"id": "3",
					"productName": "ONU终端销售(￥:0.00)",
					"price": "0"
				};
			}
		}
	}

	// 铜川号码之家激励政策
	if (["7270000"].indexOf(shopInfo.shopBo.city) !== -1) {
		$scope.ftthList.push({
			"id": "5",
			"productName": "终端租用-激励政策(￥:0.00)",
			"price": "0"
		})
	}

	// 引流光猫选择
	if (wx_order.orderCode) {
		if (wx_order.ftth) {
			$scope.ftthList = [$scope.ftthList[1]]
		} else {
			$scope.ftthList = [$scope.ftthList[0]]
		}
	}

	if ($scope.terminalsConfig.ftth) {
		$scope.ftthList = $scope.terminalsConfig.ftth;
	}
	$scope.select.ftthLi = $scope.ftthList[0];


	$scope.order = function () {
		var txt = $scope.mac.tvMacAddress.replace(/[^A-Za-z0-9]/g, "");
		$scope.mac.tvMacAddress = txt.substring(0, 3) == "MAC" ? txt.substring(3) : txt;

		kuandai_combination["tvMacAddress"] = $scope.mac.tvMacAddress;
		kuandai_combination["ftthMacAddress"] = $scope.mac.ftthMacAddress;
		kuandai_combination["tvType"] = $scope.select.tvLi["id"]; // 机顶盒 类型
		kuandai_combination["ftthType"] = $scope.select.ftthLi["id"]; // ftth光猫类型 
		kuandai_combination["tvPrice"] = $scope.select.tvLi["price"];
		kuandai_combination["ftthPrice"] = $scope.select.ftthLi["price"];
		kuandai_combination["ftthMode"] = $scope.ftthMode;

		if ($scope.terminalsConfig.price) {
			var i = sprintf(
				"{tvId}_{ftthId}", {
					tvId: $scope.select.tvLi["id"],
					ftthId: $scope.select.ftthLi["id"]
				})
			if ($scope.terminalsConfig.price[i]) {
				kuandai_combination.fee_8234 = $scope.terminalsConfig.price[i].fee_8234;
				kuandai_combination.fee_8376 = $scope.terminalsConfig.price[i].fee_8376;
				kuandai_combination.terminalsRemark = $scope.terminalsConfig.price[i].remark;
				kuandai_combination.ftthMode = $scope.terminalsConfig.price[i].ftthMode ?
					$scope.terminalsConfig.price[i].ftthMode :
					kuandai_combination.ftthMode;
				if ($scope.terminalsConfig.price[i].tvType !== undefined) {
					kuandai_combination["tvType"] = $scope.terminalsConfig.price[i].tvType;
				}
				if ($scope.terminalsConfig.price[i].ftthType !== undefined) {
					kuandai_combination["ftthType"] = $scope.terminalsConfig.price[i].ftthType;
				}
			}
		}

		// 河南临时
		if ($scope.select.tvLi["id"] == "0" || ["4730000", "7100000"].indexOf(shopInfo.shopBo.city) !== -1 || kuandai_combination["tvMacAddress"].length > 1) {
			if(service_type != "cbssLan"){
				$scope.combinationAddTwo();
			}
			// $state.go(jump[service_type]["confirm"]);
			$state.go("kuandai-wojia-order-confirm");
		} else {
			my.alert("请填写正确的机顶盒串码，可以直接扫描条形或二维码!");
		}
	}


	$scope.combinationAddTwo = function () {
		var kuandai_combination_json = {
			"mainLanProductList": kuandai_combination["broadband"].productInfo,
			"lanProductList": kuandai_combination["broadband"].lanproduct
				.concat(kuandai_combination["service"]["info"]),
				// .concat(kuandai_combination["broadband"].tv.lanproduct),
			"lanProductListTv":[],
			"lanElementList": kuandai_combination["broadband"].lanelementlist
				.concat(kuandai_combination["service"]["ElementList"]),
				// .concat(kuandai_combination["broadband"].tv.lanelementlist),
			"lanElementListTv":[],
			"lanInfoList": {
				"gateWayFee": String(Number(kuandai_combination["ftthPrice"])), // 光猫费用
				"telBoxFee": String(Number(kuandai_combination["tvPrice"])), // 机顶盒费用
				"fee_8234": kuandai_combination.fee_8234 ? "0" : kuandai_combination.fee_8234, // 单宽体验版
				"fee_8376": kuandai_combination.fee_8376 ? "0" : kuandai_combination.fee_8376,
				"preCharge": "0", // 预存

				"feetype": kuandai_combination["tvType"], // tv 机顶盒 类型
				"macaddress": kuandai_combination["tvMacAddress"], // 机顶盒 MAC
				"developCode": cbssInfo["developCode"],
				"townFlag": (service_type == "wojia-share-suburb" ? "C" : "T"),
				"terminaltype": kuandai_combination["ftthType"], // ftth光猫
				"terminalSrcMode": kuandai_combination["ftthMode"], // 光猫类型 ftth:A002,其他:A001
				"address": kuandai_combination_address["setupaddress"],
				"acctPasswd": "123456",
			},
			"addressInfoList": {
				"cbAccessType": kuandai_combination_address["detailed"]["cbAccessType"],
				"pointExchId": kuandai_combination_address["detailed"]["pointExchId"],
				"areaExchId": kuandai_combination_address["detailed"]['areaExchId'],
				"speed": String(kuandai_combination["broadband"].productInfo.flowTmp),
				"accessType": kuandai_combination_address["detailed"]["accessType"],
				"addressId": kuandai_combination_address["addressCode"],
				"addressName": kuandai_combination_address["addressName"]
			}
		}
		kuandai_combination_list = [(JSON.parse(JSON.stringify(kuandai_combination_json)))];
	}



	$scope.tvMac = function () {
		$cordovaBarcodeScanner
			.scan()
			.then(function (barcodeData) {
				if (barcodeData.text) {
					var txt = barcodeData.text.replace(/[^A-Za-z0-9]/g, "");
					$scope.mac.tvMacAddress = txt.substring(0, 3) == "MAC" ? txt.substring(3) : txt;
				}
			});
	};
});