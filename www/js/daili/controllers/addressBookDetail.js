appControllers.controller('daili-address-book-detail', function($scope) {
	$scope.title = '用户信息';
	var addrBookList = JSON.parse(localStorage.getItem('addrBookList'));
	//获取列表跳转'userId'
	$scope.addrBookUserId = localStorage.getItem('addrBookUserId');
	for(var i in addrBookList){
		if(addrBookList[i].userId == $scope.addrBookUserId){
			//console.log(addrBookList[i]);
			$scope.realName = addrBookList[i].realName;
			$scope.title = $scope.realName;
			$scope.contractNumber = addrBookList[i].contractNumber;
			$scope.userName = addrBookList[i].userName;
			$scope.address = addrBookList[i].address;
		}
	}
});