<template>
  <el-dialog :visible.sync="show" :title="`已删除进场特效`" width="1500px" :close-on-click-modal="false">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="特效名称"></el-table-column>
      <el-table-column prop="description" label="特效简介"></el-table-column>
      <el-table-column prop="fileUrl" label="进场特效">
         <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.fileUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="creatorName" label="创建人" ></el-table-column>
      <el-table-column prop="editTime" label="修改时间" ></el-table-column>
      <el-table-column prop="editorName" label="修改人" ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.status === 0">正常</icon-tag>
          <icon-tag type="warning" v-if="scope.row.status === 1">已删除</icon-tag>
        </template>
      </el-table-column>
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
import {
  getDeletedList
} from '../../../api/live/live-enter-effect';

export default {
  name: 'user-freeze-dialog',
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        }
      },
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
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.fileUrl;
      this.dialog.picPreview.show = true;
    },
    showDialog(row) {
      this.loading.table = true;
      this.loading.form = true;
      this.show = true;
      this.queryModel.isDeleted = 1
      this.getDeleteScreen();
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
    getDeleteScreen() {
      getDeletedList({
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
