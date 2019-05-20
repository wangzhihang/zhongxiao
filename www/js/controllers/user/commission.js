appControllers.controller('commission', function($scope,$state,$http,$rootScope,$ionicPopup,$ionicLoading,my) {
	$scope.title = '佣金返还规则';
	$scope.data = {
        current: "1"
    };
    $scope.actions = {
        setCurrent: function (param) {
            $scope.data.current = param;
        }
    };
    $scope.resState = true;
    $scope.commission = '0.00';
    $scope.extraCommission = "0.00"
    $scope.productList = [];
    $scope.activityList = [];
    $scope.commissionList = [];
    $scope.productProductId = '';
    $scope.productName = '';
    $scope.activityProductId ='0';
    $scope.preCharge = '0';
    // $ionicLoading.show({template: '数据加载中...'});
    //查询套餐
    $http({
    	method:'GET',
    	url:ajaxurl + 'numbercontract/queryCommissionCondition?token=' + $rootScope.token,
    	timeout: 5000
    }).success(function(data){
    	// $ionicLoading.hide();
    	$scope.extraCommission = data.extraCommission;
    	$scope.productList = data["productList"];
    	$scope.preChargeList = data["preChargeList"]
	    //选择套餐
	    $scope.selectedChange = function(e){
		    	if(e != null){
		    		$scope.productProductId = e.productId;
			    	$scope.productName = e.productName;
			    	$scope.resState = false;
					//查询活动
			    	$http({
				    	method:'GET',
				    	url:ajaxurl + 'numbercontract/queryActivityByProductId?token=' + $rootScope.token,
				    	params:{"productId":$scope.productProductId}
				    }).success(function(data){
				    	//计算::获取套餐productId
				    	$scope.activityList = data["activityList"];
						//选择活动
					    $scope.selectActivity = function(e){
					    	if(e != null){
					    		$scope.activityProductId = e.productId;
					    	}else{
					    		$scope.activityProductId = 0;
					    	}
					    }
				    });
		    	}
		}
	    
	   	//选择预存金额所获取的佣金
	   	$scope.selectRecharge = function(e){
	   		if(e != null){
		   		$scope.preCharge = e.preCharge;
	   		}else{
	   			$scope.preCharge = 0;
	   		}
	   	}
	    
    }).error(function () {
           my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index');
	        }); 
        });
    
    
    //计算佣金
    $scope.countCommission = function(){
    	$ionicLoading.show({template: '佣金计算中...'});
    	if($scope.productProductId == ''){
    		$ionicLoading.hide();
    		return false;
    	}else{
    		$scope.resState = false;
	    	$http({
		    	method:'GET',
		    	url:ajaxurl + 'orderApp/queryCommission?token=' + $rootScope.token,
		    	params:{
		    		parentProductId:$scope.productProductId,
		    		productId:$scope.activityProductId,
		    		preCharge:$scope.preCharge
		    	}
		    }).success(function(data){
		    	$ionicLoading.hide();
//		    	console.log(JSON.stringify(data));
		    	$scope.commission = data.commission;
		    	//console.log($scope.commission);
		    }).error(function () {
               my.alert('数据信息获取失败！').then(function(){
	                $state.go('index');
	            }); 
       		});
    	}
    }
    
})
