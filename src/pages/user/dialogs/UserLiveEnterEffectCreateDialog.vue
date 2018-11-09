<template>
  <el-dialog title="分配进场特效" width="1200px" :visible.sync="show" :close-on-click-modal="false" @close="closeDialogs">
    <!-- 用户搜索部分, 如果外部传入的指定的用户, 则不需要展示这个部分 -->
    <div class="user-search-wrapper" v-if="needSearch">
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
              <el-button type="success" size="mini" @click="selectUser(scope.row)" v-if="hasPermission('user:live-enter-effect:create')">
                添加
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row style="padding: 15px;">
      <h4>已选定用户</h4>
      <!-- 是否可清空已选择用户, 从外部传入的用户不可清空 -->
      <el-button class="btn-operation" type="danger" size="mini" @click="clearSelectedUsers" :disabled="selectedUsers.length === 0" v-if="canClear">
        清空已选
      </el-button>
    </el-row>
    <div style=" overflow:scroll; width:100%; height:250px;">
      <el-table :data="selectedUsers" border style="width: 100%">
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="nickName" label="用户昵称"></el-table-column>
        <el-table-column prop="img" label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.img" class="user-avatar">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- 是否可清空已选择用户, 从外部传入的用户不可清空 -->
            <el-tooltip class="item" effect="dark" content="移除" placement="top" v-if="canClear">
              <el-button type="danger" size="mini" @click="removeSelectedUser(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div><br>
    <h4>进场特效</h4>
    <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
      <el-form-item prop="effectId">
        <el-select v-model="model.effectId" placeholder="选择进场特效" filterable>
          <el-option v-for="item in effects" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="expireTime">
        <el-date-picker v-model="model.expireTime" type="datetime" placeholder="选择特效过期时间" :picker-options="expireTimeOption" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
      <el-button type="primary" @click="doCreate" size="small" :loading="btnLoading" :disabled="selectedUsers.length === 0">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getUserInfoDetailByIdOrName } from '../../../api/user/user-info';
import {
  createUserLiveEnterEffect,
  getAllEffects
} from '../../../api/user/user-live-enter-effect';

export default {
  name: 'user-live-enter-effect-create-dialog',

  data() {
    return {
      effects: [],
      needSearch: true,
      canClear: true,
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now();
        }
      },
      selectedUsers: [],
      show: false,
      loading: {
        table: false
      },
      tableData: [],
      addUsersTable: [],
      toAccounts: [],
      model: {
        effectId: null,
        expireTime: null
      },
      rules: {
        effectId: [
          { required: true, trigger: 'change', message: '进场特效不能为空' }
        ],
        expireTime: [
          { required: true, trigger: 'change', message: '过期时间不能为空' }
        ]
      },
      btnLoading: false,
      queryModel: {
        userId: null,
        nickname: null
      }
    };
  },
  methods: {
    selectUser(row) {
      if (this.selectedUsers.indexOf(row) === -1) {
        this.selectedUsers.push(row);
      }
    },

    clearSelectedUsers() {
      this.selectedUsers = [];
    },

    doCreate() {
      if (this.selectedUsers.length === 0) {
        this.$message.error('未选择任何用户');
        return;
      }

      this.$refs.theForm.validate(valid => {
        if (valid) {
          let msg = {
            userIds: this.selectedUsers.map(item => item.userId),
            effectId: this.model.effectId,
            expireTime: this.model.expireTime
          };
          createUserLiveEnterEffect(msg)
            .then(resp => {
              this.$message.success('设置进场特效成功!');
              this.show = false;
              this.$emit('done');
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    closeDialogs() {
      this.selectedUsers = [];
      this.tableData = [];
      this.queryModel.userId = null;
      this.queryModel.nickname = null;
      this.model.effectId = null;
      this.model.expireTime = null;
    },

    findUser() {
      if (
        this.queryModel.userId === null &&
        this.queryModel.nickname === null
      ) {
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

    removeSelectedUser(row) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(row));
    },

    showDialog(effectList, user) {
      if (effectList && effectList.length > 0) {
        this.effects = effectList;
      } else {
        this.initAccessories();
      }
      if (user) {
        this.selectedUsers.push(user);
        this.needSearch = false;
        this.canClear = false;
      }
      this.show = true;
    },

    initEffects() {
      getAllEffects()
        .then(({ data }) => {
          this.effects = data.list;
        })
        .catch(error => {});
    }
  },
  created() {}
};
</script>

<style scoped>
.user-avatar {
  width: 60px;
  height: 60px;
}
</style>
