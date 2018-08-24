<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <!-- 类型名称 -->
      <el-form-item prop="typeName">
        <el-input v-model.trim="queryModel.typeName" placeholder="类型名称"></el-input>
      </el-form-item>
      <!-- 创建时间区间 -->
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 查询表单 end-->
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <!-- 批量删除按钮 -->
      <!-- 如果没有选择任何一行, 则按钮无效 -->
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('qa:type:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <!-- 新增礼品信息按钮 -->
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('qa:type:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="typeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="typeName" label="类型名称"></el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('qa:type:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.typeId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('qa:type:delete')">
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
    <!-- 弹窗 start-->
    <!-- 修改问答类型 start-->
    <el-dialog :visible.sync="dialog.edit.show" title="问答类型修改" width="400px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <!-- 问答类型修改表单 -->
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model.trim="dialog.edit.model.typeName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改问答类型 end-->
    <!-- 创建问答类型 start-->
    <el-dialog :visible.sync="dialog.create.show" title="问答类型创建" width="400px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <!-- 问答类型创建表单 -->
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="类型名称" prop="typeName">
            <el-input v-model.trim="dialog.create.model.typeName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.create.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doCreate" size="small" :loading="dialog.create.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建问答类型 end-->
    <!-- 弹窗 end-->
  </div>
</template>

<script>
import {
  getQaTypeList,
  getQaTypeDetail,
  updateQaType,
  removeQaType,
  createQaType
} from '../../api/qa/qa-type';

import { emptyQaType } from '../../utils/empty-model';

export default {
  name: 'qa-type-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        // 修改问答类型弹窗
        edit: {
          model: emptyQaType(),
          // 表单校验规则
          rules: {
            typeName: [
              { required: true, trigger: 'change', message: '类型名称不能为空' }
            ]
          },
          // 是否显示对话框
          show: false,
          // 是否显示表单loading界面
          formLoading: true,
          // 确定按钮loging
          btnLoading: false
        },
        // 创建问答类型弹窗
        create: {
          model: emptyQaType(),
          // 表单校验规则
          rules: {
            typeName: [
              { required: true, trigger: 'change', message: '类型名称不能为空' }
            ]
          },
          // 是否显示对话框
          show: false,
          // 是否显示表单loading界面
          formLoading: true,
          // 确定按钮loging
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
    deleteBatch() {
      this.$confirm('此操作将删除所选择的问答类型列表', '批量删除确认')
        .then(() => {
          // 用户点击了确定, 执行批量删除操作
          // 表格loading
          this.loading.table = true;
          removeQaType(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
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
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createQaType(this.dialog.create.model)
            .then(data => {
              this.$message({
                type: 'success',
                message: '创建问答类型成功'
              });
              // 取消按钮loading状态
              this.dialog.create.btnLoading = false;
              // 关闭对话框
              this.dialog.create.show = false;
              // 刷新表格数据
              this.getTableData();
            })
            .catch(errorMsg => {
              this.$message({
                type: 'error',
                message: '创建失败: ' + errorMsg
              });
            });
        } else {
          return false;
        }
      });
    },
    doDeleteSingle(row) {
      this.$confirm('此操作将删除问答类型: ' + row.typeName, '删除确认')
        .then(() => {
          // 用户点击了确定, 执行删除操作
          // 表格loading
          this.loading.table = true;
          removeQaType(row.typeId)
            .then(({ data }) => {
              this.$message.success('删除成功');
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
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateQaType(this.dialog.edit.model)
            .then(data => {
              this.$message({
                type: 'success',
                message: '更新问答类型成功'
              });
              // 取消按钮loading状态
              this.dialog.edit.btnLoading = false;
              // 关闭对话框
              this.dialog.edit.show = false;
              // 刷新表格数据
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
      // 打开对话框
      this.dialog.edit.show = true;
      // 表单loading
      this.dialog.edit.formLoading = true;
      // 根据ID获取详情
      getQaTypeDetail(typeId)
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
      this.dialog.create.model = emptyQaType();
      getQaTypeList({
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
