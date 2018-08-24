<template>
  <div class="countdown-wrap">
    <el-card shadow="always">
      <el-row :gutter="100">
        <el-col :span="12">
          <span class="icon-wrapper">
            <i class="fa fa-file-video-o fa-3x" style="color: white"></i>
          </span>
        </el-col>
        <el-col :span="12">
          <p class="count-desc">视频数量</p>
          <p class="count">
            <count-to :startVal="0" :endVal="totalVideoCount" :duration="3000"></count-to>
          </p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import countTo from 'vue-count-to';
import { countTotalVideo } from '../../../api/dashboard/dashboard';

export default {
  name: 'video-count-countdown',

  components: {
    'count-to': countTo
  },

  data() {
    return {
      totalVideoCount: 0
    };
  },

  methods: {
    getTotalVideoCount() {
      countTotalVideo()
        .then(({ data }) => {
          this.totalVideoCount = data.count;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTotalVideoCount();
  }
};
</script>

<style scoped>
.icon-wrapper {
  display: block;
  height: 70px;
  width: 80px;
  border-radius: 6px;
  background-color: #40c9c6;
}

.icon-wrapper i {
  padding: 13px;
  padding-left: 20px;
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
