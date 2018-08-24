<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="tags">
        <el-input v-model.trim="queryModel.tags" placeholder="标签名称"></el-input>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="queryModel.type" placeholder="创建类型" clearable >
          <el-option label="系统定义" :value="0"></el-option>
          <el-option label="用户自定义" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('user:hobby:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('user:hobby:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="hobbyId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="tags" label="标签名称"></el-table-column>
      <el-table-column prop="type" label="创建类型">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.type === 0 ? 'danger' : 'info'" :icon="scope.row.type === 0 ? 'fa fa-server' : 'fa fa-user'">{{ scope.row.type === 0 ? '系统定义' : '用户自定义'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('user:hobby:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('user:hobby:delete')">
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
    <!-- 弹窗 -->
    <!-- 修改兴趣爱好信息 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改兴趣爱好信息" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="标签名称" prop="tags">
            <el-input v-model.trim="dialog.edit.model.tags"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建兴趣爱好信息 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建兴趣爱好信息" width="600px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="标签名称" prop="tags">
            <el-input v-model.trim="dialog.create.model.tags"></el-input>
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
  getHobbyInfoList,
  getHobbyInfoDetail,
  updateHobbyInfo,
  removeHobbyInfo,
  createHobbyInfo
} from '../../api/user/hobby-info';

import { emptyHobbyInfo } from '../../utils/empty-model';

export default {
  name: 'hobby-info-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptyHobbyInfo(),
          rules: {
            tags: [
              { required: true, trigger: 'change', message: '标签名称不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyHobbyInfo(),
          rules: {
            tags: [
              { required: true, trigger: 'change', message: '标签名称不能为空' }
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
        tags: null,
        type: null
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
        this.selectedIds = rows.map(data => data.hobbyId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的兴趣爱好信息标记, 相应的用户与兴趣爱好信息的关联记录也将一并删除, 确认继续?', '批量删除确认', {
        type: 'warning'
      })
        .then(() => {
          this.loading.table = true;
          removeHobbyInfo(this.selectedIds)
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
          createHobbyInfo(this.dialog.create.model)
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
      this.$confirm(`此操作将删除所选择的兴趣爱好信息标记: ${row.tags}, 相应的用户与兴趣爱好信息的关联记录也将一并删除, 确认继续?`, '删除确认', {
        type: 'warning'
      })
        .then(() => {
          this.loading.table = true;
          removeHobbyInfo(row.hobbyId)
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
          updateHobbyInfo(this.dialog.edit.model)
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
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getHobbyInfoDetail(row.hobbyId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          // 获取详情失败, 关闭修改弹窗
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
      this.dialog.create.model = emptyHobbyInfo();
      getHobbyInfoList({
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
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
