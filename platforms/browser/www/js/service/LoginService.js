appService.factory('LoginService', function($q, $ionicLoading, $ionicPopup) {

	var getLoginPatternJson = function() {
		var patternJson = window.localStorage.getItem('login')
		if(patternJson){
			patternJson = JSON.parse(patternJson);
			return patternJson;
		}else{
			return {};
		}
	};

	return {

		getLoginPattern: function(){
			patternJson = getLoginPatternJson();
			return patternJson["login_pattern"];

		},
		setLoginPattern: function(pattern) {
			patternJson = getLoginPatternJson();
			patternJson["login_pattern"] = pattern;
			window.localStorage.setItem('login', JSON.stringify(patternJson));
		},
		checkLoginPattern: function(pattern) {
			var deferred = $q.defer();
			var promise = deferred.promise;

			promise.success = function(fn) {
				promise.then(fn);
				return promise;
			}
			promise.error = function(fn) {
				promise.then(null, fn);
				return promise;
			}
			
			var old_pattern = arguments[1];
			if(!old_pattern){
				old_pattern = this.getLoginPattern();
			}

			if (pattern == old_pattern) {
				deferred.resolve();
			} else {
				deferred.reject();
			}
			return promise;
		}

	};


});

