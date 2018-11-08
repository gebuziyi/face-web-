<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="onTabClick" type="border-card">
      <el-tab-pane label="数据统计" name="public-data">
        <public-data></public-data>
      </el-tab-pane>
      <el-tab-pane label="直播活动" name="video-topic">
        <live-active-audit></live-active-audit>
      </el-tab-pane>
      <el-tab-pane label="短视频活动" name="music-info">
        <video-active-audit></video-active-audit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ThanksgivingPublicDataTab from './tabs/ThanksgivingPublicDataTab';
import ThanksgivingLiveDataTab from './tabs/ThanksgivingLiveDataTab';
import ThanksgivingVideoDataTab from './tabs/ThanksgivingVideoDataTab';

export default {
  name: 'thanksgiving-active-audit',

  components: {
    'public-data': ThanksgivingPublicDataTab,
    'live-active-audit': ThanksgivingLiveDataTab,
    'video-active-audit': ThanksgivingVideoDataTab
  },

  data() {
    return {
      // 默认H5活动发布页
      activeTabName: 'public-data'
    };
  },

  methods: {
    onTabClick(tabName) {}
  }
};
</script>

<style scoped>
</style>
