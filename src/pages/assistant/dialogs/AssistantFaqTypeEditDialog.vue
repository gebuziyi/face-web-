<template>
  <el-dialog :visible.sync="show" title="更新推送模板信息" width="800px" :close-on-click-modal="false" :before-close="beforeDialogClose">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
        <el-form-item prop="typeName" label="问题分类名称">
          <el-input v-model.trim="model.typeName"></el-input>
        </el-form-item>
        <el-form-item prop="typeUrl" label="问题分类URL">
          <el-input v-model.trim="model.typeUrl"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  updateAssistantFaqType,
  getAssistantFaqTypeDetail
} from '../../../api/assistant/assistant-FaqType';
import { emptyAssistantFaqType } from '../../../utils/empty-model';

export default {
  name: 'assistant-type-deit-dialog',
  data() {
    return {
      show: false,
      model: emptyAssistantFaqType(),
      loading: false,
      rules: {
        typeName: [
          { required: true, trigger: 'change', message: '问题类型名称不能为空' }
        ],
        typeUrl: [
          { required: true, trigger: 'change', message: '问题类型Url不能为空' }
        ]
      },
      formLoading: true,
      btnLoading: false
    };
  },

  methods: {
    showDialog(id) {
      this.show = true;
      this.formLoading = true;
      this.getDetail(id);
    },

    getDetail(id) {
      getAssistantFaqTypeDetail(id)
        .then(({ data }) => {
          this.model = data.detail;
          this.formLoading = false;
        })
        .catch(error => {
          this.sohw = false;
        });
    },

    beforeDialogClose(done) {
      this.$refs.theForm.resetFields();
      done();
    },

    doEdit() {
      this.$refs.theForm.validate(valid => {
        if (valid) {
          updateAssistantFaqType(this.model)
            .then(data => {
              this.$message.success('修改问题类型成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
