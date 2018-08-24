<template>
  <el-dialog :visible.sync="show" title="更新推送模板信息" width="800px" :close-on-click-modal="false" :before-close="beforeDialogClose">
    <div v-loading="loading" class="edit-form-wrapper">
      <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="theForm">
        <el-form-item prop="typeId" label="消息推送类型">
          <el-select v-model="model.typeId" placeholder="选择推送类型" filterable>
            <el-option v-for="(item, index) in msgPushTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="countryId" label="模板所属国家">
          <el-select v-model="model.countryId" placeholder="选择所属国家" filterable>
            <el-option v-for="(item, index) in countries" :key="index" :label="item.countryName" :value="item.countryId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对应中文消息" prop="cnContent">
          <el-input v-model.trim="model.cnContent"></el-input>
        </el-form-item>
        <el-form-item label="消息模板" prop="content">
          <el-input v-model.trim="model.content"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
      <el-button type="primary" @click="doEdit" size="small" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateMsgTemplate, getMsgTemplateDetail } from '../../../api/msgpush/msg-template';
import { emptyMsgTemplate } from '../../../utils/empty-model';

export default {
  name: 'msg-template-create-dialog',

  data() {
    const contentValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('消息不能为空'));
      } else if (value.length > 50) {
        callback(new Error('有效长度:1-50'));
      } else {
        callback();
      }
    };

    return {
      show: false,
      model: emptyMsgTemplate(),
      loading: false,
      rules: {
        typeId: [
          { required: true, trigger: 'change', message: '推送类型不能为空' }
        ],
        countryId: [
          { required: true, trigger: 'change', message: '所属国家不能为空' }
        ],
        cnContent: [
          { required: true, trigger: 'change', validator: contentValidator }
        ],
        content: [
          { required: true, trigger: 'change', validator: contentValidator }
        ]
      },
      formLoading: true,
      btnLoading: false
    };
  },

  props: {
    msgPushTypes: {
      type: Array,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },

  methods: {
    showDialog(id) {
      this.show = true;
      this.formLoading = true;
      this.getDetail(id);
    },

    getDetail(id) {
      getMsgTemplateDetail(id)
        .then(({ data }) => {
          this.model = data.detail;
          this.formLoading = false;
        })
        .catch(error => {
          this.sohw = false;
        });
    },

    beforeDialogClose(done) {
      this.$refs.theForm.resetFields();
      done();
    },

    doEdit() {
      this.$refs.theForm.validate(valid => {
        if (valid) {
          updateMsgTemplate(this.model)
            .then(data => {
              this.$message.success('修改消息模板成功');
              this.btnLoading = false;
              this.show = false;
              this.$emit('done');
            })
            .catch(error => {});
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
