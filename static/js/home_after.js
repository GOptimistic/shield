//app.title = '折柱混合';
let histogram = echarts.init(document.getElementById('histogram'));

option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#99573b'
            }
        }
    },
    toolbox: {
        feature: {
            magicType: {show: true, type: ['line','bar']},
            restore: {show: true},
        }
    },
    legend: {
        data:['贷款交易总量','异常交易量']
    },
    xAxis: [
        {
            type: 'category',
            data: ['2007年','2008年','2009年','2010年','2011年','2012年','2013年','2014年','2015年'],
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis:
        {
            type: 'value',
            name: '交易量',
            min: 0,
            max: 400000,
            axisLabel: {
                formatter: '{value} 次'
            }
        },
    series: [
          {
            name:'异常交易量',
            type:'line',
            stack: '总量',
            data:[0, 0, 0, 7, 89, 349, 3123, 7908, 8774]
        },
        {
            name:'贷款交易总量',
            type:'line',
            stack: '总量',
            data:[206, 1314, 4122, 9809, 17909, 43723, 114782, 210543, 386875]
        }

    ]
};
histogram.setOption(option1);

let pie1 = echarts.init(document.getElementById('piechat1'),'vintage');
option2 = {
    title : {
        text: '交易状态统计',
        subtext: '还款情况',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: '20',
        data: ['已付清','还款中','宽限期中','迟付1-15天','迟付16-30天','迟付31-120天']
    },
    series : [
        {
            name: '还款状态',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:200349, name:'已付清'},
                {value:568683, name:'还款中'},
                {value:6015, name:'宽限期中'},
                {value:1148, name:'迟付1-15天'},
                {value:10872, name:'迟付16-30天'},
                {value:2215, name:'迟付31-120天'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
pie1.setOption(option2);

let pie2 =  echarts.init(document.getElementById('piechat2'));
option3 = {
    title : {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: '20',
        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
pie2.setOption(option3);