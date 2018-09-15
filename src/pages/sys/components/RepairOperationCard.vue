<template>
  <el-card class="box-card">
    <div slot="header">
      <span class="repair-title">{{ title }}</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="onBtnClick" :loading="btnLoading">开始修复</el-button>
    </div>
    <div>
      <p class="repair-desc">{{ desc }}</p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'repair-operation-card',

  data() {
    return {
      btnLoading: false
    };
  },

  props: {
    title: {
      required: true,
      type: String
    },
    onRepairBtnClick: {
      required: true,
      type: Function
    },
    desc: {
      required: true,
      type: String
    }
  },

  methods: {
    onBtnClick() {
      this.btnLoading = true;
      this.onRepairBtnClick(this.title, this.desc, () => {
        this.btnLoading = false;
      });
    }
  }
};
</script>

<style scoped>
.box-card {
  width: 400px;
  float: left;
  margin-left: 10px;
  margin-top: 15px;
}
.repair-desc {
  color: gray;
}
.repair-title {
  font-weight: bolder;
}
</style>
