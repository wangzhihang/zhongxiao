appControllers.controller('salesman-send-card', function($scope, $http, my, $state, $stateParams, $rootScope) {
    $scope.title = '选择店铺';
    $scope.shopList = [];
    $scope.sendToShopList = null;
    console.log('cards==' + localStorage.getItem('cards'));
    $http({
        method: 'get',
        url: ajaxurl + 'card/queryShopsBySalesmanId?token=' + $rootScope.token,
        params: { userId: localStorage.getItem('userId') }
        // params:{userId:47}
    }).success(function(data) {
        // console.log('data=='+JSON.stringify(data));
        $scope.shopList = data.data;
        $scope.msgTypeDefault = $scope.shopList[0];
    }).error(function() {
        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
            $state.go('index_dl');
        });
    });

    $scope.byChose = function(userId) {
        $scope.sendToShopList = userId;
    }
    $scope.confirmSend = function() {
        $http({
            method: 'post',
            url: ajaxurl + 'card/deliverHalfCardToShop?token=' + $rootScope.token,
            data: {
                cards: localStorage.getItem('cards'),
                shopId: $scope.sendToShopList,
                cardType: localStorage.getItem('cardType')
            }
        }).success(function(data) {
            console.log(data);
            if (data.msg == '成功') {
                my.alert('派送成功！');
                $state.go('index_dl');
            }
        }).error(function() {
            my.alert('派送失败！请稍后尝试。').then(function() {
                $state.go('salesman-existing-card');
            });
        });

    }

});