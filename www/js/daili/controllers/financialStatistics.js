appControllers.controller('daili-financial-statistics', function($scope,$http,$state) {
	$scope.title = '财务统计';
	if(signInInfo.userInfo.headImgUrl){
		$scope.headImgUrl = signInInfo.userInfo.headImgUrl;
	}else{
		$scope.headImgUrl = 'img/logo1_03.png';
	}
	$scope.amount = signInInfo.account.amount;
	$scope.totleAmount='总金额';
	$scope.salemanList = [
	{'deptName':'8月1日-8月31日'},
	{'deptName':'7月1日-7月31日'},
	{'deptName':'6月1日-6月31日'},
	];
	if($scope.testTag=="000002"){
		$scope.agencyValue='申请走账';
		$scope.showWithdrawRed=true;
		$scope.withdrawCash=function(){
			my.alert('具体申请流程，了解详细信息，请咨询029-86262222.');
		}
	}else{
		$scope.agencyValue='提现';
		if($scope.testTag=="000001" && userBo.isVirtual=="000002"){
			$scope.showWithdrawRed=true;
			$scope.withdrawCash=function(){
				my.alert('当前账户资金为虚拟资金，不允许提现').then(function(){
	                $state.go('index_dl');
	            }); 
			}	
		}else{
			$scope.showWithdrawRed=false;
			$scope.withdrawCash=function(){
				$state.go('withdraws-cash');
			}
		}
	}
	$scope.transactionLog=function(){
		if(($scope.testTag=="000001" && userBo.isVirtual=="000002")||$scope.testTag=="000002"){
			return;
		}else{
			$state.go('transaction-log');
		}
	}
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