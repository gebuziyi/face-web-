<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="title">
        <el-input v-model.trim="queryModel.title" placeholder="问答标题"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="支付人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="accountUsername">
        <el-input v-model.trim="queryModel.accountUsername" placeholder="接收人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="paid">
        <el-select v-model="queryModel.paid" clearable placeholder="支付状态">
          <el-option value="0" label="未支付"></el-option>
          <el-option value="1" label="已支付"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="priceStart">
        <el-input v-model="queryModel.priceStart" type="number" placeholder="悬赏金额(起)"></el-input>
      </el-form-item>
      <el-form-item prop="priceEnd">
        <el-input v-model="queryModel.priceEnd" type="number" placeholder="悬赏金额(止)"></el-input>
      </el-form-item>
      <!-- 创建时间区间 -->
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始支付时间" end-placeholder="终止支付时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 查询表单 end-->
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
      <el-table-column prop="infoId" label="问答ID"></el-table-column>
      <el-table-column prop="title" label="问答标题"></el-table-column>
      <el-table-column prop="price" label="悬赏金额" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
          <i class="pd-left-5 fa fa-money"></i>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="支付人用户名"></el-table-column>
      <el-table-column prop="accountUsername" label="接收人用户名"></el-table-column>
      <el-table-column prop="paid" label="支付状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.paid === true ? 'success' : 'danger'">{{ scope.row.status === 0 ? '已支付' : '未支付' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="支付时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { getQaPayLogList } from '../../api/qa/qa-pay-log';

export default {
  name: 'qa-pay-log-page',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        title: null,
        username: null,
        accountUsername: null,
        paid: null,
        priceStart: null,
        priceEnd: null,
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
      getQaPayLogList({
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
