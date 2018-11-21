<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickName">
        <el-input v-model.trim="queryModel.nickName" placeholder="用户昵称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="showBatchDeleteConfirm" type="danger" size="small" v-if="hasPermission('user:img-user-homepage:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="imgId" label="ID主键"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="imgUrl" label="图片">
        <template slot-scope="scope">
          <table-img-previewer :option="{imgSrc: scope.row.imgUrl}"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="smallImg" label="缩略图">
        <template slot-scope="scope">
          <table-img-previewer :option="{imgSrc: scope.row.smallImg}"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="creatorTime" label="上传时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('user:img-user-homepage:delete')">
              <el-button type="danger" size="mini" @click="showDelSingleConfirm(scope.row)">
                <i class="fa fa-trash"></i>
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
  getList,
  deletes
} from '../../api/user/img-user-homepage';

export default {
  name: 'user-avatar-accessory-page',
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      accessories: [],
      tableData: [],
      queryModel: {
        userId: null,
        nickName: null
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
    showDelSingleConfirm(row) {
      this.$confirm(
        `此操作将删除用户 ${row.nickName} 的 ${row.imgId} 的头像, 是否继续?`,
        '删除用户头像',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deletes(row.imgId)
            .then(resp => {
              this.$message.success('操作成功');
              this.query();
            })
            .catch(err => {
              this.$message.error('操作失败');
            })
        })
        .catch(() => {});
    },

    showBatchDeleteConfirm() {
      this.$confirm(
        `此操作将删除所选用户的头像, 是否继续?`,
        '批量删除用户头像',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deletes(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.query();
            })
            .catch(err => {
              this.$message.error('操作失败');
            })
        })
        .catch(() => {});
    },

    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },

    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.imgId);
      }
    },

    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },

    query() {
      this.loading.table = true;
      this.getTableData();
    },

    onSizeChange(size) {
      this.pager.limit = size;
      this.getTableData();
    },

    onCurrentPageChange(page) {
      this.pager.page = page;
      this.getTableData();
    },

    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getList({
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
