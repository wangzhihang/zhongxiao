appControllers.controller('kd-order-detail', function($scope,$http,$state,my,$rootScope,$ionicLoading,$stateParams) {
	$scope.title = '宽带订单详情';
	$scope.eleOrder = '';
	$scope.hideLoadingPage = true;
	$scope.isNoShowActivityName=true;
	$scope.isNoShowNumber=true;
	$scope.isNoShowLanNumber=true;
	$scope.isNoShowAllNum=true;
	$scope.hasElectronicWorksheets = false;
	$scope.activityNameDiv=true;
	$scope.lanActivityNameDiv=true;
	$scope.activityNameDd=true;
	$scope.activityAmountDiv=true;
	$scope.lanActivityPriceDiv=true;
	$scope.ftthAmountDiv=true;
	$scope.tvAmountDiv=true;
	$scope.macAddressDiv=true;
	$scope.createTimeDiv=true;
	$scope.numAmountDiv=true;
	$scope.customerDiv=true;
	$scope.contractNumberDiv=true;
	$scope.addressDiv=true;
	$scope.lanNumInfoShow=true;
	$scope.showUserInfos=true;
	$scope.showShopInfo=true;
	$scope.numAmount=0;
	$scope.activityAmount=0;
	$scope.loading=false;
	$scope.showSalemanInfo=true;
	$scope.orderCode = '';

	//适配宽照片
    $scope.imgAdapt = function(imgSrc){
        var img = new Image(); 
        img.src =  imgSrc; 
        img.onload = function(){
            if(img.width > img.height){
                $scope.imgProp = {
                    'max-height': '27vw',
                    'height': '110px'
                }
            }
        }
    }
   
    if(localStorage.getItem('activityNameDd')=='1'){
    	$scope.activityNameDd = false;
    }

	$scope.getData=function(orderCode,number){
		// $ionicLoading.show({template: '数据加载中...'});
		$http({
			method:'get',
			url:ajaxurl + 'orderLanApp/queryLanOrderAppDetail?token=' + $rootScope.token,
			params:{
				orderCode:orderCode,
				number:number,
				numOrderCode:$stateParams.numOrderCode
			}
		}).success(function(data){
			// $ionicLoading.hide();
			//console.log(JSON.stringify(data));
			$scope.loading=true;
			$scope.hideLoadingPage = false;
			$scope.orderCode = data.orderDetail.lanOrderCombineBo['orderCode'];
			$scope.status = data.orderDetail.lanOrderCombineBo['status'];
			$scope.createTime = data.orderDetail.lanOrderCombineBo['createTime'];
			//状态
			
			//用户信息
			$scope.customer = data.orderDetail.lanOrderCombineBo['customer'];
			$scope.contractNumber = data.orderDetail.lanOrderCombineBo['contractNumber'];
			
			$scope.amount = data.orderDetail.lanOrderCombineBo['amount'];
			$scope.comment = data.orderDetail.lanOrderCombineBo['comment'];
			$scope.address = data.orderDetail.lanOrderCombineBo['address'];
			$scope.mainProductName=data.orderDetail.lanOrderCombineBo['mainProductName'];
			$scope.comment = data.orderDetail.lanOrderCombineBo['comment'];
			//号码信息
			//console.log("data.orderDetail.lanNumberList[0]=="+data.orderDetail.lanNumberList[0]);
			$scope.noticLanNumberList=data.orderDetail.lanNumberList;
			//console.log("length:"+JSON.stringify($scope.noticLanNumberList));
			if($scope.noticLanNumberList.length>0){
				for(var i in $scope.noticLanNumberList){
					$scope.numAmount += $scope.noticLanNumberList[i].numAmount;
					$scope.activityAmount += $scope.noticLanNumberList[i].activityAmount;
				    if($scope.numAmount==""||$scope.numAmount==null||$scope.numAmount==0){
						//console.log(i+$scope.numAmount);
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
				//console.log("$scope.noticeList=="+$scope.noticeList);
				
				if($scope.activityName==""||$scope.activityName==null){
					$scope.activityNameDiv=false;
					//console.log("$scope.activityName:"+$scope.activityName);
				}
				
			}else{
				$scope.activityNameDd=false;
				$scope.numAmountDiv=false;
				$scope.activityAmountDiv=false;
				$scope.lanNumInfoShow=false;
				localStorage.setItem('activityNameDd','1');
			}

			if(data.orderDetail.lanNumberList.length>0){
				$scope.number =data.orderDetail.lanNumberList[0]['number'];
				if($scope.number==""||$scope.number==null){
					$scope.isNoShowNumber=fasle;
				}
			}

			$scope.lanInfoBo=data.orderDetail.lanInfoBo;
			if($scope.lanInfoBo!=null){
				$scope.lanAmount = $scope.lanInfoBo.lanAmount;
				$scope.lanActivityPrice = $scope.lanInfoBo.lanActivityPrice;
				$scope.ftthAmount = $scope.lanInfoBo.ftthAmount;
			}
			
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
			//店铺信息
			$scope.userInfos=data.userInfos;
			$scope.deveUserList=data.deveUserList;
			if($scope.deveUserList.length==0){
				$scope.showSalemanInfo=false;
			}
			if($scope.userInfos){
				$scope.shopName=$scope.userInfos.shopName;
				$scope.cTel=$scope.userInfos.cTel;
				$scope.cRealName=$scope.userInfos.cRealName;
				$scope.cUserName=$scope.userInfos.cUserName;
				if($scope.shopName==null&&$scope.cRealName==null&&$scope.cTel==null&&$scope.cUserName==null){
					$scope.showShopInfo=false;
				}
			}
			if($scope.showShopInfo==false&&$scope.showSalemanInfo==false){
				$scope.showUserInfos=false;
			}
		
			if($scope.comment ==null){
				$scope.isNoShowActivityName=false;
			}
			switch(data.orderDetail.lanInfoBo) {
				case null:
					$scope.isNoShowLanNumber = false;
					break;
				default:
					if(data.orderDetail.lanInfoBo){
						$scope.lanNumber=data.orderDetail.lanInfoBo['lanNumber'];
					}
					if($scope.lanNumber==""||$scope.lanNumber==null){
						$scope.isNoShowLanNumber=false;
					}	
			};
			// console.log(data.orderDetail.lanNumberList);
			switch(data.orderDetail.lanNumberList.length){
				case 0:
					$scope.isNoShowNumber =false;
					break;
				default:
					$scope.number =data.orderDetail.lanNumberList[0]['number'];
					if($scope.number==""||$scope.number==null){
						$scope.isNoShowNumber=fasle;
					}
			}
			if($scope.isNoShowLanNumber == false && $scope.isNoShowNumber ==false){
				$scope.isNoShowAllNum=false;
			}
			//宽带信息
			$scope.lanInfoBo=data.orderDetail.lanInfoBo;
			//console.log("$scope.lanInfoBo=="+$scope.lanInfoBo);
			if($scope.lanInfoBo!=null){
				$scope.detailedProductName = $scope.lanInfoBo['detailedProductName'];
				$scope.lanNumber = $scope.lanInfoBo['lanNumber'];
				$scope.lanAmount = $scope.lanInfoBo['lanAmount'];
				$scope.lanActivityName = $scope.lanInfoBo['lanActivityName'];
				$scope.lanActivityPrice = $scope.lanInfoBo['lanActivityPrice'];
				$scope.ftthAmount = $scope.lanInfoBo['ftthAmount'];
			}
			
			//手机号码信息
			$scope.lanNumberList =  data.orderDetail['lanNumberList'];
			for(var i in $scope.lanNumberList){
				if($scope.lanNumberList[i].isNewNumber == '000001'){
					$scope.lanNumberList[i].isNewNumber = '新装';
				}else if($scope.lanNumberList[i].isNewNumber == '000002'){
					$scope.lanNumberList[i].isNewNumber = '纳入';
				}
			}
			//TV信息
			$scope.tvList = data.orderDetail["tvList"];
			//照片信息
			$scope.idCardHeadUrl = data.orderDetail.lanOrderCombineBo['idCardHeadUrl'];
			$scope.imgAdapt($scope.idCardHeadUrl);
			// console.log('照片'+$scope.idCardHeadUrl);
			$scope.customerImgUrl = data.orderDetail.lanOrderCombineBo['customerImgUrl'];
			$scope.imgAdapt($scope.customerImgUrl);
			$scope.signUrl = data.orderDetail.lanOrderCombineBo['signUrl'];
			if($scope.signUrl.substring(25, 29) == 'null'){
	        	$scope.showBtn = true;
	        }else{
	        	$scope.showBtn = false;
	        	$scope.imgAdapt($scope.signUrl);
	        }
			//如果"source == 000008 显示身份证正面照片"
			if(data.orderDetail.source == '000008'){
				$scope.idCardHeadUrl = data.orderDetail.lanOrderCombineBo['idCardImageBackUrl'];
			}
			//获取电子工单编号
			$scope.eleOrder = data.orderDetail.lanOrderCombineBo['eleOrder'];
			//如果电子工单不为空，则显示查看按钮
			if($scope.eleOrder == '' || $scope.eleOrder == null){
				$scope.hasElectronicWorksheets = false;
			}else{
				$scope.hasElectronicWorksheets = true;
			}
			if(($scope.activityName==""||$scope.activityName==null)&&($scope.lanActivityName==""||$scope.lanActivityName==null)){
				$scope.activityNameDd=false;
				localStorage.setItem('activityNameDd','1');
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
			if($scope.amount==null){
				$scope.amount=0;
			}
			if($scope.lanAmount==""||$scope.lanAmount==null){
				$scope.lanAmount=0;
			}
			if($scope.customer==""||$scope.customer==null){
				$scope.customerDiv=false;
			}
			if($scope.contractNumber==""||$scope.contractNumber==null){
				$scope.contractNumberDiv=false;
			}
			if($scope.address==""||$scope.address==null){
				$scope.addressDiv=false;
			}


			//获取电子工单
			$scope.viewElectronicWorksheets = function(){
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
			
		}).error(function () {
			 my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            });
		});
	}
    //console.log("nnnn"+$stateParams.number);
	if(!$stateParams.number){
		$scope.orderCode=localStorage.getItem('orderCode');
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
				// console.log('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+data.orderNo);
            	
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
				// my.alert('<textarea id="text" readonly>http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo='+$scope.orderCode+'</textarea>','','复制链接')
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
    
});