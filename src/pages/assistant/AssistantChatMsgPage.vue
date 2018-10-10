<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model="queryModel.userId" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="msgType">
        <el-select v-model="queryModel.msgType" placeholder="选择消息类型" filterable>
          <el-option v-for="item in msgTypes" :key="item.type" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="发送时间" end-placeholder="发送时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="openSearchDialog" type="success" size="small" class="btn-operation">
        <i class="fa fa-search"></i>
        <span>聊天记录窗口</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column prop="msgId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="fromAccount" label="发送人用户ID" width="120"></el-table-column>
      <el-table-column prop="fromNickName" label="发送人昵称" width="120"></el-table-column>
      <el-table-column prop="toAccount" label="接收人用户ID" width="120"></el-table-column>
      <el-table-column prop="toNickName" label="接收人昵称" width="120"></el-table-column>
      <el-table-column prop="msgData" label="消息内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="isTextMsg(scope.row)">{{ scope.row | parseText }}</span>
          <table-img-previewer :option="scope.row | parseImgUrlOption" v-else></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="msgType" label="消息类型" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.msgType | map2TypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="msgCreateTime" label="发送时间" width="160" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="回复" placement="top">
              <el-button type="primary" size="mini" @click="openReplyDialog(scope.row)">
                <i class="fa fa-comment"></i>
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
    <reply-dialog ref="replyDialog" @done="query"></reply-dialog>
    <reply-search-dialog ref="searchDialog"  @done="query"></reply-search-dialog>
  </div>
</template>

<script>
import { getAssistantChatMsgPage } from '../../api/assistant/assistant-ChatMsg';
import AssistantMsgReplyDialog from './dialogs/AssistantMsgReplyDialog';
import { ASSISTANT_MSG_TYPES } from '../../utils/constants';
import AssistantSearchReplyDialog from './dialogs/AssistantSearchReplyDialog';

export default {
  name: 'assistant-ChatMsg',

  components: {
    'reply-dialog': AssistantMsgReplyDialog,
    'reply-search-dialog': AssistantSearchReplyDialog
  },

  data() {
    return {
      msgTypes: ASSISTANT_MSG_TYPES,
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        msgType: null,
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
      }
    };
  },

  filters: {
    map2TypeName: function(msgType) {
      const r = ASSISTANT_MSG_TYPES.find(item => item.type === msgType);
      if (r) {
        return r.name;
      } else {
        return '未知类型';
      }
    },

    parseText: function(msg) {
      const msgDataStr = msg.msgData;
      return JSON.parse(msgDataStr).Text;
    },

    parseImgUrl: function(msg) {
      const msgDataStr = msg.msgData;
      const imageInfoArray = JSON.parse(msgDataStr).ImageInfoArray;
      return imageInfoArray.find(item => item.Type === 3).URL;
    },

    parseImgUrlOption: function(msg) {
      const msgDataStr = msg.msgData;
      const imageInfoArray = JSON.parse(msgDataStr).ImageInfoArray;
      const imgSrc = imageInfoArray.find(item => item.Type === 3).URL;
      return {
        imgSrc: imgSrc
      }
    }
  },

  methods: {
    isTextMsg(msg) {
      return msg.msgType === 201;
    },
    openReplyDialog(row) {
      this.$refs.replyDialog.showDialog(row);
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    query() {
      this.loading.table = true;
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
    getTableData() {
      this.loading.table = true;
      getAssistantChatMsgPage({
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
    openSearchDialog() {
      this.$refs.searchDialog.showDialog();
    }
  },
  created() {
    this.getTableData();
    // 1. 调用接口获取小助手ID
    // 2. 将小助手ID存到vuex中, 参考登录成功之后setUser的调用方法
  }
};
</script>

<style scoped>
</style>
