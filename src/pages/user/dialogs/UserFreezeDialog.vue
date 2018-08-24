<template>
  <el-dialog :visible.sync="show" :title="`冻结用户: ${model.nickname}`" width="800px" :close-on-click-modal="false" :close="resetForm">
    <div v-loading="loading.form" class="form-wrapper" element-loading-text="正在加载冻结类型" element-loading-spinner="el-icon-loading">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="createForm">
        <el-form-item label="冻结类型" prop="typeId">
          <el-select v-model="model.typeId" placeholder="请选择冻结类型">
            <el-option v-for="item in types" :key="item.typeId" :label="item.name" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冻结时间" prop="hours">
          <el-radio-group v-model="model.hours">
            <el-radio-button :label="24">24小时</el-radio-button>
            <el-radio-button :label="48">48小时</el-radio-button>
            <el-radio-button :label="30 * 24">30天</el-radio-button>
            <el-radio-button :label="-1">永久</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <h4>用户冻结记录</h4>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="正在加载用户冻结记录" element-loading-spinner="el-icon-loading">
      <el-table-column prop="logId" label="记录ID"></el-table-column>
      <el-table-column prop="createTime" label="冻结时间"></el-table-column>
      <el-table-column prop="typeName" label="冻结类型"></el-table-column>
      <el-table-column prop="unfreezeTime" label="解冻时间">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">{{ scope.row.unfreezeTime }}</span>
          <el-tag type="danger" v-else>永久冻结</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doFreeze" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  freezeUserTemporary,
  freezeUserForever
} from '../../../api/user/user-info';
import { getAllFreezeType } from '../../../api/user/user-freeze-type';
import { getFreezeLogListByUserId } from '../../../api/user/user-freeze-log';

export default {
  name: 'user-freeze-dialog',
  data() {
    return {
      btnLoading: false,
      types: [],
      tableData: [],
      query: {
        userId: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      show: false,
      loading: {
        table: false,
        form: false
      },
      model: {
        userId: null,
        nickname: null,
        hours: null,
        typeId: null
      },
      rules: {
        typeId: [
          {
            required: true,
            trigger: 'change',
            message: '冻结类型不能为空'
          }
        ],
        hours: [
          {
            required: true,
            trigger: 'change',
            message: '冻结时间不能为空'
          }
        ]
      }
    };
  },
  methods: {
    onSizeChange(size) {
      this.pager.limit = size;
      this.getUserFreezeLog();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.getUserFreezeLog();
    },
    showDialog(row) {
      this.loading.table = true;
      this.loading.form = true;
      this.btnLoading = false;
      this.query.userId = row.userId;
      this.model.userId = row.userId;
      this.model.nickname = row.nickName;
      this.model.typeId = null;
      this.model.hours = null;

      this.show = true;

      this.initFreezeType();
      this.getUserFreezeLog();
    },
    initFreezeType() {
      getAllFreezeType()
        .then(({ data }) => {
          this.types = data.list;
          this.loading.form = false;
        })
        .catch(err => {});
    },
    getUserFreezeLog() {
      getFreezeLogListByUserId(this.model.userId)
        .then(({ data }) => {
          this.tableData = data.list;
          this.loading.table = false;
        })
        .catch(err => {});
    },
    doFreeze() {
      // 验证表单有效性
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.btnLoading = true;
          if (this.model.hours > 0) {
            // 临时冻结
            let msg = {
              userId: this.model.userId,
              typeId: this.model.typeId,
              hours: this.model.hours
            };
            freezeUserTemporary(msg)
              .then(resp => {
                this.$message.success('冻结成功');
                this.$emit('done');
                this.show = false;
              })
              .catch(err => {});
          } else {
            // 永久冻结
            let msg = {
              userId: this.model.userId,
              typeId: this.model.typeId
            };
            freezeUserForever(msg)
              .then(resp => {
                this.$message.success('冻结成功');
                this.$emit('done');
                this.show = false;
              })
              .catch(err => {});
          }
        } else {
          return false;
        }
      });
    },

    resetForm() {
      this.$refs.createForm.resetFields();
      this.btnLoading = false;
    }
  }
};
</script>
