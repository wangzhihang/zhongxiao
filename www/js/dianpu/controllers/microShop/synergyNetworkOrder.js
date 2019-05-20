appControllers.controller('dianpu-synergy-network-order', function($scope,$http,$state,$timeout,$rootScope,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = "异业订单";
	$scope.loadMore = false;

	$scope.orderStatus = [];
	$scope.orderList = [];
	$scope.pageIndex = 1;
	$scope.pageSize = 20;
	$scope.pageCount = '';
	$scope.orderType = '1';

	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.input = {'tel':''};
	// init
	var initParameter = {
		pageIndex: $scope.pageIndex,
		pageSize: $scope.pageSize,
		statusArray:['000001', '000002', '000005', '000006', '000007', '000009', '000010', '000011', '000013'],
		token: $rootScope.token
	};
	getOrderList(initParameter);
	// filter
	$scope.tag = {current: '2'};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			$scope.orderList = [];
			$scope.pageIndex = 1;
			if (param === 1) {
				$scope.orderType = '1';
				$scope.orderStatus = [];
			} else if (param === 2) {
				$scope.orderType = '2';
				$scope.orderStatus = ['000001', '000002', '000005', '000006', '000007', '000009', '000010', '000011', '000013'];
			} else if (param === 3) {
				$scope.orderType = '3';
				$scope.orderStatus = ['000003'];
			} else if (param === 4) {
				$scope.orderType = '4';
				$scope.orderStatus = ['000004'];
			}
			var parameter = {
				pageIndex: $scope.pageIndex,
				pageSize: $scope.pageSize,
				statusArray: $scope.orderStatus,
				token: $rootScope.token,
			};
			getOrderList(parameter);
		}
	};
	// get order list
	function getOrderList(parameter) {
		$scope.loading = true;
		$scope.isNull = false;
		$http({
			method: 'post',
			url: ajaxurl + 'wechatShopApp/findYlHalfOrdersByLevelCode',
			data: parameter
		}).success(function(data){
			$scope.loading = false;
			if (data.code === 0) {
				$scope.orderList = $scope.orderList.concat(data['data']['orderList']);
				$scope.pageCount = data['data']['page']['pageCount'];
				if ( Math.ceil($scope.pageCount/$scope.pageSize) > $scope.pageIndex) {
					$scope.loadMore = true;
				}
				if (data['data']['orderList'].length < $scope.pageSize) {
					$scope.loadMore = false;
				}
				if ($scope.orderList.length === 0) {
					$scope.isNull = true;
				}
			}
		}).error(function(){
			my.alert('数据信息获取失败，请稍后尝试。');
		})
	};
	// load more...
	$scope.loadMoreData = function () {
		$scope.pageIndex++;
		var parameter = {
			startTime: STARTTIME,
			endTime: ENDTIME,
			pageIndex: $scope.pageIndex,
			pageSize: $scope.pageSize,
			token: $rootScope.token
		};
		if ($scope.orderType === '1') {
			parameter.statusArray = [];
			getOrderList(parameter);
		} else if ($scope.orderType === '2') {
			parameter.statusArray = ['000001', '000002', '000005', '000006', '000007', '000009', '000010', '000011', '000013'];
			getOrderList(parameter);
		} else if ($scope.orderType === '3') {
			parameter.statusArray = ['000003'];
			getOrderList(parameter);
		} else if ($scope.orderType === '4') {
			parameter.statusArray = ['000004'];
			getOrderList(parameter);
		}
	};
	//按日期查询订单
	function queryOrder(){
		$scope.loading=false;
		$scope.readMore=true;
		$scope.pageIndex = 1;
		if(STARTTIME == undefined || ENDTIME == undefined){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请选择起始日期与结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			$scope.searchBox = false;
		}else if(STARTTIME > ENDTIME){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '起始日期不得大于结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
		}else if(ENDTIME > TODAY){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '结束日期不得大于当前日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
		}else{
			$scope.orderList = [];
			$scope.pageIndex = 1;
			var parameter = {
				startTime: STARTTIME,
				endTime: ENDTIME,
				pageIndex: $scope.pageIndex,
				pageSize: $scope.pageSize,
				token: $rootScope.token
			};
			getOrderList(parameter);
		}
	}
	//查询
	$scope.toggleSearchPanel = function() {
        $scope.searchPanel = !$scope.searchPanel;
        $scope.mask = !$scope.mask;
        $scope.isNoShowHeader=!$scope.isNoShowHeader;
	};
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	}
    //日期查询
	$scope.dateSearch = function(){
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.isNoShowHeader=true;
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
					   queryOrder();
				   }
				 }
			   }
			 ]
		});
	};
		
	//号码查询
	$scope.telSearch = function(){
		$scope.isNoShowHeader=true;
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
			 subTitle: '输入订购的手机号码查询',
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
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   var parameter = {
							number: $scope.input.phonenumber.replace(/[^\d]/g, ""),
							pageIndex: $scope.pageIndex,
							pageSize: $scope.pageSize,
							token: $rootScope.token
						};
						getOrderList(parameter);
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
    //点击遮罩取消日期查询
    $scope.cancelDateSearch = function(){
    	$scope.searchBox = true;
    	$scope.mask = false;
    	$scope.noscroll = false;
    }
	// ... to  order details
	$scope.wxOrderDetail = function() {
		order["orderCode"] = arguments[0];
		$state.go("dianpu-synergy-network-order-details");
	}
	// translate status
	$scope.translateStatus = function (e) {
		if (e === '000001') {
			return '<span class="produceProgress f-13 goingStatus">待处理</span>'
		} else if (e === '000002') {
			return '<span class="produceProgress f-13 goingStatus">身份验证成功</span>'
		} else if (e === '000003') {
			return '<span class="produceProgress f-13 finishStatus">订单成功</span>'
		} else if (e === '000004') {
			return '<span class="produceProgress f-13 unfinishedStatus">订单已取消</span>'
		} else if (e === '000005') {
			return '<span class="produceProgress f-13 unfinishedStatus">身份验证失败</span>'
		} else if (e === '000006') {
			return '<span class="produceProgress f-13 otherStatus">长号完成</span>'
		} else if (e === '000007') {
			return '<span class="produceProgress f-13 otherStatus">签名完成</span>'
		} else if (e === '000009') {
			return '<span class="produceProgress f-13 goingStatus">订单提交成功</span>'
		} else if (e === '000010') {
			return '<span class="produceProgress f-13 goingStatus">活体认证成功</span>'
		} else if (e === '000011') {
			return '<span class="produceProgress f-13 unfinishedStatus">活体认证失败</span>'
		} else if (e === '000013') {
			return '<span class="produceProgress f-13 goingStatus">已付款</span>'
		}
	}
})