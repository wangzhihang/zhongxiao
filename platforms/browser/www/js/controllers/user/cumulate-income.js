appControllers.controller('cumulate-income', function($scope, $http, $rootScope) {
    $scope.title = '累计收益';
    var chart = Highcharts.chart('incomeCompare', {
        chart: {
            backgroundColor: '#F72F57',
            type: 'column'
        },
        title: {
            text: '12月收益柱状图',
            style: {
                color: '#ffffff'
            },
        },
        subtitle: {
            // text: '数据来源: WorldClimate.com'
        },
        xAxis: {
            categories: [
                '12.1', '12.2', '12.3', '12.4', '12.5', '12.6', '12.7'
            ],
            labels: {
                style: {
                    color: '#ffffff'
                }
            },
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '金额 (元)',
                style: {
                    color: '#ffffff'
                }
            },
            labels: {
                style: {
                    color: '#ffffff'
                }
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            // head + 每个 point + footer 拼接成完整的 table
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:#000000;padding:0">收益: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
            style: {
                color: '#000000'
            }
        },
        plotOptions: {
            column: {
                borderWidth: 0
            }
        },
        series: [{
            name: '<span style="color:#ffffff">收益</span>',
            color: '#ffffff',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6]
        }]
    });

})