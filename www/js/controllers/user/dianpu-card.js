appControllers.controller('user-dianpu-card', function($scope,$http,my,$rootScope,$stateParams) {
	$scope.title = '卡片列表';
	$scope.tag = {
		'current':1
	};
	$scope.actions ={
		setCurrent:function(param){
			$scope.tag.current = param;
			switch(param){
				case 1:
				$scope.getCardList('000001');
				break;
				case 2:
				$scope.getCardList('000002');
				break;
			}
		}
	}
	//判断登录信息
	if(userBo.userType == '000005'){
		$scope.userId = userBo.userId;
	}else if(userBo.userType == '000003'){
		$scope.userId = $stateParams.userId;
	}
	//获取卡片列表
	$scope.getCardList = function(cardType,initialization){
		$http({
			method:'get',
			url:ajaxurl + 'card/queryHalfCardsByShopId?token='+ $rootScope.token,
			params:{
				userId:$scope.userId,
				cardType:cardType
			}
		}).success(function(data){
			if(data.msg == '成功'){
				if(cardType == '000001'){
					$scope.showScanCard = true;
					$scope.baiCardList = data.data;
					$scope.baiCardListNum = $scope.baiCardList.length;
				}else if(cardType == '000002'){
					if(initialization == '1'){
						$scope.showScanCard = true;
					}else{
						$scope.showScanCard = false;
					}
					$scope.banCardList = data.data;
					$scope.banCardListNum = $scope.banCardList.length;
				}
			}
		}).error(function () {
	         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index');
	        }); 
	    });
	}
	$scope.getCardList('000001');
	$scope.getCardList('000002','1');
})
