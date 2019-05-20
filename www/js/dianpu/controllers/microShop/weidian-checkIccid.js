appControllers.controller('dianpu-weidian-checkIccid', function($scope,$rootScope,$http) {
	$scope.title = "ICCID校验";
	// $scope.shopUserName = localStorage.getItem('userName',$scope.userName);

	$scope.shopId = localStorage.getItem('userId',$scope.userId);

	$scope.iccidNum ='';




	console.log("???"+$scope.shopId);
	console.log("---"+$scope.iccidNum);




	$scope.checkIccid = function(){
		console.log("---"+$scope.iccidNum);
		$http({
			  "method" : 'get'
			, "url" : 'http://z.haoma.cn/yinliu/ylCardQuery/isBelongToShop'
			// , "url" : 'http://192.168.31.50:8080/tms-yinliu-war/ylCardQuery/isBelongToShop'
			, "params" : {
				
				shopId:$scope.shopId,
				iccid:$scope.iccidNum

			}
		}).success(function(data){
			console.log(data);
		 			console.log(data.data.result);
		 			if(data.data.result == true){
		 				layer.open({
				 			content: '此卡归本店所有'
				 			,skin: 'msg'
				 			,time: 2
				 		}); 
		 			}else{
			 			 layer.open({
			 			    content: '此卡不归本店所有'
			 			    ,skin: 'msg'
			 			    ,time: 2
			 			}); 
			 			}
		}).error(function(){
			
		});

};
	





})