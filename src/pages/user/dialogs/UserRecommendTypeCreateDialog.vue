<template>
  <el-dialog :visible.sync="show" title="新增用户推荐类型" width="800px" @close="onDialogClose('createForm')" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="80px" ref="createForm">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model.trim="model.name"></el-input>
        </el-form-item>
        <el-form-item label="话题介绍" prop="description">
          <el-input v-model.trim="model.description" type="textarea" placeholder="介绍一下这个推荐类型... ..."></el-input>
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
import { createUserRecommendType } from '../../../api/user/user-recommend-type';
import { emptyUserRecommendType } from '../../../utils/empty-model';

export default {
  name: 'video-topic-create-dialog',

  data() {
    return {
      rules: {
        name: [
          { required: true, trigger: 'change', message: '名称不能为空' }
        ]
      },
      show: false,
      loading: false,
      btnLoading: false,
      model: emptyUserRecommendType()
    };
  },

  methods: {
    showDialog() {
      this.show = true;
    },

    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (this.model.description && this.model.description.length > 128) {
            this.$message.error('介绍不能超过128个字符!');
            return;
          }
          createUserRecommendType(this.model)
            .then(data => {
              this.$message.success('操作成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {
              // do something
            });
        } else {
          return false;
        }
      });
    },

    onDialogClose(formRef) {
      this.$refs[formRef].resetFields();
    }
  }
};
</script>

<style scoped>
</style>
