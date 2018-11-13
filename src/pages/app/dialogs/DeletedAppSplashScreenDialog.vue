<template>
  <el-dialog :visible.sync="show" :title="`已删除的启动页`" width="1500px" :close-on-click-modal="false">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column prop="id" label="Id" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="type" label="启动页类型">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.type === 1 ? 'primary' : 'success'">{{ isType(scope.row.type) }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileUrl" label="启动页url">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.fileUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="clickable" label="是否可点击">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.clickable === true ? 'success' : 'warning'">{{ scope.row.clickable === true ?'可点击':'不可点击' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stayTime" label="停留时间(秒)" sortable="custom"></el-table-column>
      <el-table-column prop="skippable" label="是否显示跳过按钮">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.skippable === true ? 'success' : 'warning'">{{ scope.row.skippable === true ?'可跳过':'不可跳过' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="clickAction" label="点击完成的动作">
        <template slot-scope="scope">
          <el-tag size="mini" type="success">
            <i class="fa fa-desktop"></i>
            <span style="padding-left: 0.5em">{{ actionStatus(scope.row.clickAction) }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="actionData" label="完成动作需要的数据"></el-table-column>
      <el-table-column prop="enableTime" label="生效时间" sortable="custom"></el-table-column>
      <el-table-column prop="disableTime" label="失效时间" sortable="custom"></el-table-column>
      <el-table-column prop="deleted" label="是否已删除">
        <template slot-scope="scope">
          <icon-tag :type="scope.row.deleted === true ? 'warning' : 'success'">{{ scope.row.deleted === true ?'已删除':'未删除' }}</icon-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom"></el-table-column>
      <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
      <el-table-column prop="editTime" label="上次修改时间" sortable="custom"></el-table-column>
      <el-table-column prop="editorUserName" label="上次修改人"></el-table-column>
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
import { getAppSplashScreenList } from '../../../api/app/app-splash-screen';
import { APP_SPLASH_SCREEN_CLICKACTIONS } from '../../../utils/constants';

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
      clickActionStatusList: APP_SPLASH_SCREEN_CLICKACTIONS,
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
    isType(status) {
      if (status === 1) {
        return '视频';
      } else {
        return '图片';
      }
    },
    actionStatus(clickAction) {
      if (this.clickActionStatusList) {
        return this.clickActionStatusList.find(
          item => item.type === clickAction
        ).name;
      }
      return '未知状态';
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
      this.getDeleteScreen();
    },
    onSelectionChange(rows) {
      if (rows) {
        this.selectedIds = rows.map(data => data.id);
      }
    },
    query() {
      this.loading.table = true;
      this.getDeleteScreen();
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
      getAppSplashScreenList({
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
