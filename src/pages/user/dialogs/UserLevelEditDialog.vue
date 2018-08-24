<template>
  <el-dialog :visible.sync="show" title="修改等级信息" width="800px" :close-on-click-modal="false">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="editForm">
        <el-form-item label="当前等级" prop="levelId">
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
          <!-- 等级为1的魅力值最小值必须为0 -->
          <el-input-number v-model="model.minCharmValues" :disabled="prevLevel === null" :min="prevLevel === null ? 0 : prevLevel.minCharmValues" :step="1" :max="nextLevel === null ? 99999999 : nextLevel.maxCharmValues"></el-input-number>
          <span>(包含) - </span>
          <el-input-number v-model="model.maxCharmValues" :min="model.minCharmValues" :step="1" :max="nextLevel === null ? 99999999 : nextLevel.maxCharmValues"></el-input-number>
          <span>(不包含)</span>
        </el-form-item>
        <el-form-item label="" prop="">
          <span>修改当前等级的魅力值区间也将影响上个等级(如果有)和下个等级(如果有)的魅力值区间, 请谨慎操作</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getUserLevelDetail,
  updateUserLevel
} from '../../../api/user/user-level';

export default {
  name: 'user-level-edit-dialog',
  data() {
    return {
      show: false,
      loading: true,
      prevLevel: null,
      nextLevel: null,
      original: {
        levelId: null,
        names: null,
        memo: null,
        minCharmValues: null,
        maxCharmValues: null
      },
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
    showDialog(msg) {
      this.loading = true;
      this.show = true;
      this.getDetailForEdit(msg);
    },
    getDetailForEdit(msg) {
      Promise.all([
        getUserLevelDetail(msg.levelId - 1),
        getUserLevelDetail(msg.levelId),
        getUserLevelDetail(msg.levelId + 1)
      ])
        .then(values => {
          this.prevLevel = values[0].data.detail;
          this.model = values[1].data.detail;
          this.original.minCharmValues = values[1].data.detail.minCharmValues;
          this.original.maxCharmValues = values[1].data.detail.maxCharmValues;
          this.nextLevel = values[2].data.detail;
          this.loading = false;
        })
        .catch(() => {
          this.$message.error('无法获取等级详情');
        });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const h = this.$createElement;

          // 魅力值修改提示
          const tips = [];
          // 上个等级
          if (
            this.prevLevel !== null &&
            this.model.minCharmValues !== this.original.minCharmValues
          ) {
            const prevLevelTip = `等级: ${
              this.prevLevel.levelId
            }, 魅力值区间: ${this.prevLevel.minCharmValues}(包含) - ${
              this.model.minCharmValues
            }(不包含)`;

            tips.push(prevLevelTip);
          }

          // 当前等级
          if (
            this.model.minCharmValues !== this.original.minCharmValues ||
            this.model.maxCharmValues !== this.original.maxCharmValues
          ) {
            const currentLevelTip = `等级: ${this.model.levelId}, 魅力值区间: ${
              this.model.minCharmValues
            }(包含) - ${this.model.maxCharmValues}(不包含)`;

            tips.push(currentLevelTip);
          }

          // 下个等级
          if (
            this.nextLevel !== null &&
            this.model.maxCharmValues !== this.original.maxCharmValues
          ) {
            const nextLevelTip = `等级: ${
              this.nextLevel.levelId
            }, 魅力值区间: ${this.model.maxCharmValues}(包含) - ${
              this.nextLevel.maxCharmValues
            }(不包含)`;

            tips.push(nextLevelTip);
          }

          console.log(tips);

          // 魅力值修改确认
          if (tips && tips.length > 0) {
            this.$confirm(
              h('div', null, [
                h(
                  'p',
                  null,
                  '由于你修改了当前等级信息的魅力值区间, 请再次确认以下信息:'
                ),
                tips.map(tip =>
                  h(
                    'span',
                    {
                      style: {
                        display: 'block',
                        'font-weight': 'bold',
                        color: 'brown',
                        'line-height': '2em',
                        padding: '1em'
                      }
                    },
                    tip
                  )
                ),
                h('p', null, '是否确认修改?')
              ]),
              '魅力值区间修改确认',
              {
                type: 'warning'
              }
            )
              .then(() => {
                this.loading = true;
                updateUserLevel(this.model)
                  .then(data => {
                    this.$message.success('操作成功');
                    this.loading = false;
                    this.show = false;
                    this.$emit('done');
                  })
                  .catch(error => {});
              })
              .catch(() => {});
          } else {
            // 没有修改魅力值区间, 直接调用接口
            this.loading = true;
            updateUserLevel(this.model)
              .then(data => {
                this.$message.success('操作成功');
                this.loading = false;
                this.show = false;
                this.$emit('done');
              })
              .catch(error => {});
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
