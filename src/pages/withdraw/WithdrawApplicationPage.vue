<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="withdrawId">
        <el-select v-model="queryModel.withdrawId" placeholder="提现规格" clearable>
          <el-option v-for="(item, index) in withdrawNormList" :key="index" :value="item.withdrawId" :label="item | norm2OptionLabel">
            <span style="float: left">{{ item.f }} F </span>
            <span style="float: right">
              <span>{{ item.price }}</span>
              <span v-if="item.currency === 0">
                人民币
              </span>
              <span v-else>美元</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="queryModel.payType" placeholder="收款类型" clearable>
          <el-option v-for="(item, index) in payTypeList" :key="index" :value="item.payTypeId" :label="item.payTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="check">
        <el-select v-model="queryModel.check" placeholder="审核状态" clearable>
          <el-option :value="0" label="审核未通过"></el-option>
          <el-option :value="1" label="审核通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryModel.status" placeholder="提现状态" clearable>
          <el-option v-for="(item, index) in withdrawStatusList" :key="index" :value="item.status" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="aid" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="price" label="提现金额"></el-table-column>
      <el-table-column prop="currency" label="币种">
        <template slot-scope="scope">
          <span v-if="scope.row.currency === 0">人民币</span>
          <span v-if="scope.row.currency === 1">美元</span>
        </template>
      </el-table-column>
      <el-table-column prop="f" label="扣除的F币"></el-table-column>
      <el-table-column prop="account" label="收款账户" width="200"></el-table-column>
      <el-table-column prop="payTypeName" label="收款类型"></el-table-column>
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column prop="checkManUsername" label="审核人"></el-table-column>
      <el-table-column prop="checkTime" label="审核时间"></el-table-column>
      <el-table-column prop="check" label="审核状态">
        <template slot-scope="scope">
          <template v-if="scope.row.check === 0">
            <icon-tag :type="'danger'" size="mini">审核未通过</icon-tag>
          </template>
          <template v-if="scope.row.check === 1">
            <icon-tag :type="'success'" size="mini">审核通过</icon-tag>
          </template>
          <template v-if="scope.row.check === 2">
            <icon-tag :type="'warning'" size="mini">审核中</icon-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="transferUsername" label="转账人"></el-table-column>
      <el-table-column prop="statues" label="提现状态">
        <template slot-scope="scope">
          <template v-if="scope.row.statues === 0">
            <icon-tag :type="'danger'" size="mini">提现失败</icon-tag>
          </template>
          <template v-if="scope.row.statues === 1">
            <icon-tag :type="'success'" size="mini">提现成功</icon-tag>
          </template>
          <template v-if="scope.row.statues === 2">
            <icon-tag :type="'warning'" size="mini">申请中</icon-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="申请详情" placement="top" v-if="hasPermission('withdraw:application:detail')">
              <el-button type="primary" size="mini" @click="openDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="通过" placement="top" v-if="hasPermission('withdraw:application:check') && scope.row.check === 2">
              <el-button type="success" size="mini" @click="showCheckPassConfirm(scope.row)">
                <i class="fa fa-check"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="拒绝" placement="top" v-if="hasPermission('withdraw:application:check') && scope.row.check === 2">
              <el-button type="danger" size="mini" @click="showCheckDenyConfirm(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="确认转账" placement="top" v-if="hasPermission('withdraw:application:transfer') && scope.row.check === 1 && scope.row.statues === 2">
              <el-button type="success" size="mini" @click="showTransferSuccessConfirm(scope.row)">
                <i class="fa fa-money"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="转账失败" placement="top" v-if="hasPermission('withdraw:application:transfer') && scope.row.check === 1 && scope.row.statues === 2">
              <el-button type="danger" size="mini" @click="showTransferFailedConfirm(scope.row)">
                <i class="fa fa-money"></i>
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
    <!-- 查看提现申请详情 -->
    <el-dialog :visible.sync="dialog.detail.show" title="查看提现申请详情" width="800px">
      <div v-loading="dialog.detail.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
          <el-form-item label="主键ID">
            <span class="detail-span" v-text="dialog.detail.model.aid"></span>
          </el-form-item>
          <el-form-item label="用户ID">
            <span class="detail-span" v-text="dialog.detail.model.userId"></span>
          </el-form-item>
          <el-form-item label="用户名">
            <span class="detail-span" v-text="dialog.detail.model.username"></span>
          </el-form-item>
          <el-form-item label="申请时间">
            <span class="detail-span" v-text="dialog.detail.model.createTime"></span>
          </el-form-item>
          <el-form-item label="提现金额">
            <span class="detail-span" v-text="dialog.detail.model.money"></span>
          </el-form-item>
          <el-form-item label="提现状态">
            <span class="detail-span" v-text="dialog.detail.model.statues"></span>
          </el-form-item>
          <el-form-item label="提现状态描述">
            <span class="detail-span" v-if="dialog.detail.model.statues === 0">提现失败</span>
            <span class="detail-span" v-if="dialog.detail.model.statues === 1">提现成功</span>
            <span class="detail-span" v-if="dialog.detail.model.statues === 2">申请中</span>
          </el-form-item>
          <el-form-item label="收款类型ID">
            <span class="detail-span" v-text="dialog.detail.model.payType"></span>
          </el-form-item>
          <el-form-item label="收款类型名称">
            <span class="detail-span" v-text="dialog.detail.model.payTypeName"></span>
          </el-form-item>
          <el-form-item label="转账人ID">
            <span class="detail-span" v-text="dialog.detail.model.transfer"></span>
          </el-form-item>
          <el-form-item label="转账人用户名">
            <span class="detail-span" v-text="dialog.detail.model.transferUsername"></span>
          </el-form-item>
          <el-form-item label="审核状态">
            <span class="detail-span" v-text="dialog.detail.model.check"></span>
          </el-form-item>
          <el-form-item label="审核状态描述">
            <span class="detail-span" v-text="dialog.detail.model.check === 1 ? '审核通过' : '审核未通过'"></span>
          </el-form-item>
          <el-form-item label="审核人ID">
            <span class="detail-span" v-text="dialog.detail.model.checkMan"></span>
          </el-form-item>
          <el-form-item label="审核人用户名">
            <span class="detail-span" v-text="dialog.detail.model.checkManUsername"></span>
          </el-form-item>
          <el-form-item label="审核时间">
            <span class="detail-span" v-text="dialog.detail.model.checkTime"></span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialog.detail.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWithdrawApplicationList,
  getWithdrawApplicationDetail,
  passApplication,
  denyApplication,
  transferSuccess,
  transferFailed
} from '../../api/withdraw/withdraw-application';
import { getAllPayType } from '../../api/basic-data/pay-type';
import {
  emptyWithdrawApplicationDetail,
  emptyWithdrawApplication
} from '../../utils/empty-model';
import { getAllWithdrawNorm } from '../../api/withdraw/withdraw-norm';
import { WITHDRAW_STATUS_LIST } from '../../utils/constants';

export default {
  name: 'withdraw-application-page',
  data() {
    return {
      withdrawNormList: [],
      payTypeList: [],
      withdrawStatusList: WITHDRAW_STATUS_LIST,
      selectedIds: [],
      dialog: {
        rules: {
          check: [
            { required: true, trigger: 'change', message: '审核结果不能为空' }
          ],
          statues: [
            { required: true, trigger: 'change', message: '提现状态不能为空' }
          ]
        },
        edit: {
          model: emptyWithdrawApplication(),
          show: false,
          formLoading: true,
          btnLoading: false
        },
        detail: {
          model: emptyWithdrawApplicationDetail(),
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
        withdrawId: null,
        userId: null,
        check: null,
        status: null,
        payType: null,
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
  filters: {
    norm2OptionLabel: (norm) => {
      return `${norm.f} F  -->  ${norm.price} ${norm.currency === 0 ? '人民币' : norm.currency === 1 ? '美元' : '未知币种'}`
    }
  },
  methods: {
    showTransferSuccessConfirm(row) {
      this.$confirm(
        `转账成功? (一旦确认, 系统将发送提现成功通知给用户, 请确认钱款已经到达用户的提现账户之后再进行此操作)`,
        '确认转账',
        {
          type: 'warning'
        }
      )
        .then(() => {
          transferSuccess(row.aid)
            .then(resp => {
              this.$message.success('提现状态: 提现成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showTransferFailedConfirm(row) {
      this.$confirm(
        `转账失败? (一旦确认, 系统将发送提现失败通知给用户, 已扣除的F币也将一并返还)`,
        '转账失败',
        {
          type: 'warning'
        }
      )
        .then(() => {
          transferFailed(row.aid)
            .then(resp => {
              this.$message.success('提现状态: 提现失败');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showCheckPassConfirm(row) {
      this.$confirm(
        `确定通过该提现申请? (一旦通过, 财务人员即可进行转账操作)`,
        '通过提现申请',
        {
          type: 'warning'
        }
      )
        .then(() => {
          passApplication(row.aid)
            .then(resp => {
              this.$message.success('已通过');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showCheckDenyConfirm(row) {
      this.$confirm(
        `确定拒绝该提现申请? (拒绝后, 系统将发送提现失败通知给用户, 扣除的F币也将一并返还)`,
        '拒绝提现申请',
        {
          type: 'warning'
        }
      )
        .then(() => {
          denyApplication(row.aid)
            .then(resp => {
              this.$message.success('已拒绝');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    openDetailDialog(row) {
      this.dialog.detail.model = row;
      this.dialog.detail.show = true;
    },
    openEditDialog(row) {
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getWithdrawApplicationDetail(row.aid)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          // 获取详情失败, 关闭修改弹窗
          this.dialog.edit.show = false;
        });
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
      getWithdrawApplicationList({
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
    initPayTypeSelectData() {
      getAllPayType()
        .then(({ data }) => {
          this.payTypeList = data.list;
        })
        .catch(errorMsg => {});
    },
    initWithdrawNormSelectData() {
      getAllWithdrawNorm()
        .then(({ data }) => {
          this.withdrawNormList = data.list
        })
        .catch(error => {})
    }
  },
  created() {
    this.initPayTypeSelectData();
    this.initWithdrawNormSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
</style>
