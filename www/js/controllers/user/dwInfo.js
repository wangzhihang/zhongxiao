appControllers.controller('dianpu-dw-info', function($scope,$stateParams,$ionicPopup) {
    $scope.title = '';
    $scope.choseCrad = $stateParams.choseCrad;
   // console.log("gdeshd "+$scope.choseCrad);
    $scope.formInfo={
        userName:'',
        identity:'',
        telNum:''
    };
    $scope.reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    $scope.confirm=function(){
      // console.log("userName"+$scope.formInfo.userName);
        if($scope.formInfo.userName == ''){
            alertData('请输入姓名');
        }else if($scope.formInfo.identity ==''){
            alertData('请输入正确的身份证');
        }else if($scope.formInfo.telNum==''){
            alertData('请输入正确的电话号码');
        }else{
            // $state.go();
        }
    }


    //提示信息
    function alertData(info){
        var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: info
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
    }
})
