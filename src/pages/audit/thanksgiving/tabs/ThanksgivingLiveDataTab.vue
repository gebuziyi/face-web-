<template>
  <div>
    <div class="give-change">
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            参与活动的总人数: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.allJoinUserCount ? datas.allJoinUserCount : 0 }}人
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            活动期间直播送[所有礼物]总金额:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.sendAllGiftDiamonds ? datas.sendAllGiftDiamonds : 0 }}钻石
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            收到活动礼物主播的人数: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.accountGiftUserCount ? datas.accountGiftUserCount : 0 }}人
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            活动期间直播送[活动礼物]总金额:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.sendActiveGiftDiamonds ? datas.sendActiveGiftDiamonds : 0 }}钻石
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            送出活动礼物的人数: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ datas.fromGiftUserCount ? datas.fromGiftUserCount : 0 }}人
          </div>
        </el-col>
      </el-row>
    </div>
    <div><br>
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="userId">
          <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item prop="nickName">
          <el-input v-model.trim="queryModel.nickName" placeholder="用户昵称"></el-input>
        </el-form-item>
        <el-form-item prop="vest">
          <el-select v-model="queryModel.vest" clearable placeholder="用户类型">
            <template v-for="(item, index) in vestList">
              <el-option :label="item.vestName" :value="item.vestState" :key="index"></el-option>
            </template>
          </el-select>
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
        <el-tab-pane label="明星榜" name="account">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
            <el-table-column prop="userId" label="用户ID" sortable="custom"></el-table-column>
            <el-table-column prop="img" label="用户头像">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="点击查看大图" placement="top">
                  <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="sex" label="用户性别">
              <template slot-scope="scope">
                <icon-tag :type="scope.row.sex === 0 ? 'danger' : ''" :icon="scope.row.sex === 0 ? 'fa fa-venus' : scope.row.sex === 1 ? 'fa fa-mars' : 'fa fa-question-circle-o'">
                  {{ scope.row.sex === 0 ? '女' : scope.row.sex === 1 ? '男' : '未知' }}
                </icon-tag>
              </template>
            </el-table-column>
            <el-table-column prop="giftCount" label="收到的火鸡数量"></el-table-column>
            <el-table-column prop="sort" label="排名"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <!-- <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="分配进场特效" placement="top" v-if="hasPermission('app:activity:update')">
                    <el-button type="success" size="mini" @click="openAvatarAccessoryDialog(scope.row)">
                      <i class="fa fa-thumbs-up"></i>
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template> -->
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="粉丝榜" name="from">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
            <el-table-column prop="userId" label="用户ID" sortable="custom"></el-table-column>
            <el-table-column prop="img" label="用户头像">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="点击查看大图" placement="top">
                  <img :src="scope.row.img" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="用户昵称"></el-table-column>
            <el-table-column prop="sex" label="用户性别">
              <template slot-scope="scope">
                <icon-tag :type="scope.row.sex === 0 ? 'danger' : ''" :icon="scope.row.sex === 0 ? 'fa fa-venus' : scope.row.sex === 1 ? 'fa fa-mars' : 'fa fa-question-circle-o'">
                  {{ scope.row.sex === 0 ? '女' : scope.row.sex === 1 ? '男' : '未知' }}
                </icon-tag>
              </template>
            </el-table-column>
            <el-table-column prop="giftCount" label="赠送的火鸡数量"></el-table-column>
            <el-table-column prop="sort" label="排名"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <!-- <template slot-scope="scope">
                <el-button-group>
                  <el-tooltip class="item" effect="dark" content="分配进场特效" placement="top" v-if="hasPermission('app:activity:update')">
                    <el-button type="success" size="mini" @click="openAvatarAccessoryDialog(scope.row)">
                      <i class="fa fa-thumbs-up"></i>
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template> -->
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
      </el-pagination>
      <el-dialog :visible.sync="dialog.picPreview.show">
        <img :src="dialog.picPreview.picSrc" class="img-preview" />
      </el-dialog>
      <!-- <avatar-accessory ref="avatarAccessory" @done="getTableData"></avatar-accessory> -->
    </div>
  </div>
</template>
<script>
import { getLiveDatasThanksgivingDays, getThanksgivingLiveTableData } from '../../../../api/audit/thanksgiving-live-audit';
import { VEST_STATE } from '../../../../utils/constants';

export default {
  name: 'thanksgiving-live-audit',
  data() {
    return {
      // 默认活动发布页
      datas: {
        allJoinUserCount: null,
        accountGiftUserCount: null,
        fromGiftUserCount: null,
        sendAllGiftDiamonds: null,
        sendActiveGiftDiamonds: null
      },
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      activeTabName: 'account',
      loading: {
        table: true
      },
      tableData: [],
      vestList: VEST_STATE,
      queryModel: {
        userId: null,
        nickName: null,
        vest: 0,
        role: 'account'
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      }
    };
  },
  methods: {
    // openAvatarAccessoryDialog(row) {
    //   this.$refs.avatarAccessory.showDialog(null, row);
    // },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.img;
      this.dialog.picPreview.show = true;
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onTabClick(tab) {
      this.pager.page = 1;
      this.queryModel.role = tab.name;
      this.query();
    },
    onSortChange({ column, prop, order }) {
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
      getThanksgivingLiveTableData({
        query: this.queryModel,
        pager: this.pager
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    },
    getDataAudit() {
      getLiveDatasThanksgivingDays().then(({ data }) => {
        this.datas.allJoinUserCount = data.detail.allJoinUserCount;
        this.datas.accountGiftUserCount = data.detail.accountGiftUserCount;
        this.datas.fromGiftUserCount = data.detail.fromGiftUserCount;
        this.datas.sendAllGiftDiamonds = data.detail.sendAllGiftDiamonds;
        this.datas.sendActiveGiftDiamonds = data.detail.sendActiveGiftDiamonds;
      });
    }
  },
  created() {
    this.getDataAudit();
    this.getTableData();
  }
};
</script>

<style>
.give-change {
  border: 1px solid #dddddddd;
  height: 150px;
}
</style>
