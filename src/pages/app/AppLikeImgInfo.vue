<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="id">
        <el-input v-model.trim="queryModel.id" placeholder="点赞图标ID"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-select v-model="queryModel.name" placeholder="点赞图标名称" filterable>
          <el-option v-for="(item, index) in appLikeNames" :key="index" :label="item.name" :value="item.name"></el-option>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('app:like:img:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="showCreate" type="primary" size="small"  class="btn-operation" v-if="hasPermission('app:like:img:save')">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="id" label="Id" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="name" label="点赞图标名称" sortable="custom"></el-table-column>
      <el-table-column prop="imgUrl" label="封面">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.imgUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="点赞图标介绍"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('app:like:img:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('app:like:img:update')">
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
    <show-create-screen ref="createScreenDialog"  @done="query"></show-create-screen>
    <show-edit-dialog ref="editDialog" @done="getTableData"></show-edit-dialog>
  </div>
</template>

<script>
import {
  getAppLikeImgList,
  getAllAppLikeImgNames,
  deleteAppLikeImg
} from '../../api/app/app-like-img';
import ApppLikeImgCreateDialog from './dialogs/ApppLikeImgCreateDialog';
import ApppLikeImgEditDialog from './dialogs/ApppLikeImgEditDialog';
export default {
  name: 'app-like-img',

  components: {
    'show-create-screen': ApppLikeImgCreateDialog,
    'show-edit-dialog': ApppLikeImgEditDialog
  },

  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      selectedIds: [],
      appLikeNames: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        id: null,
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
    openEditDialog(id) {
      this.$refs.editDialog.showDialog(id);
    },
    showCreate() {
      this.$refs.createScreenDialog.showDialog();
    },
    deleteSingle(row) {
      this.$confirm(
        '确定要删除id=' + row.id + '的点赞图标?',
        'APP点赞图标删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteAppLikeImg(row.id)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {
              this.query();
            });
        })
        .catch(() => {});
    },
    deleteBatch() {
      this.$confirm('确定要删除选中的APP点赞图标?', 'APP点赞图标批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteAppLikeImg(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {
              this.query();
            });
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
      this.doGetAllAppLikeNames();
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
      this.dialog.picPreview.picSrc = row.imgUrl;
      this.dialog.picPreview.show = true;
    },
    getTableData() {
      this.loading.table = true;
      getAppLikeImgList({
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
    doGetAllAppLikeNames() {
      getAllAppLikeImgNames().then(({ data }) => {
        this.appLikeNames = data.list;
      });
    }
  },
  created() {
    this.getTableData();
    this.doGetAllAppLikeNames();
  }
};
</script>

<style scoped>
</style>
