<template>
  <el-dialog title="指定用户发送通知" width="1200px" :visible.sync="show" :close-on-click-modal="false" @close="closeDialogs">
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model.trim="queryModel.nickname" placeholder="用户昵称"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="findUser" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="nickName" label="用户昵称"></el-table-column>
      <el-table-column prop="img" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.img" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" size="mini" @click="addAppointUser(scope.row)" v-if="hasPermission('user:recommend:save')">
              添加
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table><br>
    <h3>被选用户列表</h3>
    <el-row style="padding: 15px;">
      <el-button class="btn-operation" type="danger" size="mini" @click="removeAppointUserBatch" :disabled="isdisableds">
        清空列表
      </el-button>
    </el-row>
    <br>
    <div style=" overflow:scroll; width:1175px; height:250px;">
      <el-table :data="addUsersTable" border style="width: 100%" v-loading="loading.table">
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="img" label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.img" class="user-avatar">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope" >
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('video:info:delete')">
              <el-button type="danger" size="mini" @click="removeAppointUser(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div><br>
    <h4>回复</h4>
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
        <el-form-item label="回复内容" prop="text">
          <el-input v-model.trim="model.text" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    <span slot="footer">
      <el-button @click="closeDialogs" size="small">关闭</el-button>
      <el-button type="primary" @click="doReply" size="small" :loading="btnLoading">发送</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserInfoDetailByIdOrName } from '../../../api/user/user-info';
import { replyMsg } from '../../../api/assistant/assistant-ChatMsg';

export default {
  name: 'user-recommend-create-dialog',

  components: {
  },

  data() {
    return {
      isdisabled: false,
      show: false,
      loading: {
        table: false
      },
      tableData: [],
      addUsersTable: [],
      toAccounts: [],
      model: {
        text: null
      },
      rules: {
        text: [
          { required: true, trigger: 'change', message: '回复内容不能为空' }
        ]
      },
      btnLoading: false,
      queryModel: {
        userId: null,
        nickname: null
      },
      recommendTypeModel: {
        typeId: null
      },
      types: [],
      selectedTypeName: ''
    };
  },
  computed: {
    isdisableds() {
      let users = this.addUsersTable;
      return users.length === 0;
    }
  },
  methods: {
    removeAppointUserBatch() {
      this.$confirm(
        `此操作将清除已选择的用户, 是否继续?`,
        '清除已选用户',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.addUsersTable = []
          this.toAccounts = []
          this.$message.success('清除成功');
        })
        .catch(() => {});
    },
    doReply() {
      let users = this.addUsersTable;
      if (users === null || users === [] || users.length === 0) {
        this.$message.error('请选择发送用户');
        return;
      }
      this.$refs.theForm.validate(valid => {
        if (valid) {
          let msg = {
            fromAccount: null,
            toAccounts: this.toAccounts,
            text: this.model.text
          }
          replyMsg(msg)
            .then(resp => {
              this.$refs.theForm.resetFields();
              this.$message.success('发送成功');
            })
            .catch(err => {})
        } else {
          return false;
        }
      });
    },
    closeDialogs() {
      this.show = false
      this.addUsersTable = []
      this.toAccounts = []
      this.tableData = []
      this.queryModel.userId = null
      this.queryModel.nickname = null
      this.model.text = null
    },
    onTypeChange(val) {
      if (val) {
        this.selectedTypeName = this.types.filter(item => item.typeId === val)[0].name;
      }
    },

    findUser() {
      if (this.queryModel.userId === null && this.queryModel.nickname === null) {
        return;
      }
      this.loading.table = true;
      getUserInfoDetailByIdOrName({
        queryModel: this.queryModel
      })
        .then(({ data }) => {
          this.tableData = [].concat(data.detail);
          this.loading.table = false;
        })
        .catch(error => {
          this.$message.error('请检查输入的用户ID或者用户名是否正确');
        });
    },
    addAppointUser(row) {
      let userTables = this.addUsersTable;
      let accounts = this.toAccounts;
      for (var i = 0; i < userTables.length; i++) {
        if (userTables[i].userId === row.userId) {
          return;
        }
      }
      userTables.push(row);
      accounts.push(row.userId);
    },
    removeAppointUser(row) {
      this.$confirm(
        `此操作将移除已选择的用户, 是否继续?`,
        '移除已选用户',
        {
          type: 'warning'
        }
      )
        .then(() => {
          let userTables = this.addUsersTable;
          let accountsIs = this.toAccounts;
          for (var i = 0; i < userTables.length; i++) {
            if (userTables[i].userId === row.userId) {
              userTables.splice(i, 1)
            }
          }
          for (var v = 0; v < accountsIs.length; v++) {
            if (accountsIs[v] === row.userId) {
              accountsIs.splice(v, 1)
            }
          }
          this.$message.success('清除成功');
        })
        .catch(() => {});
    },
    showDialog() {
      this.show = true;
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
