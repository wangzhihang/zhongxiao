appControllers.controller('kdOrderDetail', function($scope,$state,$http,$rootScope,$ionicPopup,$stateParams,my,$ionicLoading) {
	$scope.title = '宽带订单详情';
	$scope.lanNumberList = [];
	$scope.tvList = [];
	$scope.showList = true;
	$scope.loading = false;
	$scope.hasElectronicWorksheets = false;
	$scope.numberType = '未知';
	$scope.eleOrder = '';
	$scope.isNoShowActive=true;
	$scope.isNoShowPrice=true;
	$scope.activityNameDiv=true;
	$scope.lanActivityNameDiv=true;
	$scope.activityNameDd=true;
	$scope.lanActivityPriceDiv=true;
	$scope.macAddressDiv=true;
	$scope.createTimeDiv=true;
	$scope.activityAmountDiv=true;
	$scope.tvAmountDiv=true;
	$scope.ftthAmountDiv=true;
	$scope.numAmountDiv=true;
	$scope.lanNumInfoShow=true;
	$scope.noticeList=[];
	$scope.numAmount=0;
	$scope.activityAmount=0;
	$scope.orderCode= null;
	if(localStorage.getItem('activityNameDd2') == 1){
		$scope.activityNameDd = false;
	}

	//获取宽带订单详情
	$scope.getData=function(orderCode,number){
		$scope.maskLayer=false;
		// $ionicLoading.show({template: '数据加载中...'});
		$scope.maskLayer=false;
		$http({
			method:"GET",
			url:ajaxurl + 'orderLanApp/queryLanOrderAppDetail?token=' + $rootScope.token,
			params:{
				orderCode:orderCode,
				number:number,
				numOrderCode:$stateParams.numOrderCode
			},
			timeout: 5000
		}).success(function(data){
			// $ionicLoading.hide();
			$scope.maskLayer=true;
			//console.log("a==="+JSON.stringify(data));
			$scope.showList = false;
			$scope.loading = true;
			//用户信息
			$scope.lanOrderCombineBo = data.orderDetail.lanOrderCombineBo;
			//$scope.orderCode = data.orderDetail.lanOrderCombineBo.orderCode;
			$scope.createTime = data.orderDetail.lanOrderCombineBo.createTime;
			//$scope.updateTime = data.orderDetail.lanOrderCombineBo.updateTime;
			$scope.status = data.orderDetail.lanOrderCombineBo.status;
			//订单金额
			//$scope.orderAmount = data.orderDetail.lanOrderCombineBo.amount;
			//人脸比对图片展示
			 $scope.imgAdapt = function(imgSrc){
	            var img = new Image(); 
	            img.src =  imgSrc; 
	            img.onload = function(){
	                console.log(imgSrc+'   '+img.width+'   '+img.height);
	                if(img.width > img.height){
	                    $scope.imgProp = {
	                        'max-height': '27vw',
	                        'height': '110px'
	                    }
	                }
	            }
	        }
			$scope.idCardHeadUrl = data.orderDetail.lanOrderCombineBo.idCardHeadUrl;
			$scope.imgAdapt($scope.idCardHeadUrl);
			$scope.customerImgUrl = data.orderDetail.lanOrderCombineBo.customerImgUrl;
			$scope.imgAdapt($scope.customerImgUrl);
			$scope.signUrl = data.orderDetail.lanOrderCombineBo.signUrl;
			$scope.imgAdapt($scope.signUrl);
			if($scope.signUrl.substring(25, 29) == 'null'){
	        	$scope.showBtn = true;
	        }else{
	        	$scope.showBtn = false;
	        	$scope.imgAdapt($scope.signUrl);
	        }
			//宽带信息
			$scope.lanInfoBo = data.orderDetail.lanInfoBo;
			if($scope.lanInfoBo){
				//$scope.comboType = data.orderDetail.lanInfoBo.detailedProductName;
				$scope.lanAmount = data.orderDetail.lanInfoBo.lanAmount;
				$scope.lanActivityName = data.orderDetail.lanInfoBo.lanActivityName;
				$scope.lanActivityPrice = data.orderDetail.lanInfoBo.lanActivityPrice;
				//$scope.ftthAddress = data.orderDetail.lanInfoBo.ftthAddress;
				$scope.ftthAmount = data.orderDetail.lanInfoBo.ftthAmount;
			}
			//号码信息
			//console.log("data.orderDetail.lanNumberList[0]=="+data.orderDetail.lanNumberList[0]);
			$scope.noticLanNumberList=data.orderDetail.lanNumberList;
			//console.log("length:"+JSON.stringify($scope.noticLanNumberList));
			if($scope.noticLanNumberList.length>0){
				for(var i in $scope.noticLanNumberList){
					$scope.numAmount += $scope.noticLanNumberList[i].numAmount;
					$scope.activityAmount += $scope.noticLanNumberList[i].activityAmount;
				    if($scope.numAmount==""||$scope.numAmount==null||$scope.numAmount==0){
						console.log(i+$scope.numAmount);
						$scope.numAmountDiv=false;
					}
					if($scope.activityAmount==""||$scope.activityAmount==null||$scope.activityAmount==0){
						$scope.activityAmountDiv=false;
						$scope.activityAmount=0;
					}
					$scope.noticLanNumberList[i].contractNameDd=true;
					if($scope.noticLanNumberList[i].contractName==""||$scope.noticLanNumberList[i].contractName==null){
						$scope.noticLanNumberList[i].contractNameDd=false;
					}

				}
				console.log("$scope.noticeList=="+$scope.noticeList);
				
				if($scope.activityName==""||$scope.activityName==null){
					$scope.activityNameDiv=false;
					console.log("$scope.activityName:"+$scope.activityName);
				}
				
			}else{
				$scope.activityNameDd=false;
				$scope.numAmountDiv=false;
				$scope.activityAmountDiv=false;
				$scope.lanNumInfoShow=false;
				localStorage.setItem('activityNameDd2','1');
			}
			
			if($scope.lanAmount==null){
				$scope.lanAmount=0;
			}
			if($scope.lanActivityPrice==null||$scope.lanActivityPrice==0){
				$scope.lanActivityPriceDiv=false;
			}
			if($scope.ftthAmount==null||$scope.ftthAmount==0){
				$scope.ftthAmountDiv=false;
			}
			if($scope.createTime==null){
				$scope.createTimeDiv=false;
			}
			if($scope.lanActivityName==""||$scope.lanActivityName==null){
				$scope.lanActivityNameDiv=false;
			}
			if(($scope.activityName==""||$scope.activityName==null)&&($scope.lanActivityName==""||$scope.lanActivityName==null)){
				$scope.activityNameDd=false; 
				localStorage.setItem('activityNameDd2','1');
			}

			//手机号码信息
			var numberType = {
				"000001":"新装",
				"000002":"纳入"
			};
			for(var i in data.orderDetail["lanNumberList"]){
				var ii = data.orderDetail["lanNumberList"][i];
				ii["isNewNumber"] = numberType[ii["isNewNumber"]];
				$scope.lanNumberList.push(ii);
			}
	//		$scope.lanNumberList = data.orderDetail["lanNumberList"];
			//TV信息
			$scope.tvList = data.orderDetail["tvList"];
			if($scope.tvList.length>0){
				if($scope.tvList[0].macAddress){
					$scope.macAddress = $scope.tvList[0].macAddress;
				}else{
					$scope.macAddressDiv=false;
				}
				if($scope.tvList[0].tvAmount){
					$scope.tvAmount = $scope.tvList[0].tvAmount;
				}else{
					$scope.tvAmountDiv=false;
				}
			}else{
				$scope.macAddressDiv=false;
				$scope.tvAmountDiv=false;
			}
			
			$scope.eleOrder = data.orderDetail.lanOrderCombineBo.eleOrder;
			//如果电子工单不为空，则显示查看按钮
			if($scope.eleOrder == '' || $scope.eleOrder == null){
				$scope.hasElectronicWorksheets = false;
			}else{
				$scope.hasElectronicWorksheets = true;
			}
			//获取电子工单
			$scope.viewElectronicWorksheets = function(){
				handleDocumentWithURL(
					function() {
						//console.log('success');
					},
					function(error) {
						if(error == 53) {
							$ionicPopup.alert({
						       title: '系统提示',
						       template: '对不起，您的手机无法阅读PDF文件！',
						       okText:'我知道了',
						       okType:'button-default'
						    });
						}
					},
					$scope.eleOrder
				);
			}
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index');
	            }); 
		});
	}
	// console.log("nnnn"+order["orderCode"]);
	if(!$stateParams.number){
		$scope.orderCode=order['orderCode'];
		$scope.number='';
		$scope.getData($scope.orderCode,$scope.number);
	}else{
		$scope.orderCode='';
		$scope.number=$stateParams.number;
		$scope.getData($scope.orderCode,$scope.number);
	}
	//点击图片放大
	$scope.isNoShowHeader=false;
    $scope.changePic=function(){
    	$scope.isShowBigPic=true;
    	$scope.isNoShowHeader=true;
    	var img = new Image(); 
        img.src =  $scope.customerImgUrl; 
        img.onload = function(){
            if(img.width > img.height){
                $scope.bigPic = {
                   'margin': 'auto',
                   'width':'85%',
                   'height':'56%'
                }
            }
        }
    }
    //关闭放大图片
    $scope.closeBigPic=function(){
    	$scope.isShowBigPic=false;
    	$scope.isNoShowHeader=false;
    }
    //获取补签名链接
    $scope.supplySignature = function(){
    	$http({
			method:'get',
			url:ajaxurl + 'orderApp/getQrCode4AuthOrder?token=' + $rootScope.token,
			params:{
				'orderNo':$scope.orderCode
			}
		}).success(function(data){
			if(data.result == true){
				cordova.ThemeableBrowser.open('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo,
                  ' _self',{
                       statusbar: {
                         color: '#ffffffff'
                     },

                     toolbar: {
                         height: 44,
                         color: '#f0f0f0ff'
                     },
                     title: {
                         color: '#003264ff',
                         showPageTitle: true,
                         staticText: '补录签名'
                     },
                      closeButton: {
                           image: 'close_pressed',
                           align: 'left',
                           event: 'closePressed'
                       }
                  })
				// my.alert('<textarea id="text" readonly>http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+order["orderCode"]+'</textarea>','','复制链接')
    //              .then(function(){
    //                  var target=document.getElementById("text");//获取目标元素
    //                    target.focus();
    //                    const selection = window.getSelection();
    //                    if(selection.rangeCount > 0) selection.removeAllRanges();
    //                    target.setSelectionRange(0, target.value.length);
    //                    document.execCommand('copy', false, null)
    //              });
                 //安卓可复制 ios不可
			  //    	var target=document.getElementById("text");//获取目标元素
					// target.select(); // 选择文本
    	// 			document.execCommand("Copy"); // 执行浏览器复制命令
			}
		}).error(function(){
			my.alert('服务器信息获取失败！');
		});
    }
    
})
