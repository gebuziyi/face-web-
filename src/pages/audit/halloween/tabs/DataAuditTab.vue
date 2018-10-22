<template>
  <div>
    <div class="give-change">
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            总注册人数:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{datas.register ? datas.register : 0 }}人
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与送礼人数:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{datas.benefactor ? datas.benefactor : 0 }}人
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            新增视频总数:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{datas.videoCounts ? datas.videoCounts : 0 }}个
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与送礼(糖果):  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{datas.giveCandyUsers ? datas.giveCandyUsers : 0 }}人
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{datas.candys ? datas.candys : 0 }}个礼物
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价值{{datas.candsDiamonds ? datas.candsDiamonds : 0 }}钻石
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与活动人数:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{datas.participant ? datas.participant : 0 }}人
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与送礼(鬼魂):  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{datas.giveGhostUsers ? datas.giveGhostUsers : 0 }}人
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{datas.ghost ? datas.ghost : 0 }}个礼物
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价值{{datas.ghostDiamonds ? datas.ghostDiamonds : 0 }}钻石
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
           参与活动的视频:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{datas.activeVideoCounts ? datas.activeVideoCounts : 0 }}个
          </div>
        </el-col>
      </el-row>
    </div>
    <br>
    <div class="audit-page">
      <el-row class="chart-desc">
        <el-button class="btn-operation" type="primary" size="mini" @click="refreshChartData">
          <i class="fa fa-refresh"></i>
          刷新数据
        </el-button>
      </el-row>
      <div class="chart-wrapper">
        <div ref="line-chart" style="width: 1600px; height: 400px"></div>
      </div>
    </div>
  </div>
</template>
<script>

import { getHalloweenVideoActiveAuditData, getHalloweenLineDatas } from '../../../../api/audit/helloween';
export default {
  name: 'halloween-video-data-audit',

  data() {
    return {
      lineChart: null,
      option: null,
      pager: {
        page: 1,
        limit: 10
      },
      datas: {
        register: null,
        benefactor: null,
        videoCounts: null,
        giveCandyUsers: null,
        candys: null,
        candsDiamonds: null,
        participant: null,
        giveGhostUsers: null,
        ghost: null,
        ghostDiamonds: null,
        activeVideoCounts: null
      },
      loading: {
        table: true
      }
    };
  },
  methods: {
    refreshChartData() {
      // 表格加载动画
      this.lineChart.showLoading();

      getHalloweenLineDatas({
        pager: this.pager
      })
        .then(({ data }) => {
          // 隐藏加载动画
          this.lineChart.hideLoading();

          // 设置柱状图数据并渲染
          // {countryNameList, userCountList, femaleUserCountList, maleUserCountList, anchorCountList}

          this.option = {
            title: {
              text: '每日数据统计'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['每日用户注册数', '每日新增视频数']
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
              name: '天数',
              data: data.halloweenDateList.map(num => num)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '每日用户注册数',
                type: 'line',
                data: data.newRegistList.map(
                  item => item.register
                )
              },
              {
                name: '每日新增视频数',
                type: 'line',
                data: data.newVideoList.map(
                  item => item.videos
                )
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          this.lineChart.setOption(this.option);
        })
        .catch(error => {});
    },
    query() {
      this.loading.table = true;
      this.pager.page = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading.table = true;
      getHalloweenVideoActiveAuditData()
        .then(({ data }) => {
          this.datas.register = data.detail.register;
          this.datas.benefactor = data.detail.benefactor;
          this.datas.videoCounts = data.detail.videoCounts;
          this.datas.giveCandyUsers = data.detail.giveCandyUsers;
          this.datas.candys = data.detail.candys;
          this.datas.candsDiamonds = data.detail.candsDiamonds;
          this.datas.participant = data.detail.participant;
          this.datas.giveGhostUsers = data.detail.giveGhostUsers;
          this.datas.ghost = data.detail.ghost;
          this.datas.ghostDiamonds = data.detail.ghostDiamonds;
          this.datas.activeVideoCounts = data.detail.activeVideoCounts;
        })
        .catch(error => {});
    }
  },
  created() {
    this.getTableData();
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
<style>
.give-change{
  border: 1px solid #DDDDDDDD;
  height: 220px;
}
.chart-wrapper {
  width: 100%;
}
.audit-page{
  border: 1px solid #DDDDDDDD;
  height: 480px;
  width: 100%;
}
.chart-desc{
  padding: 1em
}
</style>
