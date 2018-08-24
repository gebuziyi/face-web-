<template>
  <div id="user-page">
    <el-tabs tab-position="top" style="height: 100%;" type="border-card" v-model="activeTab">
      <el-tab-pane name="user.info">
        <template slot="label">
          <i class="fa fa-user"></i>
          <span>基本信息</span>
        </template>
        <user-info-tab v-if="shouldTabShow('user.info')"></user-info-tab>
      </el-tab-pane>
      <el-tab-pane v-if="hasPermission('user:account-info:list')" name="user.detail.more">
        <template slot="label">
          <i class="fa fa-info-circle"></i>
          <span>更多信息</span>
        </template>
        <user-detail-info-tab v-if="shouldTabShow('user.detail.more')"></user-detail-info-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserInfoTab from './UserInfoTab';
import UserDetailInfoTab from './UserDetailInfoTab';

export default {
  name: 'user-page',
  data() {
    return {
      activeTab: 'user.info'
    };
  },
  methods: {
    shouldTabShow(tabName) {
      return this.activeTab === tabName;
    }
  },
  components: {
    'user-info-tab': UserInfoTab,
    'user-detail-info-tab': UserDetailInfoTab
  }
};
</script>

<style scoped>

</style>
