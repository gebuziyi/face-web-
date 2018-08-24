<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model.trim="queryModel.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model.trim="queryModel.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="countryId">
        <el-select v-model="queryModel.countryId" placeholder="国家" clearable filterable>
          <el-option v-for="(item, index) in countryList" :key="index" :value="item.countryId" :label="`${item.countryName}(${item.coding})`"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sex">
        <el-select v-model="queryModel.sex" placeholder="性别" clearable>
          <el-option :value="0" label="女"></el-option>
          <el-option :value="1" label="男"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="regTime">
        <el-date-picker v-model="queryModel.regTime" type="datetimerange" range-separator="至" start-placeholder="注册时间" end-placeholder="注册时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item prop="statues">
        <el-select v-model="queryModel.statues" placeholder="用户状态" clearable>
          <el-option :value="0" label="已冻结"></el-option>
          <el-option :value="1" label="正常"></el-option>
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
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="userId" label="ID" sortable="custom" width="100"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="img" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="email" label="邮箱地址"></el-table-column>
      <el-table-column prop="sex" label="性别" width="65">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.sex === 0 ? 'danger' : ''" :icon="scope.row.sex === 0 ? 'fa fa-venus' : scope.row.sex === 1 ? 'fa fa-mars' : 'fa fa-question-circle-o'">
            {{ scope.row.sex === 0 ? '女' : scope.row.sex === 1 ? '男' : '未知' }}
          </icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="charmValues" label="魅力值" sortable="custom"></el-table-column>
      <el-table-column prop="fensiNum" label="粉丝数量" sortable="custom"></el-table-column>
      <el-table-column prop="country" label="国家" width="80"></el-table-column>
      <el-table-column prop="balance" label="余额" sortable="custom"></el-table-column>
      <el-table-column prop="regTime" label="注册时间" sortable="custom" width="150"></el-table-column>
      <el-table-column prop="statues" label="状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.statues === 1">正常</icon-tag>
          <icon-tag type="warning" icon="fa fa-lock" v-else>已冻结</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="更多信息" placement="top">
              <el-button type="info" size="mini" @click="openDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="收支记录" placement="top">
              <el-button type="info" size="mini" @click="openGiveAwayLogDialog(scope.row)">
                <i class="fa fa-file-text-o"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改国家" placement="top" v-if="hasPermission('user:info:country:update') && scope.row.statues === 1">
              <el-button type="warning" size="mini" @click="showCountrySelectionDialog(scope.row)">
                <i class="fa fa-flag-o"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="冻结" placement="top" v-if="hasPermission('user:info:freeze') && scope.row.statues === 1">
              <el-button type="warning" size="mini" @click="doFreezeSingle(scope.row)">
                <i class="fa fa-lock"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="解冻" placement="top" v-if="hasPermission('user:info:unfreeze') && scope.row.statues === 0">
              <el-button type="success" size="mini" @click="doUnfreezeSingle(scope.row)">
                <i class="fa fa-unlock"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('user:info:delete')">
              <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
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
    <!-- 弹窗 -->
    <!-- 查看用户更多详情 -->
    <el-dialog :visible.sync="dialog.detail.show" :title="`用户详情: ${dialog.detail.username}`" width="800px">
      <div v-loading="dialog.detail.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
          <el-form-item label="用户类型">
            <span class="detail-span">
              <icon-tag :type="dialog.detail.model.type === 1 ? 'info' : 'success'" :icon="dialog.detail.model.type === 1 ? 'fa fa-android' : 'fa fa-user'">
                {{ dialog.detail.model.type === 1 ? '机器人账号' : '真实用户'}}
              </icon-tag>
              <span></span>
            </span>
          </el-form-item>
          <el-form-item label="用户签名">
            <span class="detail-span" v-if="shouldDisplay(dialog.detail.model.signature)" v-text="dialog.detail.model.signature"></span>
          </el-form-item>
          <el-form-item label="登录时间" v-if="shouldDisplay(dialog.detail.model.attentionNum)">
            <span class="detail-span" v-text="dialog.detail.model.loginTime"></span>
          </el-form-item>
          <el-form-item label="上次登录时间" v-if="shouldDisplay(dialog.detail.model.attentionNum)">
            <span class="detail-span" v-text="dialog.detail.model.lastTime"></span>
          </el-form-item>
          <el-form-item label="二维码图片" v-if="shouldDisplay(dialog.detail.model.qrCode)">
            <span class="detail-span">
              <img :src="dialog.detail.model.qrCode" alt="二维码图片" class="qr-code-img">
            </span>
          </el-form-item>
          <el-form-item label="用户简介" v-if="shouldDisplay(dialog.detail.model.intro)">
            <span class="detail-span" v-text="dialog.detail.model.intro"></span>
          </el-form-item>
          <el-form-item label="关注数" v-if="shouldDisplay(dialog.detail.model.attentionNum)">
            <span class="detail-span" v-text="dialog.detail.model.attentionNum"></span>
          </el-form-item>
          <el-form-item label="主播编号" v-if="shouldDisplay(dialog.detail.model.anchorNo)">
            <span class="detail-span" v-text="dialog.detail.model.anchorNo"></span>
          </el-form-item>
          <el-form-item label="生日" v-if="shouldDisplay(dialog.detail.model.birthday)">
            <span class="detail-span" v-text="dialog.detail.model.birthday"></span>
          </el-form-item>
          <el-form-item label="工作" v-if="shouldDisplay(dialog.detail.model.job)">
            <span class="detail-span" v-text="dialog.detail.model.job"></span>
          </el-form-item>
          <el-form-item label="身高" v-if="shouldDisplay(dialog.detail.model.stature)">
            <span class="detail-span" v-text="dialog.detail.model.stature"></span>
          </el-form-item>
          <el-form-item label="体重" v-if="shouldDisplay(dialog.detail.model.weight)">
            <span class="detail-span" v-text="dialog.detail.model.weight"></span>
          </el-form-item>
          <el-form-item label="星座" v-if="shouldDisplay(dialog.detail.model.constellation)">
            <span class="detail-span" v-text="dialog.detail.model.constellation"></span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialog.detail.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <country-update-dialog ref="countryUpdateDialog" :countryList="countryList" @done="query"></country-update-dialog>
    <giveaway-log-dialog ref="giveAwayLogDialog"></giveaway-log-dialog>
    <freeze-dialog ref="freezeDialog" @done="query"></freeze-dialog>
  </div>
</template>

<script>
import {
  getUserInfoList,
  getUserInfoDetail,
  unfreezeUserBatch,
  deleteUserBatch
} from '../../api/user/user-info';
import { getAllCountryInfo } from '../../api/basic-data/country-info';
import { emptyUserDetail } from '../../utils/empty-model';
import CountryUpdateDialog from './dialogs/CountryUpdateDialog';
import UserGiveAwayLogDialog from './dialogs/UserGiveAwayLogDialog';
import UserFreezeDialog from './dialogs/UserFreezeDialog';

export default {
  name: 'user-info-page',
  components: {
    'country-update-dialog': CountryUpdateDialog,
    'giveaway-log-dialog': UserGiveAwayLogDialog,
    'freeze-dialog': UserFreezeDialog
  },
  data() {
    return {
      countryList: [],
      selectedIds: [],
      dialog: {
        detail: {
          model: emptyUserDetail(),
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        mobile: null,
        email: null,
        countryId: null,
        sex: null,
        regTime: null,
        statues: null
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
    openGiveAwayLogDialog(row) {
      this.$refs.giveAwayLogDialog.showDialog(row);
    },
    showCountrySelectionDialog(row) {
      this.$refs.countryUpdateDialog.showDialog(row);
    },
    shouldDisplay(field) {
      if (
        field !== null &&
        typeof field !== 'undefined' &&
        field.toString() !== ''
      ) {
        return true;
      } else {
        return false;
      }
    },
    doFreezeSingle(row) {
      this.$refs.freezeDialog.showDialog(row);
    },
    doUnfreezeSingle(row) {
      this.$confirm(
        `此操作将解冻用户: ${row.username}, 是否继续?`,
        '用户解冻',
        {
          type: 'info'
        }
      )
        .then(() => {
          unfreezeUserBatch(row.userId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    doDeleteSingle(row) {
      this.$confirm(
        `此操作将删除用户: ${row.username}, 是否继续?`,
        '用户删除',
        {
          type: 'danger'
        }
      )
        .then(() => {
          deleteUserBatch(row.userId)
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
    openDetailDialog(row) {
      this.dialog.detail.username = row.username;
      this.dialog.detail.show = true;
      this.dialog.detail.formLoading = true;
      getUserInfoDetail(row.userId)
        .then(({ data }) => {
          this.dialog.detail.model = data.detail;
          this.dialog.detail.formLoading = false;
        })
        .catch(error => {
          // 获取详情失败, 关闭详情弹窗
          this.dialog.detail.show = false;
        });
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
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
      // 显示表格loading
      this.loading.table = true;
      getUserInfoList({
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
    initCountryInfoSelectData() {
      getAllCountryInfo()
        .then(({ data }) => {
          this.countryList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initCountryInfoSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
.qr-code-img {
  display: block;
  max-width: 120px;
  max-height: 120px;
}
.user-avatar {
  width: 60px;
  height: 60px;
}
</style>
