appControllers.controller('signature', function($scope, $rootScope, $state, $http, my) {

	$scope.title = "客户签字";
	$scope.resState = false;
	$('.signature').jqSignature();
	$scope.defaultCanvas = $('.signature').jqSignature('getDataURL');
	$scope.clearCanvas = function() {
		$('.signature').jqSignature('clearCanvas');
	}


	$scope.saveSignature = function() {
		var canvas = $('.signature').jqSignature('getDataURL');
		if(canvas === $scope.defaultCanvas){
			my.alert("没有检测到任何字迹，请签名!");
			return ;
		}
		
		$scope.resState = true;
		my.loaddingShow();

		var data = {};
		if(signature_orderNo.orderNo){
			data = signature_orderNo;
		}else{
			data["orderNo"] 	= authentication["orderNo"]
			data["telOrderNo"] 	= authentication["telOrderNo"]
			data["type"] 		= order_type2id[order_type]
		}
		data["sign"] 		= canvas.substring(22);

		$http({
			  "method": 'POST'
			, "url": ajaxurl + 'orderApp/updateSignature'
			, "params": {"token":$rootScope.token}
			, "data": data
		}).success(function(data){
			my.loaddingHide();
			if(signature_orderNo.orderNo){
				signature_orderNo = {};
				$state.go("index");
			}else{
				authentication["idHeadImgUrl"] = data.idCardImageUrl;
				authentication["sign"] = data.sign;
				$state.go(jump[service_type]["signature"]);
			}
		}).error(function(data){
			my.alert("签名保存失败").then(function(){
				$scope.resState = false;
			})
		});
	}
})
