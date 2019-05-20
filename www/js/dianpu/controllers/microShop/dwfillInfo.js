appControllers.controller('dianpu-dw-fill-info', function($scope,my,$state,$stateParams) {
    $scope.title = "预约流程";
    $scope.num=0;
    $scope.number=$stateParams.num;
    if($scope.number==1){
        $scope.imgList=[{img:"apply_01.png"},{img:"apply_02.png"},{img:"apply_03.png"}];
    }else{
        $scope.imgList=[{img:"apply_01.png"},{img:"apply_06.png"},{img:"apply_05.png"}];
    }
    $scope.img=$scope.imgList[$scope.num].img;
    $scope.nextStep=function(){
        if($scope.num==2){
           $state.go("dianpu-wei-dian");
        }else{
            $scope.num++;
            $scope.img=$scope.imgList[$scope.num].img;
        }
    }
})