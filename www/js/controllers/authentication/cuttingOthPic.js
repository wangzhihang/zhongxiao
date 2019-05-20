appControllers.controller('cutting-pic', function($scope,$http,$rootScope,my,url2base64,$state) {
	$scope.title = "裁剪照片";
	$scope.isNoShowHeader = true;
	$scope.cropperFrequency = 0;
	$scope.croppeImgSrc = "data:image/jpeg;base64,"+camera_authentication["temp_img"];
	/// 裁剪图片
	$scope.CroppeImgAction = function(){
		$('#cropperBox1 img').cropper('destroy').cropper({
			aspectRatio: 5 / 4,
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
		cropperID = "cropperImg2";
		if($scope.cropperFrequency === 0){
			document.getElementById(cropperID).onload=function(){
				$scope.CroppeImgAction();
			};
		}else{
			$scope.CroppeImgAction();
		}
		$scope.cropperFrequency++;
	}
	$scope.CroppeImg();

	$scope.getCroppedCanvas = function(){
		var arg = arguments[0];
		url2base64.getCroppedCanvas(arg).then(function(data){
			if(arg.method == "getCroppedCanvas"){
				$scope.imgData = data.substring(23);
				$scope.croppeImgSrc = "";
				$scope.saveIdeImg();
			}
		})
	}

	$scope.saveIdeImg = function(){
		my.loaddingShow('图片上传中');
		$http({
			"method": 'POST'
			, "url": ajaxurl + 'orderApp/uploadIdCardInfoByOrderNo'
			, "params": {"token":$rootScope.token}
			, "data":{
				"orderNo":authentication["orderNo"],
				"base64":$scope.imgData,
				"type":camera_authentication["isHeadSide"]
			}
		}).success(function(data){
			my.loaddingHide();
			if(camera_authentication["isHeadSide"] == "000001"){
				authentication["frontIdCardPath"] = data["imgUrl"];
				$state.go("pho-identy-oth");
			}else{
				authentication["backIdCardPath"] = data["imgUrl"];
				$state.go("authentication-contact")
			}
			// $scope.getCardInfoByUrl(data["imgUrl"]);
		})
	}
// 	$scope.getCardInfoByUrl = function(){
// 		var photoUrl = arguments[0];
// 		$http({
// 			"method": 'GET',
// 			"url": ajaxurl + '/identityApp/getCardInfoByUrl',
// 			"params": {
// 				"token":$rootScope.token,
// 				"imgUrl":photoUrl,
// 				"isHeadSide":camera_authentication["isHeadSide"]
// 			}
// 		}).success(function(data){
// 			if(data.cardResult.result){
// 				if(camera_authentication["isHeadSide"] == "000001"){
// 					var birthday = data.cardResult.cardInfoBo["birthday"].replace(/[^\d]/g, "");
// 					camera_authentication["show"]["birthday"] = {
// 						"Y":birthday.substring(0,4),
// 						"M":birthday.substring(4,6),
// 						"D":birthday.substring(6,8)
// 					};
// 					camera_authentication["list"]["name"]= trim(data.cardResult.cardInfoBo["name"]);		// 姓名
// 					camera_authentication["list"]["gender"] = trim(data.cardResult.cardInfoBo["sex"]);	// 性别
// 					camera_authentication["list"]["nation"] = trim(data.cardResult.cardInfoBo["nation"]);	// 民族
// 					camera_authentication["list"]["birthday"] = camera_authentication["show"]["birthday"]["Y"]+"-"+camera_authentication["show"]["birthday"]["M"]+"-"+camera_authentication["show"]["birthday"]["D"];
// 					camera_authentication["list"]["address"]= trim(data.cardResult.cardInfoBo["address"]);
// 					camera_authentication["list"]["cardId"]= trim(data.cardResult.cardInfoBo["cardId"]);
// 					camera_authentication["photo"]["i01"] = $scope.imgData;
// 					$state.go("pho-identy-oth");
// 				}else{
// 					my.loaddingHide();
// 					var validStart = data.cardResult.cardInfoBo["validStart"].replace(/[^\d]/g, "");
// 					var end_date = data.cardResult.cardInfoBo["validEnd"].replace(/[^\d]/g, "");
// 					camera_authentication["list"]["police"] = trim(data.cardResult.cardInfoBo["police"]);
// 					camera_authentication["list"]["start_date"] = validStart.substring(0,4)+"-"+validStart.substring(4,6)+"-"+validStart.substring(6,8);
// 					camera_authentication["list"]["end_date"] = end_date.substring(0,4)+"-"+end_date.substring(4,6)+"-"+end_date.substring(6,8);
// 					if(camera_authentication["list"]["end_date"].indexOf("长期") != "-1"){
// 						camera_authentication["list"]["end_date"] = "2099-12-31"
// 					}
// 					camera_authentication["show"]["limitedPeriod"] = camera_authentication["list"]["start_date"] + " - " + camera_authentication["list"]["end_date"];
// 					$state.go('check-oth-info');
// 				}
// 			}else{
// 				my.loaddingHide();
// 				my.alert(data.cardResult.errMsg);
// 			}
// 		})
// 	}

// 	$scope.reCamera = function(){
// 		if(camera_authentication["isHeadSide"] == "000001"){
// 			$state.go("pho-identy-front");
// 		}else{
// 			$state.go("pho-identy-oth");
// 		}

// 	}
})
					



//拍身份证正面
.controller('pho-identy-front', function($scope, $state, $cordovaCamera) {
	$scope.title='拍摄正面身份证';
	$scope.Camera = function (){
		$cordovaCamera.getPicture(CameraOptions).then(function(imageData) {
			camera_authentication["temp_img"] = imageData;
			camera_authentication["isHeadSide"] = "000001";
			$state.go("cutting-pic");
		});
	}
})

//核对身份证正面信息
// .controller('check-fr-info', function($scope, $state) {
// 	$scope.title='核对身份证正面信息';
// 	$scope.data = camera_authentication;
// })

//拍身份证反面
.controller('pho-identy-oth', function($scope, $state, $cordovaCamera) {
	$scope.title='拍摄反面身份证';
	$scope.Camera = function (){
		$cordovaCamera.getPicture(CameraOptions).then(function(imageData) {
			camera_authentication["temp_img"] = imageData;
			camera_authentication["isHeadSide"] = "000002";
			$state.go("cutting-pic");
		});
	}
})

//核对身份证反面信息
// .controller('check-oth-info', function($scope, $state) {
// 	// $scope.title='核对身份证反面信息';
// 	// SelectDevice = 'camera';
// 	// camera_authentication["temp_img"] = "";
// 	// camera_authentication["photo"] = "";
// 	// $scope.data = camera_authentication;
// })