appControllers.controller('dianpu-wx-other-accept', function($scope,$ionicLoading,$http,my,$timeout,$state,$rootScope,$interval,$ionicLoading,$filter,$ionicPopup,$ionicScrollDelegate) {
    $scope.title = "异业受理";
    
    $scope.orderList=[];
    $scope.pageIndex=1;
    $scope.pageSize=6;
    $scope.levelCode=deptInfo.levelCode;
    //  if(shopBo.auserName.substr(1,shopBo.auserName.length)==shopBo.cuserName.substr(1,shopBo.cuserName.length)){
    //     $scope.url='remoteMarketOrderApp/queryRemoteMarketOrderListByAgency';
    // }else{
    //     $scope.url='remoteMarketOrderApp/queryRemoteMarketOrderList';
    // }
    $scope.url='remoteMarketOrderApp/queryRemoteMarketOrderList';
    $scope.getData=function(){
        $scope.loading = true;
        $scope.noMore = false;
        $scope.hasmore = false;
            $http({
                    method:'GET',
                    url:ajaxurl + $scope.url+'?token=' + $rootScope.token,
                    params:{
                        pageIndex:$scope.pageIndex,
                        pageSize:$scope.pageSize,
                        levelCode:$scope.levelCode
                    }
            }).success(function(data){
                    $scope.loading = false;
                    console.log(data.orderList.length)
                    if(data.orderList.length < data.page.pageSize){
                        $scope.noMore = true;
                    }else{
                        $timeout(function () {
                            $scope.hasmore = true;
                        }, 1 * 1000);
                    }
                  $scope.orderList = $scope.orderList.concat(data['orderList']);
            }).error(function () {
               my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('index');
              }); 
            });
    }
    $scope.getData();
    //上拉加载 
    $scope.loadMore = function (){
       $scope.pageIndex++;
        $scope.getData();
    };

    $scope.lookDetail=function(e){
        $scope.orderCode=$scope.orderList[e].orderCode;
        // $scope.status=$scope.orderList[e].status;
        // yy_order = {
        //      "orderCode":$scope.orderCode
        //     , "status":$scope.status
        // }
        $state.go('dianpu-wx-other-accept-detail',{'orderCode':$scope.orderCode});
        console.log("yy_order"+JSON.stringify(yy_order));
    }
})