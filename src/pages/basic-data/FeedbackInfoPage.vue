<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="content">
        <el-input v-model.trim="queryModel.content" placeholder="反馈内容"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="反馈人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始反馈时间" end-placeholder="终止反馈时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="isProcess">
        <el-select v-model="queryModel.isProcess" placeholder="处理状态" clearable>
          <el-option :value="1" :label="'已处理'"></el-option>
          <el-option :value="0" :label="'未处理'"></el-option>
        </el-select>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('feedback:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="feedblackId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="username" label="反馈人"></el-table-column>
      <el-table-column prop="content" label="反馈内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="反馈时间" sortable="custom"></el-table-column>
      <el-table-column prop="isProcess" label="处理状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.isProcess === 1 ? 'success' : 'warning'">{{ scope.row.isProcess === 1 ? '已处理' : '未处理'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="processManUsername" label="处理人"></el-table-column>
      <el-table-column prop="processTime" label="处理时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('feedback:info:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="处理完成" placement="top" v-if="hasPermission('feedback:info:update') && scope.row.isProcess !== 1">
              <el-button type="success" size="mini" @click="processConfirm(scope.row.feedblackId)">
                <i class="fa fa-check"></i>
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
  getFeedbackInfoList,
  deleteFeedback,
  processFeedback
} from '../../api/basic-data/feedback-info';

export default {
  name: 'feedback-info-page',
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        content: null,
        createTime: null,
        isProcess: null
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
    deleteBatch() {
      this.$confirm('确定要删除选中的的反馈信息?', '反馈信息批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteFeedback(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.feedblackId);
      }
    },
    deleteSingle(row) {
      this.$confirm(
        '确定要删除id=' + row.feedblackId + '的反馈信息?',
        '反馈信息删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteFeedback(row.feedblackId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    processConfirm(id) {
      this.$confirm(
        '确定要将id=' + id + '的反馈信息标记为已处理?',
        '反馈信息处理完成',
        {
          type: 'warning'
        }
      )
        .then(() => {
          processFeedback(id)
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
      getFeedbackInfoList({
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
