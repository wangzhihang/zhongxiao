appControllers.controller('unicom-order-detail', function($scope,$http,$state,my,$stateParams,$rootScope,$ionicLoading) {
    $scope.title = '商城订单详情';
    // $rootScope = loginInfo;
    $scope.orderId= $stateParams.orderId
   // console.log(" $scope.orderId"+ $scope.orderId);
    $scope.hideLoadingPage = true;
    $scope.isNoShowCancelReason=false;
    $scope.isNoSheet= false;
    $scope.loading=false;
    //console.log($stateParams.realname);
    // $ionicLoading.show({template: '数据加载中...'});
    
    $http({
        method:'get',
        url:ajaxurl + 'unicomMallLanApp/queryUnicomMallLanOrderByOrderId?token=' + $rootScope.token,
        params:{orderId: $scope.orderId},
        timeout: 5000
    }).success(function(data){
        // $ionicLoading.hide();
        $scope.loading=true;
        $scope.hideLoadingPage = false;
        $scope.orderInfo = data.orderInfo;
      //  console.log("aaa=="+JSON.stringify(data.orderInfo));
        // $scope.orderCode = data.orderDetail.orderCode;
        $scope.status = data.orderInfo.status;
        // //状态
        if($scope.status === '000006'){
            $scope.status = '用户取消';
            $scope.verifyColor=false;
            $scope.successColor=false;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=true;
            $scope.isNoShowCancelReason=true; 
            $scope.cancelReason=data.orderInfo.cancelReason;
        }else if($scope.status === '000001'){
            $scope.status = '未处理';
            $scope.verifyColor=false;
            $scope.successColor=false;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=true;
        }else if($scope.status === '000002'){
            $scope.status = '有效订单';
            $scope.verifyColor=true;
            $scope.successColor=false;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=false;
        }else if($scope.status === '000003'){
            $scope.status = '已派单';
            $scope.verifyColor=false;
            $scope.successColor=true;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=false;
        }else if($scope.status === '000005'){
            $scope.status = '已退单';
            $scope.verifyColor=false;
            $scope.successColor=false;
            $scope.failColor=true;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=false;
            $scope.isNoShowCancelReason=true; 
            $scope.cancelReason=data.orderInfo.cancelReason; 
        }else if($scope.status === '000004'){
            $scope.status = '装机成功';
            $scope.verifyColor=false;
            $scope.successColor=false;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=true;
            $scope.dealColor=false;
        }else if($scope.status === '000007'){
            $scope.status = '受理中';
            $scope.verifyColor=false;
            $scope.successColor=true;
            $scope.failColor=false;
            $scope.cancelColor=false;
            $scope.signatureColor=false;
            $scope.dealColor=false;
        }

        //订单信息
        $scope.bespeakId = data.orderInfo.bespeakId;
        $scope.appointment = data.orderInfo.appointment;
        $scope.updateTime = data.orderInfo.updateTime;
        $scope.comeFrom = data.orderInfo.comeFrom;
        switch($scope.comeFrom){
            case 'web':
                $scope.comeFrom = "网厅";
                break;
            case 'mobile':
                $scope.comeFrom = "手厅";
                break;
            case 'weixin':
                $scope.comeFrom = "联能微厅";
                break;
            case 'jd':
                $scope.comeFrom = "京东";
                break;
            case 'tmall':
                $scope.comeFrom = "天猫";
                break;
            case 'alipay':
                $scope.comeFrom = "支付宝";
                break;
        }
        $scope.actPhone = data.orderInfo.actPhone;
        //联系人信息
        $scope.userName = data.orderInfo.userName;
        $scope.userPhone = data.orderInfo.userPhone;
        $scope.certNo = data.orderInfo.certNo;
        $scope.userAddress = data.orderInfo.userAddress;
        //套餐信息
         $scope.broadbandId = data.orderInfo.broadbandId;
         $scope.productName = data.orderInfo.productName;
         $scope.speed = data.orderInfo.speed;
         $scope.tariffType = data.orderInfo.tariffType;
         $scope.price = data.orderInfo.price;
       
    }).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index');
        }); 
    });
});