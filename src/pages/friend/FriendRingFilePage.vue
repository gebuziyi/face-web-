<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="type">
        <el-select v-model="queryModel.type" placeholder="文件类型" clearable>
          <el-option :value="1" label="图片"></el-option>
          <el-option :value="2" label="视频"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="上传时间" end-placeholder="上传时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
      <el-table-column prop="fileId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="type" label="文件类型">
        <template slot-scope="scope">
          <el-tag :type="type2IconTagOption(scope.row.type).tagType" size="mini">
            <i :class="type2IconTagOption(scope.row.type).iconClass" style="padding-right: 0.5em"></i>
            <span>{{ type2IconTagOption(scope.row.type).description }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileSmallUrl" label="图片文件">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top" v-if="scope.row.type === 1">
            <img :src="scope.row.fileSmallUrl" class="img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="fileUrl" label="视频文件">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看视频" placement="top" v-if="scope.row.type === 2">
            <el-button size="mini" type="primary" @click="showVideoPreviewDialog(scope.row)">
              <i class="fa fa-play"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" sortable="custom"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="URL信息" placement="top">
              <el-button type="info" size="mini" @click="showUrlInfoDialog(scope.row)">
                <i class="fa fa-link"></i>
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
    <el-dialog :visible.sync="dialog.urlInfo.show" :title="`URL信息: `" width="1000px">
      <div class="create-form-wrapper">
        <el-form size="small" :model="dialog.urlInfo.model" label-position="left" label-width="150px" ref="infoForm">
          <template v-if="dialog.urlInfo.model.type === 1">
            <el-form-item label="大图文件URL">
              <span class="detail-span" v-text="dialog.urlInfo.model.fileUrl"></span>
            </el-form-item>
            <el-form-item label="缩略图文件URL">
              <span class="detail-span" v-text="dialog.urlInfo.model.fileSmallUrl"></span>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="视频文件URL">
              <span class="detail-span" v-text="dialog.urlInfo.model.fileUrl"></span>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="dialog.urlInfo.show = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`朋友圈图片预览`">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <el-dialog :visible.sync="dialog.videoPreview.show" :title="`朋友圈视频预览`">
      <video :src="dialog.videoPreview.videoSrc" class="video-preview" controls/>
    </el-dialog>
  </div>
</template>

<script>
import { getFriendRingFileList } from '../../api/friend/friend-ring-file';

export default {
  name: 'friend-ring-file-page',
  data() {
    return {
      dialog: {
        picPreview: {
          show: false,
          picSrc: null
        },
        videoPreview: {
          show: false,
          videoSrc: null
        },
        urlInfo: {
          show: false,
          model: {
            fileUrl: null,
            fileSmallUrl: null,
            type: null
          }
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        type: null,
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
    showUrlInfoDialog(row) {
      this.dialog.urlInfo.model = row;
      this.dialog.urlInfo.show = true;
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.fileUrl;
      this.dialog.picPreview.show = true;
    },
    showVideoPreviewDialog(row) {
      this.dialog.videoPreview.videoSrc = row.fileUrl;
      this.dialog.videoPreview.show = true;
    },
    type2IconTagOption(type) {
      let result = {
        type: type,
        description: null,
        tagType: null,
        iconClass: null
      };

      if (type === 1) {
        result.description = '图片文件';
        result.tagType = '';
        result.iconClass = 'fa fa-picture-o';
      } else {
        result.description = '视频文件';
        result.tagType = 'success';
        result.iconClass = 'fa fa-video-camera';
      }

      return result;
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
      getFriendRingFileList({
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

<style scoped>

</style>
