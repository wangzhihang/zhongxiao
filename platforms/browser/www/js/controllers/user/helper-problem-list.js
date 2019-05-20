appControllers.controller('user-helper-problem-list', function($scope,$http,$state,my,$rootScope) {
	$scope.problemTypeList = JSON.parse(localStorage.getItem('problemTypeList'));
	$scope.title = $scope.problemTypeList.title;
	$http({
		method:'GET',
		url:ajaxurl + 'helpcenter/queryInfoList?token=' + $rootScope.token,
		params:{
			status:'000001',
			infoTypeId:$scope.problemTypeList.infoTypeId
		}
	}).success(function(data){
		$scope.infoList = data.infoList;
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index');
        });
	});
	//问题详情
	$scope.answerContent = function(id,name){
		localStorage.setItem('problemDetail',JSON.stringify({
			proListId:id,
			name:name
		}));
		$state.go('user-helper-problem-detail');
	}
})
