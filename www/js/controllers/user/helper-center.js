appControllers.controller('user-helper-center', function($scope, $http, $state, my, $rootScope) {
    $scope.title = '帮助中心';
    $http({
        method: 'GET',
        url: ajaxurl + 'helpcenter/queryCategoryList?token=' + $rootScope.token
    }).success(function(data) {
        if (data.result == 'sucess') {
            $scope.problemList = data.problemList;
            $scope.moreProblemList = data.moreProblemList;
        }
    }).error(function() {
        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
            $state.go('index');
        });
    });
    //问题
    $scope.goProblemList = function(id, name, description) {
            localStorage.setItem('problemTypeList', JSON.stringify({
                infoTypeId: id,
                title: name + '(' + description + ')'
            }));
            $state.go('user-helper-problem-list');
        }
        //关闭消息通知
    $scope.closeNews = function() {
        $scope.newsNotice = true;
    }

})