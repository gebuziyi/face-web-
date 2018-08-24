<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="country">
        <el-input v-model.trim="queryModel.country" placeholder="国家名称"></el-input>
      </el-form-item>
      <el-form-item prop="keys">
        <el-input v-model.trim="queryModel.keys" placeholder="信息索引KEY,如:music.name"></el-input>
      </el-form-item>
      <el-form-item prop="cn">
        <el-input v-model.trim="queryModel.cn" placeholder="中文信息"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('globalization:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('globalization:info:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange" ref="dataTable">
      <el-table-column type="selection" width="55" :selectable="filterUndeletableRecord">
      </el-table-column>
      <el-table-column prop="gid" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="country" label="国家名称"></el-table-column>
      <el-table-column prop="keys" label="信息索引KEY"></el-table-column>
      <el-table-column prop="cn" label="中文信息"></el-table-column>
      <el-table-column prop="foreign" label="外文信息"></el-table-column>
      <el-table-column prop="idDel" label="删除标志">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.isDel === 0 ? 'success' : 'danger'">{{ scope.row.isDel === 0 ? '允许删除' : '禁止删除' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('globalization:info:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('globalization:info:delete') && scope.row.isDel === 0">
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
    <!-- 修改国际化信息 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改国际化信息" width="800px" @close="$refs.editForm.resetFields()">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="国家信息" prop="country">
            <el-input v-model.trim="dialog.edit.model.country"></el-input>
          </el-form-item>
          <el-form-item label="信息索引KEY" prop="keys">
            <el-input v-model.trim="dialog.edit.model.keys"></el-input>
          </el-form-item>
          <el-form-item label="中文信息" prop="cn">
            <el-input v-model.trim="dialog.edit.model.cn"></el-input>
          </el-form-item>
          <el-form-item label="外文信息" prop="foreign">
            <el-input v-model.trim="dialog.edit.model.foreign"></el-input>
          </el-form-item>
          <el-form-item label="删除标志" prop="isDel">
            <el-switch style="display: block" v-model="dialog.edit.model.isDel" active-color="#13ce66" inactive-color="#ff4949" active-text="允许删除" inactive-text="禁止删除" :active-value="0" :inactive-value="1">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建国际化信息 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建国际化信息" width="800px" @close="$refs.createForm.resetFields()">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="120px" ref="createForm">
          <el-form-item label="国家信息" prop="country">
            <el-input v-model.trim="dialog.create.model.country"></el-input>
          </el-form-item>
          <el-form-item label="信息索引KEY" prop="keys">
            <el-input v-model.trim="dialog.create.model.keys"></el-input>
          </el-form-item>
          <el-form-item label="中文信息" prop="cn">
            <el-input v-model.trim="dialog.create.model.cn"></el-input>
          </el-form-item>
          <el-form-item label="外文信息" prop="foreign">
            <el-input v-model.trim="dialog.create.model.foreign"></el-input>
          </el-form-item>
          <el-form-item label="删除标志" prop="isDel">
            <el-switch style="display: block" v-model="dialog.create.model.isDel" active-color="#13ce66" inactive-color="#ff4949" active-text="允许删除" inactive-text="禁止删除" :active-value="0" :inactive-value="1">
            </el-switch>
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
  getG11nInfoList,
  getG11nInfoDetail,
  updateG11nInfo,
  removeG11nInfo,
  createG11nInfo
} from '../../api/g11n/g11n-info';

import { emptyG11nInfo } from '../../utils/empty-model';

export default {
  name: 'g11n-info-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptyG11nInfo(),
          rules: {
            country: [
              { required: true, trigger: 'change', message: '国家名称不能为空' }
            ],
            keys: [
              { required: true, trigger: 'change', message: '信息索引KEY不能为空' }
            ],
            cn: [
              { required: true, trigger: 'change', message: '中文信息不能为空' }
            ],
            foreign: [
              { required: true, trigger: 'change', message: '外文信息不能为空' }
            ],
            isDel: [
              { required: true, trigger: 'change', message: '删除标志不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyG11nInfo(),
          rules: {
            country: [
              { required: true, trigger: 'change', message: '国家名称不能为空' }
            ],
            keys: [
              { required: true, trigger: 'change', message: '信息索引KEY不能为空' }
            ],
            cn: [
              { required: true, trigger: 'change', message: '中文信息不能为空' }
            ],
            foreign: [
              { required: true, trigger: 'change', message: '外文信息不能为空' }
            ],
            isDel: [
              { required: true, trigger: 'change', message: '删除标志不能为空' }
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
        keys: null,
        country: null,
        cn: null,
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
    filterUndeletableRecord(row, index) {
      // idDel = 0 代表可删除
      return row.isDel === 0
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows && rows.length > 0) {
        this.selectedIds = rows.map(data => data.gid);
      } else {
        this.selectedIds = [];
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的参数列表', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeG11nInfo(this.selectedIds)
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
          createG11nInfo(this.dialog.create.model)
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
      this.$confirm('此操作将删除国际化信息: ' + row.cn, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeG11nInfo(row.id)
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
          updateG11nInfo(this.dialog.edit.model)
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
      getG11nInfoDetail(row.gid)
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
      this.dialog.create.model = emptyG11nInfo();
      getG11nInfoList({
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
