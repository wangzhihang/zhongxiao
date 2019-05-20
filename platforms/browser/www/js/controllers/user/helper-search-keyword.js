appControllers.controller('user-helper-search-keyword', function($scope,$http,$state,my,$rootScope) {
	$scope.title = '';
	$scope.isNoShowHeader = false;
	$scope.showMaskLayer = false;
	$scope.keyWords = ['牛','账户','二维码','绑定BSS、CBSS','支付','充值','读卡器','读身份证','读写卡'];
	//输入搜索
	$scope.lookKeywords = function(keyword){
		$scope.search(keyword);
	}
	//模糊搜索
	$scope.search = function(keywords){
		$http({
			method:'GET',
			url:ajaxurl + 'helpcenter/queryInfoCondition?token=' + $rootScope.token,
			params:{
				keywords:keywords
			}
		}).success(function(data){
			if(data.result == 'success'){
				$scope.infoList = data.infoList;
				$scope.showMaskLayer = true;
			}
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('user-helper-center');
	        });
		});
	}
	//问题详情
	$scope.answerContent = function(id,name){
		localStorage.setItem('problemDetail',JSON.stringify({
			proListId:id,
			name:name
		}));
		$state.go('user-helper-problem-detail');
	}
})
