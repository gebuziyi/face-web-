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
import { getVideoGift } from '../../../api/audit/video-Gift';

export default {
  name: 'user-search-by-key-audit-page',

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

      getVideoGift({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.barChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '视频礼物统计信息',
              left: 'center',
              subtext: '按礼物总数从大到小, 最多显示前十名'
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
              data: ['礼物总数', '总金额(钻石数)']
            },
            xAxis: {
              name: '视频名称',
              data: data.videoNameList
            },
            yAxis: [
              {
                type: 'value',
                name: '礼物总数',
                position: 'left'
              },
              {
                type: 'value',
                name: '总金额(钻石数)',
                position: 'right'
              }
            ],
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0]
              },
              {
                type: 'inside',
                yAxisIndex: [0, 1]
              }
            ],
            series: [
              {
                name: '总金额(钻石数)',
                type: 'bar',
                barWidth: '30%',
                data: data.giftCountList,
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
  margin-bottom: 3em;
}

.chart-wrapper {
  width: 100%;
}
</style>
