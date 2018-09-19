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
      <el-table-column prop="infoId" label="ID" width="60"></el-table-column>
      <el-table-column prop="infoName" label="名称">
        <template slot-scope="scope">
          <i :class="jobInfo2IconClass(scope.row)" @click="toggleChildren(scope.row)" v-if="scope.row.parentId === 0"></i>
          <span :class="scope.row.parentId === 0 ? '' : 'pd-left-em4'">{{ scope.row.infoName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
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
    <!-- 新建工作信息 -->
    <el-dialog :visible.sync="dialog.create.show" title="新建工作信息" width="800px" @close="resetDialogStatus($refs.createForm)">
      <el-form :model="dialog.create.model" :rules="dialog.create.rules" size="small" label-position="left" label-width="120px" ref="createForm">
        <el-form-item prop="cascaderModel" label="上级工作信息">
          <el-cascader :props="jobCascader.props" :options="jobCascader.opts4Create" change-on-select @change="onJobChange" v-model="dialog.create.model.cascaderModel">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="infoName" label="工作信息名称">
          <el-input v-model="dialog.create.model.infoName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate('createForm', dialog.create)" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改工作信息 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改工作信息" width="800px" @close="resetDialogStatus($refs.editForm)">
      <el-form :model="dialog.edit.model" :rules="dialog.edit.rules" size="small" label-position="left" label-width="120px" ref="editForm">
        <el-form-item prop="parentId" label="上级工作信息" v-if="dialog.edit.model.parentId !== 0">
          <el-cascader :props="jobCascader.props" :options="jobCascader.options" change-on-select @change="onJobChange" :value="infoIdChain" disabled>
          </el-cascader>
        </el-form-item>
        <el-form-item prop="infoName" label="名称">
          <el-input v-model="dialog.edit.model.infoName"></el-input>
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
  getJobInfoTreeData,
  getJobInfoDetail,
  updateJobInfo,
  saveJobInfo,
  deleteJobInfo
} from '../../api/user/job-info';
import { emptyJobInfo } from '../../utils/empty-model';
import { findIndex } from 'lodash';

export default {
  name: 'job-info-page',
  data() {
    return {
      jobCascader: {
        props: {
          value: 'infoId',
          label: 'infoName',
          children: 'children'
        },
        opts4Create: [],
        options: [],
        idChain: []
      },
      dialog: {
        edit: {
          show: false,
          model: emptyJobInfo(),
          rules: {
            infoName: [
              {
                required: true,
                trigger: 'change',
                message: '工作信息名称不能为空'
              }
            ]
          }
        },
        create: {
          show: false,
          model: {
            infoName: null,
            cascaderModel: []
          },
          rules: {
            infoName: [
              {
                required: true,
                trigger: 'change',
                message: '工作信息名称不能为空'
              }
            ],
            cascaderModel: [
              {
                type: 'array',
                required: true,
                trigger: 'change',
                message: '上级工作信息不能为空'
              }
            ]
          }
        }
      },
      expandInfoIds: [],
      loading: {
        tree: true,
        table: true
      },
      tableData: [],
      jobs: []
    };
  },
  computed: {
    infoIdChain() {
      if (this.dialog.edit.show === false) {
        return [];
      } else {
        let result = this.findParentJobChain(this.dialog.edit.model.parentId);
        result.reverse();
        console.log(result);
        return result;
      }
    }
  },
  methods: {
    resetDialogStatus(formRef) {
      if (formRef) {
        formRef.resetFields();
      }
      this.dialog.create.model = emptyJobInfo();
      this.dialog.edit.model = emptyJobInfo();
    },
    findParentJobChain(infoId) {
      let idChain = [];
      idChain.push(infoId);
      let jobInfo = this.jobs.find(item => item.infoId === infoId);
      // 递归查找至一级菜单
      if (jobInfo.parentId !== 0) {
        idChain = idChain.concat(this.findParentJobChain(jobInfo.parentId));
        return idChain;
      }

      return [].concat(infoId);
    },
    onJobChange(value) {
      if (this.dialog.edit.show === true) {
        if (value) {
          this.dialog.edit.model.parentId = value[value.length - 1];
        } else {
          this.dialog.edit.model.parentId = null;
        }
      }
    },
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    doEdit(formRef, dialog) {
      this.$refs[formRef].validate(valid => {
        if (!valid) {
          return;
        }

        updateJobInfo(dialog.model)
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
        let msg = emptyJobInfo();
        msg.infoName = dialog.model.infoName;
        msg.parentId = dialog.model.cascaderModel[dialog.model.cascaderModel.length - 1]
        saveJobInfo(msg)
          .then(({ data }) => {
            this.$message.success('操作成功');
            dialog.show = false;
            this.initTableData();
          })
          .catch(errorMsg => {});
      });
    },
    openEditDialog(row) {
      getJobInfoDetail(row.infoId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          this.dialog.edit.show = true;
        })
        .catch(errorMsg => {});
    },
    deleteSingle(row) {
      this.$confirm(`确认删除[ ${row.infoName} ] ?`, '删除确认', {
        type: 'warning'
      })
        .then(() => {
          deleteJobInfo(row.infoId)
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
    jobInfo2IconClass(row) {
      let className = 'cursor-pointer fa ';
      if (this.expandInfoIds.indexOf(row.infoId) !== -1) {
        className = className + 'fa-chevron-down ';
      } else {
        className = className + 'fa-chevron-right ';
      }
      let leftEm;

      leftEm = row.parentId === 0 ? 0 : 4;

      className = className + `pd-left-${leftEm}em`;
      return className;
    },
    toggleChildren(parent) {
      if (this.expandInfoIds.indexOf(parent.infoId) === -1) {
        this.doExpand(parent);
      } else {
        this.undoExpand(parent);
      }
    },
    doExpand(parent) {
      // 取消折叠目前展开的所有目录, 保证只有一个目录是打开的
      let expandedJobInfos = this.jobs.filter(
        item => this.expandInfoIds.indexOf(item.infoId) !== -1
      );
      expandedJobInfos.forEach(item => this.undoExpand(item));

      this.expandInfoIds.push(parent.infoId);
      let parentIdx = findIndex(
        this.tableData,
        item => item.infoId === parent.infoId
      );
      let data1 = this.tableData.slice(0, parentIdx + 1);
      let data2;
      data2 = data1.concat(parent.children);
      let data3 = data2.concat(
        this.tableData.slice(parentIdx + 1, this.tableData.length)
      );
      this.tableData = data3;
    },
    undoExpand(parent) {
      this.expandInfoIds.splice(this.expandInfoIds.indexOf(parent.infoId));
      let parentIdx = findIndex(this.tableData, parent);

      let data1 = this.tableData.slice(0, parentIdx + 1);
      let restData = this.tableData.filter(
        item => item.parentId !== parent.infoId
      );
      let data2 = data1.concat(restData.slice(parentIdx + 1, restData.length));
      this.tableData = data2;
    },
    initTableData() {
      getJobInfoTreeData()
        .then(({ data }) => {
          this.tableData = data.tree;
          this.jobs = data.tree;
          this.jobCascader.opts4Create = [].concat({
            infoId: 0,
            infoName: '根目录',
            children: data.tree
          });
          this.jobCascader.options = data.tree;
          this.loading.table = false;
          this.expandInfoIds = [];
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
  padding-left: 10px;
}
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
  padding-left: 4em;
}
.pd-left-em5 {
  padding-left: 12em;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
