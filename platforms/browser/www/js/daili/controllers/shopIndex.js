appControllers.controller('daili-shop-index', function($scope,$http,$stateParams,$rootScope,$state,my,$ionicLoading,$stateParams) {
	// $scope.title = '';
	$scope.pageIndex = 1;
	$scope.pageSize = 10;
	$scope.shopList = [];
	$scope.newshopList = [];
	$scope.statsList=[];
	$scope.loading = true;
	$scope.isNoShowRange=false;
	$scope.isNoShowRank=false;
	$scope.isNoShowChosePop=false;
	$scope.userId=signInInfo.userInfo.userId;
	if($stateParams.abnormal=='1'){
		$scope.abnormal=$stateParams.abnormal;
	}else{
		$scope.abnormal='';
	}

	$scope.queryDetpList=function(keyWords,abnormal){
		$http({
	         method:'get',
	         url:ajaxurl + 'appDept/getAgencyShopList?token=' + $rootScope.token,
	         params:{
	         	'levelCode':signInInfo.deptInfo.levelCode
	         	,'keyWords':keyWords
	         	,'isTodayLogin':abnormal
	         }
	     }).success(function(data){
			// console.log(JSON.stringify(data));
			$scope.loading=false;
			$scope.statsList=data;
			for(var i in $scope.statsList){
            	if($scope.statsList[i].deptType == '000002'){
            		$scope.statsList[i].headImg = 'img/daili.png';
            	}else if($scope.statsList[i].deptType == '000003'){
            		$scope.statsList[i].headImg = 'img/yewu.png';
            	}else if($scope.statsList[i].deptType == '000004'){
            		$scope.statsList[i].headImg = 'img/dianpu.png';
            	}
             }
		}).error(function () {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index_dl');
	        }); 
	    });
	}
	$scope.queryDetpList('',$scope.abnormal);

	$scope.lookKeywords=function(keyword){
		$scope.queryDetpList(keyword,$scope.abnormal);
	}
	
	// console.log('22=='+JSON.stringify($scope.subordinateList));

	//console.log("userId=="+$scope.userId);
	$scope.lngs=[];
    	$scope.lats=[];
	// 初始坐标地址（假的）
	$scope.startlat=108.924434;
     	 $scope.startlng=34.224223;
	//初始化店铺列表
	// getShopList('',$scope.pageIndex,$scope.userId);
	
	// 头部导航
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			switch($scope.tag.current){
				case 1:
					$scope.isNoShowRange=false;
					$scope.isNoShowRank=false;
					$scope.isNoShowChosePop=false;
					$scope.tag1.current =0;
					$scope.tag2.current =0;
					break;
				case 2:
					$scope.isNoShowRank=false;
					$scope.isNoShowChosePop=false;
					switch($scope.isNoShowRange){
						case false:
							$scope.isNoShowRange=true;
							break;
						default:
							$scope.isNoShowRange=false;
					};
					break;
				case 3:
					$scope.isNoShowRange=false;
					$scope.isNoShowChosePop=false;
					switch($scope.isNoShowRank){
						case false:
							$scope.isNoShowRank=true;
							break;
						default:
							$scope.isNoShowRank=false;
					};
					break;
				case 4:
					$scope.isNoShowRank=false;
					$scope.isNoShowRange=false;
					$scope.isNoShowChosePop=true;
					break;
			}
		}
	}
	// 范围选择
	$scope.tag1 = {
		current: "0"
	};
	$scope.actions1 = {
		setCurrent: function (param) {
			$scope.tag1.current = param;
			switch($scope.tag1.current){
				case 1:
					$scope.isNoShowRange=false;
					break;
				case 2:
					$scope.isNoShowRange=false;
					break;
				case 3:
					$scope.isNoShowRange=false;
					break;
				case 4:
					$scope.isNoShowRange=false;
					break;
				case 5:
					$scope.isNoShowRange=false;
					break;
			}
		}
	}
	// 关闭范围
	$scope.closeRange=function(){
		$scope.isNoShowRange=false;

	}
	// 排序选择
	$scope.tag2 = {
		current: "2"
	};
	$scope.actions2 = {
		setCurrent: function (param) {
			$scope.tag2.current = param;
			switch($scope.tag2.current){
				case 1:
					$scope.isNoShowRank=false;
					break;
				case 2:
					$scope.isNoShowRank=false;
					break;
				case 3:
					$scope.isNoShowRank=false;
					break;
				case 4:
					$scope.isNoShowRank=false;
					break;
			}
		}
	}
	//关闭排序
	$scope.closeRank=function(){
		$scope.isNoShowRank=false;
	}

	// 筛选-排序标准
	$scope.tag3= {
		current:'1'
	};
	$scope.actions3 = {
		setCurrent:function(parem){
			$scope.tag3.current = parem;

		}
	}
	// 筛选-出卡量
	$scope.tag4={
		current:'2'
	};
	$scope.actions4 = {
		setCurrent:function(parem){
			$scope.tag4.current = parem;

		}
	}

	// 筛选-本月出卡量区间
	$scope.tag5={
		current:'0'
	};
	$scope.actions5 = {
		setCurrent:function(parem){
			$scope.tag5.current = parem;

		}
	}
	// 筛选-上月出卡量区间
	$scope.tag6={
		current:'0'
	};
	$scope.actions6 = {
		setCurrent:function(parem){
			$scope.tag6.current = parem;

		}
	}
	//关闭筛选
	$scope.closeChosePop=function(){
		$scope.isNoShowChosePop=false;
	}
	//重置
	$scope.resetting=function(){
		$scope.tag3.current =0;
		$scope.tag4.current =0;
		$scope.tag5.current =0;
		$scope.tag6.current =0;
	}
	$scope.ensure=function(){
		$scope.isNoShowChosePop=false;
	}
	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	getShopList('',$scope.pageIndex,$scope.userId); 
    };
	//搜索
	// $scope.lookKeywords = function(keyword){
	// 	//console.log("keyword=="+ keyword);
	// 	$scope.shopList = [];
	// 	$scope.pageIndex = 1;
	// 	getShopList(keyword,$scope.pageIndex,$scope.userId);
	// };
	//获取店铺列表方法
	// function getShopList(keyword,pageIndex,userId){
	// 	// $ionicLoading.show({template: '数据加载中...'});
	// 	$scope.loading = true;
	// 	$scope.noMore = false;

	// 	if(userBo.userType == "000002"){
 //    		$http({
	// 	         method:'get',
	// 	         url:ajaxurl + 'appDept/queryDetpStatsNew?token=' + $rootScope.token,
	// 	         params:{
	// 	         	'deptCode':signInInfo.userInfo.deptCode
	// 	         	,'levelCode':signInInfo.deptInfo.levelCode
	// 	         	,'orderName':null
	// 	         	,'keyWords':null
	// 	         	,'abnormal':null
	// 	         	,'dateType':null
	// 	         	,'minNum':null
	// 	         	,'maxNum':null
	// 	         }
	// 	     }).success(function(data){
	// 			// console.log(JSON.stringify(data));
	// 			$scope.statsList = data.statsList;
	// 		}).error(function () {
	// 	        my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	// 	            $state.go('index');
	// 	        }); 
	// 	    });
 //    	}
		


	// 	$http({
	// 		method:'post',
	// 		url:ajaxurl + 'userApp/getAgencyShopList?token=' + $rootScope.token,
	// 		data:{
	// 			keywords:keyword,
	// 			pageIndex:pageIndex,
	// 			userId:userId
	// 		},
	// 		timeout: 10000
	// 	}).success(function(data){
	// 		// $ionicLoading.hide();
			
	// 		//console.log(JSON.stringify(data));
	// 		$scope.loading = false;		
	// 		$scope.noMore = false;
	// 		//console.log(eval(data.shopList['list']).length)
	// 		//如果小于pageSize禁止上拉加载
	// 		// if(eval(data.shopList['list']).length < $scope.pageSize){
	// 		// 	$scope.hasmore = false;
	// 		// 	$scope.noMore = true;
	// 		// }else{
	// 		// 	$scope.hasmore = true;
	// 		// }
	// 		$scope.statsList = $scope.statsList.concat(data.statsList);
	// 		//console.log($scope.shopList);
	// 		 for(var i in $scope.shopList){
	// 	               // $scope.lngs= $scope.lngs.concat($scope.shopList[i].lnglats.split(",")[1]);
	// 	               // $scope.lats= $scope.lats.concat($scope.shopList[i].lnglats.split(",")[0]);
	// 	               // // console.log($scope.shopList[j]);
	// 	               // for(var j=1;j<$scope.lngs.length;j++){
	// 		              // if($scope.shopList[j]){
	// 		              //      	 $scope.shopList[j].distance=getFlatternDistance($scope.startlat,$scope.startlng,parseFloat($scope.lats[j]),parseFloat($scope.lngs[j]));
	// 		             	//  }
 //                 // 		 }
 //            	if($scope.shopList[i].headImgUrl==null||$scope.shopList[i].headImgUrl==""){
 //            		$scope.shopList[i].isNoShowPic=false;
 //            	}else{
 //            		$scope.shopList[i].isNoShowPic=true;
 //            	}
 //             }
	// 		if($scope.tag1.current!=0){
 //                        $scope.newshopList=[];
 //                        for(var i in $scope.shopList){
 //                              if($scope.shopList[i].distance<1000 &&  $scope.tag1.current ==1){
 //                                    $scope.newshopList= $scope.newshopList.concat( $scope.shopList[i]);
 //                              }else if($scope.shopList[i].distance<3000 &&  $scope.tag1.current ==2){
 //                                    $scope.newshopList= $scope.newshopList.concat( $scope.shopList[i]);
 //                              }else if($scope.shopList[i].distance<6000 &&  $scope.tag1.current ==3){
 //                                    $scope.newshopList= $scope.newshopList.concat( $scope.shopList[i]);
 //                              }else if($scope.shopList[i].distance<10000 &&  $scope.tag1.current ==4){
 //                                    $scope.newshopList= $scope.newshopList.concat( $scope.shopList[i]);
 //                              }else if($scope.tag1.current ==5){
 //                                    $scope.newshopList=$scope.shopList[i];
 //                              }
 //                         }
 //                 }else{
 //                      //  console.log("444");
 //                        $scope.newshopList=$scope.shopList;
 //                 }
	// 		//获取页面总数
	// 		$scope.pageCount = data.shopList.pageCount;
	// 		//号码订单
	// 		$scope.numOrderCnt = data.numOrderCnt;
	// 		//宽带订单
	// 		$scope.lanOrderCnt = data.lanOrderCnt;
	// 		//店铺数量
	// 		$scope.shopCnt = data.shopCnt;
	// 		//业务员数量
	// 		$scope.deveCnt = data.deveCnt;	
	// 		//订单数量	
	// 		for(var i in $scope.shopList){
	// 			if($scope.shopList[i].numOrderCntThisMon>0){
	// 				$scope.shopList[i].isHasOrder=true;
	// 				$scope.shopList[i].noHasOrder=false;
	// 			}else{
	// 				$scope.shopList[i].isHasOrder=false;
	// 				$scope.shopList[i].noHasOrder=true;
	// 			}
	// 		}
			
	// 	}).error(function () { 
	// 		 my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	//                 $state.go('index_dl');
	//             }); 
	// 	}).finally(function () { 
	// 		$scope.$broadcast('scroll.infiniteScrollComplete');
	// 	});	
	// }
	//店铺详情页面
	$scope.shopDetail = function(index,imgUrl,id){
		localStorage.setItem('ownerId',index);
		localStorage.setItem('imgUrl',imgUrl);
		localStorage.setItem('shopId',id);
		$state.go('daili-shop');
	};



	 //坐标地址
      var EARTH_RADIUS = 6378137.0;    //单位M
      var   PI = Math.PI;
    
      function getRad(d){
          return d*PI/180.0;
    	}
      
      //  $scope.endlat=108.890194;
      //  $scope.endlng=34.236365;
      // alert( getFlatternDistance($scope.startlat,$scope.startlng,$scope.endlat,$scope.endlng));
      function getFlatternDistance(lat1,lng1,lat2,lng2){
            var f = getRad((lat1 + lat2)/2);
            var g = getRad((lat1 - lat2)/2);
            var l = getRad((lng1 - lng2)/2);
            
            var sg = Math.sin(g);
            var sl = Math.sin(l);
            var sf = Math.sin(f);
            
            var s,c,w,r,d,h1,h2;
            var a = EARTH_RADIUS;
            var fl = 1/298.257;
            
            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;
            
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            
            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    	}

    //店铺销售详情
    $scope.orgSalemanShopList = function(levelCode,deptCode,deptName,userId){
    	localStorage.setItem('shopInfoData',JSON.stringify({
    		'levelCode':levelCode,
    		'deptCode':deptCode,
    		'deptName':deptName,
    		'userId':userId,
    		'typeTag':'1'
    	})
    	);
    	$state.go('daili-org-saleman-shop-info');
    }
});