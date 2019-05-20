// 手机号码分割
app
    .filter("telFormat", function() {
        return function(input) {
            return telFormat(input);
        }
    })

.filter("stringFormat", function() {
        return function(input) {
            return stringFormat(input);
        }
    })
    //去掉字符串双引号
    .filter("cancelQuotes", function() {
        return function(input) {
            if (input) {
                return input.replace(/\"/g, "");
            } else {
                return ""
            }

        }
    })
    // 隐藏关键文字 第二个参数隐藏的位置从0开始;用","分割
    .filter("hideCode", function() {
        return function(input, param) {
            var str = "",
                input = arguments[0],
                param = arguments[1].split(",");
            if (input) {
                var inputLen = input.length;
                for (var i = 0; i < inputLen; i++) {
                    str += arrayContains(param, i) ? "*" : input[i];
                }
                return str;
            }
        }
    })

.filter("telPreCharge", function() {
    return function(input, type) {
        if (type) {
            return input;
        } else {
            return Number(input) ? input : disPreCharge;
        }
    }
})

//截取字符串eg:{{item.detailedProductName | cut:true:9:' ...'}}
.filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
})

// 去掉重复数据
.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    }
})


.filter("statusColor", function() {
    var obj = {
        "color": {
            "000001": "goingStatus",
            "000002": "goingStatus",
            "000003": "finishStatus",
            "000004": "unfinishedStatus",
            "000005": "unfinishedStatus",
            "000006": "otherStatus",
            "000007": "otherStatus",
            "000009": "goingStatus",
            "000010": "goingStatus",
            "000011": "unfinishedStatus",
            "000012": "finishStatus",
            "000016": "goingStatus",
            "000017": "goingStatus"
        },
        "name": {
            "000001": "待处理",
            "000002": "身份校验成功",
            "000003": "订单成功",
            "000004": "订单取消",
            "000005": "身份验证失败",
            "000006": "长号成功",
            "000007": "签名完成",
            "000009": "订单提交成功",
            "000010": "活体认证成功",
            "000011": "活体认证失败",
            "000012": "已发货",
            "000016": "联通待支付",
            "000017": "分期成功"
        },
        'timeStatus': {
            "000001": "下单时间：",
            "000002": "下单时间：",
            "000003": "完成时间：",
            "000004": "下单时间：",
            "000005": "下单时间：",
            "000006": "下单时间：",
            "000007": "下单时间：",
            "000009": "下单时间：",
            "000010": "下单时间：",
            "000011": "下单时间：",
            "000012": "完成时间：",
            "000016": "下单时间：",
            "000017": "下单时间"
        }
    }
    return function(input, type) {
        return obj[type][input];
    }
})

.filter("gradeColor", function() {
    var obj = {
        "color": {
            "000001": "greenColor",
            "000002": "blueColor",
            "000003": "warnColor",
            "000004": "redColor"
        },
        "name": {
            "000001": "优秀",
            "000002": "良好",
            "000003": "一般",
            "000004": "差"
        }
    }
    return function(input, type) {
        return obj[type][input];
    }
})

.filter("orderTypeColor", function() {
    var obj = {
        "color": {
            "1": "order-deal",
            "2": "order-finish",
            "3": "order-cancel"
        },
        "name": {
            "1": "号码",
            "2": "融合",
            "3": "单宽"
        }
    }
    return function(input, type) {
        return obj[type][input];
    }
})

.filter("orderColor", function() {
        var obj = {
            "color": {
                "000001": "order-deal",
                "000003": "order-finish",
                "000004": "order-cancel"
            },
            "name": {
                "000001": "待处理",
                "000003": "已完成",
                "000004": "已取消"
            }
        }
        return function(input, type) {
            return obj[type][input];
        }
    })
    .filter("workColor", function() {
        var obj = {
            "color": {
                "000001": "goingStatus",
                "000002": "unfinishedStatus",
                "000003": "finishStatus",
                "000005": "otherStatus",
                "000006": "finishStatus",
                "000007": "otherStatus"
            },
            "name": {
                "000001": "未联系",
                "000002": "用户取消",
                "000003": "同意办理",
                "000005": "预约",
                "000006": "录单成功",
                "000007": "装维回执"
            },
            "timeStatus": {
                "000001": "下单时间：",
                "000002": "下单时间：",
                "000003": "下单时间：",
                "000005": "下单时间：",
                "000006": "完成时间：",
                "000007": "下单时间："
            }
        }
        return function(input, type) {
            return obj[type][input];
        }
    })
    //判断是bss还是cbss
    .filter("orderType", function() {
        var obj = {
            'type': {
                "000001": "CBSS",
                "000002": "BSS"
            }
        }
        return function(input, type) {
            return obj[type][input];
        }
    });