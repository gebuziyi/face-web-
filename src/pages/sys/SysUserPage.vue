<template>
  <div id="sys-user-page">
    <!-- 查询表单 -->
    <div class="query-form-wrapper">
      <el-form :model="queryModel" size="small" :inline="true" ref="queryForm">
        <el-form-item prop="username">
          <el-input v-model="queryModel.username" placeholder="用户名"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('sys:user:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('sys:user:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="userId" label="ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="deptName" label="所属部门"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '禁用'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('sys:user:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.userId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('sys:user:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重置密码" placement="top" v-if="hasPermission('sys:user:resetpwd')">
              <el-button type="warning" size="mini" @click="doResetPwd(scope.row)">
                <i class="fa fa-key"></i>
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
    <!-- 创建管理员 -->
    <el-dialog width="600px" :visible.sync="dialog.create.show" title="创建管理员" @close="resetDialogModel">
      <el-form :model="dialog.create.model" size="small" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="dialog.create.model.username"></el-input>
        </el-form-item>
        <el-form-item prop="deptId" label="所属部门">
          <el-cascader :props="deptCascader.props" :options="deptCascader.options" change-on-select @change="onDeptChange"></el-cascader>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="dialog.create.model.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="dialog.create.model.email" type="email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="dialog.create.model.mobile" type="mobile"></el-input>
        </el-form-item>
        <el-form-item prop="roleIdList" label="角色">
          <el-select v-model="dialog.create.model.roleIdList" multiple placeholder="请选择角色" @change="onRoleChange">
            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch style="display: block" v-model="dialog.create.model.status" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改管理员 -->
    <el-dialog width="600px" :visible.sync="dialog.edit.show" title="修改管理员">
      <el-form :model="dialog.edit.model" size="small" :rules="dialog.edit.rules" label-position="left" label-width="80px" ref="editForm">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="dialog.edit.model.username"></el-input>
        </el-form-item>
        <el-form-item prop="deptId" label="所属部门">
          <el-cascader :props="deptCascader.props" :options="deptCascader.options" change-on-select @change="onDeptChange" :value="deptIdChain"></el-cascader>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="dialog.edit.model.email" type="email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="dialog.edit.model.mobile" type="mobile"></el-input>
        </el-form-item>
        <el-form-item prop="roleIdList" label="角色">
          <el-select v-model="dialog.edit.model.roleIdList" multiple placeholder="请选择角色" @change="onRoleChange">
            <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-switch style="display: block" v-model="dialog.edit.model.status" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { emptySysUser } from '../../utils/empty-model';
import {
  getSysUserList,
  getSysUserDetail,
  updateSysUser,
  removeSysUser,
  createSysUser,
  resetPassword
} from '../../api/sys/sys-user';
import { getSysRoleListForSelect } from '../../api/sys/sys-role';
import { getSysDeptList } from '../../api/sys/sys-dept';
import { isEmailValid, isMobileValid } from '../../utils/coding-utils';

export default {
  name: 'sys-user-page',
  data() {
    // validator
    const emailValidator = (rule, value, callback) => {
      if (isEmailValid(value) === false) {
        callback(new Error('无效的邮箱地址'));
      } else {
        callback();
      }
    };

    const mobileValidator = (rule, value, callback) => {
      if (isMobileValid(value) === false) {
        callback(new Error('无效的手机号码'));
      } else {
        callback();
      }
    };

    return {
      depts: [],
      deptCascader: {
        props: {
          value: 'deptId',
          label: 'name',
          children: 'list'
        },
        options: [],
        idChain: []
      },
      selectedIds: [],
      dialog: {
        edit: {
          model: emptySysUser(),
          rules: {
            username: [
              { required: true, trigger: 'change', message: '用户名不能为空' }
            ],
            password: [
              { required: true, trigger: 'change', message: '密码不能为空' }
            ],
            email: [
              { required: true, trigger: 'change', message: '邮箱不能为空' },
              { validator: emailValidator, trigger: 'change' }
            ],
            mobile: [
              { required: true, trigger: 'change', message: '手机号不能为空' },
              { validator: mobileValidator, trigger: 'change' }
            ],
            deptId: [
              { required: true, trigger: 'change', message: '所属部门不能为空' }
            ],
            status: [
              { required: true, trigger: 'change', message: '状态不能为空' }
            ],
            roleIdList: [
              { required: true, trigger: 'change', message: '角色列表不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptySysUser(),
          rules: {
            username: [
              { required: true, trigger: 'change', message: '用户名不能为空' }
            ],
            password: [
              { required: true, trigger: 'change', message: '密码不能为空' }
            ],
            email: [
              { required: true, trigger: 'change', message: '邮箱不能为空' },
              { validator: emailValidator, trigger: 'change' }
            ],
            mobile: [
              { required: true, trigger: 'change', message: '手机号不能为空' },
              { validator: mobileValidator, trigger: 'change' }
            ],
            deptId: [
              { required: true, trigger: 'change', message: '所属部门不能为空' }
            ],
            status: [
              { required: true, trigger: 'change', message: '状态不能为空' }
            ],
            roleIdList: [
              { required: true, trigger: 'change', message: '角色列表不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      roles: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        username: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      }
    };
  },
  computed: {
    deptIdChain() {
      if (this.dialog.edit.show === false) {
        return [];
      } else {
        let result = this.findParentDeptChain(this.dialog.edit.model.deptId);
        result.reverse();
        console.log(result);
        return result;
      }
    }
  },
  methods: {
    doResetPwd(row) {
      this.$confirm(
        `此操作将重置管理员: ${row.username}的登录密码, 是否继续?`,
        '重置管理员密码',
        {
          type: 'warning'
        }
      )
        .then(() => {
          resetPassword(row.userId).then(resp => {
            const h = this.$createElement;

            this.$msgbox({
              title: '重置成功',
              message: h('p', null, [
                h('span', null, `${row.username}的密码已重置为: `),
                h('span', { color: 'red', 'font-weight': 500 }, 'facecast')
              ])
            }).then(action => {});
          });
        })
        .catch(() => {});
    },
    findParentDeptChain(deptId) {
      let idChain = [];
      idChain.push(deptId);
      let dept = this.depts.find(item => item.deptId === deptId);
      // 递归查找至一级菜单
      if (dept.parentId !== 0) {
        idChain = idChain.concat(this.findParentDeptChain(dept.parentId));
        return idChain;
      }

      return [].concat(deptId);
    },
    onDeptChange(value) {
      if (this.dialog.edit.show === true) {
        if (value) {
          this.dialog.edit.model.deptId = value[value.length - 1];
        } else {
          this.dialog.edit.model.deptId = null;
        }
      } else {
        if (value) {
          this.dialog.create.model.deptId = value[value.length - 1];
        } else {
          this.dialog.create.model.deptId = null;
        }
      }
    },
    findChildrenDepts(dept) {
      let children = this.depts.filter(item => item.parentId === dept.deptId);

      if (children && children.length > 0) {
        children = children.map(item => this.findChildrenDepts(item));
        dept.list = children;
        return dept;
      }

      return dept;
    },
    makeCascaderOption() {
      let option = this.findChildrenDepts(
        this.depts.find(item => item.parentId === 0)
      );
      console.log(option);
      this.deptCascader.options = [];
      this.deptCascader.options.push(option);
    },
    resetDialogModel() {
      this.dialog.create.model = emptySysUser();
      this.dialog.edit.model = emptySysUser();
    },
    onRoleChange(values) {
      if (this.dialog.create.show === true) {
        if (values) {
          this.dialog.create.model.roleIdList = values;
        } else {
          this.dialog.create.model.roleIdList = null;
        }
      } else {
        if (values) {
          this.dialog.edit.model.roleIdList = values;
        } else {
          this.dialog.edit.model.roleIdList = null;
        }
      }
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.userId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的管理员', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysUser(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {});
    },
    doCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createSysUser(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.create.btnLoading = false;
              this.dialog.create.show = false;
              this.getTableData();
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },
    deleteSingle(row) {
      this.$confirm('此操作将删除管理员: ' + row.username, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysUser(row.userId)
            .then(({ data }) => {
              this.$message.success('删除成功');
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {});
    },
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    doEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateSysUser(this.dialog.edit.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.edit.btnLoading = false;
              this.dialog.edit.show = false;
              this.getTableData();
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    },
    openEditDialog(userId) {
      this.dialog.edit.show = true;
      getSysUserDetail(userId)
        .then(({ data }) => {
          this.dialog.edit.model = data.user;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {});
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
      this.loading.table = true;
      this.dialog.create.model = emptySysUser();
      getSysUserList({
        query: this.queryModel,
        pager: this.pager
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {});
    },
    getAllSysRole() {
      getSysRoleListForSelect()
        .then(({ data }) => {
          this.roles = data.list;
        })
        .catch(error => {});
    },
    getAllSysDept() {
      getSysDeptList()
        .then(({ data }) => {
          this.depts = data.list;
          this.makeCascaderOption();
          this.tableData = this.depts.filter(item => item.parentId === 0);
          this.loading.table = false;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.getAllSysRole();
    this.getAllSysDept();
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
