appControllers.controller('gadget-cbss-invoice', function($scope, $state, unicomm_server, $http, $rootScope, $filter, $ionicPopup, my) {
	$scope.title = "CBSS 电子发票";
	$scope.resState = true;
	$scope.loading = true;
	$scope.invoiceLi = true;
	$scope.data = {"tel":"","number":"","payMentTel":"","payMentNumber":"","startDate":"","endDate":""};

	$scope.telChange = function(){
		$scope.data.tel = telFormat($scope.data.tel);
		$scope.data.payMentTel = telFormat($scope.data.payMentTel);
		if($scope.data.tel.replace(/[^\d]/g, "").length >= 11 && $scope.data.payMentTel.replace(/[^\d]/g, "").length >= 11 && $scope.data.startDate && $scope.data.endDate){
			$scope.data.number = $scope.data.tel.replace(/[^\d]/g, "");
			$scope.data.payMentNumber = $scope.data.payMentTel.replace(/[^\d]/g, "");
			$scope.resState = false;
			$scope.loading = true;
		}else{
			$scope.data.number = ""
			$scope.resState = true;
			$scope.loading = true;
		}
	}

	$scope.dateSearch = function(){
		var temp = '<div class="formList f-14">'+
						'<ul>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">开始日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="data.startDate">'+
								'</div>'+
							'</li>'+
							'<li class="rowItem" style="padding:.5rem;">'+
								'<div class="label">结束日期：</div>'+
								'<div class="labelForm">'+
									'<input type="date" class="textBox" min="2016-01-01" ng-model="data.endDate">'+
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
				{text:'取消'},
				{
					text: '<b>确认</b>',
					type: 'button-calm',
					onTap: function() {
						// if($scope.data.startDate == '0000-00-00' || $scope.data.startDate == '0000-00-00'){
						// 	my.alert('请输入开始日期结束日期');
						// }else if($scope.data.startDate > $scope.data.startDate){
						// 	my.alert('对不起，开始日期不能大于结束日期！').then(function(){
						// 		$scope.data.startDate == '0000-00-00';
						// 		$scope.data.startDate == '0000-00-00'
						// 	});
						// }else{
						// }
						$scope.telChange();
					}
				}
			]
		});
	};

	$scope.writeCard = function(){
		$scope.resState = true;
		$scope.loading = false;
		$scope.invoiceLi = true;
		unicomm_server.cbssLogin().then(function(){
			$scope.submit();
		},function(){
			$scope.resState = false;
			$scope.loading = true;
		});
	}

	$scope.submit = function(){
		

		var unicomm_command = new Object();
			unicomm_command.cmd = "cbss_invoice_queryInvoiceList";
			unicomm_command.number = $scope.data.number;
			unicomm_command.startDate = $filter('date')($scope.data.startDate,'yyyy-MM-dd');
			unicomm_command.endDate = $filter('date')($scope.data.endDate,'yyyy-MM-dd');

		unicomm_server.getUnicomm(unicomm_command).then(
			function(return_json){
				console.log(return_json.data)
				if (return_json.status == '1'){
					$scope.baseId = return_json.data.baseId;
					$scope.invoiceList = return_json.data.dataset;
					$scope.invoiceLi = false;
					$scope.loading = true;
				}else{
					my.alert(return_json.data).then(function(){
						$scope.resState = false;
						$scope.loading = true;
					});
				}
			},function(){
				$scope.resState = false;
				$scope.loading = true;
			}
		)
	}
	
	$scope.order = function(i){
		my.loaddingShow("电子发票请求");
		unicomm_server.getUnicomm(
		{
			 "cmd":"cbss_invoice_submitInvoiceInfo"
			,"email":$scope.data.email
			,"number":$scope.data.payMentNumber
			,"baseId":$scope.baseId
			,"tradeId":$scope.invoiceList[i].tradeId
			,"serialNumber":$scope.invoiceList[i].serialNumber
			,"subscribeId":$scope.invoiceList[i].subscribeId
			,"tradeTypeCode":$scope.invoiceList[i].tradeTypeCode
			,"tradeType":$scope.invoiceList[i].tradeType
			,"printTimes":$scope.invoiceList[i].printTimes
			,"userId":$scope.invoiceList[i].userId
			,"custName":$scope.invoiceList[i].custName
			,"acctId":$scope.invoiceList[i].acctId
			,"custId":$scope.invoiceList[i].custId
			,"netTypeCode":$scope.invoiceList[i].netTypeCode
			,"acceptDate":$scope.invoiceList[i].acceptDate
			,"queryMode":$scope.invoiceList[i].queryMode
			,"feeInfo":$scope.invoiceList[i]["feeInfo"]
			,"tradefeeInvoice":$scope.invoiceList[i]["tradefeeInvoice"]
		}).then(function(return_json){
			my.loaddingHide();
			if (return_json.status == '1'){
				my.alert("电子发票已生成，请注意查收短信！");
			}else{
				my.alert(return_json.data);
			}
		},function(data){
			my.loaddingHide();
			my.alert("请求失败，请重新请求");
		})
	}
})