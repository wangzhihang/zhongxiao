appControllers.controller('dianpu-grap-order-detail', function($scope,$ionicLoading,$state,$rootScope, $http, $ionicPopup,my) {
      $scope.title = '抢单详情';
      $scope.btnIsHide=true;
      $scope.btnIsShow = false;
      $scope.userId=userBo.userId;
      $scope.loading=false;
      getData();
      function getData(){
          // $ionicLoading.show({template: '数据加载中...'});
          $http({
            method: 'GET',
            url: ajaxurl + "unicomShareApp/toPreorderDetailByOrderCode?token=" + $rootScope.token,
            params: {"orderCode":order["orderCode"]},
            timeout: 5000
          }).success(function(data){
            $scope.loading=true;
            // $ionicLoading.hide();
           // console.log(JSON.stringify(data));
            $scope.orderCode = data.orderInfo['orderCode'];
            $scope.number = data.orderInfo['number'];
            $scope.productName = data.orderInfo['productName'];
            $scope.customer = data.orderInfo['customer'];
            $scope.contactNumber = data.orderInfo['contactNumber'];
            $scope.amount = data.orderInfo['amount'];
            $scope.createTime = data.orderInfo['createTime'];
            $scope.contactAddress = data.orderInfo['contactAddress'];
            $scope.remark = data.orderInfo['remark'];
            $scope.source = data.orderInfo['source'];
            $scope.status = data.orderInfo['status'];
            $scope.operatorId=data.orderInfo['operatorId'];
            //是否有活动
            if($scope.remark==""||$scope.remark==null){
              $scope.numberActive=false;
            }
            else{
              $scope.numberActive=true;
            }
            if($scope.status=='000001'){
                  $scope.btnIsHide=false;
                  $scope.btnIsShow=true;
                  $scope.successColor=false;
                  $scope.waitColor=true;
                  $scope.failureColor=false;
                  $scope.dealColor=false;
                  $scope.wxOrderState='待处理';
                  $scope.btnIsHideValue='立即抢单';
            }else if($scope.status=="000004"){
                  $scope.btnIsHide=false;
                  $scope.btnIsShow=false;
                  $scope.successColor=true;
                  $scope.waitColor=false;
                  $scope.failureColor=false;
                  $scope.dealColor=false;
                  $scope.wxOrderState='订单成功';
            }else if($scope.status=="000005"){
                  $scope.btnIsHide=false;
                  $scope.btnIsShow=false;
                  $scope.successColor=false;
                  $scope.waitColor=false;
                  $scope.dealColor=false;
                  $scope.failureColor=true;
                  $scope.wxOrderState='订单失败';
            }else if($scope.status=="000003"){
                  $scope.btnIsHide=true;
                  $scope.btnIsShow=false;
                  $scope.successColor=false;
                  $scope.waitColor=false;
                  $scope.dealColor=true;
                  $scope.failureColor=false;
                  $scope.wxOrderState='受理中';
            }else if($scope.status=="000002"){
                  $scope.btnIsHide=false;
                  $scope.btnIsShow=true;
                  $scope.successColor=true;
                  $scope.waitColor=false;
                  $scope.failureColor=false;
                  $scope.dealColor=false;
                  $scope.wxOrderState='已派单';
                  $scope.btnIsHideValue='立即办理';
              }
        }).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('index');
              }); 
        });
      }
      
  //点击办理
  $scope.manage=function(){
      manage1();
  }
 function manage1(){
    $scope.orderStatus="000003";
    // wx_number =$scope.number;   
    // wx_orderCode= $scope.orderCode;
    wx_order = {
        "number":$scope.number
      , "orderCode":$scope.orderCode
      , "orderStatus":""
      , "orderType":""
      , "category":""
      , "userId":""
    }

    //console.log("index"+index);
    //console.log($scope.productName);
    //订单处理中
    $http({
        method:'GET',
        url:ajaxurl + 'unicomShareApp/updateUnicomPreorderStatus?token=' + $rootScope.token,
        params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus,number:$scope.number}
      }).success(function(data){
       // console.log("111=="+JSON.stringify($scope.orderList));
      });

    // if($scope.source=='000001'||$scope.source==null){
    //   $state.go('dianpu-hm-business', {pageTitle:'号码业务'});
    // }else if($scope.source=='000002'){
    //   $state.go('number-list');
    // }else if($scope.source=='000003'){
    //   alertData("请到号码之家集客版APP进行办理");
    // }else if($scope.source=='000004'){
    //   alertData('号码之家暂不支持此套餐业务');
    // }else if($scope.source=='000005'){
    //     $state.go("dianpu-lan-business");
    // }
     $state.go("dianpu-grap-order-manage");
}
  

  //提示信息
  function alertData(info){
    var alertPopup = $ionicPopup.alert({
          title: '提示信息',
          template: info
      });
      alertPopup.then(function(res) {
          //console.log('Thank you for not eating my delicious ice cream cone');
      });
  }
  
  //放弃订单
  $scope.giveUp=function(){
      //console.log(index);
//      $scope.orderCode=data.orderInfo['orderCode'];
       $scope.orderStatus="000005";
        $scope.input = {}
         var confirmPopup = $ionicPopup.confirm({
          template: '<input type="text" ng-model="input.txt" maxlength="120" style="border:1px solid #ccc">',
           title: '提示信息',
           subTitle: '输入放弃原因',
           scope: $scope,
           buttons: [
             { text: '取消' },
             {
               text: '<b>确定</b>',
               type: 'button-positive',
               onTap: function(e) {
                if(!$scope.input.txt){
                    e.preventDefault();
                }else {
                 // console.log($scope.input.txt);
                     $http({
                        method:'GET',
                        url:ajaxurl + 'unicomShareApp/cancelUnicomPreorder?token=' + $rootScope.token,
                        params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus,cancelReason:$scope.input.txt}
                      }).success(function(data){
                       // console.log(JSON.stringify(data));
                      });
                }
           
               }
             },
           ]
           
         });
         confirmPopup.then(function(res) {
           
         });

  }
   //获取抢占订单的的数量
  $scope.getGrapOrderNum=function(){
    if($scope.status=='000001'){
      $scope.orderStatus="000002";
        $http({
                method:'GET',
                url:ajaxurl + 'unicomShareApp/getGrabUnicomPreorderCount?token=' + $rootScope.token,
        }).success(function(data){
               // console.log(JSON.stringify(data));  
                if(data.status=="000001"){
                  $http({
                      method:'GET',
                      url:ajaxurl + 'unicomShareApp/grabUnicomPreorder?token=' + $rootScope.token,
                      params:{orderCode:$scope.orderCode}
                  }).success(function(data){
                     // console.log("121"+JSON.stringify(data));
                      if(data.status=='000001'){
                          alertChange('抢单成功',data.status);
                      }else{
                          alertChange('下单太慢，订单已经被抢走了！',data.status);
                      }
                  })
              }else{
                  // alertChange(data.msg,data.status);
                  alertData(data.msg);
              }  
        })
    }else if($scope.status=='000002'){
        manage1();
        $scope.orderStatus="000003";
         $http({
                method:'GET',
                url:ajaxurl + 'unicomShareApp/updateUnicomPreorderStatus?token=' + $rootScope.token,
                params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus}
          }).success(function(data){
                //console.log("aa==="+JSON.stringify(data));
               // console.log("111=="+JSON.stringify($scope.orderList));
          });

    }
      //立即抢购选择提示
      function alertChange(info,status){
            var confirmPopup = $ionicPopup.confirm({
                  title: '系统提示',
                  template: info,
                  scope:$scope,
                  buttons:[
                        {text:'取消'},
                        {
                              text:"<b>确定</b>",
                              type:"button-positive",
                              onTap:function(){
                                   // if(status=="000001"){
                                   //    $http({
                                   //          method:'GET',
                                   //          url:ajaxurl + 'unicomShareApp/updateUnicomPreorderStatus?token=' + $rootScope.token,
                                   //          params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus}
                                   //    }).success(function(data){
                                   //          //console.log("aa==="+JSON.stringify(data));
                                   //          $scope.btnIsHide=false;
                                   //          $scope.btnIsShow=true;
                                   //          $scope.btnIsHideValue='立即抢单';
                                   //          console.log("111=="+JSON.stringify($scope.orderList));
                                   //    });
                                   // }else{
                                   //        confirmPopup.close();
                                   // }
                                   getData();
                              }
                        }
                  ]
             });
      }
  }
})