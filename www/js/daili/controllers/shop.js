appControllers.controller('daili-shop', function($scope,$http,$rootScope,$ionicLoading,my, $cordovaCamera,$filter,$state) {
	$scope.ownerId = localStorage.getItem('ownerId');
	$scope.currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
	$scope.orderCnt = 0;
	$scope.hideLoadingPage = true;
	$scope.rachargeTip=false;
	$scope.rechatgeBtn=false;
	$scope.xDate=[];
	$scope.imgUrl=localStorage.getItem('imgUrl');
	$scope.shopId=localStorage.getItem('shopId');
	$scope.avatar = 'img/sczp.png';
	if($scope.imgUrl==""){
		$scope.isImgUrl=false;
	}else{
		$scope.isImgUrl=true;
	}

	//当日订单(号码/开卡)跳转(传参)
	$scope.todayHmOrder = function(){
		$state.go('kk-order-list', {
			status:'000003',
			startTime:$filter('date')(new Date(),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	};
	//当月订单(号码/开卡)跳转(传参)
	$scope.todayLanOrder = function(){
		$state.go('kd-order-list', {
			status:'000003',
			startTime:$filter('date')(new Date(),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	};
	//获取店铺详情信息
	// $ionicLoading.show({template: '数据加载中...'});
	$http({
		method:'post',
		url:ajaxurl + 'userApp/queryShopDetail?token=' + $rootScope.token,
		data:{userId:$scope.ownerId,date:$scope.currentDate}
	}).success(function(data){
		// $ionicLoading.hide();
		//console.log(JSON.stringify(data));
		$scope.hideLoadingPage = false;
		for(var i in data.recentOrderCnt.yNumberNum){
			$scope.orderCnt = $scope.orderCnt + data.recentOrderCnt.yNumberNum[i]
		}
		//console.log("x:"+data.recentOrderCnt.xAxis);
		for(i in data.recentOrderCnt.xAxis){
			 $scope.xDate.push($filter('date')(data.recentOrderCnt.xAxis[i],'MM-dd'));
			 // console.log("$scope.xDate="+$scope.xDate);
		}
		//console.log("y:"+data.recentOrderCnt.yNumberNum);
		//获取统计图表信息
		$scope.chart = new Highcharts.Chart('container', {
			chart: {
				backgroundColor: 'rgba(0,0,0,0)'
			},
			title: {
				text:data.recentOrderCnt.title,
				align: "left",
				style:{
					color:'white',
				}
			},
			subtitle: {
				text: '近七日号码订单总数：'+$scope.orderCnt,
				align: "left",
				style:{
					color:'white',
				}
			},
			xAxis: {
				lineColor: "white",
				tickColor:'white',
				categories:$scope.xDate,
				labels: {
					style: {
						color: 'white',
					}
				},
			},
			yAxis: {
				gridLineWidth:1,
				gridLineColor:'white',
				title: {
					text:null
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: 'white'
				}],
				labels: {
					style: {
						color: 'white',
					}
				},
			},
			credits: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			series: [{
				data: data.recentOrderCnt.yNumberNum,
				name:'数量',
				color:'white'
			}]
		});
		
		$scope.shopName = data.shopInfo.shopName;
		$scope.shopBalance = data.shopInfo.shopBalance;
		$scope.numOrderCntToday = data.shopInfo.numOrderCntToday;
		$scope.lanOrderCntToday = data.shopInfo.lanOrderCntToday;
		$scope.loginTime = data.shopInfo.loginTime;
		$scope.realName = data.shopInfo.realName;
		$scope.shopTel = data.shopInfo.shopTel;
		$scope.cuserName = data.shopInfo.cuserName;
		$scope.address = data.shopInfo.address;
		$scope.ownerId = data.shopInfo.ownerId;
		localStorage.setItem("ownerId",$scope.ownerId);
		localStorage.setItem("userType",000005);
		//根据经纬度获取并显示地图
		$scope.isShowMapContainer=true;
		$scope.getMap=function(){
			 var map = new AMap.Map('mapContainer', {
                center: [$scope.longitude,$scope.latitude],
                zoom: 16
            });
            var marker=new AMap.Marker({
                position:[$scope.longitude,$scope.latitude],
                map:map
            });
		}
		$scope.lnglats= data.shopInfo.lnglats;
		console.log("lnglats==="+$scope.lnglats);
		$scope.lnglarArr=[];
		if($scope.lnglats==null||$scope.lnglats==""){
			$scope.isShowMapContainer=false;
		}else{
			$scope.lnglarArr=$scope.lnglats.split(',');
			$scope.longitude =$scope.lnglarArr[0];
			$scope.latitude =$scope.lnglarArr[1];
			$scope.getMap();
		}
		
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	//店铺充值
	$scope.showRechargeBtn=function(){
		$scope.rechatgeBtn=true;
	}
	$scope.closeRegBtn=function(){
		$scope.rechatgeBtn=false;
	}
	$scope.testTag=userBo.testTag;
	if(signInInfo.account){
		$scope.accountType=signInInfo.account.accountType;
		//console.log("$scope.testTag=" + $scope.testTag);
		//console.log("$scope.accountType=" + $scope.accountType);
		$scope.dianpuRecharge=function(){
			if($scope.testTag=="000001" && $scope.accountType=="000002"){
				//console.log("hahhahah");
				$scope.isNoShowHeader=true;
				$scope.rachargeTip=true;
			}
		}
	}
	//关闭店铺充值
	$scope.closeTip=function(){
		$scope.isNoShowHeader=false;
		$scope.rachargeTip=false;
		$scope.rechatgeBtn=false;
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
			$scope.avatar = "data:image/jpeg;base64," + imageData;
			$scope.uploadAvatar();
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
			my.alert('照片上传失败,请联系管理员!').then(function(){
				$scope.avatar = 'img/sczp.png';
			});
		});
	};
	//保存头像
	$scope.saveAvatar = function(){
		$http({
			method:'get',
			url:ajaxurl + '/userApp/saveHeadImage?token=' + $rootScope.token,
			params:{imageUrl:$scope.avatar}
		}).success(function(data){
			//...上传成功
		}).error(function(){
			my.alert('照片保存失败,请重新拍摄！').then(function(){
				$scope.avatar = 'img/sczp.png';
			});
		});
	};
	
	//充值
	//参数：上传凭证 certificate:$scope.avatar
	$scope.uploading=function(){
		//console.log("value=="+$scope.shopId);
		if($scope.money!=null && $scope.money>=0){
			$http({
				method:'post',
				url:ajaxurl + 'accountApp/virtualRecharge?token=' + $rootScope.token,
				data:{shopId:$scope.shopId,fee:$scope.money}
			}).success(function(data){
				my.alert('充值成功').then(function(){
	                $state.go('daili-shop');
	            }); 
			});
		}else{
			if (null == $scope.money) {
				my.alert('输入金额不能为空').then(function(){
	                $state.go('daili-shop');
	            }); 
			}
			if (0 >= $scope.money) {
				my.alert('输入金额不能负数').then(function(){
	                $state.go('daili-shop');
	            }); 
			}
			 
		}
	}
	
});