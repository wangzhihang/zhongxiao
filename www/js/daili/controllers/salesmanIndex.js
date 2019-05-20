appControllers.controller('daili-salesman-index', function($scope,$rootScope,$http,$state,$ionicLoading,my,$filter) {
	$scope.title = '业务员管理';
	$scope.deveList = [];
	$scope.loading = true;
	// $ionicLoading.show({template: '数据加载中...'});
	$http({
		method:'GET',
		url:ajaxurl + 'userApp/agencyDeveManager?token=' + $rootScope.token,
		timeout: 10000
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading = false		//console.log(JSON.stringify(data));
		$scope.deveList = data['deveList'];
		//console.log($scope.deveList);
		//号码订单
		$scope.numOrderCnt = data.numOrderCnt;
		//宽带订单
		$scope.lanOrderCnt = data.lanOrderCnt;
		//店铺数量
		$scope.shopCnt = data.shopCnt;
		//业务员数量
		$scope.deveCnt = data.deveCnt;
		//订单数量	
		for(var i in $scope.deveList){
			if($scope.deveList[i].writeCardCount>0){
				$scope.deveList[i].isHasOrder=true;
				$scope.deveList[i].noHasOrder=false;
			}else{
				$scope.deveList[i].isHasOrder=false;
				$scope.deveList[i].noHasOrder=true;
			}
			if($scope.deveList[i].headImgUrl==""||$scope.deveList[i].headImgUrl==null){
				$scope.deveList[i].headImg=false;
			}
			else{
				$scope.deveList[i].headImg=true;
			}
		}

	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	
	$scope.orderJump=function(){
		// console.log("eee=="+e);
		$state.go('kk-order-list',{
			status:'000003',
			startTime:$filter('date')(new Date().setDate(1),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	}
	//店铺跳转
	$scope.shopJump=function(userId){
		//console.log("eee=="+userId);
		$state.go('daili-shop-index',{
			userId:userId
		})
	}
//    $('#container').highcharts({
//        chart: {
//            type: 'line'
//        },
//        title: {
//            text:null
//        },
//        subtitle: {
//            text:null
//        },
//        xAxis: {
//            categories: ['21', '22', '23', '24', '25', '26', '27']
//        },
//        yAxis: {
//            title: {
//                text:null
//            }
//        },
//        credits: {
//            enabled: false
//        },
//        plotOptions: {
//            line: {
//                dataLabels: {
//                    enabled: true          // 开启数据标签
//                },
//                enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
//            }
//        },
//        legend: {
//			enabled: false
//		},
//        series: [{
//            data: [10, 15,20,35,40,60,360]
//            
//        },]
//    });
	//进入业务员详情
	$scope.deveDetail = function(index){
		localStorage.setItem('developId',$scope.deveList[index].userId);
		//console.log($scope.deveList[index].userId);
		$state.go('daili-salesman');
	};
});