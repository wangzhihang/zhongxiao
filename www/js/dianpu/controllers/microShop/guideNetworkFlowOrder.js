appControllers.controller('dianpu-guide-network-flow-order', function($scope,$http,$state,$timeout,$rootScope,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = "引流订单";
	$scope.loadMore = false;
	$scope.orderList = [];
	$scope.pageIndex = 1;
	$scope.pageSize = 20;
	$scope.statusArray = [];
	$scope.realNameStatus = "";
	$scope.current = localStorage.getItem('guideNetworkFlowOrder_param') ? localStorage.getItem('guideNetworkFlowOrder_param') : "2";
	$scope.input ={keywords:"",phonenumber:""};
	// get order list
	$scope.getOrderList = function(parameter) {
		$scope.loading = true;
		$scope.isNull = false;
		$http({
			method:'post',
			url: ajaxurl+'wechatShopApp/findYlBlankOrdersByLevelCode',
			data: parameter
		}).success(function(data){
			$scope.loading = false;
			$scope.input.keywords = '';
			if (data.code === 0) {
				var orderList = data['data']['orderList'];
				var orderListNew = []
				for(var i in orderList){
					orderList[i].statusInfo = $scope.translateStatus(orderList[i]);
					orderListNew.push(orderList[i]);
				}
				$scope.orderList = $scope.orderList.concat(orderListNew);
				console.log($scope.orderList)
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

	$scope.setCurrent = function ()
	{
		$scope.input ={keywords:""};
		if(arguments[0]){
			$scope.current = arguments[0];
			localStorage.setItem('guideNetworkFlowOrder_param', $scope.current);
		}
		console.log($scope.current)
		$scope.orderList = [];
		$scope.pageIndex = 1;
		if (String($scope.current) === String("1")) {
			$scope.statusArray = ["000001"];
			$scope.realNameStatus = "000001";
		} else if (String($scope.current) === String("2")) {
			$scope.statusArray = ['000001'];
			$scope.realNameStatus = "000100";
		} else if (String($scope.current) === String("3")) {
			$scope.statusArray = ['000100',"000199"];
			$scope.realNameStatus = null;
		} else if (String($scope.current) === String("4")) {
			$scope.statusArray = ['000200'];
			$scope.realNameStatus = null;
		}
		$scope.getOrderList({
				"token":$rootScope.token,
				"pageIndex":$scope.pageIndex,
				"pageSize":$scope.pageSize,
				"keywords":$scope.input.keywords,
				"statusArray":$scope.statusArray,
				"realNameStatus":$scope.realNameStatus,
				"number":"",
				"startTime":"",
				"endTime":""
			});
	};

	$scope.loadMoreData = function () {
		$scope.pageIndex++;
		$scope.getOrderList({
				"token":$rootScope.token,
				"pageIndex":$scope.pageIndex,
				"pageSize":$scope.pageSize,
				"keywords":$scope.input.keywords,
				"statusArray":$scope.statusArray,
				"realNameStatus":$scope.realNameStatus,
				"number":"",
				"startTime":"",
				"endTime":""
			});
	};

	$scope.setCurrent();


	$scope.wxOrderDetail = function(orderNumber, orderStatus) {
		var params = [orderNumber, orderStatus];
		localStorage.setItem('guideNetworkFlowOrder', JSON.stringify(params));
		$state.go("dianpu-guide-network-flow-order-details");
	}
	// translate status
	// $scope.translateStatus = function (e) {
	// 	if (e === '000001') {
	// 		return '<span class="produceProgress ml-10 dealColor">待处理</span>'
	// 	} else if (e === '000002') {
	// 		return '<span class="produceProgress ml-10 verifyColor">待实名</span>'
	// 	}else if (e === '000003') {
	// 		return '<span class="produceProgress ml-10 txt666">订单取消</span>'
	// 	} else if (e === '000005') {
	// 		return '<span class="produceProgress ml-10 failureColor">签名完成</span>'
	// 	} else if (e === '000009') {
	// 		return '<span class="produceProgress ml-10 signatureColor">认证中</span>'
	// 	} else if (e === '000010') {
	// 		return '<span class="produceProgress ml-10 submitColor">订单完成</span>'
	// 	}
	// }

	$scope.translateStatus = function (e) {
		var data = {}
		console.log(e)
		
		console.log(e.status)
		if(e.status == "000001"){
			if(e.realNameStatus == "000100"){
				data = {"txt":"待开卡","class":"goingStatus","timeStatus":"下单时间："}
			}else{
				data = {"txt":"待实名","class":"goingStatus","timeStatus":"下单时间："}
			}
		}else if(e.status == "000100"){
			data = {"txt":"开卡成功","class":"finishStatus","timeStatus":"完成时间："}
			if(e.expressNo){
				data.txt += ",已发货"
			}else{
				data.txt += ",未发货"
			}
		}else if(e.status == "000199"){
			data = {"txt":"订单完成","class":"finishStatus","timeStatus":"完成时间："}
		}else if(e.status == "000200"){
			data = {"txt":"订单取消","class":"unfinishedStatus","timeStatus":"下单时间："}
		}
		return data;
	}
	$scope.toggleSearchPanel = function() {
		$scope.orderList = [];
		$scope.loading = true;
	  	$scope.getOrderList({
			"token":$rootScope.token,
			"pageIndex":$scope.pageIndex,
			"pageSize":$scope.pageSize,
			"keywords":$scope.input.keywords,
			"statusArray":$scope.statusArray,
			"realNameStatus":$scope.realNameStatus,
			"number":"",
			"startTime":"",
			"endTime":""
		});

		// $ionicPopup.show({
		// 	 template: '<input type="text" ng-model="input.keywords" placeholder="请输入关键词">',
		// 	 title: '查询',
		// 	 scope: $scope,
		// 	 buttons: [
		// 	   { 
		// 	   		text: '取消' ,
		// 	   		onTap: function() {
		// 			 	$scope.input.keywords = '';
		// 			 }
		// 		},
		// 	   {
		// 		 text: '<b>查询</b>',
		// 		 type: 'button-calm',
		// 		 onTap: function() {
		// 		   if($scope.input.keywords == ''){
		// 			   my.alert('请输入关键词');
		// 		   }else{
				   		
		// 		   }
		// 		 }
		// 	   },
		// 	 ]
		// });
	};

	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.input = {'tel':''};
	// init
	var initParameter = {
		pageIndex: $scope.pageIndex,
		pageSize: $scope.pageSize,
		statusArray:['000005'],
		realNameStatus:null,
		token: $rootScope.token
	};

		// 按日期查询订单
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
				$scope.getOrderList(parameter);
			}
		}

		// 查询

		// $scope.toggleSearchPanel = function() {
		// 	console.log(111,$scope.searchPanel);
		// 	$scope.searchPanel = !$scope.searchPanel;
		// };
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
						$scope.getOrderList(parameter);
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
			$scope.loading = true;
			$scope.loadMore = false;
			$scope.orderList = [];
			$http({
				method:'POST',
				url:ajaxurl + 'wechatShopApp/findYlBlankOrdersByLevelCode?token=' + $rootScope.token,
				data:{keywords:$scope.input.userName,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.input.userName = '';
				$scope.readMore = false;
				$scope.loading = false;
				$scope.showList = false;
				$scope.orderList = data.data['orderList'];
				//console.log("$scope.orderList=="+$scope.orderList);
				$scope.pageSize = data.data.page['pageSize'];
				$scope.pageCount = data.data.page['pageCount'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],'',$scope.input.userName)
				};
			}).error(function(){
			
			});
		}
	}
	//切换效果
	$scope.tag = {
		current1:""
	};
	$scope.actions = {
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


})




