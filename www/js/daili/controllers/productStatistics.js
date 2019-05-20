appControllers.controller('daili-product-statistics', function($scope) {
	$scope.title = '产品统计';
	//打开日期筛选
	$scope.openSelect = function(){
		$scope.showSuperiorSelect = true;
	}
	//关闭筛选层
	$scope.closeSuperiorSelect = function(){
		$scope.showSuperiorSelect = false;
	}
	//获取统计图表信息
    $scope.chartFun=function(xDate){
    	var chart = Highcharts.chart('container', {
			chart: {
					type: 'area',
					spacingBottom: 30
			},
			title: {
					text:'财务统计',
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
					name: '小张',
					data: [0, 1, 4, 4, 5, 2, 3, 7]
			}, {
				name: '小潘',
				data: [1, 0, 3, null, 3, 1, 2, 1]
			}]
		});
    }
    $scope.chartFun([8.1,8.2,8.3,8.4,8.5]);
	
});