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
import { getRechargeDataByThanksgivingLine } from '../../../../../api/audit/thanksgiving-public-audit';

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

      getRechargeDataByThanksgivingLine()
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
              data: ['充值人数', '充值金额']
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
              data: data.thanksgivingDays.map(data => data)
            },
            yAxis: [
              {
                type: 'value',
                name: '人数',
                axisLabel: {
                  formatter: '{value} 人'
                }
              },
              {
                type: 'value',
                name: '钻石',
                axisLabel: {
                  formatter: '{value} 个'
                }
              }
            ],
            series: [
              {
                name: '充值人数',
                type: 'line',
                data: data.rechargeUserCountList.map(data => data.rechargeUserCount),
                itemStyle: {
                  normal: {
                    label: {
                      show: true
                    }
                  }
                }
              },
              {
                name: '充值金额',
                type: 'line',
                yAxisIndex: 1,
                data: data.rechargeDiamondCountList.map(data => data.rechargeDiamondCount),
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
  margin:10px;
  height: 400px;
  width: 100%;
}
</style>
