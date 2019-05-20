appControllers.controller('numberOrderList', function($scope,$http,$state,$rootScope,$timeout,$ionicLoading,$filter,$ionicPopup,my) {
	$scope.title = '号码订单列表';
	$scope.infoState = '加载更多';
	$scope.loading = false;
	$scope.searchBox = true;
	$scope.readMore = true;
	$scope.noMoreTips = true;
	$scope.mask = false;
	$scope.noscroll = false;
	$scope.orderList = [];
	$scope.pageIndex = 1;
	$scope.pageSize = '';
	$scope.pageCount = '';
	$scope.button='';
	$scope.input = {
		'phonenumber':'',
		'cardId':''
	};
	var STARTTIME;
	var ENDTIME;
	var TODAY;
	TODAY = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.levelCode=deptInfo.levelCode;
	// console.log($scope.levelCode);
	//页面初始化
	getData([]);
	function getData(statusArray){
		$scope.loading = false;
		$scope.orderList = [];
		$scope.readMore = true;
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.noMoreTips = true;
		$http({
		method:'GET',
		url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
		params:{statusArray:statusArray,levelCode:$scope.levelCode},
		timeout: 10000
	}).success(function(data){
		//console.log("nnnnnn="+JSON.stringify(data));
		//console.log(data['page'].pageIndex);
		// $ionicLoading.hide();
		$scope.readMore = false;
		$scope.loading = true;
		$scope.orderList = data['orderList'];
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
		$scope.pageSize = 5;
		$scope.pageCount = data.page['pageCount'];
		loadingState(data);
		$scope.loadMoreData = function(){
			loadMore('','',$scope.pageCount,$scope.pageSize,statusArray)
		};
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index');
	            }); 
        });
	}
	
	//设置开始日期
	$scope.setStartTime = function(e){
		STARTTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//设置结束日期
	$scope.setEndTime = function(e){
		ENDTIME = $filter('date')(e,'yyyy-MM-dd');
	}
	//加载更多
	function loadMore(startTime,endTime,pageCount,pageSize,statusArray,number,keywords){
		if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
			$scope.readMore=true;
			$scope.loading = false;
			$scope.pageIndex++;
			//console.log($scope.pageIndex);
			$http({
				method:'GET',
				url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
				params:{startTime:startTime,endTime:endTime,pageIndex:$scope.pageIndex,statusArray:statusArray,number:number,keywords:keywords,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.readMore = false;
				$scope.loading = true;
				$scope.mask = false;
				$scope.noscroll = false;
				loadingState(data);
				$scope.orderList = $scope.orderList.concat(data['orderList']);
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
			}).error(function(){
			
			});
		}else{
			$scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
		}
	}
	//按日期查询订单
	function queryOrder(){
		$scope.pageIndex = 1;
		$scope.loading=false;
		$scope.readMore=true;
		//console.log(STARTTIME);
		//console.log(ENDTIME);
		// $ionicLoading.show({template: '数据加载中...'});
		if(STARTTIME == undefined || ENDTIME == undefined){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请选择起始日期与结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
			$scope.searchBox = false;
		}else if(STARTTIME > ENDTIME){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '起始日期不得大于结束日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
		}else if(ENDTIME > TODAY){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '结束日期不得大于当前日期',
		       okText:'我知道了',
		       okType:'button-default'
		     });
			// $ionicLoading.hide();
		}else{
			$http({
				method:'GET',
				url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
				params:{startTime:STARTTIME,endTime:ENDTIME,pageIndex:$scope.pageIndex,levelCode:$scope.levelCode}
			}).success(function(data){
				$scope.searchBox = true;
				// $ionicLoading.hide();
				$scope.readMore=false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.mask = false;
				$scope.noscroll = false;
				$scope.orderList = data['orderList'];
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
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore(STARTTIME,ENDTIME,data.page['pageCount'],data.page['pageSize'])
				};
			}).error(function () {
	            
	        });
		}
	}
	
	//重置
	$scope.toggleSearchPanel = function() {
		getData([]);
        // $scope.searchPanel = !$scope.searchPanel;
        // $scope.mask = !$scope.mask;
        // $scope.isNoShowHeader=!$scope.isNoShowHeader;
        //$scope.searchBox=false;

    };
    //日期查询
	$scope.dateSearch = function(){
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.isNoShowHeader=true;
		$scope.searchBox=true;
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
									'<input type="date" class="textBox abs" style="top:.1rem;" min="2016-01-01" ng-model="endTime" ng-change="setEndTime(endTime)"/>'+
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
					  // console.log(ENDTIME);
					   $scope.orderList = [];
					   $scope.pageIndex = 1;
					   queryOrder();
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
		$scope.searchBox=true;
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
				 	// console.log("手机号码："+$scope.input.phonenumber);
				   if($scope.input.phonenumber == ''){
					   my.alert('请正确输入手机号码');
				   }else{
					   $scope.pageIndex = 1;
					   searchOrder();
				   }
				 }
			   },
			 ]
		});
	};
	//身份证查询
	$scope.cardIdSearch =  function(){
		$scope.isNoShowHeader=true;
		$scope.searchPanel = false;
		$scope.mask = false;
		$scope.searchBox=true;
		$scope.loading = false;
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="labelForm">'+
									'<input type="tel" class="textBox" ng-model="input.cardId"  placeholder="输入客户姓名"/>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>';
		$ionicPopup.show({
			 template: temp,
			 title: '客户姓名查询',
			 subTitle: '输入姓名查询',
			 scope: $scope,
			 buttons: [
			   { 
			   		text: '取消',
			   		onTap: function() {
					 	$scope.input.cardId = '';
					 }
			   	},
			   {
				 text: '<b>查询</b>',
				 type: 'button-calm',
				 onTap: function() {
				   if($scope.input.cardId == ''){
					   my.alert('请正确输入要查找的姓名');
				   }else{
					  // console.log("手机号码："+$scope.input.phonenumber);
					   $scope.pageIndex = 1;
					   cardId();
				   }
				 }
			   },
			 ]
		});
	}
	//号码输入格式
	$scope.telChange = function(){
		$scope.input.phonenumber = telFormat($scope.input.phonenumber);
	};
    //点击遮罩取消日期查询
    $scope.cancelDateSearch = function(){
    	$scope.searchBox = true;
    	$scope.mask = false;
    	$scope.noscroll = false;
    }
    
    //查看订单详情
	$scope.numberOrderDetail = function() {
		order["orderCode"] = arguments[0];
		order["source"] = arguments[1];
		order["number"] = arguments[2];
		order["numOrderCode"] = arguments[3];
		//console.log(order["source"]);
		//$state.go("numberOrderDetail");
		if(order["source"]=="000020"){
			//console.log(order["source"]);
			$state.go("kdOrderDetail",{number:order["number"],numOrderCode:order["numOrderCode"]});
		}else if(order["source"]=="000025"){
			order["numberOrderCode"] = arguments[0];
			$state.go("fixPhoneDetail");
		}else{
			$state.go("numberOrderDetail");
		}
	}
	//通过号码进行检索
	function searchOrder(){
		if($scope.input.phonenumber == '' || $scope.input.phonenumber.length < 13){
			my.alert('请正确输入您所订购的手机号码').then(function(){
				$scope.input.phonenumber = '';
			});
		}else{
			$scope.loading = false;
			$scope.readMore=true;
			$scope.orderList = [];
			$http({
				method:'get',
				url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
				params:{number:$scope.input.phonenumber.replace(/[^\d]/g, ""),levelCode:$scope.levelCode}
			}).success(function(data){
				//console.log(data.page['pageSize']);
				//console.log(JSON.stringify(data));
				$scope.readMore = false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
				$scope.input.phonenumber = '';
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
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],$scope.input.phonenumber.replace(/[^\d]/g, ""))
				};
			}).error(function(){
			
			});
		}
	}
	//通过身份证号进行检索
	function cardId(){
		if($scope.input.cardId == ''){
			$ionicPopup.alert({
		       title: '系统提示',
		       template: '请输入要查找的客户姓名',
		       okText:'我知道了',
		       okType:'button-calm'
		    });
		    $scope.input.cardId = '';
		}else{
			$scope.orderList = [];
			$scope.readMore=true;
			$http({
				method:'get',
				url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
				params:{keywords:$scope.input.cardId,levelCode:$scope.levelCode}
			}).success(function(data){
				//console.log(data.page['pageSize']);
				//console.log(JSON.stringify(data));
				$scope.input.cardId = '';
				$scope.readMore = false;
				$scope.loading = true;
				$scope.showList = false;
				$scope.orderList = data['orderList'];
				$scope.pageSize = data.page['pageSize'];
				$scope.pageCount = data.page['pageCount'];
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
				loadingState(data);
				$scope.loadMoreData = function(){
					loadMore('','',$scope.pageCount,$scope.pageSize,[],'',$scope.input.cardId)
				};
			}).error(function(){
			
			});
		}
	}
	//判断加载与否状态
	function loadingState(data){
		if(data.orderList.length < data.page.pageSize){
            $scope.infoState = '没有更多了';
			$scope.readMore = true;
			$scope.noMoreTips = false;
            }else{
                $timeout(function () {
                   $scope.infoState = '加载更多';
                }, 1 * 1000);
            }
	}
	

	//切换效果
	$scope.tag = {
		current: "1",
		current1: ""
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			switch($scope.tag.current){
				case 1:
					getData([]);
					break;
				case 2:
					getData(['000003']);
					break;
				case 3:
					getData(['000001','000002','000004','000005','000007']);
					break;
				case 4:
					getData(['000007'])
					break;
			}
		},
		setCurrent1: function (param) {
			$scope.tag.current1 = param;
			switch($scope.tag.current1){
				case 1:
					$scope.dateSearch();
					break;
				case 2:
					$scope.telSearch();
					break;
				case 3:
					$scope.cardIdSearch();
					break;
			}
		}
	};
})