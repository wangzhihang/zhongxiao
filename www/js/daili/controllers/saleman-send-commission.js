appControllers.controller('daili-saleman-send-commission', function($scope,$http,my,$state,$rootScope,$ionicPopup) {
	$scope.title = '派发业务员佣金';
	$scope.deptList = [];
	$scope.openIds = [];
	$scope.byChoseMoney = [];
	$scope.allMoney = 0;
	$scope.input={'wishing':''};
	//获取业务员列表
	$http({
		method:'post',
		url:ajaxurl + 'pay/toDeptList?token='+ $rootScope.token
	}).success(function(data){
		if(data.msg == '成功'){
			$scope.deptList = data.data.deptList;
		}
	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index_dl');
        }); 
    });
    //派发佣金
    $scope.sendCommision = function(){
    	for(var i in $scope.deptList){
			if($scope.deptList[i].aaa == true){
				$scope.openIds.push($scope.deptList[i].openId);
				$scope.byChoseMoney.push($scope.deptList[i].money);
				$scope.allMoney += Number($scope.deptList[i].money);
			}
		}
		if($scope.openIds.length <= 0){
			my.alert('请进行相应的选择');
			$scope.openIds = [];
	   		$scope.byChoseMoney = [];
	   		$scope.allMoney = 0;
		}else if($scope.allMoney == 0 || isNaN($scope.allMoney)){
			my.alert('请填写相应的佣金');
			$scope.openIds = [];
	   		$scope.byChoseMoney = [];
	   		$scope.allMoney = 0;
		}else{
			console.log($scope.openIds);
			console.log($scope.byChoseMoney);
			$scope.redEnvelpoe();
		}
    }
    //弹出红包层
    $scope.redEnvelpoe = function(){
    	var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="text" class="textBox" ng-model="input.wishing"  placeholder="恭喜发财，大吉大利"/>'+
									'<p class="txtCenter f-24" style="fontWeight:600;">{{allMoney | currency : "￥"}}</p>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '发红包',
			 subTitle: '未领取的红包，将于24小时之后发起退款',
			 scope: $scope,
			 buttons: [
			   { 
			   	text: '取消',
			   	onTap: function(){
			   		$scope.openIds = [];
			   		$scope.byChoseMoney = [];
			   		$scope.allMoney = 0;
			   	}
			   },
			   {
				 text: '<b>一键派发</b>',
				 type: 'button-calm1',
				 onTap: function() {
				   // console.log('红包已发送');
				   $scope.confirmSend();
				 }
			   },
			 ]
		});
    }
    //一键确认发送
    $scope.confirmSend = function(){
    	if($scope.input.wishing == ''){
    		$scope.input.wishing = '恭喜发财，大吉大利';
    	}
    	$http({
			method:'post',
			url:ajaxurl + 'pay/sendRedPacket?token='+ $rootScope.token,
			data:{
				'openIds':$scope.openIds,
				'total_fees':$scope.byChoseMoney,
				'wishing':$scope.input.wishing
			}
		}).success(function(data){
			if(data.data == true){
				my.alert('佣金发送成功!').then(function(){
	            $state.go('index_dl');
	        }); 
			}
		}).error(function () {
	         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        }); 
	    });
    }

    //获取店铺列表
    $scope.getDianpuList = function(userId){
    	localStorage.setItem('commissionSalemanUserId',userId);
    	$state.go('daili-dianpu-send-commission');
    }
});