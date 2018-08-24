<template>
  <div>
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
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :row-class-name="toggleRowClassName">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="videoId" label="视频ID" sortable="custom" width="90"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="100"></el-table-column>
      <el-table-column prop="img" label="视频" width="100">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top">
            <img :src="scope.row.img" class="img-thumb" @click="showVideoPreviewDialog(scope.row)">
          </el-tooltip>
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
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="点赞记录" placement="top" v-if="hasPermission('video:info:list') && hasPermission('video:like-log:list')">
              <el-button type="primary" size="mini" @click="showLikeLog(scope.row)" :disabled="scope.row.collectionNum === 0">
                <i class="fa fa-list-alt"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
    <like-log-dialog ref="logDialog"></like-log-dialog>
  </div>
</template>

<script>
import { getVideoInfoList } from '../../api/video/video-info';
import VideoLikeLogDialog from './dialogs/VideoLikeLogDialog';

export default {
  name: 'video-like-log-page',
  components: {
    'like-log-dialog': VideoLikeLogDialog
  },
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        videoId: null,
        userId: null,
        nickname: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: 'collectionNum',
        order: 'descending'
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
    toggleRowClassName({ row, rowIndex }) {
      if (row.hot === true) {
        return 'hot-video-row';
      } else {
        return '';
      }
    },

    showLikeLog(row) {
      this.$refs.logDialog.showDialog(row);
    },

    showVideoPreviewDialog(row) {
      let options = {
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: row.url
          }
        ],
        poster: row.img
      };
      this.$refs.videoPreviewDialog.showDialog(options);
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    getTableData() {
      this.loading.table = true;
      getVideoInfoList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>
.color-red {
  color: red;
}
.el-table .hot-video-row {
  background: #ffebeb;
}
</style>
