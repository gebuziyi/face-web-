<template>
  <el-dialog :visible.sync="show" title="新增问题分类信息" width="800px" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model.trim="model.typeName"></el-input>
        </el-form-item>
        <el-form-item label="分类url" prop="typeUrl">
          <el-input v-model.trim="model.typeUrl"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doCreate" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  createAssiatantFaqType
} from '../../../api/assistant/assistant-FaqType';
import { emptyAssistantFaqType } from '../../../utils/empty-model';

export default {
  name: 'assistan-type-create-dialog',

  data() {
    return {
      show: false,
      model: emptyAssistantFaqType(),
      loading: false,
      rules: {
        typeName: [
          { required: true, trigger: 'change', message: '类型名称不能为空' }
        ],
        typeUrl: [
          { required: true, trigger: 'change', message: '类型URL不能为空' }
        ]
      },
      formLoading: true,
      btnLoading: false
    };
  },
  props: {},

  methods: {
    showDialog() {
      this.show = true;
    },

    doCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createAssiatantFaqType(this.model)
            .then(data => {
              this.$message.success('创建问题类型成功');
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
