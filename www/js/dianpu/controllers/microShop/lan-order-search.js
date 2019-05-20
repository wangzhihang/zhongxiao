appControllers.controller('dianpu-microshop-lan-order-search', function($scope,$state,$http,$ionicPopup,$rootScope,my){

    $scope.title = "查询宽带";
	$scope.loading = false;
	$scope.showLanOrder=false;
	$scope.data = {"verifyCode":"","contactNumber":''};
	var orderStatus = {
		 "000000":{"color":"txtOrange","text":"全部订单","btn":0}
		,"000001":{"color":"dealColor","text":"待处理","btn":0}
		,"000002":{"color":"verifyColor","text":"地址预判成功,等待实名","btn":0}
		,"000003":{"color":"successColor","text":"实名成功,等待开卡","btn":1}
		,"000004":{"color":"approveSucColor","text":"开卡成功,等待快递","btn":1}
		,"000005":{"color":"longNumColor","text":"快递中","btn":1}
		,"000100":{"color":"approveSucColor","text":"订单完成,未收费","btn":2}
		,"000101":{"color":"submitColor","text":"订单完成,已收费","btn":10}
		,"000200":{"color":"approveFailColor","text":"订单失败","btn":10}
		,"000201":{"color":"cancelColor","text":"用户取消","btn":10}
	}

	$scope.order=function(){
		if($scope.data.verifyCode.length!=6){
			my.alert('请输入正确的短信编码');
			return;
		}else if($scope.data.contactNumber.length!=11){
			my.alert('请输入正确的联系电话');
			return;
		}else{
			$scope.resState = false;
			$scope.loading = true;
			$http({
	            method:'GET',
	            url:ajaxurl + 'lanPreorderApp/queryPreorderDetailByVerifyCode',
	            params:{
					 token:$rootScope.token
	            	,verifyCode:$scope.data.verifyCode
	            	,contactNumber:$scope.data.contactNumber
	            }
		    }).success(function(data){
				$scope.loading = false;
				$scope.dataInfo = data;
		        $scope.preorderInfo= data && data.preorderInfo ? data.preorderInfo : null;
		        if($scope.preorderInfo){
		        	$scope.showLanOrder=true;
		        }else{
		        	my.alert('该订单不存在');
				}
		        $scope.OrderState=orderStatus[$scope.preorderInfo.status].text;	
				$scope.OrderColor=orderStatus[$scope.preorderInfo.status].color;
		    }).error(function () {
		    	my.alert('数据信息获取失败！请稍后尝试。'); 
		    });
		}
	}

	$scope.lanOrderPay=function(){
		var amount = $scope.dataInfo && $scope.dataInfo.combineInfo ? $scope.dataInfo.combineInfo.amount : null;
		console.log(amount)
		console.log($scope.preorderInfo.status)
		console.log(amount && $scope.preorderInfo.status == "000100")
		
		if(amount && $scope.preorderInfo.status == "000100"){
			$state.go('dianpu-microshop-lan-order-Code',{orderCode:$scope.preorderInfo.orderCode,payNumber:amount});
		}else{
			my.alert('此订单无法收费。'); 
		}
	}
})