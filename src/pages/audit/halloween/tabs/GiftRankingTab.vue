<template>
    <div class="tab-wrapper">
    <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="userId">
          <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div class="btn-wrapper">
        <el-button @click="onQueryBtnClick" type="primary" size="small">
          <i class="fa fa-search"></i>
          <span>搜索</span>
        </el-button>
        <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
        <el-table-column prop="userId" label="用户ID" sortable="custom"></el-table-column>
        <el-table-column prop="userNick" label="用户昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sendCandyNum" label="送出的糖果数量"></el-table-column>
        <el-table-column prop="sendGhostNum" label="送出的鬼魂数量"></el-table-column>
        <el-table-column prop="giftMoneyNum" label="礼物总金额"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
      </el-pagination>
      <!-- 弹窗 -->
    </div>
</template>

<script>
import { getGiftRankingList } from '../../../../api/audit/helloween';
export default {
  name: 'live-activity-publish-tab',

  data() {
    return {
      tableData: [],
      queryModel: {
        userId: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      },
      loading: {
        select: {
          mname: false
        }
      },
      btnLoading: false
    };
  },
  methods: {
    getTableData() {
      this.loading.table = true;
      getGiftRankingList({
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
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    }
  },
  created() {
    this.getTableData();
  }
};
</script>
<style scoped>
.tab-wrapper {
  margin-top: 10px;
}
</style>
