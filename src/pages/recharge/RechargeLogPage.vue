<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="orderNo">
        <el-input v-model.trim="queryModel.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item prop="moneyStart">
        <el-input v-model="queryModel.moneyStart" placeholder="起始金额(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="moneyEnd">
        <el-input v-model="queryModel.moneyEnd" placeholder="终止金额(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryModel.status" placeholder="订单状态" clearable>
          <el-option v-for="(item, index) in orderStatusList" :key="index" :value="item.status" :label="item.description"></el-option>
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
      <el-table-column prop="logId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="orderNo" label="订单号"></el-table-column>
      <el-table-column prop="money" label="订单金额" sortable="custom"></el-table-column>
      <el-table-column prop="statusDescription" label="订单状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.statues === 1 ? 'success' : 'danger'" size="mini">{{ scope.row.statues === 1 ? '充值成功' : '充值失败' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { getRechargeLogList, getAllOrderStatus } from '../../api/recharge/recharge-log';

export default {
  name: 'recharge-log-page',
  data() {
    return {
      orderStatusList: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        orderNo: null,
        moneyStart: null,
        moneyEnd: null,
        status: null,
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
      getRechargeLogList({
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
    initOrderStatusSelectData() {
      getAllOrderStatus()
        .then(({ data }) => {
          this.orderStatusList = data.list
        })
        .catch(errorMsg => {})
    }
  },
  created() {
    this.initOrderStatusSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
