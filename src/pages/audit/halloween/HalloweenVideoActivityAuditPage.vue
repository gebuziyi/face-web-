<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="onTabClick" type="border-card">
      <el-tab-pane label="数据统计" name="dataAudit">
        <data-audit></data-audit>
      </el-tab-pane>
      <el-tab-pane label="视频排名" name="videoRanking">
        <video-ranking></video-ranking>
      </el-tab-pane>
      <el-tab-pane label="送礼排名" name="giftRanking">
        <gift-ranking></gift-ranking>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import DataAuditTab from './tabs/DataAuditTab';
import VideoRankingTab from './tabs/VideoRankingTab';
import GiftRankingTab from './tabs/GiftRankingTab';
export default {
  name: 'halloween-videl-audit-page',

  components: {
    'data-audit': DataAuditTab,
    'video-ranking': VideoRankingTab,
    'gift-ranking': GiftRankingTab
  },

  data() {
    return {
      // 默认H5活动发布页
      activeTabName: 'dataAudit'
    };
  },
  methods: {
    onTabClick(tabName) {}
  }
};
</script>
<style scoped>
</style>
