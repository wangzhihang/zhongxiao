appControllers.controller('unicom-order-cancle', function($scope,$filter,my,$http,$state,$ionicPopup,$ionicLoading,$rootScope,$stateParams) {
    $scope.title = '用户取消';
    $scope.ifShowOther=false;
    $scope.showContentBlueTooth=false;
    $scope.input={
        "cancel":"",
        "value":"",
        "keyword":"",
        "cancelText":''
    }
    $scope.cancleList=[
        {"name":"需扩容","list":["包含端口饱和","距离资源远","入户线路无路由"]},
        {"name":"无资源","list":['无资源']},
        {"name":"无法联系","list":["长时间联系不上","联系电话空号","电话错误"]},
        {"name":"暂不安装","list":["短时间不安装","出差在外无法办理","用户在考虑"]},
        {"name":"业务规则原因无法受理","list":["用户已使用公司宽带","要求进行融合的移网号码和需要办理宽带的人员不符合实名制规则用户移网号码非本地网","原有移网号码政策与现预约政策冲突"]},
        {"name":"宽带老用户","list":[]},
        {"name":"其他","list":["政企项目不参加","BOT项目拒绝受理","其他"]}
    ];
   $scope.closeContentBlueTooth=function(){
    $scope.showContentBlueTooth=false;
    $scope.showTextContent = false;
   }
    // console.log($stateParams.orderId,$stateParams.status,$stateParams.userName)
     //取消订单
     $scope.cancelOrder=function(orderId,cancelType,cancelReason,status,userName){
        $http({
           method:'get',
           url:ajaxurl + 'unicomMallLanApp/cancelUnicomMallLanOrder?token=' +$rootScope.token,
           params:{
               orderId:orderId,
               cancelType:cancelType,
               cancelReason:cancelReason,
               status:status,
               source:userName
           }
       }).success(function(data){
          if(data == true){
            my.alert("取消成功！").then(function(){
              $state.go("unicom-order-user");
            }) 
          }
       })
   }
    $scope.entrue=function(){
        // console.log($scope.input.cancel)
        if($scope.input.cancel!=''){
            // if($scope.input.cancel.list.length){
            //     $scope.showContentBlueTooth=true;
            //     $scope.list=$scope.input.cancel.list;
            // }else{
            //     // $scope.cancelOrder($stateParams.orderId,$scope.input.cancel.name,$stateParams.status,$stateParams.userName);
            // }
            if($scope.input.cancel.name == '宽带老用户'){
                $scope.showTextContent = true;
                $scope.showContentBlueTooth=false;
            }else{
                $scope.showTextContent = false;
                $scope.showContentBlueTooth=true;
                $scope.list=$scope.input.cancel.list;
            }
        }else{
            my.alert("请选择取消原因！")
        }
        
    }
    $scope.getCancleVal=function(item){
        // console.log(item)
        if(item=="其他"){
            $scope.ifShowOther=true;
        }else{
            $scope.ifShowOther=false;
        }
    }
    $scope.reSearch=function(){
      // console.log('value=='+$scope.input.value);
     
      if($scope.input.cancel.name=='宽带老用户'){
          if($scope.input.cancelText == ''){
             my.alert('请输入取消原因');
          }else{
            $scope.cancelReason = $scope.input.cancelText;
            $scope.cancelOrder($stateParams.orderId,$scope.input.cancel.name,$scope.cancelReason,$stateParams.status,$stateParams.userName);
          }
      }else if($scope.input.value==""){
        my.alert('请选择取消原因');
      }else{
        $scope.cancelReason=$scope.input.value;
        if($scope.cancelReason=="其他"){
            if($scope.input.keyword){
              $scope.cancelReason=$scope.input.keyword;
              $scope.cancelOrder($stateParams.orderId,$scope.input.cancel.name,$scope.cancelReason,$stateParams.status,$stateParams.userName);
            }else{
              my.alert('请输入其他原因');
            }
        }else{
          $scope.cancelOrder($stateParams.orderId,$scope.input.cancel.name,$scope.cancelReason,$stateParams.status,$stateParams.userName);
        }
      }
        // if($scope.input.value==""){
        //     $scope.cancelReason=$scope.input.cancel.name;
        // }else{
        //     $scope.cancelReason=$scope.input.value;
        //     if($scope.cancelReason=="其他"){
        //         $scope.cancelReason=$scope.input.keyword;
        //     }
           
        // }
       
        // $scope.cancelOrder($stateParams.orderId,$scope.input.cancel.name,$scope.cancelReason,$stateParams.status,$stateParams.userName);
    }

});