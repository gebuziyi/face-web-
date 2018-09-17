<template>
  <el-dialog title="新增推荐用户" width="1200px" :visible.sync="show" :close-on-click-modal="false" @close="onClose">
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="findUserForRecommend" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
    </div>
    <el-form :model="recommendTypeModel" size="small" ref="recommend-type-form" :rules="typeFormRules">
      <el-form-item prop="typeId" label="推荐类型">
        <el-select v-model="recommendTypeModel.typeId" placeholder="请选择推荐类型" @change="onTypeChange">
          <el-option v-for="(item, index) in types" :key="index" :value="item.typeId" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" size="mini" @click="doRecommend(scope.row)" v-if="hasPermission('user:recommend:save')">
              推荐TA
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getrecommendDetail } from '../../../api/user/user-info';
import { createUserRecommend } from '../../../api/user/user-recommend';
import { getAllForComboBox } from '../../../api/user/user-recommend-type';

export default {
  name: 'user-recommend-create-dialog',
  data() {
    return {
      show: false,
      loading: {
        table: false
      },
      tableData: [],
      queryModel: {
        userId: null
      },
      recommendTypeModel: {
        typeId: null
      },
      types: [],
      typeFormRules: {
        typeId: [
          {
            required: true,
            trigger: 'blur change',
            message: '请选择一个推荐类型'
          }
        ]
      },
      selectedTypeName: ''
    };
  },
  methods: {
    onTypeChange(val) {
      if (val) {
        this.selectedTypeName = this.types.filter(item => item.typeId === val)[0].name;
      }
    },

    findUserForRecommend() {
      if (this.queryModel.userId === null) {
        return;
      }
      this.loading.table = true;
      getrecommendDetail(this.queryModel.userId)
        .then(({ data }) => {
          this.tableData = [].concat(data.detail);
          this.loading.table = false;
        })
        .catch(error => {
          this.$message.error('用户已经被推荐');
        });
    },
    doRecommend(row) {
      this.$refs['recommend-type-form'].validate(valid => {
        if (!valid) {
          return;
        }
        this.$confirm(
          `确定将用户: ${row.nickname} 推荐到 ${this.selectedTypeName} 下?`,
          '添加推荐用户'
        )
          .then(() => {
            this.loading.table = true;
            createUserRecommend({
              userId: row.userId,
              typeId: this.recommendTypeModel.typeId
            })
              .then(({ data }) => {
                this.$message.success('推荐成功');
                this.queryModel.userId = null;
                this.tableData = [];
                this.loading.table = false;
                this.$emit('done');
              })
              .catch(msg => {
                this.loading.table = false;
              });
          })
          .catch(() => {
            // 用户点击了取消, do nothing
          });
      });
    },
    showDialog() {
      this.show = true;
    },
    onClose() {
      this.userId = null;
      this.tableData = [];
      this.recommendTypeModel.typeId = null;
    },
    initRecommendTypeComboBox() {
      getAllForComboBox()
        .then(({ data }) => {
          this.types = data.list;
        })
        .catch(error => {
          this.$message.error('无法获取推荐类型列表');
        });
    }
  },
  created() {
    this.userId = null;
    this.tableData = [];
    this.initRecommendTypeComboBox();
  }
};
</script>

<style scoped>
.user-avatar {
  width: 60px;
  height: 60px;
}
</style>
