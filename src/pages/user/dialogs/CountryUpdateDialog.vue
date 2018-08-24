<template>
  <el-dialog title="请选择国家" width="400px" :visible.sync="show" :close-on-click-modal="false">
    <el-select v-model="coding" placeholder="请选择国家" filterable>
      <el-option v-for="(item, index) in countryList" :key="index" :value="item.coding" :label="item.countryName"></el-option>
    </el-select>
    <span slot="footer">
      <el-button @click="show = false" size="small">取消</el-button>
      <el-button type="primary" @click="doUpdate" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateUserCountry } from '../../../api/user/user-info';

export default {
  name: 'country-update-dialog',
  data() {
    return {
      show: false,
      uesrId: null,
      coding: null,
      btnLoading: false
    };
  },
  props: {
    countryList: {
      type: Array,
      required: true
    }
  },
  methods: {
    showDialog(row) {
      this.userId = row.userId;
      this.coding = null;
      if (row.country !== 'CN') {
        this.coding = row.country;
      }
      this.show = true;
    },
    doUpdate() {
      if (this.coding === null) {
        this.$message.warning('请选择一个国家');
        return;
      }
      this.btnLoading = true;
      updateUserCountry(this.userId, {
        coding: this.coding
      })
        .then(resp => {
          this.$message.success('修改国家信息成功');
          this.btnLoading = false;
          this.$emit('done');
          this.show = false;
        })
        .catch(error => {
          this.btnLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.player-wrapper {
  min-width: 500px;
  min-height: 400px;
  display: block;
  margin: auto auto;
}
</style>
