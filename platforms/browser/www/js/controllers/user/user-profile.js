appControllers.controller('userProfile', function($scope,$http,$rootScope,focus,$ionicLoading,$timeout,$cordovaCamera,my) {
	$scope.title = '个人信息';
	$scope.data={"signId":"","realName":"","userTel":"","weixinNo":"","qq":"","userAddress":"","shopName":""};
	$scope.imgData = '';
	$scope.avatar = 'img/logo.png';
	$scope.editShop="编辑";
	$scope.editVal = false;
	$scope.showData = true;
	$scope.data.signId = userBo.signId;
	$scope.contractNumber = '';
	//获取用户信息
	$scope.getUserData = function(){
		$http({
			method:"GET",
			url: ajaxurl + "/userApp/toMyView?token=" + $rootScope.token,
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.data.userName = data.user.userName;
			$scope.data.realName = data.user.realName;
			$scope.data.userTel = data.user.contractNumber;
			$scope.data.userAddress = data.user.address;
			$scope.data.headImgUrl = data.user.headImgUrl;
			$scope.data.weixinNo = data.user.weixinNo;
			$scope.data.shopName = data.shopBo.shopName;
			$scope.data.qq = data.user.qq;

			$scope.contractNumber = data.user.contractNumber;
			if($scope.data.headImgUrl==""){
				$scope.isNoShowPig=true;
			}
			else{
				$scope.isNoShowPig=false;
			}
		}).error(function(data){
			
		});	
	}
	$scope.getUserData();
	

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
			, "url" : ajaxurl + '/imgUpladApp/saveImg'
			, "data": {imageBase64:$scope.avatar.substring(23)}
		}).success(function(data){
			$scope.avatar=data.imgUrl;
			// $scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
			// $scope.saveAvatar();
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
	//更新用户信息(!!!接口有问题暂时屏蔽...)
	$scope.saveUserInfo = function(){
		if($scope.editShop=="编辑"){
			$scope.editShop="完成";
			$scope.editVal=true;
			$scope.showData=false;
			focus('inputFocus')
		}else{
			$scope.editVal=false;
			//console.log($scope.data.realName);
			if($scope.data.userTel != $scope.contractNumber){
				my.confirm('修改联系电话，用户名也随之修改，确定修改联系电话吗？').then(function(){
					$scope.userName();
				})
			}else{
				$scope.updateUserInfo();
			}
		}
	};

	//用户名验证
	$scope.userName = function(){
		$http({
			method:'post',
			url:ajaxurl + 'userApp/existUserName?token=' + $rootScope.token,
			data:{userName:$scope.data.userTel}
		}).success(function(data){
			if(data == true){
				$http({
					method:'post',
					url:ajaxurl + 'userApp/existPhoneNumber?token=' + $rootScope.token,
					data:{phoneNumber:$scope.data.userTel}
				}).success(function(data){
					if(data == true){
						$scope.updateUserInfo ();
					}else{
						my.alert('电话号码已被占用').then(function(){
							$scope.getUserData();
							$scope.showData=true;
						});
					}
				});
			}else{
				my.alert('用户名已被占用').then(function(){
					$scope.getUserData();
					$scope.showData=true;
				});
			}
		});
	}

	//更新用户信息
	$scope.updateUserInfo = function(){
		$http({
				method:"post",
				url: ajaxurl + "userApp/saveUser?token=" + $rootScope.token,
				params: {"realName":$scope.data.realName,"contractNumber":$scope.data.userTel,"weixinNo":$scope.data.weixinNo,"qq":$scope.data.qq,"address":$scope.data.userAddress,"shopName":$scope.data.shopName}
			}).success(function(data){
				$scope.editVal=false;
				$scope.showData=true;
				$ionicLoading.show({"template":'用户信息更新成功！'});
		    	$timeout(function () {
		    		$ionicLoading.hide();
		    		$scope.editShop="编辑";
		    	}, 1500);
			});
	}
})
