<template>
  <div>
    <h3 tyle="padding: 10px"> 数据显示</h3>
    <div class="give-change">
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            新增视频总数量: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.newIncreaseVideoNum ? datas.newIncreaseVideoNum : 0 }}
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与活动的人数[所有点赞||指定话题下的视频]:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.partakeActivityNum ? datas.partakeActivityNum : 0 }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与活动的视频数量: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.partakeActivityVideoNum ? datas.partakeActivityVideoNum : 0 }}
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参赛视频总点赞数量:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.partakeVideoLikeNum ? datas.partakeVideoLikeNum : 0 }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参赛视频总评论数量: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.partakeVideoCommentNum ? datas.partakeVideoCommentNum : 0 }}
          </div>
        </el-col>
      </el-row>
    </div>
    <br />
    <div style="width: 100%;">
        <br />
    <h3 tyle="padding: 10px"> 每日新增视频数量</h3>
    <el-row class="line-chart-row">
      <el-col :span="24">
        <thanksgiving-register-count></thanksgiving-register-count>
      </el-col>
    </el-row>
  </div>
    <div><br>
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="userId">
          <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item prop="nickName">
          <el-input v-model.trim="queryModel.nickName" placeholder="用户昵称"></el-input>
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
         <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
            <el-table-column prop="videoId" label="视频ID" sortable="custom" width="120"></el-table-column>
            <el-table-column prop="userId" label="用户ID"></el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="img" label="视频" width="100">
                <template slot-scope="scope">
                <el-tooltip effect="dark" content="点击播放视频" placement="top">
                    <img :src="scope.row.img" class="img-thumb" @click="showVideoPreviewDialog(scope.row)">
                </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="tname" label="视频类型"></el-table-column>
            <el-table-column prop="country" label="国家"></el-table-column>
            <el-table-column prop="collectionNum" label="点赞数" sortable="custom" width="120"></el-table-column>
            <el-table-column prop="commentNum" label="评论数" sortable="custom" width="120"></el-table-column>
            <el-table-column prop="shareNum" label="分享数" sortable="custom" width="120"></el-table-column>
            <el-table-column prop="playNum" label="播放量" sortable="custom" width="120"></el-table-column>
            <el-table-column prop="createTime" label="上传时间"></el-table-column>
            <el-table-column prop="statues" label="状态">
             <template slot-scope="scope">
                    <icon-tag type="danger"  v-if="scope.row.statues === 0">已删除</icon-tag>
                    <icon-tag type="success" v-if="scope.row.statues === 1">正常</icon-tag>
                    <icon-tag type="warning" v-if="scope.row.statues === 2">冻结</icon-tag>
              </template>
              </el-table-column>
            <el-table-column prop="ranking" label="排名"></el-table-column>
          </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
      </el-pagination>
      <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
      <el-dialog :visible.sync="dialog.picPreview.show">
        <img :src="dialog.picPreview.picSrc" class="img-preview" />
      </el-dialog>
      <!-- <avatar-accessory ref="avatarAccessory" @done="getTableData"></avatar-accessory> -->
    </div>
  </div>
</template>
<script>
import { getVideoDatasThanksgivingDays, getThanksgivingVideoTableData } from '../../../../api/audit/thanksgiving-video-audit';
import ThanksgivingDaysVideoDailyLine from './charts/ThanksgivingDaysVideoDailyLine';

export default {
  name: 'thanksgiving-live-audit',
  components: {
    'thanksgiving-register-count': ThanksgivingDaysVideoDailyLine
  },
  data() {
    return {
      // 默认活动发布页
      tableData: [],
      registerCount: null,
      datas: {
        newIncreaseVideoNum: null,
        partakeActivityNum: null,
        partakeActivityVideoNum: null,
        partakeVideoLikeNum: null,
        partakeVideoCommentNum: null
      },
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      activeTabName: 'account',
      loading: {
        table: true
      },
      queryModel: {
        userId: null,
        nickName: null,
        vest: 0,
        role: 'account'
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      }
    };
  },
  methods: {
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.show = true;
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onTabClick(tab) {
      this.pager.page = 1;
      this.queryModel.role = tab.name;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
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
      getThanksgivingVideoTableData({
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
    getDataAudit() {
      getVideoDatasThanksgivingDays().then(({ data }) => {
        this.datas.newIncreaseVideoNum = data.detail.newIncreaseVideoNum;
        this.datas.partakeActivityNum = data.detail.partakeActivityNum;
        this.datas.partakeActivityVideoNum = data.detail.partakeActivityVideoNum;
        this.datas.partakeVideoLikeNum = data.detail.partakeVideoLikeNum;
        this.datas.partakeVideoCommentNum = data.detail.partakeVideoCommentNum;
      });
    }
  },
  created() {
    this.getDataAudit();
    this.getTableData();
  }
};
</script>

<style>
.give-change {
  border: 1px solid #dddddddd;
  height: 150px;
}
.count-down-row {
  margin-top: 10px;
  height: 120px;
}
.countdown-col {
  height: 120px;
}
.line-chart-row {
  margin-top: 20px;
  height: 400px;
  width: 100%;
}
.order-user-table-row {
  margin-top: 20px;
  height: 600px;
  width: 100%;
}
.latest-10-order-col {
  width: 600px;
}
/* .latest-10-reg-user-col {
} */
.table-desc {
  font-size: 20px;
  color: grey;
  width: 600px;
}
.most-like-top10-videos-row {
  margin-top: 20px;
  height: 300px;
  background-color: darkturquoise;
}
.most-popular-top10-live-row {
  margin-top: 20px;
  height: 400px;
  background-color: teal;
}
</style>
