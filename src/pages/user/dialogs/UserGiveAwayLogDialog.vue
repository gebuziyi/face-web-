<template>
  <el-dialog :title="`用户收支记录 -- ${nickname}`" width="1200px" :visible.sync="show" :close-on-click-modal="false" @close="onClose">
    <h3>F币统计</h3><br>
    <div class="give-change">
      <h3 style="padding: 10px"> F币余额： {{f.fbalance ? f.fbalance : 0 }}</h3><br>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="2">
          <div class="grid-content bg-purple" style="font-weight: bold">收入：</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            短视频收到的礼物: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{f.videoiIcome ? f.videoiIcome : 0 }}
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            直播收到的礼物: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{f.liveIncome ? f.liveIncome : 0 }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 105px">
        <el-col :span="11">
          <div class="grid-content bg-purple">
            1v1收到的礼物: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{f.matchingIncome ? f.matchingIncome : 0 }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple"> 用户聊天收到的礼物:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{f.chatIncome ? f.chatIncome : 0}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 105px">
        <el-col :span="11">
          <div class="grid-content bg-purple">
            个人中心收到的礼物: &nbsp;&nbsp;&nbsp;&nbsp; {{f.perCenIncome ? f.perCenIncome : 0 }}
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px;">
        <el-col :span="2">
          <div class="grid-content bg-purple" style="font-weight: bold">支出：</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">F币转钻石:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{f.ftodiamond ? '-' + f.ftodiamond : 0 }}</div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">提现：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{f.withdrawto ? '-' + f.withdrawto : 0 }}</div>
        </el-col>
      </el-row>
    </div>
    <br>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
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
          <el-table-column prop="giveId" label="ID" sortable="custom" width="60"></el-table-column>
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
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getUserGiveAwayLogList,
  getUserFBAuditDetail
} from '../../../api/user/giveaway-log';
export default {
  name: 'user-giveaway-log-dialog',
  data() {
    return {
      show: false,
      nickname: '',
      activeTabName: '1',
      loading: {
        table: true
      },
      tableData: [],
      f: {
        fbalance: null,
        liveIncome: null,
        videoiIcome: null,
        matchingIncome: null,
        chatIncome: null,
        ftodiamond: null,
        withdrawto: null,
        perCenIncome: null
      },
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
    showDialog(row) {
      this.queryModel.userId = row.userId;
      this.nickname = row.nickName;
      this.show = true;
      this.query();
    },
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
      let userId = this.queryModel.userId;
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
      getUserFBAuditDetail(userId).then(({ data }) => {
        this.f.fbalance = data.detail.fbalance;
        this.f.liveIncome = data.detail.liveIncome;
        this.f.videoiIcome = data.detail.videoiIcome;
        this.f.matchingIncome = data.detail.matchingIncome;
        this.f.chatIncome = data.detail.chatIncome;
        this.f.ftodiamond = data.detail.ftodiamond;
        this.f.withdrawto = data.detail.withdrawto;
        this.f.perCenIncome = data.detail.perCenIncome;
      });
    },
    onClose() {
      this.queryModel.userId = null;
      this.nickname = '';
      this.activeTabName = '1';
    }
  },
  created() {}
};
</script>

<style scoped>
.give-change {
  border: 1px solid #dddddddd;
  height: 250px;
}
</style>
