appControllers.controller('kuandai-wojia-order-confirm-1', function($scope, $state, $ionicPopup, $http){
	$scope.title = "订单信息确认";
	$scope.input = {
		"preCharge":"",
		"materialFee":""
	}
	//修改号码预存
	$scope.editTelPreCharge = function(i) {
		if(!wojiaIsronghe){
			$ionicPopup.show({
				"template": '<input type="tel" ng-model="input.preCharge" placeholder="金额不能少于'+kuandai_tel[i].leastPreCharge+'元">',
				"title": '输入<'+kuandai_tel[i].tel+'>预存金额',
				"scope": $scope,
				"buttons":[
					{"text":'取消'},
					{
						"text": '<b>确认</b>',
						"type": 'button-calm',
						"onTap": function(e) {
							if (!$scope.input.preCharge) {
								e.preventDefault();
							} else {
								kuandai_tel[i].preCharge = Number($scope.input.preCharge > kuandai_tel[i].leastPreCharge ? $scope.input.preCharge : kuandai_tel[i].leastPreCharge);
								// 临时跟两个工号 开放预存顺便填
								if(cbssInfo.username == "141690691" || cbssInfo.username == "141690627"){
									kuandai_tel[i].preCharge = $scope.input.preCharge;
								}

								for(var ii in $scope.telList){
									if(Number($scope.telList[ii]["tel"]) == Number(i)){
										$scope.telList[ii]["preCharge"] = kuandai_tel[i].preCharge;
									}
								}
								$scope.input.preCharge = "";
								$scope.orderinfoFee();
							}
						}
					},
				]
			});
		}
	}
	//修改备注
	$scope.updateRemark = function(){
		$scope.input = {
			"remark":$scope.orderinfo.remark
		}
		var temp = '<textarea class="bd pl-10" ng-model="input.remark" style="min-height:27vh;" placeholder="输入备注信息"></textarea>';
		$ionicPopup.show({
			template: temp,
			title: '更改备注',
			subTitle: '输入要更改的备注',
			scope: $scope,
			buttons: [
				{ 	text: '取消',
					onTap:function(){
						$scope.orderinfo.remark = $scope.orderinfo.remark;
					}
				},
				{
					text: '<b>确定</b>',
					type: 'button-calm',
					onTap: function() {
						$scope.orderinfo.remark = $scope.input.remark;
					}
				},
			]
		});
	}
	//取消工料费
	$scope.cancelMaterialFee = function() {
		if(wx_order.orderCode){
			return;
		}
		$ionicPopup.show({
			"template": '<input type="tel" ng-model="input.materialFee" placeholder="请修改工料费">',
			"title": '输入工料费',
			"scope": $scope,
			"buttons":[
				{"text":'取消',
					"onTap": function(e) {
						$scope.input.materialFee = '';
					}
				},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						$scope.orderinfo.fee_8234 = $scope.input.materialFee;
						kuandai_combination.fee_8234 = $scope.input.materialFee;
					}
				},
			]
		});
	}

});
