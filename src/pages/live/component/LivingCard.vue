<template>
  <div class="living-card-wrapper">
    <el-card :body-style="{ padding: '0px' }" shadow="hover" v-loading="loading">
      <slot name="header">
        <div>
          <span class="live-home-name">{{ model.infoName }}</span>
          <template>
            <el-tag class="living-status" type="success" size="mini" v-if="model.types !== 3">
              <span>直播中</span>
              <i class="fa fa-video-camera" style="padding-left: 0.5em"></i>
            </el-tag>
            <el-tag type="danger" size="mini" class="living-status" v-else>
              <span>私密直播中</span>
              <i class="fa fa-lock" style="padding-left: 0.5em"></i>
            </el-tag>
          </template>
        </div>
      </slot>
      <div :id="`id_video_container_${model.infoId}`" style="width:100%; height:auto;min-height: 400px;" v-loading="dialog.livePreview.loading" element-loading-text="正在加载播放器"></div>
      <div style="padding: 10px;">
        <p class="anchor-name">主播昵称: {{ model.nickname }}</p>
        <p class="open-time">开播时间: {{ model.startTime }}</p>
        <div class="bottom clearfix">
          <el-button type="success" size="mini" class="button" @click="doRecommendLive" v-if="hasPermission('assistant:activity:publish')">推荐</el-button>
          <el-button type="danger" size="mini" class="button" @click="doCloseLive">关播</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { closeCurrentLive } from '../../../api/live/live-home-info';
import { sendLiveMsg } from '../../../api/assistant/official-activity';

export default {
  name: 'living-card',
  data() {
    return {
      loading: false,
      dialog: {
        livePreview: {
          show: null,
          player: null,
          loading: true
        }
      }
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  methods: {
    doRecommendLive() {
      this.$prompt('请输入小助手推荐语', '推荐当前直播到所有用户小助手', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]{10,}$/,
        inputErrorMessage: '推荐语长度 >= 10'
      })
        .then(({ value }) => {
          let msg = {
            text: value,
            id: this.model.liveId
          };
          sendLiveMsg(msg)
            .then(resp => {
              this.$message.success('推荐成功');
            })
            .catch(err => {
              this.$message.error('推荐失败');
            })
        })
        .catch(() => {});
    },
    doCloseLive() {
      this.$confirm(
        `此操作将关闭主播 [${
          this.model.nickname
        }] 的本场直播, 本场直播时长将不计入有效工作时长, 已开播的直播会被立即关闭, 是否继续?`,
        '关播',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true;
          closeCurrentLive(this.model.infoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.loading = false;
              this.$emit('status-change', {
                infoId: this.model.infoId
              });
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    doDisableLive() {
      this.$confirm(
        `此操作将禁止主播 [${
          this.model.nickname
        }] 继续直播, 禁播时长为期1天(24小时), 在此期间主播将无法继续发起直播, 已开播的直播会被立即关闭, 是否继续?`,
        '禁播',
        {
          type: 'warning'
        }
      )
        .then(() => {
          closeCurrentLive(this.model.infoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.refreshData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    showLivePreviewDialog() {
      var option = {
        live_url: this.model.hlsUrl,
        live_url2: this.model.flvUrl,
        width: 800,
        height: 600,
        // 默认静音
        volume: 0
      };
      this.dialog.livePreview.show = true;

      /* eslint-disable no-undef */

      setTimeout(() => {
        this.dialog.livePreview.player = new qcVideo.Player(
          `id_video_container_${this.model.infoId}`,
          option
        );
        let code = this.dialog.livePreview.player.play();
        if (code !== 200) {
          code = this.dialog.livePreview.player.play();
        }
        this.dialog.livePreview.loading = false;
      }, 1000);
    },
    refreshData() {}
  },
  mounted() {
    this.showLivePreviewDialog();
  }
};
</script>

<style scoped>
.living-card-wrapper {
  margin-top: 20px;
}
.image {
  width: 100%;
  height: 320px;
  display: block;
  cursor: pointer;
}
.is-hover-shadow:hover {
  box-shadow: 1px 1px 20px #67c23a;
}
.live-home-name {
  font-size: large;
  display: inline-block;
  padding: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 7em;
  overflow: hidden;
}
.anchor-name {
  color: grey;
}
.open-time {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-size: smaller;
  color: grey;
}
.living-status {
  margin: 10px;
  float: right;
}
.private-living {
  margin: 10px;
  float: right;
}
</style>
