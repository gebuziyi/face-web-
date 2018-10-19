<template>
  <el-dialog :visible.sync="show" :title="`#${theTopic.tname} - 视频列表`" width="1200px" :close-on-click-modal="false" :append-to-body="true">
    <h4>示例视频</h4>
    <el-table :data="officialVideos" border style="width: 100%" v-loading="loading.table.officialVideo" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="videoId" label="视频ID"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="userNickname" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="视频">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top">
            <img :src="scope.row.videoImg" class="img-thumb" @click="showOfficialVideoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="cancelOfficialVideo(scope.row)">取消示例</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h4>所有公开且状态正常的视频</h4>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="videoId">
        <el-input v-model.trim="queryModel.videoId" placeholder="视频ID"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 查询表单 end-->
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="resetQueryForm">重置</el-button>
    </div>
    <el-table :data="allVideos" border style="width: 100%" v-loading="loading.table.allVideo" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :row-class-name="toggleRowClassName">
      <el-table-column prop="videoId" label="视频ID"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="视频">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showVideoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showMakeOfficialVideoConfirm(scope.row)" v-if="canMakeOfficial(scope.row)">设为示例</el-button>
          <el-tag size="mini" v-else>示例视频</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
  </el-dialog>
</template>

<script>
import { getVideoInfoList } from '../../../api/video/video-info';
import {
  getOfficialVideoList,
  makeOfficialVideo,
  cancelOfficialVideo
} from '../../../api/video/video-topic';
import {
  VIDEO_PRIVACY_STATUS_LIST,
  VIDEO_STATUS_LIST
} from '../../../utils/constants';

export default {
  name: 'video-topic-video-dialog',

  data() {
    return {
      theTopic: {
        tname: '',
        topicId: null
      },
      show: false,
      queryModel: {
        topicId: null,
        userId: null,
        videoId: null,
        statues: 1,
        isPrivate: 1
      },
      loading: {
        table: {
          allVideo: true,
          officialVideo: true
        }
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      },
      allVideos: [],
      officialVideos: [],
      videoStatusList: VIDEO_STATUS_LIST,
      videoPrivacyStatusList: VIDEO_PRIVACY_STATUS_LIST
    };
  },

  methods: {
    resetQueryForm() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
      }
    },

    onQueryBtnClick() {
      this.pager.page = 1;
      this.getAllVideosInTopic();
    },

    canMakeOfficial(row) {
      // 如果视频ID已经在官方视频列表中, 则[设为示例]按钮不显示
      return (
        this.officialVideos.map(item => item.videoId).indexOf(row.videoId) ===
        -1
      );
    },
    showDialog(row) {
      this.theTopic.tname = row.tname;
      this.theTopic.topicId = row.topicId;
      this.queryModel.topicId = row.topicId;
      this.getAllOfficialVideosInTopic();
      this.getAllVideosInTopic();
      this.show = true;
    },

    getAllVideosInTopic() {
      this.loading.table.allVideo = true;
      getVideoInfoList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.allVideos = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table.allVideo = false;
        })
        .catch(error => {});
    },

    getAllOfficialVideosInTopic() {
      this.loading.table.officialVideo = true;
      getOfficialVideoList(this.queryModel.topicId)
        .then(({ data }) => {
          this.officialVideos = data.list;
          this.loading.table.officialVideo = false;
        })
        .catch(error => {});
    },

    showVideoPreviewDialog(row) {
      let options = {
        sources: [
          {
            type: 'video/mp4',
            src: row.url
          }
        ],
        poster: row.img
      };
      this.$refs.videoPreviewDialog.showDialog(options);
    },

    showOfficialVideoPreviewDialog(row) {
      let options = {
        sources: [
          {
            type: 'video/mp4',
            src: row.videoUrl
          }
        ],
        poster: row.videoImg
      };
      console.log(row);
      console.log(options);
      this.$refs.videoPreviewDialog.showDialog(options);
    },

    toggleRowClassName({ row, rowIndex }) {
      if (row.hot === true) {
        return 'hot-video-row';
      } else {
        return '';
      }
    },

    showMakeOfficialVideoConfirm(row) {
      this.$confirm(
        `确定将用户 ${row.nickname} 在 ${
          row.createTime
        } 上传的视频设置为话题 #${this.theTopic.tname} 的官方示例视频?`,
        '设置官方示例视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let msg = {
            videoId: row.videoId,
            videoTopicId: this.theTopic.topicId
          };
          makeOfficialVideo(msg)
            .then(resp => {
              this.$message.success('操作成功');
              this.getAllOfficialVideosInTopic();
            })
            .catch(error => {
              this.$message.error('操作失败');
            });
        })
        .catch(() => {});
    },

    cancelOfficialVideo(row) {
      this.$confirm(
        `确定将视频 ${row.videoId} 从话题 #${
          this.theTopic.tname
        } 的示例视频中取消?`,
        '取消官方示例视频',
        {
          type: 'warning'
        }
      )
        .then(() => {
          cancelOfficialVideo(row.id)
            .then(resp => {
              this.$message.success('操作成功');
              this.getAllOfficialVideosInTopic();
            })
            .catch(error => {
              this.$message.error('操作失败');
            });
        })
        .catch(() => {});
    },

    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table.allVideo = true;
      this.getAllVideosInTopic();
    },

    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table.allVideo = true;
      this.getAllVideosInTopic();
    },

    status2Description(status) {
      if (this.videoStatusList) {
        return this.videoStatusList.find(item => item.status === status)
          .description;
      }
      return '未知状态';
    },

    privacyStatus2Description(privacyStatus) {
      if (
        this.videoPrivacyStatusList &&
        this.videoPrivacyStatusList.length > 0
      ) {
        return this.videoPrivacyStatusList.find(
          item => item.status === privacyStatus
        ).description;
      }
      return '未知隐私状态';
    }
  }
};
</script>

<style scoped>
h4 {
  padding-top: 1em;
  padding-bottom: 2em;
}
</style>
