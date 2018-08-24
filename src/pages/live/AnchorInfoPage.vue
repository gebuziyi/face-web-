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
      <el-form-item prop="country">
        <el-select v-model="queryModel.country" placeholder="国家" clearable filterable>
          <el-option v-for="(item, index) in countryList" :key="index" :value="item.coding" :label="`${item.countryName}(${item.coding})`"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sex">
        <el-select v-model="queryModel.sex" placeholder="性别" clearable>
          <el-option :value="0" label="女"></el-option>
          <el-option :value="1" label="男"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="直播收礼时间" end-placeholder="直播收礼时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="contract">
        <el-select v-model="queryModel.contract" placeholder="签约状态" clearable>
          <el-option :value="0" label="未签约"></el-option>
          <el-option :value="1" label="已签约"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="resetQueryForm">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="userId" label="用户ID" sortable="custom" width="120"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="img" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="email" label="邮箱地址"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80">
        <template slot-scope="scope">
          <template v-if="scope.row.sex === 2">
            <icon-tag :type="'warning'" :icon="'fa fa-question'">未知</icon-tag>
          </template>
          <icon-tag :type="scope.row.sex === 0 ? 'danger' : ''" :icon="scope.row.sex === 0 ? 'fa fa-venus' : 'fa fa-mars'" v-else>
            {{ scope.row.sex === 0 ? '女' : '男'}}
          </icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="homeNo" label="直播间编号" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="liveIncome" label="直播礼物收入(F币)" width="150"></el-table-column>
      <el-table-column prop="charmValues" label="魅力值" sortable="custom"></el-table-column>
      <el-table-column prop="fensiNum" label="粉丝数量" sortable="custom"></el-table-column>
      <el-table-column prop="country" label="国家" width="80"></el-table-column>
      <el-table-column prop="heatNum" label="推荐值"></el-table-column>
      <el-table-column prop="isTags" label="状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.isTags === 1 ? 'danger' : 'info'" :icon="'fa fa-microphone'">
            {{ scope.row.isTags === 1 ? '热门主播' : '普通主播'}}
          </icon-tag>
          <icon-tag v-if="scope.row.contract === true" type="danger" icon="fa fa-briefcase">
            签约主播
          </icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="推荐设置" placement="top" v-if="hasPermission('anchor:info:tags')">
              <el-button type="primary" size="mini" @click="showTagsSetDialog(scope.row)">
                <i class="fa fa-cog"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设为签约" placement="top" v-if="hasPermission('anchor:info:contract') && scope.row.contract === false">
              <el-button type="primary" size="mini" @click="setContractConfirm(scope.row)">
                <i class="fa fa-briefcase"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消签约" placement="top" v-if="hasPermission('anchor:info:contract') && scope.row.contract === true">
              <el-button type="danger" size="mini" @click="cancelContractConfirm(scope.row)">
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
    <tags-set-dialog ref="tagsSetDialog" @done="query"></tags-set-dialog>
  </div>
</template>

<script>
import {
  getAnchorInfoList,
  setAnchorContract,
  cancelAnchorContract
} from '../../api/user/anchor-info';
import { getAllCountryInfo } from '../../api/basic-data/country-info';
import AnchorTagsSetDialog from './dialogs/AnchorTagsSetDialog';

export default {
  name: 'anchor-info-page',

  components: {
    'tags-set-dialog': AnchorTagsSetDialog
  },

  data() {
    return {
      countryList: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        country: null,
        sex: null,
        regTime: null,
        isAnchor: 1,
        createTime: null,
        contract: null
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
    resetQueryForm() {
      this.$refs.queryForm.resetFields();
    },

    setContractConfirm(row) {
      this.$confirm(
        `确定要将该主播: ${row.nickname} 设置为签约主播吗?`,
        '设置签约主播',
        {
          type: 'warning'
        }
      )
        .then(() => {
          setAnchorContract(row.userId)
            .then(resp => {
              this.$message.success('设置成功');
              this.query();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    cancelContractConfirm(row) {
      this.$confirm(`确定要取消该主播: ${row.nickname} 的签约?`, '取消签约', {
        type: 'warning'
      })
        .then(() => {
          cancelAnchorContract(row.userId)
            .then(resp => {
              this.$message.success('取消成功');
              this.query();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showTagsSetDialog(row) {
      this.$refs.tagsSetDialog.showDialog(row);
    },
    onQueryBtnClick() {
      this.pager.page = 1;
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
      // 显示表格loading
      this.loading.table = true;
      getAnchorInfoList({
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
