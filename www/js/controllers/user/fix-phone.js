appControllers.controller('fixPhone', function($scope,$http,$state,$rootScope,$timeout,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = '固话订单列表';
	$scope.infoState = '加载更多';
	$scope.loading = false;
	$scope.showList = true;
	$scope.searchBox = true;
	$scope.readMore = true;
	$scope.noMoreTips = true;
	$scope.mask = false;
	$scope.noscroll = false;
	$scope.noMore = false;
	$scope.kdOrderList = [];
	$scope.pageIndex = 1;
	$scope.pageSize = '';
	$scope.pageCount = '';
	$scope.input = {'phonenumber':''};
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	$scope.userId=userBo.userId;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.levelCode=deptInfo.levelCode;
	//console.log($scope.userId);
	/*$scope.day = new Date();
	 $scope.endTimer=$filter("date")($scope.day,"yyyy-MM-dd HH:mm:ss")
	 console.log($scope.endTime);
	 $scope.startTimer=$filter("date")($scope.day.getTime() - 24*60*60*1000*30,"yyyy-MM-dd HH:mm:ss");
	 console.log($scope.startTime);*/
	$scope.getData=function(statusArray){
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading = false;
	$scope.orderList = [];
	$scope.readMore = true;
	$scope.noMoreTips = true;
	$http({
		method:'GET',
		url:ajaxurl + 'telOrderApp/queryAppTelOrderList?token=' + $rootScope.token,
		params:{statusArray:statusArray,levelCode:$scope.levelCode},
	}).success(function(data){
		// $ionicLoading.hide();
		//console.log("aaaaa="+JSON.stringify(data));
		$scope.readMore = false;
		$scope.loading = true;
		//console.log("$scope.readMore="+$scope.readMore);
		$scope.orderList = data['orderList'];
		//console.log($scope.orderList);
		/*angular.forEach($scope.orderList,function(data){
			//console.log(data.status);
			if(data.status==000003){
				$scope.button='已完成';
				$scope.yiwancheng=true;
				$scope.weiwancheng=false;
				$scope.bupaizhao=false;
			}else if($scope.status==000001||$scope.status==000002||$scope.status==000005||$scope.status==000006||$scope.status==000007){
				$scope.button='未完成';
				$scope.yiwancheng=false;
				$scope.weiwancheng=true;
				$scope.bupaizhao=false;
			}
			else if(data.status==000005){
				$scope.button='补拍照';
				$scope.weiwancheng=false;
				$scope.yiwancheng=false;
				$scope.bupaizhao=true;
			}
		})*/
		$scope.pageSize = data.page['pageSize'];
		$scope.pageCount = data.page['pageCount'];
		loadingState(data);
		$scope.loadMoreData = function(){
			loadMore('','',$scope.pageCount,$scope.pageSize,statusArray)
		};
	}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index');
            }); 
       	});
	}
	$scope.getData([]);

	//切换效果
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			switch($scope.tag.current){
				case 1:
					$scope.getData([]);
					break;
				case 2:
					$scope.getData(['000003']);
					break;
				case 3:
					$scope.getData(['000001','000002','000004','000005','000006','000007']);
					break;
				case 4:
					$scope.getData(['000007'])
					break;
			}
		},
		setCurrent1:function(param){
			$scope.tag.current1 = param;
			console.log(param)
			switch($scope.tag.current1){
				case 1:
					$scope.dateSearch();
					break;
				case 2:
					$scope.telSearch();
					break;
				case 3:
					$scope.nameSearch();
					break;
			}
		}
	};
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//加载更多
	function loadMore(startTime,endTime,pageCount,pageSize,statusArray){
		//console.log("222");
		if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
			$scope.loading = false;
			$scope.readMore=true;
			$scope.pageIndex++;
			//console.log("$scope.pageIndex="+$scope.pageIndex);
			$http({
				method:'GET',
				url:ajaxurl + 'telOrderApp/queryAppTelOrderList?token=' + $rootScope.token,
				params:{startTime:startTime,endTime:endTime,pageIndex:$scope.pageIndex,statusArray:statusArray,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.readMore = false;
				$scope.loading = true;
				$scope.mask = false;
    			$scope.noscroll = false;
    			loadingState(data);
				$scope.orderList = $scope.orderList.concat(data['orderList']);
			}).error(function(){
			
			});
		}else{
		//console.log("111");
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
		
	}
	//按日期查询订单
	function queryOrder(){
		$scope.pageIndex = 1;
		$scope.loading=false;
		$scope.readMore=true;
		//console.log(STARTTIME);
		//console.log(ENDTIME);
		// $ionicLoading.show({template: '数据加载中...'});
		if(STARTTIME == undefined || ENDTIME == undefined){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请选择起始日期与结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
			$scope.searchBox = false;
		}else if(STARTTIME > ENDTIME){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '起始日期不得大于结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
		}else if(ENDTIME > TODAY){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '结束日期不得大于当前日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
		}else{
			$http({
				method:'GET',
				url:ajaxurl + 'telOrderApp/queryAppTelOrderList?token=' + $rootScope.token,
				params:{startTime:STARTTIME,endTime:ENDTIME,pageIndex:$scope.pageIndex,levelCode:$scope.levelCode}
			}).success(function(data){
				//console.log($scope.pageIndex);
				$scope.searchBox = true;
				// $ionicLoading.hide();
				$scope.readMore=false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.mask = false;
    			$scope.noscroll = false;
				$scope.orderList = data['orderList'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore(STARTTIME,ENDTIME,data.page['pageCount'],data.page['pageSize'])
				};
			}).error(function(){
				
			});
		}
	}
	
	//查询
	$scope.toggleSearchPanel = function() {
		$scope.getData([]);
        // $scope.searchPanel = !$scope.searchPanel;
        // $scope.mask = !$scope.mask;
        // $scope.isNoShowHeader=!$scope.isNoShowHeader;
        // $scope.searchBox=false;
    };
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
					  // console.log(ENDTIME);
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
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
		$scope.searchBox=true;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="tel" class="textBox" ng-keyup="telChange()" ng-model="input.phonenumber" placeholder="输入8位固话号码或11位长号号码"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '号码查询',
			 subTitle: '输入订购的固话号码或11位长号号码查询',
			 scope: $scope,
			 buttons: [
			   { 
			   		text: '取消',
			   		onTap: function() {
					 	$scope.input.phonenumber = '';
					 }
			   	},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.input.phonenumber == ''){
					   my.alert('请正确输入固话号码或11位长号号码');
				   }else{
					  // console.log("固话号码："+$scope.input.phonenumber);
					   $scope.pageIndex = 1;
					   searchOrder();
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
    //查看订单详情
    $scope.orderDetail = function(){
    	order["orderCode"] = arguments[0];
    	order["numberOrderCode"] = arguments[1];
		$state.go("fixPhoneDetail");
    };
    //通过号码进行检索
    function searchOrder(){
		if($scope.input.phonenumber == '' || $scope.input.phonenumber.length < 7){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请正确输入固话号码或11位长号号码',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		    $scope.input.phonenumber = '';
		}else{
			//console.log($scope.input.phonenumber.length);
			$scope.loading = false;
			$scope.readMore=true;
			$scope.orderList = [];
			$http({
				method:'GET',
				url:ajaxurl + 'telOrderApp/queryAppTelOrderList?token=' + $rootScope.token,
				params:{keywords:$scope.input.phonenumber.replace(/[^\d]/g, ""),levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.input.phonenumber = '';
				$scope.readMore = false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize)
				};
			}).error(function(){
			
			});
		}
	}
	//客户姓名 查询
	$scope.nameSearch = function(){
		$scope.isNoShowHeader=true;
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.searchBox=true;
		$scope.readMore=true;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="text" class="textBox" ng-model="input.userName" placeholder="请输入客户姓名"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '客户姓名查询',
			 subTitle: '输入客户姓名查询',
			 scope: $scope,
			 buttons: [
			   { 
			   		text: '取消',
			   		onTap: function() {
					 	$scope.input.userName = '';
					 }
			   	},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.input.userName == ''){
					   my.alert('请正确的客户姓名');
				   }else{
					  // console.log("手机号码："+$scope.input.phonenumber);
					   $scope.pageIndex = 1;
					   userNameSearch();
				   }
				 }
			   },
			 ]
		});
	}
	//通过客户姓名查询
	function userNameSearch(){
		if($scope.input.userName == ''){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请正确输入客户姓名',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		    $scope.input.userName = '';
		}else{
			//console.log($scope.input.phonenumber.length);
			$scope.loading = false;
			$scope.orderList = [];
			$http({
				method:'GET',
				url:ajaxurl + 'telOrderApp/queryAppTelOrderList?token=' + $rootScope.token,
				params:{keywords:$scope.input.userName,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.input.userName = '';
				$scope.readMore = false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				//console.log("$scope.orderList=="+$scope.orderList);
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCosunt'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],'',$scope.input.userName)
				};
			}).error(function(){
			
			});
		}
	}
	//判断加载与否状态
	function loadingState(data){
		if(data.orderList.length < data.page.pageSize){
            $scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
        }else{
            $timeout(function () {
               $scope.infoState = '加载更多';
            }, 1 * 1000);
        }
	}
})
