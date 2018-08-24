<template>
  <el-dialog :visible.sync="show" title="创建等级信息" width="800px" :close-on-click-modal="false" :close="resetForm">
    <div v-loading="loading" class="form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="等级" prop="levelId">
          <!-- 展示用, 不可修改 -->
          <span>{{ model.levelId }}</span>
        </el-form-item>
        <el-form-item label="等级名称" prop="names">
          <el-input v-model.trim="model.names"></el-input>
        </el-form-item>
        <el-form-item label="等级说明" prop="memo">
          <el-input v-model.trim="model.memo"></el-input>
        </el-form-item>
        <el-form-item label="魅力值区间" prop="minCharmValues">
          <el-input-number v-model="model.minCharmValues" disabled></el-input-number>
          <span>(包含) - </span>
          <el-input-number v-model="model.maxCharmValues" :min="model.minCharmValues" :step="1" :max="99999999"></el-input-number>
          <span>(不包含)</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doCreate" size="small" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getUserLevelDetail,
  createUserLevel
} from '../../../api/user/user-level';

export default {
  name: 'user-level-create-dialog',
  data() {
    return {
      show: false,
      loading: true,
      prevLevel: null,
      model: {
        levelId: null,
        names: null,
        memo: null,
        minCharmValues: null,
        maxCharmValues: null
      },
      rules: {
        names: [
          {
            required: true,
            trigger: 'change blur',
            message: '等级名称不能为空'
          }
        ],
        minCharmValues: [
          {
            required: true,
            trigger: 'change blur',
            message: '魅力值区间不合法'
          }
        ],
        maxCharmValues: [
          {
            required: true,
            trigger: 'change blur',
            message: '魅力值区间不合法'
          }
        ]
      }
    };
  },
  methods: {
    showDialog(newLevelId) {
      this.loading = true;
      this.show = true;
      // 初始化model值
      this.model.levelId = newLevelId;
      this.model.names = null;
      this.model.memo = null;
      this.model.minCharmValues = null;
      this.model.maxCharmValues = null;

      this.getPrevLevel(newLevelId);
    },
    getPrevLevel(newLevelId) {
      // 获取上个等级的信息, 来决定当前等级魅力值的最小值
      getUserLevelDetail(newLevelId - 1)
        .then(({ data }) => {
          this.prevLevel = data.detail;
          if (this.prevLevel === null) {
            this.model.minCharmValues = 0;
          } else {
            this.model.minCharmValues = this.prevLevel.maxCharmValues;
            this.model.maxCharmValues = this.model.minCharmValues + 1000;
          }
          this.loading = false;
        })
        .catch(error => {});
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.loading = true;
          createUserLevel(this.model)
            .then(data => {
              this.$message.success('创建成功');
              this.loading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.createForm.resetFields();
    }
  }
};
</script>
