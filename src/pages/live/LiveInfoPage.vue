<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="liveId">
        <el-input v-model.trim="queryModel.liveId" placeholder="直播ID"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="主播用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="主播昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="主播用户名"></el-input>
      </el-form-item>
      <el-form-item prop="isLive">
        <el-select v-model="queryModel.isLive" placeholder="直播状态" clearable>
          <el-option :value="0" label="正在直播"></el-option>
          <el-option :value="1" label="已关播"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="valid">
        <el-select v-model="queryModel.valid" placeholder="时长是否有效" clearable>
          <el-option :value="0" label="时长无效"></el-option>
          <el-option :value="1" label="时长有效"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="openTime">
        <el-date-picker v-model="queryModel.openTime" type="datetimerange" range-separator="至" start-placeholder="开播时间" end-placeholder="开播时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
      <el-table-column prop="liveId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="liveImg" label="直播间封面">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.liveImg" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="主播用户ID"></el-table-column>
      <el-table-column prop="nickname" label="主播昵称"></el-table-column>
      <el-table-column prop="username" label="主播用户名"></el-table-column>
      <el-table-column prop="infoName" label="直播名称"></el-table-column>
      <el-table-column prop="startTime" label="开播时间" sortable="custom"></el-table-column>
      <el-table-column prop="endTime" label="关播时间"></el-table-column>
      <el-table-column prop="durationInMinutes" label="直播时长(分钟)" sortable="custom" width="150"></el-table-column>
      <el-table-column prop="onlineNum" label="在线人数" sortable="custom"></el-table-column>
      <el-table-column prop="likeNum" label="点赞数量" sortable="custom"></el-table-column>
      <el-table-column prop="giftNum" label="礼物数量" sortable="custom"></el-table-column>
      <el-table-column prop="imId" label="IM ID"></el-table-column>
      <el-table-column prop="streamId" label="流地址"></el-table-column>
      <el-table-column prop="isLive" label="状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.isLive === 0 ? 'success' : 'info'" :icon="scope.row.isLive === 0 ? 'fa fa-play' : 'fa fa-clock-o'">
            {{ scope.row.isLive === 0 ? '直播中' : '已关播'}}
          </icon-tag>
          <icon-tag v-if="scope.row.isLive === 1" :type="scope.row.valid ? 'success' :'danger'" :icon="'fa fa-clock'">{{ scope.row.valid ? '时长有效' : '时长无效'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="更多信息" placement="top" v-if="hasPermission('live:info:list')">
              <el-button type="info" size="mini" @click="openDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <!-- 已关播且录播文件地址不为空, 可查看录播视频 -->
            <el-tooltip class="item" effect="dark" content="播放录播视频" placement="top" v-if="hasPermission('live:info:list') && scope.row.isLive === 1 && scope.row.fileUrl && scope.row.fileUrl !== ''">
              <el-button type="info" size="mini" @click="showLiveTapePlayDialog(scope.row)">
                <i class="fa fa-play"></i>
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
    <!-- 查看直播更多详情 -->
    <el-dialog :visible.sync="dialog.detail.show" :title="`[${dialog.detail.username}] -- [${dialog.detail.infoName}], 直播详情: `" width="800px">
      <div v-loading="dialog.detail.loading">
        <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
          <el-form-item label="RTMP URL地址">
            <span class="detail-span" v-text="dialog.detail.model.rtmpUrl"></span>
          </el-form-item>
          <el-form-item label="HLS URL地址">
            <span class="detail-span" v-text="dialog.detail.model.hlsUrl"></span>
          </el-form-item>
          <el-form-item label="FLV URL地址">
            <span class="detail-span" v-text="dialog.detail.model.flvUrl"></span>
          </el-form-item>
          <el-form-item label="录播URL地址">
            <span class="detail-span" v-text="dialog.detail.model.fileUrl"></span>
          </el-form-item>
          <el-form-item label="国家">
            <span class="detail-span" v-text="dialog.detail.model.countryName"></span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialog.detail.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`[${dialog.picPreview.username}] -- [${dialog.picPreview.infoName}], 直播封面: `">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <live-tape-play-dialog ref="liveTapePlayDialog"></live-tape-play-dialog>
  </div>
</template>

<script>
import { getLiveInfoList } from '../../api/live/live-info';
import LiveTapePlayDialog from './dialogs/LiveTapePlayDialog';

export default {
  name: 'live-info-page',

  components: {
    'live-tape-play-dialog': LiveTapePlayDialog
  },

  data() {
    return {
      dialog: {
        picPreview: {
          usename: null,
          infoName: null,
          show: false,
          picSrc: null
        },
        detail: {
          username: null,
          infoName: null,
          model: {
            rtmpUrl: null,
            hlsUrl: null,
            flvUrl: null,
            fileUrl: null,
            countryName: null
          },
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        valid: null,
        liveId: null,
        userId: null,
        nickname: null,
        username: null,
        homeNo: null,
        isLive: null,
        openTime: null
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
    showLiveTapePlayDialog(row) {
      this.$refs.liveTapePlayDialog.showDialog(row);
    },

    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.liveImg;
      this.dialog.picPreview.username = row.username;
      this.dialog.picPreview.infoName = row.infoName;
      this.dialog.picPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    openDetailDialog(row) {
      this.dialog.detail.username = row.username;
      this.dialog.detail.infoName = row.infoName;
      this.dialog.detail.model = row;
      this.dialog.detail.show = true;
      this.dialog.detail.formLoading = true;
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
      // 显示表格loading
      this.loading.table = true;
      getLiveInfoList({
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

<style scoped>
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
</style>
