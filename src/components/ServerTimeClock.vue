<template>
  <div class="clock-wrapper">
    <el-tooltip content="服务器当前时间">
      <span>{{ serverTime }}</span>
    </el-tooltip>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'server-time-clock',
  data() {
    return {
      serverTime: null
    };
  },
  methods: {
    updateTime() {
      let time = DateTime.local()
        .setZone('America/New_York')
        .toFormat('yyyy-MM-dd HH:mm:ss');
      this.serverTime = time;
    }
  },
  created() {
    setInterval(this.updateTime, 1000);
    this.updateTime();
  }
};
</script>

<style scoped>
.clock-wrapper {
  display: inline-block;
  padding-right: 1em;
}
</style>
