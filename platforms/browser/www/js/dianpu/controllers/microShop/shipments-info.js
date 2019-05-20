appControllers.controller('dianpu-microshop-shipments-info', function($scope,$http,$rootScope,$state,my, $stateParams, $cordovaBarcodeScanner) {
	$scope.title = "发货信息";
	$scope.data={
		orderCode:$stateParams.orderCode,
		expressNo:"",
		companyCode:""
	};
	$scope.companyCodeList=[
		{"name":"顺丰速运","value":"SF"},
		{"name":"申通快递","value":"STO"},
		{"name":"中通快递","value":"ZTO"},
		{"name":"圆通快递","value":"GTO"},
		{"name":"韵达快递","value":"YD"},
		{"name":"邮政快递","value":"YZPY"},
		{"name":"EMS","value":"EMS"},
		{"name":"京东快递","value":"JD"},
		{"name":"百世快递","value":"HTKY"},
		{"name":"天天快递","value":"HHTT"},
		{"name":"全峰快递","value":"QFKD"},
		{"name":"国通快递","value":"YTO"},
		{"name":"优速快递","value":"UC"},
		{"name":"邦德","value":"DBL"},
		{"name":"快捷快递","value":"FAST"},
		{"name":"宅急送","value":"ZJS"},
	];
	$scope.submitForm=function(){
		console.log($scope.data)
		if($scope.data.expressNo==""){
			my.alert('请输入正确的物流单号');
		}else if($scope.data.companyCode==""||$scope.data.companyCode==null){
			my.alert('请选择快递公司');
		}else{
			$http({
				method: 'GET',
				url: ajaxurl + 'wechatShopApp/saveOrderExpressForApp',
				params: {
					orderCode:$scope.data.orderCode,
					expressNo:$scope.data.expressNo,
					companyCode:$scope.data.companyCode.value,
					token: $rootScope.token
				},
				timeout: 5000
			}).success(function(data){
				my.alert('提交成功').then(function(){
					$state.go('dianpu-guide-network-flow-order-details');
				})
			}).error(function () {
				my.alert('数据信息获取失败！请稍后尝试。').then(function(){
					$state.go('index');
				}); 
			});
		}
		
	}
	 //扫描二维码或条形码
     $scope.clientQr = function(){
     	console.log(2222)
        $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                if(barcodeData.text){
                    var orderArr = JSON.parse(barcodeData.text);
                     // $scope.barCode=orderArr;
                     // localStorage.setItem('barCode',$scope.barCode);
                     $scope.data.expressNo=orderArr;
                  	// alert("?11  "+orderArr);
                }else{
                    my.alert("没有找到可识别的二维码！");
                }
            });
    }
})