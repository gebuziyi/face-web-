<template>
  <div>
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="推荐类型" clearable filterable>
          <el-option v-for="(item, index) in RecommendTypeList" :key="index" :value="item.typeId" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="resetQueryForm">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('user:recommend:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量取消推荐</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:recommend:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增推荐</span>
      </el-button>
      <el-button @click="showSortDialog" type="primary" size="small" v-if="hasPermission('user:recommend:sort')" class="btn-operation">
        <i class="fa fa-sort-numeric-desc"></i>
        <span>排序</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="recommendId" label="推荐ID" sortable="custom"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="recommendType" label="推荐类型"></el-table-column>
      <el-table-column prop="creatorUsername" label="推荐人"></el-table-column>
      <el-table-column prop="createTime" label="推荐时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="取消推荐" placement="top" v-if="hasPermission('user:recommend:delete')">
              <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
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
    <recommend-create-dialog ref="createDialog" @done="onQueryBtnClick"></recommend-create-dialog>
    <sort-dialog ref="sortDialog" @done="onQueryBtnClick"></sort-dialog>
  </div>
</template>

<script>
import {
  getUserRecommendList,
  removeUserRecommend
} from '../../api/user/user-recommend';
import UserRecommendCreateDialog from './dialogs/UserRecommendCreateDialog';
import RecommendedUserSortDialog from './dialogs/RecommendedUserSortDialog';
import { getAllForComboBox } from '../../api/user/user-recommend-type';
export default {
  name: 'user-recommend-page',
  components: {
    'recommend-create-dialog': UserRecommendCreateDialog,
    'sort-dialog': RecommendedUserSortDialog
  },
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      RecommendTypeList: [],
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
      }
    };
  },
  methods: {
    showSortDialog() {
      this.$refs.sortDialog.showDialog();
    },
    resetQueryForm() {
      this.$refs.queryForm.resetFields();
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.recommendId);
      }
    },
    deleteBatch() {
      this.$confirm('确认取消推荐所选择的用户信息?', '批量取消推荐')
        .then(() => {
          this.loading.table = true;
          removeUserRecommend(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('取消推荐成功');
              // 刷新表格数据
              this.onQueryBtnClick();
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
    doDeleteSingle(row) {
      this.$confirm(`确定取消推荐该用户: ${row.nickname} ?`, '取消推荐确认')
        .then(() => {
          this.loading.table = true;
          removeUserRecommend(row.recommendId)
            .then(({ data }) => {
              this.$message.success('取消推荐成功');
              // 刷新表格数据
              this.onQueryBtnClick();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
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
      getUserRecommendList({
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
    getRecommendTypeData() {
      getAllForComboBox()
        .then(({ data }) => {
          this.RecommendTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.getTableData();
    this.getRecommendTypeData();
  }
};
</script>

<style scoped>
.user-avatar {
  width: 60px;
  height: 60px;
}
</style>
