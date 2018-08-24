<template>
  <el-dialog title="转移音乐信息" width="800px" :visible.sync="show" :close-on-click-modal="false" @close="$refs.transferForm.resetFields()">
    <div class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="transferForm">
        <el-form-item label="目标音乐类型" prop="targetTypeId">
          <el-select v-model="model.targetTypeId" placeholder="目标音乐类型">
            <el-option v-for="(item, index) in types" :key="index" :value="item.typeId" :label="item.typeName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p class="title">被操作的音乐列表: </p>
      <el-table :data="musicInfos" width="100%" border>
        <el-table-column label="ID" prop="musicId"></el-table-column>
        <el-table-column label="音乐名称" prop="mname"></el-table-column>
        <el-table-column label="原类型名称" prop="typeName"></el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doCopy" size="small" :loading="btnLoading">
        <i class="fa fa-copy"></i>
        <span>复制</span>
      </el-button>
      <el-button type="primary" @click="doMove" size="small" :loading="btnLoading">
        <i class="fa fa-exchange"></i>
        <span>移动</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { copyToType, moveToType } from '../../../api/music/music-info';

export default {
  name: 'music-info-transfer-dialog',
  data() {
    return {
      musicInfos: [],
      show: false,
      btnLoading: false,
      model: {
        musicIds: [],
        targetTypeId: null
      },
      rules: {
        targetTypeId: [
          { required: true, trigger: 'change', message: '请选择目标分类' }
        ]
      }
    };
  },
  methods: {
    showDialog(musicInfos) {
      this.musicInfos = musicInfos;
      this.show = true;
    },
    doCopy() {
      this.$refs.transferForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.$confirm(
          `确定要将选择的音乐信息列表复制到目标分类下?`,
          '复制音乐信息确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            this.model.musicIds = this.musicInfos.map(item => item.musicId);

            copyToType(this.model)
              .then(resp => {
                this.$message.success('操作成功');
                this.show = false;
                this.$emit('done');
              })
              .catch(error => {});
          })
          .catch(() => {});
      });
    },
    doMove() {
      this.$refs.transferForm.validate(valid => {
        if (!valid) {
          return;
        }

        this.$confirm(
          `确定要将选择的音乐信息列表移动到目标分类下?`,
          '移动音乐信息确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            this.model.musicIds = this.musicInfos.map(item => item.musicId);

            moveToType(this.model)
              .then(resp => {
                this.$message.success('操作成功');
                this.show = false;
                this.$emit('done');
              })
              .catch(error => {});
          })
          .catch(() => {});
      });
    }
  },
  props: {
    types: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.title {
  color: #e6a23c;
  padding-top: 1em;
  padding-bottom: 1em;
  font-size: large;
}
</style>
