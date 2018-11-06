<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="orderNo">
        <el-input v-model.trim="queryModel.orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="会员用户名"></el-input>
      </el-form-item>
      <el-form-item prop="priceStart">
        <el-input v-model="queryModel.priceStart" placeholder="起始价格(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="priceEnd">
        <el-input v-model="queryModel.priceEnd" placeholder="终止价格(含)" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="支付类型" clearable>
          <el-option v-for="(item, index) in payTypeList" :key="index" :value="item.payTypeId" :label="item.payTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="rechargeId">
        <el-select v-model="queryModel.rechargeId" placeholder="充值规格" clearable>
          <el-option v-for="(item, index) in rechargeNormList" :key="index" :value="item.rechargeId" :label="item.sign"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryModel.status" placeholder="订单状态" clearable>
          <el-option v-for="(item, index) in orderStatusList" :key="index" :value="item.status" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
    <div class="recharge-total">
      <h3 style="padding: 8px"> 充值总金额：</h3><br>
      <h4 style="padding: 10px"> 人民币：￥{{totalRmb ? totalRmb : 0 }} &nbsp;&nbsp;美元：${{totalUsd ? totalUsd : 0 }}</h4>
    </div><br>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="orderId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
      <el-table-column prop="payTypeName" label="支付类型"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="price" label="订单价格" sortable="custom"></el-table-column>
      <el-table-column prop="rechargeNormSign" label="充值规格"></el-table-column>
      <el-table-column prop="statusDescription" label="订单状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.statusDescription.indexOf('成功') !== -1 ? 'success' : 'danger'" size="mini">{{ scope.row.statusDescription }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="订单详情" placement="top" v-if="hasPermission('recharge:order:detail')">
              <el-button type="primary" size="mini" @click="openDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改状态" placement="top" v-if="hasPermission('recharge:order:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
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
    <!-- 弹窗 -->
    <!-- 修改订单状态 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改订单状态" width="800px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="订单号">
            <span class="detail-span" v-text="dialog.edit.model.orderNo"></span>
          </el-form-item>
          <!-- 只能修改支付状态或者订单状态 -->
          <el-form-item label="订单状态">
            <el-select v-model="dialog.edit.model.statues">
              <el-option v-for="(item, index) in orderStatusList" :key="index" :value="item.status" :label="item.description"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="dialog.edit.remark" placeholder="输入修改原因及备注信息... ..." type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看订单详情 -->
    <el-dialog :visible.sync="dialog.detail.show" title="查看订单详情" width="800px">
      <div v-loading="dialog.detail.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
          <el-form-item label="主键ID">
            <span class="detail-span" v-text="dialog.detail.model.orderId"></span>
          </el-form-item>
          <el-form-item label="订单号">
            <span class="detail-span" v-text="dialog.detail.model.orderNo"></span>
          </el-form-item>
          <el-form-item label="支付类型ID">
            <span class="detail-span" v-text="dialog.detail.model.typeId"></span>
          </el-form-item>
          <el-form-item label="支付类型名称">
            <span class="detail-span" v-text="dialog.detail.model.payTypeName"></span>
          </el-form-item>
          <el-form-item label="充值规格ID">
            <span class="detail-span" v-text="dialog.detail.model.rechargeId"></span>
          </el-form-item>
          <el-form-item label="充值规格名称">
            <span class="detail-span" v-text="dialog.detail.model.rechargeNormSign"></span>
          </el-form-item>
          <el-form-item label="充值用户ID">
            <span class="detail-span" v-text="dialog.detail.model.userId"></span>
          </el-form-item>
          <el-form-item label="充值用户用户名">
            <span class="detail-span" v-text="dialog.detail.model.username"></span>
          </el-form-item>
          <el-form-item label="订单价格">
            <span class="detail-span" v-text="dialog.detail.model.price"></span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span class="detail-span" v-text="dialog.detail.model.statues"></span>
          </el-form-item>
          <el-form-item label="订单状态描述">
            <span class="detail-span" v-text="dialog.detail.model.statusDescription"></span>
          </el-form-item>
          <el-form-item label="订单创建时间">
            <span class="detail-span" v-text="dialog.detail.model.createTime"></span>
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
  getRechargeOrderList,
  getRechargeTotalMoney,
  getRechargeOrderDetail,
  updateRechargeOrder,
  getAllOrderStatus
} from '../../api/recharge/recharge-order';
import { getAllRechargeNorm } from '../../api/recharge/recharge-norm';
import { getAllPayType } from '../../api/basic-data/pay-type';
import {
  emptyRechargeOrderDetail,
  emptyRechargeOrder
} from '../../utils/empty-model';

export default {
  name: 'recharge-order-page',
  data() {
    return {
      payTypeList: [],
      orderStatusList: [],
      payStatusList: [],
      rechargeNormList: [],
      selectedIds: [],
      dialog: {
        rules: {
          statues: [
            { required: true, trigger: 'change', message: '订单状态不能为空' }
          ]
        },
        edit: {
          model: emptyRechargeOrder(),
          remark: '',
          show: false,
          formLoading: true,
          btnLoading: false
        },
        detail: {
          model: emptyRechargeOrderDetail(),
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      loading: {
        table: true
      },
      totalRmb: null,
      totalUsd: null,
      tableData: [],
      queryModel: {
        userId: null,
        nickname: null,
        username: null,
        orderNo: null,
        typeId: null,
        rechargeId: null,
        status: null,
        priceStart: null,
        priceEnd: null,
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
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    openDetailDialog(row) {
      this.dialog.detail.model = row;
      this.dialog.detail.show = true;
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let msg = {
            entity: this.dialog.edit.model,
            remark: this.dialog.edit.remark
          };
          updateRechargeOrder(msg)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.edit.btnLoading = false;
              this.dialog.edit.show = false;
              this.getTableData();
            })
            .catch(error => {
              // do something
            });
        } else {
          return false;
        }
      });
    },
    openEditDialog(row) {
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getRechargeOrderDetail(row.orderId)
        .then(({ data }) => {
          this.dialog.edit.model = data.order;
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
      getRechargeOrderList({
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
      getRechargeTotalMoney({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.totalRmb = data.detail.totalRmb;
          this.totalUsd = data.detail.totalUsd;
        })
        .catch(error => {});
    },
    initOrderStatusSelectData() {
      getAllOrderStatus()
        .then(({ data }) => {
          this.orderStatusList = data.list;
        })
        .catch(errorMsg => {});
    },
    initRechargeNormSelectData() {
      getAllRechargeNorm()
        .then(({ data }) => {
          this.rechargeNormList = data.list;
        })
        .catch(errorMsg => {});
    },
    initPayTypeSelectData() {
      getAllPayType()
        .then(({ data }) => {
          this.payTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initOrderStatusSelectData();
    this.initRechargeNormSelectData();
    this.initPayTypeSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
.recharge-total {
  border: 1px solid #dddddddd;
  height: 100px;
}
</style>
