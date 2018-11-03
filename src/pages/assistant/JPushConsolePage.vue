<template>
  <div>
    <h3>极光推送控制台</h3><br><br>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="极光推送" name="1">
        <div>
          <el-row :gutter="10" style="font-size: 20px; margin-top:20px; margin-left: 10px">
            <el-col :span="10">
              <el-form size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="h5Form">
                <el-form-item label="标题" prop="title">
                  <el-input v-model.trim="model.title " oninput="if(value.length > 100)value = value.slice(0, 100)"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                  <el-input v-model.trim="model.content" type="textarea" oninput="if(value.length > 300)value = value.slice(0, 300)"></el-input>
                </el-form-item>
                <el-form-item label="推送缘由" prop="description">
                  <el-input v-model.trim="model.description" type="textarea" oninput="if(value.length > 500)value = value.slice(0, 500)" placeholder="请输入此次推送的目的或者原因（用户不可见）"></el-input>
                </el-form-item>
                <el-form-item label="活动图片" prop="image">
                  <el-upload :action="uploadAction" :on-success="onUploadSuccess" :before-upload="beforeSvgaUpload" :on-error="onUploadError" :file-list="imgFileList" list-type="picture">
                    <el-button size="small" type="primary">点击选择活动图片</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="平台" prop="platform">
                  <el-checkbox-group v-model="model.platform">
                    <el-checkbox label="Android" name="android"></el-checkbox>
                    <el-checkbox label="IOS" name="ios"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <div v-if="this.model.platform[0] === 'IOS' || this.model.platform[1] === 'IOS'">
                  <el-form-item label="IOS环境" prop="iosProduction">
                    <el-radio-group v-model="model.iosProduction">
                      <el-radio-button :label="false">开发</el-radio-button>
                      <el-radio-button :label="true">生产</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <el-row>
                  <el-col :span="8">
                    <el-form-item v-for="(field, index) in model.fields" :label="'附加字段' + index" :key="field.key" :prop="'fields.' + index + '.keys'" :rules="{ required: true, message: 'key不能为空', trigger: 'blur' }">
                      <el-input v-model="field.keys" placeholder="key"></el-input>
                      <el-button @click.prevent="removeField(field)">删除</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item v-for="(field, index) in model.fields" :key="field.key" :prop="'fields.' + index + '.values'" :rules="{ required: true, message: 'value不能为空', trigger: 'blur' }">
                      <div style="height:66px">
                        <el-input v-model="field.values" placeholder="value" style="height: 15px"></el-input>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item>
                  <el-button @click="addField">新增附加字段</el-button>
                </el-form-item>
                <el-form-item label="">
                  <el-button type="primary" @click="doPublish" size="small" :loading="btnLoading">确认发布</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <div class="activity-form">
                <h4>推送预览</h4><br><br>
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <p v-if="model.title">
                      {{ model.title}}
                    </p>
                    <p v-else class="title-tip">请输入推送标题... ...</p>
                  </div>
                  <el-row :gutter="1">
                    <el-col :span="21">
                      <div class="jpush-content">
                        <p v-if="model.content">
                          {{ model.content}}
                        </p>
                        <p v-else class="content-tip">请输入推送内容... ...</p>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <img :src="model.image" class="jpush-img-preview" />
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="推送历史" name="2">
        <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
          <el-form-item prop="userId">
            <el-select v-model="queryModel.userId" placeholder="选择管理员" filterable>
              <el-option v-for="(item, index) in sysUsers" :key="index" :label="item.username" :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="createTime">
            <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发送时间" end-placeholder="发送时间" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="btn-wrapper">
          <el-button @click="onQueryBtnClick" type="primary" size="small">
            <i class="fa fa-search"></i>
            <span>搜索</span>
          </el-button>
          <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
          <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column prop="image" label="图片">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击查看大图" placement="top">
                <img :src="scope.row.image" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="平台">
          </el-table-column>
          <el-table-column prop="apnsProduction" label="IOS环境">
            <template slot-scope="scope">
              {{ scope.row.apnsProduction === true ? '生产环境' : scope.row.apnsProduction === false ? '开发环境' : ' ' }}
            </template>
          </el-table-column>
          <el-table-column prop="extras" label="附加字段"></el-table-column>
          <el-table-column prop="description" label="介绍"></el-table-column>
          <el-table-column prop="creatorName" label="发送人"></el-table-column>
          <el-table-column prop="createTime" label="发送时间"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <!-- <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('user:recommend:type:update')">
                  <el-button type="warning" size="mini" @click="openEditDialog(scope.row.typeId)">
                    <i class="fa fa-edit"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('gift:type:delete')">
                  <el-button type="danger" size="mini" @click="deleteAssistantFaqType(scope.row)">
                    <i class="fa fa-trash"></i>
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </template> -->
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
        </el-pagination>
        <el-dialog :visible.sync="dialog.picPreview.show">
          <img :src="dialog.picPreview.picSrc" class="img-preview" />
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { sendMsgForAndOrIOS } from '../../api/assistant/official-activity';
import { getAllSysUserList } from '../../api/sys/sys-user';
import { getJpushLogList } from '../../api/jpush/jpush-log';

export default {
  name: 'h5-activity-publish-tab',

  data() {
    const token = this.$store.state.user.token;

    return {
      uploadAction: `/faceshow-admin/api/fileupload?token=${token}&temp=${Date.now()}`,
      imgFileList: [],
      sysUsers: [],
      tableData: [],
      activeTabName: '1',
      loading: {
        table: true
      },
      model: {
        title: null,
        content: null,
        image: null,
        platform: [],
        iosProduction: null,
        description: null,
        fields: [
          {
            keys: null,
            values: null
          }
        ]
      },
      queryModel: {
        userId: null,
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
      },
      rules: {
        title: [
          {
            required: true,
            trigger: 'change',
            message: '推送标题不能为空'
          }
        ],
        content: [
          {
            required: true,
            trigger: 'change',
            message: '推送内容不能为空'
          }
        ],
        platform: [
          {
            required: true,
            trigger: 'change',
            message: '请选择需要发送极光推送的平台(手机通知栏提醒)'
          }
        ],
        iosProduction: [
          {
            required: true,
            trigger: 'change',
            message: '请选择IOS环境'
          }
        ],
        description: [
          {
            required: true,
            trigger: 'change',
            message: '推送缘由不能为空'
          }
        ]
      },
      btnLoading: false,
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      }
    };
  },
  methods: {
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.image;
      this.dialog.picPreview.show = true;
    },
    addField() {
      this.model.fields.push({
        keys: '',
        values: '',
        key: Date.now()
      });
    },
    removeField(item) {
      var index = this.model.fields.indexOf(item);
      if (index !== -1) {
        this.model.fields.splice(index, 1);
      }
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
        // this.model.imageWidth = img.width;
        // this.model.imageHeight = img.height;
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
    beforeSvgaUpload(file) {
      if (file) {
        const filename = file.name;
        const dotIdx = filename.lastIndexOf('.');
        const ext = filename.substr(dotIdx);
        if (
          ext === '.jpg' ||
          ext === '.JPG' ||
          ext === '.jpeg' ||
          ext === '.JPEG' ||
          ext === '.png' ||
          ext === '.PNG'
        ) {
          return true;
        }
      }
      this.svgaFileList = [];
      this.$message.error(
        '必须上传.jpg .JPG .jpeg .JPEG .png .PNG结尾的文件!!'
      );
      return false;
    },
    doPublish() {
      this.$refs.h5Form.validate(valid => {
        if (valid === false || this.model.platform === []) {
          return;
        }
        let extras = {};
        this.model.fields.forEach(item => {
          extras[item.keys] = item.values;
        });

        let msg = {
          title: this.model.title,
          content: this.model.content,
          image: this.model.image,
          platform: this.model.platform,
          description: this.model.description,
          iosProduction: this.model.iosProduction,
          extras: extras
        };
        this.$confirm(
          `是否要发布一条活动通知给所有用户?`,
          '活动通知发布确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            sendMsgForAndOrIOS(msg)
              .then(resp => {
                this.$message.success('活动发布成功!');
                this.$refs.h5Form.resetFields();
                this.imgFileList = [];
                this.model.title = null;
                this.model.content = null;
                this.model.image = null;
                this.model.platform = [];
                this.model.iosProduction = null;
                this.model.description = null;
                this.model.fields = [];
                this.query();
              })
              .catch(err => {});
          })
          .catch(() => {});
      });
    },
    doGetAllSysUserList() {
      getAllSysUserList()
        .then(({ data }) => {
          this.sysUsers = data.list;
        })
        .catch(error => {});
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table = true;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getJpushLogList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          // 设置总数量
          this.pager.total = data.page.totalCount;
          // 取消loading状态
          this.loading.table = false;
        })
        .catch(error => {});
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    }
  },
  created() {
    this.doGetAllSysUserList();
    this.getTableData();
  }
};
</script>

<style scoped>
.activity-form {
  margin-left: 50px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.jpush-content {
  word-wrap: wrap;
  word-break: break-all;
  width: 100%;
}
.jpush-img-preview {
  width: 80px;
  height: 80px;
}
.content-tip {
  color: #666666;
  font-size: 12px;
}
.title-tip {
  color: #666666;
  font-size: 12px;
}
</style>
