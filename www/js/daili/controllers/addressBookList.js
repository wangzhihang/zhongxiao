appControllers.controller('daili-address-book-list', function($scope,$http,$state,$rootScope,$ionicScrollDelegate) {
	$scope.title = '通讯录';
	$scope.input = {realName:''};
	//判断获取本地存储列表
//	$scope.listL = JSON.parse(localStorage.getItem('addrBookList'));
	$scope.addrBookList = JSON.parse(localStorage.getItem('addrBookList'));
//	addrBookList = $scope.addrBookList;
	if($scope.addrBookList == null){
		$scope.addrBookList = [];
		getAddrBook();
	}else{
		$scope.loading = false;
		//console.log($scope.addrBookList);
	}
	//搜索用户
	$scope.inputKeyWords = function(){
		if($scope.input.realName !== ''){
			$scope.searchResult = true;
			if(JSON.stringify($scope.addrBookList).indexOf($scope.input.realName) === -1){
				$scope.num = 0;
			}else{
				$scope.searchList = [];
				for(var i in $scope.addrBookList){
					if($scope.addrBookList[i]["realName"].indexOf($scope.input.realName) !== -1){
						$scope.searchList.push($scope.addrBookList[i]);
					}
				}
				$scope.addrBookList = $scope.searchList;
				$scope.num = $scope.addrBookList.length;	
			}	
		}else{
			$scope.searchResult = false;
			$scope.num = 0;
			$scope.addrBookList = JSON.parse(localStorage.getItem('addrBookList'));
		}
	};
	//重新加载
	$scope.reload = function(){
		getAddrBook();
	};
	//获取通讯录信息
	function getAddrBook(){
		$scope.loading = true;
		$scope.addrBookList = [];
		$http({
			method:'get',
			url:ajaxurl + 'userApp/getAgencyContacts?token=' + $rootScope.token
		}).success(function(data){
			$scope.loading = false;
			$scope.addrBookList = data['shopList'].concat(data['deveList']);
			localStorage.setItem('addrBookList',JSON.stringify($scope.addrBookList));
			$ionicScrollDelegate.resize();//重新计算宽度和高度的方法
		});
	}
	//通讯录详情
	$scope.getAddrDetail = function(index){
		localStorage.setItem('addrBookUserId',index);
		$state.go('daili-address-book-detail');
	}
});