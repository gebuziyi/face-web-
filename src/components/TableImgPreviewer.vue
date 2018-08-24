<template>
  <div>
    <el-tooltip content="点击查看大图" effect="dark" placement="top">
      <img :src="option.thumbImgSrc ? option.thumbImgSrc : option.imgSrc" class="img-thumb" @click="showPicPreviewDialog()">
    </el-tooltip>
    <el-dialog :visible.sync="show" :title="option.title ? option.title : '图片预览'" width="800px">
      <img :src="option.bigImgSrc ?  option.bigImgSrc : option.imgSrc " class="img-preview" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'table-img-previewer',

  data() {
    return {
      show: false
    };
  },

  props: {
    option: {
      type: Object,
      required: true
    }
  },

  methods: {
    showPicPreviewDialog() {
      this.show = true;
    }
  }
};
</script>

<style scoped>
.img-thumb {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  cursor: pointer;
}

.img-preview {
  display: block;
  margin: auto auto;
  max-width: 600px;
  max-height: 600px;
}
</style>
