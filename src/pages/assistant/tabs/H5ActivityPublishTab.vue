<template>
  <div>
    <div class="activity-form-wrapper">
      <h3>发布H5页面活动</h3>
      <el-form class="activity-form" size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="h5Form">
        <el-form-item label="活动介绍(推送)" prop="text">
          <el-input v-model.trim="model.text"></el-input>
        </el-form-item>
        <el-form-item label="活动网址URL" prop="url">
          <el-input v-model.trim="model.url"></el-input>
        </el-form-item>
        <el-form-item label="活动图片" prop="image">
          <el-upload :action="uploadAction" :on-success="onUploadSuccess" :before-upload="beforeSvgaUpload" :on-error="onUploadError" :file-list="imgFileList" list-type="picture">
            <el-button size="small" type="primary">点击选择活动图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="极光推送提醒" prop="needPush">
          <el-radio-group v-model="model.needPush">
            <el-radio-button :label="false">否</el-radio-button>
            <el-radio-button :label="true">是</el-radio-button>
          </el-radio-group>
          </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="doPublish" size="small" :loading="btnLoading">确认发布</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-wrapper">
      <h4 class="tip">活动发布记录</h4>
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="createTime">
          <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发布时间" end-placeholder="发布时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div class="btn-wrapper">
        <el-button @click="query" type="primary" size="small">
          <i class="fa fa-search"></i>
          <span>搜索</span>
        </el-button>
        <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
        <el-table-column prop="msgId" label="ID" sortable="custom" width="80"></el-table-column>
        <el-table-column prop="msgData" label="活动网址" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row | parseUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgData" label="活动图片">
          <template slot-scope="scope">
            <table-img-previewer :option="scope.row | parseImageOption" v-if="hasImage(scope.row)"></table-img-previewer>
            <el-tag type="warning" v-else>无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="msgCreateTime" label="发布时间" width="160" sortable="custom"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" @click="deleteActivityMsg(scope.row)">
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
    </div>
  </div>
</template>

<script>
import { sendUrlMsg } from '../../../api/assistant/official-activity';
import {
  getAssistantChatMsgByH5Page,
  deleteMsg
} from '../../../api/assistant/assistant-ChatMsg';
export default {
  name: 'h5-activity-publish-tab',

  data() {
    const token = this.$store.state.user.token;

    return {
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      imgFileList: [],
      loading: {
        table: true
      },
      tableData: [],
      model: {
        url: null,
        text: null,
        image: null,
        imageWidth: null,
        imageHeight: null,
        needPush: null
      },
      queryModel: {
        createTime: null
      },
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      rules: {
        text: [
          {
            required: true,
            trigger: 'change',
            message: '活动介绍不能为空'
          }
        ],
        url: [
          {
            required: true,
            trigger: 'change',
            message: '活动网址不能为空'
          }
        ],
        image: [
          {
            required: true,
            trigger: 'change',
            message: '活动图片不能为空'
          }
        ],
        needPush: [
          {
            required: true,
            trigger: 'change',
            message: '请选择是否需要极光推送提醒(手机通知栏提醒)'
          }
        ]
      },
      sorter: {
        prop: null,
        order: null
      },
      btnLoading: false
    };
  },

  filters: {
    parseText: function(msg) {
      const msgDataStr = msg.msgData;
      return JSON.parse(msgDataStr).Text;
    },

    parseUrl: function(msg) {
      const msgDataStr = msg.msgData;
      return JSON.parse(msgDataStr).URL;
    },

    parseImageOption: function(msg) {
      const msgDataStr = msg.msgData;
      return {
        imgSrc: JSON.parse(msgDataStr).Image
      };
    }
  },

  methods: {
    deleteActivityMsg(row) {
      this.$confirm(
        `此操作将删除选择的H5活动消息, 删除后所有用户的小助手页面都将看不到此消息, 是否继续?`,
        '删除H5活动消息确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          deleteMsg(row.msgId)
            .then(resp => {
              this.$message.success('删除成功');
              this.getTableData();
            })
            .catch(err => {});
        })
        .catch(() => {});
    },

    hasImage(row) {
      const image = JSON.parse(row.msgData).Image;
      return image && image.trim() !== '';
    },

    onUploadSuccess(response, file, fileList) {
      // response is the file url or {code: 500, msg: 'error msg here'}
      if (response.code && response.code !== 0) {
        // 此时虽然http的status=200, 但实际上结果为上传失败!!!
        this.$message({
          type: 'error',
          message: '图片上传失败: ' + response.msg
        });
        return;
      }
      // 上传文件在服务器上的地址, 根据当前对话框类型, 设置响应model的image属性值
      // 获取图片的原始宽高
      const img = new Image();
      img.onload = () => {
        this.model.imageWidth = img.width;
        this.model.imageHeight = img.height;
        this.model.image = response;
        this.imgFileList = [].concat({ url: response });
        this.$message.success('上传成功!');
        this.$refs.h5Form.validateField('image');
      };
      img.src = response;
    },
    onUploadError(error, file, fileList) {
      this.$message({
        type: 'error',
        message: '活动图片上传失败!'
      });
      this.model.image = null;
      this.$refs.h5Form.validateField('image');
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
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
    query() {
      this.loading.table = true;
      this.pager.page = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading.table = true;
      getAssistantChatMsgByH5Page({
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
    },
    beforeSvgaUpload(file) {
      if (file) {
        const filename = file.name;
        const dotIdx = filename.lastIndexOf('.');
        const ext = filename.substr(dotIdx);
        if (ext === '.jpg' || ext === '.JPG' || ext === '.jpeg' || ext === '.JPEG' || ext === '.png' || ext === '.PNG') {
          return true;
        }
      }
      this.svgaFileList = [];
      this.$message.error('必须上传.jpg .JPG .jpeg .JPEG .png .PNG结尾的文件!!');
      return false;
    },
    doPublish() {
      this.$refs.h5Form.validate(valid => {
        if (valid === false) {
          return;
        }
        this.$confirm(
          `是否要发布一条H5活动通知给所有用户?`,
          '活动通知发布确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            sendUrlMsg(this.model)
              .then(resp => {
                this.$message.success('活动发布成功!');
                this.$refs.h5Form.resetFields();
                this.imgFileList = [];
                this.query();
              })
              .catch(err => {});
          })
          .catch(() => {});
      });
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style scoped>
.activity-form {
  margin-top: 20px;
  width: 60%;
  min-height: 300px;
}
.activity-form-wrapper {
  border-bottom: 1px solid #dcdfe6;
}
.tab-wrapper {
  margin-top: 10px;
}
.tab-wrapper h4 {
  color: grey;
  margin-bottom: 10px;
}
</style>
