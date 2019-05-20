appControllers.controller('user-set', function($scope,$http,$state,my,$rootScope,url2base64, $cordovaCamera) {
	$scope.title = '设置';
	$scope.imgData = '';
	$scope.avatar = signInInfo.userInfo.headImgUrl;
	if($scope.avatar == null){
		$scope.avatar = 'img/logo.png';
	}
	//设置头像
	$scope.photograph = function(){
		$cordovaCamera.getPicture({
			quality: 70,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 320,
			targetHeight: 320,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		}).then(function(imageData) {
			$scope.avatar = "data:image/jpeg;base64," + imageData;
			$scope.uploadAvatar();
		}, function(err) {
			//...
		});
	};
	//上传照片
	$scope.uploadAvatar = function(){
		$http({
			  "method": 'post'
			, "url" : 'http://sfz.tiaoka.com/appUserAvatar/fileupload.php'
			, "data": {img:$scope.avatar.substring(23)}
		}).success(function(data){
			$scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
			$scope.saveAvatar();
		}).error(function(data){
			my.alert('照片上传失败,请联系管理员!').then(function(){
				$scope.avatar = 'img/logo.png';
			});
		});
	};
	//保存头像
	$scope.saveAvatar = function(){
		$http({
			method:'get',
			url:ajaxurl + '/userApp/saveHeadImage?token=' + $rootScope.token,
			params:{imageUrl:$scope.avatar}
		}).success(function(data){
			//...上传成功
		}).error(function(){
			my.alert('照片保存失败,请重新拍摄！').then(function(){
				$scope.avatar = 'img/logo.png';
			});
		});
	};
	//安全退出
	$scope.signOut = function(){
		signInInfo = '';
		$state.go("login");
	};
});