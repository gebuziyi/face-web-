<template>
  <div>
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="选择推送类型" filterable>
          <el-option v-for="(item, index) in msgPushTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="countryId">
        <el-select v-model="queryModel.countryId" placeholder="选择对应国家" filterable>
          <el-option v-for="(item, index) in countries" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('msgpush:template:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="summaryId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="typeName" label="类型名称" width="300"></el-table-column>
      <el-table-column prop="cnContent" label="中文信息"></el-table-column>
      <el-table-column prop="content" label="外文信息模板"></el-table-column>
      <el-table-column prop="countryName" label="国家"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('msgpush:template:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.summaryId)">
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
    <create-dialog :msgPushTypes="msgPushTypes" :countries="countries" @done="query" ref="createDialog"></create-dialog>
    <edit-dialog :msgPushTypes="msgPushTypes" :countries="countries" @done="query" ref="editDialog"></edit-dialog>
  </div>
</template>

<script>
import { getMsgTemplateList } from '../../api/msgpush/msg-template';
import { getAllMsgPushType } from '../../api/msgpush/msgpush-type';
import { getAllCountryInfo } from '../../api/basic-data/country-info';
const MsgTemplateCreateDialog = () =>
  import('./dialogs/MsgTemplateCreateDialog');
const MsgTemplateEditDialog = () => import('./dialogs/MsgTemplateEditDialog');

export default {
  name: 'msg-template-page',
  components: {
    'create-dialog': MsgTemplateCreateDialog,
    'edit-dialog': MsgTemplateEditDialog
  },
  data() {
    return {
      loading: {
        table: true
      },
      countries: [],
      msgPushTypes: [],
      tableData: [],
      // 查询表单
      queryModel: {
        typeId: null,
        countryId: null
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
    openEditDialog(summaryId) {
      this.$refs.editDialog.showDialog(summaryId);
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
      getMsgTemplateList({
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
    initMsgPushTypeSelectData() {
      getAllMsgPushType()
        .then(({ data }) => {
          this.msgPushTypes = data.list;
        })
        .catch(error => {});
    },
    initCountrySelectData() {
      getAllCountryInfo()
        .then(({ data }) => {
          this.countries = data.list;
        })
        .catch(error => {});
    }
  },
  created() {
    this.initMsgPushTypeSelectData();
    this.initCountrySelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
