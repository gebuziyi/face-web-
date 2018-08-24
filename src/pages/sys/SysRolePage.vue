<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="name">
        <el-input v-model.trim="queryModel.name" placeholder="角色名称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('sys:role:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('sys:role:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="roleId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="deptName" label="所属部门"></el-table-column>
      <el-table-column prop="remark" label="角色描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('sys:role:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.roleId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('sys:role:delete')">
              <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
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
    <!-- 弹窗-->
    <!-- 修改角色 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改角色" width="700px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model.trim="dialog.edit.model.roleName"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader :props="deptCascader.props" :options="deptCascader.options" :value="deptIdChain" change-on-select @change="onDeptChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="角色描述" prop="remark">
            <el-input v-model.trim="dialog.edit.model.remark" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" prop="menuIdList">
            <el-tree :props="tree.menu.props" :data="tree.menu.data" ref="menuTreeEdit" @check-change="onMenuChangeEdit" show-checkbox node-key="menuId" check-strictly>
            </el-tree>
          </el-form-item>
          <el-form-item label="数据权限" prop="deptIdList">
            <el-tree :props="tree.dept.props" :data="tree.dept.data" ref="deptTreeEdit" @check-change="onDeptTreeChangeEdit" show-checkbox node-key="deptId" check-strictly>
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建角色-->
    <el-dialog :visible.sync="dialog.create.show" title="创建角色" width="700px" @close="onDialogClose">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model.trim="dialog.create.model.roleName"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader :props="deptCascader.props" :options="deptCascader.options" change-on-select @change="onDeptChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="角色描述" prop="remark">
            <el-input v-model.trim="dialog.create.model.remark" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" prop="menuIdList">
            <el-tree :props="tree.menu.props" :data="tree.menu.data" ref="menuTree" @check-change="onMenuChange" show-checkbox node-key="menuId" check-strictly>
            </el-tree>
          </el-form-item>
          <el-form-item label="数据权限" prop="deptIdList">
            <el-tree :props="tree.dept.props" :data="tree.dept.data" ref="deptTree" @check-change="onDeptTreeChange" show-checkbox node-key="deptId" check-strictly>
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSysRoleList,
  getSysRoleDetail,
  updateSysRole,
  removeSysRole,
  createSysRole
} from '../../api/sys/sys-role';
import { getAllSysDeptForSelect } from '../../api/sys/sys-dept';
import { getSysMenuTreeData } from '../../api/sys/sys-menu';

import { emptySysRole } from '../../utils/empty-model';

export default {
  name: 'sys-role-page',
  data() {
    return {
      tree: {
        menu: {
          props: {
            value: 'menuId',
            label: 'name',
            children: 'list'
          },
          data: []
        },
        dept: {
          props: {
            value: 'deptId',
            label: 'name',
            children: 'list'
          },
          data: []
        }
      },
      deptCascader: {
        props: {
          value: 'deptId',
          label: 'name',
          children: 'list'
        },
        options: [],
        idChain: []
      },
      deptList: [],
      selectedIds: [],
      dialog: {
        edit: {
          model: emptySysRole(),
          rules: {
            roleName: [
              { required: true, trigger: 'change', message: '角色名称不能为空' }
            ],
            deptId: [
              { required: true, trigger: 'change', message: '所属部门不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptySysRole(),
          rules: {
            roleName: [
              { required: true, trigger: 'change', message: '角色名称不能为空' }
            ],
            deptId: [
              { required: true, trigger: 'change', message: '所属部门不能为空' }
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
        roleName: null
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
  computed: {
    deptIdChain() {
      if (this.dialog.edit.show === false) {
        return [];
      } else {
        let result = this.findParentDeptChain(this.dialog.edit.model.deptId);
        result.reverse();
        return result;
      }
    }
  },
  methods: {
    onDeptTreeChange(data, checked, childrenChecked) {
      let checkedDeptIds = this.$refs.deptTree.getCheckedKeys();
      console.log(checkedDeptIds);
      this.dialog.create.model.deptIdList = checkedDeptIds;
    },
    onDeptTreeChangeEdit(data, checked, childrenChecked) {
      let checkedDeptIds = this.$refs.deptTreeEdit.getCheckedKeys();
      console.log(checkedDeptIds)
      this.dialog.edit.model.deptIdList = checkedDeptIds;
    },
    onDialogClose() {
      this.dialog.edit.model = emptySysRole();
      this.dialog.create.model = emptySysRole();
    },
    onMenuChange(data, checked, childrenChecked) {
      let checkedMenuIds = this.$refs.menuTree.getCheckedKeys();
      this.dialog.create.model.menuIdList = checkedMenuIds;
    },
    onMenuChangeEdit(data, checked, childrenChecked) {
      let checkedMenuIds = this.$refs.menuTreeEdit.getCheckedKeys();
      this.dialog.edit.model.menuIdList = checkedMenuIds;
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
    makeCascaderOption() {
      let option = this.findChildrenDepts(
        this.deptList.find(item => item.parentId === 0)
      );
      this.deptCascader.options = [];
      this.deptCascader.options.push(option);
    },
    findParentDeptChain(deptId) {
      let idChain = [];
      idChain.push(deptId);
      let dept = this.deptList.find(item => item.deptId === deptId);
      // 递归查找至一级菜单
      if (dept.parentId !== 0) {
        idChain = idChain.concat(this.findParentDeptChain(dept.parentId));
        return idChain;
      }

      return [].concat(deptId);
    },
    findChildrenDepts(dept) {
      let children = this.deptList.filter(
        item => item.parentId === dept.deptId
      );

      if (children && children.length > 0) {
        children = children.map(item => this.findChildrenDepts(item));
        dept.list = children;
        return dept;
      }

      return dept;
    },
    getSysDeptList() {
      getAllSysDeptForSelect()
        .then(({ data }) => {
          this.deptList = data.deptList;
          this.makeCascaderOption();
          this.parseDeptTreeData();
        })
        .catch(errorMsg => {});
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.roleId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的角色', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysRole(this.selectedIds)
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
          createSysRole(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.create.btnLoading = false;
              this.dialog.create.show = false;
              this.getTableData();
            })
            .catch(errorMsg => {});
        } else {
          return false;
        }
      });
    },
    doDeleteSingle(row) {
      this.$confirm('此操作将删除角色: ' + row.roleName, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysRole(row.roleId)
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
      this.dialog.create.model = emptySysRole();
      // 清空tree组件
      this.$refs.menuTree.setCheckedKeys([], false);
      this.$refs.deptTree.setCheckedKeys([], false);
    },
    doEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateSysRole(this.dialog.edit.model)
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
    openEditDialog(typeId) {
      this.dialog.edit.formLoading = true;
      this.dialog.edit.model = emptySysRole();
      getSysRoleDetail(typeId)
        .then(({ data }) => {
          this.dialog.edit.model = data.role;
          this.dialog.edit.show = true;
          // 这里需要延时一段时间(当前值为100ms)来更新tree组件的默认选中值, 否则默认选中工作不正常, 注意!!!
          setTimeout(() => {
            this.$refs.menuTreeEdit.setCheckedKeys(data.role.menuIdList, false);
            this.$refs.deptTreeEdit.setCheckedKeys(data.role.deptIdList, false);
            this.dialog.edit.formLoading = false;
          }, 100);
        })
        .catch(error => {});
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table = true;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.dialog.create.model = emptySysRole();
      getSysRoleList({
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
    initMenuTree() {
      getSysMenuTreeData()
        .then(({ data }) => {
          this.tree.menu.data = data.menuList;
        })
        .catch(() => {});
    },
    parseDeptTreeData() {
      let option = this.findChildrenDepts(
        this.deptList.find(item => item.parentId === 0)
      );
      this.tree.dept.data = [].concat(option);
    }
  },
  created() {
    this.initMenuTree();
    this.getTableData();
    this.getSysDeptList();
  }
};
</script>

<style scoped>

</style>
