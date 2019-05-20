appControllers.controller('market-evalok', function($scope,$http,$rootScope,$state,my) {
	$scope.title = '评价成功';
	
	$scope.getData=function(){
		 $http({
	            method:'get',
	            url:ajaxurl + 'ehOrder/findNoAssessItem?token=' + $rootScope.token,
	            params:{  }
	            }).success(function(data){
	         			console.log("未评价商品信息data"+ JSON.stringify(data))
	         			$scope.noEval=data;
	         		
	         	}).error(function(){
						my.alert("遇到问题，请重试12121212");
				});



	}

	$scope.getData();


	$scope.evalBtn=function(e){
			$state.go()
	
	}


});