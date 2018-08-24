<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="user_id">
        <el-input v-model.trim="queryModel.user_id" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nick_name">
        <el-input v-model.trim="queryModel.nick_name" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-select v-model="queryModel.userId" placeholder="管理员用户名" filterable>
          <el-option v-for="(item, index) in sysUser" :key="index" :label="item.username" :value="item.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="选择冻结类型" filterable>
          <el-option v-for="(item, index) in userFreezeTypes" :key="index" :label="item.name" :value="item.typeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始冻结时间" end-placeholder="终止冻结时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-table-column prop="logId" label="日志ID"></el-table-column>
      <el-table-column prop="userName" label="操作人"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="name" label="冻结类型"></el-table-column>
      <el-table-column prop="createTime" label="冻结时间"></el-table-column>
      <el-table-column prop="unfreezeTime" label="解冻时间">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status === 0">永久冻结</el-tag>
          <span v-else>{{ scope.row.unfreezeTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->

  </div>
</template>

<script>
import { getFreezelogList } from '../../api/user/user-freeze-log';
import { getAllFreezeType } from '../../api/user/user-freeze-type';
import { getAllSysUserList } from '../../api/sys/sys-user';
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
        user_id: null,
        name: null,
        nick_name: null,
        userId: null,
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
    initMsgPushInfoSelectData() {
      getAllFreezeType()
        .then(({ data }) => {
          this.userFreezeTypes = data.list;
        })
        .catch(error => {});
    },
    initMsgPushInfoSelectDatas() {
      getAllSysUserList()
        .then(({ data }) => {
          this.sysUser = data.list;
        })
        .catch(error => {});
    },

    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.imgFileList = [];
      getFreezelogList({
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
    this.initMsgPushInfoSelectData();
    this.initMsgPushInfoSelectDatas();
    this.getTableData();
  }
};
</script>
