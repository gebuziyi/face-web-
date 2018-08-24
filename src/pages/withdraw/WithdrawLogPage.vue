<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="moneyStart">
        <el-input v-model="queryModel.moneyStart" placeholder="起始金额(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="moneyEnd">
        <el-input v-model="queryModel.moneyEnd" placeholder="终止金额(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryModel.status" placeholder="提现状态" clearable>
          <el-option v-for="(item, index) in withdrawStatusList" :key="index" :value="item.status" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="queryModel.payType" placeholder="收款类型" clearable>
          <el-option v-for="(item, index) in payTypeList" :key="index" :value="item.payTypeId" :label="item.payTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
      <el-table-column prop="withdrawId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="money" label="提现金额" sortable="custom"></el-table-column>
      <el-table-column prop="username" label="提现用户"></el-table-column>
      <el-table-column prop="payTypeName" label="收款类型"></el-table-column>
      <el-table-column prop="statusDescription" label="提现状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.statusDescription.indexOf('成功') !== -1 ? 'success' : 'danger'" size="mini">{{ scope.row.statusDescription }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提现时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getWithdrawLogList,
  getAllWithdrawStatus
} from '../../api/withdraw/withdraw-log';
import { getAllPayType } from '../../api/basic-data/pay-type';

export default {
  name: 'withdraw-log-page',
  data() {
    return {
      payTypeList: [],
      withdrawStatusList: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        moneyStart: null,
        moneyEnd: null,
        status: null,
        payType: null,
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
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    getTableData() {
      this.loading.table = true;
      getWithdrawLogList({
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
    initWithdrawStatusSelectData() {
      getAllWithdrawStatus()
        .then(({ data }) => {
          this.withdrawStatusList = data.list;
        })
        .catch(errorMsg => {});
    },
    initPayTypeSelectData() {
      getAllPayType()
        .then(({ data }) => {
          this.payTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initWithdrawStatusSelectData();
    this.initPayTypeSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
