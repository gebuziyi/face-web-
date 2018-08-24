<template>
  <div id="job-manage-tab">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="beanName">
        <el-input v-model.trim="queryModel.beanName" placeholder="Bean名称"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('sys:schedule:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('sys:schedule:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>新增</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="jobId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="beanName" label="Bean名称"></el-table-column>
      <el-table-column prop="methodName" label="方法名称"></el-table-column>
      <el-table-column prop="params" label="方法参数"></el-table-column>
      <el-table-column prop="cronExpression" label="Cron表达式"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="status" label="执行状态">
        <template slot-scope="scope">
          <!-- 这里0代表成功, 1代表暂停 !!!-->
          <el-tag v-if="scope.row.status === 0" type="success" size="mini">
            正常
          </el-tag>
          <el-tag v-else type="warning" size="mini">
            暂停
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('sys:schedule:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('sys:schedule:delete')">
              <el-button type="danger" size="mini" @click="doDeleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="暂停" placement="top" v-if="hasPermission('sys:schedule:pause') && scope.row.status === 0">
              <el-button size="mini" @click="doJobPause(scope.row)" type="warning">
                <i class="fa fa-pause"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="恢复" placement="top" v-if="hasPermission('sys:schedule:resume') && scope.row.status === 1">
              <el-button size="mini" @click="doJobResume(scope.row)" type="success">
                <i class="fa fa-play"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="立即执行" placement="top" v-if="hasPermission('sys:schedule:run')">
              <el-button size="mini" @click="doJobRun(scope.row)" type="success">
                <i class="fa fa-arrow-circle-right"></i>
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
    <!-- 修改定时任务 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改定时任务" width="600px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.rules" label-position="left" label-width="80px" ref="editForm">
          <el-form-item label="Bean名称" prop="beanName">
            <el-input v-model.trim="dialog.edit.model.beanName" placeholder="如: userAuditTask"></el-input>
          </el-form-item>
          <el-form-item label="方法名称" prop="methodName">
            <el-input v-model.trim="dialog.edit.model.methodName" placeholder="如: auditUserCount"></el-input>
          </el-form-item>
          <el-form-item label="方法参数" prop="params">
            <el-input v-model.trim="dialog.edit.model.params"></el-input>
          </el-form-item>
          <el-form-item label="Cron表达式" prop="cronExpression">
            <el-input v-model.trim="dialog.edit.model.cronExpression" placeholder="如: 0/10 * * * * *"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="dialog.edit.model.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建定时任务 -->
    <el-dialog :visible.sync="dialog.create.show" title="创建定时任务" width="600px">
      <div v-loading="dialog.create.loading" class="create-form-wrapper">
        <el-form size="small" :model="dialog.create.model" :rules="dialog.rules" label-position="left" label-width="80px" ref="createForm">
          <el-form-item label="Bean名称" prop="beanName">
            <el-input v-model.trim="dialog.create.model.beanName" placeholder="如: userAuditTask"></el-input>
          </el-form-item>
          <el-form-item label="方法名称" prop="methodName">
            <el-input v-model.trim="dialog.create.model.methodName" placeholder="如: auditUserCount"></el-input>
          </el-form-item>
          <el-form-item label="方法参数" prop="params">
            <el-input v-model.trim="dialog.create.model.params"></el-input>
          </el-form-item>
          <el-form-item label="Cron表达式" prop="cronExpression">
            <el-input v-model.trim="dialog.create.model.cronExpression" placeholder="如: 0/10 * * * * *"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="dialog.create.model.remark"></el-input>
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
  getSysScheduledJobList,
  getSysScheduledJobDetail,
  updateSysScheduledJob,
  removeSysScheduledJob,
  createSysScheduledJob,
  pauseSysScheduledJob,
  resumeSysScheduledJob,
  runSysScheduledJob
} from '../../api/sys/sys-scheduled-job';

import { emptySysScheduledJob } from '../../utils/empty-model';

export default {
  name: 'sys-scheduled-job-page',
  data() {
    return {
      selectedIds: [],
      dialog: {
        rules: {
          beanName: [
            { required: true, trigger: 'change', message: 'Bean名称不能为空' }
          ],
          methodName: [
            { required: true, trigger: 'change', message: '方法名称不能为空' }
          ],
          cronExpression: [
            { required: true, trigger: 'change', message: 'Cron表达式不能为空' }
          ]
        },
        edit: {
          model: emptySysScheduledJob(),
          show: false,
          formLoading: true,
          btnLoading: false
        },
        create: {
          model: emptySysScheduledJob(),
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
        beanName: null
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
    taskDescribeInfo(job) {
      return job.beanName + '.' + job.methodName + '()';
    },
    doJobPause(row) {
      this.$confirm(
        '确定要暂停定时任务: ' + this.taskDescribeInfo(row) + '?',
        '暂停定时任务',
        {
          type: 'warning'
        }
      )
        .then(() => {
          pauseSysScheduledJob(row.jobId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    doJobResume(row) {
      this.$confirm(
        '确定要恢复定时任务: ' + this.taskDescribeInfo(row) + '?',
        '恢复定时任务',
        {
          type: 'warning'
        }
      )
        .then(() => {
          resumeSysScheduledJob(row.jobId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    doJobRun(row) {
      this.$confirm(
        '确定要立即执行定时任务: ' + this.taskDescribeInfo(row) + '?',
        '立即执行定时任务',
        {
          type: 'warning'
        }
      )
        .then(() => {
          runSysScheduledJob(row.jobId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
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
        this.selectedIds = rows.map(data => data.jobId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的定时任务', '批量删除确认')
        .then(() => {
          this.loading.table = true;
          removeSysScheduledJob(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              this.getTableData();
            })
            .catch(msg => {
              this.$message.error('删除失败!错误信息: ' + msg);
              this.loading.table = false;
            });
        })
        .catch(() => {});
    },
    doCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createSysScheduledJob(this.dialog.create.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.create.btnLoading = false;
              this.dialog.create.show = false;
              this.getTableData();
            })
            .catch(errorMsg => {
              this.$message.error('操作失败: ' + errorMsg);
            });
        } else {
          return false;
        }
      });
    },
    doDeleteSingle(row) {
      this.$confirm(
        '此操作将删除定时任务: ' + row.beanName + '.' + row.methodName + '()',
        '删除确认'
      )
        .then(() => {
          this.loading.table = true;
          removeSysScheduledJob(row.jobId)
            .then(({ data }) => {
              this.$message.success('删除成功');
              this.getTableData();
            })
            .catch(msg => {
              this.$message.error('删除失败!错误信息: ' + msg);
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
          updateSysScheduledJob(this.dialog.edit.model)
            .then(data => {
              this.$message.success('操作成功');
              this.dialog.edit.btnLoading = false;
              this.dialog.edit.show = false;
              this.getTableData();
            })
            .catch(error => {
              this.$message.error('操作失败: ' + error);
            });
        } else {
          return false;
        }
      });
    },
    openEditDialog(row) {
      this.dialog.edit.show = true;
      this.dialog.edit.formLoading = true;
      getSysScheduledJobDetail(row.jobId)
        .then(({ data }) => {
          this.dialog.edit.model = data.schedule;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          this.$message.error('无法获取定时任务详细信息: ' + error);
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
      this.loading.table = true;
      this.dialog.create.model = emptySysScheduledJob();
      getSysScheduledJobList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(error => {
          this.$message.error('获取定时任务列表失败: ' + error);
        });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>

</style>
