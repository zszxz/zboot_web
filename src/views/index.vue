<template>
    <!-- <div id="main" style="width: 600px;height:400px;"></div> -->
    <div class="main">
        <dv-border-box-11 title="系统生态驾驶舱"  class="top"></dv-border-box-11>
        <div class="center">
            <dv-border-box-12 :reverse="true" class="center-1">
                <div id="diskInfo" style="width:100%;height:100%" />
            </dv-border-box-12>
            <dv-border-box-12 class="center-2">
                <div id="jvmInfo" style="width:100%;height:100%" />
            </dv-border-box-12>
            <dv-border-box-12 class="center-3">
                <div style="font-size:16;color:#fff;left:30px;top:30px">系统名称:   {{sysInfo.osName}}</div>
                <div style="font-size:16;color:#fff;left:30px;top:30px">系统平台:   {{sysInfo.osArch}}</div>
                <div style="font-size:16;color:#fff;left:30px;top:30px">运行小时:   {{sysInfo.runDays}}</div>
            </dv-border-box-12>
            <dv-border-box-12 class="center-4">
                <div id="cpuInfo" style="width:100%;height:100%" />
            </dv-border-box-12>
        </div>
        <div class="bottom">
            <dv-border-box-12 class="bottom-left">
                <div  id="chinaMap" style="width:100%;height:100%"></div>
            </dv-border-box-12>
            <dv-border-box-12 class="bottom-right">
                <div id="memoryInfo" style="width:100%;height:100%" />
            </dv-border-box-12>    
        </div>   
        
       
        
        
        
    </div>
   
    
</template>

<script>
export default {
    data(){
        return{
            sysInfo:{}
        }
    },
    mounted(){
        this.getDiskInfo()
        this.countyDraw()
        this.getCpuInfo()
        this.getMemoryInfo()
        this.getJVMInfo()
        this.getSysInfo()
    },
    methods:{
        countyDraw(){
            let chinaJson = require('../assets/map/china.json');
            let echarts = require('echarts');
            echarts.registerMap('china', chinaJson);
            //初始化echarts实例
            const countyMap = echarts.init(document.getElementById("chinaMap"));
            let mapOption = {
                geo: {
                        map: 'china',
                        roam: false, //开启鼠标缩放和漫游
                        zoom: 1, //地图缩放级别
                        selectedMode: false, //选中模式：single | multiple
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        layoutCenter: ['50%', '60%'], //设置后left/right/top/bottom等属性无效
                        layoutSize: '100%', //保持地图宽高比
                        label: {
                            show:true,
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#101f32',
                                borderWidth: 1.1,
                                borderColor: '#43d0d6'
                            },
                            emphasis: {
                                areaColor: '#FB7293'
                            }
                        }
				    },        
            }
            countyMap.setOption(mapOption);
        },
        async getDiskInfo(){
            let echarts = require('echarts');
            const diskInfo = echarts.init(document.getElementById("diskInfo"));
            const {data: res} = await this.$api.sysview.getDiskInfo()
            let disk = res.data[0]
            let free = this.getKeyVal('磁盘可用率',disk.free)
            let usage = this.getKeyVal('磁盘使用率',disk.used)
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    top: 10,
                    data: ['磁盘可用率', '磁盘使用率'],
                    textStyle: { 
                        color: '#fff',
                        fontSize: 16
                    },
                },
                series: [
                    {
                        name: disk.typeName,
                        type: 'pie',
                        radius: ['50%', '60%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            free,
                            usage
                        ],
                        color: ['#32C5E9','#FFDB5C' ]
                    }
                ]
            };
            diskInfo.setOption(option)
        },
        async getJVMInfo(){
            let echarts = require('echarts');
            const jvmInfo = echarts.init(document.getElementById("jvmInfo"));
            const {data: res} = await this.$api.sysview.getJvmInfo()
            let jvm = res.data
            let free = this.getKeyVal('jvm可用率',jvm.free)
            let usage = this.getKeyVal('jvm使用率',jvm.used)
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    top: 10,
                    data: ['jvm可用率', 'jvm使用率'],
                    textStyle: { 
                        color: '#fff',
                        fontSize: 16
                    },
                },
                series: [
                    {
                        name: 'jvm使用情况',
                        type: 'pie',
                        radius: ['50%', '60%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            free,
                            usage
                        ],
                        color: ['#32C5E9','#FFDB5C' ]
                    }
                ]
            };
            jvmInfo.setOption(option)
        },
        async getCpuInfo(){
            let echarts = require('echarts');
            const cpuInfo = echarts.init(document.getElementById("cpuInfo"));
            const {data: res} = await this.$api.sysview.getCpuInfo()
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    top: 10,
                    data: ['系统cpu使用率', '用户cpu使用率', '当前cpu使用率'],
                    textStyle: { 
                        color: '#fff',
                        fontSize: 16
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                color: ['#A6E4A5','#32C5E9', '#F2A13A'],
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: ['cpu使用率(单位:百分比)' ],
                    axisLabel : {
                            textStyle: {
                                color: '#fff'
                            }
                    }
                },
                series: [
                    {
                        name: '系统cpu使用率',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [this.toPoint(res.data.cSys)]
                    },
                     {
                        name: '用户cpu使用率',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [this.toPoint(res.data.user)]
                    },
                    {
                        name: '当前cpu使用率',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            show: true,
                            position: 'insideRight'
                        },
                        data: [this.toPoint(res.data.idle)]
                    }
                    
                    ]
                };
            cpuInfo.setOption(option) 
                  
        },
        async getMemoryInfo(){
            let echarts = require('echarts');
            const memoryInfo = echarts.init(document.getElementById("memoryInfo"));
            const {data: res} = await this.$api.sysview.getMemoryInfo()
            let option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [`可使用内存${this.geUnit(res.data.free)}`, `已使用内存${this.geUnit(res.data.used)}`, `总内存${this.geUnit(res.data.total)}`],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel : {
                            textStyle: {
                                color: '#fff'
                            }
                        }

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel : {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '内存使用情况',
                        type: 'bar',
                        barWidth: '50%',
                        data: [this.geVal(res.data.free),this.geVal(res.data.used),this.geVal(res.data.total)]
                    }
                ]
            };
            memoryInfo.setOption(option)
        },
        async getSysInfo(){
            const {data: res} = await this.$api.sysview.getSysInfo()
            this.sysInfo = res.data

        },
        getKeyVal(name,val){
            let obj = {}
            obj.name = name
            let pattern = /\d*[.]\d*/g
            obj.value = parseInt(pattern.exec(val)[0])
            return obj
        },
        geVal(val){
            let pattern = /\d*[.]\d*/g
            let value = pattern.exec(val)[0]
            return value
        },
        geUnit(val){
            let pattern = /\S*/g
            let value = pattern.exec(val)[0]
            return value
        },
        toPoint(percent){
            var str=percent.replace("%","");
            //str= str/100;
            return str;
        }

    }
  
}
</script>

<style scoped>
 .main{
     background-image: url('../assets/map/indexbk.png');
     background-position: center;
     background-size: cover;
     height: 100%;
     
 }
 .top{
    width: 100%;
     height: 10%;
 }
 .center{
     width: 100%;
     height: 40%;
     clear: both;
     overflow: hidden;
 }
.center-1 {
    float:left; 
    width:30%;
    height:200px;
}
.center-2{
    float:left; 
    width:40%;
    height:200px;
}
.center-3{
    float:left;
    width:30%;
    height:200px;
    text-align: center;
    line-height: 60px;
}
.center-4{
    float:left; 
    width:100%;
    height:150px;
}
.center-5{
    float:left;
    width:50%;
    height:150px;
}
.bottom-left {
    float:left;
    width:30%;
    height:100%;
}
.bottom-right {
    float:left;
    width:70%;
    height:100%;
}
.bottom {
     width: 100%;
     height: 50%;
     overflow: hidden;
 }
</style>