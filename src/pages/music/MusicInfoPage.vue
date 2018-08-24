<template>
  <div id="music-info-page">
    <el-tabs tab-position="top" style="height: 100%;" type="border-card" v-model="activeTab">
      <el-tab-pane name="music.info.admin">
        <template slot="label">
          <i class="fa fa-server"></i>
          <span>后台上传音乐</span>
        </template>
        <admin-music-info-tab v-if="shouldTabShow('music.info.admin')"></admin-music-info-tab>
      </el-tab-pane>
      <el-tab-pane label="用户原创声音" name="music.info.user">
        <template slot="label">
          <i class="fa fa-user"></i>
          <span>用户原创声音</span>
        </template>
        <user-music-info-tab v-if="shouldTabShow('music.info.user')"></user-music-info-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserMusicInfoTab from './UserMusicInfoTab';
import AdminMusicInfoTab from './AdminMusicInfoTab';

export default {
  name: 'music-info-page',
  data() {
    return {
      activeTab: 'music.info.admin'
    };
  },
  methods: {
    shouldTabShow(tabName) {
      return this.activeTab === tabName
    }
  },
  components: {
    'admin-music-info-tab': AdminMusicInfoTab,
    'user-music-info-tab': UserMusicInfoTab
  }
};
</script>

<style>

.el-tooltip__popper {
  max-width: 300px;
}

</style>
