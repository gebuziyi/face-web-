<template>
  <div class="countdown-wrap">
    <el-card shadow="always">
      <el-row :gutter="100">
        <el-col :span="12">
          <span class="icon-wrapper">
            <i class="fa fa-diamond fa-3x" style="color: white"></i>
          </span>
        </el-col>
        <el-col :span="12">
          <p class="count-desc">钻石数量</p>
          <p class="count">
            <count-to :startVal="0" :endVal="totalDiamondCount" :duration="3000"></count-to>
          </p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
import { countTotalDiamond } from '../../../api/dashboard/dashboard';

export default {
  name: 'recharge-diamond-countdown',

  components: {
    'count-to': countTo
  },

  data() {
    return {
      totalDiamondCount: 0
    };
  },

  methods: {
    getTotalDiamondCount() {
      countTotalDiamond()
        .then(({ data }) => {
          this.totalDiamondCount = data.count;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTotalDiamondCount();
  }
};
</script>

<style scoped>
.icon-wrapper {
  display: block;
  height: 70px;
  width: 80px;
  border-radius: 6px;
  background-color: rgb(255, 202, 51);
}

.icon-wrapper i {
  padding: 13px;
}
.count-desc {
  font-size: 22px;
  color: grey;
}
.count {
  padding-top: 10px;
  font-size: 22px;
}
</style>
