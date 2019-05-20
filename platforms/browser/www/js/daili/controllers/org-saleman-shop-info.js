appControllers.controller('daili-org-saleman-shop-info', function($scope,$ionicPopup,$state,$http,$filter,$rootScope,my) {
	$scope.title = '店铺';
	$scope.pageSize = 5;
	$scope.pageIndex = 1;
	$scope.isShowAddSale=true;
	$scope.tag={'current':null};
	$scope.saleOrderList =  null;
	$scope.isShowShopInfo=false;
	$scope.userId = null;
	if(JSON.parse(localStorage.getItem('shopInfoData'))){
		$scope.shopInfoData = JSON.parse(localStorage.getItem('shopInfoData'));
		$scope.orgOrder = $scope.shopInfoData.levelCode;
		$scope.deptCode = $scope.shopInfoData.deptCode;
		$scope.deptType = $scope.shopInfoData.deptType;
		$scope.saleOrderList =  $scope.shopInfoData.saleOrderList;
		if($scope.shopInfoData.typeTag == '1'){
			$scope.title = $scope.shopInfoData.deptName;
			$scope.id = $scope.shopInfoData.userId;
			$scope.isShowAddSale = false;
		}else{
			$scope.id = localStorage.getItem('shopUserId');
		}
	}
	if($scope.deptType=='000004'){
		$scope.isShowAddSale=false;
	}
	$scope.orderList=[];
	$scope.lanOrderList=[];
	$scope.noMoreTxt='没有更多';
	// console.log('data=='+new Date().getTime());
	var ENDTIME = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
	var STARTTIME = $filter('date')(new Date().getTime()-7 * 24 * 3600 * 1000,'yyyy-MM-dd HH:mm:ss');

	//获取店铺信息
	$scope.queryShopInfo=function(){
		$http({
			method:'GET',
			url:ajaxurl + 'appDept/queryShopInfo?token=' + $rootScope.token,
			params:{
				levelCode:$scope.orgOrder,
				deptCode:$scope.deptCode
			},
			timeout: 30000
		}).success(function(data){
			$scope.loading = false;
			$scope.cardsNum = data.cardsNum;
			$scope.userId = data.shop.ownerId;
			$scope.dealNumberOrder=data.dealNumberOrder;
			$scope.dealLanOrder=data.dealLanOrder;
			$scope.totalLoginNumber=data.totalLoginNumber;
			$scope.totalOrderCnt=data.totalOrderCnt;
			$scope.dealRate=data.dealRate;
			$scope.user=data.user;
			$scope.loginNumber=data.loginNumber;
			$scope.xDate=data.xDate;
			$scope.totalOrderNumber = data.totalOrderNumber.reverse();
			$scope.xdata=[];
			for(var i in $scope.xDate){
				$scope.xdata=$scope.xdata.concat($scope.xDate[i].substring(5));
			}
			// console.log('$scope.xdata=='+$scope.xdata);
			$scope.xdata=$scope.xdata.reverse();
			$scope.chartFun($scope.xdata,$scope.totalOrderNumber);
		}).error(function () {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        }); 
	    });
	}
	if($scope.saleOrderList != 1){
		$scope.queryShopInfo();
		$scope.isShowShopInfo=true;
	}

	//重置密码
	$scope.resertPwd = function(){
		var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确认重置该用户密码？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					console.log("确定重置"+localStorage.getItem('shopUserId'));
					$http({
						method:'get',
						url:ajaxurl+'userApp/setDefaultPwd?token=' + $rootScope.token,
						params:{userId:$scope.id}
					}).success(function(data){
						   var alertPopup = $ionicPopup.alert({
					       title: '提示信息',
					       template: '新密码已重置为123456,请联系用户自行修改。'
					     });
					})
				}
			},
		   ]
		});
	}


	//获取统计图表信息
    $scope.chartFun=function(xDate,totalOrderNumber){
    	var chart = Highcharts.chart('container1', {
			chart: {
					type: 'area',
					spacingBottom: 30
			},
			title: {
					text:'订单数量',
					align: "left",
					style:{
							color:'#66666',
							fontSize:'14px'
					}
			},
			subtitle: {
					text: '',
					floating: true,
					align: 'right',
					verticalAlign: 'bottom',
					y: 15
			},
			legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x: 150,
					y: 100,
					floating: true,
					borderWidth: 1,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			xAxis: {
					categories: xDate
			},
			yAxis: {
					title: {
							text: ''
					},
					labels: {
							formatter: function () {
									return this.value;
							}
					}
			},
			tooltip: {
					formatter: function () {
							return '<b>' + this.series.name + '</b><br/>' +
									this.x + ': ' + this.y;
					}
			},
			plotOptions: {
					area: {
							fillOpacity: 0.5
					}
			},
			credits: {
					enabled: false
			},
			series: [{
					name: $scope.deptName,
					data: totalOrderNumber
			}]
		});
  //   	$scope.chart = new Highcharts.Chart('container', {
		// 	chart: {
		// 		backgroundColor: 'rgba(0,0,0,0)'
		// 	},
		// 	title: {
		// 		text:'订单数量',
		// 		align: "left",
		// 		style:{
		// 			color:'#66666',
		// 			fontSize:'14px'
		// 		}
		// 	},
		// 	subtitle: {
		// 		text: null,
		// 		align: "left",
		// 		style:{
		// 			color:'#666666',
		// 		}
		// 	},
		// 	xAxis: {
		// 		lineColor: "#1E82D2",
		// 		tickColor:'#1E82D2',
		// 		categories:xDate,
		// 		labels: {
		// 			style: {
		// 				color: '#1E82D2',
		// 			}
		// 		},
		// 	},
		// 	yAxis: {
		// 		gridLineWidth:1,
		// 		gridLineColor:'#1E82D2',
		// 		title: {
		// 			text:null
		// 		},
		// 		plotLines: [{
		// 			value: 0,
		// 			width: 1,
		// 			color: '#1E82D2'
		// 		}],
		// 		labels: {
		// 			style: {
		// 				color: '#1E82D2',
		// 			}
		// 		},
		// 	},
		// 	credits: {
		// 		enabled: false
		// 	},
		// 	legend: {
		// 		enabled: false
		// 	},
		// 	series: [{
		// 		data: totalOrderNumber,
		// 		name:'数量',
		// 		color:'#1E82D2'
		// 	}]
		// });
    }

	//号码订单
	$scope.getNumData=function(statusArray){
		// $scope.orderList=[];
		$scope.showNumOrder=true;
		$scope.showLanOrder=false;
		$scope.loading = true;
		$scope.noMore = false;
		 $scope.hasmore = false;
		 // console.log('?4444=='+$scope.pageIndex);
		$http({
			method:'GET',
			url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
			// url:'http://z.haoma.cn/tms-app-war/numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
			params:{
				levelCode:$scope.orgOrder,
				statusArray:statusArray,
				pageSize:$scope.pageSize,
				pageIndex:$scope.pageIndex,
				startTime:STARTTIME,
				endTime:ENDTIME
			},
			timeout: 30000
		}).success(function(data){
			$scope.loading = false;
			$scope.orderList=$scope.orderList.concat(data.orderList);
			//如果小于pageSize禁止上拉加载
			if(data.orderList.length < data.page.pageSize){
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
			if($scope.orderList.length==0){
				$scope.noMoreTxt='本周没有号码订单';
			}

			for(var i in $scope.orderList){
				if($scope.orderList[i].isCbss=="000002"){
					$scope.orderList[i].isCbss ="BSS";
				}else if($scope.orderList[i].isCbss=="000001"){
					$scope.orderList[i].isCbss ="CBSS";
				}
			}
		}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}


	//宽带订单
	$scope.getLanData=function(statusArray){
		$scope.showNumOrder=false;
		$scope.showLanOrder=true;
		$scope.loading = true;
		$scope.noMore = false;
		 $scope.hasmore = false;
		$http({
		method:'GET',
		url:ajaxurl + 'orderLanApp/queryLanOrderAppList?token=' + $rootScope.token,
		// url:'http://z.haoma.cn/tms-app-war/orderLanApp/queryLanOrderAppList?token=' + $rootScope.token,
		params:{
			levelCode:$scope.orgOrder,
			statusArray:statusArray,
			pageSize:$scope.pageSize,
			pageIndex:$scope.pageIndex,
			startTime:STARTTIME,
			endTime:ENDTIME
		},
		timeout: 30000
	}).success(function(data){
		$scope.loading = false;
		// console.log('data.list=='+JSON.stringify(data.list));
		$scope.lanOrderList=$scope.lanOrderList.concat(data.list);
		// console.log('$scope.lanOrderList=='+JSON.stringify($scope.lanOrderList));
		//如果小于pageSize禁止上拉加载
		if(data.list.length < data.page.pageSize){
			$scope.noMore = true;
		}else{
			$scope.hasmore = true;
		}
		if($scope.lanOrderList.length==0){
			$scope.noMoreTxt='本周没有宽带订单';
		}
		if($scope.orderList.length==0&&$scope.lanOrderList.length==0){
			$scope.noMoreTxt='本周没有订单';
		}
	}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}

	$scope.getNumData([]);
	$scope.getLanData([]);

	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	$scope.getNumData([]);
    	$scope.getLanData([]);
    };

    //查看号码订单
	$scope.getTotalNumData=function(){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.orgOrder,
			'getFun':'getNumData'
		}));
		$state.go('org-number-order-list');
	}
	//查看宽带订单
	$scope.getTotalLanData=function(){
		localStorage.setItem('orgOrder',JSON.stringify({
			'levelCode':$scope.orgOrder,
			'getFun':'getLanData'
		}));
		$state.go('org-number-order-list');
	}

	//号码订单详情页面
	$scope.orgShopOrderInfo=function(index){
		localStorage.setItem('orderCode',$scope.orderList[index].orderCode);
		$scope.source=$scope.orderList[index].source;
		$scope.number=$scope.orderList[index].number;
		localStorage.setItem('source',$scope.source);
		//$state.go('kk-order-detail');
		if($scope.source=="000020"){
			//console.log($scope.source);
			//$state.go("kdOrderDetail",{number:order["number"]});
			$state.go('kd-order-detail',{number:$scope.number});
		}else{
			$state.go('kk-order-detail');
		}
	}
	//宽带订单详情页
	$scope.orgShopLanOrderInfo=function(index){
		localStorage.setItem('orderCode',$scope.lanOrderList[index].orderCode);
		$state.go('kd-order-detail');
	}
	//查看店铺所持卡片
	if(userBo.userType == '000003'){
		$scope.showDianpuCard = true;
	}else{
		$scope.showDianpuCard = false;
	}
	$scope.viewDianpuCard = function(){
		$state.go('user-dianpu-card',{userId:$scope.userId});
	}
	
});