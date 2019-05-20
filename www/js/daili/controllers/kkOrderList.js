appControllers.controller('kk-order-list', function($scope,$http,$state,my,$rootScope,$ionicLoading,$ionicPopup,$filter,$timeout,$stateParams) {
	$scope.title = '开卡订单';
	// $scope.orgCode =signInInfo.userInfo.orgCode;
	$scope.orderList = [];
	$scope.input= {phonenumber:''};
	$scope.pageIndex = 1;
	$scope.pageSize = 10;
	$scope.status = '';
	$scope.isNoShowReviewSalesman=false;
	$scope.isNoShowHeader=true;
	$scope.deptName="渠道";
	$scope.levelCode=signInInfo.deptInfo.levelCode;
	$scope.salemanLevelCode='';
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	//获取当日订单(首页点击入口)
	STARTTIME = $stateParams.startTime;
	ENDTIME = $stateParams.endTime;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.status = $stateParams.status;
	// $scope.usermap=[{"deptName":"全部","userId":""}];
	// $scope.usermap=$scope.usermap.concat(signInInfo.deptMap);
	// console.log('$scope.usermap=='+JSON.stringify($scope.usermap));
	// for( var i in $scope.usermap){
	// 	$scope.usermap[i].num=i;
	// };
	$scope.allStatusArray=[{"name":"全部","status":[]},{"name":"已完成","status":['000003']},
						{"name":"未完成","status":['000007','000001','000002','000005']},
						{"name":"补照片","status":['000100']}];
	$scope.statusArray=$scope.allStatusArray[1].status;
	$scope.userId=localStorage.getItem('userId');
	// 头部导航
	$scope.tag = {
		current: "2"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			$scope.statusArray=$scope.allStatusArray[param-1].status;
			switch($scope.tag.current ){
				case 1:
					$scope.usermap=[{"deptName":"全部","userId":""}];
					$scope.usermap=$scope.usermap.concat(signInInfo.deptMap.depts);
					for( var i in $scope.usermap){
						$scope.usermap[i].num=i;
					};
					// $scope.depts=[{"deptName":"全部","userId":""}];
					// $scope.depts=$scope.depts.concat($scope.usermap[1].depts);
					// for(var i in $scope.depts){
					// 	$scope.depts[i].num=i;
					// }

					$scope.isNoShowReviewSalesman = !$scope.isNoShowReviewSalesman;
					break;
				default:
					$scope.isNoShowReviewSalesman=false;
					$scope.orderList = [];
					$scope.pageIndex = 1;
					getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),$scope.statusArray,$scope.levelCode);
			}
		},
		setCurrent1:function(param){
			$scope.tag.current1 = param;
			console.log(param)
			switch($scope.tag.current1){
				case 1:
					$scope.dateSearch();
					break;
				case 2:
					$scope.telSearch();
					break;
				case 3:
					$scope.nameSearch();
					break;
			}
		}
	}
	//初始化列表
	// console.log("time=="+STARTTIME +"=="+ENDTIME);
	getOrderList(
		$scope.pageIndex,
		$scope.pageSize,
		STARTTIME,
		ENDTIME,
		$scope.input.phonenumber.replace(/[^\d]/g, ""),
		$scope.statusArray,
		$scope.levelCode
	);
	// 全部:查看所有业务员
	$scope.tag1 = {
		current: "0"
	};
	$scope.actions1 = {
		setCurrent: function (param,levelCode) {
			$scope.salemanLevelCode=levelCode;
			$scope.tag1.current = param;
			$scope.tag2.current = -1;
			if(param=="0"){
				$scope.levelCode=signInInfo.deptInfo.levelCode;
				$scope.isNoShowReviewSalesman=false;
				$scope.depts=[];
				$scope.deptName='全部';
				$scope.orderList = [];
				getOrderList(
					$scope.pageIndex,
					$scope.pageSize,
					STARTTIME,
					ENDTIME,
					$scope.input.phonenumber.replace(/[^\d]/g, ""),
					$scope.statusArray,
					$scope.levelCode
				);
			}else{
				$scope.depts=[{"deptName":"全部","userId":""}];
				$scope.depts=$scope.depts.concat($scope.usermap[param].depts);
			}
			
			// console.log(JSON.stringify($scope.depts));
			for(var i in $scope.depts){
				$scope.depts[i].num=i;
			}
			// if(param=="0"){
			// 	$scope.deptName=$scope.usermap[0].deptName;
			// 	$scope.pageIndex = 1;
			// 	$scope.orderList = [];
			// 	$scope.depts =[];
			// 	getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),$scope.statusArray,$scope.levelCode);
			// 	$scope.isNoShowReviewSalesman=false;
			// }else{
			// 	$scope.depts=$scope.usermap[param].depts;
			// 	for(var i in $scope.depts){
			// 		$scope.depts[i].num=i;
			// 	}
			// 	//console.log($scope.shopList);
			// }
		}
	}

	//选择店铺
	$scope.tag2={
		current :"-1"
	};
	$scope.actions2 ={
		setCurrent:function(param,levelCode){
			$scope.tag2.current = param;
			if($scope.depts[param].deptName.length>=8){
				$scope.deptName=$scope.depts[param].deptName.split('-')[0];
			}else{
				$scope.deptName=$scope.depts[param].deptName;
			}
			$scope.userId=$scope.depts[param].userId;
			$scope.levelCode=levelCode;	
			if(param==0){
				$scope.levelCode=$scope.salemanLevelCode;
				if($scope.tag1.current==0){
					for(var i=0 in $scope.usermap){
						$scope.levelCode = $scope.usermap[0].levelCode;
					}
				}
			}

			// console.log($scope.levelCode);
			//console.log("$scope.userId  "+ $scope.userId);			
			$scope.pageIndex = 1;
			$scope.orderList = [];
			getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),$scope.statusArray,$scope.levelCode);
		}
	}
	// 关闭业务员
	$scope.closereviewSalesman=function(){
		$scope.isNoShowReviewSalesman=false;
	}
	//查询
	$scope.toggleSearchPanel = function() {
		STARTTIME = '';
		ENDTIME = '';
		getOrderList(
			$scope.pageIndex,
			$scope.pageSize,
			STARTTIME,
			ENDTIME,
			$scope.input.phonenumber.replace(/[^\d]/g, ""),
			$scope.statusArray,
			$scope.levelCode
		);
        // $scope.searchPanel = !$scope.searchPanel;
        // $scope.mask = !$scope.mask;
        // $scope.isNoShowHeader=!$scope.isNoShowHeader;
    };
	
	//点击遮罩取消弹出面板
    $scope.cancelMask = function(){
    	$scope.searchPanel = false;
    	$scope.mask = false;
    	$scope.isNoShowHeader=true;
    };
	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	getOrderList($scope.pageIndex,$scope.pageSize,STARTTIME,ENDTIME,$scope.input.phonenumber.replace(/[^\d]/g, ""),$scope.statusArray,$scope.levelCode);
    };
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	};
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	};
	
	//日期查询
	$scope.dateSearch = function(){
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.isNoShowHeader=true;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">开始日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="startTime" ng-change="setStartTime(startTime)"/>'+
								'</div>'+
							'</li>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">结束日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="endTime" ng-change="setEndTime(endTime)"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		
		$ionicPopup.show({
			 template: temp,
			 title: '日期查询',
			 subTitle: '输入开始日期与结束日期',
			 scope: $scope,
			 buttons: [
			   { text: '取消' },
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if(STARTTIME == '' || ENDTIME == ''){
					   my.alert('请输入开始日期结束日期');
				   }else if(STARTTIME > ENDTIME){
					   my.alert('对不起，开始日期不能大于结束日期！');
				   }else if(STARTTIME == TODAY && STARTTIME == ENDTIME){
					   ENDTIME = GetDateStr(1);
				   }else if(ENDTIME > TODAY){
					   my.alert('对不起，结束日期不能大于当前日期！');
				   }else{
					   //console.log(ENDTIME);
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   getOrderList(
						   $scope.pageIndex,
						   $scope.pageSize,
						   STARTTIME,
						   ENDTIME,
						   $scope.input.phonenumber.replace(/[^\d]/g, ""),
						   $scope.statusArray,
						   $scope.levelCode
					   );
				   }
				 }
			   }
			 ]
		});
	};
		
	//号码查询
	$scope.telSearch = function(){
		$scope.isNoShowHeader=true;
		$scope.searchPanel = false;
		$scope.mask = false;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="tel" class="textBox" ng-model="input.phonenumber" ng-keyup="telChange()" placeholder="输入11位手机号码"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '手机号码查询',
			 subTitle: '输入订购的手机号码查询',
			 scope: $scope,
			 buttons: [
			   { 
			   		text: '取消' ,
			   		onTap: function() {
					 	$scope.input.phonenumber = '';
					 }
				},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.input.phonenumber == '' || $scope.input.phonenumber.length < 13){
					   my.alert('请正确输入手机号码').then(function(){
					   		$scope.input.phonenumber = '';
					   });
				   }else{
					   //console.log("手机号码："+$scope.input.phonenumber);
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   getOrderList(
						   $scope.pageIndex,
						   $scope.pageSize,
						   STARTTIME,
						   ENDTIME,
						   $scope.input.phonenumber.replace(/[^\d]/g, ""),
						   $scope.statusArray,
						   $scope.levelCode
					   );
				   }
				 }
			   },
			 ]
		});
	};
	//号码输入格式
	$scope.telChange = function(){
		$scope.input.phonenumber = telFormat($scope.input.phonenumber);
	};
	//客户姓名 查询
	$scope.nameSearch = function(){
		$scope.isNoShowHeader=true;
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.searchBox=true;
		$scope.readMore=true;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="text" class="textBox" ng-model="input.userName" placeholder="请输入客户姓名"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '客户姓名查询',
			 subTitle: '输入客户姓名查询',
			 scope: $scope,
			 buttons: [
			   { 
			   		text: '取消',
			   		onTap: function() {
					 	$scope.input.userName = '';
					 }
			   	},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.input.userName == ''){
					   my.alert('请正确的客户姓名');
				   }else{
					  // console.log("手机号码："+$scope.input.phonenumber);
					   $scope.pageIndex = 1;
					   userNameSearch();
				   }
				 }
			   },
			 ]
		});
	}
	//通过客户姓名查询
	function userNameSearch(){
		if($scope.input.userName == ''){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请正确输入客户姓名',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		    $scope.input.userName = '';
		}else{
			//console.log($scope.input.phonenumber.length);
			$scope.loading = true;
			$scope.orderList = [];
			$http({
				method:'GET',
				url:ajaxurl + 'numberOrderApp/queryUserNumberOrderList?token=' + $rootScope.token,
				params:{keywords:$scope.input.userName,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.input.userName = '';
				$scope.readMore = false;
				$scope.loading = false;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				//console.log("$scope.orderList=="+$scope.orderList);
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],'',$scope.input.userName)
				};
			}).error(function(){
			
			});
		}
	}
	//获取订单信息
	function getOrderList(pageIndex,pageSize,startTime,endTime,number,statusArray,levelCode){
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.loading = true;
		$scope.noMore = false;
		$http({
			method:'GET',
			url:ajaxurl + 'numberOrderApp/queryUserNumberOrderList?token=' + $rootScope.token,
			params:{
				pageIndex:pageIndex,
				pageSize:pageSize,
				startTime:startTime,
				endTime:endTime,
				number:number,
				statusArray:statusArray,
				levelCode:levelCode
			},
			timeout: 10000
		}).success(function(data){
			// $ionicLoading.hide();
			$scope.loading = false;
			$scope.orderList = $scope.orderList.concat(data.orderList);
			$scope.input.phonenumber = '';
			//console.log("$scope.orderList=="+JSON.stringify($scope.orderList));
			for(i in $scope.orderList){
				if($scope.orderList[i].isCbss=="000002"){
					if($scope.orderList[i].source == '000028'){
						$scope.orderList[i].isCbss ="2i";
					}else{
						$scope.orderList[i].isCbss ="BSS";
					}
				}else if($scope.orderList[i].isCbss=="000001"){
					$scope.orderList[i].isCbss ="CBSS";
				}
			}
			//如果小于pageSize禁止上拉加载
			if(eval(data.orderList).length < data.page.pageSize){
				$scope.hasmore = false;
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
			
		}).error(function () { 
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            });
		}).finally(function () { 
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}
	//查看订单详情
	$scope.orderDetail = function(index){
		localStorage.setItem('orderCode',$scope.orderList[index].orderCode);
		$scope.source=$scope.orderList[index].source;
		$scope.number=$scope.orderList[index].number;
		$scope.numOrderCode=$scope.orderList[index].orderCode;
		// console.log('1111==='+$scope.numOrderCode);
		localStorage.setItem('source',$scope.source);
		//$state.go('kk-order-detail');
		if($scope.source=="000020"){
			//console.log($scope.source);
			//$state.go("kdOrderDetail",{number:order["number"]});
			$state.go('kd-order-detail',{number:$scope.number,numOrderCode:$scope.numOrderCode});
		}else{
			$state.go('kk-order-detail');
		}
	};
});