<template>
  <div id="sys-scheduled-job-page">
    <el-tabs tab-position="top" style="height: 100%;" type="border-card" v-if="hasPermission('sys:schedule:list')" v-model="activeTab">
      <el-tab-pane name="sys.job.task">
        <template slot="label">
          <i class="fa fa-tasks"></i>
          <span>任务管理</span>
        </template>
        <job-manage-tab v-if="shouldTabShow('sys.job.task')"></job-manage-tab>
      </el-tab-pane>
      <el-tab-pane label="日志查询" v-if="hasPermission('sys:schedule:log')" name="sys.job.log">
        <template slot="label">
          <i class="fa fa-file-text-o"></i>
          <span>日志查询</span>
        </template>
        <job-log-tab v-if="shouldTabShow('sys.job.log')"></job-log-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SysScheduledJobLogTab from './SysScheduledJobLogTab';
import SysScheduledJobManageTab from './SysScheduledJobManageTab';

export default {
  name: 'sys-scheduled-job-page',
  data() {
    return {
      activeTab: 'sys.job.task'
    };
  },
  methods: {
    shouldTabShow(tabName) {
      return this.activeTab === tabName
    }
  },
  components: {
    'job-log-tab': SysScheduledJobLogTab,
    'job-manage-tab': SysScheduledJobManageTab
  }
};
</script>

<style scoped>

</style>
