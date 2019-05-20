appControllers.controller('daili-dianpu-send-commission', function($scope,$http,my,$state,$rootScope,$ionicPopup) {
	$scope.title = '派发店铺佣金';
	$scope.dianpuList = [];
	$scope.openIds = [];
	$scope.byChoseMoney = [];
	$scope.allMoney = 0;
	$scope.input={'wishing':''};
	//获取子店铺列表
	$http({
		method:'post',
		url:ajaxurl + 'pay/toShopList?token='+ $rootScope.token,
		data:{
			'userId':localStorage.getItem('commissionSalemanUserId')
		}
	}).success(function(data){
		if(data.msg == '成功'){
			$scope.dianpuList = data.data.shopList;
		}
	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index_dl');
        }); 
    });
    //确认派发佣金
    $scope.sendCommision = function(){
    	for(var i in $scope.dianpuList){
			if($scope.dianpuList[i].aaa == true){
				$scope.openIds.push($scope.dianpuList[i].openId);
				$scope.byChoseMoney.push($scope.dianpuList[i].money);
				$scope.allMoney += Number($scope.dianpuList[i].money);
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

});