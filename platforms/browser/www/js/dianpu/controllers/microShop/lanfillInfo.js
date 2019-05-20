appControllers.controller('dianpu-lan-fill-info', function($scope,my,$state,$ionicPopup,$location,$ionicScrollDelegate, $timeout) {
    $scope.title = "预约流程";
    $scope.imgList=[{img:"apply_04.png"},{img:"apply_05.png"}];
    $scope.num=0;
    $scope.img=$scope.imgList[$scope.num].img;
    $scope.nextStep=function(){
        if($scope.num==1){
           $state.go("dianpu-wei-dian");
        }else{
            $scope.num++;
            $scope.img=$scope.imgList[$scope.num].img;
        }
    }
})