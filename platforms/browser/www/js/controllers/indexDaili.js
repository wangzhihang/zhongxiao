appControllers.controller('index_dl', function($scope,$http,$compile,$ionicLoading,$filter,$state,$timeout,my,$ionicPopup,$rootScope,$cordovaCamera,url2base64,unicomm_server) {
	$scope.isNoShowPig=true;
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.developIsHide=true;
	$scope.agencyManagement=false;
	$scope.salesmanManagement=false;
	$scope.shopManagement=false;
	// $scope.orderNum = localStorage.getItem("orderNum") ? JSON.parse(localStorage.getItem('orderNum')) : {};
	if(localStorage.getItem('signInInfo')){
		signInInfo = JSON.parse(localStorage.getItem('signInInfo'));
		if(localStorage.getItem('managementShow')=='1'){
			$scope.agencyManagement=true;
			$scope.salesmanManagement=true;
			$scope.shopManagement=true;
		}else if(localStorage.getItem('managementShow')=='2'){
			$scope.agencyManagement=false;
			$scope.salesmanManagement=true;
			$scope.shopManagement=true;
		}
		if(localStorage.getItem('managementShow')=='3'){
			$scope.agencyManagement=false;
			$scope.salesmanManagement=false;
			$scope.shopManagement=true;
		}
		$scope.title = signInInfo.deptMap.deptName;
	}
	if(localStorage.getItem('dailiIcon')){
		$scope.isBCount = JSON.parse(localStorage.getItem('dailiIcon')).isBCount;
		$scope.showWithdrawRed = JSON.parse(localStorage.getItem('dailiIcon')).showWithdrawRed;
		$scope.showSendCard = JSON.parse(localStorage.getItem('dailiIcon')).showSendCard;
	}
	if(localStorage.getItem("orderNum")!=null){
		var json_orderNum =JSON.parse(localStorage.getItem('orderNum'));
		$scope.orderCntToday = json_orderNum.orderCntToday;
		$scope.orderCntThisMon =json_orderNum.orderCntThisMon;
		$scope.shopCount =json_orderNum.shopCount;
		$scope.loginShopCnt =json_orderNum.loginShopCnt;
		// console.log('$scope.orderCntToday=='+$scope.orderCntToday);
	}
	// console.log('dailiUserInfo=='+localStorage.getItem("dailiUserInfo"));
	if(localStorage.getItem('userType') == "000002"){
		// $scope.title = '代理商';
		$scope.developIsHide=false;
		if(localStorage.getItem("dailiUserInfo")!=null){
			$scope.amount =JSON.parse(localStorage.getItem('dailiUserInfo')).amount;
			$scope.orgName =JSON.parse(localStorage.getItem('dailiUserInfo')).orgName;
		}
	}
	if(localStorage.getItem('userType') == "000003"){
		// $scope.title = '业务员';
		$scope.developIsHide=true;
		if(localStorage.getItem("orgName")!=null){
			$scope.orgName =localStorage.getItem('orgName');
		}
	}
	if(localStorage.getItem('vertualAccout')){
		$scope.developIsHide=true;
		$scope.orgName=JSON.parse(localStorage.getItem('vertualAccout')).orgName;
	}
	if(localStorage.getItem("agencyValue")!=null){
		$scope.agencyValue =localStorage.getItem('agencyValue');
	}
	if(localStorage.getItem("headImgUrl")){
		$scope.headImgUrl =localStorage.getItem('headImgUrl');
	}else{
		$scope.headImgUrl = 'img/logo.png';
	}
	if(JSON.parse(localStorage.getItem('withdrawValue'))){
		$scope.developIsHide=false;
		$scope.withdrawValue= JSON.parse(localStorage.getItem('withdrawValue'));
		$scope.amount=$scope.withdrawValue.amount;
		$scope.agencyValue=$scope.withdrawValue.agencyValue;
		$scope.totleAmount=$scope.withdrawValue.totleAmount;
	} 
	if(localStorage.getItem('loading')==true){
		$scope.loading = false;
	}else{
		console.log('loadingfalse');
		$scope.loading = localStorage.getItem('loading');
	}
	//开始登录
	$scope.login_dl=function(){
			$http({
			method:'post',
			url:ajaxurl + 'userApp/agencyLogin?token=' + $rootScope.token
		}).success(function(data){
			$scope.loading = true;
			localStorage.setItem('loading',$scope.loading);
			// $ionicLoading.hide();
			//console.log("111==="+JSON.stringify(data));
				/*$.guide([{
				    selector: '.tab-item-active',
				    content: '<img src="../img/kzt.png" class="fixed" style="width:70vw;height:43vw;right:9vw;bottom:15vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:30vw;height:12vw;bottom:17vw;left:36vw">',
				    align: 'center'
				}, {
				    selector: '.circularGuide1',
				    content: '<img src="../img/tjdd.png" class="fixed" style="width:45vw;height:29vw;left:26vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">',
				    align: 'center'
				}, {
				    selector: '.circularGuide2',
				    content: '<img src="../img/ckdd.png" style="width:55vw;height:29vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">',
				    align: 'center'
				}, {
				    selector: '.circularGuide3',
				    content: '<img src="../img/ywydp.png" class="fixed" style="width:68vw;height:27vw;bottom:80vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">',
				    align: 'center'
				}, {
				    selector: '.circularGuide4',
				    content: '<img src="../img/ghpz.png" class="fixed" style="width:68vw;height:44vw;left:25vw;top:70vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">',
				    align: 'center'
				}, {
				    selector: '.circularGuide5',
				    content: '<img src="../img/zpsh.png" class="fixed" style="width:53vw;height:33vw;left:18vw;top:80vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">',
				    align: 'center'
				}
				, {
				    selector: '.circularGuide6',
				    content: '<img src="../img/txjl.png" class="fixed" style="width:61vw;height:5vw;right:7vw;bottom:40vw;"><img src="../img/wzdl.png" class="fixed iKnow" style="width:28vw;height:12vw;bottom:17vw;left:36vw;">'
				}]);*/


				signInInfo = data;
				$scope.title = signInInfo.deptMap.deptName;
				localStorage.setItem('signInInfo',JSON.stringify(signInInfo));
				if(signInInfo.deptMap.deptType=='000001'){
					$scope.agencyManagement=true;
					$scope.salesmanManagement=true;
					$scope.shopManagement=true;
					localStorage.setItem('managementShow','1');
				}else if(signInInfo.deptMap.deptType=='000002'){
					$scope.agencyManagement=false;
					$scope.salesmanManagement=true;
					$scope.shopManagement=true;
					localStorage.setItem('managementShow','2');
				}else if(signInInfo.deptMap.deptType=='000003'){
					$scope.agencyManagement=false;
					$scope.salesmanManagement=false;
					$scope.shopManagement=true;
					localStorage.setItem('managementShow','3');
				}
				//console.log("signInInfo"+JSON.stringify(signInInfo));
				$scope.getLoginData();
				$scope.getInformationList();
				if(data.userInfo.userType == "000003"){
			    	// $scope.title = '业务员';
			    	$scope.showSendCard=true;
			    	$scope.isBCount=true;
					// $scope.developIsHide=true;
					$scope.showWithdrawRed=true;
					$scope.orgName = signInInfo.userInfo.realName;
					localStorage.setItem("orgName",$scope.orgName)
			    }else{
			    	// $scope.title = '代理商';
			    	$scope.showSendCard=false;
			    	localStorage.setItem("dailiUserInfo",JSON.stringify({
						'amount':$scope.amount,
						'orgName':$scope.orgName
					}))

					$scope.accountType=signInInfo.account.accountType;
					//console.log("222==="+$scope.accountType);
					
					$scope.isBCount=false;
			    }
				$scope.getOrgManage();
				//测试版预先存储下来 
				localStorage.setItem('userId',JSON.stringify(data.userInfo.userId));
				//缓存代理首页图标
				localStorage.setItem("dailiIcon",JSON.stringify({
					'isBCount':$scope.isBCount,
					'showWithdrawRed':$scope.showWithdrawRed,
					'showSendCard':$scope.showSendCard
				}))
				// console.log(localStorage.getItem('dailiIcon'));


		}).error(function(){
			my.alert('登录连接服务器无返回信息!').then(function(){
				$scope.signInTxt = '立即登录';
				$scope.resState = false;
				$scope.loading = false;
			});
		}).finally(function() {
		       $scope.$broadcast('scroll.refreshComplete');
		    });
	}
	$scope.login_dl();
	//进入机构管理页面
	$scope.getOrgManage=function(){
		$http({
			method:'get',
			url:ajaxurl + '/appDept/intoIndex?token=' + $rootScope.token
		}).success(function(data){
			// console.log('org=='+JSON.stringify(data));
			localStorage.setItem('deptCode',data.deptCode);
			localStorage.setItem('deptName',data.deptName);
		}).error(function(){
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index');
            });
		});
	}
	$scope.goOrgManage=function(){
		$state.go('organization-manage');
	}


	//设置头像
	$scope.photograph = function(){
		$cordovaCamera.getPicture({
			quality: 70,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 320,
			targetHeight: 320,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			correctOrientation:true
		}).then(function(imageData) {
			alert(imageData);
			$scope.avatar = "data:image/jpeg;base64," + imageData;
			alert($scope.avatar.substring(23));
			// $scope.uploadAvatar();
			$scope.saveAvatar(imageData);
		}, function(err) {
			//...
		});
	};
	//上传照片
	$scope.uploadAvatar = function(){
		$http({
			  "method": 'post'
			, "url" : 'http://sfz.tiaoka.com/appUserAvatar/fileupload.php'
			, "data": {img:$scope.avatar.substring(23)}
		}).success(function(data){
			$scope.avatar = "http://sfz.tiaoka.com/appUserAvatar/"+data["url"];
			$scope.saveAvatar();
		}).error(function(data){
			alert(data);
			my.alert('照片上传失败,请联系管理员!').then(function(){
				$scope.avatar = 'img/logo.png';
			});
		});
	};
	//保存头像
	$scope.saveAvatar = function(imageData){
		$http({
			method:'get',
			url:ajaxurl + '/userApp/saveHeadImage?token=' + $rootScope.token,
			params:{imageUrl:imageData}
		}).success(function(data){
			//...上传成功
		}).error(function(error){
			alert(error);
			my.alert('照片保存失败,请重新拍摄！').then(function(){
				$scope.avatar = 'img/logo.png';
			});
		});
	};
	
	$scope.getLoginData=function(){
		$scope.userType=signInInfo.userInfo.userType;
		$scope.testTag=signInInfo.userInfo.testTag;
		$scope.amount = signInInfo.account.amount;
		$scope.orgName = signInInfo.userInfo.orgName;
		localStorage.setItem('userType',$scope.userType);
		if($scope.testTag=="000002"){
			// $scope.agencyIsShow=false;
			$scope.agencyValue='申请走账';
			localStorage.setItem("agencyValue",$scope.agencyValue)

			$scope.isUserPanelTitle=true;
			$scope.noUserPanelTitle=false;
			$scope.developIsHide=true;
			localStorage.setItem('vertualAccout',JSON.stringify({
				isVertial:true,
				orgName:$scope.orgName
			}));
			$scope.showWithdrawRed=true;
			$scope.withdrawCash=function(){
				my.alert('具体申请流程，了解详细信息，请咨询029-86262222.');
			}
		}else{
			// $scope.agencyIsShow=true;
			$scope.agencyValue='提现';
			$scope.totleAmount='总金额';
			localStorage.setItem("agencyValue",$scope.agencyValue)
			$scope.isUserPanelTitle=false;
			$scope.noUserPanelTitle=true;
			if($scope.testTag=="000001" && userBo.isVirtual=="000002"){
				$scope.showWithdrawRed=true;
				$scope.withdrawCash=function(){
					my.alert('当前账户资金为虚拟资金，不允许提现').then(function(){
		                $state.go('index_dl');
		            }); 
				}	
			}else{
				$scope.headImgUrl = signInInfo.userInfo.headImgUrl;
				$scope.developIsHide=false;
				if($scope.developIsHide==false){
					localStorage.setItem("agencyValue",$scope.agencyValue)
					localStorage.setItem('withdrawValue',JSON.stringify({
						'amount':$scope.amount,
						'agencyValue':$scope.agencyValue,
						'totleAmount':$scope.totleAmount
						}))

				}
				$scope.showWithdrawRed=false;
				$scope.withdrawCash=function(){
					$state.go('withdraws-cash');
				}
			}
		}
		//$scope.orgName = signInInfo.agencyInfo.orgName;
		
		// console.log('orderNum=='+localStorage.getItem("orderNum"));
			
		$scope.orderCntToday = signInInfo.orderCntToday;
		$scope.orderCntThisMon = signInInfo.orderCntThisMon;
		$scope.shopCount = signInInfo.shopCount;
		$scope.loginShopCnt = signInInfo.loginShopCnt;
		localStorage.setItem("orderNum",JSON.stringify({
			'orderCntToday':$scope.orderCntToday,
			'orderCntThisMon':$scope.orderCntThisMon,
			'shopCount':$scope.shopCount,
			'loginShopCnt':$scope.loginShopCnt
		}))
		$scope.opLogList = [];
		$scope.noticeList = [];
		$scope.orderList=[];
		$scope.headImgUrl=signInInfo.userInfo.headImgUrl;
		
		if($scope.headImgUrl == null || $scope.headImgUrl == ""){
			$scope.isNoShowPig=false;
		}else{
			$scope.isNoShowPig=true;
			localStorage.setItem("headImgUrl",$scope.headImgUrl)
		}
	}

	$scope.transactionLog=function(){
		if(($scope.testTag=="000001" && userBo.isVirtual=="000002")||$scope.testTag=="000002"){
			return;
		}else{
			$state.go('transaction-log');
		}
	}

	
	// console.log("$scope.headImgUrl  " + $scope.headImgUrl);
	$scope.getInformationList=function(){
		//获取"照片审核"记录信息
		$http({
			method:'get',
			url:ajaxurl + 'numberOrderApp/queryPicwallOpLog?token=' + $rootScope.token,
			params:{orgCode:signInInfo.userInfo.orgCode,opType:'000002',verifyStatus:'3',showTag:'000001'}
		}).success(function(data){
			//console.log(JSON.stringify(data));
			$scope.opLogList = data.opLogList;
			for(var i in $scope.opLogList){
				if($scope.opLogList.length >= 1){
					$scope.noticeList.push({
						'id':$scope.opLogList[i].id,
						'orderCode':$scope.opLogList[i].orderCode,
						'showTag':$scope.opLogList[i].showTag,
						'name':$scope.opLogList[i].orgName,
						'time':$scope.opLogList[i].updateTime,
						'remark':$scope.opLogList[i].remark,
						'imgUrl':'',
						'type':'照片审核'
					});
					//console.log($scope.noticeList);
				}
			}
			localStorage.removeItem("messageData");
			/*if(JSON.parse(localStorage.getItem("messageData")).data){
				$scope.localData=JSON.parse(localStorage.getItem("messageData")).data;
				console.log($scope.localData);
				$scope.noticeList=$scope.noticeList.concat($scope.localData);
			}*/
			$scope.messageData={data:$scope.noticeList};
			localStorage.setItem("messageData",JSON.stringify($scope.messageData));
			$scope.allData=JSON.parse(localStorage.getItem("messageData")).data;
			//console.log("$scope.allData"+$scope.allData);
			if($scope.allData){
				$scope.allDataSortDownByTime=JsonSortDown($scope.allData,'time');
			    $scope.localDataMessageLength=localStorage.getItem("allDataSortDownByTimeLength");
			  	if($scope.localDataMessageLength==null){
			  		// console.log("111");
			  		if($scope.allDataSortDownByTime.length>5){
			  			$rootScope.isTabRedPoint=true;
						$rootScope.noTabRedPoint=false;
			  		}else{
			  			$rootScope.isTabRedPoint=false;
						$rootScope.noTabRedPoint=true;
			  		}
			  	}else{
			  		if($scope.allDataSortDownByTime.length>$scope.localDataMessageLength){
						$rootScope.isTabRedPoint=true;
						$rootScope.noTabRedPoint=false;
					}else{
						$rootScope.isTabRedPoint=false;
						$rootScope.noTabRedPoint=true;
					}
			  	}
			}  	
		});
		//获取"宽带订单"记录信息
		/*$http({
			method:'post',
			url:ajaxurl + 'orderLanApp/queryUserLanOrderList?token=' + $rootScope.token,
			data:{status:'000001',pageSize:'5'}
		}).success(function(data){
			console.log(JSON.stringify(data));
			$scope.list = data.list;
			for(var i in $scope.list){
				if($scope.list.length >= 1){
					$scope.noticeList.push({
						'id':$scope.list[i].id,
						'orderCode':$scope.list[i].orderCode,
						'showTag':$scope.list[i].showTag,
						'name':$scope.list[i].orgName,
						'time':$scope.list[i].updateTime,
						'remark':$scope.list[i].remark,
						'imgUrl':'../../img/wxdd.png',
						'type':'宽带订单'
					});
				}
			}
		})*/
		//console.log($scope.noticeList);
	}
	//下拉刷新
	$scope.doRefresh = function() {
		$scope.noticeList=[];
		$scope.login_dl();
		// update();
		// $timeout(function() {
		// 	$scope.$broadcast('scroll.refreshComplete');
		// }, 3000);
	}
	//停止刷新
	  function endRefreshAction() {  
	        $scope.$broadcast('scroll.refreshComplete');
	  }
	//点击叉号隐藏
	$scope.cancel=function(id,showTag,index){
			 localStorage.setItem("showTag","000002");
			 $scope.allDataSortDownByTime[index].showTag = "000002";
		
	}
	//查看订单详情
	$scope.numberOrderDetail = function(orderCode,type,index) {
		localStorage.setItem('orderCode',arguments[0]);
		if(arguments[1]=='照片审核'){
			$state.go('kk-order-detail');
		}
		/*else if(arguments[1]=='微信号码订单'){
			localStorage.setItem('orderCode',$scope.noticeList[index].orderCode);
			console.log(localStorage.getItem('orderCode'));
			$state.go("kd-order-detail");
		}
		else if(arguments[1]=='微信宽带订单'){
			localStorage.setItem('orderCode',$scope.noticeList[index].orderCode);
			console.log(localStorage.getItem('orderCode'));
			$state.go('kd-order-detail');
		}*/
	}
	//当日订单(号码/开卡)跳转(传参)
	$scope.todayOrderJump = function(){
		$state.go('kk-order-list', {
			status:'000003',
			startTime:$filter('date')(new Date(),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	};
	//当月订单(号码/开卡)跳转(传参)
	$scope.currentMonth = function(){
		$state.go('kk-order-list', {
			status:'000003',
			startTime:$filter('date')(new Date().setDate(1),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	};
	//店铺数量跳转至店铺管理页面
	$scope.shopCountJump = function(){
		$state.go('daili-shop-index');
	};
	//当如店铺登录数量
	$scope.loginShopCntJump = function(){
		$state.go('daili-shop-index',{abnormal:'1'});
	};
	//更新首页数据信息
	function update(){
		$http({
			method:'get',
			url:ajaxurl + 'userApp/getAcountInfo?token=' + $rootScope.token
		}).success(function(data){
			//console.log('更新后的信息：' + JSON.stringify(data));
			if($scope.userType == "agency"){
				$scope.amount = data.account.amount;
			}

			
			$scope.orderCntToday = data.orderCntToday;
			$scope.orderCntThisMon = data.orderCntThisMon;
			$scope.shopCount = data.shopCount;
			$scope.loginShopCnt = data.loginShopCnt;
		}).error(function(){
			my.alert('服务器信息获取失败！');
		});
	}

	$scope.dianpuManage=function(){
		$state.go('daili-shop-index');
	}
	$scope.salesmanManage=function(){
		$state.go('daili-salesman-index');
	}
	$scope.jobnumConfig=function(){
		$state.go('jobnum-config-list');
	}
	//机构管理代理商管理
	$scope.dailiMangage = function(){
		localStorage.setItem('showResertPwd','daili');
		localStorage.setItem('dianpuTag','');
		$state.go('daili-org-index-list');
	}
	//机构管理业务员管理
	$scope.salemanManage = function(){
		$scope.salemanList = [{
			'levelCode':signInInfo.deptMap.levelCode,
			'deptCode':signInInfo.deptMap.deptCode,
			'deptType':signInInfo.deptMap.deptType,
			'deptName':signInInfo.deptMap.deptName
		}];
		localStorage.setItem('DevelopInfos',JSON.stringify({
			'levelCode':signInInfo.deptMap.levelCode,
			'deptCode':signInInfo.deptMap.deptCode,
			// 'headImg':userBo.headImgUrl,
			'orgCode':signInInfo.deptMap.orgCode,
			'deptName':signInInfo.deptMap.deptName,
			'deptType':signInInfo.deptMap.deptType,
			'statsList':$scope.salemanList,
			'index':null
		}));
		localStorage.setItem('showResertPwd','');
		localStorage.setItem('dianpuTag','saleman');
		$state.go('daili-org-saleman-shop-list');
	}
	//机构管理店铺管理
	$scope.shopManage = function(){
		$scope.salemanList = [{
			'levelCode':signInInfo.deptMap.levelCode,
			'deptCode':signInInfo.deptMap.deptCode,
			'deptType':signInInfo.deptMap.deptType,
			'deptName':signInInfo.deptMap.deptName
		}];
		localStorage.setItem('DevelopInfos',JSON.stringify({
			'levelCode':signInInfo.deptMap.levelCode,
			'deptCode':signInInfo.deptMap.deptCode,
			// 'headImg':userBo.headImgUrl,
			'orgCode':signInInfo.deptMap.orgCode,
			'deptName':signInInfo.deptMap.deptName,
			'deptType':'000003',
			'statsList':$scope.salemanList,
			'index':0,
			'shopManage':'1'
		}));
		localStorage.setItem('showResertPwd','');
		localStorage.setItem('dianpuTag','dianpu');
		$state.go('daili-org-saleman-shop-list');
	}

	//是否显示派发佣金
	if(userBo.userType == '000002'){
		$scope.showSendCommision = true;
	}

	//是否显示虚拟走账
	$scope.showSendCommision = true;
	if(userBo.userType == '000003'){
		$scope.showSendCommision = false;
	}
	//cbss退出
	$scope.cbssLoginOut = function(){
		number_pool = "CBSS";
		unicomm_server.getUnicomm({"cmd":"unicom_log_out"}).then(
			function(return_json){
				if (return_json.status == '1') {
					my.alert('CBSS退出成功');
				}else{
					$scope.LoginError('接口服务器登录失败!');
				}
			},
			function () {
				$scope.LoginError('接口服务器无返回信息!');
			}
		)
	}

});