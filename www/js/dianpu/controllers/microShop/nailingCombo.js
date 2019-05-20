appControllers.controller('dianpu-nailing-combo', function($scope) {
	$scope.title = "钉钉卡预约";
	$scope.showDetail1=false;
	$scope.showDetail2=false;
	$scope.showDetail3=false;
	$scope.showCardDetail1=true;
	$scope.showCardDetail2=false;
	$scope.showCardDetail3=false;
	$scope.tag = {
		current: "1"
	};
	$scope.isShowCardDetail=function(param){
		$scope.tag.current = param;
		if(param==1){
			$scope.showCardDetail1=true;
			$scope.showCardDetail2=false;
			$scope.showCardDetail3=false;
		}
		if(param==2){
			$scope.showCardDetail1=false;
			$scope.showCardDetail2=true;
			$scope.showCardDetail3=false;
		}
		if(param==3){
			$scope.showCardDetail1=false;
			$scope.showCardDetail2=false;
			$scope.showCardDetail3=true;
		}
	}
	$scope.isShowDetail=function(param){
		if(param==1){
			$scope.showDetail1=!$scope.showDetail1;
			$scope.showDetail2=false;
			$scope.showDetail3=false;
		}
		if(param==2){
			$scope.showDetail1=false;
			$scope.showDetail2=!$scope.showDetail2;
			$scope.showDetail3=false;
		}
		if(param==3){
			$scope.showDetail1=false;
			$scope.showDetail2=false;
			$scope.showDetail3=!$scope.showDetail3;
		}
	}

	
})