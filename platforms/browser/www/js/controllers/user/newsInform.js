appControllers.controller('news-inform', function($scope,$rootScope,$stateParams,$state,$http,$ionicPopup,$ionicLoading,my) {
    $scope.title = '消息通知';
    $scope.id=$stateParams.id;
    localStorage.setItem('ifLookedNews',$scope.id)
    console.log($scope.id)
    $scope.getData=function(){
        $http({
            method: 'GET',
            url: ajaxurl + "baseApp/queryNoticeInfoById?token=" + $rootScope.token,
            params: {"id": $scope.id}
        }).success(function(data){
            console.log(JSON.stringify(data));
            $scope.getData=data;
            $scope.content=data.content;
        }).error(function () {
            $ionicPopup.alert({
                title: '系统提示',
                template: '获取公告详情失败!',
                okText:'我知道了',
                okType:'button-default'
            });
        });
    }
    $scope.getData();
})