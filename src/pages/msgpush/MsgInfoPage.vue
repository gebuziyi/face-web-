<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="选择推送类型" filterable>
          <el-option v-for="(item, index) in msgPushTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userNickName">
        <el-input v-model.trim="queryModel.userNickName" placeholder="发送人昵称"></el-input>
      </el-form-item>
      <el-form-item prop="accountNickName">
        <el-input v-model.trim="queryModel.accountNickName" placeholder="接收人昵称"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
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
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="pushId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="typeName" label="类型名称"></el-table-column>
      <el-table-column prop="content" label="推送内容" show-overflow-tooltip width="600"></el-table-column>
      <el-table-column prop="userNickName" label="发送人">
        <template slot-scope="scope">
          <span v-if="scope.row.userId !== 0">{{ scope.row.userNickName }}</span>
          <span v-else>系统通知</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountNickName" label="接收人"></el-table-column>
      <el-table-column prop="createTime" label="执行时间" sortable="custom"></el-table-column>
      <el-table-column prop="infoId" label="Info ID" width="90"></el-table-column>
      <el-table-column prop="img" label="发送人头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="img-thumb">
        </template>
      </el-table-column>
      <el-table-column prop="videoImg" label="视频信息" width="80">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击播放视频" placement="top" v-if="scope.row.videoImg !== null && scope.row.videoImg.trim() !== ''">
            <img :src="scope.row.videoImg" class="img-thumb" @click="showVideoPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <video-preview-dialog ref="videoPreviewDialog"></video-preview-dialog>
  </div>
</template>

<script>
import { getMsgLogList } from '../../api/msgpush/msg-info';
import { getAllMsgPushType } from '../../api/msgpush/msgpush-type';
export default {
  name: 'msg-log-page',
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          mname: null
        }
      },
      loading: {
        table: true
      },
      msgPushTypes: [],
      tableData: [],
      queryModel: {
        username: null,
        operation: null
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
    showVideoPreviewDialog(row) {
      let options = {
        sources: [
          {
            type: 'video/mp4',
            // mp4
            src: row.url
          }
        ],
        poster: row.videoImg
      };
      this.$refs.videoPreviewDialog.showDialog(options);
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.mname = row.mname;
      this.dialog.picPreview.show = true;
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
      getMsgLogList({
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
    initMsgPushInfoSelectData() {
      getAllMsgPushType()
        .then(({ data }) => {
          this.msgPushTypes = data.list;
        })
        .catch(error => {});
    }
  },
  created() {
    this.initMsgPushInfoSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
