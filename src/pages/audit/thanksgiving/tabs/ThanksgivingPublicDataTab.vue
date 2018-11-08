<template>
  <div style="width: 100%;">
    <h3 tyle="padding: 10px"> 总注册用户数量：{{ registerCount ? registerCount : 0 }}</h3>
    <el-row class="line-chart-row">
      <el-col :span="24">
        <thanksgiving-register-count></thanksgiving-register-count>
      </el-col>
    </el-row>
    <el-row class="line-chart-row">
      <el-col :span="24">
        <thanksgiving-recharge-data></thanksgiving-recharge-data>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAllPublicTotalByThanksgivingDays } from '../../../../api/audit/thanksgiving-audit';
import ThanksgivingDaysRegisterAuditByDailyLine from './charts/ThanksgivingDaysRegisterAuditByDailyLine';
import ThanksgivingDaysRechargeAuditByDailyLine from './charts/ThanksgivingDaysRechargeAuditByDailyLine';

export default {
  name: 'thanksgiving-public-audit',
  components: {
    'thanksgiving-register-count': ThanksgivingDaysRegisterAuditByDailyLine,
    'thanksgiving-recharge-data': ThanksgivingDaysRechargeAuditByDailyLine
  },

  data() {
    return {
      registerCount: null
    };
  },
  methods: {
    getData() {
      getAllPublicTotalByThanksgivingDays().then(({ data }) => {
        this.registerCount = data.detail.registerCount;
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
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
  width: 600px;
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
