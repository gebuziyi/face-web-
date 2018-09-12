<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="sname">
        <el-input v-model.trim="queryModel.sname" placeholder="系统名称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('sys:config:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="setId" label="系统设置ID主键" sortable="custom" ></el-table-column>
      <el-table-column prop="sname" label="系统名称"></el-table-column>
      <el-table-column prop="parameter" label="系统参数"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="createUser" label="创建者"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间" ></el-table-column>
      <el-table-column prop="editorUser" label="修改者"></el-table-column>
      <el-table-column prop="del" label="是否删除">
          <template slot-scope="scope">
            <icon-tag type="warning" v-if='scope.row.del === 0'>已删除</icon-tag>
            <icon-tag type="success" v-if='scope.row.del === 1'>正常</icon-tag>
          </template>
      </el-table-column>
      <el-table-column prop="url" label="下载地址"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('sys:set:update')">
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
    <!-- 修改系统参数 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改系统参数" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="100px" ref="editForm">
         <el-form-item label="系统名称" prop="sname">
            <el-input type="text" v-model.trim="dialog.edit.model.sname" readonly="readonly"></el-input>
          </el-form-item>
          <el-form-item label="参数值" prop="parameter" >
          <el-input-number  v-model.trim="dialog.edit.model.parameter" :min="1" :max="128" ></el-input-number>
        </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input type="text" v-model.trim="dialog.edit.model.url" readonly="readonly"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建系统参数 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建系统参数" width="600px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.create.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="系统名称" prop="sname">
            <el-input v-model.trim="dialog.create.model.sname"></el-input>
          </el-form-item>
        <el-form-item label="参数值" prop="parameter">
          <el-input-number v-model.trim="dialog.edit.model.parameter" :min="1" :max="128" label="礼品价格"></el-input-number>
        </el-form-item>
        <el-form-item label="url" prop="url">
            <el-input v-model.trim="dialog.create.model.url"></el-input>
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
  getSysConfigList,
  getSysSetDetail,
  updateSysConfig,
  createSysConfig,
  removeSysConfig
} from '../../api/sys/sys-set';

import { emptySysSet } from '../../utils/empty-model';

export default {
  name: 'sys-config-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        edit: {
          model: emptySysSet(),
          rules: {
            parameter: [
              { required: true, trigger: 'change', message: '参数值不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptySysSet(),
          rules: {
            sname: [
              { required: true, trigger: 'change', message: '参数名称不能为空' }
            ],
            url: [
              { required: true, trigger: 'change', message: '参数值不能为空' }
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
        sname: null
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
      this.$confirm('此操作将删除所选择的参数列表', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysConfig(this.selectedIds)
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
          createSysConfig(this.dialog.create.model)
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
      this.$confirm('此操作将删除系统参数: ' + row.sname, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysConfig(row.setId)
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
          updateSysConfig(this.dialog.edit.model)
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
      getSysSetDetail(row.setId)
        .then(({ data }) => {
          this.dialog.edit.model = data.detail;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          // 获取详情失败, 关闭修改弹窗
          this.dialog.edit.show = false;
        });
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
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
      this.dialog.create.model = emptySysSet();
      getSysConfigList({
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
