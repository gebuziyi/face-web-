<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <!-- 推荐主题 -->
      <el-form-item prop="theme">
        <el-input v-model.trim="queryModel.theme" placeholder="推荐主题"></el-input>
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('qa:recommend:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <!-- 新增礼品信息按钮 -->
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('qa:recommend:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="reId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="theme" label="推荐主题"></el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('qa:recommend:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row.reId)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('qa:recommend:delete')">
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
    <!-- 修改问答推荐信息 start-->
    <el-dialog :visible.sync="dialog.edit.show" title="问答推荐信息修改" width="400px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="推荐主题" prop="theme">
            <el-input v-model.trim="dialog.edit.model.theme"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建问答推荐信息 start-->
    <el-dialog :visible.sync="dialog.create.show" title="问答推荐信息创建" width="400px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="推荐主题" prop="theme">
            <el-input v-model.trim="dialog.create.model.theme"></el-input>
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
  getQaRecommendList,
  getQaRecommendDetail,
  updateQaRecommend,
  removeQaRecommend,
  createQaRecommend
} from '../../api/qa/qa-recommend';

import { emptyQaRecommend } from '../../utils/empty-model';

export default {
  name: 'qa-recommend-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptyQaRecommend(),
          rules: {
            theme: [
              { required: true, trigger: 'change', message: '推荐主题不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyQaRecommend(),
          rules: {
            theme: [
              { required: true, trigger: 'change', message: '推荐主题不能为空' }
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
        theme: null,
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
        this.selectedIds = rows.map(data => data.reId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的问答推荐信息', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeQaRecommend(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
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
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createQaRecommend(this.dialog.create.model)
            .then(data => {
              this.$message.success('创建成功');
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
      this.$confirm('此操作将删除推荐信息: ' + row.theme, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeQaRecommend(row.reId)
            .then(({ data }) => {
              this.$message.success('删除成功');
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
          updateQaRecommend(this.dialog.edit.model)
            .then(data => {
              this.$message.success('更新成功');
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
    openEditDialog(reId) {
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getQaRecommendDetail(reId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
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
      // 显示表格loading
      this.loading.table = true;
      this.dialog.create.model = emptyQaRecommend();
      getQaRecommendList({
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
