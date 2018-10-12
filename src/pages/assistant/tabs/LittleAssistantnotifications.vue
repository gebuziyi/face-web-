<template>
  <div>
    <div class="activity-form-wrapper">
      <h3>发布小助手通知</h3>
      <el-row style="padding: 15px;">
        <el-button class="btn-operation" type="primary" size="mini" @click="doPushAppoint">
         指定用户
        </el-button>
      </el-row>
      <el-form class="activity-form" size="small" :model="model" :rules="rules" label-position="left" label-width="120px" label-high="500px" ref="videoTopicForm">
        <el-form-item label="通知介绍" prop="text">
          <el-input v-model.trim="model.text" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="doPublish" size="small" :loading="btnLoading">确认发布</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-wrapper">
      <h4>通知发布记录</h4>
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="createTime">
          <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发布时间" end-placeholder="发布时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div class="btn-wrapper">
      <el-button @click="onQueryBtnClick" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
        <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
        <el-table-column prop="msgId" label="ID" sortable="custom" width="80"></el-table-column>
        <el-table-column prop="msgData" label="活动介绍" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row | parseText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgCreateTime" label="发送时间" width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="danger" size="mini" @click="deleteActivityMsg(scope.row)">
                  <i class="fa fa-trash"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
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
    <!-- 修改系统参数 -->
    <el-dialog :visible.sync="dialog.edit.show" title="修改系统参数" width="1200px">
      <div v-loading="dialog.edit.loading" class="edit-form-wrapper">
        <el-form size="small" :model="dialog.edit.model" :rules="dialog.edit.rules" label-position="left" label-width="120px" ref="editForm">
         <!-- <el-form-item label="修改活动介绍" prop="txt">
            <el-input type="text" v-model.trim="dialog.edit.model.msgData"></el-input>
          </el-form-item> -->
          <el-form-item label="修改活动介绍" prop="txt">
            <el-input type="textarea" v-model.trim="dialog.edit.model.txt"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="dialog.edit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="doEdit" size="small" :loading="dialog.edit.btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { sendLittleAssistantnotificationsMsg } from '../../../api/assistant/official-activity';
import { debounce } from 'lodash';
import { searchLittleAssistantnotificationsByName } from '../../../api/fuzzy-search';
import DoPushByAppointUser from '../dialogs/DoPushByAppointUser';
import {
  getLittleAssistantChatMsgPage,
  deleteMsg,
  getDetailList,
  updateSysConfig
} from '../../../api/assistant/assistant-ChatMsg';
import { emptyassistant } from '../../../utils/empty-model';
export default {
  name: 'h5-activity-publish-tab',

  components: {
    'push-by-appoint': DoPushByAppointUser
  },

  data() {
    return {
      tableData: [],
      dialog: {
        edit: {
          model: emptyassistant(),
          rules: {
            txt: [
              { required: true, trigger: 'change', message: '活动介绍不能为空' }
            ]
          },
          show: false,
          formLoading: true,
          btnLoading: false
        }
      },
      queryModel: {
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
      videoTopicList: [],
      loading: {
        select: {
          topic: false
        }
      },
      model: {
        id: null,
        text: null
      },
      rules: {
        text: [
          {
            required: true,
            trigger: 'change',
            message: '通知不能为空'
          }
        ]
      },
      btnLoading: false
    };
  },

  filters: {
    parseText: function(row) {
      return JSON.parse(row.msgData).Text;
    },

    parseName: function(row) {
      return JSON.parse(row.msgData).Name;
    },

    parseId: function(row) {
      return JSON.parse(row.msgData).Id;
    },

    parseImageOption: function(msg) {
      const msgDataStr = msg.msgData;
      return {
        imgSrc: JSON.parse(msgDataStr).Image
      };
    }
  },

  methods: {
    doPushAppoint() {
      this.$refs.appointUser.showDialog();
    },
    deleteActivityMsg(row) {
      this.$confirm(
        `此操作将删除视频话题活动消息, 删除后所有用户的小助手页面都将看不到此消息, 是否继续?`,
        '删除视频话题活动消息确认',
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

    remoteSearchVideoTopic: debounce(function(query) {
      // 搜索音乐名称
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.mname = true;
      searchLittleAssistantnotificationsByName(query.trim())
        .then(({ data }) => {
          this.videoTopicList = data.list;
          this.loading.select.topic = false;
        })
        .catch(error => {});
    }, 500),
    getTableData() {
      this.loading.table = true;
      getLittleAssistantChatMsgPage({
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
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    openEditDialog(row) {
      this.dialog.edit.show = true;
      getDetailList(row.msgId)
        .then(({ data }) => {
          let msgData = JSON.parse(data.detail.msgData);
          this.dialog.edit.model.msgId = data.detail.msgId;
          this.dialog.edit.model.txt = msgData.Text;
          this.dialog.edit.model.msgType = data.detail.msgType;
          this.dialog.edit.formLoading = false;
        })
        .catch(error => {
          // 获取详情失败, 关闭修改弹窗
          this.dialog.edit.show = false;
        });
    },
    doEdit() {
      // 验证表单有效性
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateSysConfig(this.dialog.edit.model)
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
    query() {
      this.loading.table = true;
      this.getTableData();
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
    doPublish() {
      this.$refs.videoTopicForm.validate(valid => {
        if (valid === false) {
          return;
        }
        this.$confirm(
          `是否要发布一条视频话题活动通知给所有用户?`,
          '活动通知发布确认',
          {
            type: 'warning'
          }
        )
          .then(() => {
            sendLittleAssistantnotificationsMsg(this.model)
              .then(resp => {
                this.$message.success('活动发布成功!');
                this.$refs.videoTopicForm.resetFields();
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
