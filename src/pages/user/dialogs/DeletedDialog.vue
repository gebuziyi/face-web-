<template>
  <el-dialog :visible.sync="show" :title="`已删除进场特效`" width="1500px" :close-on-click-modal="false">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="挂件名称"></el-table-column>
       <el-table-column prop="introduction" label="挂件介绍"></el-table-column>
      <el-table-column prop="url" label="挂件图片">
         <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.url" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="挂件优先级"></el-table-column>
      <el-table-column prop="module" label="挂饰所属模块">
        <template slot-scope="scope">
            <option v-if="scope.row.module ===1">直播</option>
            <option v-if="scope.row.module ===2">短视频</option>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" ></el-table-column>
      <el-table-column prop="username" label="创建人" ></el-table-column>
      <el-table-column prop="editTime" label="修改时间" ></el-table-column>
      <el-table-column prop="editname" label="修改人" ></el-table-column>
      <el-table-column prop="isDeleted" label="状态">
        <template slot-scope="scope">
          <icon-tag type="success" v-if="scope.row.isDeleted === 0">正常</icon-tag>
          <icon-tag type="warning" v-if="scope.row.isDeleted === 1">已删除</icon-tag>
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
  deleteGetList
} from '../../../api/user/avatar-accessory-info';

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
      deleteGetList({
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
