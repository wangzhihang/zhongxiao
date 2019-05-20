appControllers.controller('hf-order-list', function($scope,$http,$state,$rootScope,my,$ionicLoading,$ionicPopup,$filter,$timeout) {
	$scope.title = '话费订单';
	$scope.userId = localStorage.getItem('userId');
	$scope.orderList = [];
	$scope.input= {phonenumber:''};
	$scope.status = '';
	$scope.pageIndex = 1;
	$scope.pageSize = 10;
	
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	// 头部导航
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			switch($scope.tag.current ){
				case 1:
					$scope.orderList = [];
					$scope.pageIndex = 1;
					getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),[]);
					break;
				case 2:
					$scope.orderList = [];
					$scope.pageIndex = 1;
					getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),['000003']);
					break;
				case 3:
					$scope.orderList = [];
					$scope.pageIndex = 1;
					getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),['000007','000001','000002','000004','000005']);
					break;
			}
		}
	}
	//初始化列表
	getOrderList(
		$scope.pageIndex,
		$scope.pageSize,
		STARTTIME,
		ENDTIME,
		$scope.input.phonenumber.replace(/[^\d]/g, ""),
		[]
	);
	//查询
	$scope.toggleSearchPanel = function() {
        $scope.searchPanel = !$scope.searchPanel;
        $scope.mask = !$scope.mask;
    };
	
	//点击遮罩取消弹出面板
    $scope.cancelMask = function(){
    	$scope.searchPanel = false;
    	$scope.mask = false;
    };
	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	switch($scope.tag.current ){
			case 2:
				getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),['000003']);
				break;
			case 3:
				getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),['000007','000001','000002','000004','000005']);
				break;
			default:
				getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),[]);				
		}
    };
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	};
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	};
	
	//日期查询
	$scope.dateSearch = function(){
		$scope.searchPanel = false;
		$scope.mask = false;
		
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">开始日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="startTime" ng-change="setStartTime(startTime)"/>'+
								'</div>'+
							'</li>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">结束日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="endTime" ng-change="setEndTime(endTime)"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		
		$ionicPopup.show({
			 template: temp,
			 title: '日期查询',
			 subTitle: '输入开始日期与结束日期',
			 scope: $scope,
			 buttons: [
			   { text: '取消' },
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if(STARTTIME == '' || ENDTIME == ''){
					   my.alert('请输入开始日期结束日期');
				   }else if(STARTTIME > ENDTIME){
					   my.alert('对不起，开始日期不能大于结束日期！');
				   }else if(STARTTIME == TODAY && STARTTIME == ENDTIME){
					   ENDTIME = GetDateStr(1);
				   }else if(ENDTIME > TODAY){
					   my.alert('对不起，结束日期不能大于当前日期！');
				   }else{
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   getOrderList(
						   $scope.pageIndex,
						   $scope.pageSize,
						   STARTTIME,
						   ENDTIME,
						   $scope.input.phonenumber.replace(/[^\d]/g, ""),
						   $scope.status
					   );
				   }
				 }
			   }
			 ]
		});
	};
	
	//号码查询
	$scope.telSearch = function(){
		
		$scope.searchPanel = false;
		$scope.mask = false;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="tel" class="textBox" ng-model="input.phonenumber" ng-keyup="telChange()" placeholder="输入11位手机号码"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '手机号码查询',
			 subTitle: '输入充值的手机号码',
			 scope: $scope,
			 buttons: [
			   { text: '取消' },
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.phonenumber == ''){
					   my.alert('请正确输入手机号码');
				   }else{
					  // console.log("手机号码："+$scope.input.phonenumber);
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   getOrderList(
						   $scope.pageIndex,
						   $scope.pageSize,
						   STARTTIME,
						   ENDTIME,
						   $scope.input.phonenumber.replace(/[^\d]/g, ""),
						   $scope.status
					   );
				   }
				 }
			   },
			 ]
		});
	};
	//号码输入格式
	$scope.telChange = function(){
		$scope.input.phonenumber = telFormat($scope.input.phonenumber);
	};
	//获取订单信息
	function getOrderList(pageIndex,pageSize,startTime,endTime,number,statusArray){
		$scope.loading = true;
		// $ionicLoading.show({template: '数据加载中...'});
		$http({
			method:'get',
			url:ajaxurl + 'chargeOrderApp/queryUserRechargeOrderList?token=' + $rootScope.token,
			params:{
				pageIndex:pageIndex,
				pageSize:pageSize,
				startTime:startTime,
				endTime:endTime,
				number:number,
				statusArray:statusArray
			},
			timeout: 5000
		}).success(function(data){
			// $ionicLoading.hide();
			$scope.loading = false;
			//console.log(JSON.stringify(data));
			$scope.orderList = $scope.orderList.concat(data.orderList);
			//如果小于pageSize禁止上拉加载
			if(eval(data.orderList).length < data.page.pageSize){
				$scope.hasmore = false;
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
		}).error(function () { 
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
				$state.go('index_dl');
			}); 
		}).finally(function () { 
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}
});