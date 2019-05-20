appControllers.controller('market-bag', function($scope,$http,$rootScope,$state,my) {
	$scope.title = '购物袋';
	$scope.loading=true;
	
	$scope.bagsAllDel=false;
	$scope.edit="编辑";
	$scope.nums="";
	$scope.price='';
	$scope.cartIdArray=[];
	$scope.totalPrice=0.00;
	$scope.allChose=true;
	
	$scope.getData = function(){
		$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehCart/queryCart?token='+$rootScope.token
			, "params": {
			}
		}).success(function(data){
			$scope.loading=false;
//			console.log("data  "+ JSON.stringify(data))
			$scope.cartList=data.cartList;
			for(var i in $scope.cartList){
				$scope.cartList[i].ww=true;
			}
			//console.log("data  "+ JSON.stringify($scope.cartList))
		}).error(function(){
		});
	};
		$scope.getData();
		
	
	$scope.upDataCard =function (cartId,nums){
		$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehCart/updateCart?token='+$rootScope.token
			, "params": {
				cartId:cartId,
				nums:nums
			}
		}).success(function(data){
			console.log("data  "+ JSON.stringify(data))
			
		}).error(function(){
		});
	}
	//总价计算
	$scope.allPirce=function (){
		$scope.totalPrice=0.00;
		for(var i in $scope.cartList){
			if($scope.cartList[i].ww==false){
				$scope.totalPrice+=($scope.cartList[i].price*$scope.cartList[i].nums);
				
			}
		}
	}

	$scope.allCheckedBags=function(){
		$scope.bagsAllDel=!$scope.bagsAllDel;
		if($scope.edit=='编辑'){
			
			$scope.edit="完成";
		}else{
			$scope.edit="编辑";
		}
	}

	
	$scope.subClick=function(e){
		if($scope.cartList[e].nums>1){
			$scope.nums=--$scope.cartList[e].nums;
			$scope.cartId=$scope.cartList[e].id;
			$scope.upDataCard($scope.cartId,$scope.nums);
			$scope.allPirce();
		}
		
		
	}
	
	$scope.addClick=function(e){
		$scope.nums=++$scope.cartList[e].nums;
		$scope.cartId=$scope.cartList[e].id;
		$scope.upDataCard($scope.cartId,$scope.nums);
		$scope.allPirce();
	}
	
	
             
// 全选         
    $scope.CheckAll=function(){
    	$scope.allChose=!$scope.allChose;
        for(var i in $scope.cartList){
			if($scope.allChose){
				$scope.cartList[i].ww=true;
			}else{
				$scope.cartList[i].ww=false;
			}
        	
        };
        $scope.allPirce();
    };
             
	//单选
	$scope.oneChecked=function(e){
		$scope.cartList[e].ww=!$scope.cartList[e].ww;
		for(var i in $scope.cartList){
			if($scope.cartList[e].ww){
				$scope.allChose=true;
			}
        	
        };
        $scope.allPirce();
	}

//	删除
	$scope.carsGoodsDel=function(delItems){
		if($scope.allChose==false){
			$scope.delCard();
		}else{
			$scope.delMore($scope.cartIdArray);
		
		}
		
	}

//	清空删
	$scope.delCard=function(){
		$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehCart/emptyCart?token='+$rootScope.token
			, "params": {
				
			}
		}).success(function(data){
//		console.log("data"+ JSON.stringify(data))
			if(!$scope.allChose){
				$scope.cartList=data.cartList;
				$scope.edit="编辑";
				$scope.allChose=!$scope.allChose;
				my.alert("您的购物车还没有商品");
			}
		}).error(function(){
			my.alert("遇到问题，请重新尝试111");
		});

	}
	$scope.getData();
		
//批量删
	$scope.delMore=function(cartIdArray){
		for(var i in  $scope.cartList){
			if(!$scope.cartList[i].ww){
				$scope.cartIdArray.push($scope.cartList[i].id);
			}
		}
		console.log($scope.cartIdArray);
		
		
		if($scope.cartIdArray==''){
			my.alert("至少选一项");
			$scope.allChose=true;
		}else{
			
			$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehCart/batchDeletes?token='+$rootScope.token
			, "params": {
				cartIdArray:$scope.cartIdArray
			}
		
		}).success(function(){
			
			$scope.allChose=true;
			//console.log("data"+ JSON.stringify(data))
			my.alert("即将删除选中商品").then(function(){
				$scope.getData();
			});
			
		}).error(function(){
			$scope.allChose=true;
			my.alert("遇到问题，请重新尝试222");
		});
		
			
		}
		
	}

	


	立即购买
	$scope.atONceBuy=function(){
	    for(var i in  $scope.cartList){
			if(!$scope.cartList[i].ww){
			$scope.cartIdArray.push($scope.cartList[i].id);
			}
		}
		
		console.log($scope.cartIdArray);
		
		if($scope.cartIdArray==''){
			my.alert("至少选一项");
			$scope.allChose=true;
		}else{
	        $state.go("market-ord",{"cartIdArray":$scope.cartIdArray})
		};
	       	
	}

})