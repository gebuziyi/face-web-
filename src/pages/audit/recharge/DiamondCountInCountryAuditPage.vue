<template>
  <div class="audit-page">
    <el-row class="chart-desc">
      <el-button class="btn-operation" type="primary" size="mini" @click="refreshChartData">
        <i class="fa fa-refresh"></i>
        刷新数据
      </el-button>
    </el-row>
    <div class="chart-wrapper">
      <div ref="pie-chart" style="width: 1500px; height: 650px"></div>
    </div>
  </div>
</template>

<script>
import { getDiamondCountInCountryAuditData } from '../../../api/audit/diamondCountInCountry-audit';

export default {
  name: 'diamondCount-inCountry-audit-page',

  data() {
    return {
      pieChart: null,
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
      this.pieChart.showLoading();

      getDiamondCountInCountryAuditData({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.pieChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '充值钻石数量按国家统计',
              subtext:
                '按充值钻石数量从大到小, 显示前十名国家的统计信息, 非前十国家用[其他国家]统称',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: data.pieData
                .map(item => item.countryName)
                .concat('其他国家')
            },
            series: [
              {
                name: '钻石数量',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                roseType: 'radius',
                // 富文本显示饼图内容
                label: {
                  normal: {
                    formatter:
                      '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                      a: {
                        color: '#999',
                        lineHeight: 22,
                        align: 'center'
                      },
                      hr: {
                        borderColor: '#aaa',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 16,
                        lineHeight: 33
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#334455',
                        padding: [2, 4],
                        borderRadius: 2
                      }
                    }
                  }
                },
                data: data.pieData
                  .map(item => {
                    let data = {
                      name: item.countryName,
                      value: item.diamondTotalCount
                    };
                    return data;
                  })
                  .concat({
                    name: '其他国家',
                    value: data.notTop10TotalCount
                  }),
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
          // 使用刚指定的配置项和数据显示图表。
          this.pieChart.setOption(this.option);
        })
        .catch(error => {});
    }
  },

  mounted() {
    let chartDom = this.$refs['pie-chart'];
    this.pieChart = this.$echarts.init(chartDom);

    if (this.option && typeof this.option === 'object') {
      this.pieChart.setOption(this.option, true);
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
