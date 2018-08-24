<template>
  <el-breadcrumb separator="/">
    <!-- 一级菜单 -->
    <el-breadcrumb-item>
      <i :class="level1.icon"></i>
      <span>{{ level1.title }}</span>
    </el-breadcrumb-item>
    <!-- 二级菜单 -->
    <el-breadcrumb-item>
      <i :class="level2.icon"></i>
      <span>{{ level2.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { BREADCRUMB_IGNORE_PATHS } from '../../utils/constants'

export default {
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      level1: {
        icon: 'fa fa-home',
        title: '首页'
      },
      level2: {
        icon: '',
        title: '',
        parentId: null
      }
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    getBreadcrumb() {
      let delay;
      if (
        this.$store.state.sys.menus &&
        this.$store.state.sys.menus.length > 0
      ) {
        delay = 0;
      } else {
        delay = 1000;
      }
      setTimeout(() => {
        if (BREADCRUMB_IGNORE_PATHS.indexOf(this.$route.path) !== -1) {
          this.level1 = {
            icon: 'fa fa-home',
            title: '首页'
          };
          this.level2 = {
            icon: 'fa fa-dashboard',
            title: '仪表盘'
          };
        } else {
          this.level2 = this.$store.getters.getCurrentMenu(this.$route.path);
          this.level1 = this.$store.getters.getParentMenu(this.level2.parentId);
        }
      }, delay);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
