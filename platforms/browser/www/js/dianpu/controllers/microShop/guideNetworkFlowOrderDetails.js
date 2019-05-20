appControllers.controller('dianpu-guide-network-flow-order-details', function($scope, $sce, $http, $state, $rootScope, $ionicPopup, url2base64, my) {
	$scope.title = "号码引流订单详情";
	$scope.orderDetail = [];
	$scope.status = {};
	$scope.getParams = JSON.parse(localStorage.getItem('guideNetworkFlowOrder'));
	$scope.telList = [];
	$scope.showBtnByStatus = true;
	$scope.showFukaBtn = false;

	$scope.sourceList = [
		{ "service_type": "telSelectCBSS", "source": "000004", "name": "CBSS开卡" },
		{ "service_type": "cbssPhoneGiveFee", "source": "000011", "name": "购机赠费" },
		{ "service_type": "groupCbssNumber", "source": "000007", "name": "集团开卡" }
	];
	$scope.select = { "sourceNow": $scope.sourceList[0] };


	// 用户信息
	$scope.SetAuthentication = function() {
		authentication["name"] = $scope.orderDetail.customer["name"];
		authentication["cardId"] = $scope.orderDetail.customer["cardId"];
		authentication["address"] = $scope.orderDetail.customer["address"];
		authentication["birthday"] = $scope.orderDetail.customer["birthday"];
		authentication["police"] = $scope.orderDetail.customer["police"];
		authentication["nation"] = $scope.orderDetail.customer["nation"];
		authentication["gender"] = $scope.orderDetail.customer["sex"];
		authentication["start_date"] = $scope.orderDetail.customer["validStart"];
		authentication["end_date"] = $scope.orderDetail.customer["validEnd"];
		authentication["contractNumber"] = $scope.orderDetail.shopOrder["contactNumber"];
		authentication["idHeadImgUrl"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer["idCardHeadUrl"];
		authentication["customerImageUrl"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer["customerImageUrl"];
		authentication["idCardFrontImage"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer.idCardImageBackUrl;
		authentication["idCardBackImage"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer.idCardImageUrl;
		authentication["sign"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.shopOrder["signName"];
	}
	$scope.orderGo = function() {
		var go = arguments[0];
		if ($scope.orderDetail.liveInfo && $scope.orderDetail.liveInfo.liveBodyImgUrlFirst) {
			authentication["uploadLivePhoto"] = []
			my.loaddingShow('视频图片获取中');
			url2base64.getBase64("http://z.haoma.cn/photo/" + $scope.orderDetail.liveInfo.liveBodyImgUrlFirst).then(function(base64) {
				authentication["uploadLivePhoto"][0] = base64.substring(23);
				url2base64.getBase64("http://z.haoma.cn/photo/" + $scope.orderDetail.liveInfo.liveBodyImgUrlMid).then(function(base64) {
					authentication["uploadLivePhoto"][1] = base64.substring(23);
					url2base64.getBase64("http://z.haoma.cn/photo/" + $scope.orderDetail.liveInfo.liveBodyImgUrlLast).then(function(base64) {
						authentication["uploadLivePhoto"][2] = base64.substring(23);
						$scope.cbss_customer_uploadIdCardPhoto(go);
					}, function() {
						my.loaddingHide();
						my.alert("视频图片不完整!")
					})
				}, function() {
					my.loaddingHide();
					my.alert("视频图片不完整!")
				})
			}, function() {
				my.loaddingHide();
				my.alert("视频图片不完整!")
			})
		} else {
			$scope.goState(go);
		}
	}
	$scope.cbss_customer_uploadIdCardPhoto = function() {
		var go = arguments[0];
		authentication["frontIdCardPath"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer.idCardImageBackUrl;
		authentication["backIdCardPath"] = "http://z.haoma.cn/photo/" + $scope.orderDetail.customer.idCardImageUrl;
		my.loaddingHide();
		$scope.goState(go);
	}

	$scope.goState = function() {
		$state.go('number-list');
		// $state.go(arguments[0] == "zhuka" ? 'number-list' : 'dianpu-cbss-fukaInfo');
	}

	// 无实名 直接受理
	$scope.F2Fmanage = function() {
		empty_filterSelect();
		filterSelect = {};
		reset_dianpu_cbss();
		reset_kuandai_wojia();
		number_pool = "CBSS";
		wx_order = {
			"TMorderCode": $scope.orderDetail.wechatOrder && $scope.orderDetail.wechatOrder.orderCode
		}
		if (arguments[0] == "kaika") {
			order_type = "kaika";
			app = "dianpu";
			service_type = $scope.select.sourceNow.service_type;
			source = $scope.select.sourceNow.source;
			$state.go('number-list');
		} else {
			order_type = "kuandai";
			app = "kuandai";
			wojiaIsronghe = false; // 判断是不是共享套餐
			wojiaRootProductId = arguments[0] ? arguments[0] : "89706086";
			KuandaiMainProductName = "沃家组合";
			service_type = "wojia-combination";
			kuandai_number_into = true;
			reelectNumber = 0;
			$state.go('kuandai-wojia-address-area');
		}
	}

	//线下受理
	$scope.offLineManage = function() {
		$scope.manageTypeList = ["单卡受理", "组合宽带受理"]
		var temp = '<div class="formList f-14">' +
			'<ul>' +
			'<li class="rowItem" style="padding:.5rem;">' +
			'<div class="labelForm">' +
			'<select ng-model="data.manageType" class="width-100" ng-options="item for item in manageTypeList"><option value="">--请选择--</option>' +
			'</select>' +
			'</div>' +
			'</li>' +
			'</ul>' +
			'</div>';
		$ionicPopup.show({
			template: temp,
			title: '线下类型',
			subTitle: '请选择一种您办理的类型',
			scope: $scope,
			buttons: [{
					text: '取消',
					onTap: function() {

					}
				},
				{
					text: '<b>确定</b>',
					type: 'button-calm',
					onTap: function() {
						// console.log('manageType==' + $scope.data.manageType);
						if ($scope.data.manageType == '' || $scope.data.manageType == null) {
							my.alert('请至少选择一种办理类型');
						} else if ($scope.data.manageType == '单卡受理') {
							$scope.F2Fmanage("kaika")
						} else if ($scope.data.manageType == '组合宽带受理') {
							$scope.F2Fmanage()
						}
					}
				},
			]
		});
	}

	//点击办理
	$scope.manage = function() {
		reset_dianpu_bss();
		reset_dianpu_cbss();
		wx_order = {
			"number": $scope.orderDetail.wechatOrder.number,
			"orderCode": $scope.orderDetail.shopOrder.orderCode,
			"productId": $scope.orderDetail.wxPackage.id,
			// "productPrice":$scope.orderDetail.shopOrder && $scope.orderDetail.shopOrder.amount,
			"simNumber": "",
			"TMorderCode": $scope.orderDetail.wechatOrder && $scope.orderDetail.wechatOrder.orderCode,
			"preFee": Number($scope.orderDetail.ylProduct.prePrice)
		}
		order_type = "kaika";
		if ($scope.select.sourceNow.service_type == "groupCbssNumber") {
			app = "jike";
		} else {
			app = "dianpu";
		}
		number_pool = "CBSS";
		GoodHaoma = false;
		service_type = $scope.select.sourceNow.service_type;
		source = $scope.select.sourceNow.source;
		$scope.SetAuthentication();
		authentication["orderNo"] = $scope.orderDetail.shopOrder["orderCode"];
		$scope.orderGo("zhuka");
	}

	$scope.fukaGo = function() {
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "cbssFuka";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS副卡";
		dianpu_order_amount = null;
		$scope.SetAuthentication();

		$scope.fukaNow = arguments[0];

		wx_order["zhukaNumber"] = arguments[1] ? "" : $scope.orderDetail.shopOrder.number;
		wx_order["number"] = $scope.fukaNow.origNumber;
		wx_order["preFee"] = 0;
		wx_order["TMorderCode"] = $scope.orderDetail.wechatOrder && $scope.orderDetail.wechatOrder.orderCode;

		if ($scope.fukaNow.orderNo) {
			authentication["orderNo"] = $scope.fukaNow.orderNo;
			$scope.fukaKaikaGo();
		} else {
			$scope.createOrder();
		}
	}

	$scope.createOrder = function() {
		var data = {
			"name": authentication["name"],
			"cardId": authentication["cardId"],
			"idHeadImg": authentication["idHeadImg"],
			"address": authentication["address"],
			"validStart": authentication["start_date"],
			"validEnd": authentication["end_date"],
			"birthday": authentication["birthday"],
			"sex": authentication["gender"],
			"police": authentication["police"],
			"nation": authentication["nation"],
			"customerImageUrl": authentication["customerImageUrl"],
			"isCbss": "000001",
			"source": source,
			"unicommServer": unicommServer
		}
		data["type"] = "000001";
		data["number"] = $scope.fukaNow.origNumber;
		data["productId"] = "89128067";
		data["productName"] = "4G副卡";
		data["activityId"] = "";
		data["activityName"] = "";
		data["lnglats"] = ",";


		$http({
			"method": 'POST',
			"url": ajaxurl + 'orderApp/createOrder',
			"params": { "token": $rootScope.token },
			"data": data
		}).success(function(data) {
			if (data.status == "1") {
				authentication["orderNo"] = data["orderNo"];
				$http({
					"method": 'GET',
					"url": ajaxurl + 'orderApp/updatePreFormFormalRelByCode',
					"params": {
						"token": $rootScope.token,
						"preOrderCode ": $scope.orderDetail.wechatOrder.orderCode,
						"formalOrderCode": data["orderNo"],
						"handleNumber": $scope.fukaNow.origNumber
					}
				});
				$scope.fukaKaikaGo();
			} else {
				my.alert(data.msg)
			}
		}).error(function() {
			my.alert('保存用户信息失败!');
		});
	}


	$scope.fukaKaikaGo = function() {
		wx_order["orderCode"] = authentication["orderNo"];
		wx_order["productId"] = "89128067";
		order_info = {
			"productId": "89128067",
			"productName": "4G副卡"
		}
		$scope.orderGo();
	}

	$scope.translateStatus = function(e) {
		if ($scope.orderDetail.wechatOrder.status == "000001") {
			if ($scope.orderDetail.wechatOrder.realNameStatus == "000100") {
				// 代开卡
				$scope.status = {
					"txt": "待开卡",
					"class": "goingStatus",
					"btn": { "giveUp": true, "manage": false, "fuka": true }
				}
			} else {
				// 代实名
				$scope.status = {
					"txt": "待实名",
					"class": "goingStatus",
					"btn": { "giveUp": true, "manage": true }
				}
				$scope.showBtnByStatus = false;
			}
		} else if ($scope.orderDetail.wechatOrder.status == "000100") {
			$scope.status = {
					"txt": "开卡成功",
					"class": "finishStatus",
					"btn": { "manage": false, "fuka": true }
				}
				// 物流单号
			if ($scope.orderDetail.orderExpress) {
				$scope.status.txt += ",已发货";
				$scope.status.ifShowfFinish = true;

			} else {
				$scope.status.txt += ",未发货";
				$scope.status.ifShowSend = true;
			}
		} else if ($scope.orderDetail.wechatOrder.status == "000199") {
			// 订单成功
			$scope.status = {
				"txt": "订单完成",
				"class": "finishStatus",
				"btn": { "manage": false }
			}
		} else if ($scope.orderDetail.wechatOrder.status == "000200") {
			// 订单已取消
			$scope.status = {
				"txt": "订单取消",
				"class": "unfinishedStatus",
				"cancelValue": true,
				"btn": { "manage": false }
			}
		}
		if ($scope.telList.length > 0) {
			$scope.telList = $scope.telList;
			for (var i in $scope.telList) {
				if ($scope.telList[i].status == '000003') {
					$scope.telList[i].showManage = true;
				} else {
					$scope.telList[i].showManage = false;
				}
			}
			$scope.showFukaBtn = $scope.telList.length === 1 ? true : false;
		} else {
			$scope.telList.push({ "origNumber": $scope.orderDetail.wechatOrder.number, "go": $scope.status.btn.manage, "txt": $scope.status.txt });
			var tilList = JSON.parse($scope.orderDetail.wechatOrder.choiceNumbers);
			for (var i in tilList) {
				$scope.telList.push({ "origNumber": String(tilList[i][0]), "go": true, "orderNo": tilList[i][1] })
			}
			for (var i in $scope.telList) {
				if ($scope.telList[i].go == true) {
					$scope.showManage = false;
				} else {
					$scope.showManage = true;
				}
				if ($scope.telList[i].txt == '待实名') {
					$scope.showBtnByStatus = false;
				} else if ($scope.telList[i].txt == '订单取消') {
					$scope.showBtnByStatus = false;
				}
			}
		}
	}

	$scope.order = function(i, fuka) {
		if (i || fuka) {
			$scope.fukaGo($scope.telList[i], fuka);
		} else {
			$scope.manage();
		}
	}

	//适配宽照片
	$scope.imgAdapt = function(imgSrc) {
		var img = new Image();
		img.src = imgSrc;
		img.onload = function() {
			if (img.width > img.height) {
				$scope.imgProp = {
					'max-height': '27vw',
					'height': '110px'
				}
			}
		}
	}


	$http({
		method: 'GET',
		url: ajaxurl + 'wechatShopApp/findBlankOrderDetail',
		params: {
			orderCode: $scope.getParams[0],
			token: $rootScope.token
		},
		timeout: 5000
	}).success(function(data) {

		if (data.code === 0) {
			$scope.orderDetail = data['data'];
			if ($scope.orderDetail.numberList) {
				$scope.telList = $scope.orderDetail.numberList;
			}
			if ($scope.orderDetail.customer) {
				$scope.imgAdapt('http://z.haoma.cn/photo/' + $scope.orderDetail.customer.idCardHeadUrl);
				$scope.imgAdapt('http://z.haoma.cn/photo/' + $scope.orderDetail.customer.customerImageUrl);
				if ($scope.orderDetail.customer.signName == 'null') {
					$scope.showBtn = true;
				} else {
					$scope.showBtn = false;
					$scope.imgAdapt('http://z.haoma.cn/photo/' + $scope.orderDetail.customer.signName);
				}
				$scope.validStart = $scope.orderDetail.customer.validStart?$scope.orderDetail.customer.validStart:""
				$scope.validEnd = $scope.orderDetail.customer.validEnd?$scope.orderDetail.customer.validEnd:"";
			}
			if ($scope.orderDetail.liveInfo && $scope.orderDetail.liveInfo.customerVideoUrl) {
				$scope.showLookVideo = true;
				$scope.customerVideoUrl = $sce.trustAsResourceUrl('http://z.haoma.cn/photo/' + $scope.orderDetail.liveInfo.customerVideoUrl);
			} else {
				$scope.showLookVideo = false;
			}
			if ($scope.orderDetail.customer) {
				$scope.showCustomInfo = true;
			}

			$scope.translateStatus();
		}
	}).error(function() {
		my.alert('数据信息获取失败！请稍后尝试。').then(function() {
			$state.go('index');
		});
	});

	//点击图片放大
	$scope.isNoShowHeader = false;
	$scope.changePic = function(params) {
			if (params == 1) {
				$scope.bigSizePic = 'http://z.haoma.cn/photo/' + $scope.orderDetail.customer.idCardImageBackUrl;
			} else if (params == 2) {
				$scope.bigSizePic = 'http://z.haoma.cn/photo/' + $scope.orderDetail.customer.idCardImageUrl;
			} else {
				$scope.bigSizePic = 'http://z.haoma.cn/photo/' + $scope.orderDetail.customer.customerImageUrl
			}
			var img = new Image();
			img.src = $scope.bigSizePic;
			img.onload = function() {
				if (img.width > img.height) {
					$scope.bigPic = {
						'margin': 'auto',
						'width': '85%',
						'height': '56%'
					}
				}
			}
			$scope.isShowBigPic = true;
			$scope.isNoShowHeader = true;
		}
		//关闭放大图片
	$scope.closeBigPic = function() {
		$scope.isShowBigPic = false;
		$scope.isNoShowHeader = false;
	}

	//取消订单
	$scope.goCancelOrder = function() {
			$state.go('dianpu-microshop-cancel-order-reason', { orderCode: $scope.getParams[0] });
		}
		//发货
	$scope.send = function() {
			$state.go("dianpu-microshop-shipments-info", { orderCode: $scope.getParams[0] })
		}
		//订单完成
	$scope.orderFinish = function() {

		$ionicPopup.confirm({
			title: '系统提示',
			template: '您确实要设置成为订单完成状态吗?',
			buttons: [
				{ text: '取消' },
				{
					text: '<b>确定</b>',
					type: 'button-positive',
					onTap: function(e) {
						$http({
							method: 'POST',
							url: ajaxurl + 'wechatShopApp/modifyTmWechatNumPreorderInfo',
							params: {
								orderCode: $scope.getParams[0],
								status: "000199",
								token: $rootScope.token
							},
							timeout: 5000
						}).success(function() {
							my.alert('设置成功').then(function() {
								$state.go('dianpu-guide-network-flow-order');
							})
						}).error(function() {
							my.alert('数据信息获取失败！请稍后尝试。').then(function() {
								$state.go('index');
							});
						});
					}
				},
			]
		});
	}

	//获取补签名链接
	$scope.supplySignature = function() {
		$http({
			method: 'get',
			url: ajaxurl + 'orderApp/getQrCode4AuthOrder?token=' + $rootScope.token,
			params: {
				'orderNo': $scope.getParams[0]
			}
		}).success(function(data) {
			if (data.result == true) {
				cordova.ThemeableBrowser.open('http://z.haoma.cn/tms-weixin-war/remoteFaceIn/toSignEditPage?orderNo=' + data.orderNo,
					' _self', {
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
			}
		}).error(function() {
			my.alert('服务器信息获取失败！');
		});
	}

	$scope.data = {
		remark: "",
		manageType: ""
	};
	$scope.meal = {
		product: "",
		activity: "",
		prestored: 0,
		number: ""
	}

	//添加备注
	$scope.addRemark = function() {
		$ionicPopup.show({
			template: '<input type="text" ng-model="data.remark" placeholder="请输入备注">',
			title: '添加备注',
			scope: $scope,
			buttons: [
				{ text: '取消' },
				{
					text: '<b>确定</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.remark) {
							e.preventDefault();
						} else {
							$http({
								method: 'POST',
								url: ajaxurl + 'wechatShopApp/modifyTmWechatNumPreorderInfo',
								params: {
									orderCode: $scope.getParams[0],
									remark: $scope.data.remark,
									token: $rootScope.token
								}
							}).success(function(data) {
								if (data.data) {
									my.alert('添加成功！').then(function() {
										$state.go("dianpu-guide-network-flow-order");
									});
								}
							})
						}
					}
				},
			]
		});
	}


	//套餐列表
	$scope.getMealList = function() {
		$http({
			method: 'GET',
			url: ajaxurl + "productForApp/queryUnicommProductForApp?token=" + $rootScope.token
		}).success(function(data) {
			$scope.mealList = data.data;
		})
	}
	$scope.getMealList();
	//活动列表
	$scope.replaceActivey = function(meal) {
			$http({
				method: 'GET',
				url: ajaxurl + 'productForApp/queryActivityProductByProductCode',
				params: {
					productId: meal.product.productId,
					token: $rootScope.token
				}
			}).success(function(data) {
				$scope.activeyList = data.data;
			})
		}
		//更换套餐
	$scope.replaceMeal = function() {

			var temp = '<select style="width:100%;padding:5px" ng-change="replaceActivey(meal)" ng-model="meal.product" ng-options="item.productName for item in mealList" value="item for item in mealList">' +
				'<option value="">请选择套餐</option>' +
				'</select>';

			$ionicPopup.show({
				template: temp,
				title: '更换套餐',
				scope: $scope,
				buttons: [
					{ text: '取消' },
					{
						text: '<b>确定</b>',
						type: 'button-calm',
						onTap: function() {
							if ($scope.productId == '') {
								my.alert('请选择套餐');
							} else {
								if ($scope.meal.activity == null) {
									$scope.meal.activity = {
										productId: "",
										productName: ""
									}
								}
								console.log('?????==' + $scope.meal.product.prePrice);
								$http({
									method: 'GET',
									url: ajaxurl + 'productForApp/modifyShopNumberPackageInfo',
									params: {
										orderCode: $scope.getParams[0],
										// productId:$scope.meal.product.productId,
										productName: $scope.meal.product.productName,
										ylProductId: $scope.meal.product.id,
										// activityCode :$scope.meal.activity.productId,
										// activityName :$scope.meal.activity.productName,
										token: $rootScope.token
									}
								}).success(function(data) {
									if (data.data) {
										$scope.orderDetail.wechatOrder.amount = $scope.meal.product.prePrice;
										$scope.orderDetail.wxPackage.id = $scope.meal.product.productId;
										my.alert('更换套餐成功！').then(function() {
											$state.go("dianpu-guide-network-flow-order");
										});
									}
								})
							}
						}
					},
				]
			});
		}
		//更改预存
	$scope.updatePrestored = function() {
			var temp = '<input type="text" class="bd pl-10" ng-model="meal.prestored"/>';
			$ionicPopup.show({
				template: temp,
				title: '更改预存',
				subTitle: '输入更改的预存',
				scope: $scope,
				buttons: [
					{ text: '取消' },
					{
						text: '<b>确定</b>',
						type: 'button-calm',
						onTap: function() {
							// $scope.orderDetail.wechatOrder.amount = $scope.meal.prestored;
							$scope.orderDetail.ylProduct.prePrice = $scope.meal.prestored;
						}
					},
				]
			});
		}
		//号码输入格式
	$scope.telChange = function() {
		$scope.meal.number = telFormat($scope.meal.number);
	};
	//更改号码
	$scope.updateNumber = function() {
			$scope.meal.number = '';
			var temp = '<input type="tel" class="bd pl-10" ng-model="meal.number" ng-keyup="telChange()" placeholder="输入11位手机号码"/>';
			$ionicPopup.show({
				template: temp,
				title: '更改号码',
				subTitle: '输入更改的号码',
				scope: $scope,
				buttons: [{
						text: '取消',
						onTap: function() {
							$scope.meal.number = '';
						}
					},
					{
						text: '<b>确定</b>',
						type: 'button-calm',
						onTap: function() {
							if ($scope.meal.number.replace(/[^\d]/g, "").length == 11) {
								$scope.orderDetail.wechatOrder.number = $scope.meal.number.replace(/[^\d]/g, "");
								$scope.telList[0].origNumber = $scope.meal.number.replace(/[^\d]/g, "");
								$scope.translateStatus();
							} else {
								my.alert('请输入正确的号码');
							}
						}
					},
				]
			});
		}
		//查看视频
	$scope.lookVideo = function() {
			$scope.showView = true;
		}
		//关闭视频
	$scope.closeVideo = function() {
		$scope.showView = false;
	}

})


//放弃订单
// $scope.giveUp=function(){
// 	$scope.orderStatus="000003";
// 		var confirmPopup = $ionicPopup.confirm({
// 		title: '提示信息',
// 		template: '你确定要放弃订单吗?',
// 		buttons: [
// 			{ text: '取消' },
// 			{
// 				text: '<b>确定</b>',
// 				type: 'button-positive',
// 				onTap: function() {
// 				$http({
// 					method:'GET',
// 					url:ajaxurl + '/wechatShopApp/updatePreorderStatus?token=' + $rootScope.token,
// 					params:{orderCode:$scope.orderDetail.wechatOrder.orderCode, orderStatus:"000200"}
// 				}).success(function(data){
// 					my.alert('订单已放弃！');
// 				});
// 				}
// 			},
// 			]

// 		});
// 		confirmPopup.then(function(res) {

// 		});
// }