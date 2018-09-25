<template>
  <el-dialog title="用户聊天记录详情" width="1200px" :visible.sync="show" :close-on-click-modal="false" @close="onClose">
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
            <el-button type="success" size="mini" @click="openDoChatDialog(scope.row)" v-if="hasPermission('user:recommend:save')">
              打开对话窗口
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
    </span>
    <do-chat-dialog ref="doChatDialog"></do-chat-dialog>
  </el-dialog>
</template>

<script>
import { getUserInfoDetail } from '../../../api/user/user-info';
import AssistantDoChatDialog from './AssistantDoChatDialog';

export default {
  name: 'user-recommend-create-dialog',

  components: {
    'do-chat-dialog': AssistantDoChatDialog
  },

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
      getUserInfoDetail(this.queryModel.userId)
        .then(({ data }) => {
          this.tableData = [].concat(data.detail);
          this.loading.table = false;
        })
        .catch(error => {
          this.$message.error('请检查输入的用户ID是否正确');
        });
    },
    openDoChatDialog(row) {
      this.$refs.doChatDialog.showDialog(row);
    },
    showDialog() {
      this.show = true;
    },
    onClose() {
      this.userId = null;
      this.tableData = [];
      this.recommendTypeModel.typeId = null;
    }
  },
  created() {
    this.userId = null;
    this.tableData = [];
  }
};
</script>

<style scoped>
.user-avatar {
  width: 60px;
  height: 60px;
}
</style>
