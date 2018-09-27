<template>
  <div class="audit-page" >
    <el-row class="chart-desc" style="padding: 15px;">
      <el-button class="btn-operation" type="primary" size="mini" @click="refreshChartData">
        <i class="fa fa-refresh"></i>
        刷新数据
      </el-button>
    </el-row>
    <div class="chart-wrapper">
      <div ref="bar-chart" style="width: 1700px; height: 650px"></div>
    </div>
  </div>
</template>

<script>
import { getUserCountInCountryAuditData } from '../../../../api/audit/user-audit';

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

      getUserCountInCountryAuditData({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.barChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: 'FACECAST 会员国家分布图',
              left: 'center',
              subtext: '按会员总数从大到小, 最多显示前十名'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['会员总数', '男性会员', '女性会员', '主播']
            },
            xAxis: {
              name: '国家',
              data: data.countryNameList
            },
            yAxis: {
              type: 'value',
              name: '会员数量',
              position: 'left',
              axisLabel: {
                formatter: '{value} 人'
              }
            },
            grid: {
              y: 100,
              bottom: '40%'
            },
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0]
              },
              {
                type: 'inside',
                yAxisIndex: [0]
              }
            ],
            series: [
              {
                name: '会员总数',
                type: 'bar',
                data: data.userCountList,
                itemStyle: {
                  normal: {
                    // 在柱状图上方显示数值
                    label: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              },
              {
                name: '男性会员',
                type: 'bar',
                data: data.maleUserCountList,
                itemStyle: {
                  normal: {
                    // 在柱状图上方显示数值
                    label: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              },
              {
                name: '女性会员',
                type: 'bar',
                data: data.femaleUserCountList,
                itemStyle: {
                  normal: {
                    // 在柱状图上方显示数值
                    label: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              },
              {
                name: '主播',
                type: 'bar',
                data: data.anchorCountList,
                itemStyle: {
                  normal: {
                    // 在柱状图上方显示数值
                    label: {
                      show: true,
                      position: 'top'
                    }
                  }
                }
              }
            ]
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
}

.chart-wrapper {
  width: 100%;
}

.audit-page{
  border: 3px solid #DDDDDDDD;
  margin:10px;
  height: 500px;
  width: 100%;
}
</style>
