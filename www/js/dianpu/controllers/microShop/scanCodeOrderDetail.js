appControllers.controller('scan-code-order-detail', function($scope,$http,$stateParams,$state,$ionicPopup,$rootScope,my) {
	$scope.title = "订单详情";
	$scope.orderItem=JSON.parse(localStorage.getItem('orderItem'));
	
	switch($scope.orderItem.orderType){
        case "1":
            console.log(111)
            $scope.orderTypeVal='号码订单';
            break;
        case "2":
            $scope.orderTypeVal='融合订单';
            break;
        case "3":
            $scope.orderTypeVal='单宽订单';
            break;
    }
    switch($scope.orderItem.type){
        case '000002':
            $scope.typeVal='自提';
            break;
        case '000001':
            $scope.typeVal='上门';
            break;
    }
    $scope.lookOrder = function(orderType){
    	order["orderCode"]=$scope.orderItem.wxOrderNo;
    	if(orderType=="1"){
    		$state.go("numberOrderDetail");
    	}else{
    		$state.go("kdOrderDetail",{number:null,orderCode:$scope.orderItem.wxOrderNo});
    	}
    }

    // 取消订单接口
	$scope.giveUp = function(id,orderCode,orderType,productId,productName,remark){
		$http({
			method:'get',
			url:ajaxurl + 'ltOrder/cancelOrder?token=' + $rootScope.token,
			params:{
				id:id,
				orderCode:orderCode,
				orderType:orderType,
				productId:productId,
				productName:productName,
				remark:remark
			}
		}).success(function(data){			
			// console.log("data  "+JSON.stringify(data));	
		  	console.log("data  "+JSON.stringify(data))
		  	// $scope.orderBody=data.split("/").join("");
		  	$http({
				method:'POST',
				url:'http://123.139.156.77:18081/orderReceive/order/haomaHomeProductNotice',
				headers:{'Content-Type':'Content-Type:text/plain'},
				data:data
			}).success(function(data){
				my.alert('取消订单成功!').then(function(){
		            $state.go('scan-code-order');
		         })
			}).error(function () {
	            my.alert('取消订单失败！请稍后尝试。').then(function(){
		            $state.go('scan-code-order');
		        }); 
	        });
		});		
		
	}

	//放弃弹出理由
    $scope.alertGiveUp=function(){
    	$scope.id=$scope.orderItem.id;
    	console.log("id "+$scope.id)
		$scope.orderCode=$scope.orderItem.orderCode;
		$scope.orderType=$scope.orderItem.orderType;
		$scope.productId=$scope.orderItem.productId;
		$scope.productName=$scope.orderItem.productName;
         $scope.input = {}
         var myPopup = $ionicPopup.show({
             template: '<input type="text" ng-model="input.txt" maxlength="120" style="border:1px solid #ccc">',
             title: '系统提示',
             subTitle: '输入放弃原因',
             scope: $scope,
             buttons: [
               { text: '取消' },
               {
                 text: '<b>确定</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                   if (!$scope.input.txt) {
                     //不允许用户关闭，除非他键入wifi密码
                     e.preventDefault();
                   } else {
                        $scope.remark=$scope.input.txt;
                        $scope.giveUp($scope.id,$scope.orderCode,$scope.orderType,$scope.productId,$scope.productName,$scope.remark);
                        
                   }
                 }
               },
             ]
        });
     }

	// 取消订单
	$scope.cancelOrder = function(){
		$scope.alertGiveUp();
	}	
	// 办理
	$scope.manage = function(){
        $state.go("scan-code-manage");
	}
	
	
})