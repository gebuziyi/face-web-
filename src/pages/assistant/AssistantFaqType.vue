<template>
  <div>
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="选择类型名称" filterable>
          <el-option v-for="(item, index) in faqTypeNames" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发送时间" end-placeholder="发送时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:recommend:type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="typeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="typeName" label="类型名称" width="300"></el-table-column>
      <el-table-column prop="typeUrl" label="问题分类URL"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column prop="creatorName" label="创建人"></el-table-column>
      <el-table-column prop="editorName" label="修改人"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('user:recommend:type:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.typeId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('gift:type:delete')">
              <el-button type="danger" size="mini" @click="deleteAssistantFaqType(scope.row)">
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
    <create-dialog :faqTypeNames="faqTypeNames" :countries="countries" @done="query" ref="createDialog"></create-dialog>
    <edit-dialog :faqTypeNames="faqTypeNames" :countries="countries" @done="query" ref="editDialog"></edit-dialog>
  </div>
</template>

<script>
import {
  getAssistantFaqTypeList,
  getAllFsqTypeType,
  removeAssistantFaqType
} from '../../api/assistant/assistant-FaqType';
const AssistantFaqTypeCreateDialog = () =>
  import('./dialogs/AssistantFaqTypeCreateDialog');
const AssistantFaqTypeEditDialog = () =>
  import('./dialogs/AssistantFaqTypeEditDialog');
export default {
  name: 'msg-template-page',
  components: {
    'create-dialog': AssistantFaqTypeCreateDialog,
    'edit-dialog': AssistantFaqTypeEditDialog
  },
  data() {
    return {
      loading: {
        table: true
      },
      countries: [],
      faqTypeNames: [],
      tableData: [],
      // 查询表单
      queryModel: {
        typeId: null
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
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    openCreateDialog() {
      this.$refs.createDialog.showDialog();
    },
    openEditDialog(typeId) {
      this.$refs.editDialog.showDialog(typeId);
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table = true;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getAssistantFaqTypeList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          // 设置总数量
          this.pager.total = data.page.totalCount;
          // 取消loading状态
          this.loading.table = false;
        })
        .catch(error => {});
    },
    initFaqTypeNamesSelectData() {
      getAllFsqTypeType()
        .then(({ data }) => {
          this.faqTypeNames = data.list;
        })
        .catch(error => {});
    },
    deleteAssistantFaqType(row) {
      this.$confirm('此操作将删除问题类型: ' + row.typeName, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeAssistantFaqType(row.typeId)
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
    }
  },
  created() {
    this.initFaqTypeNamesSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
