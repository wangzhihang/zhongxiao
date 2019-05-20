appControllers.controller('number-filter', ['$scope', '$http', '$state', function($scope, $http, $state){

	$scope.itemLiDisplay = false;
	$scope.valLiDisplay = true;
	var numberListSource = localStorage.getItem("numberListSource");
	$scope.numberType = numberListSource == "java" ? "java" : "unicomm";
	
	filterSelect["lh_type"] = "-1";
	filterSelect["deposit"] = "-1";

	if(isEmptyObject(filterData)){
		$http({
			method: 'GET',
			url: 'data/number-filter.json',
		}).success(function(data){
			filterData = data;
			$scope.itemList = data;
		}).error(function(data){
		});
	}else{
		// 实时库 不保留状态
		filterData[filterData.length -1]["state"] = true;
		filterData[filterData.length -1]["stateNo"] = false;
		filterData[filterData.length -1]["select"] = [];
		filterData[filterData.length -2]["state"] = true;
		filterData[filterData.length -2]["stateNo"] = false;
		filterData[filterData.length -2]["select"] = [];
		$scope.itemList = filterData;
	}



	$scope.setItem = function(index){
		$scope.itemLiDisplay = true;
		$scope.valLiDisplay = false;

		$scope.activeIndex = index;
		$scope.valList = filterData[index]["val"];
	}


	$scope.setVal = function(_val){
		$scope.itemLiDisplay = false;
		$scope.valLiDisplay = true;

		if(_val[0] == "-1"){
			filterData[$scope.activeIndex]["state"] = true;
			filterData[$scope.activeIndex]["stateNo"] = false;
			filterData[$scope.activeIndex]["select"] = [];
		}else{
			filterData[$scope.activeIndex]["state"] = false;
			filterData[$scope.activeIndex]["stateNo"] = true;
			filterData[$scope.activeIndex]["select"] = _val;
		}
		$scope.itemList = filterData;
	}


	$scope.newTelList = function(){
		filterSelect = {};
		for(var key in filterData){
			if(!filterData[key]["state"]){
				filterSelect[filterData[key]["key"]] = filterData[key]["select"][0];
			}
		}
		$state.go("number-list");
	}

	
	$scope.valSelectClass = function(id){
		if(filterData[$scope.activeIndex]["stateNo"] == true){
			return (id == filterData[$scope.activeIndex]['select'][0]) ? true : false;
		}else{
			return false;
		}
	}
}])