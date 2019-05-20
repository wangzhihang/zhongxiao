appService.factory('ble_identity', function($q, ble) {

	var sortingIdentity = function(data){

		authentication["name"]		= data["list"]["name"];		// 姓名
		authentication["gender"]	= data["list"]["gender"];	// 性别
		authentication["nation"]	= data["list"]["nation"];	// 民族
		authentication["birthday"]	= data["list"]["birthday"];
		authentication["address"]	= data["list"]["address"];
		authentication["cardId"]	= data["list"]["cardId"];
		authentication["police"]	= data["list"]["police"];	// 签证机关
		authentication["start_date"]= data["list"]["start_date"];
		authentication["end_date"]	= data["list"]["end_date"];
		authentication["idHeadImg"]	= data["list"]["idHeadImg"];
		authentication["dn"]		= data["list"]["dn"];
	};

	return {

		BLEfind:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;
			ble.BLEfind().then(function(Device){
				deferred.resolve(Device)
			},function(){
				deferred.reject();
			})
			return promise;
		},

		BLEreadIdentity:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;

			

			ble.BLEreadIdentity().then(function(data){

			
				if(endDateDiff(data.list["end_date"])){
					sortingIdentity(data);
					deferred.resolve();
				}else{
					deferred.reject("身份证已过期!");
				}
			}, function(){

			
				deferred.reject("身份信息获取失败,请重新放置居民身份证!");
			})
			return promise;
		}
	};

});