appControllers.controller('salesman-existing-card', function($scope,$rootScope,$cordovaBarcodeScanner,$http,my,$state) {
	$scope.title = '发卡';
	$scope.scanCard=true;
	$scope.showScanCard=true;
	$scope.halfCards = [];
	$scope.scanCards=[];
	$scope.bySendHalfCards=[];
	$scope.scanCardsTotle=[];
	$scope.sites = [
	{'id':1,'type':'勾选'},
	{'id':2,'type':'白卡'},
	{'id':3,'type':'半成卡'}
	];
	$scope.selectedName = 1;
	$scope.choseCardType = function(id){
		$scope.scanCard=false;
		switch(id){
			case 1:
			$scope.checkBySendCard('');
			break;
			case 2:
			$scope.checkBySendCard('000001');
			break;
			case 3:
			$scope.checkBySendCard('000002');
			break;
		}
	}
	$scope.clientQr=function(){
		$scope.scanCard=true;
		$scope.showScanCard=true;
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.scanCards=$scope.scanCards.concat(barcodeData.text);
					for(var i=0;i< $scope.scanCards.length;i++){
						 if ($scope.scanCardsTotle.indexOf($scope.scanCards[i]) == -1){
						 	$scope.scanCardsTotle.push($scope.scanCards[i]);
						 } 
					}
					console.log('scanCardsTotle'+$scope.scanCardsTotle);

					// barcodeData.text=[89860115888402280164,89860115888402280164];
				}else{
					my.alert("没有找到可识别的二维码！");
				}
		});
	}
	//后台传过来的数据
	$scope.checkBySendCard=function(cardType){
		$scope.showScanCard=false;
		$scope.halfCards =[];
		localStorage.setItem('cardType',cardType);
		$http({
			method:'get',
			url:ajaxurl + 'card/querySalesmanHalfCards?token='+ $rootScope.token,
			params:{
				userId:localStorage.getItem('userId'),
				cardType:cardType
			}
			// params:{userId:35540}
		}).success(function(data){
			$scope.halfCards = data['data']['halfCards'] ;
			// console.log($scope.halfCards);
		}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index_dl');
            }); 
        });
	}

	//确定派发
	$scope.confirmSend=function(){
		if($scope.scanCard==true){
			$scope.bySendHalfCards=$scope.scanCardsTotle;
		}else{
			for(var i in $scope.halfCards){
				var aaa=$scope.halfCards[i].aaa;
				if(aaa==true){
					$scope.bySendHalfCards.push($scope.halfCards[i].iccid);
				}
			}
		}
		
		// console.log('bySendHalfCards=='+$scope.bySendHalfCards.length);
		if($scope.bySendHalfCards.length>0){
			localStorage.setItem('cards',$scope.bySendHalfCards);
			$state.go('salesman-send-card');
		}else{
			my.alert('请选择要派发的卡');
		}
		
	}

});