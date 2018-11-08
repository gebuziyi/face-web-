<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="onTabClick" type="border-card">
      <!-- <el-tab-pane label="明星榜" name="list-of-start">
        <list-of-start></list-of-start>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="粉丝榜" name="fan-list">
        <fan-list></fan-list>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
// import ThanksgivingGiftAccountTab from './live-tabs/ThanksgivingGiftAccountTab';
// import ThanksgivingGiftFromTab from './live-tabs/ThanksgivingGiftFromTab';

export default {
  name: 'thanksgiving-live-audit',

  components: {
    // 'list-of-start': ThanksgivingGiftAccountTab
    // 'fan-list': ThanksgivingGiftFromTab
  },

  data() {
    return {
      // 默认活动发布页
      activeTabName: 'list-of-start'
    };
  },

  methods: {
    onTabClick(tabName) {}
  }
};
</script>

<style scoped>
</style>
