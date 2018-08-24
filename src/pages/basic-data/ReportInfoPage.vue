<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="userId">
        <el-input v-model.trim="queryModel.userId" placeholder="举报人ID"></el-input>
      </el-form-item>
      <el-form-item prop="accountUserId">
        <el-input v-model.trim="queryModel.accountUserId" placeholder="被举报人ID"></el-input>
      </el-form-item>
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" placeholder="举报类型" clearable>
          <el-option v-for="(item, index) in reportTypeList" :key="index" :value="item.typeId" :label="item.typeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="reportType">
        <el-select v-model="queryModel.reportType" placeholder="举报来源" clearable>
          <el-option v-for="(item, index) in reportInfoTypeList" :key="index" :value="item.type" :label="item.description"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="processed">
        <el-select v-model="queryModel.processed" placeholder="处理状态" clearable>
          <el-option :value="0" :label="'未处理'"></el-option>
          <el-option :value="1" :label="'已处理'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始举报时间" end-placeholder="终止举报时间" value-format="yyyy-MM-dd HH:mm:ss">
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
      <el-button @click="deleteBatch" type="danger" size="small" v-if="hasPermission('report:info:delete')" class="btn-operation" :disabled="selectedIds.length === 0">
        <i class="fa fa-trash"></i>
        <span>批量删除</span>
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="reportId" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="userId" label="举报人ID"></el-table-column>
      <el-table-column prop="accountUserId" label="被举报人ID"></el-table-column>
      <el-table-column prop="nickName" label="举报人昵称"></el-table-column>
      <el-table-column prop="accountNickName" label="被举报人昵称"></el-table-column>
      <el-table-column prop="img" label="截图">
        <template slot-scope="scope">
          <icon-tag type="warning" icon="fa fa-info" v-if="scope.row.img === '' || scope.row.img === null">无截图</icon-tag>
          <table-img-previewer :option="{imgSrc: scope.row.img}"></table-img-previewer>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="举报内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="举报时间"></el-table-column>
      <el-table-column prop="typeId" label="举报类型">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in typeIdStr2ReportTypes(scope.row.typeId)" size="mini" type="info" :key="index" class="report-type-tag">{{ item.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="infoId" label="Info ID"></el-table-column>
      <el-table-column prop="reportType" label="举报来源" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="mini">{{ reportType2Description(scope.row.reportType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="processed" label="处理状态">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.processed === true ? 'success' : 'warning'">{{ scope.row.processed === true ? '已处理' : '未处理'}}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="handlerUsername" label="处理人"></el-table-column>
      <el-table-column prop="processTime" label="处理时间"></el-table-column>
      <!-- 暂时隐藏, 20180620 -->
      <!-- <el-table-column prop="memo" label="备注"></el-table-column> -->
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="更多视频信息" placement="top" v-if="scope.row.reportType === 1">
              <el-button type="info" size="mini" @click="openVideoDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="更多视频评论信息" placement="top" v-if="scope.row.reportType === 3">
              <el-button type="info" size="mini" @click="openVideoDetaiCommentlDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="更多朋友圈评论信息" placement="top" v-if="scope.row.reportType === 11">
              <el-button type="info" size="mini" @click="openFriendRingCommentlDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
             <el-tooltip class="item" effect="dark" content="更多朋友圈信息" placement="top" v-if="scope.row.reportType === 4">
              <el-button type="info" size="mini" @click="openFriendRingDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="更多个人信息" placement="top" v-if="scope.row.reportType === 5">
              <el-button type="info" size="mini" @click="openUserDetailDialog(scope.row)">
                <i class="fa fa-info"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="hasPermission('report:info:delete')">
              <el-button type="danger" size="mini" @click="deleteSingle(scope.row)">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="标记处理" placement="top" v-if="hasPermission('report:info:update') && scope.row.processed === false">
              <el-button type="success" size="mini" @click="processConfirm(scope.row)">
                <i class="fa fa-check"></i>
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
    <user-report-dialog ref="userReportDialog" @done="query"></user-report-dialog>
    <video-report-dialog ref="videoReportDialog" @done="query"></video-report-dialog>
    <video-report-Comment-dialog ref="videoCommentReportDialog" @done="query"></video-report-Comment-dialog>
    <friend-Ring-Commentl-Dialog ref="friendRingCommentlDialog" @done="query"></friend-Ring-Commentl-Dialog>
    <friend-Ring-Dialog ref="friendRingDialog" @done="query"></friend-Ring-Dialog>
  </div>
</template>

<script>
import {
  getReportInfoList,
  updateReportInfo,
  deleteReportInfo
} from '../../api/basic-data/report-info';
import { getAllReportType } from '../../api/basic-data/report-type';
import {
  PROMPT_MSG_REG_EXPRESSION,
  REPORT_TYPE_LIST
} from '../../utils/constants';
import UserReportDialog from './dialogs/UserReportDialog';
import VideoReportDialog from './dialogs/VideoReportDialog';
import VideoCommentReportDialog from './dialogs/VideoCommentReportDialog';
import FriendRingCommentlDialog from './dialogs/FriendRingCommentlDialog';
import FriendRingDialog from './dialogs/FriendRingDialog';

export default {
  name: 'report-info-page',

  components: {
    'user-report-dialog': UserReportDialog,
    'video-report-dialog': VideoReportDialog,
    'video-report-Comment-dialog': VideoCommentReportDialog,
    'friend-Ring-Commentl-Dialog': FriendRingCommentlDialog,
    'friend-Ring-Dialog': FriendRingDialog

  },

  data() {
    return {
      reportTypeList: [],
      reportInfoTypeList: REPORT_TYPE_LIST,
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        userId: null,
        accountUserId: null,
        typeId: null,
        reportType: null,
        processed: null,
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
  methods: {
    openVideoDetailDialog(row) {
      this.$refs.videoReportDialog.openDetailDialog(row);
    },
    openUserDetailDialog(row) {
      this.$refs.userReportDialog.openDetailDialog(row);
    },
    openVideoDetaiCommentlDialog(row) {
      this.$refs.videoCommentReportDialog.openDetailDialog(row);
    },
    openFriendRingCommentlDialog(row) {
      this.$refs.friendRingCommentlDialog.openDetailDialog(row);
    },
    openFriendRingDialog(row) {
      this.$refs.friendRingDialog.openDetailDialog(row);
    },
    typeIdStr2ReportTypes(typeId) {
      if (
        this.reportTypeList &&
        this.reportTypeList.length > 0 &&
        typeId !== ''
      ) {
        if (typeId.indexOf(',') === -1) {
          return this.reportTypeList.filter(
            item => item.typeId === Number.parseInt(typeId)
          );
        }
        let ids = typeId.split(',');
        return this.reportTypeList.filter(
          item => ids.indexOf(item.typeId.toString()) !== -1
        );
      }
      return [];
    },
    reportType2Description(reportType) {
      if (this.reportInfoTypeList && this.reportInfoTypeList.length > 0) {
        let type = this.reportInfoTypeList.find(
          item => item.type === reportType
        );
        return type ? type.description : '未知来源';
      }
      return '未知来源';
    },
    processConfirm(row) {
      this.$prompt('请输入处理结果描述', '处理举报信息', {
        inputPattern: PROMPT_MSG_REG_EXPRESSION,
        inputErrorMessage: '请输入1-20字处理结果描述'
      })
        .then(({ value }) => {
          let msg = {
            reportId: row.reportId,
            memo: value
          };
          updateReportInfo(msg)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.reportId);
      }
    },
    deleteSingle(row) {
      this.$confirm('确定要删除举报信息?', '举报信息删除', {
        type: 'warning'
      })
        .then(() => {
          deleteReportInfo(row.reportId)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
    },
    deleteBatch() {
      this.$confirm('确定要删除选中的举报信息?', '举报信息批量删除', {
        type: 'warning'
      })
        .then(() => {
          deleteReportInfo(this.selectedIds)
            .then(resp => {
              this.$message.success('操作成功');
              this.getTableData();
            })
            .catch(errorMsg => {});
        })
        .catch(() => {});
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
      // 显示表格loading
      this.loading.table = true;
      getReportInfoList({
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
    initReportTypeSelectData() {
      getAllReportType()
        .then(({ data }) => {
          this.reportTypeList = data.list;
        })
        .catch(errorMsg => {});
    }
  },
  created() {
    this.initReportTypeSelectData();
    this.getTableData();
  }
};
</script>

<style scoped>
.img-thumb {
  width: 60px;
  height: 60px;
}
.report-type-tag {
  margin-right: 0.5em;
}
</style>
