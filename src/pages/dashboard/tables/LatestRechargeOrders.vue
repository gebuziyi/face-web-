<template>
  <el-table :data="orders" style="width: 100%; text-align:center; vertical-align:middle;">
    <el-table-column prop="orderNo" label="订单号" align='center'>
    </el-table-column>
    <el-table-column prop="userId" label="用户ID" align='center'>
    </el-table-column>
    <el-table-column prop="nickName" label="用户昵称" align='center'>
    </el-table-column>
    <el-table-column prop="diamond" label="钻石数量" align='center'>
    </el-table-column>
    <el-table-column prop="payName" label="充值方式" align='center'>
    </el-table-column>
    <el-table-column prop="createTime" label="充值时间" align='center'>
    </el-table-column>
  </el-table>
</template>

<script>
import { getNewRechargeOrderInTop10 } from '../../../api/dashboard/dashboard';

export default {
  name: 'latest-recharge-orders',

  data() {
    return {
      orders: []
    };
  },

  methods: {
    getTableData() {
      getNewRechargeOrderInTop10()
        .then(({ data }) => {
          this.orders = data.orders;
        })
        .catch(err => {});
    }
  },

  created() {
    this.getTableData();
  }
};
</script>
