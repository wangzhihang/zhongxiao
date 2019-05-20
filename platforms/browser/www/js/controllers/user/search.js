appControllers.controller('search', function($scope,$http,$cameraOptions) {
	$scope.title = "搜索";
	
	
	if(JSON.parse(localStorage.getItem('codeBuy'))){
		$scope.codeBuy=JSON.parse(localStorage.getItem('codeBuy'));
	}else{
		$scope.codeBuy={
			"myEquip":"",
			"choseNum":"",
			"number":"",
			"frontImage":"",
			"backImage":"",
			"nowImage":""
		};
	}	
	
	$scope.frontCamera = function (){
		$scope.phonegraph(1);
	}

	$scope.backCamera = function (){
		$scope.phonegraph(-1);
	}

	$scope.phonegraph =function(num){
		$cameraOptions.getPicture({
			quality: 70,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 320,
			targetHeight: 800,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true,
		}).then(function(imageDaga){
			if(num==1){
				$scope.codeBuy.frontImage="data:image/jpeg;base64,"+imageData;
			}else{
				$scope.codeBuy.backImage="data:image/jpeg;base64,"+imageData;
			}
			localStorage.setItem('codeBuy',$scope.codeBuy);
		})
	}

	//上传照片
	// $scope.uploadAvatar = function(){
	// 	$http({
	// 		  "method": 'post'
	// 		, "url" : ajaxurl + '/imgUpladApp/saveImg'
	// 		, "data": {imageBase64:$scope.avatar.substring(23)}
	// 	}).success(function(data){
	// 		// $scope.avatar=data.imgUrl;
	// 		// $scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
	// 		// $scope.saveAvatar();
	// 	}).error(function(data){
	// 		my.alert('照片上传失败,请联系管理员!').then(function(){
	// 			$scope.avatar = 'img/logo.png';
	// 		});
	// 	});
	// };

})