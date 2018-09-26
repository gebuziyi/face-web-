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
import { getUserRechargeTypeAuditPieData } from '../../../../api/audit/user-audit';
import { USER_REGIST_TYPE } from '../../../../utils/constants';

export default {
  name: 'videoType-playCount-audit-page',

  data() {
    return {
      pieChart: null,
      option: null,
      userRegistType: USER_REGIST_TYPE
    };
  },

  methods: {
    refreshChartData() {
      // 表格加载动画
      this.pieChart.showLoading();

      getUserRechargeTypeAuditPieData()
        .then(({ data }) => {
          // 隐藏加载动画
          this.pieChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '用户注册类型数量统计',
              subtext: '统计每个注册类型下的用户数量',
              x: 400
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: this.userRegistType.map(item => {
                return item.description;
              })
            },
            series: [
              {
                name: '注册数量',
                type: 'pie',
                radius: '30%',
                center: ['25%', '50%'],
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
                data: data.pieData.map(item => {
                  if (this.userRegistType) {
                    let data;
                    if (item.regType !== 0) {
                       data = {
                        name: this.userRegistType.find(row => row.type === item.regType)
                          .description,
                        value: item.regCount
                      };
                    } else {
                      data = {
                       name: this.userRegistType.find().description,
                       value: item.regCount
                     };
                    }
                    return data;
                  }
                }).sort((a, b) => b.value - a.value),
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

.audit-page{
  border: 3px solid #DDDDDDDD;
  height: 750px;
  width: 750px;
  margin:10px;
}
</style>
