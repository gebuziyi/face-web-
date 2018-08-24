<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="主播用户名"></el-input>
      </el-form-item>
      <el-form-item prop="homeNo">
        <el-input v-model.trim="queryModel.homeNo" placeholder="直播间号码"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="infoId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="homeNo" label="直播间号码"></el-table-column>
      <el-table-column prop="imId" label="群聊天室ID"></el-table-column>
      <el-table-column prop="streamId" label="腾讯直播码"></el-table-column>
      <el-table-column prop="createTime" label="首次开播时间" sortable="custom"></el-table-column>
      <el-table-column prop="stopTime" label="上次禁播时间"></el-table-column>
      <el-table-column prop="openTime" label="允许开播时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="复播" placement="top" v-if="hasPermission('live:home:enable')">
              <el-button type="success" size="mini" @click="doEnableLive(scope.row)">
                <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="禁播" placement="top" v-if="hasPermission('live:home:disable')">
              <el-button type="danger" size="mini" @click="doDisableLive(scope.row)">
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
  </div>
</template>

<script>
import {
  getLiveHomeInfoList,
  enableAnchorLive,
  disableAnchorLive
} from '../../api/live/live-home-info';

export default {
  name: 'live-home-info-page',
  data() {
    return {
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null,
        homeNo: null
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
    doDisableLive(row) {
      this.$confirm(
        `此操作将禁止主播 [${
          row.username
        }] 继续直播, 禁播时长为期1天(24小时), 在此期间主播将无法继续发起直播, 已开播的直播会被立即关闭, 是否继续?`,
        '禁播',
        {
          type: 'warning'
        }
      )
        .then(() => {
          disableAnchorLive(row.infoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    doEnableLive(row) {
      this.$confirm(
        `该主播: [${
          row.username
        }] 曾因某种原因被管理员禁播, 应在确认该主播符合继续直播的条件后再进行此操作, 是否继续?`,
        '复播',
        {
          type: 'warning'
        }
      )
        .then(() => {
          enableAnchorLive(row.infoId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
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
      getLiveHomeInfoList({
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
