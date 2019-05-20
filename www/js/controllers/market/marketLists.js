appControllers.controller('market-lists', function($scope,$http,$rootScope,$stateParams,$state,my) {
	$scope.title = '';
	
	$scope.typeCode=$stateParams.typeCode;
	$scope.keyword=$stateParams.keyword;
	$scope.minPrice='';
	$scope.maxPrice='';
	$scope.orderBySales='';
	$scope.ifPost='';

    $scope.pageIndex=1;
	

    // $scope.typeCode='';
    $scope.allOrderNum=0;
    $scope.choseColor=false;
    $scope.allPrice=0;
    $scope.ifShowCar=false;
   
    $scope.shoppongCarBtn=true;
   
    $scope.carList=JSON.parse(localStorage.getItem('carList'));
    console.log("$scope.carList==",$scope.carList);


   
    $scope.isNoShowFloor=false;
    $scope.ifShowNav=false;

    $scope.pageSize=50;
    $scope.pageIndex=1;
    $scope.businessId=1;



    $scope.noShowTheGood=function(){
        $scope.isNoShowFloor=false;
    }

    $scope.theGoods=function(k){
        if($scope.productList[k].stock == 0){
            $scope.isNoShowFloor=false;
            my.alert("商品售罄！");
        }else{
            $scope.isNoShowFloor=true;
         }
     }


	// $scope.tag = {
 //        current: "1"
 //      };
 //      $scope.actions = {
 //        setCurrent: function (param) {
 //        	$scope.tag.current=param;
 //        	switch(param){
 //        		case 1,4:
 //        			$scope.typeCode='';
 //        	}
 //        	$scope.getData($scope.keyword,$scope.typeCode,$scope.minPrice,$scope.maxPrice,$scope.orderBySales,$scope.ifPost,$scope.pageSize,$scope.pageIndex);
 //      	}
 //      }
      



     $scope.getData=function(keyword,typeCode,minPrice,maxPrice,orderBySales,ifPost,pageSize,pageIndex){
     	$scope.productList=[];
     	$scope.loading = true;
        $scope.noMore = false;
     	$http({
                    method:'GET',
                    url:ajaxurl + 'ehProduct/productList?token=' + $rootScope.token,
                    params:{
                        keyword:keyword,
                        typeCode:typeCode,
                        minPrice:minPrice,
                        maxPrice:maxPrice,
                        orderBySales:orderBySales,
                        ifPost:ifPost,
                        pageSize:pageSize,
                        pageIndex:pageIndex
                  }
            }).success(function(data){
            	// console.log(JSON.stringify(data));
            	$scope.loading = false;
            	$scope.productList=$scope.productList.concat(data.productList);
            	 // console.log("liebiao==="+JSON.stringify($scope.productList));
                for(var i in $scope.productList){
                    $scope.productList[i].orderNum=0;
                }
            
            // if(localStorage.getItem('carList')!=null){
            //     $scope.newCarList=JSON.parse(localStorage.getItem('newCarList'));
            //     localStorage.removeItem("newCarList");
            //     for(var i in $scope.newCarList){
            //         $scope.allPrice+=($scope.newCarList[i].soldPrice * $scope.newCarList[i].orderNum);
            //         $scope.allOrderNum+=$scope.newCarList[i].orderNum;
            //     }
            //     if($scope.allOrderNum>0){
            //         $scope.choseColor=true;
            //     }
            //     for(var i in $scope.productList){
            //         for(var j in $scope.newCarList){
            //             if($scope.productList[i].id==$scope.newCarList[j].id){
            //                 $scope.productList[i]=$scope.newCarList[j];
            //             }
            //         }
            //     }
            // };  




              if(localStorage.getItem('carList')!=null){
                // $scope.newCarList=JSON.parse(localStorage.getItem('newCarList'));
                // localStorage.removeItem("newCarList");
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
            };  





          




            	if(eval(data.productList).length < data.page.pageSize){
                    $scope.hasmore = false;
                    $scope.noMore = true;
                }else{
                    $scope.hasmore = true;
                } 
            })
    }
    
    $scope.getData($scope.keyword,$scope.typeCode,$scope.minPrice,$scope.maxPrice,$scope.orderBySales,$scope.ifPost,$scope.pageSize,$scope.pageIndex);
	//上拉加载
    $scope.openDetail =function(e){
 
		console.log("??  "+$scope.productList[e].stock)
		if($scope.productList[e].stock==0){
			my.alert("没有了");
		}else{
			$state.go('market-goods',{"productCode":$scope.productList[e].productCode});
		}
		
	}
    
   //缓冲加载圈
    $scope.loadMore = function (){
        $scope.pageIndex++; 
        $scope.getData($scope.keyword,$scope.typeCode,$scope.minPrice,$scope.maxPrice,$scope.orderBySales,$scope.ifPost,$scope.pageSize,$scope.pageIndex);
    };




    //计算总价
     $scope.totalPrice=function(){
        $scope.allPrice=0;
        for(var i in $scope.productList){
            $scope.allPrice+=($scope.productList[i].soldPrice * $scope.productList[i].orderNum);
        }
    }
    // $scope.dowmOrder=function(e){
    //     $scope.productList[e].orderNum--;
    //     $scope.allOrderNum--;
    //     if($scope.productList[e].orderNum==0){
    //         $scope.productList[e].orderNum='';
    //     }
    //     if($scope.allOrderNum==0){
    //         $scope.choseColor=false;
    //     }
    //     $scope.totalPrice();
    // }
    
    // $scope.upOrder=function(e){
    //     $scope.productList[e].orderNum++;
    //     $scope.allOrderNum++;
    //     if($scope.productList[e].orderNum>0){
    //     }
    //     if($scope.allOrderNum>0){
    //         $scope.choseColor=true;
    //     }
    //     $scope.totalPrice();
    // }


    $scope.dowmOrder=function(e){
        
         $scope.allOrderNum--;
        // if($scope.productList[e].orderNum==0){
        //  $scope.productList[e].orderNum='';
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
        // $scope.getCarList(e);
        $scope.carList=$scope.carList.filter(function(item){
            return item.orderNum!=0;
        })
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
    // $scope.openCar=function(){
    //     // $scope.carList=[];
    //     for(var i in $scope.productList){
    //         if($scope.productList[i].orderNum>0){
    //             $scope.carList.push($scope.productList[i]);
    //         }
    //     }
    //     $scope.ifShowCar=!$scope.ifShowCar;
    // }
 
 


    //打开购物车
    $scope.openCar=function(){
        // $scope.carList=JSON.parse(localStorage.getItem('carList'));
        $scope.ifShowCar=!$scope.ifShowCar;
        // for(var i in $scope.productList){
        //  if($scope.productList[i].orderNum>0){
        //      $scope.carList.push($scope.productList[i]);
        //  }
        // }
        // console.log("xinde"+$scope.carList);
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
        for(var i in $scope.productList){
            $scope.productList[i].orderNum=0;
        }
        localStorage.setItem('carList',JSON.stringify($scope.carList));
    }
    

    console.log("qunbu==="+$scope.allOrderNum);

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
    
    //// 商品简述加入购物车
    $scope.addCar=function(){
        $scope.upOrder($scope.e);
        $scope.totalPrice();
        $scope.isNoShowFloor=false;
    }



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
        //     if($scope.productList[i].orderNum>0){
        //         $scope.carList.push($scope.productList[i]);
        //     }
        // }
        localStorage.setItem('carList',JSON.stringify($scope.carList));
        $state.go('market-goods',{'productCode':$scope.productList[$scope.e].productCode});
    console.log("xinde"+$scope.carList);
}




//结算条件
    
    // console.log("购物车挑订单页？？？"+JSON.stringify($scope.carList));
    $scope.toOrd=function(){ 
        // localStorage.removeItem("carList");
        // $scope.carList=[];
        // for(var i in $scope.productList){
        //     if($scope.productList[i].orderNum>0){
        //         $scope.carList.push($scope.productList[i]);
        //     }
        // }
        // console.log("购物车挑订单页？？？"+JSON.stringify($scope.carList));
        if($scope.allPrice==0){
            my.alert("购物车是空的");
        }else{
             localStorage.setItem('carList',JSON.stringify($scope.carList));
             console.log("购物车挑订单页？？？123"+JSON.stringify($scope.carList));
             $state.go("market-ord");
            
        }
    }






});