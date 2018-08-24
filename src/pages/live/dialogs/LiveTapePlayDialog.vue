<template>
  <el-dialog :visible.sync="show" title="查看录播文件" width="800px" :close-on-click-modal="false">
    <div class="mg-btm-1em">
      <span>主播昵称:</span>
      <span class="pd-left-3em">{{ liveInfo.nickname }}</span>
    </div>
    <div class="mg-btm-1em">
      <span>直播标题:</span>
      <span class="pd-left-3em">{{ liveInfo.infoName }}</span>
    </div>
    <div class="mg-btm-1em">
      <span>直播时间:</span>
      <span class="pd-left-3em">{{ liveInfo.startTime }} - {{ liveInfo.endTime }}</span>
    </div>
    <template v-for="(item, idx) in tapeUrls">
      <!-- 自动播放第一个录播视频 -->
      <div class="video-wrapper mg-btm-1em" :key="idx">
        <video-player :options="{
        autoplay: idx === 0 ? true : false,
        width: 750,
        height: 600,
        sources: [
          {
            // hls, .m3u8
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: item
          }
        ],
        poster: liveInfo.liveImg,
        flash: { hls: { withCredentials: false }},
        html5: { hls: { withCredentials: false }}
      }"></video-player>
      </div>
    </template>
    <span slot="footer">
      <el-button @click="show = false" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
// videojs
import videojs from 'video.js';
window.videojs = videojs;
// hls plugin for videojs6
require('videojs-contrib-hls/dist/videojs-contrib-hls.js');

export default {
  name: 'live-tape-play-dialog',

  data() {
    return {
      show: false,
      liveInfo: {
        nickname: '',
        fileUrl: ''
      }
    };
  },

  computed: {
    tapeUrls() {
      if (
        this.liveInfo.fileUrl === null ||
        typeof this.liveInfo.fileUrl === 'undefined' ||
        this.liveInfo.fileUrl === ''
      ) {
        return [];
      }
      return this.liveInfo.fileUrl.split(',').filter(item => item !== '');
    }
  },

  methods: {
    showDialog(row) {
      this.loading = true;
      this.liveInfo = row;
      this.show = true;
    }
  }
};
</script>

<style scoped>
.mg-btm-1em {
  margin-bottom: 1em;
}
.player-wrapper {
  min-width: 500px;
  min-height: 400px;
  display: block;
  margin: auto auto;
}
</style>
