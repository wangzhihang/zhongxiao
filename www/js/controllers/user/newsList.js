appControllers.controller('news-list', function($scope,$http,$state,$timeout,$rootScope,my) {
	$scope.title = '系统公告';
	 $scope.noticeList=[];
    $scope.pageIndex=1;
    $scope.pageSize=10;
    $scope.getData=function(){
        $scope.loading = true;
        $scope.noMore = false;
        $scope.hasmore = false;
            $http({
                    method:'GET',
                    url:ajaxurl + '/baseApp/queryNoticeList?token=' + $rootScope.token,
                    params:{
                        pageIndex:$scope.pageIndex,
                        pageSize:$scope.pageSize
                    }
            }).success(function(data){
                    $scope.loading = false;
                    console.log(data.noticeList.length)
                    if(data.noticeList.length < data.page.pageSize){
                        $scope.noMore = true;
                    }else{
                        $timeout(function () {
                            $scope.hasmore = true;
                        }, 1 * 1000);
                    }
                  $scope.noticeList = $scope.noticeList.concat(data['noticeList']);
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
        $scope.id=$scope.noticeList[e].id;
        // $scope.status=$scope.newsList[e].status;
        // yy_order = {
        //      "orderCode":$scope.orderCode
        //     , "status":$scope.status
        // }
        // $state.go('dianpu-wx-other-accept-detail',{'orderCode':$scope.orderCode});
        // console.log("yy_order"+JSON.stringify(yy_order));
        $state.go("news-inform",{"id":$scope.id})
    }
})

