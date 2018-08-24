<template>
  <div>
    <div class="activity-form-wrapper">
      <h3>发布视频话题活动</h3>
      <el-form class="activity-form" size="small" :model="model" :rules="rules" label-position="left" label-width="120px" ref="videoTopicForm">
        <el-form-item label="活动介绍" prop="text">
          <el-input v-model.trim="model.text" type="textarea"></el-input>
        </el-form-item>
        <el-form-item prop="id" label="视频话题">
          <el-select v-model="model.id" clearable placeholder="键入搜索视频话题" filterable :filter-method="remoteSearchVideoTopic" remote :loading="loading.select.topic">
            <template v-for="item in videoTopicList">
              <el-option :label="item.tname" :value="item.topicId" :key="item.topicId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="doPublish" size="small" :loading="btnLoading">确认发布</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-wrapper">
      <h4>活动发布记录</h4>
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
        <el-table-column prop="msgData" label="活动介绍" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row | parseText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgData" label="话题ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row | parseId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgData" label="话题名称" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row | parseName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgData" label="话题封面" width="80">
          <template slot-scope="scope">
            <table-img-previewer :option="scope.row | parseImageOption"></table-img-previewer>
          </template>
        </el-table-column>
        <el-table-column prop="msgCreateTime" label="发送时间" width="160"></el-table-column>
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
import { sendVideoTopicMsg } from '../../../api/assistant/official-activity';
import { debounce } from 'lodash';
import { searchVideoTopicListByName } from '../../../api/fuzzy-search';
import {
  getAssistantChatMsgByVideoTopicPage,
  deleteMsg
} from '../../../api/assistant/assistant-ChatMsg';

export default {
  name: 'h5-activity-publish-tab',

  data() {
    return {
      tableData: [],
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
            message: '活动介绍不能为空'
          }
        ],
        id: [
          {
            required: true,
            trigger: 'change',
            message: '视频话题不能为空'
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
      searchVideoTopicListByName(query.trim())
        .then(({ data }) => {
          this.videoTopicList = data.list;
          this.loading.select.topic = false;
        })
        .catch(error => {});
    }, 500),
    getTableData() {
      this.loading.table = true;
      getAssistantChatMsgByVideoTopicPage({
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
    query() {
      this.loading.table = true;
      this.pager.page = 1;
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
            sendVideoTopicMsg(this.model)
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
