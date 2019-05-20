appControllers.controller('dianpu-microshop-order-redeploy', function($scope, my,$http,$rootScope,$stateParams,$ionicPopup) {
    $scope.title = "装维人员信息";
    $scope.orderCode=$stateParams.orderCode;
    $scope.orderList=[];
    // console.log("22",JSON.parse( localStorage.getItem("redeployList")))
    if(JSON.parse( localStorage.getItem("redeployList"))){
        $scope.orderList=JSON.parse( localStorage.getItem("redeployList"));
    }
    $scope.input={
        "userName":""
    };
    

    //获取数据
    $scope.getData=function(){
        $scope.orderList=[];
        $http({
            "method":'GET',
            "url":ajaxurl + 'wechatShopApp/queryExchUserInfoByUserName',
            "params":{
                 "token":$rootScope.token
                ,"userName":$scope.input.userName
            }
        }).success(function(data){
            $scope.loading = false;
            $scope.orderList=data.data;
            localStorage.setItem("redeployList",JSON.stringify($scope.orderList))
        }).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。'); 
        });
    }
    //查找
    $scope.inputKeyWords=function(){
        if($scope.input.userName==""){
            my.alert("请输入工号！");
        }else{
            $scope.loading=true;
            $scope.getData(); 
        }
    }

    $scope.modifyInfo=function(i){
        $ionicPopup.confirm({
            title: '转派录单人员信息',
            template: '确定要转派?',
            buttons: [
                { text: '取消' },
                {
                  text: '<b>确定</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    // console.log($scope.orderList[i])
                    $scope.content=" 【号码之家】"+ $scope.orderList[i].realName +"您好,您有一笔新的宽带派单，请登录app查看，并及时联系客户约定装机时间。";
                    $scope.sendMsg($scope.orderList[i].userId,$scope.orderList[i].userName, $scope.content,$scope.orderCode,i);
                  }
                },
              ]
          });
    }
    //确定转派
    $scope.entrueRedeploy=function(i){
        $http({
            "method":'GET',
            "url":ajaxurl + 'wechatShopApp/modifyLanPreOrderByOrderCode',
            "params":{
                 "token":$rootScope.token
                ,"orderCode":$scope.orderCode
                ,"realRecordUser":$scope.orderList[i].userName
            }
        }).success(function(data){
            my.alert('转派成功'); 

        }).error(function () {
            my.alert('数据信息获取失败！请稍后尝试。'); 
        });
    }
    //发送短息
    $scope.sendMsg=function(userId,number,content,orderCode,i){
        $http({
            "method":'POST',
            "url":ajaxurl + 'lanPreorderApp/sendMsgInfo',
            "params":{
                 "token":$rootScope.token
                ,"userId":userId
                ,"number":number
                ,"content":content
                ,"orderCode":orderCode
            }
        }).success(function(data){
            $scope.entrueRedeploy(i);
        }).error(function () {
            my.alert('发送短息失败'); 
        });
    }
});