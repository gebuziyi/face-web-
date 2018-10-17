<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="accessoryId">
        <el-select v-model="queryModel.accessoryId" placeholder="选择头像挂饰" filterable>
          <el-option v-for="item in accessories" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
      <el-button @click="showBatchDeleteConfirm" type="danger" size="small" v-if="hasPermission('user:accessory:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量取消</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:accessory:create')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>分配挂饰</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="accessoryId" label="挂饰ID"></el-table-column>
      <el-table-column prop="accessoryName" label="挂饰名称"></el-table-column>
      <el-table-column prop="accessoryUrl" label="挂饰图片">
        <template slot-scope="scope">
          <table-img-previewer :option="{imgSrc: scope.row.accessoryUrl}"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="冻结类型"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="expireTime" label="过期时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="取消挂饰" placement="top" v-if="hasPermission('user:accessory:delete')">
              <el-button type="error" size="mini" @click="openDelSingleConfirm(scope.row)">
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
    <create-dialog :accessories="accessories" @done="onQueryBtnClick" ref="createDialog"></create-dialog>
  </div>
</template>

<script>
import { getUserAvatarAccessoryList } from '../../api/user/user-avatar-accessory';
import UserAvatarAccessoryCreateDialog from './dialogs/UserAvatarAccessoryCreateDialog';

export default {
  name: 'user-avatar-accessory-page',

  components: {
    'create-dialog': UserAvatarAccessoryCreateDialog
  },

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
        accessoryId: null
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
    showBatchDeleteConfirm() {
      this.$confirm(
        `此操作将取消所选用户的头像挂饰, 是否继续?`,
        '批量取消用户挂饰',
        {
          type: 'warning'
        }
      )
        .then(() => {
          // TODO
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
        this.selectedIds = rows.map(data => data.typeId);
      }
    },

    openCreateDialog() {
      this.$refs.createDialog.showDialog();
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

    // initAccessoriesSelectData() {
    //   getAllAccessories()
    //     .then(({ data }) => {
    //       this.accessories = data.list;
    //     })
    //     .catch(error => {});
    // },

    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getUserAvatarAccessoryList({
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
