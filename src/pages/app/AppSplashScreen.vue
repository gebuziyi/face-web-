<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="type">
        <el-select v-model="queryModel.type" placeholder="启动页类型" filterable>
          <el-option v-for="item in screenTypeList" :key="item.type" :label="item.name" :value="item.type"></el-option>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('splash:key:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="showDelete" type="primary" size="small"  class="btn-operation">
        <i class="fa fa-recycle"></i>
        <span>已删除启动页</span>
      </el-button>
      <el-button @click="showCreate" type="primary" size="small"  class="btn-operation" v-if="hasPermission('splash:key:save')">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="id" label="Id" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.type === 1 ? 'primary' : 'success'">{{ isType(scope.row.type) }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileUrl" label="封面">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.fileUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="clickable" label="是否可点击">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.clickable === true ? 'success' : 'warning'">{{ scope.row.clickable === true ?'可点击':'不可点击' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stayTime" label="停留时间(秒)" sortable="custom"></el-table-column>
      <el-table-column prop="skippable" label="是否显示跳过按钮">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.skippable === true ? 'success' : 'warning'">{{ scope.row.skippable === true ?'可跳过':'不可跳过' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="clickAction" label="点击完成的动作">
        <template slot-scope="scope">
          <span style="padding-left: 0.5em">{{ actionStatus(scope.row.clickAction) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actionData" label="完成动作需要的数据"></el-table-column>
      <el-table-column prop="enableTime" label="生效时间" sortable="custom"></el-table-column>
      <el-table-column prop="disableTime" label="失效时间" sortable="custom"></el-table-column>
      <el-table-column prop="deleted" label="是否已删除">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.deleted === true ? 'warning' : 'success'">{{ scope.row.deleted === true ?'已删除':'未删除' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
      <el-table-column prop="editTime" label="上次修改时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUserName" label="上次修改人"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('splash:key:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('splash:key:update')">
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
    <show-deleted-screen ref="deletedScreenDialog"  @done="query"></show-deleted-screen>
    <show-create-screen ref="createScreenDialog"  @done="query"></show-create-screen>
    <edit-dialog ref="editDialog" @done="getTableData"></edit-dialog>
  </div>
</template>

<script>
import {
  getAppSplashScreenList,
  deleteAppSplashScreen
} from '../../api/app/app-splash-screen';
import { APP_SPLASH_SCREEN_TYPE, APP_SPLASH_SCREEN_CLICKACTIONS } from '../../utils/constants';
import DeletedAppSplashScreenDialog from './dialogs/DeletedAppSplashScreenDialog';
import ApppSplashScreenCreateDialog from './dialogs/ApppSplashScreenCreateDialog';
import ApppSplashScreenEditDialog from './dialogs/ApppSplashScreenEditDialog';
export default {
  name: 'search-key-page',

  components: {
    'show-deleted-screen': DeletedAppSplashScreenDialog,
    'show-create-screen': ApppSplashScreenCreateDialog,
    'edit-dialog': ApppSplashScreenEditDialog
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
      screenTypeList: APP_SPLASH_SCREEN_TYPE,
      clickActionStatusList: APP_SPLASH_SCREEN_CLICKACTIONS,
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        type: null,
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
      this.$refs.deletedScreenDialog.showDialog();
    },
    showCreate() {
      this.$refs.createScreenDialog.showDialog();
    },
    actionStatus(clickAction) {
      if (this.clickActionStatusList) {
        return this.clickActionStatusList.find(
          item => item.type === clickAction
        ).name;
      }
      return '未知状态';
    },
    isType(status) {
      if (status === 1) {
        return '视频';
      } else {
        return '图片';
      }
    },
    deleteSingle(row) {
      this.$confirm(
        '确定要删除id=' + row.id + '的启动页?',
        'APP启动页删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteAppSplashScreen(row.id)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    deleteBatch() {
      this.$confirm('确定要删除选中的APP启动页?', 'APP启动页批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteAppSplashScreen(this.selectedIds)
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
      this.dialog.picPreview.picSrc = row.fileUrl;
      this.dialog.picPreview.show = true;
    },
    getTableData() {
      this.loading.table = true;
      getAppSplashScreenList({
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
