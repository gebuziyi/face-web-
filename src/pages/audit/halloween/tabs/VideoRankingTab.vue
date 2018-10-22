<template>
    <div class="tab-wrapper">
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="userId">
          <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div class="btn-wrapper">
        <el-button @click="onQueryBtnClick" type="primary" size="small">
          <i class="fa fa-search"></i>
          <span>搜索</span>
        </el-button>
        <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
        <el-table-column prop="videoId" label="视频ID" sortable="custom"></el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="username" label="用户昵称" width="100"></el-table-column>
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
        <el-table-column prop="mname" label="音乐" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" size="mini" v-if="scope.row.mname === null || scope.row.mname === ''">原声</el-tag>
            <span v-else>{{ scope.row.mname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tname" label="视频类型">
          <template slot-scope="scope">
            <span v-if="scope.row.tname !== null">{{ scope.row.tname }}</span>
            <el-tag v-else type="info" size="mini">未指定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="country" label="国家" ></el-table-column>
        <el-table-column prop="heatNum" label="热度值" sortable="custom" >
          <template slot-scope="scope">
            <span>{{ scope.row.heatNum }}</span>
            <i class="pd-left-5 fa fa-fire"></i>
          </template>
        </el-table-column>
        <el-table-column prop="collectionNum" label="点赞数" sortable="custom" >
          <template slot-scope="scope">
            <el-button type="button" size="small" disabled>
              <span>{{ scope.row.collectionNum }}</span>
              <i class="pd-left-5 fa fa-heart color-red"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="commentNum" label="评论数" sortable="custom" >
          <template slot-scope="scope">
            <el-button size="small" disabled>
              <span>{{ scope.row.commentNum }}</span>
              <i class="pd-left-5 fa fa-comments "></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="shareNum" label="分享数" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.shareNum }}</span>
            <i class="pd-left-5 fa fa-share"></i>
          </template>
        </el-table-column>
        <el-table-column prop="playNum" label="播放量" sortable="custom">
          <template slot-scope="scope">
            <span>{{ scope.row.playNum }}</span>
            <i class="el-icon-view"></i>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上传时间" sortable="custom"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="收礼记录" placement="top">
                  <el-button type="primary" size="mini" @click="openSendGiftLogDialog(scope.row)">
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
    <!-- 弹窗 -->
      <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
      <send-gift-log-dialog ref="sendGiftLogDialog"  @done="getTableData()"></send-gift-log-dialog>
    </div>
</template>

<script>
import { getVideoRankingList } from '../../../../api/audit/helloween';
import VideoGiftSendLogDialog from '../../../video/dialogs/VideoGiftSendLogDialog';
export default {
  name: 'halloween-video-audit',

  components: {
    'send-gift-log-dialog': VideoGiftSendLogDialog
  },

  data() {
    return {
      tableData: [],
      queryModel: {
        userId: null
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
      loading: {
        select: {
          topic: false
        }
      },
      model: {
        id: null,
        text: null
      },
      btnLoading: false
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
    openSendGiftLogDialog(row) {
      this.$refs.sendGiftLogDialog.showDialog(row);
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
        poster: row.url
      };
      this.$refs.videoPreviewDialog.showDialog(options);
    },
    getTableData() {
      this.loading.table = true;
      getVideoRankingList({
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
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
.tab-wrapper {
  margin-top: 10px;
}
.el-table .hot-video-row {
  background: #ffebeb;
}
.cursor-pointer {
  cursor: pointer;
}
.color-red {
  color: red;
}
.color-blue {
  color: blue;
}
</style>
