<template>
  <el-dialog :visible.sync="show" :title="`#${theTopic.tname} - 视频列表`" width="1200px" :close-on-click-modal="false" :append-to-body="true">
    <h4>示例视频</h4>
    <el-table :data="officialVideos" border style="width: 100%" v-loading="loading.table.officialVideo" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="videoId" label="视频ID"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="视频">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showOfficialVideoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="cancelOfficialVideo(scope.row)">取消示例</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h4>所有视频</h4>
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
          <el-button size="mini" type="primary" @click="makeOfficialVideo(scope.row)">设为示例</el-button>
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
import { getOfficialVideoList } from '../../../api/video/video-topic';

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
        videoId: null
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
      officialVideos: []
    };
  },

  methods: {
    showDialog(row) {
      this.theTopic.tname = row.tname;
      this.theTopic.topicId = row.topicId;
      this.queryModel.topicId = row.topicId;
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
      this.loading.table.allVideo = true;
      getOfficialVideoList(this.queryModel.topicId)
        .then(({ data }) => {
          this.allVideos = data.page.list;
          this.pager.total = data.page.totalCount;
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
      this.$refs.videoPreviewDialog.showDialog(options);
    },

    toggleRowClassName({ row, rowIndex }) {
      if (row.hot === true) {
        return 'hot-video-row';
      } else {
        return '';
      }
    },

    makeOfficialVideo(row) {},

    cancelOfficialVideo(row) {},

    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table.allVideo = true;
      this.getAllVideosInTopic();
    },

    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table.allVideo = true;
      this.getAllVideosInTopic();
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
