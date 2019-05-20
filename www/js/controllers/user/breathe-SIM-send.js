appControllers.controller('user-breathe-SIM-send', function($scope, $http, $state, my, $rootScope) {
    $scope.title = '外呼SIM卡派送';
    $scope.data = {
        'current': '1'
    };
    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.blankCards = [];
    $scope.completeCards = [];
    $scope.ICCID = '';
    $scope.hasmore = false;
    $scope.loading = false;
    $scope.noMore = false;

    $scope.noComplete = function(pageIndex) {
        $http({
            method: 'get',
            url: ajaxurl + 'card/queryBlankCardByStatus?token=' + $rootScope.token,
            params: {
                'status': '000003',
                'pageIndex': pageIndex
            }
        }).success(function(data) {
            $scope.blankCards = $scope.blankCards.concat(data.data.blankCards);
            $scope.hasmore = false;
            $scope.loading = false;
            $scope.pageIndex = data.data.page.pageIndex;
            if (data.data.page.pageIndex < Math.ceil(data.data.page.pageCount / data.data.page.pageSize)) {
                $scope.hasmore = true;
            } else {
                $scope.noMore = true;
            }

        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.noComplete($scope.pageIndex);
    $scope.alreayComplete = function(pageIndex) {
            $http({
                method: 'get',
                url: ajaxurl + 'card/queryBlankCardByStatus?token=' + $rootScope.token,
                params: {
                    'status': '000005',
                    'pageIndex': pageIndex
                }
            }).success(function(data) {
                $scope.completeCards = $scope.completeCards.concat(data.data.blankCards);
                $scope.hasmore = false;
                $scope.loading = false;
                $scope.pageIndex = data.data.page.pageIndex;
                if (data.data.page.pageIndex < Math.ceil(data.data.page.pageCount / data.data.page.pageSize)) {
                    $scope.hasmore = true;
                } else {
                    $scope.noMore = true;
                }
            }).error(function() {
                my.alert('数据信息获取失败！请稍后尝试。');
            }).finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        //加载更多
    $scope.loadMore = function() {
        $scope.loading = true;
        $scope.pageIndex++;
        if ($scope.data.current == '1') {
            $scope.noComplete($scope.pageIndex);
        } else if ($scope.data.current == '2') {
            $scope.alreayComplete($scope.pageIndex);
        }
    }
    $scope.actions = {
        setCurrent: function(param) {
            $scope.hasmore = false;
            $scope.completeCards = [];
            $scope.blankCards = [];
            $scope.data.current = param;
            $scope.noMore = false;
            if (param == '1') {
                $scope.noComplete(1);
            } else if (param == '2') {
                $scope.alreayComplete(1);
            }
        }
    };
    //选择卡片
    $scope.choseCard = function(index) {
            for (var i = 0; i <= $scope.blankCards.length; i++) {
                if (i == index) {
                    $scope.blankCards[i].aaa = true;
                    $scope.ICCID = $scope.blankCards[i].iccid;
                } else {
                    $scope.blankCards[i].aaa = false;
                }
            }
        }
        //开卡
    $scope.confirmSend = function() {
        $state.go('user-breathe-SIM-submit', { 'iccid': $scope.ICCID });
    }

})