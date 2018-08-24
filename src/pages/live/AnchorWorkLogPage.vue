<template>
  <div>
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="主播昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="主播用户名"></el-input>
      </el-form-item>
      <el-form-item prop="done">
        <el-select v-model="queryModel.done" placeholder="是否完成当天任务" clearable>
          <el-option :value="0" label="未完成"></el-option>
          <el-option :value="1" label="完成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="workDate">
        <el-date-picker v-model="queryModel.workDate" type="datetimerange" range-separator="至" start-placeholder="开播时间" end-placeholder="开播时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="resetSearchForm">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="logId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="workDate" label="日期"></el-table-column>
      <el-table-column prop="totalDuration" label="直播总时长(分钟)"></el-table-column>
      <el-table-column prop="targetDuration" label="目标时长(分钟)"></el-table-column>
      <el-table-column prop="done" label="完成情况">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.done ? 'success' : 'danger'">{{ scope.row.done ? '已完成' : '未完成'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="直播记录" placement="top" v-if="hasPermission('live:info:list')">
              <el-button type="info" size="mini" @click="openLiveInfoDialog(scope.row)">
                <i class="fa fa-file-text-o"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[31]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <infos-dialog ref="infosDialog"></infos-dialog>
  </div>
</template>

<script>
import { getWorkLogList } from '../../api/live/work-log';
import LiveInfoLogDialog from './dialogs/LiveInfoLogDialog';

export default {
  name: 'work-log-page',

  components: {
    'infos-dialog': LiveInfoLogDialog
  },

  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        username: null,
        nickname: null,
        done: null,
        workDate: null
      },
      pager: {
        page: 1,
        limit: 31,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      }
    };
  },
  methods: {
    resetSearchForm() {
      this.$refs.queryForm.resetFields();
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    openLiveInfoDialog(row) {
      this.$refs.infosDialog.showDialog(row);
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
      getWorkLogList({
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
