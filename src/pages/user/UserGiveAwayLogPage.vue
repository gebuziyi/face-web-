<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
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
    <el-tabs v-model="activeTabName" @tab-click="onTabClick">
      <el-tab-pane label="短视频礼物收支记录" name="1">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="送礼人ID"></el-table-column>
          <el-table-column prop="username" label="送礼人昵称"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="礼物单价"></el-table-column>
          <el-table-column prop="numbers" label="礼物数量" width="120"></el-table-column>
          <el-table-column prop="account" label="收礼人ID" width="100"></el-table-column>
          <el-table-column prop="accountUsername" label="收礼人昵称"></el-table-column>
          <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="直播礼物收支记录" name="2">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="送礼人ID"></el-table-column>
          <el-table-column prop="username" label="送礼人昵称"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="礼物单价"></el-table-column>
          <el-table-column prop="numbers" label="礼物数量" width="120"></el-table-column>
          <el-table-column prop="account" label="收礼人ID" width="100"></el-table-column>
          <el-table-column prop="accountUsername" label="收礼人昵称"></el-table-column>
          <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="1V1礼物收支记录" name="3">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="送礼人ID"></el-table-column>
          <el-table-column prop="username" label="送礼人昵称"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="礼物单价"></el-table-column>
          <el-table-column prop="numbers" label="礼物数量" width="120"></el-table-column>
          <el-table-column prop="account" label="收礼人ID" width="100"></el-table-column>
          <el-table-column prop="accountUsername" label="收礼人昵称"></el-table-column>
          <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="聊天礼物收支记录" name="4">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="送礼人ID"></el-table-column>
          <el-table-column prop="username" label="送礼人昵称"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="礼物单价"></el-table-column>
          <el-table-column prop="numbers" label="礼物数量" width="120"></el-table-column>
          <el-table-column prop="account" label="收礼人ID" width="100"></el-table-column>
          <el-table-column prop="accountUsername" label="收礼人昵称"></el-table-column>
          <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="个人中心礼物收支记录" name="5">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="送礼人ID"></el-table-column>
          <el-table-column prop="username" label="送礼人昵称"></el-table-column>
          <el-table-column prop="giftName" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="礼物单价"></el-table-column>
          <el-table-column prop="numbers" label="礼物数量" width="120"></el-table-column>
          <el-table-column prop="account" label="收礼人ID" width="100"></el-table-column>
          <el-table-column prop="accountUsername" label="收礼人昵称"></el-table-column>
          <el-table-column prop="createTime" label="赠送时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="8">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="用户ID"></el-table-column>
          <el-table-column prop="username" label="用户昵称"></el-table-column>
          <el-table-column prop="price" label="充值钻石数" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="充值时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="提现记录" name="9">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="用户ID"></el-table-column>
          <el-table-column prop="username" label="用户昵称"></el-table-column>
          <el-table-column prop="price" label="提现F币数量" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="提现时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="F币转换钻石记录" name="10">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom"></el-table-column>
          <el-table-column prop="userId" label="用户ID"></el-table-column>
          <el-table-column prop="username" label="用户昵称"></el-table-column>
          <el-table-column prop="price" label="钻石兑换数量" sortable="custom"></el-table-column>
          <el-table-column prop="createTime" label="兑换时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="邀请好友送钻石记录" name="11">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
          <el-table-column prop="userId" label="邀请人的用户ID"></el-table-column>
          <el-table-column prop="username" label="邀请人的用户名"></el-table-column>
          <el-table-column prop="price" label="系统赠送的钻石数量"></el-table-column>
          <el-table-column prop="account" label="被邀请人用户ID"></el-table-column>
          <el-table-column prop="accountUsername" label="被邀请人昵称"></el-table-column>
          <el-table-column prop="createTime" label="被邀请人的注册时间" sortable="custom"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </div>
</template>

<script>
import { GIVE_AWAY_TYPES } from '../../utils/constants';
import { getUserGiveAwayLogList } from '../../api/user/giveaway-log';

export default {
  name: 'user-giveaway-log-page',
  data() {
    return {
      // 8 - 充值, 9 - 提现, 10 - F币转换钻石, 有专门的tab页对应
      giveAwayTypes: GIVE_AWAY_TYPES.filter(item => item.type < 8),
      activeTabName: '1',
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        isType: 1,
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
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onTabClick(tab) {
      this.pager.page = 1;
      this.queryModel.isType = tab.name;
      this.query();
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
      getUserGiveAwayLogList({
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
