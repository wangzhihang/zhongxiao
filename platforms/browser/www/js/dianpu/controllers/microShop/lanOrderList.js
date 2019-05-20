appControllers.controller('dianpu-microshop-lan-order-list', function($scope,$http,$state,$rootScope,$timeout,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = "宽带预约订单";
	$scope.infoState = '加载更多';
	$scope.loading = false;
	$scope.showList = true;
	$scope.searchBox = true;
	$scope.readMore = true;
	$scope.noMoreTips = true;
	$scope.mask = false;
	$scope.noscroll = false;
	$scope.lanOrderList = [];
	$scope.newOrderList=[];
	$scope.newOrderList1=[];//订单查询000004时使用
	$scope.pageIndex = 1;
	$scope.pageSize = '';
	$scope.pageCount = '';
	$scope.input = {'phonenumber':''};
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
	$scope.levelCode=deptInfo.levelCode;
	var orderStatus = {
		// "000000":{"color":"txtOrange","text":"全部订单","btn":0}
		 "000001":{"color":"goingStatus","text":"待处理","btn":0,"timeStatus":"下单时间："}
		,"000002":{"color":"goingStatus","text":"地址预判成功,等待实名","btn":0,"timeStatus":"下单时间："}
		,"000003":{"color":"otherStatus","text":"签名完成,等待开卡","btn":0,"timeStatus":"下单时间："}
		// ,"000004":{"color":"approveSucColor","text":"开卡成功,等待快递","btn":0}
		// ,"000005":{"color":"longNumColor","text":"快递中","btn":0}
		,"000009":{"color":"otherStatus","text":"认证中","btn":0,"timeStatus":"下单时间："}
		,"000100":{"color":"otherStatus","text":"订单完成,未收费","btn":1,"timeStatus":"下单时间："}
		,"000101":{"color":"finishStatus","text":"订单完成,已收费","btn":1,"timeStatus":"完成时间："}
		,"000200":{"color":"unfinishedStatus","text":"订单失败","btn":2,"timeStatus":"下单时间："}
		,"000201":{"color":"unfinishedStatus","text":"用户取消","btn":2,"timeStatus":"下单时间："}
	}
				   
	//页面初始化
	getData(["000003"]);
	function getData(statusArray){
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.loading = false;
		$scope.readMore = false;
		$scope.noMoreTips = true;
		$scope.waitList=[];
		$scope.successList=[];
		$scope.failureList=[];
		$scope.dealList=[];
		$scope.newOrderList=[];
		$http({
			method:'POST',
			url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
			// timeout: 5000,
			data:{
				"pageSize": 10,
				"pageIndex": $scope.pageIndex,
				"disCode": "7100000",
				"statusArray":statusArray,
				"beginDateString": "2018-04-01 00:00:00",
				"endDateString": TODAY,
				"contactNumber":$scope.input.phonenumber,
				"deptLevel":$scope.levelCode
			}
		}).success(function(data){
			$scope.loading = true;
			$scope.showList = false;
			console.log("data",data.orderList)
			for(var i in data.orderList){

				if(data.orderList[i].status=='000003' && data.orderList[i].projectAddress==null){
					data.orderList[i].wxOrderState='签名完成，地址未预判';
				}else if(data.orderList[i].status == '000002'){
					if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000001'){
						data.orderList[i].wxOrderState='未实名,未预判';
					}else if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000002'){
						data.orderList[i].wxOrderState='未实名,预判成功';
					}if(data.orderList[i].realNameStatus == '000006' && data.orderList[i].advanceAddressStatus =='000001'){
						data.orderList[i].wxOrderState='实名,未预判';
					}
					
				}else{
					data.orderList[i].wxOrderState = orderStatus[data.orderList[i].status].text;
				}
				data.orderList[i].color = orderStatus[data.orderList[i].status].color;
				data.orderList[i].timeStatus = orderStatus[data.orderList[i].status].timeStatus;
				// console.log(data.orderList[i].color)
			}
			// $scope.lanOrderList = data['orderList'];
			$scope.newOrderList=data['orderList'];
			$scope.pageSize = data.page['pageSize'];
			$scope.pageCount = data.page['pageCount'];
			//如果小于pageSize禁止上拉加载
			if(data.orderList.length < data.page.pageSize){
				$scope.noMoreTips = false;
				$scope.readMore = true;
			}else{
				$scope.noMoreTips = true;
				$scope.readMore = false;
			}
			// loadingState(data);
			$scope.loadMoreData = function(){
				loadMore([],'2018-04-01 00:00:00',TODAY,$scope.pageCount,$scope.pageSize)
			};
			
			//console.log($scope.orderList);
		}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('index');
              }); 
        });
	}
	
	function judgeData(){
	}
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd HH:mm:ss');
	}
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd HH:mm:ss');
	}
	
	//加载更多
	function loadMore(statusArray,startTime,endTime,contactNumber,pageCount,pageSize){
		if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
			$scope.loading = false;
			$scope.pageIndex++;
			$scope.waitList=[];
			$scope.successList=[];
			$scope.failureList=[];
			$scope.dealList=[];
			$http({
				method:'POST',
				url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
				data:{
					"pageSize": 10,
					"pageIndex": $scope.pageIndex,
					"disCode": "7100000",
					"statusArray":statusArray,
					"beginDateString": startTime,
					"endDateString": endTime,
					"contactNumber":contactNumber,
					"deptLevel":$scope.levelCode
				}
			}).success(function(data){
				// console.log('data=='+JSON.stringify(data));
				$scope.loading = true;
				$scope.mask = false;
				$scope.noscroll = false;
				// judgeData();
				// loadingState(data);
				for(var i in data.orderList){
					if(data.orderList[i].status=='000003' && data.orderList[i].projectAddress==null){
						data.orderList[i].wxOrderState='签名完成，地址未预判';
					}else if(data.orderList[i].status == '000002'){
						if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='未实名,未预判';
						}else if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000002'){
							data.orderList[i].wxOrderState='未实名,预判成功';
						}if(data.orderList[i].realNameStatus == '000006' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='实名,未预判';
						}
					}else{
							data.orderList[i].wxOrderState = orderStatus[data.orderList[i].status].text;
						}
					data.orderList[i].color = orderStatus[data.orderList[i].status].color;
					data.orderList[i].timeStatus = orderStatus[data.orderList[i].status].timeStatus;
				}
				$scope.newOrderList = $scope.newOrderList.concat(data['orderList']);
				// console.log('111=='+JSON.stringify($scope.newOrderList));
			}).error(function(){
			
			});
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
	}
	
	
	//按日期查询订单
	function queryOrder(){
		$scope.loading=false;
		$scope.readMore=true;
		$scope.pageIndex = 1;
		// console.log(typeof(STARTTIME));
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
				method:'post',
				url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
				data:{
					"pageSize": 10,
					"pageIndex": $scope.pageIndex,
					"disCode": "7100000",
					"statusArray":[],
					"beginDateString": STARTTIME,
					"endDateString": ENDTIME,
					"contactNumber":$scope.input.phonenumber,
					"deptLevel":$scope.levelCode
				}
			}).success(function(data){
				$scope.searchBox = true;
				// $ionicLoading.hide();
				$scope.loading = true;
				$scope.readMore=true;
				$scope.showList = false;
				$scope.mask = false;
				$scope.noscroll = false;
				for(var i in data.orderList){
					if(data.orderList[i].status=='000003' && data.orderList[i].projectAddress==null){
						data.orderList[i].wxOrderState='签名完成，地址未预判';
					}else if(data.orderList[i].status == '000002'){
						if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='未实名,未预判';
						}else if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000002'){
							data.orderList[i].wxOrderState='未实名,预判成功';
						}if(data.orderList[i].realNameStatus == '000006' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='实名,未预判';
						}
					}else{
							data.orderList[i].wxOrderState = orderStatus[data.orderList[i].status].text;
						}
					data.orderList[i].color = orderStatus[data.orderList[i].status].color;
					data.orderList[i].timeStatus = orderStatus[data.orderList[i].status].timeStatus;
				}
				$scope.newOrderList=data['orderList'];
				// loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('',STARTTIME,ENDTIME,$scope.input.phonenumber,data.page['pageCount'],data.page['pageSize'])
				};
			}).error(function () {
	             my.alert('数据信息获取失败！').then(function(){
	                  $state.go('index');
	              }); 
	        });
		}
	}
	
	//查询
	$scope.toggleSearchPanel = function() {
		$scope.tag1.current = 2; 
        getData(["000003"]);
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
					   //console.log(ENDTIME);
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
			   { 
			   		text: '取消' ,
			   		onTap: function() {
					 	$scope.input.phonenumber = '';
					 }
				},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.phonenumber == ''){
					   my.alert('请正确输入手机号码');
				   }else{
					   //console.log("手机号码："+$scope.input.phonenumber);
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
	$scope.wxOrderDetail = function() {
		order["orderCode"] = arguments[0];
		$state.go("dianpu-microshop-lan-order-detail");
//		console.log(order["orderCode"]);
	};
	//通过号码进行检索
	function searchOrder(){
		// $ionicLoading.show({template: '数据加载中...'});
		if($scope.input.phonenumber == '' || $scope.input.phonenumber.length < 13){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请正确输入您所订购的手机号码',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		}else{
			$scope.orderList = [];
			$scope.loading = false;
			$scope.readMore=true;
			$http({
				method:'post',
				url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
				data:{
					"pageSize": 10,
					"pageIndex": $scope.pageIndex,
					"statusArray":[],
					"disCode": "7100000",
					"beginDateString": "2018-04-01 00:00:00",
					"endDateString": TODAY,
					"contactNumber":$scope.input.phonenumber.replace(/[^\d]/g, ""),
					"deptLevel":$scope.levelCode
				}
			}).success(function(data){
				//console.log(data.page['pageSize']);
				//console.log(JSON.stringify(data));
				// $ionicLoading.hide();
				$scope.input.phonenumber = '';
				$scope.searchBox = true;
				$scope.readMore = true;
				$scope.loading = true;
				$scope.showList = false;
				$scope.mask = false;
				$scope.lanOrderList = data['lanOrderList'];
				// judgeData();
				for(var i in data.orderList){
					if(data.orderList[i].status=='000003' && data.orderList[i].projectAddress==null){
						data.orderList[i].wxOrderState='签名完成，地址未预判';
					}else if(data.orderList[i].status == '000002'){
						if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='未实名,未预判';
						}else if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000002'){
							data.orderList[i].wxOrderState='未实名,预判成功';
						}if(data.orderList[i].realNameStatus == '000006' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='实名,未预判';
						}
					}else{
							data.orderList[i].wxOrderState = orderStatus[data.orderList[i].status].text;
						}
					data.orderList[i].color = orderStatus[data.orderList[i].status].color;
					data.orderList[i].timeStatus = orderStatus[data.orderList[i].status].timeStatus;
				}
				$scope.newOrderList=data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				// loadingState(data);
				$scope.loadMoreData = function(){
					loadMore([],'2018-04-01 00:00:00',TODAY,$scope.input.phonenumber.replace(/[^\d]/g, ""),$scope.pageCount,$scope.pageSize)
				};
			}).error(function(){
			
			});
		}
	}
	
	//判断加载与否状态
	function loadingState(data){
		// if(data.lanOrderList.length < data.page.pageSize){
        //     $scope.infoState = '没有更多了';
		// 	$scope.readMore = true;
		// 	$scope.noMoreTips = false;
        // }else{
        //     $timeout(function () {
        //        $scope.infoState = '加载更多';
        //     }, 1 * 1000);
        // }
	}
	
	//点击办理
	// $scope.manage=function(index){
	// 	$scope.orderStatus="000005";
	// 	$scope.orderCode=$scope.lanOrderList[index].orderCode;
	// 	// wx_orderCode = $scope.orderCode;
	// 	wx_order = {
	// 		  "number":""
	// 		, "orderCode":$scope.orderCode
	// 		, "orderStatus":"000005"
	// 		, "orderType":"000002"
	// 		, "category":"000001"
	// 		, "userId":""
	// 	}
	// 	$state.go('dianpu-lan-business');
	// }

	// $scope.pay = function(index){

	// }

	//切换
	$scope.choseShow=true;
	$scope.dateShow=$scope.phoneShow=false;
	//切换效果
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent1:function(param){
			$scope.tag.current1 = param;
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
	
	//订单状态获取数据
	function getStatusData(statusArray){
		$scope.loading = false;
		$scope.readMore = true;
		$scope.noMoreTips = true;
		$scope.newOrderList = [];
		// $ionicLoading.show({template: '数据加载中...'});
		$http({
			method:'post',
			url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
			data:{
				"pageSize": 10,
				"pageIndex": $scope.pageIndex,
				"statusArray":statusArray,
				"disCode": "7100000",
				"beginDateString": "2018-04-01 00:00:00",
				"endDateString": TODAY,
				"contactNumber":$scope.input.phonenumber,
				"deptLevel":$scope.levelCode
			}
		}).success(function(data){
			console.log("ok");
			console.log('data==??'+JSON.stringify(data));
			// $ionicLoading.hide();
			$scope.loading = true;
			$scope.newOrderList = data['orderList'];
			// judgeData();
			// $scope.newOrderList=$scope.lanOrderList;
			for(var i in data.orderList){
					if(data.orderList[i].status=='000003' && data.orderList[i].projectAddress==null){
						data.orderList[i].wxOrderState='签名完成，地址未预判';
					}else if(data.orderList[i].status == '000002'){
						if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='未实名,未预判';
						}else if(data.orderList[i].realNameStatus == '000001' && data.orderList[i].advanceAddressStatus =='000002'){
							data.orderList[i].wxOrderState='未实名,预判成功';
						}if(data.orderList[i].realNameStatus == '000006' && data.orderList[i].advanceAddressStatus =='000001'){
							data.orderList[i].wxOrderState='实名,未预判';
						}
					}else{
							data.orderList[i].wxOrderState = orderStatus[data.orderList[i].status].text;
						}
					data.orderList[i].color = orderStatus[data.orderList[i].status].color;
					data.orderList[i].timeStatus = orderStatus[data.orderList[i].status].timeStatus;
				}
			if(data.orderList.length < data.page.pageSize){
				$scope.noMoreTips = false;
				$scope.readMore = true;
			}else{
				$scope.noMoreTips = true;
				$scope.readMore = false;
			}
			// console.log(JSON.stringify($scope.newOrderList));
			$scope.pageSize = data.page['pageSize'];
			$scope.pageCount = data.page['pageCount'];
			// loadingState(data);
			$scope.loadMoreData = function(){
				loadMore(statusArray,'','',$scope.pageCount,$scope.pageSize)
			};
			
			//console.log($scope.lanOrderList);
		});
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
			$scope.telFareOrderList = [];
			$http({
				method:'post',
				url:ajaxurl + 'lanPreorderApp/queryLanPreorderList?token=' + $rootScope.token,
				data:{disCode: "7100000",keywords:$scope.input.userName,deptLevel:$scope.levelCode,
			beginDateString: "2018-04-01 00:00:00",endDateString: TODAY,pageSize:10,pageIndex:1}
				
			}).success(function(data){
				$scope.input.userName = '';
				$scope.readMore = true;
				$scope.loading = true;
				$scope.showList = false;
				$scope.newOrderList = data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],'',$scope.input.userName)
				};
			}).error(function(){
			
			});
		}
	}
	//导航切换
	$scope.tag1 = {
		current: "2"
	};
	$scope.actions1= {
		setCurrent: function (param) {
			$scope.tag1.current = param;
			if($scope.tag1.current==1){
				// $ionicLoading.show({template: '数据加载中...'});
				$scope.newOrderList=[];
				getData([]);
			}else if($scope.tag1.current==2){
				$scope.newOrderList=[];
				getStatusData(['000003']);
				
				
			// }else if($scope.tag1.current==3){
			// 	$scope.newOrderList=[];
			// 	getStatusData(['000101']);
				
			// }else if($scope.tag1.current==4){
			// 	$scope.newOrderList=[];
			// 	getStatusData(['000200','000201']);

			// }





			}else if($scope.tag1.current==3){
				$scope.newOrderList=[];
				getStatusData(['000002']);
				
			}else if($scope.tag1.current==4){
				$scope.newOrderList=[];
				getStatusData(['000101']);

			}




			
		}
	};
})