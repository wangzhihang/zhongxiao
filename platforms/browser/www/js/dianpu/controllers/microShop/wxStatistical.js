appControllers.controller('dianpu-wx-statistical', function($scope,$rootScope,$http,$filter) {
	$scope.title = "微店统计";
	$scope.userId = userBo.userId;
	//console.log("userId==="+$scope.userId);
	$scope.currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.orderCnt = 0;
	$scope.hideLoadingPage = true;
	$scope.xAxis=[];
	//获取店铺详情信息
	$http({
		method:'GET',
		url:ajaxurl + '/wechatShopApp/queryWechatOrderStatistics?token=' + $rootScope.token,
		params:{
			userId:$scope.userId,
			date:$scope.currentDate
		}
	}).success(function(data){
		//console.log(JSON.stringify(data));
		$scope.hideLoadingPage = false;
		for(var i in data.orderList.xAxis){
			$scope.xAxis.push($filter('date')(data.orderList.xAxis[i],'MM-dd'));

		}
		// console.log("x:"+data.recentOrderCnt.xAxis);
		// console.log("y:"+data.recentOrderCnt.yNumberNum);
		// //获取统计图表信息
		$scope.chart = new Highcharts.Chart('container', {
			chart: {
				backgroundColor: 'rgba(0,0,0,0)'
			},
			title: {
				text:data.orderList.title,
				align: "left",
				style:{
					color:'white',
				}
			},
			subtitle: {
				text: '近七日数量统计：',
				align: "left",
				style:{
					color:'white',
				}
			},
			xAxis: {
				lineColor: "white",
				tickColor:'white',
				categories:$scope.xAxis
			},
			yAxis: {
				title: {
					text:'数量'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: 'white'
				}]
			},
			credits: {
				enabled: false
			},
			legend: {
				layout: 'horizontal',
				align:'center',
				verticalAlign:'bottom',
				width:'100vw',
				borderWidth:0
			},
			series: [{
				data: data.orderList.yPageviewCount,
				name:'访问次数',
				color:'red'
			},{
				data:data.orderList.yCampOrderNum,
				name:'预占订单数量',
				color:'#90ED7D'
			},{
				data:data.orderList.ySuccessOrderNum,
				name:'成功订单数量',
				color:'#F7A35C'
			}]
		});
	});
	
});