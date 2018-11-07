<template>
  <el-dialog title="提现申请审核失败" width="1200" :visible.sync="show" :before-close="beforeDialogClose">
    <el-form :model="model" :rules="rules" size="small" ref="denyForm">
      <el-form-item label="审核失败原因" prop="reasonKey">
        <el-select v-model="model.reasonKey" @change="onReasonKeyChange">
          <template v-for="item in reasones">
            <el-option :key="item.key" :label="item.cnContent" :value="item.key"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="审核失败原因" v-show="model.reasonKey === denyReasonKeyOther" prop="adminReason">
        <el-input v-model="model.adminReason" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doCheckDeny" size="small" :loading="loading.btn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  WITHDRAW_CHECK_DENY_REASONES,
  DENY_REASON_KEY_OTHER
} from '../../../utils/constants';
import { denyApplication } from '../../../api/withdraw/withdraw-application';

export default {
  name: 'check-deny-dialog',

  data() {
    return {
      denyReasonKeyOther: DENY_REASON_KEY_OTHER,
      show: false,
      loading: {
        btn: false
      },
      reasones: WITHDRAW_CHECK_DENY_REASONES,
      row: null,
      model: {
        reasonKey: null,
        adminReason: null
      },
      rules: {
        reasonKey: [
          {
            required: true,
            trigger: 'change',
            message: '请选择审核失败原因'
          }
        ]
      }
    };
  },

  methods: {
    onReasonKeyChange(reasonKey) {
      if (reasonKey === this.denyReasonKeyOther) {
        this.model.adminReason = null;
      }
    },

    showDialog(row) {
      this.model.reasonKey = null;
      this.model.adminReason = null;
      this.row = row;
      this.show = true;
    },

    doCheckDeny() {
      this.$refs.denyForm.validate(valid => {
        if (valid !== true) {
          return;
        }

        if (
          this.model.reasonKey === DENY_REASON_KEY_OTHER &&
          (this.model.adminReason === null ||
            typeof this.model.adminReason === 'undefined' ||
            this.model.adminReason.trim() === '')
        ) {
          this.$message.error('请输入审核失败的原因');
          return;
        }

        if (this.model.reasonKey !== DENY_REASON_KEY_OTHER) {
          let result = this.reasones.find(
            item => item.key === this.model.reasonKey
          );
          this.model.adminReason = result.enContent;
        }

        this.showCheckDenyConfirm();
      });
    },

    showCheckDenyConfirm() {
      this.$confirm(
        `确定以原因 ${this.model.adminReason} 拒绝该提现申请? (拒绝后, 系统将发送提现失败通知给用户, 扣除的F币也将一并返还)`,
        '拒绝提现申请',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let msg = {
            aid: this.row.aid,
            reason: this.model.adminReason
          };

          denyApplication(msg)
            .then(resp => {
              this.$message.success('已拒绝');
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        })
        .catch(() => {});
    },

    beforeDialogClose(done) {
      this.model.reasonKey = null;
      this.model.adminReason = null;
      done();
    }
  }
};
</script>

<style>
</style>
