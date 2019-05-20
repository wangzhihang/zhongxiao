appControllers.controller('daili-org-saleman-shop-list', function($scope,$state,$ionicPopup,$http,my,$rootScope) {
	$scope.title = '';
	$scope.isNoShowHeader=false;
	$scope.xDate=[];
	$scope.totalOrderNumber=[];
	$scope.salemanList = [];
	$scope.input = {'deptCode':'','levelCode':'','deptCode':'','index':''};
	$scope.DevelopInfo = JSON.parse(localStorage.getItem('DevelopInfos'));
	$scope.isShowResertPwd = true;
	if(localStorage.getItem('showResertPwd') == ''){
		$scope.isShowResertPwd = false;
	}
	$scope.deptType='';
	$scope.deptType = '';
	$scope.levelCode = '';
	$scope.deptCode = '';
	$scope.orgCode = '';
	$scope.userId = null;
	if($scope.DevelopInfo.headImg==null||$scope.DevelopInfo.headImg==""){
		$scope.isImgUrl=false;
	}else{
		$scope.isImgUrl=true;
		$scope.imgUrl = $scope.DevelopInfo.headImg;
	}
	$scope.deptName = $scope.DevelopInfo.deptName;
	$scope.index =  $scope.DevelopInfo.index;
 
	if($scope.DevelopInfo.deptType=='000003'){
		$scope.btnText='添加店铺';
	}else if($scope.DevelopInfo.deptType=='000002'){
		if($scope.deptType=='000003'){
			$scope.btnText='添加店铺';
		}else{
			$scope.btnText='添加业务员'; 
		}
	}else{
		$scope.btnText='添加店铺';
	}

	//查看店铺信息
	$scope.orgSalemanShopInfo=function(levelCode,deptCode,deptType,deptName,index,headImg,userId){
		// console.log('levelCode=='+levelCode);
		$scope.isShowResertPwd = true;
		$scope.deptType=deptType;
		$scope.deptName=deptName;
		$scope.userId = userId;
		if(headImg){
			$scope.imgUrl = headImg;
		}else{
			$scope.imgUrl = 'img/logo.png';
		}
		
		localStorage.setItem('shopInfoData',JSON.stringify({
				levelCode:levelCode,
				deptCode:deptCode,
				deptType:deptType,
				deptName:deptName,
				statsList:$scope.statsList,
				'index':index
			})
		);
		if(deptType=='000004'){
			localStorage.setItem('shopTag','2');
			localStorage.setItem('shopUserId',userId);
			$state.go('daili-org-saleman-shop-info');
		}
		if(deptType=='000003'){
			localStorage.setItem('shopTag','1');
			$scope.shopInfoData = JSON.parse(localStorage.getItem('shopInfoData'));
			$scope.index =  $scope.shopInfoData.index;
			$scope.salemanList = [{'levelCode':$scope.DevelopInfo.levelCode,'deptCode':$scope.DevelopInfo.deptCode,'deptType':$scope.DevelopInfo.deptType,'deptName':'全部'}];
			$scope.salemanList = $scope.salemanList.concat($scope.shopInfoData.statsList);
			$scope.input.index = $scope.salemanList[$scope.index+1];
			$scope.input.select = $scope.salemanList[$scope.index+1];
			// console.log($scope.index+'==='+JSON.stringify($scope.salemanList));
			// console.log(JSON.stringify($scope.salemanList[$scope.index+1]));
			$scope.deptType=deptType;
			localStorage.setItem('DevelopInfo',JSON.stringify({
				'levelCode':levelCode,
				'deptCode':deptCode,
				'deptType':$scope.deptType,
				'salemanList':$scope.salemanList,
				'index':$scope.index,
				'userId':userId
			}));
			// $state.go('daili-org-saleman-shop-list',{levelCode:levelCode,deptCode:deptCode});
			$scope.queryDevelopInfo(levelCode,deptCode,'000004');
		}
	}

	//切换select选项
	// $scope.switchSelect = function(){
	// 	$scope.userId = $scope.input.select.userId;
	// 	if($scope.input.select.headImg){
	// 		$scope.imgUrl = $scope.input.select.headImg;
	// 	}else{
	// 		$scope.imgUrl = "img/logo.png";
	// 	}
	// 	$scope.deptName = $scope.input.select.deptName;
	// 	// console.log(JSON.stringify($scope.input.select) +'deptType'+$scope.input.select.deptType);
	// 	if($scope.input.select.deptName=='全部'){
	// 		$scope.isShowResertPwd = false;
	// 		if($scope.input.select.deptType == '000001'){
	// 			$scope.queryDevelopInfo($scope.input.select.levelCode,$scope.input.select.deptCode,'000003');
	// 		}else if($scope.input.select.deptType == '000002'){
	// 			$scope.queryDevelopInfo($scope.input.select.levelCode,$scope.input.select.deptCode,'000004');
	// 		}
	// 		// console.log($scope.input.select.deptType);
	// 	}else{
	// 		if($scope.input.select.deptType == '000002'){
	// 			localStorage.setItem('DevelopInfos',JSON.stringify({
	// 				'levelCode':$scope.input.select.levelCode,
	// 				'deptCode':$scope.input.select.deptCode,
	// 				'orgCode':$scope.input.select.orgCode,
	// 				'deptName':$scope.input.select.deptName,
	// 				'deptType':$scope.input.select.deptType,
	// 				'statsList':$scope.salemanList,
	// 				'index':null
	// 			}));
	// 			$scope.queryDevelopInfo($scope.input.select.levelCode,$scope.input.select.deptCode,'000003');
	// 		}
	// 		if($scope.input.select.deptType == '000003'){
	// 			localStorage.setItem('DevelopInfo',JSON.stringify({
	// 				'levelCode':$scope.input.select.levelCode,
	// 				'deptCode': $scope.input.select.deptCode,
	// 				'deptType':$scope.input.select.deptType,
	// 				'salemanList':$scope.salemanList,
	// 				'index':$scope.index,
	// 				'userId':$scope.input.select.userId	
	// 			}));
	// 			$scope.queryDevelopInfo($scope.input.select.levelCode,$scope.input.select.deptCode,'000004');
	// 		}
	// 	}
		
		
	// }
	$scope.tag = {
		current:$scope.DevelopInfo.levelCode
	};
	$scope.switchOption = function(userId,deptName,deptType,levelCode,deptCode,orgCode){
		$scope.tag.current = levelCode;
		$scope.userId = userId;
		$scope.deptName = deptName;
		$scope.deptType = deptType;
		$scope.levelCode = levelCode;
		$scope.deptCode = deptCode;
		$scope.orgCode = orgCode;
		// $scope.switchSelect(userId,deptName,deptType,levelCode,deptCode,orgCode);
	}
	$scope.switchSelect = function(userId,deptName,deptType,levelCode,deptCode,orgCode){
		$scope.isShowResertPwd = true;
		$scope.showSuperiorSelect = false;
		if($scope.deptName=='全部'){
			$scope.isShowResertPwd = false;
			if($scope.deptType == '000001'){
				$scope.queryDevelopInfo($scope.levelCode,$scope.deptCode,'000003');
			}else if($scope.deptType == '000002'){
				$scope.queryDevelopInfo($scope.levelCode,$scope.deptCode,'000004');
			}
			// console.log(deptType);
		}else{
			if($scope.deptType == '000002'){
				localStorage.setItem('DevelopInfos',JSON.stringify({
					'levelCode':$scope.levelCode,
					'deptCode':$scope.deptCode,
					'orgCode':$scope.orgCode,
					'deptName':$scope.deptName,
					'deptType':$scope.deptType,
					'statsList':$scope.salemanList,
					'index':null
				}));
				$scope.queryDevelopInfo($scope.levelCode,$scope.deptCode,'000003');
			}
			if($scope.deptType == '000003'){
				localStorage.setItem('DevelopInfo',JSON.stringify({
					'levelCode':$scope.levelCode,
					'deptCode':$scope. deptCode,
					'deptType':$scope.deptType,
					'salemanList':$scope.salemanList,
					'index':$scope.index,
					'userId':$scope.userId	
				}));
				$scope.queryDevelopInfo($scope.levelCode,$scope.deptCode,'000004');
			}
		}	
	}

	$scope.queryDevelopInfo=function(levelCode,deptCode,deptType){
		$http({
	         method:'get',
	         url:ajaxurl + 'appDept/queryDevelopInfo?token=' + $rootScope.token,
	         params:{
	         	'levelCode':levelCode
	         	,'deptCode':deptCode
	         	,'deptType':deptType
	         }
	     }).success(function(data){
			// console.log(JSON.stringify(data));
			if(deptType=='000004'){
				$scope.btnText='添加店铺';
			}
			$scope.statsList=data.statsList;
			$scope.shopNum=data.shopNum;
			$scope.totalOrderNumber=data.totalOrderNumber.reverse();
			$scope.totalOrderMoney=data.totalOrderMoney;
			$scope.totalOrderCnt=data.totalOrderCnt;
			$scope.xDate=data.xDate.reverse();
			$scope.user=data.user;
			 for(var i in $scope.statsList){
			 	if($scope.statsList[i].deptType == '000003'){
            		$scope.statsList[i].headImg = 'img/yewu.png';
            	}else if($scope.statsList[i].deptType == '000004'){
            		$scope.statsList[i].headImg = 'img/dianpu.png';
            	}
             }
			// $scope.xDate=JsonSortDown(data.xDate,'');
			if($scope.totalOrderMoney==null||$scope.totalOrderMoney==''){
				$scope.totalOrderMoney=0;
			}
			if($scope.totalOrderCnt==null||$scope.totalOrderCnt==''){
				$scope.totalOrderCnt=0;
			}
			$scope.chartFun($scope.xDate,$scope.totalOrderNumber);
			
		}).error(function () {
	        my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	            $state.go('index');
	        }); 
	    });
	}
	if($scope.DevelopInfo.deptType == '000002'){
		$scope.queryDevelopInfo($scope.DevelopInfo.levelCode,$scope.DevelopInfo.deptCode,'000003');
	}else if($scope.DevelopInfo.deptType == '000003'){
		$scope.queryDevelopInfo($scope.DevelopInfo.levelCode,$scope.DevelopInfo.deptCode,'000004');
	}

	if(localStorage.getItem('dianpuTag') == 'saleman'){
		$scope.btnText = '添加业务员';
		$scope.queryDevelopInfo($scope.DevelopInfo.levelCode,$scope.DevelopInfo.deptCode,'000003');
	}else if(localStorage.getItem('dianpuTag') == 'dianpu'){
		$scope.btnText = '添加店铺';
		$scope.queryDevelopInfo($scope.DevelopInfo.levelCode,$scope.DevelopInfo.deptCode,'000004');
	}

	if(localStorage.getItem('shopTag')!='2'){
		localStorage.setItem('shopTag','');
	}
	if(localStorage.getItem('shopTag')=='1'){
		$scope.shopInfoData = JSON.parse(localStorage.getItem('shopInfoData'));
		$scope.salemanList = [{'levelCode':$scope.shopInfoData.levelCode,'deptCode':$scope.shopInfoData.deptCode,'deptType':$scope.shopInfoData.deptType,'deptName':'全部'}];
		$scope.salemanList = $scope.salemanList.concat($scope.shopInfoData.statsList);
		$scope.queryDevelopInfo($scope.shopInfoData.levelCode,$scope.shopInfoData.deptCode,$scope.shopInfoData.deptType);
	}else if(localStorage.getItem('shopTag')=='2'){
		if(JSON.parse(localStorage.getItem('DevelopInfos')).shopManage=='1'){
			$scope.developInfoData = JSON.parse(localStorage.getItem('DevelopInfos'));
			$scope.salemanList = [{'levelCode':signInInfo.deptMap.levelCode,'deptCode':signInInfo.deptMap.deptCode,'deptType':signInInfo.deptMap.deptType,'deptName':'全部'}];
			$scope.salemanList = $scope.salemanList.concat($scope.DevelopInfo.statsList);
			$scope.index =  $scope.developInfoData.index;
			$scope.input.select =$scope.salemanList[$scope.index+1];
			// console.log($scope.index+'....'+JSON.stringify($scope.salemanList))
		}else{
			$scope.developInfoData = JSON.parse(localStorage.getItem('DevelopInfo'));
			$scope.salemanList = [{'levelCode':signInInfo.deptMap.levelCode,'deptCode':signInInfo.deptMap.deptCode,'deptType':signInInfo.deptMap.deptType,'deptName':'全部'}];
			$scope.salemanList = $scope.salemanList.concat($scope.DevelopInfo.statsList);
			$scope.input.select = $scope.developInfoData.index;
			// console.log($scope.index+'....'+JSON.stringify($scope.salemanList))
			if($scope.salemanList[$scope.index+1].userId!=null){
				$scope.userId = $scope.salemanList[$scope.index+1].userId;
			}
			if(localStorage.getItem('showResertPwd')){
				$scope.isShowResertPwd = true;
			}
				
		}
		localStorage.setItem('shopTag','');
		// console.log($scope.index+'....'+JSON.stringify($scope.salemanList))
			// }
	}else{
		$scope.userId = $scope.DevelopInfo.userId;
		$scope.salemanList = [{'levelCode':signInInfo.deptMap.levelCode,'deptCode':signInInfo.deptMap.deptCode,'deptType':signInInfo.deptMap.deptType,'deptName':'全部'}];
		$scope.salemanList = $scope.salemanList.concat($scope.DevelopInfo.statsList);
	}
	
	// console.log('==='+JSON.stringify($scope.salemanList));
	//重置密码
	$scope.resertPwd = function(){
		var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确认重置该用户密码？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					console.log("确定重置"+$scope.userId);
					$http({
						method:'get',
						url:ajaxurl+'userApp/setDefaultPwd?token=' + $rootScope.token,
						params:{userId:$scope.userId}
					}).success(function(data){
						   var alertPopup = $ionicPopup.alert({
					       title: '提示信息',
					       template: '新密码已重置为123456,请联系用户自行修改。'
					     });
					})
				}
			},
		   ]
		});
	}
    //获取统计图表信息
    $scope.chartFun=function(xDate,totalOrderNumber){
    	var chart = Highcharts.chart('container', {
			chart: {
					type: 'area',
					spacingBottom: 30
			},
			title: {
					text:'订单数量',
					align: "left",
					style:{
							color:'#66666',
							fontSize:'14px'
					}
			},
			subtitle: {
					text: '',
					floating: true,
					align: 'right',
					verticalAlign: 'bottom',
					y: 15
			},
			legend: {
					layout: 'vertical',
					align: 'left',
					verticalAlign: 'top',
					x: 150,
					y: 100,
					floating: true,
					borderWidth: 1,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
			},
			xAxis: {
					categories: xDate
			},
			yAxis: {
					title: {
							text: ''
					},
					labels: {
							formatter: function () {
									return this.value;
							}
					}
			},
			tooltip: {
					formatter: function () {
							return '<b>' + this.series.name + '</b><br/>' +
									this.x + ': ' + this.y;
					}
			},
			plotOptions: {
					area: {
							fillOpacity: 0.5
					}
			},
			credits: {
					enabled: false
			},
			series: [{
					name: $scope.deptName,
					data: totalOrderNumber
			}]
		});
  //   	$scope.chart = new Highcharts.Chart('container', {
		// 	chart: {
		// 		backgroundColor: 'rgba(0,0,0,0)'
		// 	},
		// 	title: {
		// 		text:'订单数量',
		// 		align: "left",
		// 		style:{
		// 			color:'#66666',
		// 			fontSize:'14px'
		// 		}
		// 	},
		// 	subtitle: {
		// 		text: null,
		// 		align: "left",
		// 		style:{
		// 			color:'#666666',
		// 		}
		// 	},
		// 	xAxis: {
		// 		lineColor: "#1E82D2",
		// 		tickColor:'#1E82D2',
		// 		categories:xDate,
		// 		labels: {
		// 			style: {
		// 				color: '#1E82D2',
		// 			}
		// 		},
		// 	},
		// 	yAxis: {
		// 		gridLineWidth:1,
		// 		gridLineColor:'#1E82D2',
		// 		title: {
		// 			text:null
		// 		},
		// 		plotLines: [{
		// 			value: 0,
		// 			width: 1,
		// 			color: '#1E82D2'
		// 		}],
		// 		labels: {
		// 			style: {
		// 				color: '#1E82D2',
		// 			}
		// 		},
		// 	},
		// 	credits: {
		// 		enabled: false
		// 	},
		// 	legend: {
		// 		enabled: false
		// 	},
		// 	series: [{
		// 		data: totalOrderNumber,
		// 		name:'数量',
		// 		color:'#1E82D2'
		// 	}]
		// });
    }

    //添加店铺
    $scope.addShopInfo=function(){
    	if($scope.DevelopInfo.deptType=='000003'){
    		$state.go('org-add-shop');
    	}else if($scope.DevelopInfo.deptType=='000002'){
    		if($scope.deptType=='000003'){
    			$state.go('org-add-shop');
    		}else{
    			$state.go('org-add-salesman');
    		}
    	}else{
    		$state.go('org-add-shop');
    	}

    	if(localStorage.getItem('dianpuTag') == 'saleman'){
			$scope.btnText = '添加业务员';
			$state.go('org-add-salesman');
			if(localStorage.getItem('shopTag') == '1'){
				$state.go('org-add-shop');
			}
		}else if(localStorage.getItem('dianpuTag') == 'dianpu'){
			$scope.btnText = '添加店铺';
			$state.go('org-add-shop');
		}
    }

    $scope.salemanOrderList=function(){
    	// localStorage.setItem('shopInfoData',JSON.stringify({
    	// 	levelCode:JSON.parse(localStorage.getItem('DevelopInfo')).levelCode,
    	// 	deptCode:JSON.parse(localStorage.getItem('DevelopInfo')).deptCode,
    	// 	saleOrderList:1
    	// }));
    	if(localStorage.getItem('shopTag') == ''){
    		localStorage.setItem('orgOrder',JSON.stringify({
	    		levelCode:JSON.parse(localStorage.getItem('DevelopInfos')).levelCode,
	    		getFun:'getNumData'
	    	}));
    	}
    	if(localStorage.getItem('shopTag') == 1){
    		localStorage.setItem('orgOrder',JSON.stringify({
	    		levelCode:JSON.parse(localStorage.getItem('shopInfoData')).levelCode,
	    		getFun:'getNumData'
	    	}));
    	}
    	$state.go('org-number-order-list');
    }
    //展示上级选项
    $scope.superiorSelect = function(){
    	$scope.isNoShowHeader = true;
    	$scope.showSuperiorSelect = true;
    }
    $scope.closeSuperiorSelect = function(){
    	$scope.isNoShowHeader = false;
    	$scope.showSuperiorSelect = false;
    }

	
});