<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="activityName">
        <el-input v-model.trim="queryModel.activityName" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="disableBatch" type="danger" size="small" v-if="hasPermission('recharge:activity:status')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-ban"></i>
        <span>批量下架</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('recharge:activity:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55" :selectable="selectDeletableActivies">
      </el-table-column>
      <el-table-column prop="activityId" label="活动ID" sortable="custom"></el-table-column>
      <el-table-column prop="activityName" label="活动名称"></el-table-column>
      <el-table-column prop="introduction" label="活动介绍" show-overflow-tooltip ></el-table-column>
      <el-table-column prop="preferences" label="优惠百分比" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.preferences }} %
        </template>
      </el-table-column>
      <el-table-column prop="preferenCount" label="优惠次数">
        <template slot-scope="scope">
          <span v-if="scope.row.preferenCount === 0">
            无限制
          </span>
          <span v-else>仅一次</span>
        </template>
      </el-table-column>
      <el-table-column prop="img" label="活动图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="activity-img">
        </template>
      </el-table-column>
      <el-table-column prop="isExpire" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.isExpire === 1">上架中</el-tag>
          <el-tag type="warning" size="mini" v-else>已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('recharge:activity:update') && scope.row.isExpire !== 1">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-button type="primary" size="mini" @click="enableSingle(scope.row)" v-if="hasPermission('recharge:activity:status') && scope.row.isExpire !== 1">
              上架
            </el-button>
            <el-tooltip class="item" effect="dark" content="下架" placement="top" v-if="hasPermission('recharge:activity:status') && scope.row.isExpire === 1">
              <el-button type="danger" size="mini" @click="disableSingle(scope.row)">
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
    <!-- 弹窗 start-->
    <edit-dialog ref="editDialog" @done="getTableData()"></edit-dialog>
    <create-dialog ref="createDialog" @done="getTableData()"></create-dialog>
  </div>
</template>

<script>
import {
  getRechargeActivityList,
  disableRechargeActivity,
  enableRechargeActivity
} from '../../api/recharge/recharge-activity';
import RechargeActivityCreateDialog from './dialogs/RechargeActivityCreateDialog';
import RechargeActivityEditDialog from './dialogs/RechargeActivityEditDialog';

export default {
  name: 'recharge-activity-page',
  components: {
    'create-dialog': RechargeActivityCreateDialog,
    'edit-dialog': RechargeActivityEditDialog
  },
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        activityName: null,
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
    enableSingle(row) {
      this.$confirm(
        `确定要上架充值优惠活动: ${row.activityName} ?`,
        '上架确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          enableRechargeActivity(row.activityId)
            .then(resp => {
              this.$message.success('上架成功');
              this.query();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    selectDeletableActivies(row, index) {
      return row.isExpire === 1;
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.activityId);
      }
    },
    disableBatch() {
      this.$confirm(
        '此操作将下架所选择的优惠活动 (如果有充值规格正在使用这些优惠, 则相应优惠也将一并取消)',
        '批量下架确认'
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          disableRechargeActivity(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('下架成功');
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
    disableSingle(row) {
      this.$confirm(
        `此操作将下架优惠活动: ${
          row.activityName
        } (如果有充值规格正在使用此优惠, 则相应优惠也将一并取消)`,
        '下架确认'
      )
        .then(() => {
          this.loading.table = true;
          disableRechargeActivity(row.activityId)
            .then(({ data }) => {
              this.$message.success('下架成功');
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
      this.$refs.editDialog.showDialog(row.activityId);
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
      getRechargeActivityList({
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
.activity-img {
  width: 160px;
  height: 40px;
}
</style>
