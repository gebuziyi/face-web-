<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="sign">
        <el-input v-model.trim="queryModel.sign" placeholder="内购标识符"></el-input>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="创建时间" end-placeholder="创建时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('recharge:norm:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('recharge:norm:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="rechargeId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="sign" label="内购标识符"></el-table-column>
      <el-table-column prop="priceChina" label="人民币价格" sortable="custom"></el-table-column>
      <el-table-column prop="priceAmerica" label="美元价格" sortable="custom"></el-table-column>
      <el-table-column prop="number" label="钻石数量" sortable="custom"></el-table-column>
      <el-table-column prop="activity" label="优惠活动" width="180">
        <template slot-scope="scope">
          <img class="activity-img" :src="scope.row.img" v-if="scope.row.activity === true" />
          <el-tag type="info" v-else>无</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUsername" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUsername" label="修改人"></el-table-column>
      <el-table-column prop="editorTime" label="修改时间"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('recharge:norm:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="撤销优惠活动" placement="top" v-if="hasPermission('recharge:norm:update') && scope.row.activity === true">
              <el-button type="info" size="mini" @click="showActivityRemoveConfirm(scope.row)">
                <i class="fa fa-cog"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('recharge:norm:delete')">
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
    <!-- 修改充值规格 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改充值规格" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.rules" label-position="left" label-width="120px" ref="editForm">
          <el-form-item label="内购标识符" prop="sign">
            <el-input v-model.trim="dialog.edit.model.sign" placeholder="确保与移动端设置的内购标识符保持一致"></el-input>
          </el-form-item>
          <el-form-item label="人民币价格" prop="priceChina">
            <el-input-number v-model="dialog.edit.model.priceChina" :min="0.1" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="美元价格" prop="priceAmerica">
            <el-input-number v-model="dialog.edit.model.priceAmerica" :min="0.1" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="钻石数量" prop="number">
            <el-input-number v-model="dialog.edit.model.number" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="是否参与优惠" prop="activity">
            <el-switch @change="onActivitySwitchChange" style="display: block" v-model="dialog.edit.model.activity" active-color="#13ce66" inactive-color="#ff4949" active-text="参与优惠" inactive-text="无优惠" :active-value="true" :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item label="优惠活动" prop="activityId">
            <el-select v-model="dialog.edit.model.activityId" placeholder="选择一个优惠活动" :disabled="dialog.edit.model.activity === false">
              <el-option v-for="item in activities" :key="item.activityId" :label="item.activityName" :value="item.activityId">
                <div>
                  <span class="activity-name-option">{{ item.activityName }}</span>
                  <img class="activity-img-option" :src="item.img" :alt="item.activityName">
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建充值规格 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建充值规格" width="600px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.rules" label-position="left" label-width="120px" ref="createForm">
          <el-form-item label="内购标识符" prop="sign">
            <el-input v-model.trim="dialog.create.model.sign" placeholder="确保与移动端设置的内购标识符保持一致"></el-input>
          </el-form-item>
          <el-form-item label="人民币价格" prop="priceChina">
            <el-input-number v-model="dialog.create.model.priceChina" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="美元价格" prop="priceAmerica">
            <el-input-number v-model="dialog.create.model.priceAmerica" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="钻石数量" prop="number">
            <el-input-number v-model="dialog.create.model.number" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item label="是否参与优惠" prop="activity">
            <el-switch @change="onActivitySwitchChange" style="display: block" v-model="dialog.create.model.activity" active-color="#13ce66" inactive-color="#ff4949" active-text="参与优惠" inactive-text="无优惠" :active-value="true" :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item label="优惠活动" prop="activityId">
            <el-select v-model="dialog.create.model.activityId" placeholder="选择一个优惠活动" :disabled="dialog.create.model.activity === false">
              <el-option v-for="item in activities" :key="item.activityId" :label="item.activityName" :value="item.activityId">
                <div>
                  <span class="activity-name-option">{{ item.activityName }}</span>
                  <img class="activity-img-option" :src="item.img" :alt="item.activityName">
                </div>
              </el-option>
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
  getRechargeNormList,
  getRechargeNormDetail,
  updateRechargeNorm,
  removeRechargeNorm,
  createRechargeNorm,
  cancelActivity
} from '../../api/recharge/recharge-norm';
import { getAllRechargeActivities } from '../../api/recharge/recharge-activity';

import { emptyRechargeNorm } from '../../utils/empty-model';

export default {
  name: 'recharge-norm-page',
  data() {
    return {
      activities: [],
      selectedIds: [],
      dialog: {
        rules: {
          sign: [
            { required: true, trigger: 'change', message: '内购标识符不能为空' }
          ],
          priceChina: [
            {
              required: true,
              trigger: 'change',
              message: '人民币价格不能为空'
            },
            {
              type: 'number',
              min: 0.1,
              trigger: 'change',
              message: '人民币价格最小为0.1元'
            }
          ],
          priceAmerica: [
            { required: true, trigger: 'change', message: '美元价格不能为空' },
            {
              type: 'number',
              min: 0.1,
              trigger: 'change',
              message: '美元价格最小为0.1美元'
            }
          ],
          number: [
            { required: true, trigger: 'change', message: '钻石数量不能为空' },
            {
              type: 'number',
              min: 1,
              trigger: 'change',
              message: '钻石数量最小为1'
            }
          ],
          activity: [
            {
              required: true,
              trigger: 'change',
              message: '请选择是否参与优惠活动'
            }
          ]
        },
        edit: {
          model: emptyRechargeNorm(),
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptyRechargeNorm(),
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
        sign: null,
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
    onActivitySwitchChange(val) {
      if (val === false) {
        this.dialog.create.model.activityId = null;
        this.dialog.edit.model.activityId = null;
      }
    },
    initActivities() {
      getAllRechargeActivities()
        .then(({ data }) => {
          this.activities = data.list;
        })
        .catch(err => {});
    },
    showActivityRemoveConfirm(row) {
      this.$confirm(
        `确定要取消该充值规格的现有优惠活动: ${row.activityName} ?`,
        '取消优惠活动',
        {
          type: 'warning'
        }
      )
        .then(() => {
          cancelActivity(row.rechargeId)
            .then(resp => {
              this.$message.success('取消优惠成功');
              this.query();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.rechargeId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的充值规格', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeRechargeNorm(this.selectedIds)
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
          if (
            this.dialog.create.model.activity === true &&
            this.dialog.create.model.activityId === null
          ) {
            this.$message.error('请选择一个优惠活动!');
            return;
          }
          createRechargeNorm(this.dialog.create.model)
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
      this.$confirm(`此操作将删除充值规格: ${row.sign}`, '删除确认')
        .then(() => {
          this.loading.table = true;
          removeRechargeNorm(row.rechargeId)
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
          if (
            this.dialog.edit.model.activity === true &&
            this.dialog.edit.model.activityId === null
          ) {
            this.$message.error('请选择一个优惠活动!');
            return;
          }
          updateRechargeNorm(this.dialog.edit.model)
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
      getRechargeNormDetail(row.rechargeId)
        .then(({ data }) => {
          this.dialog.edit.model = data.norm;
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
      this.dialog.create.model = emptyRechargeNorm();
      getRechargeNormList({
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
    this.initActivities();
    this.getTableData();
  }
};
</script>

<style scoped>
.activity-img {
  width: 160px;
  height: 40px;
}
.activity-img-option {
  width: 80px;
  height: 20px;
  float: right;
}
.activity-name-option {
  display: inline-block;
}
</style>
