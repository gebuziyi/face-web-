<template>
  <div ref="line-chart" style="height: 400px; width: 100%">
  </div>
</template>

<script>
import { getDataCountByWeek } from '../../../api/dashboard/dashboard';

export default {
  name: 'weekly-registered-user-line-chart',

  data() {
    return {
      lineChart: null,
      options: null
    };
  },

  methods: {
    initLineChartData() {
      this.lineChart.showLoading();

      getDataCountByWeek()
        .then(({ data }) => {
          // 隐藏加载动画
          this.lineChart.hideLoading();

          let lineData = [];
          lineData.push({
            name: '新增用户数量',
            type: 'line',
            value: data.userCountList
          });

          this.option = {
            title: {
              text: '每周新增用户数量统计'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              data: ['新增用户数量']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              name: '周数',
              data: data.weekNumList.map(num => '第' + num + '周')
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '新增用户数量',
                type: 'line',
                data: data.userCountList,
                itemStyle: {
                  normal: {
                    label: {
                      show: true
                    }
                  }
                }
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          this.lineChart.setOption(this.option);
        })
        .catch(err => {});
    }
  },

  mounted() {
    // echarts
    let chartDom = this.$refs['line-chart'];
    this.lineChart = this.$echarts.init(chartDom);

    // 获取折线图数据
    this.initLineChartData();
    // 初始化折线图
    if (this.option && typeof this.option === 'object') {
      this.lineChart.setOption(this.option, true);
    }
  }
};
</script>

<style scoped>
</style>
