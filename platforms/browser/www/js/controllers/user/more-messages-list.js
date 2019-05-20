appControllers.controller('moreMessagesList', function($scope,$rootScope,$state,$http,$ionicPopup,$ionicLoading,my) {
	$scope.title = '消息中心列表';
	$scope.noticeList=[];
	$scope.noMore=false;
	$scope.loading=false;
	//console.log("1111");
	/*$scope.allData=[];
	$scope.allDataSortDownByTime=[];
	$scope.allDataSortDownByType=[];
	$scope.allDataByPthoto=[];
	$scope.allDataByWxNum=[];
	$scope.allDataByWxLanNum=[];
	$rootScope.noTabRedPoint=true;
	$rootScope.isTabRedPoint=false;
	$scope.allDataSortDownByTime=JSON.parse(localStorage.getItem("messageData")).data;
	for(var i in $scope.allDataSortDownByTime){
		if($scope.allDataSortDownByTime[i].type=='照片审核'){
			localStorage.setItem("dataByPthoto",JSON.stringify($scope.allDataSortDownByTime[i]));
			$scope.dataByPthoto=JSON.parse(localStorage.getItem("dataByPthoto"));
			$scope.allDataByPthoto=$scope.allDataByPthoto.concat($scope.dataByPthoto);
			//console.log($scope.allDataByPthoto);
		}
		if($scope.allDataSortDownByTime[i].type=='微信号码订单'){
			localStorage.setItem("dataByWxNum",JSON.stringify($scope.allDataSortDownByTime[i]));
			$scope.dataByWxNum=JSON.parse(localStorage.getItem("dataByWxNum"));
			$scope.allDataByWxNum=$scope.allDataByWxNum.concat($scope.dataByWxNum);
			//console.log($scope.allDataByWxNum);
		}
		if($scope.allDataSortDownByTime[i].type=='微信宽带订单'){
			localStorage.setItem("dataByWxLanNum",JSON.stringify($scope.allDataSortDownByTime[i]));
			$scope.dataByWxLanNum=JSON.parse(localStorage.getItem("dataByWxLanNum"));
			$scope.allDataByWxLanNum=$scope.allDataByWxLanNum.concat($scope.dataByWxLanNum);
			//console.log($scope.allDataByWxLanNum);
		}
	}
	$scope.allDataSortDownByType=$scope.allDataSortDownByTime;
	//console.log($scope.allDataSortDownByTime);
	localStorage.setItem("allDataSortDownByTimeLength",$scope.allDataSortDownByTime.length);*/
	$scope.getInformationList = function (type){
		$scope.noMore=false;
		$scope.loading=false;
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.noticeList=[];
			$http({
			method:'get',
			url:ajaxurl + 'userApp/queryUserMessageCenter?token=' + $rootScope.token,
			params:{type:type},
			timeout: 5000
		}).success(function(data){
			$scope.loading=true;
			// $ionicLoading.hide();
			//console.log("0000==="+JSON.stringify(data));
			$scope.msgList=data.msgList;
			//console.log("1111="+JSON.stringify($scope.msgList));
			if($scope.msgList.length<=0){
				$scope.noMore=true;
			}else{
				for(var i in $scope.msgList){
					if($scope.msgList.length >= 1){
						//console.log($scope.msgList[i].type);
						if($scope.msgList[i].type=='000001'||$scope.msgList[i].type=='000002'||$scope.msgList[i].type=='000003'){
							//console.log($scope.msgList[i]);
							$scope.noticeList.push({
								'id':$scope.msgList[i].id,
								'orderCode':$scope.msgList[i].orderCode,
								'showTag':$scope.msgList[i].userId,
								'message':$scope.msgList[i].message,
								'updateTime':$scope.msgList[i].updateTime,
								'type':$scope.msgList[i].type,
								'imgUrl':'img/xtxx.png',
								'textType':'系统消息',
								'messagesArr1':$scope.msgList[i].message
						    });
						}
						if($scope.msgList[i].type=='000004'){
							//console.log($scope.msgList[i]);
							$scope.message=$scope.msgList[i].message;
						    $scope.messagesSplitArr=$scope.message.split("号码");
						    //console.log($scope.messagesSplitArr);
						    $scope.haomaText='号码';
						    $scope.haomaColor=true;
						    $scope.lanColor=false;
							$scope.noticeList.push({
								'id':$scope.msgList[i].id,
								'orderCode':$scope.msgList[i].orderCode,
								'showTag':$scope.msgList[i].userId,
								'message':$scope.msgList[i].message,
								'updateTime':$scope.msgList[i].updateTime,
								'type':$scope.msgList[i].type,
								'imgUrl':'img/wxdd.png',
								'textType':'微信号码订单',
								'haomaText':$scope.haomaText,
								'messagesArr0':$scope.messagesSplitArr[0],
								'messagesArr1':$scope.messagesSplitArr[1],
								'haomaColor':$scope.haomaColor,
								'lanColor':$scope.lanColor
						    });
						}
						if($scope.msgList[i].type=='000005'){
							//console.log($scope.msgList[i]);
							$scope.message=$scope.msgList[i].message;
						    $scope.messagesSplitArr=$scope.message.split("宽带");
							$scope.haomaText='宽带';
						    $scope.haomaColor=false;
						    $scope.lanColor=true;
							$scope.noticeList.push({
								'id':$scope.msgList[i].id,
								'orderCode':$scope.msgList[i].orderCode,
								'showTag':$scope.msgList[i].userId,
								'message':$scope.msgList[i].message,
								'updateTime':$scope.msgList[i].updateTime,
								'type':$scope.msgList[i].type,
								'imgUrl':'img/wxdd.png',
								'textType':'微信宽带订单',
								'haomaText':$scope.haomaText,
								'messagesArr0':$scope.messagesSplitArr[0],
								'messagesArr1':$scope.messagesSplitArr[1],
								'haomaColor':$scope.haomaColor,
								'lanColor':$scope.lanColor
						    });
						}
						if($scope.msgList[i].type=='000006'){
							//console.log($scope.msgList[i]);
							$scope.noticeList.push({
								'id':$scope.msgList[i].id,
								'orderCode':$scope.msgList[i].orderCode,
								'showTag':$scope.msgList[i].userId,
								'messagesArr1':$scope.msgList[i].message,
								'updateTime':$scope.msgList[i].updateTime,
								'type':$scope.msgList[i].type,
								'imgUrl':'img/zpbl.png',
								'textType':'照片审核'
						    });
						}
					}
				}
			}
			
			//console.log($scope.noticeList);
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index');
            }); 
		});
		}
		$scope.getInformationList();
	//切换效果
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			switch($scope.tag.current){
				case 1:
					$scope.getInformationList('000000');
					break;
				/*case 2:
					$scope.getInformationList('000000');
					break;*/
				case 2:
					$scope.getInformationList('000004');
					break;
				case 3:
					$scope.getInformationList('000005');
					break;
				case 4:
					$scope.getInformationList('000006');
					break;
			}
			/*if($scope.allDataSortDownByType.length<=0){
				$scope.noMore=true;
			}else{
				$scope.noMore=false;
			}*/
		}
	};
	//点击叉号隐藏
	/*$scope.cancel=function(id,showTag,index){
			 localStorage.setItem("showTag","000002");
			 $scope.allDataSortDownByTime[index].showTag = "000002";
			 //console.log(localStorage.getItem("showTag"));
			 //console.log($scope.allDataSortDownByTime);
		
	}*/
	//删除列表信息
	$scope.deleteList=function(index){
		$scope.id=$scope.noticeList[index].id;
		//console.log($scope.id);
		var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确定删除该条信息？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					//console.log("确定删除");
					//$scope.noticeList[index].type='000010';
					$http({
						method:'GET',
						url:ajaxurl + '/userApp/delMessage?token=' + $rootScope.token,
						params:{msgId:$scope.id}
					}).success(function(data){
						//console.log(data);
						$scope.noticeList[index].type='000010';
						//console.log($scope.noticeList[index].type);
					});
				}
			},
		   ]
		});
	}
	//查看订单详情
	$scope.numberOrderDetail = function(orderCode,type,index) {
		order["orderCode"] = arguments[0];
		//console.log(arguments[1]);
		if(arguments[1]=='000001'){
			order["orderCode"] = arguments[0];
			$state.go("numberOrderDetail");
		}else if(arguments[1]=='000002'){
			order["orderCode"] = arguments[0];
			$state.go("kdOrderDetail");
		}else if(arguments[1]=='000006'){
			order["orderCode"] = arguments[0];
			$state.go("numberOrderDetail");
		}else if(arguments[1]=='000004'){
			order["orderCode"] = arguments[0];
			$state.go("dianpu-wx-order-detail");
		}else if(arguments[1]=='000005'){
			order["orderCode"] = arguments[0];
			console.log(arguments[0]);
			$state.go("dianpu-wx-lan-order-detail");
		}else if(arguments[1]=='000003'){
			order["orderCode"] = arguments[0];
			$state.go("fixPhoneDetail");
		}
	}
})