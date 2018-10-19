<template>
  <el-dialog :visible.sync="show" :title="`已删除的活动`" width="1500px" :close-on-click-modal="false">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="id" label="Id" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="type" label="活动类型">
        <template slot-scope="scope">
          <icon-tag type='primary'>{{ actionTypes(scope.row.type) }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="活动名称"></el-table-column>
      <el-table-column prop="introduction" label="活动介绍"></el-table-column>
      <el-table-column prop="startTime" label="活动开始时间" sortable="custom"></el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" sortable="custom"></el-table-column>
      <el-table-column prop="webPageUrl" label="活动页面URL"></el-table-column>
      <el-table-column prop="coverImgUrl" label="活动封面URL">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.coverImgUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUserName" label="修改人" ></el-table-column>
      <el-table-column prop="editTime" label="修改时间" sortable="custom"></el-table-column>
    </el-table>
     <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <el-dialog :visible.sync="dialog.picPreview.show" :append-to-body="true">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <span slot="footer">
      <el-button @click="show = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAppActivityList } from '../../../api/app/app-activity';
import { APP_ACTIVITY_TYPES } from '../../../utils/constants';

export default {
  name: 'app-deleted-activity',
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
      activitysTypes: APP_ACTIVITY_TYPES,
      tableData: [],
      pager: {
        page: 1,
        limit: 10,
        total: 0
      },
      sorter: {
        prop: null,
        order: null
      },
      queryModel: {
        isDeleted: null
      },
      show: false,
      loading: {
        table: false,
        form: false
      }
    };
  },
  methods: {
    actionTypes(types) {
      if (this.activitysTypes) {
        return this.activitysTypes.find(
          item => item.type === types
        ).name;
      }
      return '未知状态';
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.coverImgUrl;
      this.dialog.picPreview.show = true;
    },
    showDialog(row) {
      this.loading.table = true;
      this.loading.form = true;
      this.show = true;
      this.queryModel.isDeleted = 1
      this.getDeleteActivitys();
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
    getDeleteActivitys() {
      getAppActivityList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
          this.loading.table = false;
        })
        .catch(err => {});
    }
  }
};
</script>
