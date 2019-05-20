appService.factory('telList', function($q, $http, $rootScope) {


	return {

		// 获取号码列表
		getTelList:function(params){

			var deferred = $q.defer(),
				promise = deferred.promise,
				progress;

			$http({
				method: 'GET',
				url: ajaxurl + 'numberApp/queryNumberList?token='+ $rootScope.token,
				params: params
			}).success(function(data){
				numberSelect = "-1";
				deferred.resolve(data);
			})
			.error(function(data){
				deferred.reject();
			});
			return promise;
		}
		
	};
});