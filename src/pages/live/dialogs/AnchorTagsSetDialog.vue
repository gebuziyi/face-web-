<template>
  <el-dialog :visible.sync="show" title="主播推荐设置" width="1200px" @close="onDialogClose" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="主播热门状态" prop="isTags">
          <el-switch style="display: block" @change="onTagsChange" v-model="model.isTags" active-color="#13ce66" inactive-color="#ff4949" active-text="热门主播" inactive-text="普通主播" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="推荐值" prop="heatNum">
          <el-input-number v-model="model.heatNum" :min="0" :step="1" :max="999999"></el-input-number>
          <span style="padding-left: 1em; color: grey;">0-999999, 数值越大越靠前</span>
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
import { updateAnchorTagSet } from '../../../api/user/anchor-info';

export default {
  name: 'anchor-tag-set-dialog',

  data() {
    return {
      rules: {
        isTags: [
          { required: true, trigger: 'change', message: '主播热门状态不能为空' }
        ],
        heatNum: [
          { required: true, trigger: 'change', message: '推荐值不能为空' },
          {
            type: 'number',
            min: 0,
            max: 999999,
            message: '推荐值有效范围:0-999999'
          }
        ]
      },
      show: false,
      loading: false,
      btnLoading: false,
      model: {
        userId: null,
        isTags: null,
        heatNum: null
      }
    };
  },

  methods: {
    onTagsChange(tags) {
      if (tags === 0) {
        // 推荐状态切换到普通主播时, 推荐值设为0
        this.model.heatNum = 0;
      }
    },
    showDialog(row) {
      this.model.userId = row.userId;
      this.model.isTags = row.isTags;
      this.model.heatNum = row.heatNum;
      this.show = true;
    },

    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateAnchorTagSet(this.model)
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

    onDialogClose() {
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    }
  }
};
</script>

<style scoped>
</style>
