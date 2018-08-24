<template>
  <el-tag :type="type" :size="size">
    <slot></slot>
    <i :class="iconClass" style="padding-left: 0.25em"></i>
  </el-tag>
</template>

<script>
const typeIconMapping = {
  success: 'fa fa-check',
  warning: 'fa fa-exclamation-triangle',
  info: 'fa fa-info',
  danger: 'fa fa-times'
}
export default {
  name: 'icon-tag',
  data() {
    return {}
  },
  props: {
    type: {
      type: String,
      default: 'info'
    },
    size: {
      type: String,
      default: 'mini'
    },
    icon: {
      type: String,
      default: null
    }
  },
  computed: {
    iconClass() {
      return this.icon ? this.icon : typeIconMapping[this.type]
    }
  }
}
</script>
