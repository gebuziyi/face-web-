<template>
  <el-table :data="orders" style="width: 100%">
    <el-table-column prop="orderNo" label="订单号">
    </el-table-column>
    <el-table-column prop="nickName" label="用户昵称">
    </el-table-column>
    <el-table-column prop="diamond" label="钻石数量">
    </el-table-column>
    <el-table-column prop="payName" label="充值方式">
    </el-table-column>
    <el-table-column prop="createTime" label="充值时间">
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
