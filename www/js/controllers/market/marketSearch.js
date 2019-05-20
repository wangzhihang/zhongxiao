appControllers.controller('market-search', function($scope,$state) {
	$scope.title ='搜索';
	
	
	$scope.fruitClick=function(){
		$state.go('market-lists',{"typeCode":'SG0001'})
	}
	$scope.phoneClick=function(){
		$state.go('market-lists',{"typeCode":'SJ0001'})
	}
	$scope.phonePartsClick=function(){
		$state.go('market-lists',{"typeCode":'PJ0001'})
	}
	
	
	$scope.search=function(keyword){
		console.log(keyword)
		$state.go('market-lists',{"typeCode":'',"keyword":keyword})
	}
});