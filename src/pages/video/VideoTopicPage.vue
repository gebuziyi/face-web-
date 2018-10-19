<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="tname">
        <el-input v-model.trim="queryModel.tname" placeholder="话题名称"></el-input>
      </el-form-item>
      <el-form-item prop="hot">
        <el-select v-model="queryModel.hot" placeholder="是否热门" clearable>
          <el-option :value="0" label="普通话题"></el-option>
          <el-option :value="1" label="热门话题"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始创建时间" end-placeholder="终止创建时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('video:topic:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
      <el-button @click="openCreateDialog" type="success" size="small" v-if="hasPermission('video:topic:save')" class="btn-operation">
        <i class="fa fa-plus"></i>
        <span>创建话题</span>
      </el-button>
      <el-button @click="showSortDialog" type="primary" size="small" v-if="hasPermission('video:topic:sort')" class="btn-operation">
        <i class="fa fa-sort-numeric-desc"></i>
        <span>热门话题排序</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="onSelectionChange" @sort-change="onSortChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="topicId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="tname" label="话题名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="img" label="话题图标">
        <template slot-scope="scope">
          <table-img-previewer :option="scope.row | row2ImgPreviewOption"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="介绍" show-overflow-tooltip></el-table-column>
      <el-table-column prop="videoCount" label="视频数量">
        <template slot-scope="scope">
          <el-button size="mini" @click="openTopicVideoDialog(scope.row)" :disabled="scope.row.videoCount === 0">{{ scope.row.videoCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="创建人昵称"></el-table-column>
      <el-table-column prop="userId" label="创建人ID"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="150"></el-table-column>
      <el-table-column prop="hot" label="热门状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.hot === true ? 'danger' : 'info'" :icon="scope.row.hot === true ? 'fa fa-fire' : ''">{{ scope.row.hot === true ? '热门话题' : '普通话题'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="hasPermission('video:topic:update')">
              <el-button type="warning" size="mini" @click="openEditDialog(scope.row)">
                <i class="fa fa-edit"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="推荐热门" placement="top" v-if="hasPermission('video:topic:hot') && scope.row.hot === false">
              <el-button type="danger" size="mini" @click="showMakeHotConfirm(scope.row)">
                <i class="fa fa-fire"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消热门" placement="top" v-if="hasPermission('video:topic:hot') && scope.row.hot === true">
              <el-button type="primary" size="mini" @click="showCancelHotConfirm(scope.row)">
                <i class="fa fa-ban"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('video:topic:delete') && scope.row.hot === false">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
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
    <!-- 弹窗 -->
    <create-dialog ref="createDialog" @done="getTableData()"></create-dialog>
    <edit-dialog ref="editDialog" @done="getTableData()"></edit-dialog>
    <sort-dialog ref="sortDialog" @done="getTableData()"></sort-dialog>
    <topic-video-dialog ref="topicVideoDialog" @done="getTableData()"></topic-video-dialog>
  </div>
</template>

<script>
import {
  getVideoTopicList,
  removeVideoTopic,
  makeTopicHot,
  cancelTopicHot
} from '../../api/video/video-topic';
import VideoTopicCreateDialog from './dialogs/VideoTopicCreateDialog';
import VideoTopicEditDialog from './dialogs/VideoTopicEditDialog';
import HotVideoTopicSortDialog from './dialogs/HotVideoTopicSortDialog';
import VideoTopicVideoDialog from './dialogs/VideoTopicVideoDialog';
import { getAllLoginAdminVest } from '../../api/sys/sys-user-vest';

export default {
  name: 'video-topic-page',
  components: {
    'create-dialog': VideoTopicCreateDialog,
    'edit-dialog': VideoTopicEditDialog,
    'sort-dialog': HotVideoTopicSortDialog,
    'topic-video-dialog': VideoTopicVideoDialog
  },
  data() {
    return {
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        tname: null,
        hot: null,
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
    row2ImgPreviewOption: row => {
      const option = {
        imgSrc: row.img,
        title: `话题图片预览: ${row.tname}`
      };
      return option;
    }
  },
  methods: {
    openTopicVideoDialog(row) {
      this.$refs.topicVideoDialog.showDialog(row);
    },
    showSortDialog() {
      this.$refs.sortDialog.showDialog();
    },
    showMakeHotConfirm(row) {
      const h = this.$createElement;

      this.$confirm(
        h('div', null, [
          h('p', null, '此操作将把话题:'),
          h(
            'span',
            {
              style: {
                display: 'block',
                'font-weight': 'bold',
                color: 'brown',
                'line-height': '2em',
                padding: '1em'
              }
            },
            row.tname
          ),
          h('p', null, '设置为热门推荐， 是否继续?')
        ]),
        '推荐视频话题',
        {
          type: 'warning'
        }
      )
        .then(() => {
          makeTopicHot(row.topicId)
            .then(resp => {
              this.$message.success('推荐成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showCancelHotConfirm(row) {
      const h = this.$createElement;

      this.$confirm(
        h('div', null, [
          h('p', null, '此操作将取消话题:'),
          h(
            'span',
            {
              style: {
                display: 'block',
                'font-weight': 'bold',
                color: 'brown',
                'line-height': '2em',
                padding: '1em'
              }
            },
            row.tname
          ),
          h('p', null, '的热门推荐状态， 是否继续?')
        ]),
        '取消推荐视频话题',
        {
          type: 'warning'
        }
      )
        .then(() => {
          cancelTopicHot(row.topicId)
            .then(resp => {
              this.$message.success('取消推荐成功');
              this.getTableData();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    onSortChange({ column, prop, order }) {
      this.sorter.prop = prop;
      this.sorter.order = order;
      this.getTableData();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.topicId);
      }
    },
    deleteBatch() {
      this.$confirm('此操作将删除所选择的视频话题', '批量删除确认')
        .then(() => {
          // 表格loading
          this.loading.table = true;
          removeVideoTopic(this.selectedIds)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    deleteSingle(row) {
      const h = this.$createElement;

      this.$confirm(
        h('div', null, [
          h('p', null, '此操作将删除话题:'),
          h(
            'span',
            {
              style: {
                display: 'block',
                'font-weight': 'bold',
                color: 'brown',
                'line-height': '2em',
                padding: '1em'
              }
            },
            row.tname
          ),
          h('p', null, '是否继续?')
        ]),
        '删除确认',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading.table = true;
          removeVideoTopic(row.topicId)
            .then(({ data }) => {
              this.$message.success('删除成功');
              // 刷新表格数据
              this.getTableData();
            })
            .catch(msg => {
              this.loading.table = false;
            });
        })
        .catch(() => {
          // 用户点击了取消, do nothing
        });
    },
    openCreateDialog() {
      const userId =
        this.$store.state.user.userId | localStorage.getItem('userId');

      getAllLoginAdminVest(userId)
        .then(({ data }) => {
          if (data.list && data.list.length > 0) {
            this.$refs.createDialog.showDialog(data.list);
          } else {
            this.$message.error('没有可用的马甲账号, 请先添加马甲账号');
          }
        })
        .catch(error => {
          this.$message.error('无法获取关联的马甲账号');
        });
    },
    openEditDialog(row) {
      this.$refs.editDialog.showDialog(row.topicId);
    },
    onQueryBtnClick() {
      this.pager.page = 1;
      this.query();
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.query();
    },
    onCurrentPageChange(currentPage) {
      this.pager.page = currentPage;
      this.query();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      this.imgFileList = [];
      getVideoTopicList({
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
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>
.msgbox .tname {
  font-weight: bold;
  line-height: 3em;
  padding-left: 2em;
  color: brown;
}
</style>
