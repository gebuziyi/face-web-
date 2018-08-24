<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <el-form-item prop="title">
        <el-input v-model.trim="queryModel.title" placeholder="问答标题"></el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="回复人用户名"></el-input>
      </el-form-item>
      <el-form-item prop="bestAnswer">
        <el-select v-model="queryModel.bestAnswer" clearable placeholder="最佳答案">
          <el-option :value="1" label="只看最佳答案"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="awesome">
        <el-select v-model="queryModel.awesome" clearable placeholder="神回复">
          <el-option :value="1" label="只看神回复"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始回复时间" end-placeholder="终止回复时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model.trim="queryModel.address" placeholder="回复地址"></el-input>
      </el-form-item>
    </el-form>
    <!-- 查询表单 end-->
    <!-- 按钮 -->
    <div class="btn-wrapper">
      <el-button @click="query" type="primary" size="small">
        <i class="fa fa-search"></i>
        <span>搜索</span>
      </el-button>
      <el-button type="text" size="mini" @click="$refs.queryForm.resetFields()">重置</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading.table" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @sort-change="onSortChange" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column prop="replyId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="title" label="问答标题"></el-table-column>
      <el-table-column prop="content" label="内容">
        <template slot-scope="scope">
          <el-popover ref="content-popover" placement="top-start" title="问答内容" trigger="hover">
            <span>{{ scope.row.content }}</span>
          </el-popover>
          <span v-popover:content-popover>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="封面图片">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.cover" class="img-thumb" v-popover:imgpopover @click="showPicPreviewDialog(scope.row.cover)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="视频">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.video === ''">
            <span>无视频</span>
          </el-tag>
          <el-tooltip v-else class="item" effect="dark" content="点击查看视频" placement="top">
            <el-button size="mini" type="primary" @click="showVideoPreviewDialog(scope.row.video)">
              <i class="fa fa-play"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="likeNum" label="点赞数" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.likeNum }}</span>
          <i class="pd-left-5 fa fa-thumbs-up"></i>
        </template>
      </el-table-column>
      <el-table-column prop="makeNum" label="吐槽数" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.makeNum }}</span>
          <i class="pd-left-5 fa fa-thumbs-down"></i>
        </template>
      </el-table-column>
      <el-table-column prop="bestAnswer" label="最佳答案">
        <template slot-scope="scope">
          <template v-if="scope.row.bestAnswer === true">
            <icon-tag type="success" icon="fa fa-smile-o">最佳!</icon-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="awesome" label="神回复">
        <template slot-scope="scope">
          <template v-if="scope.row.awesome === true">
            <icon-tag type="success" icon="fa fa-hand-papper-o">神!</icon-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="username" label="回复人"></el-table-column>
      <el-table-column prop="createTime" label="回复时间" sortable="custom" width="110"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <!-- TODO: 审核按钮 -->
            <template v-if="hasPermission('qa:reply:check') && scope.row.checked === true">
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top">
                <el-button type="danger" size="mini" @click="doUpdateReviewStatus(scope.row)">
                  <i class="fa fa-times"></i>
                </el-button>
              </el-tooltip>
            </template>
            <template v-else>
              <el-tag type="danger" size="mini">
                <span>审核未通过</span>
              </el-tag>
            </template>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialog.picPreview.show" title="封面图片预览">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <el-dialog :visible.sync="dialog.videoPreview.show" title="问答视频预览">
      <video :src="dialog.videoPreview.videoSrc" class="video-preview" controls/>
    </el-dialog>
  </div>
</template>

<script>
import { getQaReplyList, updateCheckStatus } from '../../api/qa/qa-reply';

export default {
  name: 'qa-reply-page',
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
        }
      },
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        title: null,
        username: null,
        bestAnswer: null,
        awesome: null,
        createTime: null,
        address: null
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
    showPicPreviewDialog(picSrc) {
      this.dialog.picPreview.picSrc = picSrc;
      this.dialog.picPreview.show = true;
    },
    showVideoPreviewDialog(url) {
      this.dialog.videoPreview.videoSrc = url;
      this.dialog.videoPreview.show = true;
    },
    doUpdateReviewStatus(row) {
      this.$confirm('确定要将此回复设为审核不通过?')
        .then(() => {
          updateCheckStatus(row.replyId)
            .then(data => {
              this.$message.success('操作成功!');
              this.getTableData();
            })
            .catch(msg => {});
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
        this.selectedIds = rows.map(data => data.infoId);
      }
    },
    query() {
      this.loading.table = true;
      this.getTableData();
    },
    onSizeChange(size) {
      this.pager.limit = size;
      this.loading.table = true;
      this.getTableData();
    },
    onCurrentPageChange(page) {
      this.pager.page = page;
      this.loading.table = true;
      this.getTableData();
    },
    getTableData() {
      // 显示表格loading
      this.loading.table = true;
      getQaReplyList({
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
.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
  overflow: hidden;
}

.img-preview {
  display: block;
  margin: auto auto;
  width: 50%;
  overflow: hidden;
}

.video-preview {
  display: block;
  margin: auto auto;
  height: 40%;
  width: 40%;
}
</style>
