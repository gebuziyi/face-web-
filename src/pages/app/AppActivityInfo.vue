<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="type">
        <el-select v-model="queryModel.type" placeholder="活动类型" filterable>
          <el-option v-for="item in activitysTypes" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name">
        <el-select v-model="queryModel.name" placeholder="活动名称" filterable>
          <template  v-for="(item, index) in activityNames">
            <el-option  :key="index" :label="item.name" :value="item.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('app:activity:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="showDelete" type="primary" size="small"  class="btn-operation">
        <i class="fa fa-recycle"></i>
        <span>已删除活动</span>
      </el-button>
      <el-button @click="showCreate" type="primary" size="small"  class="btn-operation" v-if="hasPermission('app:activity:save')">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="id" label="Id" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="type" label="活动类型">
        <template slot-scope="scope">
          <icon-tag type='primary'>{{ actionTypes(scope.row.type) }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column prop="introduction" label="活动介绍"></el-table-column>
      <el-table-column prop="startTime" label="活动开始时间" sortable="custom"></el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" sortable="custom"></el-table-column>
      <el-table-column prop="webPageUrl" label="活动页面URL"></el-table-column>
      <el-table-column prop="coverImgUrl" label="活动封面URL">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.coverImgUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUserName" label="修改人" ></el-table-column>
      <el-table-column prop="editTime" label="修改时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('app:activity:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('app:activity:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.id)">
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
    <el-dialog :visible.sync="dialog.picPreview.show">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <show-deleted-activity ref="deletedActivityDialog"  @done="query"></show-deleted-activity>
    <show-create-activity ref="createDialog"  @done="query"></show-create-activity>
    <edit-dialog ref="editDialog" @done="getTableData"></edit-dialog>
  </div>
</template>

<script>
import {
  getAppActivityList,
  deleteAppActivity,
  getAllActivityNames
} from '../../api/app/app-activity';
import { APP_ACTIVITY_TYPES } from '../../utils/constants';
import ShowDeletedAppActivitysDialog from './dialogs/ShowDeletedAppActivitysDialog';
import AppActivityCreateDialog from './dialogs/AppActivityCreateDialog';
import ApppActivityEditDialog from './dialogs/ApppActivityEditDialog';
export default {
  name: 'search-key-page',

  components: {
    'show-deleted-activity': ShowDeletedAppActivitysDialog,
    'show-create-activity': AppActivityCreateDialog,
    'edit-dialog': ApppActivityEditDialog
  },

  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      activityNames: [],
      selectedIds: [],
      activitysTypes: APP_ACTIVITY_TYPES,
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        type: null,
        name: null,
        isDeleted: 0
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
    openEditDialog(id) {
      this.$refs.editDialog.showDialog(id);
    },
    showDelete() {
      this.$refs.deletedActivityDialog.showDialog();
    },
    showCreate() {
      this.$refs.createDialog.showDialog();
    },
    actionTypes(types) {
      if (this.activitysTypes) {
        return this.activitysTypes.find(
          item => item.type === types
        ).name;
      }
      return '未知状态';
    },
    deleteSingle(row) {
      this.$confirm(
        '确定要删除id=' + row.id + '的活动?',
        'APP活动删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteAppActivity(row.id)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    deleteBatch() {
      this.$confirm('确定要删除选中的APP活动?', 'APP活动批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteAppActivity(this.selectedIds)
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
        this.selectedIds = rows.map(data => data.id);
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
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.coverImgUrl;
      this.dialog.picPreview.show = true;
    },
    getTableData() {
      this.loading.table = true;
      getAppActivityList({
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
      getAllActivityNames()
        .then(({ data }) => {
          this.activityNames = data.list;
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
