<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="anchorUserId">
        <el-input v-model.trim="queryModel.anchorUserId" placeholder="主播ID"></el-input>
      </el-form-item>
      <el-form-item prop="giftIds">
        <el-select v-model="queryModel.giftIds" clearable multiple placeholder="礼品信息">
          <template v-for="(item, index) in giftInfoList">
            <el-option :label="item.giftName" :value="item.giftId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="赠送时间" end-placeholder="赠送时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-table-column prop="sendId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="giftName" label="礼品名称"></el-table-column>
      <el-table-column prop="giftImg" label="礼品图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.giftImg" class="gift-img-thumb">
        </template>
      </el-table-column>
      <el-table-column prop="price" label="礼品单价" sortable="custom"></el-table-column>
      <el-table-column prop="numbers" label="礼品数量" sortable="custom" width="120"></el-table-column>
      <el-table-column prop="infoName" label="直播标题"></el-table-column>
      <el-table-column prop="anchorUserId" label="主播ID" width="100"></el-table-column>
      <el-table-column prop="anchorNickname" label="主播昵称"></el-table-column>
      <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`礼品图片预览: ${dialog.picPreview.giftName}`">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
import { getLiveGiftSendList } from '../../api/live/live-gift-send';
import { getAllGiftInfo } from '../../api/gift/gift-info';

export default {
  name: 'live-gift-send-page',
  data() {
    return {
      giftInfoList: [],
      dialog: {
        picPreview: {
          giftName: '',
          show: false,
          picSrc: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        giftIds: null,
        createTime: null,
        anchorUserId: null
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
      this.dialog.picPreview.picSrc = row.giftImg;
      this.dialog.picPreview.giftName = row.giftName;
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
      getLiveGiftSendList({
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
    initGiftInfoSelectData() {
      getAllGiftInfo()
        .then(({ data }) => {
          this.giftInfoList = data.list;
        })
        .catch(error => {})
    }
  },
  created() {
    this.initGiftInfoSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.gift-img-thumb {
  width: 60px;
  height: 60px;
  cursor: pointer;
}
.img-preview {
  display: block;
  margin: auto auto;
  width: 50%;
  overflow: hidden;
  max-width: 600px;
  max-height: 600px;
}
</style>
