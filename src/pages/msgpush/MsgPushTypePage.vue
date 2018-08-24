<template>
  <div>
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="typeName">
        <el-input v-model.trim="queryModel.typeName" placeholder="类型名称"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('msgpush:type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column prop="typeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="typeName" label="类型名称" width="400"></el-table-column>
      <el-table-column prop="show" label="通知列表显示" width="110">
        <template slot-scope="scope">
          <el-tag size="small" type="success" v-if="scope.row.show === true">是</el-tag>
          <el-tag size="small" type="warning" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="needPush" label="极光推送提醒" width="110">
        <template slot-scope="scope">
          <el-tag size="small" type="success" v-if="scope.row.needPush === true">是</el-tag>
          <el-tag size="small" type="warning" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('msgpush:type:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.typeId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 start-->
    <el-dialog :visible.sync="dialog.edit.show" title="消息推送类型修改" width="800px" :close-on-click-modal="false">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model.trim="dialog.edit.model.typeName"></el-input>
          </el-form-item>
          <el-form-item label="通知列表显示" prop="show">
            <el-radio-group v-model="dialog.edit.model.show">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="极光推送提醒" prop="needPush">
            <el-radio-group v-model="dialog.edit.model.needPush">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.create.show" title="消息推送类型创建" width="800px" :close-on-click-modal="false">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="120px" ref="createForm">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model.trim="dialog.create.model.typeName"></el-input>
          </el-form-item>
          <el-form-item label="通知列表显示" prop="show">
            <el-radio-group v-model="dialog.create.model.show">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="极光推送提醒" prop="needPush">
            <el-radio-group v-model="dialog.create.model.needPush">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
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
  getMsgPushTypeList,
  getMsgPushTypeDetail,
  updateMsgPushType,
  removeMsgPushType,
  createMsgPushType
} from '../../api/msgpush/msgpush-type';

import { emptyMsgPushType } from '../../utils/empty-model';

export default {
  name: 'msgpush-type-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptyMsgPushType(),
          rules: {
            typeName: [
              { required: true, trigger: 'change', message: '类型名称不能为空' }
            ],
            show: [
              {
                required: true,
                trigger: 'change',
                message: '请选择是否需要在通知列表显示'
              }
            ],
            needPush: [
              {
                required: true,
                trigger: 'change',
                message: '请选择是否需要极光推送提醒(手机通知栏提醒)'
              }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyMsgPushType(),
          rules: {
            typeName: [
              { required: true, trigger: 'change', message: '类型名称不能为空' }
            ],
            show: [
              {
                required: true,
                trigger: 'change',
                message: '请选择是否需要在通知列表显示'
              }
            ],
            needPush: [
              {
                required: true,
                trigger: 'change',
                message: '请选择是否需要极光推送提醒(手机通知栏提醒)'
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
      // 查询表单
      queryModel: {
        typeName: null,
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
  methods: {
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.typeId);
      }
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createMsgPushType(this.dialog.create.model)
            .then(data => {
              this.$message({
                type: 'success',
                message: '创建消息推送类型成功'
              });
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
      this.$confirm(
        `此操作将删除消息推送类型: ${row.typeName}, 是否继续?`,
        '删除确认'
      )
        .then(() => {
          this.loading.table = true;
          removeMsgPushType(row.typeId)
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
          updateMsgPushType(this.dialog.edit.model)
            .then(data => {
              this.$message({
                type: 'success',
                message: '更新消息推送类型成功'
              });
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
    openEditDialog(typeId) {
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getMsgPushTypeDetail(typeId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          // 取消对话框表单loading状态
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
      this.dialog.create.model = emptyMsgPushType();
      getMsgPushTypeList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          // 设置总数量
          this.pager.total = data.page.totalCount;
          // 取消loading状态
          this.loading.table = false;
        })
        .catch(error => {});
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
</style>
