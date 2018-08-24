<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <!-- 点赞人用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="点赞人用户名"></el-input>
      </el-form-item>
      <!-- 创建时间区间 -->
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始点赞时间" end-placeholder="终止点赞时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-table-column prop="likeId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="title" label="问答标题"></el-table-column>
      <el-table-column prop="replyId" label="回复ID"></el-table-column>
      <el-table-column prop="content" label="回复内容"></el-table-column>
      <el-table-column prop="username" label="点赞人用户名"></el-table-column>
      <el-table-column prop="createTime" label="点赞时间" sortable="custom"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { getQaReplyLikeList } from '../../api/qa/qa-reply-like';

export default {
  name: 'qa-reply-like-page',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
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
      getQaReplyLikeList({
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
