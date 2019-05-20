appControllers.controller('user-helper-problem-detail', function($scope,$sce,$http,$state,my,$rootScope) {
	$scope.problemDetail = JSON.parse(localStorage.getItem('problemDetail'));
	$scope.title = $scope.problemDetail.name;
	$scope.showSrc = '';
	$scope.htmlCont = true;
	// 跨域访问url
	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	}
	// $scope.comboUrl='http://www.baidu.com';
	// $scope.comboUrl='http://mp.weixin.qq.com/s/0HIyWg6BS7N9pQTex5A59g';

	$http({
		method:'GET',
		url:ajaxurl + 'helpcenter/queryInfoById?token=' + $rootScope.token,
		params:{
			status:'000001',
			id:$scope.problemDetail.proListId
		}
	}).success(function(data){
		$scope.content = data.data.bo.content;
		if($scope.content.indexOf('href=') != -1){
			$scope.htmlCont = false;
			$scope.showSrc = $scope.content.substring($scope.content.indexOf('href=')+6,$scope.content.indexOf('target=')-2);
			// console.log(insert_item($scope.showSrc,'s',4));
			$scope.wxAntiTheftChain(insert_item($scope.showSrc,'s',4));
			// console.log($scope.content.indexOf('href='));
			// console.log($scope.content.indexOf('target='));
			// console.log($scope.content.substring($scope.content.indexOf('href=')+6,$scope.content.indexOf('target=')-2));
		}
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index');
        });
	});

	//字符串中插入字符
	function insert_item(str,item,index){
		var newstr="";             //初始化一个空字符串
		var tmp=str.substring(0,index);
		var estr=str.substring(index,str.length);
		newstr+=tmp+item+estr;
		return newstr;
	}
	
	//解决微信防盗链
	$scope.wxAntiTheftChain = function(showSrc){
		// showSrc = 'http://www.baidu.com';
		$.ajaxPrefilter( function (options) {
	　　　　if (options.crossDomain && jQuery.support.cors) {
	　　　　 	var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
	　　　　　　options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
	　　　　};
　　　　});
		//跨域请求
		$http.get(showSrc).success(function(response){
	　　　　 var html = response;
	　　　　　html = html.replace(/data-src/g, "src").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '').replace(/https/g,'http');
	　　　　　var html_src = 'data:text/html;charset=utf-8,' + html;
	// 　　　　　$('#frame_main').attr("src" , html_src);
				$scope.comboUrl = html_src;
	    });
	}
	 // new VConsole()
        
})
