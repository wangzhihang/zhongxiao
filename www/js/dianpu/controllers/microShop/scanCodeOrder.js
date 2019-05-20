appControllers.controller('scan-code-order', function($scope,$http,my,$rootScope,$state, $timeout,$ionicPopup) {
	$scope.title = "扫码订单";
	$scope.orderList=[];
    $scope.pageIndex=1;
    $scope.pageSize=6;
    $scope.status='000001';
	$scope.getData = function(status,orgCode,startTime,endTime){
		$scope.loading = true;
        $scope.noMore = false;
        $scope.hasmore = false;
		$http({
			method:'POST',
			url:ajaxurl + 'ltOrder/queryLtNumberOrderList?token=' + $rootScope.token,
			data:{
				status:status,
				orgCode:orgCode,
				startTime:startTime,
				endTime:endTime,
				pageIndex:$scope.pageIndex,
				pageSize:$scope.pageSize
			}
		}).success(function(data){
			$scope.loading = false;
			// console.log("data  "+JSON.stringify(data));
			if(data.orderList.length < data.page.pageSize){
            	$scope.noMore = true;
        	}else{
                $timeout(function () {
                    $scope.hasmore = true;
                }, 1 * 1000);
            }
     	 	$scope.orderList = $scope.orderList.concat(data['orderList']);
		}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index');
	        }); 
        });
	}

	$scope.getData($scope.status);

	//上拉加载 
    $scope.loadMore = function (){
       $scope.pageIndex++;
        $scope.getData($scope.status);
    };


    //导航切换
	$scope.tag = {
		current: "2"
	};
	$scope.actions= {
		setCurrent: function (param) {
			$scope.tag.current = param;
			$scope.pageIndex=1;
    		$scope.pageSize=6;
			if($scope.tag.current==1){
				$scope.orderList=[];				
				$scope.getData($scope.status);
			}else if($scope.tag.current==2){
				$scope.orderList=[];
				$scope.status="000001";
				$scope.getData($scope.status);				
				
			}else if($scope.tag.current==3){
				$scope.orderList=[];
				$scope.status="000003";
				$scope.getData($scope.status);				
			}else if($scope.tag.current==4){
				$scope.orderList=[];
				$scope.status="000004";
				$scope.getData($scope.status);
			}
			
		}
	};
	// 进入详情
	$scope.goDetail =  function(e){
		localStorage.setItem('orderItem',JSON.stringify($scope.orderList[e]));
		$state.go("scan-code-order-detail");
	}
	$scope.getOperId = function(){
		$http({
			method:'get',
			url:ajaxurl + 'cbssInfoApp/getDefaultCbssInfoByShopId?token=' + $rootScope.token
		}).success(function(data){
			// console.log(JSON.stringify(data))
			$scope.operId=data.cbssInfo.userName;
			 $scope.giveUp($scope.id,$scope.orderCode,$scope.orderType,$scope.productId,$scope.productName,$scope.remark);
		});
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
				remark:remark,
				operId:$scope.operId
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
					$scope.orderList=[];
					$scope.pageIndex=1;
    				$scope.pageSize=6;
					$scope.getData('000001');
		        }); 
			}).error(function () {
	            my.alert('取消订单失败！请稍后尝试。').then(function(){
		            $state.go('scan-code-order');
		        }); 
	        });
		});		
		
	}
	// 取消订单
	$scope.cancelOrder = function(e){
		$scope.alertGiveUp(e);
	}	
	// 办理
	$scope.manage = function(e){
		localStorage.setItem('orderItem',JSON.stringify($scope.orderList[e]));
		$state.go("scan-code-manage");
	}
	
	//放弃弹出理由
    $scope.alertGiveUp=function(e){
    	$scope.id=$scope.orderList[e].id;
    	console.log("id "+$scope.id)
		$scope.orderCode=$scope.orderList[e].orderCode;
		$scope.productId=$scope.orderList[e].productId;
		$scope.orderType=$scope.orderList[e].orderType;
		$scope.productName=$scope.orderList[e].productName;
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
                     e.preventDefault();
                   } else {
                        $scope.remark=$scope.input.txt;
                        $scope.getOperId();
                       
                   }
                 }
               },
             ]
        });
      }
})