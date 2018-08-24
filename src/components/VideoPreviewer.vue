<template>
  <div class="video-previewer" :style="{height: height, width: width}">
    <video-player :options="options" ref="videoPlayer" class="the-player"></video-player>
  </div>
</template>

<script>
export default {
  name: 'video-previewer',
  data() {
    return {};
  },
  props: {
    options: {
      required: true,
      type: Object
    },
    width: {
      required: false,
      type: String,
      default: '100%'
    },
    height: {
      required: false,
      type: String,
      default: 'auto'
    }
  }
};
</script>

<style scoped>
.video-previewer {
  min-width: 500px;
  min-height: 400px;
  display: block;
  margin: auto auto;
}
.vjs-tech {
  display: block;
  margin: auto auto
}
</style>
