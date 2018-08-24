<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="会员用户名"></el-input>
      </el-form-item>
      <el-form-item prop="ownerUsername">
        <el-input v-model.trim="queryModel.ownerUsername" placeholder="群主用户名"></el-input>
      </el-form-item>
      <el-form-item prop="imId">
        <el-input v-model.trim="queryModel.imId" placeholder="群组IM ID"></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select v-model="queryModel.role" placeholder="角色" clearable>
          <el-option v-for="(item, index) in groupRoleList" :key="index" :value="item.role" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始入群时间" end-placeholder="终止入群时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('im:user-group:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量踢人</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55" :selectable="selectNoOwner">
      </el-table-column>
      <el-table-column prop="groupId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="username" label="会员用户名"></el-table-column>
      <el-table-column prop="newsletterName" label="群组名称"></el-table-column>
      <el-table-column prop="groupImId" label="群组IM ID"></el-table-column>
      <el-table-column prop="ownerUsername" label="群主用户名"></el-table-column>
      <el-table-column prop="role" label="角色">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role | role2TagType" size="mini">{{ scope.row.roleDescription }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="入群时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <!-- 不能修改群主的角色或者踢出群主 -->
            <el-tooltip class="item" effect="dark" content="修改角色" placement="top" v-if="hasPermission('im:user-group:update') && scope.row.role !== 2">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="踢出群组" placement="top" v-if="hasPermission('im:user-group:delete') && scope.row.role !== 2">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <!-- 修改群成员角色 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改群成员角色" width="600px" @close="onDialogClose($refs.editForm)">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <span class="tips">
            <span class="username-highlight">{{ dialog.edit.username }}</span>
            @
            <span class="groupname-highlight">{{ dialog.edit.newsletterName }}</span>
          </span>
          <el-form-item label="角色" prop="role">
            <!-- 将群主这一选项设置为disable -->
            <el-select v-model="dialog.edit.model.role" placeholder="群成员角色">
              <el-option v-for="(item, index) in groupRoleList" :key="index" :value="item.role" :label="item.description" :disabled="item.role === 2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserGroupList,
  getUserGroupDetail,
  updateUserGroup,
  removeUserGroup,
  getAllGroupRole
} from '../../api/im/user-group';

import { emptyUserGroup } from '../../utils/empty-model';

export default {
  name: 'user-group-page',
  data() {
    return {
      groupRoleList: [],
      selectedIds: [],
      dialog: {
        edit: {
          username: '',
          newsletterName: '',
          model: emptyUserGroup(),
          rules: {
            role: [
              {
                required: true,
                trigger: 'change',
                message: '角色不能为空'
              }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        imId: null,
        ownerUsername: null,
        username: null,
        createTime: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      }
    };
  },
  filters: {
    role2TagType: function(role) {
      if (role === 0) {
        // MEMBER
        return 'info';
      } else if (role === 1) {
        // ADMIN
        return 'warning';
      } else {
        // OWNER
        return 'danger';
      }
    }
  },
  methods: {
    selectNoOwner(row, index) {
      // 不能选中群主所在的行进行操作
      if (row.role === 2) {
        return false;
      } else {
        return true;
      }
    },
    onDialogClose(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.groupId);
      }
    },
    deleteBatch() {
      this.$confirm(
        '确认将把选中的用户从相应的群组中踢出?',
        '批量踢出群成员确认'
      )
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeUserGroup(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('操作成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    deleteSingle(row) {
      this.$confirm(
        `确定将用户 [${row.username}] 从群组 [${row.newsletterName}] 中踢出?`,
        '踢出群成员确认'
      )
        .then(() => {
          this.loading.table = true;
          removeUserGroup(row.newsletterId)
            .then(({ data }) => {
              this.$message.success('操作成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateUserGroup(this.dialog.edit.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.edit.btnLoading = false;
              this.dialog.edit.show = false;
              this.getTableData();
            })
            .catch(error => {
              // do something
            });
        } else {
          return false;
        }
      });
    },
    openEditDialog(row) {
      // 打开对话框
      this.dialog.edit.username = row.username;
      this.dialog.edit.newsletterName = row.newsletterName;
      this.dialog.edit.show = true;
      getUserGroupDetail(row.groupId)
        .then(({ data }) => {
          this.dialog.edit.model = data.userGroup;
          // 取消对话框表单loading状态
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          this.$message.error('获取数据失败!');
          this.dialog.edit.show = false;
        });
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.query();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.imgFileList = [];
      getUserGroupList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    },
    initGroupRoleSelectData() {
      getAllGroupRole()
        .then(({ data }) => {
          this.groupRoleList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initGroupRoleSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.tips {
  font-weight: 600;
  padding-bottom: 20px;
  display: block;
}
.groupname-highlight {
  color: darkcyan;
}
.username-highlight {
  color: coral;
}
</style>
