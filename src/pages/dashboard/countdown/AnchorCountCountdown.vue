<template>
  <div class="countdown-wrap">
    <el-card shadow="always">
      <el-row :gutter="100">
        <el-col :span="12">
          <span class="icon-wrapper">
            <i class="fa fa-microphone fa-3x" style="color: white"></i>
          </span>
        </el-col>
        <el-col :span="12">
          <p class="count-desc">主播数量</p>
          <p class="count">
            <count-to :startVal="0" :endVal="totalAnchorCount" :duration="3000"></count-to>
          </p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
import { queryAnchorCount } from '../../../api/dashboard/dashboard';

export default {
  name: 'anchor-count-countdown',

  components: {
    'count-to': countTo
  },

  data() {
    return {
      totalAnchorCount: 0
    };
  },

  methods: {
    getTotalAnchorCount() {
      queryAnchorCount()
        .then(({ data }) => {
          this.totalAnchorCount = data.count;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTotalAnchorCount();
  }
};
</script>

<style scoped>
.icon-wrapper {
  display: block;
  height: 70px;
  width: 80px;
  border-radius: 6px;
  background-color: #f4516c;
}

.icon-wrapper i {
  padding: 13px;
  padding-left: 25px;
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
