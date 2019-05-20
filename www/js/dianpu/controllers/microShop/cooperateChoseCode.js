appControllers.controller('cooperate-chose-code', function($scope) {
	$scope.title = "协同选号二维码";
	$scope.login=JSON.parse(localStorage.getItem("login"));
	$scope.shopName=shopInfo["shopBo"].shopName;
	$scope.shopTel=shopInfo["shopBo"].shopTel;
	$scope.textUrl="http://192.168.31.178:3000/#/cooperate-chose-num";
	//console.log($scope.textUrl);
	angular.element("#qrbox").qrcode({ 
		  "render": "canvas"
		, "width": 240
		, "height":240
		, "text": $scope.textUrl
	}); 
//	console.log(shopInfo["shopUrl"]);

	$scope.share=function(){
		//console.log("分享");
	}
})