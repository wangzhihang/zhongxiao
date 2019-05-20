appControllers.controller('market-goods', function($scope,$http,$rootScope,$stateParams,my,$state) {
	$scope.title = '';
	$scope.loading=false;
	$scope.num=1;
	$scope.productName='';
	$scope.primePrice='';
	$scope.isShowMore=false;
	$scope.isNoShowFloor=false;
	$scope.isNoShowCard=true;
	$scope.alwawsShow=true;
	$scope.stock='';
	$scope.productCode=$stateParams.productCode;
	$scope.choseColor=false;
	$scope.carList=JSON.parse(localStorage.getItem('carList'));
	
	// $scope.activeBos = localStorage.getItem('activeBos');
	$scope.activeName = localStorage.getItem('activeName');
	// $scope.activeName = $scope.activeBos.activeName;
	console.log("活动==="+$scope.activeName);

	$scope.getData = function(productCode){
			$scope.loading = true;
			
		$http({
			    "method": 'get', 
				"url" : ajaxurl + 'ehProduct/productDetail',
				"params": {
				productCode:productCode
				
			}
		}).success(function(data){
			
			$scope.loading=false;
			$scope.product=data.product;
			$scope.product.orderNum=0;
			if($scope.allOrderNum>0){
				$scope.choseColor=true;
			};
		console.log("data 000 "+ JSON.stringify(data))
			$scope.goodDepict = data.product.depict;
			$scope.product=data.product;
			
			// console.log("lunbo === "+$scope.product.imgLbs.length);
			
			// $scope.imgLbS0=$scope.product.imgLbs[0];
			// $scope.imgLbS1=$scope.product.imgLbs[1];
			// $scope.imgLbS2=$scope.product.imgLbs[2];
			// $scope.imgLbS3=$scope.product.imgLbs[3];
			
			$scope.soldPrice=$scope.product.soldPrice;
			$scope.allSoldPrice=$scope.soldPrice;
			localStorage.setItem("productCode",data.product.productCode);
			// console.log("新的==="+localStorage.getItem("productCode"));
		}).error(function(){
			
		});
	};      
    $scope.getData($scope.productCode); 

	


	$scope.allOrderNum=0;
	$scope.choseColor=false;
	$scope.allPrice=0;
	$scope.ifShowCar=false;
	
	//	计算总价
	$scope.totalPrice=function(){
		$scope.allOrderNum=0;
		$scope.allPrice=0;
		for(var i in $scope.carList){
			$scope.allOrderNum+=$scope.carList[i].orderNum;
			$scope.allPrice+=($scope.carList[i].soldPrice * $scope.carList[i].orderNum);
		}
	}
	$scope.totalPrice();
	


	

	//打开购物车
	$scope.openCar=function(){
		// $scope.carList=JSON.parse(localStorage.getItem('carList'));
		
		
		$scope.ifShowCar=!$scope.ifShowCar;


		// for(var i in $scope.productList){
		// 	if($scope.productList[i].orderNum>0){
		// 		$scope.carList.push($scope.productList[i]);
		// 	}
		// }
		console.log("xinde"+$scope.carList);
		console.log("总数量"+$scope.allOrderNum)



		localStorage.setItem('carList',JSON.stringify($scope.carList));

	}
	
	// 关闭购物车
	$scope.closeCar=function(){
		$scope.ifShowCar=false;	
	}
	
	
	// 清空购物车
	$scope.emptyCar=function(){
		$scope.choseColor=false;
		$scope.carList=[];
		$scope.allOrderNum=0;
		$scope.allPrice=0;
		$scope.product.orderNum=0;
		localStorage.setItem('carList',JSON.stringify($scope.carList));
	}
	
	//购物车的增加订单
	$scope.carDownOrder=function(e){
		$scope.carList[e].orderNum++;
		$scope.allOrderNum++;
		$scope.totalPrice();
		$scope.carList=$scope.carList.filter(function(item){
			return item.orderNum!=0
		})
		localStorage.setItem('carList',JSON.stringify($scope.carList));
	}
	
	
	//购物车的减少订单
	$scope.carUpOrder=function(e){
		$scope.carList[e].orderNum--;
		$scope.allOrderNum--;
		if($scope.allOrderNum==0){
			$scope.choseColor=false;
		}else{
			$scope.choseColor=true;
		}
		$scope.totalPrice();
		$scope.carList=$scope.carList.filter(function(item){
			return item.orderNum!=0
		})
		localStorage.setItem('carList',JSON.stringify($scope.carList));
	}
	
	
	// 加入购物车
	$scope.addcarInfo=function(){
		
		if($scope.carList!=null){
			var ifAdd=$scope.carList.every(function(item){
			return item.id!=$scope.product.id;
			})
			console.log("---",$scope.allOrderNum,ifAdd);
			if(ifAdd){
				$scope.product.orderNum++;
				$scope.carList.push($scope.product);
			}else{
				$scope.carList.forEach(function(item,index){
					if(item.id==$scope.product.id){
						$scope.carList[index].orderNum++;
					}
				})
			}
		}
		
		$scope.allOrderNum++;

		$scope.totalPrice();
		
		if($scope.allOrderNum==0){
			$scope.choseColor=false;
		}

		if($scope.allOrderNum>0){
			$scope.choseColor=true;
			
		}

		
		localStorage.setItem('carList',JSON.stringify($scope.carList));
		console.log("此刻购物车内容===",$scope.carList)
	}
	
	// 更多蒙层
	$scope.closeFloor=function(){
		$scope.isNoShowFloor=false;
		$scope.isNoShowCard=true;
	}




	$scope.showMore=function(){
		$scope.isShowMore=!$scope.isShowMore;
	}
 
	$scope.isNoShowMore = function(){
		$scope.isShowMore=false;
	}


	$scope.share = function(){
		
	}











});