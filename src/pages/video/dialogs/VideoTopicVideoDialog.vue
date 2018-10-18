<template>
  <el-dialog :visible.sync="show" :title="`#${theTopic.tname} - 视频列表`" width="1200px" :close-on-click-modal="false">
    {{ theTopic.topicId }}
  </el-dialog>
</template>

<script>
export default {
  name: 'video-topic-video-dialog',

  data() {
    return {
      theTopic: {
        tname: '',
        topicId: null
      },
      show: false
    };
  },

  methods: {
    showDialog(row) {
      this.theTopic.tname = row.tname;
      this.theTopic.topicId = row.topicId;
      this.show = true;
    }
  }
};
</script>

<style scoped>
</style>
