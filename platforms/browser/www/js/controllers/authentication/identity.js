appControllers.controller('authentication-device', function($scope, $state, ble, my) {

	$scope.title = "选择校验设备";
	$scope.nfcShow = device.platform == "iOS";
	// 设备状态 active
	$scope.btnActive = {"nfc":false, "ble":false};
	// find Btn文字
	$scope.btnText = {"nfc":"选用NFC", "ble":"搜索蓝牙","pho":"打开拍照"}
	// 蓝牙状态 true:hide(class);[0]:搜索蓝牙设备box,[1]:找不到蓝牙,[2]:蓝牙设备列表
	$scope.bleDiv = [true, true, true];
	// 蓝牙设备列表
	$scope.bleadderDatas = [];
	$scope.bleHistory = "";

	$scope.readOk = false;
	$scope.readOkText = "";

	$scope.nfcShow=false;
	$scope.belShow=false;
	$scope.phoShow=false;
	$scope.isShowChange=false;
	$scope.IFcamera=false;
	if(shopInfo.shopBo.city == "6100000" || shopInfo.shopBo.city == "1630000" || agencyId == "20"){
		$scope.IFcamera = true;
	}


	//当第一次选择设备后隐藏其他
	$scope.isShowChange=false;
	$scope.firstBeChose=function(){
		$scope.localDevice=localStorage.getItem('isChoseDevice');
		if($scope.localDevice==null){
			$scope.nfcShow=true;
			$scope.belShow=true;
			$scope.phoShow=true;
		}else if($scope.localDevice=='nfc'){
			$scope.nfcShow=true;
			$scope.isShowChange=true;
			return;
		}else if($scope.localDevice=='ble'){
			$scope.belShow=true;
			$scope.isShowChange=true;
			return;
		}else if($scope.localDevice=='pho'){
			if(shopInfo.shopBo.city == "6100000" || shopInfo.shopBo.city == "1630000"){
				$scope.phoShow=true;
			} else {
				$scope.belShow=true;
			}
			$scope.isShowChange=true;
			return;
		}
	}
	$scope.firstBeChose();
	//点击更换设备显示所欲设备
	$scope.showAllDevice=function(){
		$scope.nfcShow=true;
		$scope.belShow=true;
		$scope.isShowChange=false;
		if(shopInfo.shopBo.city == "6100000" || shopInfo.shopBo.city == "1630000"){
			$scope.phoShow = true;
		}
	}

	// 打开拍照设备
	$scope.open_pho=function(){
		$scope.nfcShow=false;
		$scope.belShow=false;
		$scope.isShowChange=true;
		localStorage.setItem('isChoseDevice','pho');
		$state.go('pho-identy-front');
	}

	$scope.read_nfc = function (){
		$scope.belShow=false;
		$scope.phoShow=false;
		$scope.isShowChange=true;
		if(!($scope.btnActive.nfc || $scope.btnActive.ble)){
			$scope.btnActive.nfc = true;
			$scope.bleDiv[0] = true;
			ble.BLEconnectServer().then(function(){
				SelectDevice = "nfc";
				$state.go("authentication-readIDCard");
			}, function(){
				$scope.btnActive.nfc = false;
				my.alert('解码服务器不可用,请将手机连接到网络上!');
			})
		}
		localStorage.setItem('isChoseDevice','nfc');
	}


	$scope.find_ble= function(){
		$scope.nfcShow=false;
		$scope.phoShow=false;
		$scope.isShowChange=true;
		localStorage.setItem('isChoseDevice','ble');
		$scope.ble = false;
		$scope.bleDiv = [false, true, true];
		$scope.btnText["ble"] = "蓝牙设备搜索中...";
		$scope.bleHistory = bleHistory.name;
		if(!($scope.btnActive.ble || $scope.btnActive.nfc)){
			$scope.btnActive.ble = true;
			ble.BLEfind().then(function(data){
				$scope.bleDiv[1] = true;
				$scope.bleDiv[2] = false;
				$scope.btnActive.ble = false;	// 蓝牙设备搜索重新可用
				$scope.btnText["ble"] = "重新搜索蓝牙设备";
				$scope.bleadderDatas = data;
			}, function(){
				$scope.bleDiv[1] = false;
				$scope.bleDiv[2] = true;
				$scope.btnActive.ble = false;	// 蓝牙设备搜索重新可用
				$scope.btnText["ble"] = "重新搜索蓝牙设备";
			})
		}
		
	};



	$scope.scan_ble = function(data){
		BLEcurrDevice = data;
		localStorage.setItem("bleHistory", JSON.stringify(BLEcurrDevice));
		$scope.scan_ble_ok();
	}

	$scope.scan_ble_ok = function(){
		SelectDevice = "ble";
		$state.go("authentication-readIDCard");
	}
	// 已连接的设备
	if ( SelectDevice = "ble" && BLEcurrDevice) {
		$scope.bleMark = BLEcurrDevice;
		$scope.ble = true;
		$scope.bleDiv[0] = true;
	}

	var bleHistory = str2json(localStorage.getItem("bleHistory"));
	if(bleHistory.name){
		$scope.bleadderDatas = [bleHistory];
	}else{
		$scope.bleadderDatas = [];
	}

	

})


.controller('authentication-readIDCard', function($scope, $state,$http, $rootScope, $timeout, ble, unicomm_server, my) {

	$scope.startlat = 108.897654; // 纬度
	$scope.startlng = 34.242316; // 经度
	$scope.coordinateCity = ""; // 所在城市
	cordova.plugins.locationPlugin.getLocation(function(location) {
		$scope.startlat = location.split(",")[0] - 0;
		$scope.startlng = location.split(",")[1] - 0;
		$scope.coordinateCity = location.split(",")[2] ? location.split(",")[2] : "";
	});


	$scope.title = "读取身份证";
	$scope.idInfo = {}; 	// 身份信息

	// 读取身份证 初始和成功 div 控制
	$scope.div_displayState = [false, true];
	// 按钮显示控制 蓝牙读取 读取成功 重新验证
	$scope.btn_displayState = [true, false, false];

	$scope.nfc_readCard = function(){
		$scope.readingId = true;
		$scope.tipsTxt = '请将身份证，放置到NFC探测器。';
		ble.NFCreadIdentity().then(function(data){
			$scope.readingId = false;
			$scope.idInfo = data;
			$scope.checkProduct();
		}, function(){
			$scope.readingId = true;
			$scope.tipsTxt = '<span class="assertive">请将身份证，移开后重新放置到NFC探测器。</span>';
			$timeout(function () {
				$scope.nfc_readCard();
			}, 2*1000);
		})
	}

	$scope.bleLoading = false;
	$scope.ble_readCard = function(){
		$scope.bleLoading = true;
		$scope.btn_displayState = [false, false, false];
		ble.BLEreadIdentity().then(function(data){
			$scope.bleLoading = false;
			$scope.idInfo = data;
			if(endDateDiff($scope.idInfo.list["end_date"])){
				if(yearsCompareAge($scope.idInfo.list["birthday"])){
					$scope.checkProduct();
				}else{
					$scope.readCard_no("不满16周岁用户入网只能在自有营业厅办理!");
				}
			}else{
				$scope.readCard_no("身份证已过期!");
			}
		}, function(){
			$scope.bleLoading = false;
			$scope.readCard_no("身份信息获取失败,请重新放置居民身份证!");
		})
	}




	// 特殊套餐办理判断
	$scope.checkProduct = function(){
		if(scanCode_order.name && scanCode_order.cardId){
			if($scope.idInfo.list["cardId"] != scanCode_order.cardId){
				$scope.readCard_no("非意向用户本人身份证!");
				return ;
			}
		}

		if(app == "kuandai" || app == "jike"){
			if(number_pool == "CBSS"){
				$scope.cbss_checkpsptByGzt();
			}else{
				$scope.bss_customer_validcustomer();
			}
		}else{
			$scope.div_displayState = [true, false];
			$scope.btn_displayState = [false, false, false];
			$scope.readOk = true;
			$scope.readOkText = "特殊套餐验证";
			$scope.validationStep = "checkProduct";

			if(number_pool == "CBSS"){
				$scope.cbss_checkpsptByGzt();
			}else if(number_pool == "BSS"){
				$scope.bss_customer_validcustomer();
			}else if(number_pool == "QRGO2" || number_pool == "QRGO"){
				$scope.readCard_ok();
			}

			// if(order_type == "kaika" && number_pool == "CBSS"){
			// 	if(service_type == "cbssSemiManufactures"){
			// 	}else{
			// 		order_info = {};
			// 	}
			// 	order_info["number"] = telInfo['tel'];
			// 	order_info["productId"] = changeOrderInfo?changeOrderInfo.oldProductId:dianpu_cbss_package_array["sub_productObj"]["productId"];
			// 	order_info["productName"] = changeOrderInfo?changeOrderInfo.oldProductInfo[0].PRODUCT_NAME:dianpu_cbss_package_array.sub_productObj.productName;
			// }

	

			// if(service_type == "cbssFuka"){
			// 	order_info["number"] = telInfo['tel'];
			// 	order_info["productId"] = "89128067";
			// 	order_info["productName"] = "4G副卡";
			// }

			// if(service_type == "cbssDealerreturn"){
			// 	order_info = {
			// 		"number":dianpu_dealerreturn['number'],
			// 		"productId":"",
			// 		"productName":""
			// 	}
			// }
			// if(number_pool == "CBSS"){
			// 	$scope.cbss_checkpsptByGzt();
			// }else if(number_pool == "BSS"){
			// 	$scope.bss_customer_validcustomer();
			// }else if(number_pool == "QRGO2" || number_pool == "QRGO"){
			// 	$scope.readCard_ok();
			// }
			// $http({
			// 	"method": 'GET',
			// 	"url": ajaxurl + 'orderApp/checkProduct',
			// 	"params": {
			// 		"token":$rootScope.token,
			// 		"cardId":$scope.idInfo.list["cardId"],
			// 		"orgCode":userBo.orgCode,
			// 		"productId":order_info["productId"],
			// 		"productName":order_info["productName"]
			// 	}
			// }).success(function(data){
			// 	if(data.status == "1"){
			// 		if(number_pool == "CBSS"){
			// 			$scope.cbss_checkpsptByGzt();
			// 		}else if(number_pool == "BSS"){
			// 			$scope.bss_customer_validcustomer();
			// 		}else if(number_pool == "QRGO2" || number_pool == "QRGO"){
			// 			$scope.readCard_ok();
			// 		}
			// 	}else{
			// 		my.alert(data.msg).then(function(){$state.go("index");})
			// 	}
			// }).error(function(data){
			// 	$scope.readCard_no_validation();
			// });
		}
	}


	// 国政通
	$scope.bss_customer_validcustomer = function(){
		$scope.div_displayState = [true, false];
		$scope.btn_displayState = [false, false, false];
		$scope.readOk = true;
		$scope.readOkText = "身份证国政通验证中";
		$scope.validationStep = "bss_customer_validcustomer";
		unicomm_server.bssLogin(bssInfo.username ? bssInfo : bssInfoHaoma).then(function(){
			unicomm_server.getUnicomm({
				"cmd":"bss_customer_validcustomer",
				"psptId":$scope.idInfo.list["cardId"],
				"custName":$scope.idInfo.list["name"]
			}, 30000).then(function(data){
				if(data.status == "1"){
					if(data.data.RESP_CODE == "0000" || data.data.certName == $scope.idInfo.list["name"]){
						$scope.readCard_ok();
					}else{
						$scope.readCard_no(data.data.RESP_DESC + "<span style='color:#F00'>请使用其他身份证!</span>");
					}
				}else{
					if(alertInfoError(data.data)){
						$scope.readCard_no_validation("联通服务器请求失败，请点击重新验证按钮！");
					}else{
						$scope.readCard_no(data.data + "<span style='color:#F00'>请使用其他身份证!</span>");
					}
				}
			}, function(){
				$scope.readCard_no_validation("联通服务器请求失败，请点击重新验证按钮！");
			})
		}, function(){
			$scope.readCard_no_validation();
		});	
	}

	$scope.cbss_checkpsptByGzt = function(){
		$scope.div_displayState = [true, false];
		$scope.btn_displayState = [false, false, false];
		$scope.readOk = true;
		$scope.readOkText = "国政通验证中";
		$scope.validationStep = "cbss_checkpsptByGzt";
		// if(cbss_huabei === 1){

		// }

		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_checkpsptByGzt",
				"custName":$scope.idInfo.list['name'],
				"psptId":$scope.idInfo.list['cardId']
			}).then(function(result_json){
				if(result_json.status == "1"){
					$scope.cbss_customer_isblack();
				}else{
					if(result_json.data == "国政通验证失败"){
						$scope.readCard_no("国政通验证失败，请使用其他身份证!");	
					}else{
						$scope.cbss_customer_isblack();
					}
				}
			},function(){
				$scope.readCard_no("国政通验证失败(系统)，请使用其他身份证!");	
			});
		})
	}

	$scope.cbss_customer_isblack = function(){
		$scope.div_displayState = [true, false];
		$scope.btn_displayState = [false, false, false];
		$scope.readOk = true;
		$scope.readOkText = "身份证联通黑户验证中";
		$scope.validationStep = "cbss_customer_isblack";
		if(service_type == "cbssLan" || cbss_huabei === 1){
			$scope.readCard_ok();
			return ;
		}
		unicomm_server.getUnicomm({
				"cmd":"cbss_customer_isblack",
				"psptId":$scope.idInfo.list["cardId"],
				"custName":$scope.idInfo.list['name']
		}).then(function(data){
			if(data.status == "1"){
				if(data.data == "0"){
					$scope.cbss_user_checklimit();
				}else{
					if(alertInfoError(data.data)){
						$scope.readCard_no_validation("联通服务器请求失败，请点击重新验证按钮！");
					}else{
						$scope.readCard_no("此用户为<span style='color:#F00'>联通黑户</span>，请使用其他身份证!");
					}	
				}
			}else{
				if(alertInfoError(data.data)){
					$scope.readCard_no_validation("联通服务器请求失败，请点击重新验证按钮！");
				}else{
					$scope.cbss_user_checklimit();
				}
			}
		}, function(){
			$scope.readCard_no_validation();
		})
	}
	// 5户
	$scope.cbss_user_checklimit = function(){
		if(order_type == "kuandai" || service_type == "cbss_fixed"){
			$scope.readCard_ok();
		}else{
			$scope.cbss_user_checklimit_unicomm();
		}
	}
	$scope.cbss_user_checklimit_unicomm = function(){
		$scope.div_displayState = [true, false];
		$scope.btn_displayState = [false, false, false];
		$scope.readOk = true;
		$scope.readOkText = "身份证联通五户验证中";
		$scope.validationStep = "cbss_user_checklimit";
		unicomm_server.getUnicomm({
				"cmd":"cbss_user_checklimit",
				"name": $scope.idInfo.list["name"],
				"psptid": $scope.idInfo.list["cardId"]
		}, 30000).then(function(data){
			if(data.status == "1"){
				$scope.readCard_ok();
			}else{
				if(alertInfoError(data.data)){
					$scope.readCard_no_validation("联通服务器请求失败，请点击重新验证按钮！");
				}else{
					$scope.readCard_no(data.data + "<span style='color:#F00'>请使用其他身份证!</span>");
				}
			}
		},function(){
			$scope.readCard_no_validation();
		})
	}



	$scope.validationStep = "checkProduct";
	$scope.Revalidation = function(){
		$scope.btn_displayState = [false, false, true];
		$scope.readOk = false;
		if($scope.validationStep == "bss_customer_validcustomer"){
			$scope.bss_customer_validcustomer();
		}else if($scope.validationStep == "cbss_checkpsptByGzt"){
			$scope.cbss_checkpsptByGzt();
		}else if($scope.validationStep == "cbss_customer_isblack"){
			$scope.cbss_customer_isblack();
		}else if($scope.validationStep == "cbss_user_checklimit"){
			$scope.cbss_user_checklimit();
		}else if($scope.validationStep = "checkProduct"){
			$scope.checkProduct();
		}
	}




	$scope.readCard_ok = function(){
		$scope.readOk = false;
		if(service_type == "cbssIdCheck"){
			my.alert("此证件可正常使用!");
		}else{
			$scope.btn_displayState = [false, true, false];
		}
	}
	$scope.readCard_no = function(data){
		$scope.readOk = false;
		if(data){
			my.alert(data).then(function(){
				$scope.readCard_no_act();
			});
		}else{
			$scope.readCard_no_act();
		}
	}
	$scope.readCard_no_act = function(){
		$scope.div_displayState = [false, true];
		if(SelectDevice == 'ble'){
			$scope.btn_displayState = [true, false, false];
		}
		else if(SelectDevice == 'nfc'){
			$scope.btn_displayState = [false, false, false];
			$scope.nfc_readCard()
		}
		$scope.idInfo = {};
	}
	$scope.readCard_no_validation = function(data){
		$scope.readOk = false;
		$scope.btn_displayState = [false, false, true];
		if(data){
			my.alert(data);
		}
	}


	$scope.order = function(){
		
		$scope.loading = true;
		$scope.resState = false;

		if(order_type == "kaika" && number_pool == "CBSS"){
			if(service_type == "cbssSemiManufactures"){
			}else{
				order_info = {};
			}
			order_info["number"] = service_type == "cbssDealerreturn" ? dianpu_dealerreturn['number'] : telInfo['tel'];
			order_info["productId"] = dianpu_cbss_package_array.sub_productObj.productId;
			order_info["productName"] = dianpu_cbss_package_array.sub_productObj.productName;
			order_info["activityId"] = (dianpu_cbss_package_array.activity.sub_productList[0] ?  dianpu_cbss_package_array.activity.sub_productList[0].productId : "");
			order_info["activityName"] = (dianpu_cbss_package_array.activity.sub_productList[0] ? dianpu_cbss_package_array.activity.sub_productList[0].productName : "");
		}

		if(service_type == "cbssFuka"){
			order_info = {
				"number":telInfo['tel'],
				"productId":"89128067",
				"productName":"4G副卡"
			}
		}

		authentication["name"] 		= $scope.idInfo.list["name"];
		authentication["cardId"] 	= $scope.idInfo.list["cardId"];
		authentication["idHeadImg"] = $scope.idInfo.list["idHeadImg"];
		authentication["address"] 	= $scope.idInfo.list["address"];
		authentication["start_date"]= $scope.idInfo.list["start_date"];
		authentication["end_date"] 	= $scope.idInfo.list["end_date"];
		authentication["birthday"] 	= $scope.idInfo.list["birthday"];
		authentication["gender"] 	= $scope.idInfo.list["gender"];
		authentication["police"] 	= $scope.idInfo.list["police"];
		authentication["nation"] 	= $scope.idInfo.list["nation"];
		authentication["dn"] 		= $scope.idInfo.list["dn"];

		var data = {
			"name":		authentication["name"],
			"cardId":	authentication["cardId"],
			"idHeadImg":authentication["idHeadImg"],
			"address":	authentication["address"],
			"birthday":	authentication["birthday"],
			"sex":		authentication["gender"],
			"police":	authentication["police"],
			"nation":	authentication["nation"],
			"validEnd":	authentication["end_date"],
			"validStart":	authentication["start_date"],
			"customerImageUrl":"",
			"isCbss":(number_pool == "CBSS" ? "000001" : "000002"),
			"source":source,
			"unicommServer":unicommServer,
			"coordinateCity":$scope.coordinateCity
		}
		// && service_type != "cbss_fixed"
		if(order_type == "kaika"){
			data["type"] 		= "000001";
			data["number"] 		= order_info["number"];
			data["productId"] 	= order_info["productId"];
			data["productName"] = order_info["productName"];
			data["activityId"] 	= order_info["activityId"];
			data["activityName"]= order_info["activityName"];
			data["lnglats"]     = $scope.startlat + "," + $scope.startlng;
		}else if(order_type == "kuandai"){
			data["type"] 		= "000002";
			data["mainProductName"] = KuandaiMainProductName;
		}else if(order_type == "pstn"){
			data["type"] 		= "000003";
			data["number"] 		= dianpu_pstn["followNumber"];
			data["productId"] 	= order_info["productId"];
			data["productName"] = order_info["productName"];
			data["telNumber"] 	= dianpu_pstn["lanaccount"];
			data["isLong"] 		= "000001";
			order_info["number"] = dianpu_pstn["followNumber"];
		}
		// else if(service_type == "cbss_fixed"){
		// 	data["type"] 		= "000003";
		// 	data["number"] 		= order_info["number"];
		// 	data["productId"] 	= order_info["productId"];
		// 	data["productName"] = order_info["productName"];
		// 	data["telNumber"] 	= cbss_fixed.cbss_fixed;
		// 	data["isLong"] 		= "000001";
		// }

		if(authentication["orderNo"]){
			data["oldOrderNo"] 	= (service_type == "bssPstnReturn8" || service_type == "cbss_fixed")
								? authentication["telOrderNo"]
								: authentication["orderNo"];
		}
		$http({
			"method": 'POST',
			"url": ajaxurl + 'orderApp/createOrder',
			"params": {"token":$rootScope.token},
			"data": data
		}).success(function(data){
			if(data.status == "1"){
				authentication["orderNo"] = data["orderNo"];
				if(wx_order.TMorderCode){
					$http({
						"method": 'POST',
						"url": ajaxurl + 'preOrderApp/updateNumberPreOrderAndShopNumber',
						"params": {
							"token":$rootScope.token,
							"shopOrderCode":authentication["orderNo"],
							"tmOrderCode":wx_order.TMorderCode
						}
					})
				}
				authentication["telOrderNo"] = data["telOrderNo"];
				$state.go("authentication-face");
			}else{
				my.alert(data.msg)
			}
		}).error(function(){
			my.alert('保存用户信息失败!');
		});
	};

	// 返回上一步 断开BLE
	$scope.BLEdis = function(){
		if(SelectDevice == 'nfc'){
			$state.go("authentication-device");
		}else{
			ble.BLEdis().then(function(){
				$state.go("authentication-device");
			},function(){
				my.alert("断开连接失败，请重新断开。")
			})
		}
	}

	
	
	if(SelectDevice == 'ble'){
		$scope.btn_displayState[0] = true;
	}
	else if(SelectDevice == 'nfc'){
		$scope.nfc_readCard()
	}else if(SelectDevice == 'camera'){
		$scope.idInfo = camera_authentication;
		$scope.checkProduct();
	}
})


.controller('authentication-face', function($scope, $rootScope, $http, $state, my, url2base64, $cordovaCamera,unicomm_server) {

	$scope.title = "人脸比对";
	$scope.idHeadImg = authentication["idHeadImg"]
	$scope.imgData = "";
	$scope.btn_displayState = [true, true];
	$scope.loading = false;
	$scope.resState = false;
	$scope.setPhoto = true;
	$scope.wrap = true;
	$scope.cropperFrequency = 0;
	$scope.picList = [];
	$scope.Camera = function (){
		if(number_pool == "CBSS" && cbssInfo.bodyCertification === "1"){
			$scope.CameraPicList();
		}else{
			if(number_pool == "CBSS"){
				$html = "<div class='txtCenter'><span class='block f-15'>请横置手机拍照</span><img src='img/ro.gif' width='50%'/></div>";
				my.alert($html).then(function(){
					$scope.CameraPhoto();
				});
			}else{
				$scope.CameraPhoto();
			}
		}
	};

	$scope.CameraPhoto = function(){
		$scope.CameraOptions = JSON.parse(JSON.stringify(CameraOptions));
		if(number_pool == "BSS"){
			$scope.CameraOptions.targetWidth = 750;
			$scope.CameraOptions.targetHeight = 1500;
		}
		$cordovaCamera.getPicture($scope.CameraOptions).then(function(imageData) {
			$scope.wrap = false;
			$scope.btn_displayState = [false, true];
			$scope.setPhoto = false;
			$scope.showPhoto = true;
			$scope.tips = true;
			$scope.resState = false;
			url2base64.getCropperWhether("data:image/jpeg;base64," + imageData).then(function(data){
				if(data){
					$scope.CroppeImg("data:image/jpeg;base64," + imageData)
				}else{
					$scope.imgData = imageData;
					$scope.avatar = "data:image/jpeg;base64," + imageData;
				}
			},function(){
				if(number_pool == "CBSS"){
					$html = "<div class='txtCenter'><span class='block f-15'>请横置手机拍照</span><img src='img/ro.gif' width='50%'/></div>";
					my.alert($html).then(function(){
						$scope.setPhoto = true;
						$scope.showPhoto = false;
						$scope.tips = false;
					});
				}else{
					$scope.imgData = imageData;
					$scope.avatar = "data:image/jpeg;base64," + imageData;
				}
			})
		}, function() {
			$scope.setPhoto = true;
			$scope.showPhoto = false;
			$scope.tips = false;
		});
	}

	$scope.CameraPicList = function(){
		$scope.wrap = false;
		$scope.btn_displayState = [false, true];
		$scope.setPhoto = false;
		$scope.showPhoto = true;
		$scope.tips = true;
		$scope.resState = false;
		// 0:眨眼 1:张嘴 2:右摇头 3:左摇头 4:仰头 5:低头 6:摇头
		cordova.plugins.baidufacePlugin.baidufaceRecognition("1", "4", "5", function(data){
			$scope.picList = data.split(":");
			authentication["uploadLivePhoto"] = $scope.picList;
			$scope.imgData = $scope.picList[1];
			$scope.avatar = "data:image/jpeg;base64," + $scope.picList[1];
		}, function() {
			$scope.setPhoto = true;
			$scope.showPhoto = false;
			$scope.tips = false;
		});
	}

	// 图片放大
	$scope.zoom = function(){
		$scope.isNoShowHeader = true;
		$scope.pop = true;
	};
	// 重拍
	$scope.reCamera = function(){
		$scope.isNoShowHeader = false;
		$scope.pop = false;
		$scope.croppe = false;
		$scope.Camera();
	};
	// 确认
	$scope.confirm = function(){
		$scope.isNoShowHeader = false;
		$scope.pop = false;
		$scope.croppe = false;
	};
	// 裁剪图片
	$scope.CroppeImgAction = function(){
		$('#cropperBox img').cropper('destroy').cropper({
			aspectRatio: 4 / 3,
			viewMode: 1,
			setDragMode:"move",
			dragMode:"move",
			preview: '.img-preview',
			background :false,
			cropBoxMovable :false,
			cropBoxResizable :false,
			autoCropArea:1,
			zoomable:true
		});
	}
	$scope.CroppeImg = function(){
		cropperID = "cropperImg";
		$scope.isNoShowHeader = true;
		$scope.pop = false;
		$scope.croppe = true;
		$scope.croppeImgSrc = arguments[0];
		if($scope.cropperFrequency === 0){
			document.getElementById(cropperID).onload=function(){
				$scope.CroppeImgAction();
			};
		}else{
			$scope.CroppeImgAction();
		}
		$scope.cropperFrequency++;
	}
	$scope.getCroppedCanvas = function(){
		var arg = arguments[0];
		url2base64.getCroppedCanvas(arg).then(function(data){
			if(arg.method == "getCroppedCanvas"){
				$scope.avatar = data;
				$scope.imgData = data.substring(23);
				$scope.croppeImgSrc = "";
				$scope.confirm();
			}
		})
	}
	$scope.contrast = function(){
		$scope.loading = true;
		$scope.resState = true;
		$scope.readOkText = "照片保存";
		authentication["customerImagebase64"] = $scope.imgData;
		url2base64.getBase64Watermark("data:image/jpeg;base64,"+authentication["customerImagebase64"]).then(function(base64){
			authentication["customerImagebase64"]=base64.substring(23)
			$http({
				"method": 'POST',
				"url" : ajaxurl + 'imgUpload/startUpload',
				"params": {"token":$rootScope.token},
				"data": {
					"type":"holdcard",
					"base64":authentication["customerImagebase64"]
				}
			}).success(function(data){
				if(data.status == "1"){
					authentication["customerImageUrl"] = data.url;
					authentication["customerImageUrlOriginal"] = "";
					if(authentication_faceVerify){
						$scope.faceVerifyByBce();
					}else{
						$scope.upOrder();
					}
				}else{
					$scope.readOkHide('照片保存失败(文件),请联系管理员!');
				}
			}).error(function(){
				$scope.readOkHide('照片保存失败(系统),请联系管理员!');
			});
		})
	}



	$scope.faceVerifyByBce = function(){
		
		$http({
			"method": 'POST',
			"url": ajaxurl + "/identityApp/faceVerifyByBce",
			"params": {"token":$rootScope.token},
			"data": {
				"imageUrl":authentication["customerImageUrl"]
			}
		}).success(function(data){
			if(data.code === 2){
				$scope.readOkHide(data.msg);
			}else{
				$scope.upOrder();
			}
		}).error(function(){
			$scope.readOkHide('翻拍照片检测系统，系统错误!');
		});
	}



	$scope.upOrder = function(){
		$scope.loading = true;
		$scope.readOkText = "人脸识别校对";
		var data = {
			"name":		authentication["name"],
			"cardId":	authentication["cardId"],
			"idHeadImg":authentication["idHeadImg"],
			"address":	authentication["address"],
			"birthday":	authentication["birthday"],
			"sex":		authentication["gender"],
			"police":	authentication["police"],
			"nation":	authentication["nation"],
			"validEnd":	authentication["end_date"],
			"validStart":  authentication["start_date"],
			"customerImageUrl":authentication["customerImageUrl"],
			"customerImageUrlOriginal":authentication["customerImageUrlOriginal"],
			"orderNo":authentication["orderNo"],
			"telOrderCode":authentication["telOrderNo"],
			"source":source
		}

		if(order_type == "kaika"){
			data["type"] = "000001";
		}else if(order_type == "kuandai"){
			data["type"] = "000002";
		}else if(order_type == "pstn"){
			data["type"] = service_type == "bssPstnReturn8" ? "000004" : "000003";
		}

		var url = ""
		if(userBo.userName == "c18602912053" || userBo.userName == "c15664833449"){
			url = "identityApp/compareFaceAndJudgeCard";
		}else{
			url = "identityApp/compareFace";
		}

		$http({
			"method": 'POST',
			"url": ajaxurl + url,
			"params": {"token":$rootScope.token},
			"data": data
		}).success(function(data){
			$scope.contrast_face(data);
		}).error(function(){
			$scope.readOkHide('没有接受到图片,请联系管理员!');
		});
	}



	$scope.contrast_face = function(data){
		$scope.loading = true;
		if(data['result'] === "1"){
			if(number_pool == "BSS"){
					$scope.bss_faceCheckAndUploadPhoto();
			}else{
				$scope.ok();
			}
		}else if (data['result'] === "0") {
			$scope.createManual("未产生比对结果，请重新拍摄!", data["value"]);
		}else if (data['result'] === "-1") {
			$scope.createManual("相似度("+data["value"]+")太低，对比失败，请重新拍摄!大于65可进行人工审核。", data["value"]);
		}else if (data['result'] === "-2") {
			$scope.createManual("相似度太高，疑似拍摄身份证，请重新拍摄，或进入人工审核!", data["value"]);
		}else{
			var alertInfo = {
				"-3":"照片中无证件或证件不清晰",
				"-4":"照片中证件不清晰"
			}
			my.alert(alertInfo[data['result']] ? alertInfo[data['result']] : '比对失败!').then(function(){
				$scope.no();
			});
		}
	}

	

	$scope.bss_faceCheckAndUploadPhoto = function(){
		$scope.loading = true;
		$scope.readOkText = "国政通图片校验";
		unicomm_server.bssLogin(bssInfo.username ? bssInfo : bssInfoHaoma).then(function(){
			unicomm_server.getUnicomm({
				"cmd":"bss_faceCheckAndUploadPhoto",
				"number":order_info["number"],
				"imageBase64":authentication["customerImagebase64"],
				"name":authentication["name"],
				"cardid":authentication["cardId"],
				"applyEvent":(service_type == "bssDealerreturn" ? "320" : "301"),
				"serviceKind":(app == "jike" ? "10" : "9")
			}).then(function(data){
				if(data.status == "1"){
					bss_faceCheckAndUploadPhoto_uploadResponse = data.data;
					$scope.ok();
				}else{
					$scope.readOkHide(alertInfo(data.data));
				}
			}, function(data){
				$scope.readOkHide(alertInfo(data));
			})
		});	
	}


	$scope.createManual = function(){
		if(arguments[1] > 65 || arguments[1] === "-1"){
			my.confirm(arguments[0], "", "重拍", "人工审核").then(function(){
				$scope.no();
			},
			function(){
				$http({
					"method": 'GET',
					"url": ajaxurl + 'manualOrder/createManual',
					"params": {"token":$rootScope.token, "orderNo":authentication["orderNo"]}
				}).success(function(){
					$scope.resState = false;
					$scope.readOkHide('审核订单已生成，请和号码之家(029 8626 2222)联系进行人工审核!');
				});
				$scope.btn_displayState = [true, false];
			});
		}else{
			my.alert(arguments[0]).then(function(){
				$scope.no();
			})
		}
	}


	$scope.queryManualResult = function(){
		$http({
			"method": 'GET',
			"url": ajaxurl + 'manualOrder/queryManualResult',
			"params": {"token":$rootScope.token, "orderNo":authentication["orderNo"]}
		}).success(function(data){
			if(data.status == "000003"){
				if(number_pool == "BSS"){
						$scope.bss_faceCheckAndUploadPhoto();
				}else{
					$scope.ok();
				}
			}else if(data.status == "000002"){
				$scope.readOkHide('审核未通过，请重新拍摄!');
			}else{
				$scope.readOkHide('正在审核中，请稍后!');
			}
		}).error(function(data){
			$scope.readOkHide('网络连接失败，请重试!');
		});
	}


	$scope.ok = function(){
		$scope.tips = false;
		if(number_pool == "BSS"){
			my.loaddingShow()
			convertImgToBase64("data:image/jpeg;base64,"+ authentication["idHeadImg"]);
			url2base64.getBase64(authentication["customerImageUrl"]).then(function(base64){
				authentication["customerImagebase64"] = base64.substring(23);
				my.loaddingHide();
				$state.go("authentication-contact");
			}, function(){
				my.loaddingHide();
				$state.go("authentication-contact");
			})
		}else {
			if(cbssInfo.identityCard === "1"){
				$state.go("pho-identy-front");
			}else{
				$state.go("authentication-contact");
			}
		}
	}

	$scope.no = function(){
		$scope.wrap = true;
		$scope.imgData = "";
		$scope.setPhoto = true;
		$scope.showPhoto = false;
		$scope.avatar = "";
		$scope.loading = false;
	}

	$scope.readOkHide = function(){
		my.alert(arguments[0]).then(function(){
			$scope.loading = false;
		})
	}
})




.controller('authentication-contact', function($scope, $http, $state, $rootScope, my) {
	
	$scope.title = "用户联系信息";
	$scope.data = {"name":authentication["name"], "tel":""}
	$scope.loading = true;
	$scope.resState = true;

	$scope.inputTel = function(){
		$scope.data["tel"] = telFormat($scope.data["tel"]);
		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= 11){
			if($scope.data.name == ''){
				$scope.resState = true;
			}else{
				$scope.resState = false;
			}
		}else{
			$scope.resState = true;
		}
	}
	

	$scope.order = function(){

		$scope.loading = false;
		$scope.resState = true;
		$http({
			method: 'POST',
			url: ajaxurl + 'orderApp/updateCustomerInfo',
			params: {
				"token":$rootScope.token
			},
			data:{
				"contractName":$scope.data["name"],
				"contractNumber":String($scope.data["tel"]).replace(/[^\d]/g, ""),
				"orderNo":authentication["orderNo"],
				"telOrderNo":authentication["telOrderNo"],
				"type":order_type2id[order_type]
			}
		}).success(function(){
			authentication["contractNumber"] = String($scope.data["tel"]).replace(/[^\d]/g, "");
			$state.go(jump[service_type]["authentication"]);
		}).error(function(){
			my.alert('客户信息保存失败!');
		});
	}
});