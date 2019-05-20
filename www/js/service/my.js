appService.factory('my', function($q, $ionicLoading, $ionicPopup) {


	return {

		alert:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;


			$ionicLoading.hide();
			$ionicPopup.alert({
				  "title": 	arguments[1] ? arguments[1] : "系统提示"
				, "template": arguments[0]
				, "okText": arguments[2] ? arguments[2] : '我知道了'
				, "okType": 'button-calm'})
			.then(function(){
				deferred.resolve();
			});
			return promise;
		}

		, loaddingShow:function(){
			var t = "";
			if(arguments[0]){
				t = '<p>'+arguments[0]+'</p>';
			}
			$ionicLoading.show({
				"template":'<ion-spinner icon="android"></ion-spinner>' + t
			 });
		}

		, loaddingHide:function(){
			$ionicLoading.hide();
		}

		, confirm:function(){
			var deferred = $q.defer(),
				promise = deferred.promise;


			$ionicLoading.hide();
			$ionicPopup.confirm({
				  "title": arguments[1] ? arguments[1] : "系统提示"
				, "template": arguments[0]
				, "okText": arguments[2] ? arguments[2] : '确定'
				, "cancelText": arguments[3] ? arguments[3] : '取消'
			}).then(function(res){
				if(res){
					deferred.resolve();
				}else{
					deferred.reject();
				}
			})

			return promise;
		}


	};


});