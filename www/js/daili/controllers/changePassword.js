appControllers.controller('change-password', function($scope,$http,$state,my,$rootScope) {
	$scope.title = '修改密码';
	$scope.input = {oldPwd:"",newPwd:"",qnewPwd:""};
	$scope.btnTxt = '立即修改';
	$scope.resState = true;
	$scope.checkBtn = '';
	$scope.checkOldPwd = true;
	$scope.loading = false;
	$scope.changeBtn = function(){
		//输入旧密码且验证
		// if($scope.input.oldPwd !== ''){
			// $scope.check = function(){
				// checkOldPwd();
			// };
		// }
		//输入新密码且判断 提交...
		if($scope.input.newPwd == '' || $scope.input.qnewPwd == ''){
			$scope.resState = true;
		}else{
			if($scope.input.newPwd == $scope.input.qnewPwd){
				$scope.resState = false;
				$scope.save = function(){
//					console.log($scope.input.newPwd);
					saveNewPwd();
				}
			}else{
				$scope.resState = true;
			}
			
		}
	};
	//旧密码验证方法
	$scope.checkOldPwd= function(){
		// console.log("1111");
		$http({
			method:'post',
			url:ajaxurl + 'userApp/validatePassword?token=' + $rootScope.token,
			data:{password:$scope.input.oldPwd}
		}).success(function(data){
			//console.log(data);
			// $scope.checkOldPwd = true;
			if(data == true){
				$scope.checkBtn = '密码正确';
				$scope.newPwd = true;
			}else{
				$scope.checkBtn = '密码错误';
				$scope.newPwd = false;
				// my.alert("对不起，密码输入错误，请重新输入！").then(function(){
				// 	// $scope.newPwd = false;
					
				// 	// $scope.checkOldPwd = true;
				// });
				// // $scope.changeBtn();
			}
		});			
	}
	//提交保存
	function saveNewPwd(){
		$scope.btnTxt = '正在提交';
		$scope.resState = true;
		$http({
			method:'post',
			url:ajaxurl + 'userApp/saveNewPassword?token=' + $rootScope.token,
			data:{secondPassword:$scope.input.newPwd}
		}).success(function(data){
			//console.log(data);
			if(data == true){
				my.alert('登录密码修改成功！').then(function(){
					$scope.btnTxt = '立即修改';
					$scope.resState = false;
					$state.go('index_dl');
				});
			}
		});
	}
});