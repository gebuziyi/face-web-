<template>
  <div id="sys-dept-page">
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button class="btn-operation" @click="openCreateDialog" type="success" size="small">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px" border v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="deptId" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="部门名称">
        <template slot-scope="scope">
          <i :class="deptType2IconClass(scope.row)" @click="toggleChildren(scope.row)"></i>
          <span :class="hasChildrenDepts(scope.row) ? 'pd-left-4em' : ''">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" label="上级部门"></el-table-column>
      <el-table-column prop="orderNum" label="菜单序号" width="80"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
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
    <!-- 新建部门 -->
    <el-dialog :visible.sync="dialog.create.show" title="新建部门" width="400px">
      <el-form :model="dialog.create.model" :rules="rules" size="small" label-position="left" label-width="80px" ref="createForm">
        <el-form-item prop="parentId" label="上级部门">
          <el-cascader :props="deptCascader.props" :options="deptCascader.options" change-on-select @change="onDeptChange">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="dialog.create.model.name"></el-input>
        </el-form-item>
        <el-form-item prop="orderNum" label="排序号">
          <el-input v-model.number="dialog.create.model.orderNum" type="number" min="0"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate('createForm', dialog.create)" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改部门 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改部门" width="400px">
      <el-form :model="dialog.edit.model" :rules="rules" size="small" label-position="left" label-width="80px" ref="editForm">
        <el-form-item prop="parentId" label="上级部门" v-if="dialog.edit.model.parentId !== 0">
          <el-cascader :props="deptCascader.props" :options="deptCascader.options" change-on-select @change="onDeptChange" :value="deptIdChain">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="dialog.edit.model.name"></el-input>
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
  getSysDeptList,
  deleteSysDept,
  getSysDeptDetail,
  updateSysDept,
  saveSysDept
} from '../../api/sys/sys-dept';
import { emptySysDept } from '../../utils/empty-model';

export default {
  name: 'sys-dept-page',
  data() {
    return {
      deptCascader: {
        props: {
          value: 'deptId',
          label: 'name',
          children: 'list'
        },
        options: [],
        idChain: []
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'change',
            message: '部门名称不能为空'
          }
        ],
        parentId: [
          {
            required: true,
            trigger: 'change',
            message: '上级部门不能为空'
          }
        ]
      },
      dialog: {
        edit: {
          show: false,
          model: emptySysDept()
        },
        create: {
          show: false,
          model: emptySysDept()
        }
      },
      expandDeptIds: [],
      loading: {
        tree: true,
        table: true
      },
      tableData: [],
      depts: []
    };
  },
  computed: {
    deptIdChain() {
      if (this.dialog.edit.show === false) {
        return [];
      } else {
        let result = this.findParentDeptChain(this.dialog.edit.model.parentId);
        result.reverse();
        console.log(result);
        return result;
      }
    }
  },
  methods: {
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
    hasChildrenDepts(row) {
      return this.depts.filter(item => item.parentId === row.deptId).length > 0;
    },
    onDeptChange(value) {
      if (this.dialog.edit.show === true) {
        if (value) {
          this.dialog.edit.model.parentId = value[value.length - 1];
        } else {
          this.dialog.edit.model.parentId = null;
        }
      } else {
        if (value) {
          this.dialog.create.model.parentId = value[value.length - 1];
        } else {
          this.dialog.create.model.parentId = null;
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
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    doEdit(formRef, dialog) {
      this.$refs[formRef].validate(valid => {
        if (!valid) {
          return;
        }

        updateSysDept(dialog.model)
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
        saveSysDept(dialog.model)
          .then(({ data }) => {
            this.$message.success('操作成功');
            dialog.show = false;
            this.initTableData();
          })
          .catch(errorMsg => {});
      });
    },
    openEditDialog(row) {
      getSysDeptDetail(row.deptId)
        .then(({ data }) => {
          this.dialog.edit.model = data.dept;
          this.dialog.edit.show = true;
        })
        .catch(errorMsg => {});
    },
    deleteSingle(row) {
      this.$confirm('确认删除[' + row.name + '] ?', '删除确认', {
        type: 'warning'
      })
        .then(() => {
          deleteSysDept(row.deptId)
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
    findDeptLv(dept) {
      let lv = 0;
      if (dept.parentId !== 0) {
        lv = this.findDeptLv(
          this.depts.find(item => item.deptId === dept.parentId)
        );
      }
      return lv + 1;
    },
    deptType2IconClass(row) {
      let className = 'cursor-pointer fa ';
      if (this.expandDeptIds.indexOf(row.deptId) !== -1) {
        className = className + 'fa-chevron-down ';
      } else {
        className = className + 'fa-chevron-right ';
      }
      let leftEm;

      leftEm = this.findDeptLv(row);

      className = className + 'pd-left-em' + leftEm;
      return className;
    },
    toggleChildren(parent) {
      if (this.expandDeptIds.indexOf(parent.deptId) === -1) {
        this.doExpand(parent);
      } else {
        this.undoExpand(parent);
      }
    },
    doExpand(parent) {
      let lv = this.findDeptLv(parent);
      console.log('menu lv = ' + lv);
      if (parent.parentId === 0) {
        // 取消折叠目前展开的所有目录, 保证只有一个目录是打开的
        let expandedDepts = this.depts.filter(
          item => this.expandDeptIds.indexOf(item.deptId) !== -1
        );
        expandedDepts.forEach(item => this.undoExpand(item));
      } else {
        // 取消折叠当前展开的所有二级部门, 保证只有一个二级部门是展开的
        let expandedLv2Depts = this.depts.filter(
          item =>
            this.expandDeptIds.indexOf(item.deptId) !== -1 &&
            this.findDeptLv(item) === lv
        );
        expandedLv2Depts.forEach(item => this.undoExpand(item));
      }
      this.expandDeptIds.push(parent.deptId);
      let parentIdx = this.tableData.indexOf(parent);
      let data1 = this.tableData.slice(0, parentIdx + 1);
      let data2;
      data2 = data1.concat(
        this.depts.filter(item => item.parentId === parent.deptId)
      );
      let data3 = data2.concat(
        this.tableData.slice(parentIdx + 1, this.tableData.length)
      );
      this.tableData = data3;
    },
    undoExpand(parent) {
      this.expandDeptIds.splice(this.expandDeptIds.indexOf(parent.deptId));
      let parentIdx = this.tableData.indexOf(parent);
      if (parent.parentId === 0) {
        // 折叠一级部门, 一级所有展开的二级部门
        let lv2s = this.depts.filter(item => item.parentId === parent.deptId);
        lv2s.forEach(item => this.undoExpand(item));
      }
      let data1 = this.tableData.slice(0, parentIdx + 1);
      let restDepts = this.tableData.filter(
        item => item.parentId !== parent.deptId
      );
      let data2 = data1.concat(
        restDepts.slice(parentIdx + 1, restDepts.length)
      );
      this.tableData = data2;
    },
    initTableData() {
      getSysDeptList()
        .then(({ data }) => {
          this.depts = data.list;
          this.makeCascaderOption();
          this.tableData = this.depts.filter(item => item.parentId === 0);
          this.loading.table = false;
          this.expandDeptIds = [];
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
.pd-left-em1 {
  padding-left: 1em;
}
.pd-left-em2 {
  padding-left: 3em;
}
.pd-left-em3 {
  padding-left: 6em;
}
.pd-left-em4 {
  padding-left: 9em;
}
.pd-left-em5 {
  padding-left: 12em;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
