<template>
  <el-menu :default-active="activeRoutePath" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true" :unique-opened="true">
    <el-menu-item index="/dashboard">
      <i class="fa fa-dashboard"></i>
      <span>仪表盘</span>
    </el-menu-item>
    <template v-for="(level1Menu, level1Index) in menus">
      <!-- 一级菜单 -->
      <el-submenu :index="level1Index + ''" :key="level1Index">
        <!-- 一级菜单名称 -->
        <template slot="title">
          <i :class="level1Menu.icon"></i>
          <span>{{level1Menu.name}}</span>
        </template>
        <!-- 二级菜单 -->
        <template v-for="(level2Menu, level2Index) in level1Menu.list">
          <!-- 二级菜单名称 -->
          <el-menu-item :index="level2Menu.url" :key="level2Index" v-if="checkMenuPermission(level2Menu.perms)">
            <template slot="title">
              <i :class="level2Menu.icon"></i>
              <span>{{level2Menu.name}}</span>
            </template>
          </el-menu-item>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { isNotEmptyStr } from '../utils/coding-utils';

export default {
  name: 'side-bar',
  data() {
    return {};
  },
  methods: {
    checkMenuPermission(permStr) {
      if (!isNotEmptyStr(permStr)) {
        return true;
      }

      let menuPerms;

      if (permStr.indexOf(',') !== -1) {
        menuPerms = [].concat(permStr.split(','));
      } else {
        menuPerms = [].concat(permStr);
      }

      for (let index = 0; index < menuPerms.length; index++) {
        const element = menuPerms[index];
        if (this.userPermissions.indexOf(element) === -1) {
          return false;
        }
      }

      return true;
    }
  },
  computed: {
    userPermissions() {
      return this.$store.state.user.permissions;
    },
    activeRoutePath() {
      return this.$route.path;
    },
    menus() {
      return this.$store.state.sys.menus;
    }
  }
};
</script>

<style scoped>
/*修复侧边导航栏菜单项及子菜单项width相差1px的问题*/
.el-menu .el-menu-item {
  width: 250px;
}
.el-submenu {
  width: 250px;
}
</style>
