appControllers.controller('orderedOrderList', function($scope,$http,$state,$rootScope,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = '预约订单';
	$scope.infoState = '加载更多';
	$scope.loading = false;
	$scope.showList = true;
	$scope.searchBox = true;
	$scope.readMore = true;
	$scope.noMoreTips = true;
	$scope.mask = false;
	$scope.noscroll = false;
	$scope.orderList = []
	$scope.pageIndex = 1;
	$scope.pageSize = '';
	$scope.pageCount = '';
	$scope.input = {'tel':''};
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$ionicLoading.show({template: '数据加载中...'});
	//页面初始化
	$http({
		method:'GET',
		url:ajaxurl + 'numberOrderApp/queryAppPreorderList?token=' + $rootScope.token,
		timeout: 5000
	}).success(function(data){
		$ionicLoading.hide();
		$scope.readMore = false;
		$scope.loading = true;
		$scope.showList = false;
		$scope.orderList = data['orderList'];
		$scope.pageSize = data.page['pageSize'];
		$scope.pageCount = data.page['pageCount'];
		loadingState($scope.pageCount,$scope.pageSize);
		$scope.loadMoreData = function(){
			loadMore('','',$scope.pageCount,$scope.pageSize)
		};
	}).error(function () {
          my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index');
        }); 
    });
	
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//加载更多
	function loadMore(startTime,endTime,pageCount,pageSize){
		if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
			$scope.loading = false;
			$scope.pageIndex++;
			//console.log($scope.pageIndex);
			$http({
				method:'GET',
				url:ajaxurl + 'numberOrderApp/queryAppPreorderList?token=' + $rootScope.token,
				params:{startTime:startTime,endTime:endTime,pageIndex:$scope.pageIndex}
			}).success(function(data){
				$scope.loading = true;
				$scope.mask = false;
				$scope.noscroll = false;
				$scope.orderList = $scope.orderList.concat(data['orderList']);
			}).error(function(){
			
			});
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
	}
	//按日期查询订单
	$scope.queryOrder = function(){
		$scope.pageIndex = 1;
		//console.log(STARTTIME);
		//console.log(ENDTIME);
		$ionicLoading.show({template: '数据加载中...'});
		if(STARTTIME == undefined || ENDTIME == undefined){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请选择起始日期与结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			$ionicLoading.hide();
			$scope.searchBox = false;
		}else if(STARTTIME > ENDTIME){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '起始日期不得大于结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			$ionicLoading.hide();
		}else if(ENDTIME > TODAY){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '结束日期不得大于当前日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			$ionicLoading.hide();
		}else{
			$http({
				method:'GET',
				url:ajaxurl + 'numberOrderApp/queryAppPreorderList?token=' + $rootScope.token,
				params:{startTime:STARTTIME,endTime:ENDTIME,pageIndex:$scope.pageIndex}
			}).success(function(data){
				$scope.searchBox = true;
				$ionicLoading.hide();
				$scope.loading = true;
				$scope.showList = false;
				$scope.mask = false;
				$scope.noscroll = false;
				$scope.orderList = data['orderList'];
				loadingState($scope.pageCount,$scope.pageSize);
				$scope.loadMoreData = function(){
					loadMore(STARTTIME,ENDTIME,data.page['pageCount'],data.page['pageSize'])
				};
			}).error(function () {
	              
	        });
		}
	}
	
	//日期搜索
	$scope.toggleSearchBox = function() {
        $scope.searchBox = !$scope.searchBox;
        $scope.mask = !$scope.mask;
        $scope.noscroll = !$scope.noscroll;
    };
    //点击遮罩取消日期查询
    $scope.cancelDateSearch = function(){
    	$scope.searchBox = true;
    	$scope.mask = false;
    	$scope.noscroll = false;
    }
    
    //查看订单详情
	$scope.orderedOrderDetail = function() {
		order["orderCode"] = arguments[0];
		$state.go("orderedOrderDetail");
	};
	//通过号码进行检索
	$scope.searchOrder = function(){
		if($scope.input.tel == '' || $scope.input.tel.length < 11){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请正确输入您所订购的手机号码',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		}else{
			$http({
				method:'get',
				url:ajaxurl + 'numberOrderApp/queryAppPreorderList?token=' + $rootScope.token,
				params:{keywords:$scope.input.tel}
			}).success(function(data){
				//console.log(data.page['pageSize']);
				//console.log(JSON.stringify(data));
				$scope.readMore = false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				loadingState($scope.pageCount,$scope.pageSize);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize)
				};
			}).error(function(){
			
			});
		}
	}
	//判断加载与否状态
	function loadingState(pageCount,pageSize){
		if(pageCount > pageSize){
			$scope.infoState = '加载更多';
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
	}
})