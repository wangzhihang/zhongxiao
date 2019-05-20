appControllers.controller('dianpu-micro-shop', function($scope) {
	$scope.title = "微店";

	$("#qrbox").qrcode({ 
		  "render": "canvas"
		, "width": 240
		, "height":240
		, "text": shopInfo["shopUrl"]
	}); 


})