appControllers.controller('unicom-lan-order', function($scope,$filter,my,$http,$state,$ionicPopup,$ionicLoading,$rootScope) {
    $scope.title = '联通派单';
    $scope.orderList=[];
    // $rootScope = loginInfo;
    $scope.userId=userBo.userId;
    $scope.isNoShowStatePop=false;
    $scope.isNoShowAssignPop=false;
    $scope.isNoShowChosePop=false;
    $scope.isNoShowChannelList=false;
    $scope.isNoShowStateList=false;
    $scope.isNoShowStateChange=true;
    $scope.nowDate=new Date().getTime();
    //("?! "+$scope.nowDate);
    //初始化参数
    $scope.pageSize=6;
    $scope.pageIndex=1;
    $scope.keywords='';
    $scope.status='000000';
    $scope.cUserId='';
    $scope.bespeakId='';
    $scope.orderId='';
    $scope.userName='';
    $scope.getStartTime=GetDateStr(-30);
    $scope.getEndTime=GetDateStr(1);
    // $scope.channelList=[{"name":"王苗","num":"0","userId":"12270 "},{"name":"张宇","num":"1","userId":'13222'}];
    $scope.stateList=[{"name":"未处理","num":"0","status":"000001"},{"name":"已派单","num":"1","status":"000003"},
                       {"name":"受理中","num":"2","status":"000007"},{"name":"装机成功","num":"3","status":"000004"}
                       ,{"name":"已退单","num":"4","status":"000005"},{"name":"用户取消","num":"5","status":"000006"}];
    
    $scope.colorList=[{"status":"000001","statusVal":"未处理","verifyColor":false,"successColor":false,"failColor":false,"cancelColor":false,"signatureColor":false,"dealColor":true,
                      "isNoShowStateChange":true,"isNoShowUnicomMallBot":true,"isNoShowReminser":false,"stateVal":"派单","assignVal":"退单"},
                      {"status":"000002","statusVal":"有效订单","verifyColor":true,"successColor":false,"failColor":false,"cancelColor":false,"signatureColor":false,"dealColor":false,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":true,"isNoShowReminser":false},
                      {"status":"000003","statusVal":"已派单","verifyColor":false,"successColor":true,"failColor":false,"cancelColor":false,"signatureColor":false,"dealColor":false,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":true,"isNoShowReminser":true,"assignVal":"重新派单"},
                      {"status":"000004","statusVal":"装机成功","verifyColor":false,"successColor":false,"failColor":false,"cancelColor":false,"signatureColor":true,"dealColor":false,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":false,"isNoShowReminser":false},
                      {"status":"000005","statusVal":"已退单","verifyColor":false,"successColor":false,"failColor":true,"cancelColor":false,"signatureColor":false,"dealColor":false,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":false,"isNoShowReminser":false},
                      {"status":"000006","statusVal":"用户取消","verifyColor":false,"successColor":false,"failColor":false,"cancelColor":false,"signatureColor":false,"dealColor":true,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":false,"isNoShowReminser":false},
                      {"status":"000007","statusVal":"受理中","verifyColor":false,"successColor":true,"failColor":false,"cancelColor":false,"signatureColor":false,"dealColor":false,
                      "isNoShowStateChange":false,"isNoShowUnicomMallBot":false,"isNoShowReminser":true}
                     ];
    //获取数据
    $scope.getDate=function(userId,pageSize,pageIndex,startTime,endTime,keywords,status,cUserId){
        $scope.loading = true;
        $scope.noMore = false;
        // $ionicLoading.show({template: '数据加载中...'});
        $http({
            method:'post',
            url:ajaxurl + 'unicomMallLanApp/queryUnicomMallLanOrderList?token=' +$rootScope.token,
            data:{
                startTime:startTime,
                endTime:endTime,
                pageSize:pageSize,
                pageIndex:pageIndex,
                userId:userId,
                keywords:keywords,
                status:status,
                cUserId:cUserId,
                source:'000002',
                sourceSecond:'000003'
            },
            timeout: 5000
        }).success(function(data){
                // $ionicLoading.hide();
                $scope.loading = false;
                // console.log("aaa=="+JSON.stringify(data)); 
                $scope.orderList = $scope.orderList.concat(data.orderList);
               
                if(eval(data.orderList).length < data.page.pageSize){
                    $scope.hasmore = false;
                    $scope.noMore = true;
                }else{
                    $scope.hasmore = true;
                } 
                for (var i in $scope.orderList) {
                    $scope.orderList[i].stateNum=i;
                    if($scope.orderList[i].status === '000006'){
                       $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[5]);
                    }else if($scope.orderList[i].status === '000001'){
                        $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[0]);
                    }else if($scope.orderList[i].status === '000003'){
                        $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[2]);
                        // if($scope.nowDate-$scope.orderList[i].updateTime>14400000){
                        //     $scope.orderList[i].reminderVal="超时";
                        // }else{
                        //     $scope.orderList[i].isNoShowReminser=false;
                        // }
                    }else if($scope.orderList[i].status === '000005'){
                       $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[4]);
                    }else if($scope.orderList[i].status === '000004'){
                       $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[3]);
                    }else if($scope.orderList[i].status === '000007'){
                       $scope.orderList[i]=extend($scope.orderList[i],$scope.colorList[6]);
                        // if($scope.nowDate-$scope.orderList[i].updateTime>259200000){
                        //     $scope.orderList[i].reminderVal="超时";
                        // }else{
                        //      $scope.orderList[i].isNoShowReminser=false;
                        // }
                    }
                        
                }
                //判断超时
                for(var i in $scope.orderList){
                    switch($scope.orderList[i].overTimeStatus){
                        case '000001':
                            $scope.orderList[i].isNoShowReminser=true;
                            $scope.orderList[i].reminderVal="超时";
                            break;
                        case "000002":
                            $scope.orderList[i].isNoShowReminser=true;
                            $scope.orderList[i].reminderVal="超时";
                            break;
                        case "000003":
                        $scope.orderList[i].isNoShowReminser=true;
                            $scope.orderList[i].reminderVal="超时";
                            break;
                        default:
                            $scope.orderList[i].isNoShowReminser=false;
                    }
                }
               // console.log("aaa=="+JSON.stringify(data)); 
        }).error(function () { 
            my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index');
            }); 
        }).finally(function () { 
                $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.getDate($scope.userId,$scope.pageSize,$scope.pageIndex,$scope.getStartTime,$scope.getEndTime,$scope.keywords,$scope.status,$scope.cUserId);
     //更新数据
    $scope.upData=function(){
        $scope.pageSize=6;
        $scope.pageIndex=1;
        // $scope.keywords='';
        $scope.status='000000';
        $scope.cUserId='';
        // $scope.bespeakId='';
        // $scope.orderId='';
        // $scope.getStartTime=GetDateStr(-6);
        // $scope.getEndTime=GetDateStr(1);
        $scope.orderList = [];
        $scope.getDate($scope.userId,$scope.pageSize,$scope.pageIndex,$scope.getStartTime,$scope.getEndTime,$scope.keywords,$scope.status,$scope.cUserId);
    }
    //上拉加载
    $scope.loadMore = function (){
        $scope.pageIndex++; 
        $scope.getDate($scope.userId,$scope.pageSize,$scope.pageIndex,$scope.getStartTime,$scope.getEndTime,$scope.keywords,$scope.status,$scope.cUserId);
    };
    //获取用户列表
    $scope.getUserList=function(userName){
        $scope.userList=[];
        $http({
            method:'get',
            url:ajaxurl + 'unicomMallLanApp/getChildUserId?token=' +$rootScope.token,
            params:{userName:userName}
        }).success(function(data){
            // console.log("?1 "+JSON.stringify(data));
            $scope.userList=data.userList;
            for(var i in $scope.userList){
                $scope.userList[i].num=i;
            }
        })
    }
    //搜索用户列表
    $scope.searchVal='';
    $scope.search=function(searchVal){
         console.log( searchVal)
         $scope.getUserList(searchVal);
    }
    //取消订单
    $scope.cancelOrder=function(orderId,cancelReason,status,userName){
         $http({
            method:'get',
            url:ajaxurl + 'unicomMallLanApp/cancelUnicomMallLanOrder?token=' +$rootScope.token,
            params:{
                orderId:orderId,
                cancelReason:cancelReason,
                status:status,
                source:userName
            }
        }).success(function(data){
            // console.log("?4 "+JSON.stringify(data));
            $scope.upData();  
        })
    }
    //放弃弹出理由
    $scope.alertGiveUp=function(index){
             $scope.input = {}
             var myPopup = $ionicPopup.show({
                 template: '<input type="text" ng-model="input.txt" maxlength="120" style="border:1px solid #ccc">',
                 title: '系统提示',
                 subTitle: '输入放弃原因',
                 scope: $scope,
                 buttons: [
                   { text: '取消' },
                   {
                     text: '<b>确定</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                       if (!$scope.input.txt) {
                         //不允许用户关闭，除非他键入wifi密码
                         e.preventDefault();
                       } else {
                           // console.log("?5"+$scope.input.txt);
                            $scope.cancelReason=$scope.input.txt;
                            $scope.cancelOrder($scope.orderId,$scope.cancelReason,'000005',$scope.userName);
                           
                       }
                     }
                   },
                 ]
            });
      }
     $scope.getUserList('');
   
    //修改订单状态
    $scope.changeOrderStatus=function(orderId,status){
        $http({
            method:'get',
            url:ajaxurl + 'unicomMallLanApp/updateUnicomMallLanOrderByStatus?token=' +$rootScope.token,
            params:{
                orderId:orderId,
                status:status
            }
        }).success(function(data){
           // console.log("修改订单 "+data);
            if(data==true){
                $scope.tag.current=-1;
            }
            $scope.upData();
        })
    }
    //发送短信
    $scope.sendNote=function(bespeakId,cUserId){
        $http({
            method:'get',
            url:ajaxurl + 'baseApp/sendMallOrderMsgByJPush?token=' +$rootScope.token,
            params:{
                bespeakId:bespeakId,
                userId:cUserId
            }
        }).success(function(data){
            //console.log("发送成功 "+data);
             $scope.upData();
        })
    }
    //分配订单给装机员
    $scope.AssignData=function(orderId,status,cUserId,userName){
         $http({
            method:'get',
            url:ajaxurl + 'unicomMallLanApp/updateUnicomMallLanOrderByStatusUser?token=' +$rootScope.token,
            params:{
                orderId:orderId,
                status:status,
                userId:cUserId,
                source:userName
            }
        }).success(function(data){
            //console.log("分配成功 "+data);
            // if(data==true){
                // $scope.tag.current=-1;
                //console.log("?2 "+$scope.bespeakId);
                $scope.sendNote($scope.bespeakId,cUserId);
                $scope.isNoShowAssignPop=false;
               
            // }
        })
    }
    //有效订单提示
    $scope.alertOrder=function(info){
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
                                $scope.AssignData($scope.orderId,$scope.status,$scope.cUserId);
                          }
                    }
              ]
        });
    }
    //状态切换
    $scope.tag = {
        current: "0"
    };
    $scope.actions = {
        setCurrent: function (param) {
            $scope.tag.current = param;
        }
    };
     //未分配切换
     $scope.tag1 = {
        current: "-1"
    };
    $scope.actions1 = {
        setCurrent: function (param) {
            $scope.tag1.current = param;
            $scope.cUserId=$scope.userList[param].userId;
            // console.log("$scope.cUserId  "+ $scope.cUserId);
        }
    };
     //网格经理查询
     $scope.tag2 = {
        current: "-1"
    };
    $scope.actions2 = {
        setCurrent: function (param) {
            $scope.tag2.current = param;
            $scope.cUserId=$scope.userList[param].userId;
            //console.log("?3"+$scope.cUserId);
        }
    };
     //状态查询
     $scope.tag3 = {
        current: "-1"
    };
    $scope.actions3 = {
        setCurrent: function (param) {
            $scope.tag3.current = param;
            $scope.status=$scope.stateList[param].status;
            //console.log($scope.status);
        }
    };
    //状态选择(暂时没有)
     $scope.tag4 = {
        current: "-1"
    };
    $scope.actions4 = {
        setCurrent: function (param) {
            $scope.tag4.current = param;
            //console.log("$scope.tag.current" +$scope.tag.current)
            $scope.bespeakId=$scope.orderList[$scope.index].bespeakId;
            $scope.orderId=$scope.orderList[$scope.index].orderId;
            switch(param){
                case 1:
                    $scope.status='000002';
                    break;
                case 2:
                    $scope.status='000005';
                    break;
            }
            $scope.changeOrderStatus($scope.orderId, $scope.status);

        }
    };
    //分配选择确定按钮
    $scope.AssignEnSure=function(){
        if($scope.cUserId==''){
            my.alert('请选择客户经理');
        }else{
            $scope.AssignData($scope.orderId,$scope.status,$scope.cUserId,$scope.userName);  
        }
       
    }
    $scope.allClick=function(e){
        //console.log("index   "+e);
        $scope.index=e;
         $scope.tag.current=-1;
    }
    //订单详情
    $scope.orderDetail=function(e){
        $scope.index=e;
        $scope.bespeakId=$scope.orderList[$scope.index].bespeakId;
        $scope.orderId=$scope.orderList[$scope.index].orderId;
        $state.go('unicom-order-detail',{orderId:$scope.orderId});
    }
    //状态选择
    $scope.stateChange=function(e){
        $scope.index=e;
        $scope.tag4.current = -1;
        // $scope.isNoShowAssignPop=false;
        $scope.bespeakId=$scope.orderList[$scope.index].bespeakId;
        $scope.orderId=$scope.orderList[$scope.index].orderId;
        $scope.userName=$scope.orderList[$scope.index].userName;
        $scope.status='000003';
        // $scope.cUserId='12270';
        // $scope.alertOrder("确定执行此操作？");
        $scope.isNoShowAssignPop=true;
    }
    //未分配选择
    $scope.assignChange=function(e){
        $scope.index=e;
        // $scope.isNoShowStatePop=false;
        $scope.tag.current=-1;
        $scope.tag1.current=-1;
        
        $scope.bespeakId=$scope.orderList[$scope.index].bespeakId;
        $scope.orderId=$scope.orderList[$scope.index].orderId;
        $scope.userName=$scope.orderList[$scope.index].userName;
        //console.log($scope.orderList[$scope.index].status);
        if($scope.orderList[$scope.index].status == '000001'){
            $scope.isNoShowAssignPop=false;
            // $scope.alertChange("确定执行此操作？");
            $scope.status == '000005';
            $scope.alertGiveUp();
        }else{
            $scope.status=$scope.orderList[$scope.index].status;
            $scope.isNoShowAssignPop=true;
        }
        
    }
    //关闭未分配
    $scope.closeAssignPop=function(){
        $scope.isNoShowAssignPop=false;
    }
    //查询
    $scope.queryClick=function(){
        $scope.isNoShowChosePop=!$scope.isNoShowChosePop;
        $scope.isNoShowStatePop=false;
        $scope.isNoShowAssignPop=false;
    }
    //关闭查询窗口
    $scope.closeChosePop=function(){
        $scope.isNoShowChosePop=false;
    }
    //渠道经理
    $scope.channelClick=function(){
        $scope.isNoShowChannelList=!$scope.isNoShowChannelList;
    }
    //状态
    $scope.stateClick=function(index){
        $scope.isNoShowStateList=!$scope.isNoShowStateList;
    }
    //查询关键字
    $scope.lookKeywords=function(keyword){
        
        (keyword);
        $scope.keywords=keyword;
        
    }
   //筛选中的日期
    $scope.setStartTime=function(e){
        $scope.getStartTime=$filter('date')(e,'yyyy-MM-dd');
    }
    $scope.setEndTime=function(e){
        $scope.getEndTime=$filter('date')(e,'yyyy-MM-dd');
    }
    //重置
    $scope.resetting=function(){
        $scope.tag2.current =-1;
        $scope.tag3.current =-1;
        $scope.getStartTime=GetDateStr(-30);
        $scope.getEndTime=GetDateStr(1);
    }
    //确定
    $scope.ensure=function(){
        $scope.isNoShowChosePop=false;
        $scope.pageIndex=1;
        $scope.orderList = [];
        $scope.getDate($scope.userId,$scope.pageSize,$scope.pageIndex,$scope.getStartTime,$scope.getEndTime,$scope.keywords,$scope.status,$scope.cUserId);
    }
    //日期
    function GetDateStr(AddDayCount) { 
        var dd = new Date(); 
        dd.setDate(dd.getDate()+AddDayCount);
        var y = dd.getFullYear(); 
        var m = dd.getMonth()+1;
        var d = dd.getDate(); 
        return y+"-"+m+"-"+d; 
    }
     // 合并对象
    function extend(target, source) {
        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
    }
});