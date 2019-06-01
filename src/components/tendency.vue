<template>
  <div class="line1">
    <div id="line1" style="width: 100%;height:450px; margin:0 auto;"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/tooltip";
export default {
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  props: ['sevenDate', 'sevenDay'],
  methods: {
    initData() {
      const colors = ["#fecb4f", "#5bb3ed"];
      const option = {
        color: colors,
        // 表头
        // title: {
        //   text: "今日统计",
        //   subtext: ""
        // },
        // 鼠标放到图形上，文字出现的方法
        tooltip: {
          // 跟随鼠标的浮动宽文字位置
          textStyle: {
            align: "center"
          },
          // 什么方式出现：item或axis
          trigger: "axis"
        },
        grid: {
          x:40,
            x2:0,
            y:25,
            width:'95%',
        },
        // legend: {
        //   data: ["订单金额", "订单销量"],
        //   x: "right"
        // },
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line"] },
            restore: {}
          }
        },
        xAxis: {
          type: "category",
          data: this.sevenDay
        },
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: 3000,
            position: "left",
            axisLine: {
               show: false,
              lineStyle: {
                color: "#999"
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          },
          {
            type: "value",
            name: "",
            min: 0,
            max: 3000,
            position: "left",
            axisLine: {
               show: false,
              lineStyle: {
                color: "#999"
              }
            },
            axisLabel: {
              formatter: "{value}"
            }
          }
        ],
        // 线型图
        series: [
          {
            name: "订单金额",
            type: "line",
            data: this.sevenDate[0],
            yAxisIndex: 1,
            // 显示的标志
            label: {
              normal: {
                show: true,
                position: "top",
                backgroundColor: "#fecb4f",
                borderColor: "#fecb4f",
                padding: 2,
                color: "#fff",
                
              }
            },
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(254, 203, 79,0.4)',
                    shadowBlur: 15,
                    shadowOffsetY: 15
                }
            },
          },
          {
            name: "订单销量",
            type: "line",
            data: this.sevenDate[1],
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: "bottom",
                backgroundColor: "#5bb3ed",
                borderColor: "#5bb3ed",
                padding: 2,
                color: "#fff"
              }
            },
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(91, 179, 237,0.4)',
                    shadowBlur: 15,
                    shadowOffsetY: 15
                }
            },
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  watch: {
    sevenDate: function() {
      this.initData();
    },
    sevenDay: function() {
      this.initData();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.line1 {
  background-color: #fff;
  display: flex;
  justify-content: center;
}
#line1 {
  overflow: hidden;
  padding-left:20px; 
}
</style>
