<template>
  <div>
    <i class="fa fa-arrows-alt screenfull-icon" @click="click"></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'screenfull',
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
.screenfull-icon {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 15px;
  height: 15px;
  vertical-align: center;
}
</style>
