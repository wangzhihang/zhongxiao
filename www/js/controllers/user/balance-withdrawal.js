appControllers.controller('user-balance-withdrawal', function($scope, $http, $state, my, $rootScope) {
    $scope.title = '提现';
    $scope.amount = 100;
    $scope.input = {
            'amount': '',
            'bankCard': ''
        }
        //全部提现
    $scope.allWithdraw = function() {
            $scope.input.amount = $scope.amount;
        }
        //选择提现到账的银行
    $scope.choseBank = function() {
            $scope.showBanksList = true;
        }
        //关闭银行选项
    $scope.closeBankSelect = function() {
        $scope.showBanksList = false;
    }

})