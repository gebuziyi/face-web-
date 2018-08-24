<template>
  <el-dialog :visible.sync="show" :title="`冻结用户: ${model.nickname}`" width="50%" :close-on-click-modal="false" :close="resetForm">
    <h4>用户冻结记录</h4>
    <el-table :data="tableData" border='100%' style="width: 100%" v-loading="loading.table" element-loading-text="正在加载用户冻结记录" element-loading-spinner="el-icon-loading">
      <el-table-column prop="logId" label="记录ID"></el-table-column>
      <el-table-column prop="typeName" label="冻结类型"></el-table-column>
      <el-table-column prop="createTime" label="冻结时间"></el-table-column>
      <el-table-column prop="unfreezeTime" label="解冻时间"></el-table-column>
      <el-table-column prop="adminName" label="操作人"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {
  getAllFreezeType
} from '../../../api/user/user-freeze-type';
import { getFreezeLogListByUserId } from '../../../api/user/user-freeze-log';

export default {
  name: 'user-freeze-dialog',
  data() {
    return {
      btnLoading: false,
      types: [],
      tableData: [],
      query: {
        userId: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      show: false,
      loading: {
        table: false,
        form: false
      },
      model: {
        userId: null,
        nickname: null,
        hours: null,
        typeId: null
      }
    };
  },
  methods: {
    onSizeChange(size) {
      this.pager.limit = size;
      this.getUserFreezeLog();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.getUserFreezeLog();
    },
    showDialog(row) {
      this.loading.table = true;
      this.loading.form = true;
      this.btnLoading = false;
      this.query.userId = row.userId;
      this.model.userId = row.userId;
      this.model.nickname = row.nickName;
      this.model.typeId = null;
      this.model.hours = null;

      this.show = true;

      this.initFreezeType();
      this.getUserFreezeLog();
    },
    initFreezeType() {
      getAllFreezeType()
        .then(({ data }) => {
          this.types = data.list;
          this.loading.form = false;
        })
        .catch(err => {});
    },
    getUserFreezeLog() {
      getFreezeLogListByUserId(this.model.userId)
        .then(({ data }) => {
          this.tableData = data.list;
          this.loading.table = false;
        })
        .catch(err => {});
    },
    resetForm() {
      this.$refs.createForm.resetFields();
      this.btnLoading = false;
    }
  }
};
</script>
