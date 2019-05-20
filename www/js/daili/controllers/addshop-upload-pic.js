appControllers.controller('daili-addshop-upload-pic', function($scope,$cordovaCamera,$http,my,$rootScope,$state,$stateParams) {
	$scope.title = '上传门店及营业执照';
	$scope.showPhoto = false;
	$scope.showBusinessPhoto=false;
	$scope.shopUserId = $stateParams.userId;
	$scope.imageData='';
	$scope.avatar='';
	$scope.businessAvatar='';
	$scope.CameraDoor = function (){
		$cordovaCamera.getPicture(CameraOptions).then(function(imageData) {
			$scope.showPhoto = true;
			$scope.avatar = "data:image/jpeg;base64," + imageData;
			// alert($scope.avatar);
		}, function(err) {
			my.alert('请重新拍照');
		});
	}

	$scope.CameraBusinessLicense = function (){
		$cordovaCamera.getPicture(CameraOptions).then(function(imageData1) {
			$scope.showBusinessPhoto=true;
			$scope.businessAvatar = "data:image/jpeg;base64," + imageData1;
			// alert($scope.businessAvatar);
		}, function(err) {
			my.alert('请重新拍照');
		});
	}

	//上传门头照及营业执照
	$scope.uploadPic=function(){
		if($scope.avatar==""){
			my.alert('请拍摄门头照');
			return;
		}else if($scope.businessAvatar==""){
			my.alert('请拍摄营业执照');
			return;
		}else{
			$http({
				method: 'post',
				url:  ajaxurl+'userApp/uploadShopHeaderPic?token=' + $rootScope.token,
				data: {
					'shopUserId':$scope.shopUserId,
					'base64':$scope.avatar.substring(23)
				}
			}).success(function(data){
				if(data==true){
					$http({
						method: 'post',
						url:  ajaxurl+'userApp/uploadBusinessLicencePic?token=' + $rootScope.token,
						data: {
							'shopUserId':$scope.shopUserId,
							'base64':$scope.businessAvatar.substring(23)
						}
					}).success(function(data){
						my.alert('上传成功！').then(function(){
							$state.go('daili-org-saleman-shop-list');
						}); 
					}).error(function(){
						$scope.showPhoto = false;
						my.alert('上传营业执照失败！请重新拍摄。');
					})
				}
			}).error(function(){
				$scope.showPhoto = false;
				my.alert('上传门头照失败！请重新拍摄。');
			})
		}
	}
	
});