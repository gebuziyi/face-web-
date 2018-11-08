<template>

  <div class="audit-page" >
      <el-row class="chart-desc" style="padding: 15px;">
        <el-button class="btn-operation" type="primary" size="mini" @click="initLineChartData">
          <i class="fa fa-refresh"></i>
          刷新数据
        </el-button>
      </el-row>
    <div ref="line-chart" style="width: 1600px; height: 300px">
    </div>
  </div>
</template>

<script>
import { getThanksgivingRegisterByDailyLineLine } from '../../../../../api/audit/thanksgiving-public-audit';

export default {
  name: 'thanksgiving-register-line-chart',

  data() {
    return {
      lineChart: null,
      options: null
    };
  },

  methods: {
    initLineChartData() {
      this.lineChart.showLoading();

      getThanksgivingRegisterByDailyLineLine()
        .then(({ data }) => {
          // 隐藏加载动画
          this.lineChart.hideLoading();
          this.option = {
            title: {
              text: '活动期间每日新增用户数量统计'
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
              name: '日期',
              data: data.thanksgivingDays.map(date => date)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '新增用户数量',
                type: 'line',
                data: data.newRegistList.map(data => data.register),
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
.audit-page{
  border: 3px solid #DDDDDDDD;
}
</style>
