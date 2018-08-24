<template>
  <div id="sys-menu-page">
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button class="btn-operation" @click="openCreateModuleDialog" type="success" size="small">
        <i class="fa fa-plus"></i>
        <span>新增目录</span>
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" border v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="menuId" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="菜单名称">
        <template slot-scope="scope">
          <i :class="menuType2IconClass(scope.row)" @click="toggleChildren(scope.row)" v-if="scope.row.type !== 2"></i>
          <span :class="scope.row.type === 2 ? 'pd-left-btn' : ''">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="50">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | menuType2TagType" size="mini">{{ scope.row.type | menuType2TypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="菜单序号" width="80"></el-table-column>
      <el-table-column prop="url" label="菜单URL"></el-table-column>
      <el-table-column prop="perms" label="菜单授权标识"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="添加子菜单" placement="top" v-if="scope.row.type === 0">
              <el-button type="success" size="mini" @click="openCreateMenuDialog(scope.row)">
                <i class="fa fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加按钮" placement="top" v-if="scope.row.type === 1">
              <el-button type="success" size="mini" @click="openCreateButtonDialog(scope.row)">
                <i class="fa fa-plus"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 -->
    <!-- 新建目录 -->
    <el-dialog :visible.sync="dialog.create.show" title="新建菜单" width="800px" :close-on-click-modal="false" @close="resetDialogForm('module-create-form')">
      <el-form :model="dialog.create.model" :rules="rules" size="small" label-position="left" label-width="80px" ref="module-create-form">
        <el-form-item prop="parentName" :label="dialog.create.model.type === 1 ? '上级目录' : '上级菜单'">
          <el-input v-model="dialog.create.model.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="dialog.create.model.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="菜单URL" v-if="dialog.create.model.type === 1">
          <el-input v-model="dialog.create.model.url"></el-input>
        </el-form-item>
        <el-form-item prop="perms" label="授权标识" v-if="dialog.create.model.type !== 0">
          <el-input v-model="dialog.create.model.perms"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标">
          <el-input v-model="dialog.create.model.icon"></el-input>
          <span>图标预览: </span>
          <i :class="dialog.create.model.icon"></i>
        </el-form-item>
        <el-form-item prop="orderNum" label="排序号">
          <el-input v-model.number="dialog.create.model.orderNum" type="number" min="0"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate('module-create-form', dialog.create)" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改菜单 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改菜单" width="800px" :close-on-click-modal="false" @close="resetDialogForm('editForm')">
      <el-form :model="dialog.edit.model" :rules="rules" size="small" label-position="left" label-width="80px" ref="editForm">
        <el-form-item prop="name" label="菜单名称">
          <el-input v-model="dialog.edit.model.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="菜单URL" v-if="dialog.edit.model.type === 1">
          <el-input v-model="dialog.edit.model.url"></el-input>
        </el-form-item>
        <el-form-item prop="perms" label="授权标识" v-if="dialog.edit.model.type !== 0">
          <el-input v-model="dialog.edit.model.perms"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标" v-if="dialog.edit.model.type !== 2">
          <el-input v-model="dialog.edit.model.icon"></el-input>
          <span>图标预览: </span>
          <i :class="dialog.edit.model.icon"></i>
        </el-form-item>
        <el-form-item prop="orderNum" label="排序号">
          <el-input v-model.number="dialog.edit.model.orderNum" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit('editForm', dialog.edit)" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSysMenuList,
  saveSysMenu,
  deleteSysMenu,
  getSysMenuDetail,
  updateSysMenu
} from '../../api/sys/sys-menu';
import { menuTypes, menuTypeEnums } from '../../utils/constants';
import { emptySysMenu } from '../../utils/empty-model';

export default {
  name: 'sys-menu-page',
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            trigger: 'change',
            message: '名称不能为空'
          }
        ]
      },
      dialog: {
        edit: {
          show: false,
          model: emptySysMenu()
        },
        create: {
          show: false,
          model: emptySysMenu()
        }
      },
      expandMenuIds: [],
      loading: {
        tree: true,
        table: true
      },
      tableData: [],
      lv1Menus: [],
      lv2Menus: [],
      btns: []
    };
  },
  filters: {
    menuType2TagType: function(value) {
      return menuTypeEnums.find(item => item.type === value).tagType;
    },
    menuType2TypeName: function(value) {
      return menuTypeEnums.find(item => item.type === value).name;
    }
  },
  methods: {
    resetDialogForm(formRef) {
      console.log(formRef);
      this.$refs[formRef].resetFields();
    },

    openCreateMenuDialog(parent) {
      this.dialog.create.model.parentId = parent.menuId;
      this.dialog.create.model.parentName = parent.name;
      this.dialog.create.model.type = 1;
      this.dialog.create.show = true;
    },
    openCreateButtonDialog(parent) {
      this.dialog.create.model.parentId = parent.menuId;
      this.dialog.create.model.parentName = parent.name;
      this.dialog.create.model.type = 2;
      this.dialog.create.show = true;
    },
    openCreateModuleDialog() {
      this.dialog.create.model.parentId = 0;
      this.dialog.create.model.parentName = '根目录';
      this.dialog.create.model.type = 0;
      this.dialog.create.show = true;
    },
    doEdit(formRef, dialog) {
      this.$refs[formRef].validate(valid => {
        if (!valid) {
          return;
        }

        updateSysMenu(dialog.model)
          .then(resp => {
            this.$message.success('操作成功');
            this.initTableData();
            dialog.show = false;
          })
          .catch(errorMsg => {});
      });
    },
    doCreate(formRef, dialog) {
      this.$refs[formRef].validate(valid => {
        if (!valid) {
          return;
        }
        saveSysMenu(dialog.model)
          .then(({ data }) => {
            this.$message.success('操作成功');
            dialog.show = false;
            this.initTableData();
          })
          .catch(errorMsg => {});
      });
    },
    openEditDialog(row) {
      getSysMenuDetail(row.menuId)
        .then(({ data }) => {
          this.dialog.edit.model = data.menu;
          this.dialog.edit.show = true;
        })
        .catch(errorMsg => {});
    },
    deleteSingle(row) {
      this.$confirm(
        '确认删除' +
          menuTypeEnums.find(item => item.type === row.type).name +
          ' [' +
          row.name +
          '] ?',
        '删除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteSysMenu(row.menuId)
            .then(({ data }) => {
              this.$message.success('操作成功');
              this.initTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {
          // operation canceled
        });
    },
    menuType2IconClass(row) {
      let className = 'fa ';
      if (this.expandMenuIds.indexOf(row.menuId) !== -1) {
        className = className + 'fa-chevron-down ';
      } else {
        className = className + 'fa-chevron-right ';
      }
      let leftEm;
      if (row.type === menuTypes.MODULE) {
        // 一级菜单, 缩进0.5em
        leftEm = 'pd-left-lv1 ';
      } else if (row.type === menuTypes.MENU) {
        // 二级菜单, 缩进1em
        leftEm = 'pd-left-lv2 ';
      } else {
        // 按钮, 缩进1.5em
        leftEm = 'pd-left-btn ';
      }

      className = className + leftEm;
      return className;
    },
    toggleChildren(parent) {
      if (this.expandMenuIds.indexOf(parent.menuId) === -1) {
        this.doExpand(parent);
      } else {
        this.undoExpand(parent);
      }
    },
    doExpand(parent) {
      if (parent.type === 0) {
        // 取消折叠目前展开的所有目录, 保证只有一个目录是打开的
        let expandedMenus = this.lv1Menus.filter(
          item => this.expandMenuIds.indexOf(item.menuId) !== -1
        );
        expandedMenus.forEach(item => this.undoExpand(item));
      } else if (parent.type === 1) {
        // 取消折叠当前展开的所有二级菜单, 保证只有一个菜单是展开的
        let expandedLv2Menus = this.lv2Menus.filter(
          item => this.expandMenuIds.indexOf(item.menuId) !== -1
        );
        expandedLv2Menus.forEach(item => this.undoExpand(item));
      }
      this.expandMenuIds.push(parent.menuId);
      let parentIdx = this.tableData.indexOf(parent);
      let data1 = this.tableData.slice(0, parentIdx + 1);
      let data2;
      if (parent.type === 0) {
        data2 = data1.concat(
          this.lv2Menus.filter(item => item.parentId === parent.menuId)
        );
      } else if (parent.type === 1) {
        data2 = data1.concat(
          this.btns.filter(item => item.parentId === parent.menuId)
        );
      } else {
        data2 = data1;
      }
      let data3 = data2.concat(
        this.tableData.slice(parentIdx + 1, this.tableData.length)
      );
      this.tableData = data3;
    },
    undoExpand(parent) {
      this.expandMenuIds.splice(this.expandMenuIds.indexOf(parent.menuId));
      let parentIdx = this.tableData.indexOf(parent);
      if (parent.type === 0) {
        // 折叠目录以及下方所有菜单
        let lv2s = this.lv2Menus.filter(
          item => item.parentId === parent.menuId
        );
        lv2s.forEach(item => this.undoExpand(item));
      }
      let data1 = this.tableData.slice(0, parentIdx + 1);
      let restMenus = this.tableData.filter(
        item => item.parentId !== parent.menuId
      );
      let data2 = data1.concat(
        restMenus.slice(parentIdx + 1, restMenus.length)
      );
      this.tableData = data2;
    },
    initTableData() {
      getSysMenuList()
        .then(({ data }) => {
          this.lv1Menus = data.list.filter(
            item => item.type === menuTypes.MODULE
          );
          this.lv2Menus = data.list.filter(
            item => item.type === menuTypes.MENU
          );
          this.btns = data.list.filter(item => item.type === menuTypes.BUTTON);
          this.tableData = this.lv1Menus;
          this.loading.table = false;
          this.expandMenuIds = [];
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initTableData();
  }
};
</script>

<style scoped>
.pd-left-lv1 {
  padding-left: 0.5em;
  cursor: pointer;
}
.pd-left-lv2 {
  padding-left: 3em;
  cursor: pointer;
}
.pd-left-btn {
  padding-left: 6em;
}
.pd-right-1em {
  padding-right: 0.5em;
  cursor: pointer;
}
.pd-left-3xem {
  padding-left: 1.5em;
}
.pd-left-1xem {
  padding-left: 1em;
}
</style>
