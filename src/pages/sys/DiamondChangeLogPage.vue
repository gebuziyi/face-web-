<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="adminId">
        <el-select v-model="queryModel.adminId" placeholder="管理员" clearable filterable>
          <el-option v-for="(item, index) in sysList" :key="index" :value="item.userId" :label="item.username"></el-option>
        </el-select>
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
      <el-table-column prop="logId" label="日志ID" sortable="custom" width="100"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="newDiamondAmount" label="修改的钻石数量"></el-table-column>
      <el-table-column prop="memo" label="备注信息"></el-table-column>
      <el-table-column prop="userName" label="管理员"></el-table-column>
      <el-table-column prop="createTime" label="修改时间" ></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->

  </div>
</template>

<script>
import { getdiamondChangeLogList } from '../../api/sys/diamond-change-log';
import { getAllSysUser } from '../../api/sys/sys-user';
export default {
  name: 'music-log-page',

  data() {
    return {
      selectedIds: [],
      sysList: [],
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
        adminId: null
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
    initGetALLSysSelectData() {
      getAllSysUser()
        .then(({ data }) => {
          this.sysList = data.list;
        })
        .catch(errorMsg => {});
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.imgFileList = [];
      getdiamondChangeLogList({
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
    this.initGetALLSysSelectData();
  }
};
</script>

<style scoped>
</style>
