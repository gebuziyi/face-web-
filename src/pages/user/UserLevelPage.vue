<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="names">
        <el-input v-model.trim="queryModel.names" placeholder="等级名称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <!-- 基础数据不允许通过页面操作进行删除 -->
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:level:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="levelId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="names" label="等级名称"></el-table-column>
      <el-table-column prop="memo" label="等级说明" show-overflow-tooltip></el-table-column>
      <el-table-column prop="minCharmValues" label="魅力值区间[)" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.minCharmValues }}(包含) - {{ scope.row.maxCharmValues }}(不包含)</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('user:level:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
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
    <!-- 修改等级信息 -->
    <edit-dialog ref="editDialog" @done="query"></edit-dialog>
    <create-dialog ref="createDialog" @done="query"></create-dialog>
  </div>
</template>

<script>
import { getUserLevelList } from '../../api/user/user-level';
import UserLevelEditDialog from './dialogs/UserLevelEditDialog';
import UserLevelCreateDialog from './dialogs/UserLevelCreateDialog';
import { emptyUserLevel } from '../../utils/empty-model';

export default {
  name: 'user-level-page',
  components: {
    'edit-dialog': UserLevelEditDialog,
    'create-dialog': UserLevelCreateDialog
  },
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptyUserLevel(),
          rules: {
            names: [
              { required: true, trigger: 'change', message: '等级名称不能为空' }
            ],
            sort: [
              { required: true, trigger: 'change', message: '排序值不能为空' },
              {
                type: 'number',
                min: 0,
                trigger: 'change',
                message: '排序值最小为0'
              }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        names: null
      },
      pager: {
        page: 1,
        limit: 30,
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
        this.selectedIds = rows.map(data => data.levelId);
      }
    },
    openCreateDialog() {
      this.$refs.createDialog.showDialog(this.pager.total + 1);
    },
    openEditDialog(row) {
      this.$refs.editDialog.showDialog({
        levelId: row.levelId,
        isFirstLevel: row.levelId === 1,
        isLastLevel: row.levelId === this.pager.total
      });
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
      getUserLevelList({
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
