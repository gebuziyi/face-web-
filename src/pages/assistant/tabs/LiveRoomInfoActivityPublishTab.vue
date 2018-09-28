<template>
  <div>
    <div class="tab-wrapper">
      <h4>活动发布记录</h4>
      <!-- 查询表单 start-->
      <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
        <el-form-item prop="createTime">
          <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始冻结时间" end-placeholder="终止冻结时间" value-format="yyyy-MM-dd HH:mm:ss">
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
        <el-table-column prop="msgData" label="直播间ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row | parseId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fromImg" label="直播间封面" width="110">
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
import { debounce } from 'lodash';
import { searchMusicListByName } from '../../../api/fuzzy-search';
import {
  getAssistantChatMsgByLiveRoomPage,
  deleteMsg
} from '../../../api/assistant/assistant-ChatMsg';

export default {
  name: 'live-activity-publish-tab',

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
      musicList: [],
      loading: {
        select: {
          mname: false
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
            message: '音乐信息不能为空'
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
        `此操作将删除直播间活动消息, 删除后所有用户的小助手页面都将看不到此消息, 是否继续?`,
        '删除视频直播间消息确认',
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

    remoteSearchMusicListByName: debounce(function(query) {
      // 搜索音乐名称
      if (query === null || query.trim() === '') {
        return;
      }

      this.loading.select.mname = true;
      searchMusicListByName(query.trim())
        .then(({ data }) => {
          this.musicList = data.list;
          this.loading.select.mname = false;
        })
        .catch(error => {});
    }, 500),
    getTableData() {
      this.loading.table = true;
      getAssistantChatMsgByLiveRoomPage({
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
