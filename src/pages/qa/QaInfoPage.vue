<template>
  <div>
    <!-- 查询表单 start-->
    <el-form :inline="true" :model="queryModel" size="small" ref="queryForm">
      <!-- 问答类型 -->
      <el-form-item prop="typeId">
        <el-select v-model="queryModel.typeId" clearable placeholder="问答类型">
          <template v-for="(type, index) in qaTypes">
            <el-option :label="type.typeName" :value="type.typeId" :key="index"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <!-- 问答标题 -->
      <el-form-item prop="title">
        <el-input v-model.trim="queryModel.title" placeholder="问答标题"></el-input>
      </el-form-item>
      <!-- 发布人 -->
      <el-form-item prop="username">
        <el-input v-model.trim="queryModel.username" placeholder="发布人"></el-input>
      </el-form-item>
      <!-- 创建时间区间 -->
      <el-form-item prop="createTime">
        <el-date-picker v-model="queryModel.createTime" type="datetimerange" range-separator="至" start-placeholder="起始发布时间" end-placeholder="终止发布时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="amountType">
        <el-select v-model="queryModel.amountType" clearable placeholder="悬赏类型">
          <el-option v-for="item in amountTypes" :value="item.type" :label="item.name" :key="item.type"></el-option>
        </el-select>
      </el-form-item>
      <!-- 置顶状态 -->
      <el-form-item prop="top">
        <el-select v-model="queryModel.top" clearable placeholder="置顶状态">
          <el-option :value="0" label="未置顶"></el-option>
          <el-option :value="1" label="已置顶"></el-option>
        </el-select>
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
      <el-table-column prop="infoId" label="ID" sortable="custom" width="60"></el-table-column>
      <el-table-column prop="typeName" label="类型名称"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="cover" label="封面图片">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.cover" class="img-thumb" v-popover:imgpopover @click="showPicPreviewDialog(scope.row.cover)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容">
        <template slot-scope="scope">
          <el-popover ref="content-popover" placement="top-start" title="问答内容" trigger="hover">
            <span>{{ scope.row.content }}</span>
          </el-popover>
          <span v-popover:content-popover>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="视频">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.video === ''" size="mini">
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
      <el-table-column prop="replyNum" label="回复数" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.replyNum }}</span>
          <i class="pd-left-5 fa fa-comments"></i>
        </template>
      </el-table-column>
      <el-table-column prop="amountType" label="悬赏类型" width="110">
        <template slot-scope="scope">
          <span>{{ amountType2Name(scope.row.amountType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="top" label="置顶状态">
        <template slot-scope="scope">
          <template v-if="scope.row.top === true">
            <icon-tag type="warning" icon="fa fa-thumb-tack">已置顶!</icon-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="country" label="国家"></el-table-column>
      <el-table-column prop="publisherUsername" label="发布人"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" sortable="custom" width="110"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <template v-if="scope.row.checked === false">
              <el-tag type="danger" size="mini">
                <span>审核未通过</span>
              </el-tag>
            </template>
            <!-- 审核通过/不通过 -->
            <template v-else>
              <el-tooltip class="item" effect="dark" content="审核不通过" placement="top" v-if="hasPermission('qa:info:check')">
                <el-button type="danger" size="mini" @click="doUpdateCheckStatus(scope.row)">
                  <i class="fa fa-times"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.top === true ? '取消置顶' : '置顶'" placement="top" v-if="hasPermission('qa:info:top')">
                <!-- 置顶/取消置顶按钮 -->
                <el-button type="primary" size="mini" @click="doUpdateTop(scope.row)">
                  <i class="fa fa-thumb-tack"></i>
                </el-button>
              </el-tooltip>
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
      <img :src="dialog.picPreview.picSrc" class="img-preview"/>
    </el-dialog>
    <el-dialog :visible.sync="dialog.videoPreview.show" title="问答视频预览">
      <video :src="dialog.videoPreview.videoSrc" class="video-preview" controls/>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQaInfoList,
  updateTopSetting,
  updateCheckStatus,
  getAllAmountType
} from '../../api/qa/qa-info';
import { getAllQaType } from '../../api/qa/qa-type';

export default {
  name: 'qa-info-page',
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
      amountTypes: [],
      trueVal: 1,
      falseVal: 0,
      qaTypes: [],
      selectedIds: [],
      loading: {
        table: true
      },
      tableData: [],
      queryModel: {
        tyepId: null,
        title: null,
        username: null,
        createTime: null,
        amountType: null,
        top: null,
        countryName: null
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
      this.dialog.picPreview.picSrc = picSrc
      this.dialog.picPreview.show = true
    },
    showVideoPreviewDialog(url) {
      this.dialog.videoPreview.videoSrc = url
      this.dialog.videoPreview.show = true
    },
    amountType2Name(value) {
      if (this.amountTypes && this.amountTypes.length > 0) {
        return this.amountTypes.find(item => item.type === value).name;
      }
      return '';
    },
    doUpdateCheckStatus(row) {
      this.$confirm(
        '将[' +
          row.title +
          ']设置为审核不通过?(审核不通过的问答将不会在APP中展示)',
        '修改审核状态',
        {
          type: 'warning'
        }
      )
        .then(() => {
          updateCheckStatus(row.infoId)
            .then(data => {
              this.$message.success('操作成功');
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
    doUpdateTop(row) {
      let newTopState = !row.top;

      let msg =
        '确认将[' +
        row.title +
        ']' +
        (newTopState === true ? '置顶?' : '取消置顶?');

      this.$confirm(msg, '修改置顶设置')
        .then(() => {
          updateTopSetting(row.infoId)
            .then(({ data }) => {
              this.$message.success(
                newTopState === true ? '置顶成功' : '取消置顶成功'
              );
              this.getTableData();
            })
            .catch(msg => {});
        })
        .catch(() => {});
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
      getQaInfoList({
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
    initQaTypeSelectData() {
      getAllQaType()
        .then(({ data }) => {
          this.qaTypes = data.list;
        })
        .catch(msg => {});
    },
    initQaAmountTypeSelectData() {
      getAllAmountType().then(({ data }) => {
        this.amountTypes = data.list;
      });
    }
  },
  created() {
    this.initQaAmountTypeSelectData();
    this.initQaTypeSelectData();
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
  width: 40%
}
</style>
