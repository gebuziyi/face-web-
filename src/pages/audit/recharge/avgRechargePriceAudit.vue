<template>
  <div class="audit-page">
    <el-row class="chart-desc">
      <el-button class="btn-operation" type="primary" size="mini" @click="refreshChartData">
        <i class="fa fa-refresh"></i>
        刷新数据
      </el-button>
    </el-row>
    <div class="chart-wrapper">
      <div ref="line-chart" style="width: 1500px; height: 450px"></div>
    </div>
  </div>
</template>

<script>
import { getAvgRechargeAudit } from '../../../api/audit/avg-RechargePriceAudit';

export default {
  name: 'recharge-user-consume-ratio-audit-page',

  data() {
    return {
      lineChart: null,
      option: null,
      pager: {
        page: 1,
        limit: 10
      }
    };
  },

  methods: {
    refreshChartData() {
      // 表格加载动画
      this.lineChart.showLoading();

      getAvgRechargeAudit({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.lineChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '会员平均充值金额统计'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['总会员平均充值金额', '充值会员平均充值金额']
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
                name: '总会员平均充值金额',
                type: 'line',
                data: data.lineDataList.map(item => item.avgPricePerUser)
              },
              {
                name: '充值会员平均充值金额',
                type: 'line',
                data: data.lineDataList.map(
                  item => item.avgPricePerRechargeUser
                )
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          this.lineChart.setOption(this.option);
        })
        .catch(error => {});
    }
  },

  mounted() {
    let chartDom = this.$refs['line-chart'];
    this.lineChart = this.$echarts.init(chartDom);

    if (this.option && typeof this.option === 'object') {
      this.lineChart.setOption(this.option, true);
    }

    this.refreshChartData();
  }
};
</script>

<style scoped>
.chart-desc {
  width: 100%;
  margin-bottom: 3em;
}

.chart-wrapper {
  width: 100%;
}
</style>
