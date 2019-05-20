appControllers.controller('daili-avatar-check', function($scope,$http,$rootScope,$ionicLoading,my,$ionicPopup,$filter,$state) {
	$scope.title = '';
	$scope.siIndex = 0;
	$scope.ssss = 0;
	$scope.orderList = [];
	$scope.isNoShowLoading =false;
	$scope.isNoShowHeader=false;
	$scope.isNoShowOrderInfo=false;
	$scope.isNoShowHistory=false;
	$scope.isNoShowChosePop=false;
	$scope.isNoShowReviewState=false;
	$scope.isNoShowReviewSalesman=false;
	$scope.isNoShowReviewSource=false;
	$scope.isNoShowReviewPop=false;
	$scope.isNoShowReviewBtnPop=false;
	$scope.isNoShowImgUp=true;
	$scope.isNoShowImgDown=true;
	$scope.isNoShowBuPic=false;
	$scope.isNoShowQuestion=false;
	//console.log("get showDetailValue==="+localStorage.getItem("showDetailValue"));
	$scope.showDetailValue=localStorage.getItem("showDetailValue");
	$scope.isNoShowDetail=localStorage.getItem("showDetailValue");
	//console.log("$scope.showDetailValue+$scope.isNoShowDetail=="+$scope.showDetailValue+"+"+$scope.isNoShowDetail);
	$scope.deptName="渠道";
	$scope.levelCode=signInInfo.deptInfo.levelCode;
	$scope.checkName='审核';
	$scope.sourceName='来源';
	$scope.salemanLevelCode='';
	// $scope.userType=signInInfo.userType;
	//店铺列表
	// $scope.usermap=[{"deptName":"全部","userId":""}];
	// $scope.usermap=$scope.usermap.concat(signInInfo.deptMap);
	// // console.log('$scope.usermap=='+$scope.usermap);
	// for( var i in $scope.usermap){
	// 	$scope.usermap[i].num=i;
	// };
	//审核列表
	$scope.stateList=[{"name":"全部","num":"0","verifyStatus":""},{"name":"查看","num":"1","verifyStatus":1},
					  {"name":"未查看","num":"2","verifyStatus":0},{"name":"不合格","num":"3","verifyStatus":3},
					  {"name":"一审合格","num":"4","verifyStatus":2},{"name":"二审合格","num":"5","verifyStatus":4}];
	//来源列表
	$scope.soureList=[{"name":"全部","num":"0","isCbss":""},{"name":"BSS","num":"1","isCbss":"000002"},{"name":"CBSS","num":"2","isCbss":"000001"}];
	//不合格列表
	$scope.questionList=[{"name":"无照片","num":"0","unpassCode":1},{"name":"不清楚","num":"1","unpassCode":2},
					   {"name":"非认证合一","num":"2","unpassCode":3},{"name":"翻拍","num":"3","unpassCode":4}];
	//初始化所有参数
	$scope.pageIndex = 1;
	$scope.pageSize = 6;
	$scope.getStartTime=GetDateStr(-6);
	$scope.getEndTime=GetDateStr(0);
	$scope.verifyStatus='';
	$scope.isCbss='';
	$scope.keywords='';
	$scope.unpassCode=0;
	$scope.userId='';
	//初始加载
	getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
	//导航切换
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			if($scope.tag.current == '1'){
				$scope.usermap=[{"deptName":"全部","userId":""}];
				$scope.usermap=$scope.usermap.concat(signInInfo.deptMap.depts);
				for( var i in $scope.usermap){
					$scope.usermap[i].num=i;
				};

				$scope.depts=$scope.usermap[0].depts;
				for(var i in $scope.depts){
					$scope.depts[i].num=i;
				}
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewState=false;
				$scope.isNoShowReviewSalesman =!$scope.isNoShowReviewSalesman;
			}else if($scope.tag.current == '2'){
				$scope.isNoShowReviewState = !$scope.isNoShowReviewState;
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewSalesman=false;
			}else if($scope.tag.current == '3'){
				$scope.isNoShowReviewState=false;
				$scope.isNoShowReviewSalesman=false;
				$scope.isNoShowReviewSource = !$scope.isNoShowReviewSource;
			}else if($scope.tag.current == '4'){
				$scope.isNoShowChosePop=true;
				$scope.isNoShowReviewState=false;
				$scope.isNoShowReviewSource=false;
				$scope.isNoShowReviewSalesman=false;
			}
		}
	};
	// 全部:查看所有业务员
	$scope.tag1 = {
		current: "0"
	};
	$scope.actions1 = {
		setCurrent: function (param,levelCode) {
			$scope.salemanLevelCode=levelCode;
			$scope.tag1.current = param;
			$scope.tag2.current = -1;
			$scope.depts=$scope.usermap[param].depts;
			for(var i in $scope.depts){
				$scope.depts[i].num=i;
			}
			if(param=="0"){
				$scope.isNoShowReviewSalesman=false;
				$scope.depts=[];
				$scope.levelCode=signInInfo.deptInfo.levelCode;
				$scope.deptName='全部'
				$scope.pageIndex = 1;
				$scope.orderList = [];
				$scope.depts =[];
				$scope.shopName="全部";
				//点击全部，以下值还原
				$scope.checkName='审核';
				$scope.sourceName='来源';
				$scope.tag3.current = -1;
				$scope.tag4.current = -1;
				$scope.tag5.current = -1;
				$scope.verifyStatus='';
				$scope.isCbss='';
				$scope.unpassCode=0;
				$scope.userId='';
				getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
			}else{
				$scope.depts=[{"deptName":"全部","userId":""}];
				$scope.depts=$scope.depts.concat($scope.usermap[param].depts);
				for(var i in $scope.depts){
					$scope.depts[i].num=i;
				}
				//console.log($scope.shopList);
			}
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
			$scope.pageIndex = 1;
			$scope.orderList = [];
			getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
		}
	}
	// 关闭业务员
	$scope.closereviewSalesman=function(){
		$scope.isNoShowReviewSalesman=false;
	}
	//关闭筛选窗口
	$scope.closeChosePop=function(){
		$scope.isNoShowChosePop=false;
		$scope.isNoShowQuestion=false;
	}
	//关闭状态窗口
	$scope.closereviewState=function(){
		$scope.isNoShowReviewState=false;
	}
	//审核状态
	$scope.tag3 ={
		current : "0"
	};
	$scope.actions3 = {
		setCurrent : function(param){
			$scope.tag3.current = param;
			if($scope.tag3.current ==5){
				$scope.isNoShowQuestion = !$scope.isNoShowQuestion;
				$scope.unpassCode='';
			}else{
				$scope.isNoShowQuestion=false;
				$scope.tag5.current=-1;
				$scope.unpassCode=0;
			}
			$scope.checkName=$scope.stateList[param].name;
			$scope.verifyStatus=$scope.stateList[param].verifyStatus;
			$scope.pageIndex = 1;
			$scope.orderList = [];
			getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);			
			
		}
	}
	//关闭l来源窗口
	$scope.closereviewSource=function(){
		$scope.isNoShowReviewSource=false;
	}
	//来源
	$scope.tag4 ={
		current : "0"
	};
	$scope.actions4 = {
		setCurrent : function(param){
			$scope.tag4.current = param;
			$scope.sourceName=$scope.soureList[param].name;
			$scope.isCbss=$scope.soureList[param].isCbss;
			$scope.pageIndex = 1;
			$scope.orderList = [];
			getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);			
		}
	}
	//查询关键词
	$scope.lookKeywords=function(keyword){
		//console.log(keyword);
		$scope.keywords=keyword;
		$scope.pageIndex = 1;
		$scope.orderList = [];
		getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
	}
	//问题切换
	$scope.tag5 = {
		current: "-1"
	};
	$scope.actions5 = {
		setCurrent: function (param) {
			$scope.tag5.current = param;
			$scope.pageIndex = 1;
			$scope.orderList = [];
			$scope.unpassCode=$scope.questionList[param].unpassCode;
			getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
		}
	}	
	//保存筛选显示详情按钮的数据
	$scope.showDetail=function(value){
		//console.log(value);
		if(value==undefined){
			$scope.showDetailValue=false;	
		}else{
			$scope.showDetailValue=value;
		}
		localStorage.setItem("showDetailValue",$scope.showDetailValue);
	}
	//筛选中的日期
	$scope.setStartTime=function(e){
		$scope.getStartTime=$filter('date')(e,'yyyy-MM-dd');
	}
	$scope.setEndTime=function(e){
		$scope.getEndTime=$filter('date')(e,'yyyy-MM-dd');
	}
	//筛选中确定按钮
	$scope.ensure=function(){
		$scope.isNoShowChosePop=false;
		if($scope.showDetailValue==false){
			$scope.isNoShowDetail=false;
		}else{
			$scope.isNoShowDetail=true;
		}
		$scope.pageIndex = 1;
		$scope.orderList = [];
		getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
	}
	// 重置
	$scope.resetting=function(){
		$scope.isNoShowQuestion=false;
		//初始化筛选数据
		$scope.checkName='审核';
		$scope.tag3.current = -1;
		$scope.tag5.current = -1;
		$scope.unpassCode=0;
		$scope.verifyStatus='';
		$scope.getStartTime=GetDateStr(-6);
		$scope.getEndTime=GetDateStr(0);
	}
	//上拉加载 
	$scope.loadMore = function (){
		$scope.pageIndex++;
		getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
	};

	//获取全部数据
	function getPhotoList(pageIndex,verifyStatus,isCbss,keywords,startTime,endTime,unpassCode,levelCode){
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.loading = true;
		$scope.noMore = false;
		$http({
			method:'get',
			url:ajaxurl + 'numberOrderApp/queryOrgCustomerPicList?token=' + $rootScope.token,
			params:{
				orgCode:signInInfo.userInfo.orgCode,
				verifyStatus:verifyStatus,
				startTime:startTime,
				endTime:endTime,
				pageIndex:pageIndex,
				pageSize:$scope.pageSize,
				isCbss:isCbss,
				keywords:keywords,
				unpassCode:unpassCode,
				levelCode:levelCode
			}
		}).success(function(data){
			// $ionicLoading.hide();
			$scope.loading = false;
			$scope.orderList = $scope.orderList.concat(data.orderList);
			$scope.pageCount=data.page.pageCount;
			for(var i in $scope.orderList){
				// $scope.commonTime =new Date($scope.orderList[i].number);
				// console.log($scope.commonTime);
				switch($scope.orderList[i].verifyStatus){
					case 4:
						$scope.orderList[i].comparisonResult = true;
						$scope.orderList[i].verifyStatusVal="通过";
						break;
					case 0:
						$scope.orderList[i].comparisonResult = false;
						$scope.orderList[i].verifyStatusVal="未查看";
						$scope.orderList[i].txtPrimary=false;
						$scope.orderList[i].txtfff=true;
						break;
					case 1:
						$scope.orderList[i].comparisonResult = false;
						$scope.orderList[i].verifyStatusVal="查看";
						$scope.orderList[i].txtPrimary=false;
						$scope.orderList[i].txtfff=true;
						break;
					case 2:
						$scope.orderList[i].comparisonResult = false;
						$scope.orderList[i].verifyStatusVal="一审合格";
						$scope.orderList[i].txtPrimary=false;
						$scope.orderList[i].txtfff=true;
						break;
					case 5:
						$scope.orderList[i].comparisonResult = false;
						$scope.orderList[i].verifyStatusVal="待审核";
						$scope.orderList[i].txtPrimary=false;
						$scope.orderList[i].txtfff=true;
						break;
					case 3:
						$scope.orderList[i].comparisonResult = false;
						$scope.orderList[i].txtPrimary=true;
						$scope.orderList[i].txtfff=false;
						switch($scope.orderList[i].unpassCode){
							case 1:
								$scope.orderList[i].verifyStatusVal="无照片";
								break;
							case 2:
								$scope.orderList[i].verifyStatusVal="非人证合一";
								break;
							case 3:
								$scope.orderList[i].verifyStatusVal="不清楚";
								break;
							case 4:
								$scope.orderList[i].verifyStatusVal="翻拍";
								break;
						}
						break;
				}
			}
			$scope.customerImage=$scope.orderList;
			// console.log("aa"+JSON.stringify($scope.customerImage));
			$scope.num=eval($scope.customerImage).length;
			// console.log("$scope.num=="+JSON.stringify($scope.num));
			//如果小于pageSize禁止上拉加载
			if(eval(data.orderList).length < data.page.pageSize){
				$scope.hasmore = false;
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
			//判断大图还是小图
			if($scope.ssss){
				$scope.ssss = 0;
				$scope.isNoShowLoading=false;
				bigPic($scope.siIndex);
			}
		}).error(function () { 
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
				$state.go('index_dl');
			}); 
		}).finally(function () { 
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}
	
	//审核
	$scope.check = function(index,event){	
		$scope.tag6.current = 0;
		// console.log("----"+$scope.orderList[index].verifyStatus);
		switch($scope.orderList[index].verifyStatus){
			case 4:
				$scope.tag6.current =5;
				break;
			case 3:
				// console.log("111");
				switch($scope.orderList[index].unpassCode){
					case 1:
						$scope.tag6.current =1;
						break;
					case 3:
						$scope.tag6.current =2;
						break;
					case 2:
						$scope.tag6.current =3;
						break;
					case 4:
						$scope.tag6.current =4;
						break;
				};
				break;
		}
		
		$scope.isNoShowReviewBtnPop=true;
		$scope.index=index;
	};
	//关闭提示框
	$scope.closeReviewBtnPop=function(){
		$scope.isNoShowReviewBtnPop=false;
	}
	//提示框的选项
	$scope.tag6 = {
		current: "0"
	};
	$scope.actions6 = {
		setCurrent: function (param) {
			$scope.tag6.current = param;
			switch($scope.tag6.current){
				case 1:
					recordData($scope.index,'000002','无照片',1);
					break;
				case 2:
					recordData($scope.index,'000002','不清楚',1);
					break;
				case 3:
					recordData($scope.index,'000002','非人证合一',1);
					break;
				case 4:
					recordData($scope.index,'000002','翻拍',1);
					break;
				case 5:
					recordData($scope.index,'000001','完全合规',1);
					break;
			}
			$scope.pageIndex = 1;
			$scope.orderList = [];
			getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode,$scope.levelCode);
		}
	}
	$scope.check2=function(event){
		//console.log("111==="+$scope.isNoShowReviewPop);
		// checkPhoto($scope.orderCode,$scope.index,event);
		$scope.isNoShowHistory=false;
		$scope.tag7.current = 0;
		//console.log("----"+$scope.orderList[$scope.index].verifyStatus);
		switch($scope.orderList[$scope.index].verifyStatus){
			case 4:
				$scope.tag7.current =5;
				break;
			case 3:
				//console.log("111");
				switch($scope.orderList[$scope.index].unpassCode){
					case 1:
						$scope.tag7.current =1;
						break;
					case 3:
						$scope.tag7.current =2;
						break;
					case 2:
						$scope.tag7.current =4;
						break;
					case 4:
						$scope.tag7.current =3;
						break;
				};
				break;
		}
			
		if($scope.isNoShowReviewPop==true){
			$scope.isNoShowReviewPop=false;
		}else{
			$scope.isNoShowReviewPop=true
		}
	}
	//放大审核提示框的选项
	$scope.tag7 = {
		current: "0"
	};
	$scope.actions7 = {
		setCurrent: function (param) {
			$scope.tag7.current = param;
			if($scope.tag7.current==1){
				recordData($scope.index,'000002','无照片',1);
			}else if($scope.tag7.current==2){
				recordData($scope.index,'000002','不清楚',1);
			}else if($scope.tag7.current==3){
				recordData($scope.index,'000002','翻拍',1);
			}else if($scope.tag7.current==4){
				recordData($scope.index,'000002','非人证合一',1);
			}else if($scope.tag7.current==5){
				recordData($scope.index,'000001','完全合规',1);
			}
		}
	}
	//关闭审核窗口
	$scope.closeReviewPop=function(){
		$scope.isNoShowReviewPop=false;
	}
	
	function recordData(index,status,remark,num){
		$scope.num=num;
		$http({
			method:'get',
			url:ajaxurl + 'numberOrderApp/insertPicwallOpLog?token=' + $rootScope.token,
			params:{
				orderCode:$scope.orderList[index].orderCode,
				status:status,
				remark:remark,
				orgCode:$scope.orderList[index].orgCode,
				shopId:$scope.orderList[index].shopId
			}
		 }).success(function(data){
			// $scope.orderList[index].btnState = true;
			// $scope.orderList[index].comparisonResult = false;
			// console.log(data);
			$scope.data=data.data;
			if($scope.num==1){
				alertData($scope.data);
			}
			// $scope.comparisonResult="审核中";

		 });
	}
	//日期
	function GetDateStr(AddDayCount) { 
		var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);
		var y = dd.getFullYear(); 
		var m = dd.getMonth()+1;
		var d = dd.getDate(); 
		return y+"-"+m+"-"+d; 
	}
	//点击放大
	$scope.zoomPic = function(index){
		 bigPic(index);
	};
	function bigPic(index){
		//console.log(index)
		$scope.hideLoadingPage = true;
		$scope.orderCode=$scope.orderList[index].orderCode;
		$scope.index=index;
		$scope.isNoShowHeader=true;
		recordData(index,'000003','');
		// if(parseInt(index)==$scope.pageCount-1){
		// 	$scope.isNoShowImgDown=false;
		// 	$scope.isNoShowImgUp=true;
		// }
		if(parseInt(index)<($scope.pageCount-1)){
			if(parseInt(index)>=($scope.orderList.length-1)){
				$scope.siIndex = index;
				//console.log("sdf");
				$scope.ssss = 1;
				$scope.isNoShowLoading=true;
				$scope.hideLoadingPage = false;
				$scope.loadMore();
			}
		}
		 switch(index){
		 	case 0:
		 		$scope.isNoShowImgUp=false;
				$scope.isNoShowImgDown=true;
				break;
			case $scope.pageCount-1:
				$scope.isNoShowImgUp=true;
				$scope.isNoShowImgDown=false;
				break;
			default:
				$scope.isNoShowImgUp=true;
				$scope.isNoShowImgDown=true;
		 }
	}
	$scope.close = function(){
		$scope.hideLoadingPage = false;
		$scope.isNoShowHeader=false;
		// $scope.pageIndex = 1;
		// $scope.orderList = [];
		// getPhotoList($scope.pageIndex,$scope.verifyStatus,$scope.isCbss,$scope.keywords,$scope.getStartTime,$scope.getEndTime,$scope.unpassCode);
	};
	//滑动出发事件
	$scope.slideHasChanged=function(index){
		$scope.siIndex = index;
		$scope.index = index;
		//console.log("index  "+index);
		$scope.isNoShowReviewPop=false;
		$scope.isNoShowHistory=false;
		$scope.orderCode=$scope.orderList[index].orderCode;
		recordData(index,'000003','');
		//console.log("222==="+($scope.pageCount-1 )+"===="+parseInt(index));
		if(parseInt(index)<($scope.pageCount-1)){
			if(parseInt(index)>=($scope.orderList.length-1)){
				//console.log("sdf");
				$scope.ssss = 1;
				$scope.isNoShowLoading=true;
				$scope.hideLoadingPage = false;
				$scope.loadMore();
			}
		}else{
			bigPic($scope.siIndex);
		}
		 switch(index){
		 	case 0:
		 		$scope.isNoShowImgUp=false;
				$scope.isNoShowImgDown=true;
				break;
			case $scope.pageCount-1:
				$scope.isNoShowImgUp=true;
				$scope.isNoShowImgDown=false;
				break;
			default:
				$scope.isNoShowImgUp=true;
				$scope.isNoShowImgDown=true;
		 }
	}
	// 详情
	$scope.avatarCheckDetail=function(){
		$scope.checkDetail();
	};

	$scope.checkDetail = function(){
		$scope.isNoShowOrderInfo=true;
		$http({
			method:'get',
			url:ajaxurl + 'numberOrderApp/queryNumberOrderDetailByOrderCode?token=' + $rootScope.token,
			params:{orderCode:$scope.orderCode}
		}).success(function(data){
			// console.log(JSON.stringify(data));
			$scope.orderTime=data.orderDetail.createTime;
			$scope.orderNumber=data.orderDetail.number;
			$scope.amount=data.orderDetail.amount;
			$scope.productName=data.orderDetail.productName;
			$scope.activityName=data.orderDetail.activityName;
			// 用户信息
			$scope.customer=data.orderDetail.customer;
			$scope.orderOrgName=data.orderDetail.orgName;
			$scope.contactNumber=data.orderDetail.contactNumber;
			//渠道
			$scope.channelName=data.orderDetail.channelName;
			$scope.channelCode=data.orderDetail.channelCode;
			//发展人
			$scope.developName=data.orderDetail.developName;
			$scope.developCode=data.orderDetail.developCode;
			//获取电子工单编号
			$scope.eleOrder = data.orderDetail.eleOrder;
			if($scope.eleOrder == null || $scope.eleOrder == ''){
				$scope.isNoSheet= false;
			}else{
				$scope.isNoSheet= true;
			}
			//获取电子工单
			$scope.viewElectronicWorksheets = function(){
				// console.log("ok");
				handleDocumentWithURL(
					function() {
						//console.log('success');
					},
					function(error) {
						if(error == 53) {
							my.alert("对不起，您的手机无法阅读PDF文件！");
						}
					},
					$scope.eleOrder
				);
			};
		})
	}

	//关闭订单详情
	$scope.closeOrderInfo=function(){
		$scope.isNoShowOrderInfo=false;
	}

	//观看浏览历史
	$scope.recordHistory=function(){
		$scope.isNoShowReviewPop=false;
		$scope.isNoShowHistory=!$scope.isNoShowHistory;
		 $http({
				method:'get',
				url:ajaxurl + 'numberOrderApp/queryPicwallOpLog?token=' + $rootScope.token,
				params:{orderCode:$scope.orderList[$scope.index].orderCode}
		 }).success(function(data){
				// console.log("21"+JSON.stringify(data));
				$scope.opLogList=data['opLogList'];
				for(var i in  $scope.opLogList){
					if($scope.opLogList[i].verifyStatus==4){
						$scope.opLogList[i].status="通过";
					}else if($scope.opLogList[i].verifyStatus==3){
						$scope.opLogList[i].status="不通过";
					}else if($scope.opLogList[i].verifyStatus==1){
						$scope.opLogList[i].status="查看";
					}else if($scope.opLogList[i].verifyStatus==2){
						$scope.opLogList[i].status="初审通过";
					}
				}
		 });
	}
	//关闭浏览历史
	$scope.closeRecordHistory=function(){
		$scope.isNoShowHistory=false;
	}

	//提示信息
	function alertData(info){
		var alertPopup = $ionicPopup.alert({
			    title: '提示信息',
			    template: info
			});
			alertPopup.then(function(res) {
			    //console.log('Thank you for not eating my delicious ice cream cone');
			});
	}
});