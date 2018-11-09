<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="effectId">
        <el-select v-model="queryModel.effectId" placeholder="选择进场特效" filterable>
          <el-option v-for="item in effects" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="showBatchDeleteConfirm" type="danger" size="small" v-if="hasPermission('user:live-enter-effect:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量取消</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:live-enter-effect:create')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>分配特效</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="effectId" label="特效ID"></el-table-column>
      <el-table-column prop="effectName" label="特效名称"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="expireTime" label="过期时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="取消特效" placement="top" v-if="hasPermission('user:live-enter-effect:delete')">
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
    <!-- 弹窗 start-->
    <create-dialog @done="onQueryBtnClick" ref="createDialog"></create-dialog>
  </div>
</template>

<script>
import {
  getUserLiveEnterEffectList,
  getAllEffects,
  deleteUserLiveEnterEffect
} from '../../api/user/user-live-enter-effect';
import UserLiveEnterEffectCreateDialog from './dialogs/UserLiveEnterEffectCreateDialog';

export default {
  name: 'user-live-enter-effect-page',

  components: {
    'create-dialog': UserLiveEnterEffectCreateDialog
  },

  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      effects: [],
      tableData: [],
      queryModel: {
        userId: null,
        effectId: null
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
        `此操作将取消用户 ${row.nickName} 的 ${
          row.effectName
        } 进场特效, 是否继续?`,
        '取消用户进场特效',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteUserLiveEnterEffect(row.id)
            .then(resp => {
              this.$message.success('操作成功');
              this.query();
            })
            .catch(err => {
              this.$message.error('操作失败');
            });
        })
        .catch(() => {});
    },

    showBatchDeleteConfirm() {
      this.$confirm(
        `此操作将取消所选用户的进场特效, 是否继续?`,
        '批量取消用户进场特效',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteUserLiveEnterEffect(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.query();
            })
            .catch(err => {
              this.$message.error('操作失败');
            });
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
        this.selectedIds = rows.map(data => data.id);
      }
    },

    openCreateDialog() {
      this.$refs.createDialog.showDialog(this.effects);
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

    initEffectsSelectData() {
      getAllEffects()
        .then(({ data }) => {
          this.effects = data.list;
        })
        .catch(error => {});
    },

    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getUserLiveEnterEffectList({
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
    this.initEffectsSelectData();
  }
};
</script>
