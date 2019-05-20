//提现 申请表单
appControllers.controller('withdraws-cash', function($filter,$scope,$rootScope,$http,$state,$ionicLoading,my,$ionicPopup) {
	$scope.title = '提现申请';
	$scope.sum = 0;
	$scope.total = '';
	$scope.checkedTotal = 0;
	$scope.txtState = '全选';
	$scope.flowOrderList=[];
	$scope.nowTime = new Date();
	$scope.year=$scope.nowTime.getFullYear(); 
	$scope.month=$scope.nowTime.getMonth()+1; 
	$scope.day=$scope.nowTime.getDate(); 
	$scope.startTime=$scope.year+"-0"+$scope.month+"-01";
	//console.log($scope.startTime);
	$scope.endTime=$scope.today= $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.loading = true;
	//console.log($scope.endTime);
	//判断是否绑定银行卡
	
	$http({
			method:'post',
			// url:'http://192.168.31.50:8080/tms-app-war/bind/isBindAccountCard?token=' + $rootScope.token,
			url:ajaxurl+'bind/isBindAccountCard?token=' + $rootScope.token,
			data:{userId:userBo.userId}
		}).success(function(data){
			if(data==false){
				my.confirm('未绑定银行卡','','去绑定','').then(function(){
	                $state.go('daili-bond-bank-card');
	            },function(){
					$state.go("index_dl");
				}) 
			}
		})
	//获取数据
	getData();
	function getData(startTime,endTime){
		// $ionicLoading.show({template: '数据加载中...'});
		$http({
			method:'get',
			url:ajaxurl + 'accountApp/queryFinanceFlowOrderByCondition?token='  + $rootScope.token,
			params	:{startTime:startTime,endTime:endTime}
		}).success(function(data){
			//console.log("aaa"+JSON.stringify(data));
			// $ionicLoading.hide();
			$scope.loading = false;
			$scope.withdraws=data['flowOrderList'];
			for(var i in $scope.withdraws){
				if($scope.withdraws[i].category=="000008"){
					$scope.withdraws[i].typeName="话费充值";
				}else if ($scope.withdraws[i].category=="000002") {
					$scope.withdraws[i].typeName="号码开卡";			
				}
			}
			$scope.total =data['orderCount'];
			//console.log($scope.withdraws);
		}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}
	//设置开始时间
	$scope.setStartDate=function(time){
		$scope.startTime= $filter('date')(time,'yyyy-MM-dd');
		//console.log($scope.startTime);
		if($scope.startTime>$scope.today){
			alertInfo('对不起，开始日期不能大于当前日期！');
		}
	}
	//设置结束时间
	$scope.setEndDate=function(time){
		$scope.endTime= $filter('date')(time,'yyyy-MM-dd');
		if($scope.endTime<$scope.startTime){
			alertInfo('对不起，开始日期不能大于结束日期！');
		}else if($scope.endTime>$scope.today){
			alertInfo('对不起，结束日期不能大于当前日期！');
		}else{
			getData($scope.startTime,$scope.endTime);
			//console.log($scope.startTime);
			//console.log($scope.endTime);
		}
	}
	//设置时间的提示信息
	function alertInfo(info){
		var alertPopup = $ionicPopup.alert({
			    title: '系统提示',
			    template: info
			});
			alertPopup.then(function(res) {				
			});
	}
	//全选/反选
	$scope.all = function(){
		if($scope.total === getCheckedCnt()){
			$scope.txtState = '全选';
			for(var i in $scope.withdraws){
				$scope.withdraws[i].aaa = false;
			}
			$scope.checkedTotal = getCheckedCnt();
			$scope.sum = getSumAmount();
		}else{
			$scope.txtState = '取消';
			for(var i in $scope.withdraws){
				$scope.withdraws[i].aaa = true;
			}
			$scope.sum = getSumAmount();
			$scope.checkedTotal = getCheckedCnt();
		}			
	};
	
	function getCheckedCnt(){
		var checkedCnt=0;
		for(var i in $scope.withdraws){
			if($scope.withdraws[i].aaa === true){		
				checkedCnt = checkedCnt+1;
			}
		}
		return checkedCnt;
	}
	//触发某一项
	$scope.choose = function(index){
		if($scope.withdraws[index].aaa){
			$scope.withdraws[index].aaa === true;
			$scope.checkedTotal = getCheckedCnt();
			$scope.sum = getSumAmount();
		}else{
			$scope.withdraws[index].aaa === false;
			$scope.checkedTotal = getCheckedCnt();
			$scope.sum = getSumAmount();
		}
	};
	
	function getSumAmount(){
		var aindex=0;
			for(var i in $scope.withdraws){
			if($scope.withdraws[i].aaa === true){		
				aindex = parseFloat(aindex) +  parseFloat($scope.withdraws[i].withdrawedFee);
			}
		}
		return aindex;
	}

	//结算
	$scope.settlement=function(){
		$scope.flowOrderList=[];
		for(var i in $scope.withdraws){
			if($scope.withdraws[i].aaa === true){		
				$scope.flowOrderList.push($scope.withdraws[i].orderCode);
			}
		}
		//console.log($scope.sum);
		//console.log($scope.flowOrderList.length);
		
		 if($scope.flowOrderList.length){
			$http({
				method:'post',
				url:ajaxurl + 'accountApp/insertWithdrawals?token='  + $rootScope.token,	
				data:{allWithdraw:$scope.sum,flowOrderList:$scope.flowOrderList}
			}).success(function(data){
				//console.log(data);
				$scope.result=data.result;
				//console.log($scope.result);
				 alertData(data.msg);

			})
		}else{
		// 	console.log($scope.sum);
			 alertData("至少选择一项");
		 }
		
	}

	//提示信息
	function alertData(info){
		var alertPopup = $ionicPopup.alert({
			    title: '系统提示',
			    template: info
			});
			alertPopup.then(function(res) {
			    //console.log('Thank you for not eating my delicious ice cream cone');
			 
			   if($scope.result==0){
			   	 	getData();
			   }
			});
	}



});

	
//提现记录表
appControllers.controller('withdraws-cash-log', function($scope,$http,$rootScope,$ionicLoading) {
	$scope.title = '提现记录';

	//获取数据
	getData1();
	function getData1(){
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.maskLayer=false;
		$http({
			method:'get',
			url:ajaxurl + 'accountApp/applyWithdrawalsListForUser?token='  + $rootScope.token		
		}).success(function(data){
			//console.log("aaa"+JSON.stringify(data));
			// $ionicLoading.hide();
			$scope.maskLayer=true;
			$scope.withdraws=data['withdrawalsList'];
			
			//console.log($scope.withdraws);
		})
	}
});