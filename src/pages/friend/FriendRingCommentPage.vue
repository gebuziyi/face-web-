<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="checked">
        <el-select v-model="queryModel.checked" placeholder="审核状态" clearable>
          <el-option :value="0" label="未通过"></el-option>
          <el-option :value="1" label="审核通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发布时间" end-placeholder="发布时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
      <el-table-column prop="commentId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="createTime" label="评论时间"></el-table-column>
      <el-table-column prop="content" label="文字内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="likeNum" label="点赞数" sortable="custom"></el-table-column>
      <el-table-column prop="checked" label="审核状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.checked === true ? 'success' : 'danger'">
            {{ scope.row.checked === true ? '审核通过' : '未通过'}}
          </icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="审核不通过" placement="top" v-if="hasPermission('friend:comment:check') && scope.row.checked === true">
              <el-button type="danger" size="mini" @click="doCheckFailed(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import {
  getFriendRingCommentList,
  checkFailed
} from '../../api/friend/friend-ring-comment';

export default {
  name: 'friend-ring-comment-page',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        checked: null,
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
    doCheckFailed(row) {
      this.$confirm(
        `此操作将屏蔽用户 ${row.username} 在 ${
          row.createTime
        } 发表的朋友圈评论, 是否继续?`,
        '屏蔽朋友圈评论',
        {
          type: 'warning'
        }
      )
        .then(() => {
          checkFailed(row.commentId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
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
      // 显示表格loading
      this.loading.table = true;
      getFriendRingCommentList({
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
