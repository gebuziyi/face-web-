<template>
  <div class="countdown-wrap">
    <el-card shadow="always">
      <el-row :gutter="100">
        <el-col :span="12">
          <span class="icon-wrapper">
            <i class="fa fa-users fa-3x" style="color: white"></i>
          </span>
        </el-col>
        <el-col :span="12">
          <p class="count-desc">用户数量</p>
          <p class="count">
            <count-to :startVal="0" :endVal="totalUserCount" :duration="3000"></count-to>
          </p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
import { countTotalUser } from '../../../api/dashboard/dashboard';

export default {
  name: 'user-count-countdown',

  components: {
    'count-to': countTo
  },

  data() {
    return {
      totalUserCount: 0
    };
  },

  methods: {
    getTotalUserCount() {
      countTotalUser()
        .then(({ data }) => {
          this.totalUserCount = data.count;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTotalUserCount();
  }
};
</script>

<style scoped>
.icon-wrapper {
  display: block;
  height: 70px;
  width: 80px;
  border-radius: 6px;
  background-color: #1ba1f3;
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
