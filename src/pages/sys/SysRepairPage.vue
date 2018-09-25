<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="fa fa-file-video-o"></i>
          <span> 短视频</span>
        </span>
        <h4>短视频数据修复</h4>
        <div class="repair-btn-wrapper">
          <template v-for="operation in videoRepirOperations">
            <repair-operation-card :key="operation.id" :title="operation.title" :onRepairBtnClick="operation.onRepairBtnClick" :desc="operation.desc" :btnLoading="operation.btnLoading"></repair-operation-card>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="fa fa-android"></i>
          <span> 机器人</span>
        </span>
        <h4>机器人数据修复</h4>
        <div class="repair-btn-wrapper">
          <template v-for="operation in robotRepirOperations">
            <repair-operation-card :key="operation.id" :title="operation.title" :onRepairBtnClick="operation.onRepairBtnClick" :desc="operation.desc" :btnLoading="operation.btnLoading"></repair-operation-card>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="腾讯云脏字管理" name="LittleAssistant-notifications">
        <Management-of-dirty-words></Management-of-dirty-words>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { doVideoRedisRepair, dovestAccountRedisRepair } from '../../api/sys/sys-repair';
import RepairOperationCard from './components/RepairOperationCard';
import ManagementOfDirtyWords from './dialogs/ManagementOfDirtyWords';
export default {
  name: 'sys-repair-page',

  components: {
    'repair-operation-card': RepairOperationCard,
    'Management-of-dirty-words': ManagementOfDirtyWords
  },

  data() {
    return {
      videoRepirOperations: [
        {
          title: '缓存区视频数量修复',
          desc:
            '此操作用于修复缓存中短视频数量异常丢失导致用户的视频信息流无法返回新的推荐视频导致的黑屏问题',
          onRepairBtnClick: this.repairVideoIdInRedis
        }
      ],
      robotRepirOperations: [
        {
          title: '缓存区机器人数量修复',
          desc:
            '此操作用于修复缓存中机器人没有及时回收导致新上传的视频及新开播的直播间没有机器人可用的问题',
          onRepairBtnClick: this.repairVestAccountInRedis
        }
      ]
    };
  },

  methods: {
    repairVideoIdInRedis(title, desc, doneCb) {
      this.$confirm(
        desc,
        title,
        {
          type: 'warning'
        }
      )
        .then(() => {
          doVideoRedisRepair()
            .then(resp => {
              doneCb();
              this.$message.success('修复成功!');
            })
            .catch(err => {
              doneCb();
              this.$message.error('修复失败, 请手动检查程序是否正常!!!');
            });
        })
        .catch(() => {
          doneCb();
        });
    },
    repairVestAccountInRedis(title, desc, doneCb) {
      this.$confirm(
        desc,
        title,
        {
          type: 'warning'
        }
      )
        .then(() => {
          dovestAccountRedisRepair()
            .then(resp => {
              doneCb();
              this.$message.success('修复成功!');
            })
            .catch(err => {
              doneCb();
              this.$message.error('修复失败, 请手动检查程序是否正常!!!');
            });
        })
        .catch(() => {
          doneCb();
        });
    }
  }
};
</script>

<style scoped>
.repair-btn-wrapper {
  margin-top: 20px;
}
</style>
