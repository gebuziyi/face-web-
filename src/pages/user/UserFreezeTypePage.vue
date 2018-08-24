<template>
  <div>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="getTableData" type="primary" size="small">
        <i class="fa fa-refresh"></i>
        <span>刷新表格数据</span>
      </el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('user:freeze-type:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:freeze-type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="typeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="类型名称"></el-table-column>
      <el-table-column prop="introduction" label="介绍" show-overflow-tooltip></el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editTime" label="修改时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('user:freeze-type:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('user:freeze-type:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
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
    <!-- 弹窗 -->
    <create-dialog ref="createDialog" @done="getTableData()"></create-dialog>
    <edit-dialog ref="editDialog" @done="getTableData()"></edit-dialog>
  </div>
</template>

<script>
import {
  getUserFreezeTypeList,
  removeUserFreezeType
} from '../../api/user/user-freeze-type';
import UserFreezeTypeCreateDialog from './dialogs/UserFreezeTypeCreateDialog';
import UserFreezeTypeEditDialog from './dialogs/UserFreezeTypeEditDialog';

export default {
  name: 'user-Freeze-type-page',

  components: {
    'create-dialog': UserFreezeTypeCreateDialog,
    'edit-dialog': UserFreezeTypeEditDialog
  },

  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        name: null
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
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.typeId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的用户推荐类型', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeUserFreezeType(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    deleteSingle(row) {
      this.$confirm(`是否要删除用户推荐类型: ${row.name} ?`, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeUserFreezeType(row.typeId)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    openCreateDialog() {
      this.$refs.createDialog.showDialog();
    },
    openEditDialog(row) {
      // 打开对话框
      this.$refs.editDialog.showDialog(row.typeId);
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
      getUserFreezeTypeList({
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
