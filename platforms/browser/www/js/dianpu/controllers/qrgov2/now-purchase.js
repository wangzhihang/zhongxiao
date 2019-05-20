appControllers.controller('dianpu-qrgo-now-purchase', function($scope, $state, $http, $rootScope,identity_authentication, my, unicomm_server, $cordovaCamera ,ble_identity, order_create) {
	$scope.title = "码上购";
	$scope.agree = false;
	$scope.identifyInfo = false;
	$scope.myDevice = '请选择设备';

	$scope.showAuthentication = function(){
		$scope.qrgoInfo=qrgoInfo;
		$scope.order_info=order_info;
		$scope.authentication = authentication;
	}
	$scope.showAuthentication();




	//选择号码
	$scope.choseNum=function (){
		authentication["contractNumber"]=telFormat($scope.authentication.contractNumber);
		$state.go("dianpu-qrgoV2-number")
	}
	//input的按键事件
	$scope.telChange = function(){
		authentication["contractNumber"]=telFormat($scope.authentication.contractNumber);
		// console.log(String(authentication["contractNumber"]).replace(/[^\d]/g, ""));
	}


	// ************获取设备***************
	// 初始值
	var bleHistory = str2json(localStorage.getItem("bleHistory"));
	if(bleHistory.name){
		$scope.myDevice=bleHistory.name;
		BLEcurrDevice = bleHistory;
	}else{
		$scope.myDevice = "";
	}

	//搜索设备
	$scope.readEquip =function(){
		ble_identity.BLEfind().then(function(data){
			$scope.bleadderDatas=data;
			$scope.loading = false;
		},function(){
			my.alert("搜索设备失败！");
		})
	}
	//切换设备
	$scope.contentBlueTooth = function(){
		$scope.showContentBlueTooth = true;
		// if($scope.bleadderDatas.length==0){
			$scope.loading = true;
			$scope.readEquip();
		// }else{

		// }
	}
	//选择设备
	$scope.switchDevice = function(i){
		$scope.showContentBlueTooth = false;
		$scope.myDevice = $scope.bleadderDatas[i].name;
		BLEcurrDevice = $scope.bleadderDatas[i];
		localStorage.setItem("bleHistory", JSON.stringify(BLEcurrDevice))
	}
	//重新搜索设备
	$scope.reSearch = function(){
		$scope.bleadderDatas = [];
		$scope.loading = true;
		$scope.readEquip();
	}
	$scope.closeContentBlueTooth = function(){
		$scope.showContentBlueTooth = false;
	}

	 //**************读取身份证*******************
	//判断是读取过
	if(authentication["cardId"]){
		$scope.identifyInfo = true;
	}
	//读取身份证
	$scope.readIdentity = function(){
		if($scope.myDevice==""){
			my.alert("请先选择设备,再读取身份证信息！");
		}else{
			my.loaddingShow("身份证信息读取中");
			ble_identity.BLEreadIdentity().then(function(){
				$scope.identifyInfo = true;
				my.loaddingHide();
				$scope.showAuthentication();
			},function(){
				my.alert("读取身份证信息失败！");
			})
		}
	}
	//重新读卡
	$scope.againRead=function(){
		$scope.identifyInfo = false;
		$scope.authentication=null;
		$scope.showAuthentication();
		$scope.readIdentity();
	}

	$scope.phonegraph =function(val){
		$cordovaCamera.getPicture({
			quality: 70,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: Number(val.w),
			targetHeight: Number(val.h),
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		}).then(function(imageData) {
			authentication[val.id]=imageData;
		})
	}


	// ********************写卡开户*****************
	//写卡
	$scope.reSureOpenCardInfo = function(){
		// console.log(authentication,order_info)
		if($scope.myDevice==''){
			my.alert("请选择设备！");
		}else if(order_info['productName']==""){
			my.alert("请选择套餐！");
		}else if(order_info['number']==undefined){
			my.alert("请选择号码！");
		}else if(String(authentication["contractNumber"]).replace(/[^\d]/g, "")==undefined){
			my.alert("请填写联系电话！");
		}else if(authentication["idCardFrontImageStr"]==undefined){
			my.alert("请拍正面照！");
		}else if(authentication["idCardBackImageStr"]==undefined){
			my.alert("请拍反面照！");
		}else if(authentication["customerImagebase64"]==undefined){
			my.alert("请拍免冠照！");
		}else if(authentication["cardId"]==undefined){
			my.alert("请读取身份证信息！");
		}else if($scope.agree==false){
			my.alert("同意协议后，可继续进行！");
		}else{
			$scope.showReSureOpenCardInfo = true;
		}
		
	}
	$scope.closeReSureOpenCardInfo = function(){
		$scope.showReSureOpenCardInfo = false;
	}
	// 确定开户
	$scope.order = function(){
		my.loaddingShow("订单生产中");
		$scope.showReSureOpenCardInfo=false;       
		if(authentication["orderNo"]){
			$scope.compareFace();
		}else{
			order_create.createOrder().then(function(){
				$scope.compareFace()
			},function(data){
				my.alert(data)
			})  
		}
	}
	$scope.compareFace = function(){
		identity_authentication.compareFace().then(function(){
			$scope.savePersonInfo();
		},function(data){
			my.alert(data);
		})
	}

	$scope.savePersonInfo = function()
	{
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_submitOrder",
			"provinceCode":qrgoInfo.userInfo.provinceCode,
			"cityCode":qrgoInfo.userInfo.eparchyCode,
			"number":qrgoInfo.number,
			"goodsId":order_info.productId,
			"name":authentication["name"],
			"psptId":authentication["cardId"],
			"address":authentication["address"],
			"contractNumber":String(authentication["contractNumber"]).replace(/[^\d]/g, ""),
			"nation":authentication["nation"],
			"headPicStr":authentication["idHeadImg"],
			"validDate":authentication["end_date"],
			"startDate":authentication["start_date"],
			"headPicWaterPicStr":authentication["idHeadImg"],
			"idCardBackImageStr":authentication["idCardFrontImageStr"], // 码上购身份证 正反面是反的
			"idCardFrontImageStr":authentication["idCardBackImageStr"],
			"handCardImageStr":authentication["customerImagebase64"]
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					qrgoInfo.orderId = return_json.data;
					my.loaddingHide();
					$state.go("signature");
				}else{
					if(return_json.data.indexOf('人脸面部特征无法提取')!=-1){
						authentication["customerImagebase64"]="";
					}
					$scope.interrupt({
						"popup":true,
						"text":return_json.data,
						"saveName":"2i产品-订单生成!",
					});
				}
			}
		)
	}
	// 重新提交显示
	$scope.interrupt = function(){
		var msg = arguments[0];
		if(msg["saveName"]){
			$scope.saveFailed(msg["saveName"],(msg["saveText"] ? msg["saveText"] : msg["text"]));
		}
		var popupTxt = alertInfo(msg["text"]);
		if(msg["popup"]){
			my.alert(popupTxt).then(function(){
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
			data : {"orderCode":authentication["orderNo"], "node":arguments[0]+"(v2)", "failedReason":JSON.stringify(arguments[1]), "equipment":device.platform}
		})
	}

	//同意协议
	$scope.agreeClick=function(){
		$scope.agree=!$scope.agree;
	}


	//协议细则
	$scope.protocolDetails=function(){
		if(order_info['number']==undefined){
			my.alert("请选择号码！");
		}else if(String(authentication["contractNumber"]).replace(/[^\d]/g, "")==undefined){
			my.alert("请填写联系电话！");
		}else if(authentication["idCardFrontImageStr"]==undefined){
			my.alert("请拍正面照！");
		}else if(authentication["idCardBackImageStr"]==undefined){
			my.alert("请拍反面照！");
		}else if(authentication["customerImagebase64"]==undefined){
			my.alert("请拍免冠照！");
		}else if(authentication["cardId"]==undefined){
			my.alert("请读取身份证信息！");
		}else{
			$state.go("dianpu-qrgo-protocol-details");
		}
	}

});