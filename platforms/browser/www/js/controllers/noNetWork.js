appControllers.controller('noNetWork', function($scope,$state,my,$ionicPlatform) {
	$scope.isIOS = true;
	$scope.reconnect = function(){
		ionic.Platform.exitApp();
		if(ionic.Platform.isIOS()){
			$scope.isIOS = true;
		}
	};
});