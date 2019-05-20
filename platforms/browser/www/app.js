var app = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'], function($httpProvider, $ionicConfigProvider) {

    // 解决 $http.post 数据接收不到的坑
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[]';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    // 屏蔽 左右拖动 翻页
    $ionicConfigProvider.views.swipeBackEnabled(false);
});


// // 解决 ng-click 多次触发
// app.config(['$provide', function ($provide) {
// 	$provide.decorator('ngClickDirective',['$delegate','$timeout', function ($delegate,$timeout) {
// 		var original = $delegate[0].compile,
// 			delay = 1500;
// 		$delegate[0].compile = function (element, attrs, transclude) {

// 			var disabled = false;
// 			function onClick(evt) {
// 				if (disabled) {
// 					evt.preventDefault();
// 					evt.stopImmediatePropagation();
// 				} else {
// 					disabled = true;
// 					$timeout(function () { disabled = false; }, delay, false);
// 				}
// 			}
// 			element.on('click', onClick);
// 			return original(element, attrs, transclude);
// 		};
// 		return $delegate;
// 	}]);
// }]);


app.run(function($ionicPlatform, $rootScope, $ionicHistory, $state, $ionicPopup) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            // StatusBar.styleLightContent();
            StatusBar.styleDefault();
        }

        CameraOptions = {
                quality: 70,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                //destinationType: Camera.DestinationType.FILE_URI,
                //sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1500,
                targetHeight: 750,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true,
            }
            // $rootScope.token = "6YIA0REONQYSWOP01ZXTQU3IEUW0JIG7";
            // 登录判断
            /*$rootScope.$on('$stateChangeStart',function(event, toParams, fromState, fromParams, options){
            	if(!$rootScope.isLogin){//判断当前是否登录
            		$state.go("login");//跳转到登录页
            		event.preventDefault(); //阻止默认事件，即原本页面的加载
            	}
            })*/
    });


    // 屏蔽返回键
    $ionicPlatform.registerBackButtonAction(function(e) {
        e.preventDefault();

        function showConfirm() {
            $ionicPopup.confirm({
                title: '退出应用?',
                template: '你确定要退出应用吗?',
                okText: '退出',
                cancelText: '取消'
            }).then(function(res) {
                if (res) { ionic.Platform.exitApp(); } else {}
            });
        }
        showConfirm();
        return false;
    }, 101);
});

var appControllers = angular.module('starter.controllers', []);
var appService = angular.module('starter.services', []);


// 隐藏底部菜单指令
app.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value) {
                    $rootScope.hideTabs = 'tabs-item-hide';
                });
            });
            scope.$on('$ionicView.beforeLeave', function() {
                scope.$watch(attributes.hideTabs, function(value) {
                    $rootScope.hideTabs = 'tabs-item-hide';
                });
                scope.$watch('$destroy', function() {
                    $rootScope.hideTabs = false;
                })
            });
        }
    }
})

app.directive('contenteditable', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
                console.log('111==');
            };

            element.on('blur keyup change', function() {
                scope.$evalAsync(read);
                console.log('222===' + scope.$evalAsync(read))
            });
            read(); // initialize

            function read() {
                var html = element.html();
                if (attrs.stripBr && html == '<br>') { //清除 <br>
                    html = '';
                }
                ngModel.$setViewValue(html);
                console.log('333==' + html);
            }
        }
    };
});