appControllers.controller('visit-gohome-order-detial', function($scope, $rootScope, $http, $state,my,$ionicPopup) {
	$scope.title = '订单分配平台';
	$scope.reveiveOrderDetail  = JSON.parse(localStorage.getItem('reveiveOrderDetail'));
	//转单
	$scope.transferOrder = function(){
		$state.go('visit-transfer-order');
	}
	//退单
	$scope.realseOrder = function(){
		var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确定退单？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					$http({
				        method: 'post',
				        url: ajaxurl + "wangka/releaseOne?token=" + $rootScope.token,
				        data: {
				        	'id':$scope.reveiveOrderDetail.id
				        }
				    }).success(function(data) {
				       if(data == true){
				       		my.alert('您已退单成功！');
				       }else{
				       		my.alert('退单失败！请稍后重试。');
				       }
				    }).error(function() {
				        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
				            // $state.go('index');
				        });
				    });
				}
			},
		   ]
		});
	}
	//办理
	$scope.finishOrder = function(){
		$http({
	        method: 'post',
	        url: ajaxurl + "wangka/finishOne?token=" + $rootScope.token,
	        data: {
	        	'id':$scope.reveiveOrderDetail.id
	        }
	    }).success(function(data) {
	       if(data == true){
	       		my.alert('您已办理成功！');
	       }
	    }).error(function() {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function() {
	            // $state.go('index');
	        });
	    });
	}
	
 
})
