<template>
  <div id="sys-user-vest-page">
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="马甲账号用户名"></el-input>
      </el-form-item>
      <el-form-item prop="adminUsername">
        <el-input v-model.trim="queryModel.adminUsername" placeholder="管理员用户名"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <table-btns @query="query" :btns="operationBtns"></table-btns>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="vestId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="adminUsername" label="管理员"></el-table-column>
      <el-table-column prop="userId" label="马甲账户ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop='sex' label="性别">
          <!-- <template slot-scope="scope">
          <span class='detail-span' v-if='scope.row.sex === 0'>女</span>
          <span class='detail-span' v-if='scope.row.sex === 1'>男</span>
          <span class='detail-span' v-if='scope.row.sex === 2'>未知</span>
          </template> -->
         <template slot-scope="scope">
          <icon-tag>{{ scope.row.sex === 0 ? '女' : '男'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="国家"></el-table-column>
      <el-table-column prop="img" label="头像">
        <template slot-scope="scope">
          <table-img-previewer :option="{ imgSrc: scope.row.img, title: `${scope.row.username}头像预览` }"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="warning" size="mini" @click="showEditDialog(scope.row)" v-if="hasPermission('sys:vest:update')">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="解除绑定" placement="top" v-if="hasPermission('sys:vest:delete')">
              <el-button type="danger" size="mini" @click="showDeleteSingleConfirm(scope.row)">
                <i class="fa fa-unlink"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <create-dialog ref="createDialog" @done="getTableData()"></create-dialog>
    <edit-dialog ref="editDialog" @done="getTableData()"></edit-dialog>
  </div>
</template>

<script>
import {
  getSysUserVestList,
  deleteSysUserVest
} from '../../api/sys/sys-user-vest';
import SysUserVestCreateDialog from './dialogs/SysUserVestCreateDialog';
import SysUserVestEditDialog from './dialogs/SysUserVestEditDialog';

export default {
  name: 'sys-user-vest-page',

  components: {
    'create-dialog': SysUserVestCreateDialog,
    'edit-dialog': SysUserVestEditDialog
  },

  data() {
    return {
      selectedIds: [],
      operationBtns: {
        deleteBatch: {
          label: '批量删除',
          type: 'danger',
          needPerm: true,
          permission: 'sys:vest:delete',
          icon: 'fa fa-trash',
          enable: false,
          onClick: payload => {
            this.showDeleteBatchConfirm();
          }
        },
        save: {
          label: '新增',
          type: 'success',
          needPerm: true,
          permission: 'sys:vest:save',
          icon: 'fa fa-plus',
          enable: true,
          onClick: payload => {
            this.$refs.createDialog.showDialog();
          }
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        adminUsername: null,
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
    showDeleteSingleConfirm(row) {
      this.$confirm(
        `此操作将解除管理员 ${row.adminUsername} 和马甲账号 ${
          row.username
        } 的关联关系(不会删除马甲账号), 是否继续?`,
        '关系解除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteSysUserVest(row.vestId)
            .then(resp => {
              this.$message.success('解除成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showDeleteBatchConfirm() {
      this.$confirm(
        `此操作将解除所选择的马甲账号与对应管理员的关联关系(不会删除马甲账号), 是否继续?`,
        '关系解除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteSysUserVest(this.selectedIds)
            .then(resp => {
              this.$message.success('解除成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showEditDialog(row) {
      this.$refs.editDialog.showDialog(row.vestId);
    },
    onSelectionChange(rows) {
      if (rows && rows.length > 0) {
        this.operationBtns.deleteBatch.enable = true;
        this.selectedIds = rows.map(data => data.typeId);
      } else {
        this.operationBtns.deleteBatch.enable = false;
      }
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
      getSysUserVestList({
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
