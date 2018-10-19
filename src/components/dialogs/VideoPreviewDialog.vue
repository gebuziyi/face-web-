<template>
  <el-dialog :title="title" :width="width" :visible.sync="show" :append-to-body="true">
    <div class="player-wrapper">
      <video-player :options="options" ref="videoPlayer" class="the-player"></video-player>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
      <slot name="footer"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'video-preview-dialog',
  data() {
    return {
      show: false,
      options: {}
    };
  },
  methods: {
    showDialog(options) {
      this.options = options;
      this.show = true;
    }
  },
  props: {
    width: {
      default: '850px'
    },
    height: {
      default: '800px'
    },
    title: {
      default: '视频预览'
    }
  }
};
</script>

<style scoped>
.player-wrapper {
  min-width: 500px;
  min-height: 400px;
  display: block;
  margin: auto auto;
}
</style>
