appControllers.controller('market-index', function($scope,$rootScope,$http,$state,my) {
	$scope.title = '商城';
	
	$scope.typeCode='';
	$scope.allOrderNum=0;
	$scope.choseColor=false;
	$scope.allPrice=0;
	$scope.ifShowCar=false;
	$scope.indexnav_1=true;
    $scope.indexnav_2=false;
    $scope.indexnav_3=false;
    $scope.shoppongCarBtn=true;
	$scope.carList=JSON.parse(localStorage.getItem('carList'));
	$scope.isNoShowFloor=false;
    $scope.ifShowNav=false;
 	$scope.discountDiv=false;
 	$scope.evalListNull=false;
    

 	// $scope.submitApply=false;


    $scope.addApaly=true;
	
    $scope.assessType='000000';

	$scope.pageSize=100;
	$scope.pageIndex=1;
	$scope.businessId=1;

	$scope.itemId='';
	// $scope.assessProductId='';
	// $scope.status='';
	$scope.content="";


	$scope.keyword='';
	// $scope.typeCode,//评论人是否匿名状态
	$scope.minPrice='';
	$scope.maxPrice='';
	$scope.orderBySales='';
	$scope.ifPost='';
	$scope.evalList=[];
    $scope.evalContent='';
	$scope.oksupport = false;


	$scope.noShowTheGood=function(){
		$scope.isNoShowFloor=false;
	}
	$scope.isShowDiscount=function(){
		$scope.discountDiv=true;
	}
	$scope.colsediscountDiv=function(){
		$scope.discountDiv=false;
	}


	$scope.tag = {
        current: "1",
        indexType: "1"
    };
     
     
    $scope.actions = {
        setCurrent: function (param) {
        	$scope.tag.current=param;
   			switch(param){
        		case 1:
        		 $scope.shoppongCarBtn=true;
        		 $scope.ifShowNav=true;
        		break;
        		case 2:
        		 $scope.shoppongCarBtn=false;
        		 $scope.ifShowNav=false;
        		break;
        		case 3:
        		 $scope.shoppongCarBtn=false;
        		 $scope.ifShowNav=false;
        		break;
        	}
        },

     
      	goodsTypes:function(param){
      		$scope.tag.indexType=param;
      		switch(param){
        		case 1:
        			$scope.typeCode='';
        			break;
				case 2: 
        			$scope.typeCode='PJ0001';
        			break;
        		case 3:
        			$scope.typeCode='SG0001';
        			break;
        		case 4:
        			$scope.typeCode='SJ0001';
        			break;
        	}
        	$scope.getData();
        	
      	},



      	assessType:function(param){
      		$scope.tag.assessType=param;
      		switch(param){
        		case 1:
        			$scope.assessType='000000';
        			break;
				case 2:
        			$scope.assessType='000001';
        			
        			break;
        		case 3:
        			$scope.assessType='000002';
        			
        			break;
        		case 4:
        			$scope.assessType='000003';
        			
        			break;
        	}
        	$scope.indexEval($scope.businessId,$scope.pageSize,$scope.pageIndex ,$scope.assessType);
      	},


	}
 

	$scope.getData = function(keyword,typeCode,minPrice,maxPrice,orderBySales,ifPost){
		$http({
			  "method" : 'get'
			, "url" : ajaxurl + 'ehProduct/productList?token='+$rootScope.token
			, "params" : {
					  keyword:$scope.keyword,//商品编码   订单号：457274433453
    				  typeCode:$scope.typeCode,//评论人是否匿名状态  217.78
    				  minPrice:$scope.minPrice,//评分
					  maxPrice:$scope.maxPrice,//评价内容
					  orderBySales:$scope.orderBySales,//评价晒图
					  ifPost:$scope.ifPost//订单商品状态
			}
		}).success(function(data){
			
			$scope.productList=data.productList;

			$scope.theGoods=function(k){
				if($scope.productList[k].stock == 0){
					$scope.isNoShowFloor=false;
						my.alert("商品售罄！");
				}else{
					$scope.isNoShowFloor=true;

				}
			}
	    	//初始化商品数量
			for(var i in $scope.productList){
				$scope.productList[i].orderNum=0;
			}
			$scope.allOrderNum=0;
        	$scope.allPrice=0;
			// $scope.typeCode=$scope.productList.typeCode;
			if(localStorage.getItem('carList')!=null){
				for(var i in $scope.carList){
					$scope.allPrice+=($scope.carList[i].soldPrice * $scope.carList[i].orderNum);
					$scope.allOrderNum+=$scope.carList[i].orderNum;
				}
				if($scope.allOrderNum>0){
					$scope.choseColor=true;
				}
					for(var i in $scope.productList){
						for(var j in $scope.carList){
							if($scope.productList[i].id==$scope.carList[j].id){
								$scope.productList[i]=$scope.carList[j];
							}
						}
				}
			}
			
			// if(localStorage.getItem('carList')!=null){
				
			// 	$scope.newCarList=JSON.parse(localStorage.getItem('newCarList'));
				
			// 	localStorage.removeItem("newCarList");
				
			// 	for(var i in $scope.newCarList){
			// 		$scope.allPrice+=($scope.newCarList[i].soldPrice * $scope.newCarList[i].orderNum);
			// 		$scope.allOrderNum+=$scope.newCarList[i].orderNum;
			// 	}
			// 	if($scope.allOrderNum>0){
			// 		$scope.choseColor=true;
			// 	}
			// 	for(var i in $scope.productList){
			// 		for(var j in $scope.newCarList){
			// 			if($scope.productList[i].id==$scope.newCarList[j].id){
			// 				$scope.productList[i]=$scope.newCarList[j];
			// 			}
			// 		}
			// 	}
			// };	
		}).error(function(){
			
		});



		//商家信息
		$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehProduct/findBusinessInfo?token='+$rootScope.token
			, "params": {
				
				businessId:1,
				
			}
		}).success(function(data){
			$scope.activeBos=data.activeBos;
			localStorage.setItem('activeBos',JSON.stringify($scope.activeBos));
			localStorage.setItem('activeId',JSON.stringify($scope.activeBos[0].id));
			localStorage.setItem('activeName',JSON.stringify($scope.activeBos[0].activeName));
			localStorage.setItem('discount',JSON.stringify($scope.activeBos[0].discount));
			localStorage.setItem('reachLevel',JSON.stringify($scope.activeBos[0].reachLevel));
		
			$scope.allAssess=data.allAssess;
			$scope.goodAssess=data.goodAssess;
			$scope.badAssess=data.badAssess;
			$scope.imgAssess=data.imgAssess;
			
			$scope.serviceScore=data.serviceScore;
			$scope.productScore=data.productScore;
			$scope.logisScore=data.logisScore;
			$scope.totalScore=data.totalScore;

			
		}).error(function(){
			
		});





	};
	$scope.getData();



	$scope.ifShowNav=false;
	$scope.onScroll = function() {
//      可以看到，即使是手指离开屏幕，页面在惯性滚动时，值仍为true
		if($scope.tag.current==1){       

		if(angular.element("#indexMain").offset().top<46){
			$scope.$apply(function () {
	     　　	$scope.ifShowNav=true;
	      });
			
		}else{
			$scope.$apply(function () {
	     　　	$scope.ifShowNav=false;
	      });
		}
		};

	};



// 详情简述
	$scope.detaInfo=function(e){
		$scope.e=e;
		$scope.proLists=$scope.productList[e];
		
	// $state.go("market-goods",{'productCode':$scope.productList[e].productCode});
	}	

// 进入商品详情
$scope.intoGoodsInfo=function(){ 
		// $scope.carList=[];
	
		// for(var i in $scope.productList){
		// 	if($scope.productList[i].orderNum>0){
		// 		$scope.carList.push($scope.productList[i]);
		// 	}
		// }
		// localStorage.setItem('carList',JSON.stringify($scope.carList));

	$state.go("market-goods",{'productCode':$scope.productList[$scope.e].productCode});
}		
	$scope.getCarList=function(){
		
			$scope.carList=[];
			for(var i in $scope.productList){
				if($scope.productList[i].orderNum>0){
					$scope.carList.push($scope.productList[i]);
				}
			}
		
	}
	
//	计算总价
	$scope.totalPrice=function(){
		$scope.allPrice=0;
		for(var i in $scope.carList){
			$scope.allPrice+=($scope.carList[i].soldPrice * $scope.carList[i].orderNum);
		}
	}
	$scope.dowmOrder=function(e){
		
		$scope.allOrderNum--;
		// if($scope.productList[e].orderNum==0){
		// 	$scope.productList[e].orderNum='';
		// }
		if(localStorage.getItem('carList')!=null){
			var ifAdd=$scope.carList.every(function(item){
				return item.id!=$scope.productList[e].id;
			})
			if(ifAdd){
				$scope.productList[e].orderNum--;
				$scope.carList.push($scope.productList[e]);
			}else{
				$scope.carList.forEach(function(item,index){
					if(item.id==$scope.productList[e].id){
						$scope.carList[index].orderNum--;
					}
				})
			}
		}else{
			$scope.productList[e].orderNum--;
			$scope.getCarList();
		}
		if($scope.allOrderNum==0){
			$scope.choseColor=false;
		}
		$scope.totalPrice();
		$scope.carList=$scope.carList.filter(function(item){
			return item.orderNum!=0;
		})
		// $scope.getCarList(e);
		 localStorage.setItem('carList',JSON.stringify($scope.carList));
	}
	
	$scope.upOrder=function(e){
		
		$scope.allOrderNum++;
		
		if(localStorage.getItem('carList')!=null){
			var ifAdd=$scope.carList.every(function(item){
				return item.id!=$scope.productList[e].id;
			})
			if(ifAdd){
				$scope.productList[e].orderNum++;
				$scope.carList.push($scope.productList[e]);
			}else{
				$scope.carList.forEach(function(item,index){
					if(item.id==$scope.productList[e].id){
						$scope.carList[index].orderNum++;
					}
				})
			}
		}else{
			$scope.productList[e].orderNum++;
			$scope.getCarList();
		}
		if($scope.allOrderNum>0){
			$scope.choseColor=true;
		}
		$scope.totalPrice();
		localStorage.setItem('carList',JSON.stringify($scope.carList));
	}

    //打开购物车
	$scope.openCar=function(){
		$scope.ifShowCar=!$scope.ifShowCar;
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
		for(var i in $scope.productList){
			$scope.productList[i].orderNum=0;
		}
		 localStorage.setItem('carList',JSON.stringify($scope.carList));
	}
	
	
	//购物车的增加订单
	$scope.carDownOrder=function(e){
		$scope.carList[e].orderNum++;
		$scope.allOrderNum++;
		$scope.totalPrice();
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
			return item.orderNum!=0;
		})
	}
	
	//商品简述加入购物车
	$scope.addCar=function(){
		$scope.upOrder($scope.e);
		$scope.totalPrice();
		$scope.isNoShowFloor=false;
	}

	//结算条件
	$scope.toOrd=function(){ 
		// localStorage.removeItem("carList");
		// $scope.carList=[];
		// for(var i in $scope.productList){
		// 	if($scope.productList[i].orderNum>0){
		// 		$scope.carList.push($scope.productList[i]);
		// 	}
		// }
		if($scope.allPrice==0){
			my.alert("购物车是空的");
		}else{
			 localStorage.setItem('carList',JSON.stringify($scope.carList));
			
			 $state.go("market-ord");
			
		}
	}

		// $scope.indexEval(index,$scope.businessId,$scope.pageSize,$scope.pageIndex ,$scope.assessType);
	// 首页评价接口
	$scope.indexEval=function(index,businessId,pageSize,pageIndex ,assessType){
		//

		//商家所有评价
		$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehProduct/findAllAssess?token='+$rootScope.token
			, "params": {
				pageSize:$scope.pageSize,
				pageIndex:$scope.pageIndex,
				businessId:1,
				assessType:$scope.assessType
			}
		}).success(function(data){
			    $scope.data=data;
			    $scope.evalList=data.list;
			    // $scope.content=$scope.evalList[index].content; 
		
				if($scope.evalList.length!=0){
					for(var index in $scope.evalList){
						 $scope.evalList[index].applyMas = false;
						 $scope.evalList[index].evalContent ='';
					}
				};
		}).error(function(){
			
		});
	 };

	



	//评价点赞  限制点击次数
		$scope.addSupport=function(e){
			$http({
			  "method": 'get'
			, "url" : ajaxurl + 'ehOrder/addPraiseNum?token='+$rootScope.token
			, "params": {
				itemId:e
			}
		}).success(function(data){
			  $scope.evalList[e].praiseNum++;
			  $scope.evalList[e].oksupport=true;
		}).error(function(){
			
		});

		}                

	




	//评价回复留言列表
		$scope.leaveMassage=function(index,itemId){
			$scope.evalList[index].applyMas = !$scope.evalList[index].applyMas;


			$http({
					"method": 'get'
					, "url" : ajaxurl + 'ehOrder/findAllReply?token='+$rootScope.token
					, "params": {
					     itemId:$scope.evalList[index].id,
					}
				}).success(function(data){
					  $scope.applyList=data;
				}).error(function(){
					
				});

		}


		//评价回复留言
		$scope.input={"evalContent":""};
		$scope.submitReply=function(index){
				$http({
					  "method": 'post'
					, "url" : ajaxurl + 'ehOrder/addOneReply?token='+$rootScope.token
					, "data": {
						assessProductId:$scope.evalList[index].id,
						status:$scope.evalList[index].status,
						content:$scope.evalList[index].evalContent
					}
				}).success(function(data){
					  $scope.evalList[index].applyMas=false;
				}).error(function(){
					
				});
		}




	
});

