<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="currency">
        <el-select v-model="queryModel.currency" placeholder="币种">
          <el-option :label="'人民币'" :value="0"></el-option>
          <el-option :label="'美元'" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('withdraw:norm:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="withdrawId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="f" label="F币数量" sortable="custom"></el-table-column>
      <el-table-column prop="price" label="提现金额" sortable="custom"></el-table-column>
      <el-table-column prop="currency" label="币种">
        <template slot-scope="scope">
          <span v-if="scope.row.currency === 0">人民币</span>
          <span v-if="scope.row.currency === 1">美元</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('withdraw:norm:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
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
    <!-- 弹窗 -->
    <!-- 修改提现规格 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改提现规格" width="800px" :close-on-click-modal="false">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="F币数量" prop="f">
            <el-input-number v-model="dialog.edit.model.f" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="提现金额" prop="price">
            <el-input-number v-model="dialog.edit.model.price" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item prop="currency" label="币种">
            <el-select v-model="dialog.edit.model.currency" placeholder="请选择币种">
              <el-option :label="'人民币'" :value="0"></el-option>
              <el-option :label="'美元'" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建提现规格 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建提现规格" width="600px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.rules" label-position="left" label-width="120px" ref="createForm">
          <el-form-item label="F币数量" prop="f">
            <el-input-number v-model="dialog.create.model.f" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="提现金额" prop="price">
            <el-input-number v-model="dialog.create.model.price" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item prop="currency" label="币种">
            <el-select v-model="dialog.create.model.currency" placeholder="请选择币种">
              <el-option :label="'人民币'" :value="0"></el-option>
              <el-option :label="'美元'" :value="1"></el-option>
            </el-select>
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
  getWithdrawNormList,
  getWithdrawNormDetail,
  updateWithdrawNorm,
  createWithdrawNorm
} from '../../api/withdraw/withdraw-norm';

import { emptyWithdrawNorm } from '../../utils/empty-model';

export default {
  name: 'withdraw-norm-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        rules: {
          price: [
            {
              required: true,
              trigger: 'change',
              message: '提现金额不能为空'
            },
            {
              type: 'number',
              min: 1,
              trigger: 'change',
              message: '提现金额最小为1元'
            }
          ],
          f: [
            { required: true, trigger: 'change', message: 'F币数量不能为空' },
            {
              type: 'number',
              min: 1,
              trigger: 'change',
              message: 'F币数量最小为1'
            }
          ],
          currency: [
            { required: true, trigger: 'change', message: '币种不能为空' }
          ]
        },
        edit: {
          model: emptyWithdrawNorm(),
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyWithdrawNorm(),
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
        currency: null
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
        this.selectedIds = rows.map(data => data.withdrawId);
      }
    },
    doCreate() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createWithdrawNorm(this.dialog.create.model)
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
    openCreateDialog() {
      this.dialog.create.show = true;
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateWithdrawNorm(this.dialog.edit.model)
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
      getWithdrawNormDetail(row.withdrawId)
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
      this.dialog.create.model = emptyWithdrawNorm();
      getWithdrawNormList({
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
