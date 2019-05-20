appControllers.controller('user-helper-advice-feedback', function($scope, $http, $state, my, $rootScope) {
    $scope.title = '意见反馈';
    $scope.problemType = [];
    $scope.infoTypeId = [];
    $scope.input = { "proTitle": "", "proDescripte": "", "file1": "" };
    $http({
        method: 'GET',
        url: ajaxurl + 'helpcenter/queryCategoryList?token=' + $rootScope.token
    }).success(function(data) {
        if (data.result == 'sucess') {
            $scope.problemType = $scope.problemType.concat(data.problemList);
            $scope.problemType = $scope.problemType.concat(data.moreProblemList);
            for (var i = 0 in $scope.problemType) {
                $scope.problemType[i].choseType = false;
            }
        }
    }).error(function() {
        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
            $state.go('index');
        });
    });
    //选择问题类型
    $scope.choseProType = function(index) {
            if ($scope.problemType[index].choseType == false) {
                $scope.problemType[index].choseType = true;
            } else {
                $scope.problemType[index].choseType = false;
            }
        }
        //提交反馈
    $scope.sublimt = function() {
        $scope.infoTypeId = [];
        for (var i = 0 in $scope.problemType) {
            if ($scope.problemType[i].choseType == true) {
                $scope.infoTypeId.push($scope.problemType[i].id);
            }
        }
        // console.log('id=='+$scope.infoTypeId.toString());
        if ($scope.input.proTitle == undefined || $scope.input.proTitle == '') {
            my.alert('请概括你的问题');
            return;
        } else if ($scope.infoTypeId.length == 0) {
            my.alert('请选择问题类型');
            return;
        } else if ($scope.input.proDescripte == undefined || $scope.input.proDescripte == '') {
            my.alert('请描述你的问题');
            return;
        } else if ($scope.input.proDescripte.length <= 10) {
            my.alert('描述问题必须大于10个字');
            return;
        } else {
            $http({
                method: 'POST',
                url: ajaxurl + 'helpcenter/submitInfo?token=' + $rootScope.token,
                data: {
                    'name': $scope.input.proTitle,
                    'content': $scope.input.proDescripte,
                    'status': '000002',
                    'categoryId': $scope.infoTypeId.toString(),
                    'operatorId': userBo.userId
                }
            }).success(function(data) {
                if (data.status == 'success') {
                    my.alert(data.message).then(function() {
                        $state.go('user-helper-center');
                    });
                }
            }).error(function() {
                my.alert('数据信息获取失败！请稍后尝试。').then(function() {
                    $state.go('user-helper-center');
                });
            });
        }
    }
})