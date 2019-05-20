appControllers.controller('gadget-photograph', function($scope, $state, $cordovaCamera, $http, my) {
	$scope.title = "手持身份证";
	$scope.resState = true;

	$scope.divShow = true;
	$scope.imgData = "";
	$scope.imgUrl = "";
	$scope.resState = false;

	$scope.Camera = function (){
		$cordovaCamera.getPicture(CameraOptions).then(function(imageData) {
			$scope.imgData = imageData;
			$scope.divShow = false;
		}, function(err) {
		});
	};

	$scope.contrast = function(){
		$scope.resState = true;
		$http({
			method: 'POST',
			url: 'http://sfz.tiaoka.com/kaika/fileupload.php',
			data: {"order_id":"", "userAgent":"","img":$scope.imgData}
		}).success(function(data){
			$scope.imgUrl = "http://sfz.tiaoka.com/kaika/"+data["url"];
			$scope.saveImgUrl();
		}).error(function(data){
			my.alert('照片保存失败,请联系管理员!').then(function(){
				$scope.resState = false;
			});
		});
	}

	$scope.saveImgUrl = function(){
		$http({
			method: 'GET',
			url: "http://z.haoma.cn/admin/identity/urlSave",
			params: {"imageUrl":$scope.imgUrl,"orderNo":photoGraph_orderNo}
		}).success(function(data){
			if(data["error"] === "0"){
				my.alert("图片上传成功，请在客户端继续您的订单！").then(function(){
					$state.go("index");
				})
			}else{
				my.alert("图片上传失败，请重新上传！").then(function(){
					$scope.resState = false;
				})
			}
		}).error(function(data){
			my.alert('没有接受到图片,请重新提交!').then(function(){
				$scope.resState = false;
			});
		});
	}

})
