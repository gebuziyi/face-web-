<template>
  <div class="audit-page">
    <el-row class="chart-desc">
      <el-button class="btn-operation" type="primary" size="mini" @click="refreshChartData">
        <i class="fa fa-refresh"></i>
        刷新数据
      </el-button>
    </el-row>
    <div class="chart-wrapper">
      <div ref="bar-chart" style="width: 1500px; height: 650px"></div>
    </div>
  </div>
</template>

<script>
import { getPayTypeInTop10CountryAuditData } from '../../../api/audit/payTypeInTop10Country-audit';

export default {
  name: 'user-count-in-country-audit-page',

  data() {
    return {
      barChart: null,
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
      this.barChart.showLoading();

      getPayTypeInTop10CountryAuditData({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.barChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '各充值类型充值的钻石数量比例',
              subtext: '按总钻石数量从大到小排序, 最多显示前10的国家',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function(params, ticket, callback) {
                const totalDiamond = params[params.length - 1].value;

                let tooltipLabel = '';
                // axis value label
                tooltipLabel =
                  tooltipLabel + params[0].axisValueLabel + ':<br/>';
                // series name value pairs
                for (let i = 0; i < params.length; i++) {
                  // 每项数据前面的小圆点:
                  // '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>'
                  tooltipLabel =
                    tooltipLabel +
                    // 小圆点
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                    params[i].color +
                    '"></span>' +
                    // 系列名称
                    params[i].seriesName;

                  if (i === params.length - 1) {
                    tooltipLabel = tooltipLabel + ': ';
                  } else {
                    tooltipLabel = tooltipLabel + '(占比): ';
                  }

                  // seriesIndex = params.length为总钻石数量, 不需要显示百分比
                  if (params[i].seriesIndex !== params.length - 1) {
                    // 计算钻石数量占比, 精确到小数点后4位.
                    let ratio =
                      Math.round(params[i].value / totalDiamond * 10000) / 100;

                    tooltipLabel =
                      tooltipLabel + params[i].value + ' (' + ratio + '%)';
                  } else {
                    tooltipLabel = tooltipLabel + params[i].value;
                  }
                  tooltipLabel = tooltipLabel + '<br/>';
                }
                return tooltipLabel;
              }
            },
            legend: {
              left: 'right',
              data: data.legendNames
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
              name: '钻石数量'
            },
            xAxis: {
              name: '国家',
              type: 'category',
              data: data.barData.map(item => item.countryName)
            },
            series: data.usedPayTypeNames
              .map(payTypeName => {
                let dataSeries = {
                  name: payTypeName,
                  type: 'bar',
                  stack: '钻石数量',
                  label: {
                    normal: {
                      show: true,
                      position: 'insideTop'
                    }
                  },
                  data: data.barData.map(countryData => {
                    let temp = countryData.auditInfo.filter(
                      item => item.payName === payTypeName
                    );
                    if (temp && temp.length !== 0) {
                      return temp[0].diamondCount;
                    } else {
                      // 如果没有该项值, 返回空字符串, 如果返回0, 则数字0有可能会覆盖显示, UI效果差
                      return '';
                    }
                  })
                };
                return dataSeries;
              })
              .concat({
                name: '总钻石数量',
                type: 'line',
                label: {
                  normal: {
                    show: true
                  }
                },
                data: data.barData.map(item => item.diamondTotalCount)
              })
          };

          // 使用刚指定的配置项和数据显示图表。
          this.barChart.setOption(this.option);
        })
        .catch(error => {});
    }
  },

  mounted() {
    let chartDom = this.$refs['bar-chart'];
    this.barChart = this.$echarts.init(chartDom);

    if (this.option && typeof this.option === 'object') {
      this.barChart.setOption(this.option, true);
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
