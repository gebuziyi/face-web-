<template>
  <el-dialog :visible.sync="show" title="视频点赞记录" width="1200px" :close-on-click-modal="false">
    <p class="tip">视频信息:</p>
    <el-table :data="[ video ]" border style="width: 100%">
      <el-table-column prop="videoId" label="视频ID" sortable="custom" width="90"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
      <el-table-column prop="img" label="视频" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="video-cover">
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="视频简介" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.introduction | parseTextIntro }}
        </template>
      </el-table-column>
      <el-table-column prop="collectionNum" label="点赞数" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.collectionNum }}</span>
          <i class="pd-left-5 fa fa-heart color-red"></i>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" width="160"></el-table-column>
    </el-table>
    <p class="tip mg-top-1em">点赞记录:</p>
    <el-table :data="likeLogs" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="logId" label="ID" sortable="custom" width="120"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="createTime" label="点赞时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <span slot="footer">
      <el-button @click="show = false" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLikeLogByVideoId } from '../../../api/video/video-like-log';

export default {
  name: 'video-like-log-dialog',

  data() {
    return {
      show: false,
      video: null,
      likeLogs: [],
      loading: true,
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      queryModel: {
        videoId: null
      }
    };
  },

  filters: {
    parseTextIntro: function(introJsonStr) {
      let introArray = JSON.parse(introJsonStr);

      if (introArray && introArray.length > 0) {
        let textItem = introArray.filter(
          item => item.type === '1' || item.type === 1
        );
        if (textItem && textItem.length > 0) {
          return textItem[0].content;
        }
      }
      return '';
    }
  },

  methods: {
    onSizeChange(size) {
      this.pager.limit = size;
      this.getLikeLogList();
    },

    onCurrentPageChange(page) {
      this.pager.page = page;
      this.getLikeLogList();
    },

    showDialog(row) {
      this.video = row;
      this.queryModel.videoId = row.videoId;
      this.show = true;
      this.loading = true;
      this.getLikeLogList(row.videoId);
    },

    getLikeLogList() {
      getLikeLogByVideoId(this.queryModel, this.pager)
        .then(({ data }) => {
          this.likeLogs = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading = false;
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.mg-top-1em {
  margin-top: 1em;
}
.tip {
  font-size: larger;
  margin-bottom: 1em;
}
.video-cover {
  width: 60px;
  height: 60px;
}
.color-red {
  color: red;
}
</style>
