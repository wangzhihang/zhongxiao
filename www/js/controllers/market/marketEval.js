appControllers.controller('market-eval', function($scope,$stateParams,$http,$rootScope,my,$state) {
	$scope.title = '评价晒单';
	$scope.orderCode=$stateParams.orderCode;
	$scope.serviceScore='';
	$scope.logisScore='';
	$scope.evalStars=true;
	$scope.evalStarsOk=false;

	$scope.goodsStatus='';
	// console.log("???"+$scope.orderCode);
	
	


	//订单详情
	$scope.getInfoData=function(orderCode){
		$http({
	            method:'GET',
	            url:ajaxurl + 'ehOrder/findOneEhOrder?token=' + $rootScope.token,
	            params:{ 
	            	orderCode:orderCode
	            }
	            }).success(function(data){

	            		console.log("订单详情data ===="+ JSON.stringify(data));
	         			$scope.ordInfo=data;
	         			$scope.orderItemList=data.orderItemList;
	         			// $scope.status=$scope.ordInfo.status; 
						console.log("订单详情data "+ JSON.stringify($scope.orderItemList))
	         			// console.log("getordinfoData "+ JSON.stringify($scope.ordInfo))
	         	}).error(function(){
						my.alert("遇到问题，请重试12121212");
				});
	}
	$scope.getInfoData($scope.orderCode);

	



    //商家评价  
	$scope.evalBussniss=[{id:1,status:false},{id:2,status:false},{id:3,status:false},{id:4,status:false},{id:5,status:false}];
	$scope.starEval=function(e){
	console.log($scope.evalBussniss[e].id)
		for(var i in $scope.evalBussniss){ 
			if(i<=e){
				$scope.evalBussniss[i].status=true;
			}else{
				$scope.evalBussniss[i].status=false;
			}
		}
		$scope.serviceScore=$scope.evalBussniss[e].id;
	}	
		
	
    //物流评价
	$scope.evalLogiistics=[{id:1,status:false},{id:2,status:false},{id:3,status:false},{id:4,status:false},{id:5,status:false}];
	$scope.starLogics=function(e){
		console.log($scope.evalLogiistics[e].id)
		for(var k in  $scope.evalLogiistics){
			if(k<=e){
				$scope.evalLogiistics[k].status=true;
			}else{
				$scope.evalLogiistics[k].status=false;
			}
		}
		$scope.logisScore=$scope.evalLogiistics[e].id;
	}
	
	
	//订单评价接口:发表评价/返回值是布尔值/
	$scope.evalOrder=function(serviceScore,logisScore,orderCode){
		$http({
	            method:'post',
	            url:ajaxurl + 'ehOrder/addOrderAssess?token=' + $rootScope.token,
	            data:{ 
	            	serviceScore:$scope.serviceScore,
	            	logisScore:$scope.logisScore,
	            	orderCode:$scope.orderCode
	            }
	            }).success(function(data){
	         	//console.log("评价晒单data"+ JSON.stringify(data))
	         			my.alert("该笔订单评价完成")
	         			$scope.evalStars=false;
	         			$scope.evalStarsOk=true;
	         	}).error(function(){
						my.alert("遇到问题，请重试");
				});
		}
	
	
	//单项商品评价
	$scope.goodsEval=function(e){
		$scope.productCode=$scope.orderItemList[e].productCode;
		$scope.goodsStatus=$scope.orderItemList[e].status;
		$scope.goodsId=$scope.orderItemList[e].id;
		$state.go("market-evalgoods",{'productCode':$scope.productCode,'orderCode':$scope.orderCode,'goodsStatus':$scope.goodsStatus,'goodsId':$scope.goodsId});
	}
	// $scope.goodsEval=function(id,userName,score,content,img,status){
	// 		$http({
	//             method:'post',
	//             url:ajaxurl + 'ehOrder/addOrderAssess?token=' + $rootScope.token,
	//             data:{ 
	//             		id:id,
	//             		userName:userName,
	//             		score:score,
	//             		content:content,
	//             		img:img,
	//             		status:status
	// 			   }
	//             }).success(function(data){
	//          			console.log("单项商品评价data "+ JSON.stringify(data))
	// 			   }).error(function(){
	// 					my.alert("遇到问题，请重试12121212");
	// 			});
	// }




});