<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="id">
        <el-input v-model.trim="queryModel.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="shareSource">
        <el-select v-model="queryModel.shareSource" clearable placeholder="分享来源">
          <el-option :value="0" label="短视频"></el-option>
          <el-option :value="1" label="直播"></el-option>
          <el-option :value="2" label="活动页面"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="platform">
        <el-select v-model="queryModel.platform" clearable placeholder="分享目标平台">
          <el-option :value="0" label="Twitter"></el-option>
          <el-option :value="1" label="Facebook"></el-option>
          <el-option :value="2" label="微信"></el-option>
          <el-option :value="3" label="朋友圈"></el-option>
          <el-option :value="4" label="Instagram"></el-option>
          <el-option :value="5" label="Snapchat"></el-option>
          <el-option :value="6" label="Youtube"></el-option>
          <el-option :value="7" label="微博"></el-option>
          <el-option :value="8" label="QQ"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="videoId">
        <el-input v-model.trim="queryModel.videoId" placeholder="被分享的视频ID"></el-input>
      </el-form-item>
      <el-form-item prop="liveId">
        <el-input v-model.trim="queryModel.liveId" placeholder="被分享的直播ID"></el-input>
      </el-form-item>
      <el-form-item prop="activityId">
        <el-input v-model.trim="queryModel.activityId" placeholder="被分享的活动ID"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始分享时间" end-placeholder="终止分享时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
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
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="shareSource" label="分享来源">
      <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.shareSource === 0">短视频</el-tag>
          <el-tag type="success" v-if="scope.row.shareSource === 1">直播</el-tag>
          <el-tag type="warning" v-if="scope.row.shareSource === 2">活动页面</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="分享目标平台">
          <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.platform === 0">Twitter</el-tag>
          <el-tag type="success" v-if="scope.row.platform === 1">Facebook</el-tag>
          <el-tag type="info"    v-if="scope.row.platform === 2">微信</el-tag>
          <el-tag type="warning" v-if="scope.row.platform === 3">朋友圈</el-tag>
          <el-tag type="danger"  v-if="scope.row.platform === 4">Instagram</el-tag>
          <el-tag type="warning" v-if="scope.row.platform === 5">Snapchat</el-tag>
          <el-tag type="danger"  v-if="scope.row.platform === 6">Youtube</el-tag>
          <el-tag type="success" v-if="scope.row.platform === 7">微博</el-tag>
          <el-tag type="warning" v-if="scope.row.platform === 8">QQ</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="videoId" label="被分享的视频ID"></el-table-column>
      <el-table-column prop="liveId" label="被分享的直播ID"></el-table-column>
      <el-table-column prop="activityId" label="被分享的活动ID"></el-table-column>
      <el-table-column prop="createTime" label="分享时间"></el-table-column>

      <!-- <el-table-column prop="liveId" label="解冻时间">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status === 0">永久冻结</el-tag>
          <span v-else>{{ scope.row.unfreezeTime }}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->

  </div>
</template>

<script>
import { getShareLogList } from '../../api/user/user-share-log';

export default {
  name: 'user-freeze-log',
  data() {
    return {
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          userId: null
        }
      },
      loading: {
        table: true
      },
      sysUser: [],
      userFreezeTypes: [],
      tableData: [],
      queryModel: {
        id: null,
        userId: null,
        shareSource: null,
        createTime: null,
        platform: null,
        videoId: null,
        liveId: null,
        activityId: null
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
    showSortDialog() {
      this.$refs.sortDialog.showDialog();
    },

    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.typeImg;
      this.dialog.picPreview.userId = row.userId;
      this.dialog.picPreview.show = true;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.typeId);
      }
    },
    openCreateDialog() {
      this.$refs.createDialog.showDialog();
    },
    openEditDialog(row) {
      this.$refs.editDialog.showDialog(row.typeId);
    },
    query() {
      this.loading.table = true;
      this.pager.page = 1;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.imgFileList = [];
      getShareLogList({
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
