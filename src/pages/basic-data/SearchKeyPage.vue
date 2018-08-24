<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="keyValue">
        <el-input v-model.trim="queryModel.keyValue" placeholder="关键字"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="searchType">
        <el-select v-model="queryModel.searchType" placeholder="搜索类型" clearable>
          <el-option v-for="(item, index) in searchTypeList" :key="index" :value="item.type" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始搜索时间" end-placeholder="终止搜索时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('search:key:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="keyId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="keyValue" label="搜索关键字"></el-table-column>
      <el-table-column prop="searchType" label="搜索类型">
        <template slot-scope="scope">
          <el-tag size="mini" :type="type2TagType(scope.row.searchType)">
            <i :class="type2IconClass(scope.row.searchType)"></i>
            <span style="padding-left: 0.5em">{{ type2Description(scope.row.searchType) }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="搜索时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('search:key:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
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
  </div>
</template>

<script>
import {
  getSearchKeyList,
  getAllSearchType,
  deleteSearchKey
} from '../../api/basic-data/search-key';
import { SEARCH_TYPE_ICON_MAPPING } from '../../utils/constants';

export default {
  name: 'search-key-page',
  data() {
    return {
      selectedIds: [],
      searchTypeList: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        searchType: null,
        keyValue: null,
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
    deleteSingle(row) {
      this.$confirm(
        '确定要删除id=' + row.keyId + '的搜索记录?',
        '用户搜索记录删除',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteSearchKey(row.keyId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    deleteBatch() {
      this.$confirm('确定要删除选中的用户搜索记录?', '用户搜索记录批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteSearchKey(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    type2TagType(value) {
      return SEARCH_TYPE_ICON_MAPPING['type' + value].tagType;
    },
    type2IconClass(value) {
      return SEARCH_TYPE_ICON_MAPPING['type' + value].icon;
    },
    type2Description(value) {
      let type = this.searchTypeList.find(item => item.type === value);
      return type ? type.description : '';
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.keyId);
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
      this.loading.table = true;
      getSearchKeyList({
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
    initSearchTypeSelectData() {
      getAllSearchType()
        .then(({ data }) => {
          this.searchTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initSearchTypeSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
