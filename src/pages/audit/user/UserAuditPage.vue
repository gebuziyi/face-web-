<template>
  <div class="dashboard">
    <!-- <el-row class="count-down-row" :gutter="20">
      <el-col :span="6" class="countdown-col user-count-col">
        <user-count-countdown></user-count-countdown>
      </el-col>
      <el-col :span="6" class="countdown-col video-count-col">
        <video-count-countdown></video-count-countdown>
      </el-col>
      <el-col :span="6" class="countdown-col anchor-count-col">
        <anchor-count-countdown></anchor-count-countdown>
      </el-col>
      <el-col :span="6" class="countdown-col user-count-col">
        <recharge-diamond-countdown></recharge-diamond-countdown>
      </el-col>
    </el-row> -->
    <el-row class="line-chart-row">
      <el-col :span="24">
        <user-count-in-country></user-count-in-country>
      </el-col>
    </el-row>
    <el-row class="line-chart-row">
      <el-col :span="24">
        <user-count-by-week></user-count-by-week>
      </el-col>
    </el-row>
    <el-row class="line-chart-row">
      <el-col :span="24">
        <user-count-by-nearly-30-days></user-count-by-nearly-30-days>
      </el-col>
    </el-row>
    <el-row class="order-user-table-row" :gutter="60">
      <el-col :span="16" class="latest-10-order-col">
        <user-register-count></user-register-count>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import UserCountInCountryAuditPage from './charts/UserCountInCountryAuditPage';
import UserCountByRegistAuditPage from './charts/UserCountByRegistAuditPage';
import WeeklyRegisteredUserLineChart from './charts/WeeklyRegisteredUserLineChart';
import NearlyThirtydaysRegistAuditPage from './charts/NearlyThirtydaysRegistAuditPage';

export default {
  name: 'dashboard',

  components: {
    'user-count-in-country': UserCountInCountryAuditPage,
    'user-register-count': UserCountByRegistAuditPage,
    'user-count-by-week': WeeklyRegisteredUserLineChart,
    'user-count-by-nearly-30-days': NearlyThirtydaysRegistAuditPage
  },

  data() {
    return {};
  }
};
</script>

<style scoped>
/* .dashboard {
} */
.count-down-row {
  margin-top: 10px;
  height: 120px;
}
.countdown-col {
  height: 120px;
}
.line-chart-row {
  margin-top: 20px;
  height: 400px;
  width: 100%;
}
.order-user-table-row {
  margin-top: 20px;
  height: 600px;
  width: 100%;
}
.latest-10-order-col {
  width:600px;
}
/* .latest-10-reg-user-col {
} */
.table-desc {
  font-size: 20px;
  color: grey;
  width: 600px;
}
.most-like-top10-videos-row {
  margin-top: 20px;
  height: 300px;
  background-color: darkturquoise;
}
.most-popular-top10-live-row {
  margin-top: 20px;
  height: 400px;
  background-color: teal;
}
</style>
