<template>
  <el-dialog :visible.sync="show" :title="`${dialog.detail.model.nickName}, ${dialog.detail.model.createTime} 举报朋友圈详情: `" width="1000px">
    <div v-loading="dialog.detail.loading" class="create-form-wrapper">

      <el-form size="small" :model="dialog.detail.model" label-position="left" label-width="150px" ref="infoForm">
        <el-form-item label="朋友圈类型：">
          <span class="detail-span" v-if="dialog.detail.model.type ===1" >图片</span>
          <span class="detail-span" v-if="dialog.detail.model.type ===2" >视频</span>
          <span class="detail-span" v-if="dialog.detail.model.type ===3" >纯文字</span>
        </el-form-item>
        <el-form-item label="被举报人ID：">
          <span class="detail-span" v-text="dialog.detail.model.userId "></span>
        </el-form-item>
        <el-form-item label="被举报人昵称：">
          <span class="detail-span" v-text="dialog.detail.model.nickName" ></span>
        </el-form-item>
        <el-form-item label="被举报的时间：">
          <span class="detail-span" v-text="dialog.detail.model.createTime" ></span>
        </el-form-item>
        <el-form-item label="被举报朋友圈ID：">
          <span class="detail-span" v-text="dialog.detail.model.friendId" ></span>
        </el-form-item>
          <el-form-item label="文字内容">
            <span class="detail-span" v-text="dialog.detail.model.content" v-if="dialog.detail.content !== ''"></span>
            <el-tag type="warning" size="mini" v-else>无文字内容</el-tag>
          </el-form-item>
          <!-- 轮播图 -->
          <el-form-item label="图片列表" v-if="dialog.detail.model.type === 1">
            <el-carousel :interval="4000" height="450px">
              <el-carousel-item v-for="(item, index) in dialog.detail.model.fileList" :key="index" class="pic-bg">
                <img :src="item.fileUrl" class="friend-ring-pic-item" />
              </el-carousel-item>
            </el-carousel>
          </el-form-item>
          <el-form-item label="视频文件" v-if="dialog.detail.model.type === 2">
            <video :src="dialog.detail.model.fileList[0]" class="friend-ring-video-item" controls />
          </el-form-item>
          </el-form>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="show = false" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import
{
  getFriendRingdetail
} from '../../../api/basic-data/report-info';
export default {
  data() {
    return {
      msg: null,
      show: false,
      loading: false,
      formLoading: true,
      btnLoading: false,
      dialog: {
        detail: {
          model: {
            fileList: [],
            userId: null,
            nickName: null,
            content: null,
            createTime: null,
            friendId: null,
            img: null,
            url: null,
            type: null
          }
        }
      }
    };
  },
  methods: {
    openDetailDialog(row) {
      this.show = true;
      this.dialog.detail.formLoading = true;
      getFriendRingdetail(row.infoId).then(({ data }) => {
        this.dialog.detail.model = data.detail;
        this.dialog.detail.model.formLoading = false;
        // type = 3为纯文字, 无需获取文件列表
      });
    }
  }
};
</script>

<style scoped>
.vide-report-item {
  display: block;
  margin: auto auto;
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 600px;
}
.assistant-msg {
  margin-left: 4em;
}
.detail-span {
  font-weight: 500;
  font-size: 16px;
}
.pic-bg {
  background-color: gray;
}
.friend-ring-pic-item {
  display: block;
  margin: auto auto;
  height: 100%;
  max-height: 450px;
}
.friend-ring-video-item {
  display: block;
  margin: auto auto;
  width: 100%;
  max-width: 400px;
}
</style>
