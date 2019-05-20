appControllers.controller('dianpu-recharge-number', function($scope, $ionicPopup, $ionicLoading, $http, $rootScope, unicomm_server, my) {

	$scope.title = "号码充值";
	$scope.data = {"tel":"", "number":"", "money":"0"};

	$scope.customer = "";	// bss | cbss
	$scope.queryparam = {};	// bss 获取信息

	$scope.moneyList = [];
	var moneyArr = [1,10, 30, 50, 100];
	// var moneyArr = [1];
	for(i in moneyArr){
		$scope.moneyList.push({"money":moneyArr[i], "select":false})
	}


	$scope.loading = true;
	$scope.resState = true;			// 提交状态
	$scope.moneyListShow = true;	// 充值金额列表
	$scope.repeatToken  = "";
	$scope.orderCode = null;



	//输入手机号码
	$scope.haoduan = ["185","186","155","156","130","131","132","175","176"];
	$scope.telChange = function(){
		var len = 11;
		$scope.data["number"] = String($scope.data["tel"]).replace(/[^\d]/g, "");
		if(String($scope.data["number"].substring(0,1)) === "1"){
			$scope.data["tel"]=telFormat($scope.data["tel"]);
		}else if (String($scope.data["number"].substring(0,1)) === "0") {
			if(String($scope.data["number"].substring(1,2)) === "2"){
				$scope.data["tel"]=telFormat($scope.data["tel"]);
			}else if (String($scope.data["number"].substring(1,2)) === "9") {
				$scope.data["tel"]=telFormat($scope.data["tel"], 12, [3, 7]);
				len = 12;
			}else{
				$scope.data["tel"] = "0";
			}
		}else{
			$scope.data["tel"] = "";
		}

		if(String($scope.data["tel"]).replace(/[^\d]/g, "").length >= len){
			$scope.bss_getcustomerinfo();
			$scope.getcustomerinfoDiv("hide");
			$scope.loading = false;
		}else{
			$scope.getcustomerinfoDiv("hide");
			$scope.loading = true;
			$scope.userName = "";
			$scope.queryparam = {}
		}
	};

	$scope.selectedMoney = function(index){
		$scope.data["money"] = $scope.moneyList[index].money;
		for(i in $scope.moneyList){
			$scope.moneyList[i].select = (i == index) ? true : false;
		}
	}


	// 查询号码 确认bss或cbb可充值
	$scope.bss_getcustomerinfo = function(){
		unicomm_server.bssLogin().then(function(developCode){

			unicomm_server.getUnicomm({
				  "cmd":"bss_fee_getcustomerinfo"
				, "number":$scope.data["number"]
			}).then(function(return_json){
				if(return_json.status == "1"){
					$scope.customer = "bss";
					$scope.userName = return_json.data.name;
					$scope.queryparam = return_json.data;
					$scope.getcustomerinfoDiv("show");
					$scope.loading = true;
					$scope.repeatToken = return_json.repeatToken;
				}else{
					$scope.cbss_getcustomerinfo();
				}
			}, function() {
				$scope.cbss_getcustomerinfo();
			})

		}, function(){
			$scope.cbss_getcustomerinfo();
		})
	}
	
	$scope.cbss_getcustomerinfo = function(){
		unicomm_server.cbssLogin().then(
			function(){
				unicomm_server.getUnicomm({
					  "cmd":"cbss_fee_getcustomerinfo"
					, "number":$scope.data["number"]
					, "developcode":cbssInfo["developCode"]
					, "developname":cbssInfo["developName"]
				}).then(function(return_json){
					if(return_json.status == "1"){
						$scope.customer = "cbss";
						$scope.userName = return_json.data;
						$scope.getcustomerinfoDiv("show");
						$scope.loading = true;
						$scope.repeatToken = return_json.repeatToken;
					}else{
						my.alert(return_json.data);
					}
				});
			}
			)
	}

	// 充值
	$scope.bss_fee_payfee = function(){

		unicomm_server.getUnicomm({
				  "cmd":"bss_fee_payfee"
				, "citycode":$scope.queryparam["citycode"]
				, "accountid":$scope.queryparam["accountid"]
				, "serviceKind":$scope.queryparam["serviceKind"]
				, "customerid":$scope.queryparam["customerid"]
				, "userid":$scope.queryparam["userid"]
				, "name":$scope.queryparam["name"]
				, "number":String($scope.data["number"])
				, "money":String($scope.data["money"])
				, "repleattoken":$scope.repeatToken
			}).then(
				function(result_json){
					if(result_json.status == "1"){
						// if(result_json.data.indexOf("失败") == -1 && result_json.data.indexOf("错误") == -1 ){
						// 	$scope.updateOrder();
						// }else{
						// 	my.alert(result_json.data);
						// }
						$scope.updateOrder();
					}else{
						my.alert(result_json.data);
					}
				}
			)
			
	}

	$scope.cbss_fee_payfee = function(){

		unicomm_server.getUnicomm({
			  "cmd":"cbss_fee_payfee"
			, "developcode":cbssInfo["developCode"]
			, "developname":cbssInfo["developName"]
			, "number":$scope.data["number"]
			, "money":String($scope.data["money"])
			, "repleattoken":$scope.repeatToken
		}).then(
			function(result_json){
				if(result_json.status == "1"){
					// if(result_json.data.indexOf("失败") == -1 && result_json.data.indexOf("错误") == -1 ){
					// 	$scope.updateOrder();
					// }else{
					// 	my.alert(result_json.data);
					// }
					$scope.updateOrder();
				}else{
					my.alert(result_json.data);
				}
			}
		)
			
	}


	$scope.updateOrder = function(){
		$ionicLoading.hide();
		$http({
			method: 'POST',
			url: ajaxurl+ 'shopAndroid/updateShopBanlaceAndAgencyBanlace?token='+$rootScope.token,
			data: {"orderCode":$scope.orderCode}
		}).success(function(data){
			my.alert("充值成功");
		}).error(function(data){
			my.alert("充值成功,回写代理订单失败");
		});
	}


	//充值确认
	$scope.recharge = function(){

		if($rootScope.isShowsetTab === false || userBo.testTag == "000001"){

			$ionicPopup.confirm({
				"title": '充值确认',
				"template": '将为手机['+$scope.data["number"]+'],充值['+$scope.data["money"]+']元！',
				"okText":'确认',
				"cancelText":'取消'
				}).then(
					function(res) {
						if(res){
							// 余额开始
							if($rootScope.isShowsetTab === false){
								$scope.insertOrder();
							}else{
								$ionicLoading.show({"content": '充值中',"animation": 'fade-in'});
								$http({
									url:ajaxurl+ "shopAndroid/validateRechargeBalance?token=" + $rootScope.token,
									type:"get",
									params:{"amount":$scope.data["money"]}
								}).success(function(data){
									if(data.result == "1"){
										$scope.insertOrder();
									}else{
										my.alert("店铺余额不足。");
									}
								}).error(function(){
									my.alert("校验店铺余额失败!");
								});
							}
							// 余额结束
						}else{ 
						}
					}
				);
			
		}else{
			my.alert('由于贵店铺上级代理商未进行账务设置，出于安全考虑，暂不支持充值业务。');
		}
		
	};

	$scope.insertOrder = function(){
		$http({
			url:ajaxurl+ "chargeOrderApp/insertAndGetRechargeOrderNo?token=" + $rootScope.token,
			method : "POST",
			data:{
				  "number": $scope.data["number"]
				, "amount":  $scope.data["money"]
				, "customer":$scope.userName
				, "category":($scope.customer == "bss" ? "000005" : "000006")}
		}).success(function(return_json){
			$scope.orderCode = return_json.orderCode;
			if($scope.customer == "bss"){
				$scope.bss_fee_payfee();
			}else if($scope.customer == "cbss"){
				$scope.cbss_fee_payfee();
			}else{
				//
			}		
		}).error(function(){
			my.alert("订单服务器连接失败!");
		});
	}


		
		// var myPopup = $ionicPopup.show({
		//  template: '<input type="password" ng-model="data.payPwd" placeholder="请输入支付密码">',
		//  title: '请输入支付密码',
	 //     subTitle: '请输入六位支付密码',
		//  scope: $scope,
		//  buttons: [
		//    { text: '取消' },
		//    {
		// 	 text: '<b>去支付</b>',
		// 	 type: 'button-calm',
		// 	 onTap: function(e) {
		// 	   if (!$scope.data.payPwd) {
		// 		 e.preventDefault();
		// 	   } else {
		// 		 return $scope.data.payPwd;
		// 	   }
		// 	 }
		//    },
		//  ]
	 //   });
	 //   myPopup.then(function(res) {
		// 	$ionicLoading.show({"template":res});
		// 	//$timeout(function () {$ionicLoading.hide();}, 1500);
	 //   });
	

	$scope.getcustomerinfoDiv = function(type){
		if(type == "hide"){
			$scope.moneyListShow = true;
			$scope.resState = true;
		}else{
			$scope.moneyListShow = false;
			$scope.resState = false;
		}
	}

	$scope.fee_payfeeDiv = function(type){
		if(type == "hide"){
			$scope.moneyListShow = true;
			$scope.resState = true;
		}else{
			$scope.moneyListShow = false;
			$scope.resState = false;
		}

	}
})