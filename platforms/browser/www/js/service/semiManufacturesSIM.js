appService.factory('semiManufacturesSIM', function($q, $http, $rootScope) {


	var semiManufacturesSIMRule = {
		"6100000":{
			"028":{
				"0":{"haoduan":"130","filter":["1302"]},
				"1":{"haoduan":"131"},
				"2":{"haoduan":"132"},
				"3":{"haoduan":"186"},
				"4":{"haoduan":"145"},
				"5":{"haoduan":"155"},
				"6":{"haoduan":"156"},
			},
			"810":{
				"0":{"haoduan":"130","filter":["1302"]},
				"2":{"haoduan":"132"},
				"3":{"haoduan":"156"},
				"4":{"haoduan":"155"},
				"6":{"haoduan":"186"},
				"7":{"haoduan":"145"},
				"9":{"haoduan":"131"},
			}
		},
		"1630000":{
			"981":{
				"0":{"haoduan":"130"},	
				"9":{"haoduan":"131"},	
				"2":{"haoduan":"132"},	
				"3":{"haoduan":"156"},	
				"4":{"haoduan":"155"},	
				"5":{"haoduan":"185"},	
				"6":{"haoduan":"186"},	
				"1":{"haoduan":"176"}
			}
		}
	};

	return {

		rule:function(){
			var deferred = $q.defer(),
				promise = deferred.promise,
				simcard = arguments[0],
				data = false;


			if(semiManufacturesSIMRule[shopInfo.shopBo.city]){
				var cityRule = semiManufacturesSIMRule[shopInfo.shopBo.city];
				data =  cityRule[simcard.substr(10,3)] 
						&& cityRule[simcard.substr(10,3)][simcard.substr(8,1)] 
							? cityRule[simcard.substr(10,3)][simcard.substr(8,1)] 
							: false
			}
			
			if(data){
				deferred.resolve(data);
			}else{
				$http({
					method: 'GET',
					url: ajaxurl + 'card/queryCardByIccid',
					params: {
						 "token":$rootScope.token
						,"iccid":simcard
					}
				}).success(function(return_json){
					if(return_json.code === "0"){
						deferred.resolve({"haoduan":return_json.data.sectionNumber});
					}else{
						deferred.resolve(data);
					}
				})
				.error(function(){
					deferred.resolve(data);
				});
			}
			return promise;
		}

	};
});
