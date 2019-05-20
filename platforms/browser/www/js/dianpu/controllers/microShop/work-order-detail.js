appControllers.controller('dianpu-microshop-work-order-detail', function($scope){

    $scope.title = "工单池订单详情";
    $scope.orderList=[];
    $scope.remarkList=[];
    $scope.orderList=JSON.parse(localStorage.getItem("orderList"));
    if($scope.orderList.remark!=null){
        $scope.remarkList=$scope.orderList.remark.split("|");
    }
})