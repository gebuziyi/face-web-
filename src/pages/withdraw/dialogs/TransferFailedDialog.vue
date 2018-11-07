<template>
  <el-dialog title="提现申请转账失败" width="1200" :visible.sync="show" :before-close="beforeDialogClose">
    <el-form :model="model" :rules="rules" size="small" ref="theForm">
      <el-form-item label="转账失败原因" prop="reasonKey">
        <el-select v-model="model.reasonKey" @change="onReasonKeyChange">
          <template v-for="item in reasones">
            <el-option :key="item.key" :label="item.cnContent" :value="item.key"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="转账失败原因" v-show="model.reasonKey === denyReasonKeyOther" prop="adminReason">
        <el-input v-model="model.adminReason" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doTransferFailed" size="small" :loading="loading.btn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  WITHDRAW_FAILED_REASONES,
  WITHDRAW_FAILED_REASON_KEY_OTHER
} from '../../../utils/constants';
import { transferFailed } from '../../../api/withdraw/withdraw-application';

export default {
  name: 'transfer-failed-dialog',

  data() {
    return {
      denyReasonKeyOther: WITHDRAW_FAILED_REASON_KEY_OTHER,
      show: false,
      loading: {
        btn: false
      },
      reasones: WITHDRAW_FAILED_REASONES,
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
            message: '请选择转账失败原因'
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

    doTransferFailed() {
      this.$refs.theForm.validate(valid => {
        if (valid !== true) {
          return;
        }

        if (
          this.model.reasonKey === WITHDRAW_FAILED_REASON_KEY_OTHER &&
          (this.model.adminReason === null ||
            typeof this.model.adminReason === 'undefined' ||
            this.model.adminReason.trim() === '')
        ) {
          this.$message.error('请输入转账失败的原因');
          return;
        }

        if (this.model.reasonKey !== WITHDRAW_FAILED_REASON_KEY_OTHER) {
          let result = this.reasones.find(
            item => item.key === this.model.reasonKey
          );
          this.model.adminReason = result.enContent;
        }

        this.showTransferFailedConfirm();
      });
    },

    showTransferFailedConfirm() {
      this.$confirm(
        `转账失败(原因: ${
          this.model.adminReason
        })? (一旦确认, 系统将发送提现失败通知给用户, 已扣除的F币也将一并返还)`,
        '转账失败',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let msg = {
            aid: this.row.aid,
            reason: this.model.adminReason
          };

          transferFailed(msg)
            .then(resp => {
              this.$message.success('已标记转账失败');
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
