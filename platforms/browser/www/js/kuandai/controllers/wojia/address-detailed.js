appControllers.controller('kuandai-wojia-address-detailed', function($scope, $state, my) {
	$scope.title = "详细地址";
	$scope.text = {"addressName":kuandai_combination_address["addressName"]};
	$scope.addresslanlist = kuandai_combination_address["detaileds"];
	$scope.data = {clientSide:kuandai_combination_address.detaileds[0]};
	$scope.order = function(){
		if($scope.text.addressName == kuandai_combination_address["addressName"]){
			my.alert('请修改"装机地址"，精确到门牌号。')
		}else{
			kuandai_combination_address["detailed"] = $scope.data.clientSide;
			kuandai_combination_address["detailed"]["pointExchId"] = kuandai_combination_address["detailed"]["pointExchId"] == "" ? kuandai_combination_address["detailed"]["exchCode"] : kuandai_combination_address["detailed"]["pointExchId"];
			kuandai_combination_address["setupaddress"] = $scope.text.addressName;
			$state.go(jump[service_type]["address"]);
		}
	}
});
