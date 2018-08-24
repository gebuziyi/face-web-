<template>
  <div id="job-log-tab">
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="jobId">
        <el-input v-model.trim="queryModel.jobId" placeholder="任务ID"></el-input>
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
      <el-table-column prop="logId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="jobId" label="任务ID"></el-table-column>
      <el-table-column prop="beanName" label="bean名称"></el-table-column>
      <el-table-column prop="methodName" label="方法名称"></el-table-column>
      <el-table-column prop="params" label="方法参数"></el-table-column>
      <el-table-column prop="status" label="执行状态">
        <template slot-scope="scope">
          <!-- 这里0代表成功, 1代表失败 !!!-->
          <icon-tag :type="scope.row.status === 0 ? 'success' : 'danger'">{{ scope.row.status === 0 ? '执行成功' : '执行失败' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eror" label="错误信息"></el-table-column>
      <el-table-column prop="times" label="耗时(ms)" sortable="custom"></el-table-column>
      <el-table-column prop="createTime" label="执行时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { getScheduledLogList } from '../../api/sys/sys-scheduled-job'

export default {
  name: 'job-log-tab',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        jobId: null,
        username: null,
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
      this.loading.table = true;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getScheduledLogList({
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
