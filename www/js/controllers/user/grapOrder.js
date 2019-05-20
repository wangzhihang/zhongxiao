appControllers.controller('dianpu-grap-order', function($scope,$ionicLoading,$http,my,$state,$rootScope,$interval,$ionicLoading,$filter,$ionicPopup,$ionicScrollDelegate) {
        $scope.title = "抢单";
        $scope.infoState = '加载更多';
        $scope.loading = false;
        $scope.showList = true;
        $scope.searchBox = true;
        $scope.readMore = true;
        $scope.noMoreTips = true;
        $scope.btnIsHide = true;
        $scope.btnIsShow = false;
        $scope.ifNoShowArea=false;
        $scope.ifNoShowState=false;
        $scope.ifNoShowChange=false;
        $scope.isNoRun=false;
        $scope.isNoHearOrder=1;
        $scope.grapOrderBotVal="听单";
        $scope.hearVal="开始听单";
        $scope.hearImg="stop.png";
        $scope.orderList = [];
        $scope.newOrderList=[];
        $scope.lngs=[];
        $scope.lats=[];
        $scope.areaData={};
        $scope.stateData={};
        $scope.cityList=[{"name":"全部"}];
        $scope.pageIndex = 1;
        $scope.pageSize = "";
        $scope.pageCount = '';
        // $scope.startlat=108.924434;
        // $scope.startlng=34.224223;
        cordova.plugins.locationPlugin.getLocation(function(location){
            $scope.startlat=location.split(",")[0]-0;
            $scope.startlng=location.split(",")[1]-0;
        }, function(error){

        });
        $scope.userId=userBo.userId;
       // console.log("$scope.userId=="+$scope.userId);
        $scope.stateList=[{"name":"全部","state":['000002','000003','000004','000005'],"num":"0"},{"name":"已派单","state":['000002'],"num":"1"},
                                  {"name":"受理中","state":['000003'],"num":"2"},{"name":"订单成功","state":['000004'],"num":"3"},
                                  {"name":"订单失败","state":['000005'],"num":"4"}
                              ];
     
       //初始显示抢单
       getData('',['000001']);
      //导航切换
      $scope.tag = {
        current: "1"
      };
      $scope.actions = {
        setCurrent: function (param) {
            $scope.tag.current = param;
            if($scope.tag.current ==1){
                $scope.ifNoShowArea=false;
                $scope.ifNoShowState=false;
                $scope.ifNoShowChange=false;
                $scope.pageIndex = 1;
                $scope.orderList = [];
                $scope.tag1.current=0;
                $scope.tag2.current=-1;
                $scope.tag3.current=-1;
                getData('',['000001']);
            }else if($scope.tag.current ==2){
                $scope.ifNoShowState=false;
                $scope.ifNoShowChange=false;
                $scope.tag1.current=0;
                $scope.tag3.current=-1;
                $interval.cancel( $scope.timer); 
                $scope.hearVal="开始听单";
                $scope.hearImg="stop.png";
                $scope.grapOrderBotVal="听单";
                $scope.isNoHearOrder=1;
                $scope.isNoRun=false; 
                $scope.ifNoShowArea=!$scope.ifNoShowArea;
            }else if($scope.tag.current ==3){
                $scope.tag1.current=0;
                $scope.tag2.current=-1;
                $scope.ifNoShowState=!$scope.ifNoShowState;
                $scope.ifNoShowArea=false;
                $scope.ifNoShowChange=false;
                $scope.hearVal="开始听单";
                $scope.hearImg="stop.png";
                $scope.grapOrderBotVal="听单";
                $scope.isNoHearOrder=1;
                $scope.isNoRun=false; 
                $interval.cancel( $scope.timer); 
            }
        }
      };
      //关闭地区
     $scope.closeArea=function(){
            $scope.ifNoShowArea=false;
      }
     
    $scope.tag2 = {
        current: "-1"
      };
        $scope.actions2 = {
            setCurrent: function (param) {
                $scope.tag2.current = param;   
               // console.log(param);
                $scope.pageIndex = 1;
                $scope.orderList = [];
               // console.log($scope.cityList[param].name);
                if($scope.tag2.current==0){
                  getData('',["000001"]); 
                }else{
                   getData($scope.cityList[param].name,["000001"]);
                }
            }
        }    
      //关闭状态
      $scope.closeState=function(){
            $scope.ifNoShowState=false;
      }
     
      $scope.tag3 = {
         current: "-1"
       };
        $scope.actions3 = {
            setCurrent: function (param) {
            $scope.tag3.current = param; 
             $scope.pageIndex = 1;
            $scope.orderList = [];  
           // console.log($scope.tag2.current);
            // if($scope.tag2.current=="-1"){
            //   getData('',$scope.stateList[param].state); 
            // }else{
            //   getData($scope.cityList[$scope.tag2.current].name,$scope.stateList[param].state);  
            // }  
            getData('',$scope.stateList[param].state,$scope.userId);    
          }
        }
      //设置
       $scope.tag1 = {
        current: "0"
      };
      $scope.actions1 = {
        setCurrent: function (param) {
            $scope.tag1.current = param;
            $scope.ifNoShowChange=false;
            $scope.pageIndex = 1;
            $scope.orderList = [];
            getData('',['000001']);           
          }
        }
        //下拉刷新
        // $scope.doRefresh = function() {
        //     $scope.pageIndex = 1;
        //     $scope.orderList = [];
        //     getData('',['000001']);
        // }
        //确定按钮
        // $scope.ensure=function(){
        //     $scope.ifNoShowChange=false;
        //     $scope.pageIndex = 1;
        //     $scope.orderList = [];
        //     getData('',['000001']);
        // }
        //关闭设置
        $scope.closeChange=function(){
              $scope.ifNoShowChange=false;
        }
        //设置
        $scope.setBtn=function(){
            $scope.ifNoShowChange=!$scope.ifNoShowChange;
        }
        //听单选择按钮
        $scope.hearBtn=function(){
          if($scope.isNoHearOrder==1){
            $scope.hearVal="停止听单";
            $scope.hearImg="start.png";
            $scope.grapOrderBotVal="听单中";
            $scope.isNoHearOrder=0;
            $scope.isNoRun=true;
            if($scope.tag.current==1){
             
                  $scope.timer=$interval(function() {
                    if($scope.pageSizeReal>$scope.pageCount){
                        $scope.pageIndex = 1;
                      $scope.orderList = [];
                      getData('',['000001']);
                    }else{
                      loadMore($scope.pageCount,$scope.pageSize);
                    }
                    
                  },6000);
             
                
            }else{
              alertData('请选择首页，再进行听单！');
              $scope.hearVal="开始听单";
              $scope.hearImg="stop.png";
              $scope.grapOrderBotVal="听单";
              $scope.isNoHearOrder=1;
              $scope.isNoRun=false; 
            }
          }else if($scope.isNoHearOrder==0){
            $scope.hearVal="开始听单";
            $scope.hearImg="stop.png";
            $scope.grapOrderBotVal="听单";
            $scope.isNoHearOrder=1;
            $scope.isNoRun=false; 
            $interval.cancel( $scope.timer); 
          }
            
        }
      //获取全部数据
      function getData(location,statusArray,userId){
           // $ionicLoading.show({template: '数据加载中...'});
            $http({
                    method:'GET',
                    url:ajaxurl + 'unicomShareApp/queryUnicomSharePreorderList?token=' + $rootScope.token,
                    params:{
                        location:location,
                        "statusArray":statusArray,
                        pageIndex:$scope.pageIndex,
                        userId:userId,
                        disId:userBo.disId
                  },
                  timeout: 5000
            }).success(function(data){
                  // console.log("aa=="+JSON.stringify(data));
                  // $ionicLoading.hide();
                  $scope.readMore = false;
                  $scope.loading = true;
                  $scope.orderList = $scope.orderList.concat(data['orderList']);
                  $scope.city=data['city'];
                  $scope.province=data['province'];
                  judgeData();
                  getCity();
                 if($scope.tag1.current!=0){
                        $scope.newOrderList=[];
                        for(var i in $scope.orderList){
                              if($scope.orderList[i].distance<1000 &&  $scope.tag1.current ==1){
                                    $scope.newOrderList= $scope.newOrderList.concat( $scope.orderList[i]);
                              }else if($scope.orderList[i].distance<3000 &&  $scope.tag1.current ==2){
                                    $scope.newOrderList= $scope.newOrderList.concat( $scope.orderList[i]);
                              }else if($scope.orderList[i].distance<6000 &&  $scope.tag1.current ==3){
                                    $scope.newOrderList= $scope.newOrderList.concat( $scope.orderList[i]);
                              }else if($scope.orderList[i].distance<10000 &&  $scope.tag1.current ==4){
                                    $scope.newOrderList= $scope.newOrderList.concat( $scope.orderList[i]);
                              }else if($scope.tag1.current ==5){
                                   // console.log($scope.orderList[i].distance);
                                    $scope.newOrderList=$scope.newOrderList.concat( $scope.orderList[i]);
                              }
                         }

                 }else{
                       // console.log("444");
                        $scope.newOrderList=$scope.orderList;
                 }
                
                  // console.log("$scope.newOrderList=="+JSON.stringify($scope.newOrderList));
                  $scope.pageSize =30;
                  $scope.pageCount = data.page['pageCount'];
                  $scope.pageSizeReal=data.page['pageSize'];
                  loadingState($scope.pageCount,$scope.pageSize);
            }).error(function () {
               my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                  $state.go('index');
              }); 
            });
      }
       //判断加载与否状态
      function loadingState(pageCount,pageSize){

            if(pageCount > pageSize){
              $scope.infoState = '加载更多';
               $scope.noMoreTips = true;
            }else{
              $scope.infoState = '没有更多了';
              $scope.readMore = true;
              $scope.noMoreTips = false;
            }
      }
       //加载更多
       $scope.loadMoreData=function(){
               loadMore($scope.pageCount,$scope.pageSize);
       }
      function loadMore(pageCount,pageSize){
            if($scope.pageIndex < Math.ceil(pageCount / pageSize)){
                  $scope.loading = false;
                  $scope.pageIndex++;
                    
                  if($scope.tag2.current!=-1){
                        if($scope.tag2.current==0){
                            getData('',["000001"]);
                        }else{
                            getData($scope.cityList[param].name,["000001"]);
                        }
                        
                  }else if($scope.tag3.current!=-1){
                        getData('',$scope.stateList[param].state,$scope.userId);  
                  }else{
                         getData('',["000001"]);  
                  }
            }else{
                 $scope.infoState = '没有更多了';
                 $scope.readMore = true;
                 $scope.noMoreTips = false;
            }
      }
      //获取城市区域
      function getCity(){
         $scope.cityList=[{"name":"全部"}];
        for(var i in  wholeCity){
            if(wholeCity[i].name==$scope.province){
                  // console.log("ok");
                   for(var j in wholeCity[i].sub){
                       // console.log(wholeCity[i].name);
                        if(wholeCity[i].sub[j].name==$scope.city){
                              $scope.cityList=$scope.cityList.concat(wholeCity[i].sub[j].sub);
                              // console.log("city==="+JSON.stringify($scope.cityList));
                        }
                   }
            }
        }
        for(var i  in $scope.cityList){
          $scope.cityList[i].num=i;
        }
       // console.log("city==="+JSON.stringify($scope.cityList));
      }
  
      function judgeData(){
            for(var i in $scope.orderList){
                $scope.lngs= $scope.lngs.concat($scope.orderList[i].lnglats.split(",")[1]);
                $scope.lats= $scope.lats.concat($scope.orderList[i].lnglats.split(",")[0]);
                 // console.log("SS="+$scope.orderList[i].lnglats);
                  for(var j=0;j<$scope.lngs.length;j++){
                    if($scope.orderList[j]){
                        $scope.orderList[j].distance=getFlatternDistance($scope.startlat,$scope.startlng,parseFloat($scope.lats[j]),parseFloat($scope.lngs[j]));
                    }
                  }
                $scope.orderList[i].num=i;
                  // console.log("$scope.lngs=="+$scope.lngs);
                if($scope.orderList[i].status=='000001'){
                  //$scope.wxOrderState='待处理';
                    $scope.orderList[i].wxOrderState='待处理';         
                    $scope.orderList[i].successColor=false;
                    $scope.orderList[i].waitColor=true;
                    $scope.orderList[i].failureColor=false;
                    $scope.orderList[i].dealColor=false;
                    $scope.orderList[i].btnIsHide=false;
                    $scope.orderList[i].btnIsShow=true;
                    $scope.orderList[i].isNoShowOrderList=true;
                    $scope.orderList[i].btnIsHideValue='立即抢单';
                }else if($scope.orderList[i].status=='000004'){
                    $scope.orderList[i].wxOrderState='订单成功';  
                    $scope.orderList[i].successColor=true;
                    $scope.orderList[i].waitColor=false;
                    $scope.orderList[i].failureColor=false;
                    $scope.orderList[i].dealColor=false;
                    $scope.orderList[i].btnIsHide=false;
                    $scope.orderList[i].btnIsShow=false;
                    $scope.orderList[i].isNoShowOrderList=true;
                  
                }else if($scope.orderList[i].status=='000005'){
                    $scope.orderList[i].wxOrderState='订单失败';
                    $scope.orderList[i].successColor=false;
                    $scope.orderList[i].waitColor=false;
                    $scope.orderList[i].dealColor=false;
                    $scope.orderList[i].failureColor=true;
                    $scope.orderList[i].btnIsHide=false;
                    $scope.orderList[i].btnIsShow=false;
                    $scope.orderList[i].isNoShowOrderList=true;
                }else if($scope.orderList[i].status=='000003'){
                    $scope.orderList[i].wxOrderState='受理中';         
                    $scope.orderList[i].successColor=false;
                    $scope.orderList[i].waitColor=false;
                    $scope.orderList[i].dealColor=true;
                    $scope.orderList[i].failureColor=false;
                    $scope.orderList[i].isNoShowOrderList=true;
                    $scope.orderList[i].btnIsHide=true;
                    $scope.orderList[i].btnIsShow=false;
                 
                }else if($scope.orderList[i].status=='000002'){
                    $scope.orderList[i].wxOrderState='已派单';     
                    $scope.orderList[i].successColor=true;
                    $scope.orderList[i].waitColor=false;
                    $scope.orderList[i].failureColor=false;
                    $scope.orderList[i].dealColor=false;
                    $scope.orderList[i].isNoShowOrderList=true;
                    $scope.orderList[i].btnIsHide=false;
                    $scope.orderList[i].btnIsShow=true;
                    $scope.orderList[i].btnIsHideValue='立即办理';
                  }
             }
          
       }
       //获取抢占订单的的数量
      $scope.getGrapOrderNum=function(index){
            $scope.orderCode=$scope.orderList[index].orderCode;
            
              if($scope.orderList[index].status=='000001'){
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
              }else if($scope.orderList[index].status=='000002'){
                  manage1(index);
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
                                    $scope.pageIndex = 1;
                                    $scope.orderList = [];
                                     getData('',["000001"]);
                              }
                        }
                  ]
             });
      }
     
        //查看订单详情
      $scope.grapOrderDetail = function(index) {
            order["orderCode"] = $scope.newOrderList[index].orderCode;
           // console.log("order=="+JSON.stringify(order) +$scope.newOrderList[index].status);
            if($scope.newOrderList[index].status!='000001'){
               $state.go("dianpu-grap-order-detail");
            }
           
      };
      //点击办理
      $scope.manage=function(index){
          manage1(index);
     
      }
      function manage1(index){
        $scope.orderCode=$scope.orderList[index].orderCode;
        $scope.orderStatus="000003";
        $scope.source=$scope.orderList[index].source;
        $scope.number=$scope.orderList[index].number;
        $scope.userId=$scope.orderList[index].userId;
        // wx_number =$scope.number;   
        // wx_orderCode= $scope.orderCode;
       
       // console.log($scope.orderCode);
       // console.log($scope.number);
        //订单处理中
      $http({
            method:'GET',
            url:ajaxurl + 'unicomShareApp/updateUnicomPreorderStatus?token=' + $rootScope.token,
            params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus,number:$scope.number}
        }).success(function(data){
            //console.log("aa==="+JSON.stringify(data));
            $scope.orderList[index].wxOrderState='订单处理中';
            $scope.orderList[index].successColor=false;
            $scope.orderList[index].waitColor=false;
            $scope.orderList[index].failureColor=false;
            $scope.orderList[index].dealColor=true;
            $scope.orderList[index].btnIsHide=true; 
          //  console.log("111=="+JSON.stringify($scope.orderList));
        });
        
        $state.go("dianpu-grap-order-manage",{
                number:$scope.number,
                orderCode:$scope.orderCode
        });
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

      //放弃订单理由
     $scope.aleryGiveUp=function(index){
             $scope.orderCode=$scope.orderList[index].orderCode;
             $scope.orderStatus="000005";
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
                           // console.log($scope.input.txt);
                              $http({
                                    method:'GET',
                                    url:ajaxurl + 'unicomShareApp/cancelUnicomPreorder?token=' + $rootScope.token,
                                    params:{orderCode:$scope.orderCode,orderStatus:$scope.orderStatus,cancelReason:$scope.input.txt}
                                }).success(function(data){
                                  //  console.log("aa==="+JSON.stringify(data));
                                    
                                });
                       }
                     }
                   },
                 ]
            });
      }


      //坐标地址
      var EARTH_RADIUS = 6378137.0;    //单位M
      var   PI = Math.PI;
    
      function getRad(d){
          return d*PI/180.0;
     }
      
      //  $scope.endlat=108.890194;
      //  $scope.endlng=34.236365;
      // alert( getFlatternDistance($scope.startlat,$scope.startlng,$scope.endlat,$scope.endlng));
      function getFlatternDistance(lat1,lng1,lat2,lng2){
            var f = getRad((lat1 + lat2)/2);
            var g = getRad((lat1 - lat2)/2);
            var l = getRad((lng1 - lng2)/2);
            
            var sg = Math.sin(g);
            var sl = Math.sin(l);
            var sf = Math.sin(f);
            
            var s,c,w,r,d,h1,h2;
            var a = EARTH_RADIUS;
            var fl = 1/298.257;
            
            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;
            
            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;
            
            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;
            
            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    }
})