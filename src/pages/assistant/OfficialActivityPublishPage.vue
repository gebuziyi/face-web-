<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="onTabClick" type="border-card">
      <el-tab-pane label="H5页面活动" name="h5">
        <h5-activity></h5-activity>
      </el-tab-pane>
      <el-tab-pane label="视频话题活动" name="video-topic">
        <video-topic-activity></video-topic-activity>
      </el-tab-pane>
      <el-tab-pane label="音乐信息活动" name="music-info">
        <music-info-activity></music-info-activity>
      </el-tab-pane>
      <el-tab-pane label="直播间活动" name="LiveRoom-info">
        <live-room-activity></live-room-activity>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import H5ActivityPublishTab from './tabs/H5ActivityPublishTab';
import VideoTopicActivityPublishTab from './tabs/VideoTopicActivityPublishTab';
import MusicInfoActivityPublishTab from './tabs/MusicInfoActivityPublishTab';
import LiveRoomInfoActivityPublishTab from './tabs/LiveRoomInfoActivityPublishTab';
export default {
  name: 'official-activity-publish-page',

  components: {
    'h5-activity': H5ActivityPublishTab,
    'video-topic-activity': VideoTopicActivityPublishTab,
    'music-info-activity': MusicInfoActivityPublishTab,
    'live-room-activity': LiveRoomInfoActivityPublishTab
  },

  data() {
    return {
      // 默认H5活动发布页
      activeTabName: 'h5'
    };
  },

  methods: {
    onTabClick(tabName) {}
  }
};
</script>

<style scoped>
</style>
