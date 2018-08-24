<template>
  <el-dialog :visible.sync="show" title="当天直播记录" width="1400px" :close-on-click-modal="false">
    <div class="mg-btm-1em">
      <span>统计区间:</span>
      <span class="pd-left-3em">{{ workDate }} 00:00:00 - {{ workDate }} 23:59:59</span>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table-column prop="liveId" label="ID" width="80"></el-table-column>
      <el-table-column prop="userId" label="用户ID"></el-table-column>
      <el-table-column prop="infoName" label="直播名称"></el-table-column>
      <el-table-column prop="startTime" label="开播时间"></el-table-column>
      <el-table-column prop="endTime" label="关播时间"></el-table-column>
      <el-table-column prop="onlineNum" label="在线人数"></el-table-column>
      <el-table-column prop="likeNum" label="点赞数量"></el-table-column>
      <el-table-column prop="giftNum" label="礼物数量"></el-table-column>
      <el-table-column prop="durationInMinutes" label="直播时长(分钟)" width="150"></el-table-column>
      <el-table-column prop="isLive" label="状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.isLive === 0 ? 'success' : 'info'" :icon="scope.row.isLive === 0 ? 'fa fa-play' : 'fa fa-clock-o'">
            {{ scope.row.isLive === 0 ? '直播中' : '已关播'}}
          </icon-tag>
          <icon-tag v-if="scope.row.isLive === 1" :type="scope.row.valid ? 'success' :'danger'" :icon="'fa fa-clock'">{{ scope.row.valid ? '时长有效' : '时长无效'}}</icon-tag>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="show = false" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLiveInfoListByLogId } from '../../../api/live/work-log';

export default {
  name: 'live-info-log-dialog',

  data() {
    return {
      show: false,
      loading: false,
      tableData: [],
      workDate: ''
    };
  },

  methods: {
    showDialog(row) {
      this.workDate = row.workDate;
      this.loading = true;
      this.getTableData(row.logId);
      this.show = true;
    },

    getTableData(logId) {
      getLiveInfoListByLogId(logId)
        .then(({ data }) => {
          this.tableData = data.list;
          this.loading = false;
        })
        .catch(err => {})
    }
  }
};
</script>

<style scoped>
.mg-btm-1em {
  margin-bottom: 1em;
}
</style>
