<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="operation">
        <el-input v-model.trim="queryModel.operation" placeholder="用户操作"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="platform">
        <el-input v-model.trim="queryModel.platform" placeholder="设备平台"></el-input>
      </el-form-item> -->
       <el-form-item prop="platform">
        <el-select v-model="queryModel.platform" clearable placeholder="设备平台">
          <el-option value="android" label="android"></el-option>
          <el-option value="ios" label="ios"></el-option>
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
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="id" label="ID" sortable="custom" width="150"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="operation" label="用户操作"></el-table-column>
      <el-table-column prop="params" label="参数" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="time" label="执行时长(ms)"></el-table-column>
      <el-table-column prop="platform" label="设备平台"></el-table-column>
      <el-table-column prop="device" label="设备型号"></el-table-column>
      <el-table-column prop="platformVersion" label="系统版本号"></el-table-column>
      <el-table-column prop="appVersion" label="软件版本号"></el-table-column>
      <el-table-column prop="ip" label="客户端ip"></el-table-column>
      <el-table-column prop="createDate" label="执行时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getSysLogList
} from '../../api/sys/sys-log';

export default {
  name: 'sys-log-page',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        operation: null,
        platform: null
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
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    getTableData() {
      this.loading.table = true;
      getSysLogList({
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
