appControllers.controller('zxdianpu-info', function($scope,$state,$http,my,focus,$filter,$rootScope,$ionicLoading,$timeout) {
	$scope.title = '店铺信息';
	$scope.data={"shopName":"","address":""};
	$scope.editShop="编辑";
	$scope.editVal = false;
	$scope.showData = true;
	//console.log("1111=="+shopBo);
	$scope.data.shopName=shopInfo.shopBo.shopName;
	$scope.data.address=shopInfo.shopBo.address;

	$scope.saveUserInfo = function(){
		if($scope.editShop=="编辑"){
			$scope.editShop="完成";
			$scope.editVal=true;
			$scope.showData=false;
			focus('inputName')
		}else{
			console.log("shopName"+$scope.data.shopName);
			console.log("address"+$scope.data.address);
			$http({
				method:"get",
				url: ajaxurl + "userApp/saveShop?token=" + $rootScope.token,
				params: {"shopName":$scope.data.shopName,"address":$scope.data.address,"shopId":shopInfo.shopBo.id}
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
	};
})
