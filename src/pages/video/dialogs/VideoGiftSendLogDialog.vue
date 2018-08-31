<template>
  <el-dialog :title="`视频收礼记录`" width="1500px" :visible.sync="show" :close-on-click-modal="false">
    <div :data="totalData">
      <h2 >赠送礼物总金额为:{{totalData.totalGiftMoney}}</h2><br/>
      <h2 >赠送人：<template v-for="username in totalData.allUserName">{{username}}</template></h2><br/>
    </div>
     <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="sendId" label="ID" sortable="custom" width="80"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="giftName" label="礼品名称" width="150"></el-table-column>
      <el-table-column prop="giftImg" label="礼品图片"  width="180">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="点击查看大图" placement="top">
            <img :src="scope.row.giftImg" class="gift-img-thumb" @click="showPicPreviewDialog(scope.row)">
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="礼品单价" sortable="custom" width="115"></el-table-column>
      <el-table-column prop="numbers" label="礼品数量" sortable="custom" width="115"></el-table-column>
      <el-table-column prop="videoId" label="视频ID" width="80"></el-table-column>
      <el-table-column prop="recverNickname" label="收礼人昵称" width="120"></el-table-column>
      <el-table-column prop="recverUserId" label="收礼人ID" width="120"></el-table-column>
      <el-table-column prop="createTime" label="赠送时间" sortable="custom" width="180"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="onSizeChange" @current-change="onCurrentPageChange" :current-page="pager.page" :page-sizes="[10, 20, 30]" :page-size="pager.limit" layout="total, sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <el-dialog :visible.sync="dialog.picPreview.show" :title="`礼品图片预览: ${dialog.picPreview.giftName}`">
      <img :src="dialog.picPreview.picSrc" class="img-preview" />
    </el-dialog>
    <span slot="footer">
      <el-button @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getVideoGiftSendList } from '../../../api/video/video-gift-send';
import { getTotalDataByVideoId } from '../../../api/video/video-gift-send';

export default {
  name: 'video-gift-send-page',
  data() {
    return {
      show: false,
      dialog: {
        picPreview: {
          giftName: '',
          show: false,
          picSrc: null
        }
      },
      loading: {
        table: true
      },
      tableData: [],
      totalData: {
        allUserName: [],
        totalGiftMoney: null
      },
      queryModel: {
        videoId: null,
        userId: null,
        nickname: null,
        username: null,
        giftIds: null,
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
    showDialog(row) {
      this.queryModel.videoId = row.videoId;
      this.show = true;
      this.loading = true;
      this.getTableData();
      getTotalDataByVideoId(row.videoId)
        .then(({ data }) => {
          this.totalData.totalGiftMoney = data.detail.totalGiftMoney;
          this.totalData.allUserName = data.detail.allUserName;
          console.log(this.totalData)
        })
        .catch(error => {});
    },
    showPicPreviewDialog(row) {
      this.dialog.picPreview.picSrc = row.giftImg;
      this.dialog.picPreview.giftName = row.giftName;
      this.dialog.picPreview.show = true;
    },
    query() {
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
      getVideoGiftSendList({
        query: this.queryModel,
        pager: this.pager,
        sorter: this.sorter
      })
        .then(({ data }) => {
          this.tableData = data.page.list;
          this.pager.total = data.page.totalCount;
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
</style>
