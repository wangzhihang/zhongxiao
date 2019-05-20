appControllers.controller('userCenterSet', function($scope, $state, $rootScope) {
    $scope.title = '设置';
    //安全退出
    $scope.loginOut = function() {
        $rootScope.token = "";
        $state.go("login");
    }
})