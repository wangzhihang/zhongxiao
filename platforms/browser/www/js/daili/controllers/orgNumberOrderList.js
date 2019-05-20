appControllers.controller('org-number-order-list', function($scope,$state,$http,my,$rootScope) {
	$scope.title = '号码订单列表';
	$scope.pageSize = 10;
	$scope.pageIndex = 1;
	$scope.tag={'current':null};
	$scope.orgOrder = JSON.parse(localStorage.getItem('orgOrder'));
	// console.log($scope.orgOrder);
	$scope.orderList=[];
	$scope.lanOrderList=[];
	$scope.orderType='订单类型';
	$scope.showNumType = true;
	$scope.depts = [
		{'source':'000000','deptName':'全部'},
		{'source':'000004','deptName':'CBSS-APP'},
		{'source':'000019','deptName':'CBSS半成卡'},
		{'source':'000018','deptName':'CBSS成卡'},
		{'source':'000011','deptName':'CBSS购机赠费'},
		{'source':'000020','deptName':'宽带号码订单'},
		{'source':'000005','deptName':'BSS代理商选号'},
		{'source':'000023','deptName':'BSS产品新装'},
		{'source':'000028','deptName':'2i产品'},
		// {'source':'000006','deptName':'BSS预登录返单'},
		{'source':'000007','deptName':'集客CBSS'},
		{'source':'000012','deptName':'集客CBSS半成卡'},
		{'source':'000024','deptName':'集客公户入网'},
		// {'source':'000013','deptName':'集客顺丰定制版'},
		// {'source':'000010','deptName':'集客校园BSS'},
		// {'source':'000009','deptName':'集客固带移'},
		// {'source':'000014','deptName':'公安定制版'},
		// {'source':'000015','deptName':'校园活动受理'},
		// {'source':'000016','deptName':'校园预登陆返单'},
		// {'source':'000017','deptName':'BSS活动受理'},
		{'source':'000025','deptName':'无线固话'},
		{'source':'000008','deptName':'校园开户(远程实名)'},
		{'source':'000021','deptName':'公户'},
		{'source':'000027','deptName':'异业订单'}
	];
	$scope.tag1 = {
		current:'1'
	};
	$scope.tag2 = {
		current:'000000'
	},

	// if(JSON.parse(localStorage.getItem('shopInfoData'))){
	// 	$scope.shopInfoData = JSON.parse(localStorage.getItem('shopInfoData'));
	// 	$scope.orgOrder = $scope.shopInfoData.levelCode;
	// 	$scope.deptCode = $scope.shopInfoData.deptCode;
	// 	$scope.deptType = $scope.shopInfoData.deptType;
	// 	$scope.saleOrderList =  $scope.shopInfoData.saleOrderList;
	// }
	//号码订单
	$scope.getNumData=function(statusArray,source){
		// $scope.orderList=[];
		$scope.showNumOrder=true;
		$scope.showLanOrder=false;
		$scope.loading = true;
		$scope.noMore = false;
		 $scope.hasmore = false;
		 // console.log('?4444=='+$scope.pageIndex);
		$http({
			method:'GET',
			url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
			params:{
				levelCode:$scope.orgOrder.levelCode,
				statusArray:statusArray,
				pageSize:$scope.pageSize,
				pageIndex:$scope.pageIndex,
				source:source
			},
			timeout: 30000
		}).success(function(data){
			$scope.loading = false;
			$scope.orderList=$scope.orderList.concat(data.orderList);
			//如果小于pageSize禁止上拉加载
			if(data.orderList.length < data.page.pageSize){
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
		}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}


	//宽带订单
	$scope.getLanData=function(statusArray){
		$scope.showNumOrder=false;
		$scope.showLanOrder=true;
		$scope.loading = true;
		$scope.noMore = false;
		 $scope.hasmore = false;
		$http({
		method:'GET',
		url:ajaxurl + 'orderLanApp/queryLanOrderAppList?token=' + $rootScope.token,
		params:{
			levelCode:$scope.orgOrder.levelCode,
			statusArray:statusArray,
			pageSize:$scope.pageSize,
			pageIndex:$scope.pageIndex
		},
		timeout: 30000
	}).success(function(data){
		$scope.loading = false;
		// console.log('data.list=='+JSON.stringify(data.list));
		$scope.lanOrderList=$scope.lanOrderList.concat(data.list);
		// console.log('$scope.lanOrderList=='+JSON.stringify($scope.lanOrderList));
		//如果小于pageSize禁止上拉加载
		if(data.list.length < data.page.pageSize){
			$scope.noMore = true;
		}else{
			$scope.hasmore = true;
		}
	}).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	}


	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	if($scope.orgOrder.getFun=='getNumData'){
    		if($scope.tag.current==2){
	    		$scope.getNumData(['000003']);
	    	}else if($scope.tag.current==3){
	    		$scope.getNumData(['000001','000002','000004','000005','000007']);
	    	}else{
	    		$scope.getNumData([]);
	    	}
    	}
    	if($scope.orgOrder.getFun=='getLanData'){
    		if($scope.tag.current==2){
	    		$scope.getLanData(['000003']);
	    	}else if($scope.tag.current==3){
	    		$scope.getLanData(['000001','000002','000004','000005','000007']);
	    	}else{
	    		$scope.getLanData([]);
	    	}
    	}
    };


	// 头部导航
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;

			if($scope.tag.current==1){
				$scope.showChoseType=true;
			}
			if($scope.tag.current==2){
				$scope.pageIndex = 1;
				// console.log($scope.orgOrder.getFun);
				if($scope.orgOrder.getFun=='getNumData'){
					$scope.orderList=[];
					$scope.getNumData(['000003']);
				}
				if($scope.orgOrder.getFun=='getLanData'){
					$scope.lanOrderList=[];
					$scope.getLanData(['000003']);
				}
				if($scope.orgOrder.getFun=='getTotalData'){
					$scope.orderList=[];
					$scope.lanOrderList=[];
					$scope.getNumData(['000003']);
					$scope.getLanData(['000003']);
				}
				$scope.showChoseType=false;
			}
			if($scope.tag.current==3){
				$scope.pageIndex = 1;
				if($scope.orgOrder.getFun=='getNumData'){
					$scope.orderList=[];
					$scope.getNumData(['000001','000002','000004','000005','000007']);
				}
				if($scope.orgOrder.getFun=='getLanData'){
					$scope.lanOrderList=[];
					$scope.getLanData(['000001','000002','000004','000005','000007']);
				}
				if($scope.orgOrder.getFun=='getTotalData'){
					$scope.orderList=[];
					$scope.lanOrderList=[];
					$scope.getNumData(['000001','000002','000004','000005','000007']);
					$scope.getLanData(['000001','000002','000004','000005','000007']);
				}
				$scope.showChoseType=false;
			}
				
		}
	}
	//关闭选择类型
	$scope.closeChoseType=function(getFun,params){
		
		$scope.pageIndex = 1;
		if(getFun=='getNumData'){
			$scope.tag1.current = 1;
			$scope.orderList = [];
			$scope.showChoseType=true;
			$scope.showNumOrder=true;
			$scope.showLanOrder=false;
			$scope.showNumType = true;
			$scope.orgOrder.getFun='getNumData';
			$scope.orderType='号码订单';
			$scope.title = '号码订单列表';
		}
		if(getFun=='getLanData'){
			$scope.tag1.current = 2;
			$scope.tag2.current = '-1';
			$scope.lanOrderList = [];
			$scope.showChoseType=false;
			$scope.showNumOrder=false;
			$scope.showLanOrder=true;
			$scope.showNumType = false;
			$scope.orgOrder.getFun='getLanData';
			$scope.orderType='宽带订单';
			$scope.title = '宽带订单列表';
			$scope.getLanData([]);
		}
	}
	$scope.numOrderDetialType = function(source,deptName){
		console.log('source=='+source);
		$scope.showChoseType = false;
		$scope.showNumOrder=true;
		$scope.showLanOrder=false;
		$scope.loading = true;
		$scope.orderList = [];
		$scope.tag2.current = source;
		if(source == '000000'){
			$scope.orderType='号码订单';
			$scope.getNumData([]);
		}else{
			$scope.orderType=deptName;
			$scope.getNumData([],source);
		}
	}

	//调用函数
	if($scope.orgOrder.getFun=='getNumData'){
		// console.log("$scope.orgOrder.getFun"+$scope.orgOrder.getFun)
		$scope.showNumOrder=true;
		$scope.showLanOrder=false;
		$scope.orderType='号码订单';
		$scope.title = '号码订单列表';
		$scope.getNumData([]);
	}
	if($scope.orgOrder.getFun=='getLanData'){
		$scope.showNumOrder=false;
		$scope.showLanOrder=true;
		$scope.orderType='宽带订单';
		$scope.title = '宽带订单列表';
		$scope.getLanData([]);
	}
	if($scope.orgOrder.getFun=='getTotalData'){
		$scope.showNumOrder=true;
		$scope.showLanOrder=true;
		$scope.getNumData([]);
		$scope.getLanData([]);
	}

	//关闭遮罩层
	$scope.close=function(){
		$scope.showChoseType=false;
	}

	//号码订单详情页面
	$scope.orgShopOrderInfo=function(index){
		localStorage.setItem('orderCode',$scope.orderList[index].orderCode);
		$scope.source=$scope.orderList[index].source;
		$scope.number=$scope.orderList[index].number;
		localStorage.setItem('source',$scope.source);
		//$state.go('kk-order-detail');
		if($scope.source=="000020"){
			//console.log($scope.source);
			//$state.go("kdOrderDetail",{number:order["number"]});
			$state.go('kd-order-detail',{number:$scope.number});
		}else{
			$state.go('kk-order-detail');
		}
	}
	//宽带订单详情页
	$scope.orgShopLanOrderInfo=function(index){
		localStorage.setItem('orderCode',$scope.lanOrderList[index].orderCode);
		$state.go('kd-order-detail');
	}

});