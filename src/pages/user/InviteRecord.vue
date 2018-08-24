<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="邀请人id"></el-input>
      </el-form-item>
      <el-form-item prop="recordUser">
        <el-input v-model.trim="queryModel.recordUser" placeholder="被邀请人id"></el-input>
      </el-form-item>
      <el-form-item prop="token">
        <el-input v-model.trim="queryModel.token" placeholder="邀请人token"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="邀请时间" end-placeholder="邀请时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="recordId" label="主键ID"></el-table-column>
      <el-table-column prop="userId" label="邀请人id"></el-table-column>
      <el-table-column prop="recordUser" label="被邀请人id"></el-table-column>
      <el-table-column prop="invitationNickname" label="邀请人昵称"></el-table-column>
      <el-table-column prop="beinvitationNickname" label="被邀请人昵称"></el-table-column>
      <el-table-column prop="mobile" label="被邀请人电话"></el-table-column>
      <el-table-column prop="money" label="邀请用户获得钻石数量"></el-table-column>
      <el-table-column prop="createTime" label="邀请时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { getInviteRecord } from '../../api/user/invite-record';

export default {
  name: 'user-invite-record-page',

  data() {
    return {
      selectedIds: [],
      dialog: {
        picPreview: {
          show: false,
          picSrc: null,
          typeName: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        recordUser: null,
        token: null,
        createTime: null
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
      this.dialog.picPreview.typeName = row.typeName;
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
      this.imgFileList = [];
      getInviteRecord({
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
</style>
